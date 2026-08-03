import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL = { ...process.env };

async function loadSite(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  return (await import("@/lib/site")).site;
}

afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe("site.url", () => {
  it("uses the explicit origin when provided", async () => {
    const site = await loadSite({
      NEXT_PUBLIC_SITE_URL: "https://laraib.dev",
      VERCEL_PROJECT_PRODUCTION_URL: undefined,
    });
    expect(site.url).toBe("https://laraib.dev");
  });

  it("strips trailing slashes so joined paths cannot double up", async () => {
    const site = await loadSite({
      NEXT_PUBLIC_SITE_URL: "https://laraib.dev///",
      VERCEL_PROJECT_PRODUCTION_URL: undefined,
    });
    expect(site.url).toBe("https://laraib.dev");
    expect(`${site.url}/work`).toBe("https://laraib.dev/work");
  });

  it("falls back to the host-provided production URL", async () => {
    const site = await loadSite({
      NEXT_PUBLIC_SITE_URL: undefined,
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
    });
    expect(site.url).toBe("https://portfolio.vercel.app");
  });

  it("prefers the explicit origin over the host-provided one", async () => {
    const site = await loadSite({
      NEXT_PUBLIC_SITE_URL: "https://laraib.dev",
      VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
    });
    expect(site.url).toBe("https://laraib.dev");
  });

  it("falls back to localhost so local builds stay deterministic", async () => {
    const site = await loadSite({
      NEXT_PUBLIC_SITE_URL: undefined,
      VERCEL_PROJECT_PRODUCTION_URL: undefined,
    });
    expect(site.url).toBe("http://localhost:3000");
  });
});
