/**
 * Lighthouse against the production build. Reports category scores plus the
 * metrics that move them, and writes full HTML reports to .audit/.
 *
 * Each run gets a fresh browser: reusing one across runs produced intermittent
 * NO_NAVSTART trace failures, which surface as a score of 0 and look like a
 * catastrophic regression rather than a harness problem.
 *
 * Throttled mobile numbers are noisy on a loaded developer machine, so results
 * are the median of AUDIT_RUNS passes (default 3, per Lighthouse's own guidance).
 *
 * Usage:  npm run build && npm start   (in another terminal)
 *         npm run audit:lighthouse
 */
import { mkdirSync, writeFileSync } from "node:fs";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { BASE_URL, findChrome, heading, requireServer } from "./lib/audit-env.mjs";

const PASSES = Number(process.env.AUDIT_RUNS ?? 3);

const ALL_RUNS = [
  { name: "home", route: "/", formFactor: "mobile" },
  { name: "home", route: "/", formFactor: "desktop" },
  { name: "work", route: "/work", formFactor: "mobile" },
  { name: "work", route: "/work", formFactor: "desktop" },
];

// AUDIT_ONLY=home:mobile narrows the loop while iterating on a single fix.
const RUNS = process.env.AUDIT_ONLY
  ? ALL_RUNS.filter((run) => `${run.name}:${run.formFactor}` === process.env.AUDIT_ONLY)
  : ALL_RUNS;

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

/**
 * Guardrails set from measured medians on this machine under Lighthouse's
 * Slow-4G + 4× CPU mobile profile. Desktop clears 90 easily; mobile performance
 * is capped by that synthetic throttle (field metrics on a real mid-range phone
 * over typical Wi-Fi will read higher). Accessibility/SEO/Best Practices must
 * stay at 100 — those are not throttle-dependent.
 */
const THRESHOLDS = {
  mobile: {
    performance: 0.7,
    accessibility: 1,
    "best-practices": 1,
    seo: 1,
  },
  desktop: {
    performance: 0.9,
    accessibility: 1,
    "best-practices": 1,
    seo: 1,
  },
};

const DESKTOP_CONFIG = {
  formFactor: "desktop",
  screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1 },
  throttling: {
    rttMs: 40,
    throughputKbps: 10 * 1024,
    cpuSlowdownMultiplier: 1,
    requestLatencyMs: 0,
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0,
  },
};

/** Lighthouse nests node details differently per audit version, so search for it. */
function findNode(value) {
  if (!value || typeof value !== "object") return null;
  if (value.type === "node" && (value.selector || value.nodeLabel)) return value;
  for (const child of Object.values(value)) {
    const found = findNode(child);
    if (found) return found;
  }
  return null;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

async function runOnce(run) {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const result = await lighthouse(`${BASE_URL}${run.route}`, {
      port: Number(new URL(browser.wsEndpoint()).port),
      output: "html",
      logLevel: "error",
      onlyCategories: CATEGORIES,
      ...(run.formFactor === "desktop" ? DESKTOP_CONFIG : {}),
    });
    if (!result) throw new Error("Lighthouse returned no result");
    return result;
  } finally {
    await browser.close();
  }
}

mkdirSync(".audit", { recursive: true });
await requireServer();

const failures = [];

for (const run of RUNS) {
  heading(`Lighthouse · ${run.name} · ${run.formFactor} · median of ${PASSES}`);

  const results = [];
  for (let pass = 0; pass < PASSES; pass += 1) {
    const result = await runOnce(run);
    const code = result.lhr.runtimeError?.code;
    if (code && code !== "NO_ERROR") {
      console.log(`  (pass ${pass + 1} discarded: ${code})`);
      continue;
    }
    results.push(result);
  }

  if (results.length === 0) {
    console.log("  ERROR  every pass failed to collect a trace");
    failures.push(`${run.name}/${run.formFactor}: no usable pass`);
    continue;
  }

  const scores = {};
  for (const key of CATEGORIES) {
    scores[key] = median(results.map((r) => r.lhr.categories[key].score ?? 0));
    const threshold = THRESHOLDS[run.formFactor][key];
    const status = scores[key] >= threshold ? "PASS" : "FAIL";
    console.log(
      `  ${status}  ${results[0].lhr.categories[key].title.padEnd(15)}` +
        `${Math.round(scores[key] * 100).toString().padStart(4)}   (min ${Math.round(threshold * 100)})`,
    );
    if (scores[key] < threshold) {
      failures.push(
        `${run.name}/${run.formFactor} ${key}: ${Math.round(scores[key] * 100)} < ${Math.round(threshold * 100)}`,
      );
    }
  }

  const metric = (id) => median(results.map((r) => r.lhr.audits[id]?.numericValue ?? 0));
  console.log(
    `        LCP ${(metric("largest-contentful-paint") / 1000).toFixed(1)}s` +
      ` · TBT ${Math.round(metric("total-blocking-time"))}ms` +
      ` · CLS ${metric("cumulative-layout-shift").toFixed(3)}` +
      ` · FCP ${(metric("first-contentful-paint") / 1000).toFixed(1)}s`,
  );

  // Keep the median pass's report so the numbers above are traceable to a file.
  const representative =
    results.find(
      (r) => (r.lhr.categories.performance.score ?? 0) === scores.performance,
    ) ?? results[0];
  const { report } = representative;
  writeFileSync(
    `.audit/lighthouse-${run.name}-${run.formFactor}.html`,
    Array.isArray(report) ? report[0] : report,
  );

  const audits = representative.lhr.audits;

  // Which element is the LCP matters more than the number: an entrance animation
  // on it delays LCP until hydration finishes, which no image tuning can fix.
  const lcpNode = findNode(audits["largest-contentful-paint-element"]?.details);
  if (lcpNode) {
    console.log(`        LCP element  ${(lcpNode.nodeLabel ?? "").split("\n")[0]}`.trimEnd());
    console.log(`                     ${lcpNode.selector ?? ""}`.trimEnd());
  }

  const opportunities = Object.values(audits)
    .filter(
      (audit) =>
        audit.details?.type === "opportunity" &&
        (audit.numericValue ?? 0) > 100 &&
        audit.score !== null &&
        audit.score < 0.9,
    )
    .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0));
  for (const opportunity of opportunities.slice(0, 5)) {
    console.log(`        OPPORTUNITY  ${opportunity.title} — ${opportunity.displayValue ?? ""}`);
  }

  for (const key of CATEGORIES) {
    for (const ref of representative.lhr.categories[key].auditRefs) {
      const audit = audits[ref.id];
      if (audit && audit.score !== null && audit.score < 1 && audit.scoreDisplayMode === "binary") {
        console.log(`        FAILED AUDIT  ${audit.id} — ${audit.title}`);
      }
    }
  }
}

heading(
  failures.length === 0
    ? "All categories met their thresholds. Reports in .audit/"
    : `Below threshold:\n  ${failures.join("\n  ")}`,
);
process.exit(failures.length === 0 ? 0 : 1);
