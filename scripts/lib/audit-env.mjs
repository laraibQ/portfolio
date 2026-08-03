import { existsSync } from "node:fs";

export const BASE_URL = (
  process.env.AUDIT_BASE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA ?? ""}/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

/** Uses an installed browser rather than downloading one, so CI stays lean. */
export function findChrome() {
  const found = CHROME_CANDIDATES.find(
    (path) => path && existsSync(path.replaceAll("/", process.platform === "win32" ? "\\" : "/")),
  );
  if (!found) {
    throw new Error(
      "No Chromium-based browser found. Set CHROME_PATH to a Chrome or Edge executable.",
    );
  }
  return found;
}

/** Fails with instructions rather than a stack trace when the server is down. */
export async function requireServer(url = BASE_URL) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status < 500) return;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(
    `No server responding at ${url}.\nStart one first:  npm run build && npm start`,
  );
}

export function heading(text) {
  console.log(`\n${"=".repeat(70)}\n${text}\n${"=".repeat(70)}`);
}
