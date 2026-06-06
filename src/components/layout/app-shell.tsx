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
  type LucideProps,
} from 'lucide-react';
import { sidebarItems } from '@/data/mock';
import React from 'react';

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
        <p className="text-base font-semibold tracking-tight text-slate-900">LeaveDetect</p>
        <p className="text-xs text-slate-400">Smart Home</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar navigation item
// ---------------------------------------------------------------------------
function NavItem({ label, href, icon, active }: { label: string; href: string; icon: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={[
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150',
        active
          ? 'bg-teal-50 text-teal-700'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
      ].join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      <NavIcon
        name={icon}
        className={[
          'size-[18px] shrink-0 transition-colors duration-150',
          active ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600',
        ].join(' ')}
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
        <p className="text-sm font-medium text-slate-800">System Secure</p>
        <p className="text-xs font-medium text-teal-600">All systems normal</p>
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
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800"
    >
      <HelpCircle
        className="size-[18px] shrink-0 text-slate-400 transition-colors duration-150 group-hover:text-slate-600"
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
      className="flex flex-col border-r border-slate-200/80 bg-white"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="px-4 pb-4 pt-6">
        <Logo />
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-slate-100" />

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
      <div className="border-t border-slate-100 px-3 pb-6 pt-4">
        <SystemStatus />
        <div className="mt-1">
          <HelpLink />
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// App shell
// ---------------------------------------------------------------------------
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Skip link for keyboard accessibility */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-md"
      >
        Skip to content
      </a>

      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[256px_minmax(0,1fr)]">
        {/* Sidebar — hidden on mobile, visible from lg breakpoint */}
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-teal-700">IoT leave-detection dashboard</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  Node-RED + Wokwi simulators, Supabase-backed reminder rules
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  type="button"
                >
                  <Bell className="size-4" strokeWidth={1.8} aria-hidden="true" />
                  Test reminder
                </button>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
                    E
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Erfan</p>
                    <p className="text-xs text-slate-500">Frontend developer</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main id="content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
