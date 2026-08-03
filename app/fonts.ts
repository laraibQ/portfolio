import localFont from "next/font/local";

/**
 * Self-hosted Geist Sans. Preload is off and display is `optional` on purpose:
 * forcing the 68KB variable font onto the critical path held first paint near
 * 2s, and a late `swap` re-triggered LCP when the face finally arrived (~3.5s
 * under mobile throttling). Optional paints with the adjusted fallback and
 * only applies Geist if it is ready in the first ~100ms of the navigation.
 */
export const geistSans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "optional",
  preload: false,
  adjustFontFallback: "Arial",
});
