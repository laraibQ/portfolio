import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  currentTheme,
  readStoredTheme,
  resolveTheme,
  setTheme,
  subscribeToExternalThemeChanges,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  toggleTheme,
} from "@/lib/theme";

const realMatchMedia = window.matchMedia;

function mockSystemPrefersLight(prefersLight: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: prefersLight,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
  document.documentElement.style.colorScheme = "";
  mockSystemPrefersLight(false);
});

afterEach(() => {
  window.matchMedia = realMatchMedia;
  vi.restoreAllMocks();
});

describe("currentTheme", () => {
  it("reads the active theme from the document element, not from storage", () => {
    document.documentElement.classList.add("dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");

    expect(currentTheme()).toBe("dark");
  });
});

describe("applyTheme", () => {
  it("toggles the dark class and the native color-scheme hint", () => {
    applyTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");

    applyTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light");
  });
});

describe("setTheme", () => {
  it("persists the choice so it survives a reload", () => {
    setTheme("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("still switches the theme when storage is unavailable", () => {
    // Spying on the prototype rather than the instance: jsdom's localStorage is
    // a proxy and does not surface own-property overrides to callers.
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("storage blocked");
      });

    expect(() => setTheme("dark")).not.toThrow();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(setItem).toHaveBeenCalled();
  });
});

describe("toggleTheme", () => {
  it("flips between the two themes", () => {
    applyTheme("dark");

    toggleTheme();
    expect(currentTheme()).toBe("light");

    toggleTheme();
    expect(currentTheme()).toBe("dark");
  });
});

describe("resolveTheme", () => {
  it("prefers an explicitly stored choice over the system setting", () => {
    mockSystemPrefersLight(true);
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    expect(resolveTheme()).toBe("dark");
  });

  it("uses the system setting when nothing is stored", () => {
    mockSystemPrefersLight(true);
    expect(resolveTheme()).toBe("light");
  });

  it("defaults to dark when the system expresses no light preference", () => {
    mockSystemPrefersLight(false);
    expect(resolveTheme()).toBe("dark");
  });

  it("ignores a corrupted stored value", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "purple");

    expect(readStoredTheme()).toBeNull();
    expect(resolveTheme()).toBe("dark");
  });
});

describe("subscribeToExternalThemeChanges", () => {
  it("applies a theme chosen in another tab", () => {
    const unsubscribe = subscribeToExternalThemeChanges();
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    window.dispatchEvent(
      new StorageEvent("storage", { key: THEME_STORAGE_KEY, newValue: "dark" }),
    );
    expect(currentTheme()).toBe("dark");

    unsubscribe();
  });

  it("ignores storage events for unrelated keys", () => {
    const unsubscribe = subscribeToExternalThemeChanges();
    applyTheme("light");

    window.dispatchEvent(
      new StorageEvent("storage", { key: "cart", newValue: "dark" }),
    );
    expect(currentTheme()).toBe("light");

    unsubscribe();
  });

  it("returns a cleanup function that detaches its listeners", () => {
    const unsubscribe = subscribeToExternalThemeChanges();
    unsubscribe();
    applyTheme("light");

    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    window.dispatchEvent(
      new StorageEvent("storage", { key: THEME_STORAGE_KEY, newValue: "dark" }),
    );

    expect(currentTheme()).toBe("light");
  });
});

describe("THEME_INIT_SCRIPT", () => {
  it("references the same storage key the runtime uses", () => {
    expect(THEME_INIT_SCRIPT).toContain(`"${THEME_STORAGE_KEY}"`);
  });

  it("falls back to dark inside its catch block", () => {
    expect(THEME_INIT_SCRIPT).toContain('classList.add("dark")');
  });
});
