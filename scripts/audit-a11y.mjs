/**
 * Runs axe-core against every route in both themes, including states that only
 * exist after interaction — a static scan of the initial paint would miss the
 * form's error styling and the non-default filter tab entirely.
 *
 * Usage:  npm run build && npm start   (in another terminal)
 *         npm run audit:a11y
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";
import { BASE_URL, findChrome, heading, requireServer } from "./lib/audit-env.mjs";

const axeSource = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);

/*
 * best-practice is included deliberately. Restricting this to the WCAG tags let
 * a real heading-order break on /work through, because axe files that rule under
 * best-practice rather than under WCAG.
 */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

const SCENARIOS = [
  { name: "home", route: "/" },
  {
    name: "home · contact form showing validation errors",
    route: "/",
    async prepare(page) {
      await page.click('form button[type="submit"]');
      await page.waitForSelector('[aria-invalid="true"]', { timeout: 5000 });
    },
  },
  { name: "work", route: "/work" },
  {
    name: "work · non-default filter selected",
    route: "/work",
    async prepare(page) {
      const tabs = await page.$$('[role="tab"]');
      if (tabs.length > 2) await tabs[2].click();
      await new Promise((resolve) => setTimeout(resolve, 600));
    },
  },
];

async function scan(browser, scenario, theme) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  // The app defaults to dark unless the OS asks for light, so emulating the
  // media feature exercises the real code path without touching localStorage.
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: theme },
  ]);

  await page.goto(`${BASE_URL}${scenario.route}`, { waitUntil: "networkidle0" });
  if (scenario.prepare) await scenario.prepare(page);
  // Let entrance animations settle; mid-flight opacity confuses contrast checks.
  await new Promise((resolve) => setTimeout(resolve, 900));

  const appliedTheme = await page.evaluate(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  if (appliedTheme !== theme) {
    throw new Error(
      `Expected ${theme} theme for "${scenario.name}" but the document is ${appliedTheme}.`,
    );
  }

  await page.evaluate(axeSource);
  const results = await page.evaluate(
    async (tags) =>
      await window.axe.run(document, { runOnly: { type: "tag", values: tags } }),
    WCAG_TAGS,
  );

  await page.close();
  return results;
}

const browser = await (async () => {
  await requireServer();
  return puppeteer.launch({
    executablePath: findChrome(),
    headless: "shell",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
})();

let totalViolations = 0;

try {
  heading(`axe-core · WCAG 2.1 A/AA + best practice · ${BASE_URL}`);

  for (const scenario of SCENARIOS) {
    for (const theme of ["dark", "light"]) {
      const { violations, passes, incomplete } = await scan(browser, scenario, theme);
      const label = `${scenario.name} [${theme}]`;

      if (violations.length === 0) {
        console.log(`  PASS  ${label} — ${passes.length} checks passed`);
      } else {
        totalViolations += violations.length;
        console.log(`  FAIL  ${label}`);
        for (const violation of violations) {
          console.log(`        [${violation.impact}] ${violation.id} — ${violation.help}`);
          console.log(`        ${violation.helpUrl}`);
          for (const node of violation.nodes.slice(0, 4)) {
            console.log(`          at ${node.target.join(" ")}`);
            const detail = node.failureSummary?.split("\n").filter(Boolean) ?? [];
            for (const line of detail) console.log(`             ${line.trim()}`);
          }
          if (violation.nodes.length > 4) {
            console.log(`          ...and ${violation.nodes.length - 4} more nodes`);
          }
        }
      }

      // Reported but not failed: axe could not decide, usually needing human review.
      const needsReview = incomplete.filter((item) => item.nodes.length > 0);
      for (const item of needsReview) {
        console.log(`        NEEDS REVIEW  ${item.id} (${item.nodes.length} nodes)`);
        if (!process.env.AUDIT_VERBOSE) continue;
        for (const node of item.nodes.slice(0, 8)) {
          const reason = node.any?.[0]?.message ?? node.all?.[0]?.message ?? "";
          console.log(`          at ${node.target.join(" ")}`);
          if (reason) console.log(`             ${reason.split("\n")[0].trim()}`);
        }
      }
    }
  }
} finally {
  await browser.close();
}

heading(
  totalViolations === 0
    ? "No WCAG 2.1 A/AA violations found."
    : `${totalViolations} violation group(s) found.`,
);
process.exit(totalViolations === 0 ? 0 : 1);
