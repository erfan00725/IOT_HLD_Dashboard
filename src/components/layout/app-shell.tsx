import { Bell, ChevronRight, MoonStar, ShieldCheck } from 'lucide-react';
import { sidebarItems } from '@/data/mock';

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-2xl bg-teal-600 text-white shadow-[0_12px_30px_rgba(15,118,110,0.24)]">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 11.5 12 5l7 6.5V19a1 1 0 0 1-1 1h-3.5v-5h-5v5H6a1 1 0 0 1-1-1z" />
          <path d="M9 10.5h6" />
        </svg>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Smart Exit</p>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">HomeLeave</h1>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.08),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f5f7fb_100%)] text-slate-900">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200/80 bg-white/80 px-5 py-6 backdrop-blur lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center justify-between lg:block">
            <Logo />
            <button className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-slate-300 hover:bg-white lg:mt-8" aria-label="Toggle theme">
              <MoonStar className="size-5" />
            </button>
          </div>
          <nav className="mt-8 grid gap-1">
            {sidebarItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={item.active
                  ? 'flex items-center justify-between rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700'
                  : 'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'}
              >
                <span>{item.label}</span>
                <ChevronRight className="size-4" />
              </a>
            ))}
          </nav>
          <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/12">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-white/10">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Leave protection</p>
                <p className="text-xs text-slate-400">2 reminders escalate automatically</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">Built for fast checks before leaving home, with clear device states and human-readable automations.</p>
          </div>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-teal-700">IoT leave-detection dashboard</p>
                <p className="mt-1 text-sm text-slate-500">Node-RED + Wokwi simulators, Supabase-backed reminder rules</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  <Bell className="size-4" />
                  Test reminder
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="grid size-10 place-items-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">E</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Erfan</p>
                    <p className="text-xs text-slate-500">Frontend developer</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main id="content" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
