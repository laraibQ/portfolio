/**
 * Reports which element is the LCP and when each candidate landed, under the
 * same throttling Lighthouse applies. Lighthouse only tells you the score;
 * this tells you what to fix.
 *
 * Usage:  node scripts/diagnose-lcp.mjs [route]
 */
import puppeteer from "puppeteer-core";
import { BASE_URL, findChrome, heading, requireServer } from "./lib/audit-env.mjs";

const route = process.argv[2] ?? "/";

await requireServer();
const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true });

  const client = await page.createCDPSession();
  await client.send("Network.enable");
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });

  await page.evaluateOnNewDocument(() => {
    window.__lcp = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__lcp.push({
          startTime: Math.round(entry.startTime),
          size: entry.size,
          url: entry.url || null,
          tag: entry.element?.tagName ?? null,
          className: entry.element?.className?.toString().slice(0, 90) ?? null,
          text: entry.element?.textContent?.trim().slice(0, 60) ?? null,
        });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });

    window.__paints = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__paints.push({ name: entry.name, startTime: Math.round(entry.startTime) });
      }
    }).observe({ type: "paint", buffered: true });
  });

  await page.goto(`${BASE_URL}${route}`, { waitUntil: "load" });
  await new Promise((resolve) => setTimeout(resolve, 9000));

  const { lcp, paints, resources } = await page.evaluate(() => ({
    lcp: window.__lcp,
    paints: window.__paints,
    resources: performance
      .getEntriesByType("resource")
      .filter((entry) => ["css", "script", "link", "img", "image"].includes(entry.initiatorType))
      .sort((a, b) => a.startTime - b.startTime)
      .slice(0, 20)
      .map((entry) => ({
        name: entry.name.replace(location.origin, "").slice(0, 84),
        type: entry.initiatorType,
        kb: Math.round((entry.transferSize || entry.encodedBodySize) / 1024),
        start: Math.round(entry.startTime),
        end: Math.round(entry.responseEnd),
      })),
  }));

  heading(`LCP diagnosis · ${BASE_URL}${route} · mobile throttling`);

  for (const paint of paints) console.log(`  ${paint.name.padEnd(24)} ${paint.startTime}ms`);

  console.log("\n  LCP candidates (last one wins):");
  for (const candidate of lcp) {
    console.log(
      `    ${String(candidate.startTime).padStart(5)}ms  ${candidate.tag}  size=${candidate.size}`,
    );
    if (candidate.url) console.log(`             url: ${candidate.url.slice(-70)}`);
    if (candidate.text) console.log(`             text: ${candidate.text}`);
    if (candidate.className) console.log(`             class: ${candidate.className}`);
  }

  console.log("\n  Slowest resources by finish time:");
  for (const resource of resources) {
    console.log(
      `    ${String(resource.end).padStart(5)}ms  ${String(resource.kb).padStart(4)}KB  ${resource.type.padEnd(6)} ${resource.name}`,
    );
  }
} finally {
  await browser.close();
}
