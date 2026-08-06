/**
 * `NEXT_PUBLIC_*` values are inlined at build time, so the origin must be set
 * before `npm run build` — setting it only for `npm start` has no effect on the
 * prerendered sitemap, robots.txt or canonical tags.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  // Provided automatically by Vercel, so production is correct without config.
  const hostProvided = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (hostProvided) return `https://${hostProvided.replace(/\/+$/, "")}`;

  // Keeps local builds and CI deterministic.
  return "http://localhost:3000";
}

/** Single source of truth for site-level metadata, reused by layout, sitemap and robots. */
export const site = {
  name: "Laraib Mujahid",
  title: "Laraib Mujahid — Website Designer · Automation Builder",
  shortDescription: "Website Designer & Automation Builder",
  description:
    "Website Designer and Automation Builder specializing in WordPress, Elementor, Figma-to-code builds, Shopify, and n8n workflows for international clients.",
  url: resolveSiteUrl(),
  locale: "en_US",
} as const;

export const routes = ["/", "/work"] as const;
