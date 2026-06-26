import {
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Home,
  ChevronDown,
} from "lucide-react";
import type { FC, ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { sidebarItems } from "@/data/mock";
import { DarkModeToggle } from "@/components/layout/dark-mode-toggle";
import { getMyProfile } from "@/lib/prisma/queries/profiles";
import {
  getDashboardDeviceStates,
  getFirstHome,
} from "@/lib/prisma/queries/dashboard";
import {
  summarizeDeviceHealth,
  type DeviceHealthSummary,
  type SystemHealthStatus,
} from "@/lib/utils/device-health";
import Navbar from "./sidebar/Navbar";

type Profile = Awaited<ReturnType<typeof getMyProfile>>;

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
// Bottom status badge — driven by aggregated device health
// ---------------------------------------------------------------------------
const SYSTEM_STATUS_CONFIG: Record<
  SystemHealthStatus,
  { label: string; sub: (s: DeviceHealthSummary) => string; bg: string }
> = {
  secure: {
    label: "System Secure",
    sub: () => "All systems normal",
    bg: "bg-teal-600",
  },
  warning: {
    label: "Attention Needed",
    sub: (s) =>
      `${s.warning} ${s.warning === 1 ? "device needs" : "devices need"} review`,
    bg: "bg-amber-500",
  },
  offline: {
    label: "Devices Offline",
    sub: (s) =>
      `${s.offline} ${s.offline === 1 ? "device is" : "devices are"} offline`,
    bg: "bg-red-500",
  },
};

function SystemStatus({ summary }: { summary: DeviceHealthSummary }) {
  const cfg = SYSTEM_STATUS_CONFIG[summary.status];
  const Icon = summary.status === "secure" ? ShieldCheck : ShieldAlert;
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
      <div
        className={`grid size-8 shrink-0 place-items-center rounded-full text-white shadow-sm ${cfg.bg}`}
      >
        <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {cfg.label}
        </p>
        <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
          {cfg.sub(summary)}
        </p>
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
        className="size-4.5 shrink-0 text-slate-400 dark:text-slate-500 transition-colors duration-150 group-hover:text-slate-600 dark:group-hover:text-slate-300"
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

function Sidebar({
  summary,
  pathname,
}: {
  summary: DeviceHealthSummary;
  pathname: string;
}) {
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

      <Navbar />

      {/* Bottom section */}
      <div className="border-t border-slate-100 dark:border-slate-700/60 px-3 pb-6 pt-4">
        <SystemStatus summary={summary} />
        <div className="mt-1">
          <HelpLink />
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// User menu button
// ---------------------------------------------------------------------------
function UserMenu({ profile }: { profile: Profile | null }) {
  const displayName = profile?.display_name?.trim() || "Guest";
  const initials = deriveInitials(profile);
  return (
    <button
      type="button"
      className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="User menu"
    >
      {/* Avatar */}
      <div className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
        {initials}
      </div>
      <span className="hidden text-sm font-medium text-slate-800 dark:text-slate-200 sm:inline">
        {displayName}
      </span>
      <ChevronDown
        className="size-4 text-slate-400 dark:text-slate-500"
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  );
}

/** Returns up to two uppercase initials from display_name, or "?" as fallback. */
function deriveInitials(profile: Profile | null): string {
  const name = profile?.display_name?.trim();
  if (!name) return "?";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (
    parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)
  ).toUpperCase();
}

// ---------------------------------------------------------------------------
// Page header — title + subtitle on the left, controls on the right
// ---------------------------------------------------------------------------
function PageHeader({
  pageTitle,
  pageSubtitle,
  profile,
}: {
  pageTitle: string;
  pageSubtitle: string;
  profile: Profile | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 px-5 backdrop-blur-md sm:px-8">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left: page title */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold leading-tight text-slate-900 dark:text-slate-100">
            {pageTitle}
          </h1>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {pageSubtitle}
          </p>
        </div>

        {/* Right: dark mode toggle + user menu */}
        <div className="flex shrink-0 items-center gap-5">
          <DarkModeToggle />

          {/* Vertical divider */}
          <div
            className="h-6 w-px bg-slate-200 dark:bg-slate-700"
            aria-hidden="true"
          />

          <UserMenu profile={profile} />
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// App shell
// ---------------------------------------------------------------------------

export interface AppShellProps {
  children: ReactNode;
  /** Title shown in the header. Defaults to "Dashboard". */
  pageTitle?: string;
  /** Subtitle shown under the title. */
  pageSubtitle?: string;
}

const DEFAULT_PAGE_TITLE = "Dashboard";
const DEFAULT_PAGE_SUBTITLE = "Overview of your home and leave detection";

/**
 * Server component. Fetches the chrome data (user profile, current home, and
 * aggregated device health) so the user menu, system status badge, and page
 * title reflect real database state. The client-only theme toggle is rendered
 * via the `<DarkModeToggle />` island.
 */
export async function AppShell({
  children,
  pageTitle,
  pageSubtitle,
}: AppShellProps) {
  // Profile lookup may fail for an authenticated user that has no profile row
  // yet — fall back to a guest identity rather than crashing the whole shell.
  let profile: Awaited<ReturnType<typeof getMyProfile>> | null = null;
  try {
    profile = await getMyProfile();
  } catch {
    profile = null;
  }

  const home = await getFirstHome();
  const deviceStates = home ? await getDashboardDeviceStates(home.id) : [];
  const summary = summarizeDeviceHealth(deviceStates);

  // Read the current pathname (set by the proxy middleware) so the sidebar
  // can highlight the active route. Falls back to "/" if unavailable.
  const pathname = (await headers()).get("x-pathname") ?? "/";

  console.log((await headers()).get("x-pathname"));

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
            <Sidebar summary={summary} pathname={pathname} />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex min-w-0 flex-col">
          <PageHeader
            pageTitle={pageTitle ?? DEFAULT_PAGE_TITLE}
            pageSubtitle={pageSubtitle ?? DEFAULT_PAGE_SUBTITLE}
            profile={profile}
          />
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
