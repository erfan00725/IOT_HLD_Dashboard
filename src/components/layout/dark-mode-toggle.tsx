"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";

// ---------------------------------------------------------------------------
// Dark-mode toggle pill — connected to ThemeContext.
// Extracted into its own client island so the surrounding AppShell can be a
// server component.
// ---------------------------------------------------------------------------
export function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering nothing on the server
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun
          className="size-4.5 shrink-0 text-amber-400"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ) : (
        <Moon
          className="size-4.5 shrink-0 text-slate-500"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      )}
      <span className="hidden sm:inline">
        {isDark ? "Light mode" : "Dark mode"}
      </span>

      {/* Pill toggle */}
      <span
        className={[
          "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border-2 transition-colors duration-200",
          isDark
            ? "border-teal-500 bg-teal-500"
            : "border-slate-300 bg-slate-200",
        ].join(" ")}
        aria-hidden="true"
      >
        <span
          className={[
            "inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            isDark ? "translate-x-4" : "translate-x-0.5",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
