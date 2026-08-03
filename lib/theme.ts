export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * The document element is the single source of truth for the active theme:
 * the inline script in `app/layout.tsx` sets it before first paint, so React
 * never needs to hold theme state and can never hydrate out of sync with it.
 */
export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    // Blocked storage (Safari private mode, embedded webviews) throws on access.
    return null;
  }
}

/** Dark is the brand default; only an explicit light system preference overrides it. */
export function resolveTheme(): Theme {
  const stored = readStoredTheme();
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Preference is lost on reload, but the current session still switches.
  }
}

export function toggleTheme() {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
}

/**
 * Keeps this tab in sync with other tabs and with OS-level changes.
 * Returns a cleanup function so callers can pass it straight to `useEffect`.
 */
export function subscribeToExternalThemeChanges(): () => void {
  const media = window.matchMedia("(prefers-color-scheme: light)");

  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(resolveTheme());
  };

  const onSystemChange = () => {
    // An explicit user choice always outranks the OS preference.
    if (readStoredTheme()) return;
    applyTheme(resolveTheme());
  };

  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onSystemChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystemChange);
  };
}

/**
 * Runs before hydration to prevent a flash of the wrong theme. Kept here so it
 * cannot drift from `resolveTheme` above.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}})();`;
