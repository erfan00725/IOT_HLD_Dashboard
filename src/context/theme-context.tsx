"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Reads the initial theme synchronously from localStorage / system preference.
 * Called once during component initialisation — safe because ThemeProvider
 * is a Client Component and this only runs in the browser.
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Applies or removes the `dark` class on <html> and persists to localStorage.
 * Called immediately so there is no flash between state set and class change.
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}

/**
 * ThemeProvider manages dark/light state and keeps the <html> `dark` class
 * in sync. Wrap the app root with this component.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialise from localStorage / system preference synchronously
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Keep <html> class and localStorage in sync whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      // Apply immediately (before next render) to avoid any visual lag
      applyTheme(next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDark: theme === "dark" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook to consume the ThemeContext — must be used inside a ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
