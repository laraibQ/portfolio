import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Resolves the "@/*" aliases from tsconfig.json natively.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    // Rendering a motion-heavy tree in jsdom is slow on cold CI runners; the
    // default 5s is close enough to the real cost to cause false failures.
    testTimeout: 20_000,
  },
});
