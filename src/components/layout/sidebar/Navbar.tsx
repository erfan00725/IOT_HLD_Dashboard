"use client";
import {
  LayoutDashboard,
  Cpu,
  Zap,
  CalendarClock,
  Bell,
  BarChart2,
  Settings,
  type LucideProps,
} from "lucide-react";
import { sidebarItems } from "@/data/mock";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

// ---------------------------------------------------------------------------
// Icon registry — maps string names from mock data to Lucide components
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, FC<LucideProps>> = {
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
  const className = [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
    active
      ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100",
  ].join(" ");

  const iconEl = (
    <NavIcon
      name={icon}
      className={[
        "size-4.5 shrink-0 transition-colors duration-150",
        active
          ? "text-teal-600 dark:text-teal-400"
          : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
      ].join(" ")}
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );

  // Real routes use next/link for client-side navigation; in-page hash links
  // (placeholders for routes not yet built) stay as plain anchors.
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        className={className}
        aria-current={active ? "page" : undefined}
      >
        {iconEl}
        {label}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      aria-current={active ? "page" : undefined}
    >
      {iconEl}
      {label}
    </a>
  );
}

/**
 * Determines whether a sidebar item is the active one for the given pathname.
 * Real routes (starting with "/") are matched by prefix; hash placeholders
 * are never considered active.
 */
function isActiveNav(href: string, pathname: string): boolean {
  if (!href.startsWith("/")) return false;
  if (href === "/dashboard") {
    // Dashboard is the landing route — only active on an exact match.
    return pathname === "/dashboard" || pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <ul role="list" className="grid gap-0.5">
        {sidebarItems.map((item) => (
          <li key={item.label}>
            <NavItem
              label={item.label}
              href={item.href}
              icon={item.icon}
              active={isActiveNav(item.href, pathname)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
