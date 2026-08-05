"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { subscribeToExternalThemeChanges, toggleTheme } from "@/lib/theme";

/**
 * Renders theme state from the `dark` class on <html> — no React theme state,
 * no hydration flash. Hover/press feedback is CSS so Framer stays off this path.
 */
export default function ThemeToggle() {
  useEffect(() => subscribeToExternalThemeChanges(), []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      className="relative inline-flex h-9 w-[3.25rem] items-center rounded-full border border-line bg-panel px-1 backdrop-blur-md transition-transform hover:scale-105 hover:border-accent/40 active:scale-95 before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']"
    >
      <span className="inline-flex size-7 translate-x-0 items-center justify-center rounded-full bg-accent text-dark shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_55%,transparent)] transition-transform duration-300 ease-out dark:translate-x-4">
        <Sun className="hidden size-3.5 dark:block" strokeWidth={2} />
        <Moon className="block size-3.5 dark:hidden" strokeWidth={2} />
      </span>
    </button>
  );
}
