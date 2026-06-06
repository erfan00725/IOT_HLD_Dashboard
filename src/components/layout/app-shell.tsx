"use client";

import {
  LayoutDashboard,
  Cpu,
  Zap,
  CalendarClock,
  Bell,
  BarChart2,
  Settings,
  ShieldCheck,
  HelpCircle,
  Home,
  Moon,
  Sun,
  ChevronDown,
  type LucideProps,
} from "lucide-react";
import { sidebarItems } from "@/data/mock";
import React from "react";
import { useTheme } from "@/context/theme-context";

// ---------------------------------------------------------------------------
// Icon registry — maps string names from mock data to Lucide components
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  LayoutDashboard,
  Cpu,
  Zap,
  CalendarClock,
  Bell,
  BarChart2,
  Settings,
};

function NavIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICON_MAP[name] ?? LayoutDashboard;
  return <Icon {...props} />;
}

// ---------------------------------------------------------------------------
// Brand logo
// ---------------------------------------------------------------------------
function Logo() {
  return (
    <div className="flex items-center gap-3 px-3 py-1">
      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-teal-600 text-white shadow-[0_8px_24px_rgba(15,118,110,0.22)]">
        <Home className="size-5" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          LeaveDetect
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Smart Home</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar navigation item
// ---------------------------------------------------------------------------
function NavItem({
  label,
  href,
  icon,
  active,
}: {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
        active
          ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      <NavIcon
        name={icon}
        className={[
          "size-[18px] shrink-0 transition-colors duration-150",
          active
            ? "text-teal-600 dark:text-teal-400"
            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
        ].join(" ")}
        strokeWidth={1.8}
        aria-hidden="true"
      />
      {label}
    </a>
  );
}

// ---------------------------------------------------------------------------
// Bottom status badge
// ---------------------------------------------------------------------------
function SystemStatus() {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-600 text-white shadow-sm">
        <ShieldCheck className="size-4" strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">System Secure</p>
        <p className="text-xs font-medium text-teal-600 dark:text-teal-400">All systems normal</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Help & Support link
// ---------------------------------------------------------------------------
function HelpLink() {
  return (
    <a
      href="#help"
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100"
    >
      <HelpCircle
        className="size-[18px] shrink-0 text-slate-400 dark:text-slate-500 transition-colors duration-150 group-hover:text-slate-600 dark:group-hover:text-slate-300"
        strokeWidth={1.8}
        aria-hidden="true"
      />
      Help &amp; Support
    </a>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function Sidebar() {
  return (
    <aside
      className="flex h-full flex-col border-r border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="px-4 pb-4 pt-6">
        <Logo />
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-slate-100 dark:border-slate-700/60" />

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul role="list" className="grid gap-0.5">
          {sidebarItems.map((item) => (
            <li key={item.label}>
              <NavItem
                label={item.label}
                href={item.href}
                icon={item.icon}
                active={item.active}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-100 dark:border-slate-700/60 px-3 pb-6 pt-4">
        <SystemStatus />
        <div className="mt-1">
          <HelpLink />
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Dark-mode toggle pill — connected to ThemeContext
// ---------------------------------------------------------------------------
function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun
          className="size-[18px] shrink-0 text-amber-400"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ) : (
        <Moon
          className="size-[18px] shrink-0 text-slate-500"
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

// ---------------------------------------------------------------------------
// User menu button
// ---------------------------------------------------------------------------
function UserMenu() {
  return (
    <button
      type="button"
      className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="User menu"
    >
      {/* Avatar */}
      <div className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
        E
      </div>
      <span className="hidden text-sm font-medium text-slate-800 dark:text-slate-200 sm:inline">
        Erfan
      </span>
      <ChevronDown
        className="size-4 text-slate-400 dark:text-slate-500"
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page header — title + subtitle on the left, controls on the right
// ---------------------------------------------------------------------------
function PageHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 px-5 backdrop-blur-md sm:px-8">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left: page title */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold leading-tight text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            Overview of your home and leave detection
          </p>
        </div>

        {/* Right: dark mode toggle + user menu */}
        <div className="flex shrink-0 items-center gap-5">
          <DarkModeToggle />

          {/* Vertical divider */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

          <UserMenu />
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// App shell
// ---------------------------------------------------------------------------
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1117] text-slate-900 dark:text-slate-100">
      {/* Skip link for keyboard accessibility */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white dark:focus:bg-slate-800 focus:px-4 focus:py-2 focus:shadow-md"
      >
        Skip to content
      </a>

      <div className="mx-auto grid min-h-screen max-w-400 lg:grid-cols-[256px_minmax(0,1fr)]">
        {/* Sidebar — hidden on mobile, visible from lg breakpoint */}
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex min-w-0 flex-col">
          <PageHeader />
          <main
            id="content"
            className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
