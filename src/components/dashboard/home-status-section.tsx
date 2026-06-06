import {
  PersonStanding,
  Lightbulb,
  Grid2x2,
  KeyRound,
  LockKeyhole,
  Home,
  Wifi,
  RefreshCw,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type StatusTone = "teal" | "amber" | "red" | "slate";

interface StatusTile {
  icon: LucideIcon;
  label: string;
  sub: string;
  tone: StatusTone;
}

// ---------------------------------------------------------------------------
// Status tiles data — mirrors the real device states from mock data
// ---------------------------------------------------------------------------
const STATUS_TILES: StatusTile[] = [
  { icon: PersonStanding, label: "Away", sub: "Since 8:42 AM", tone: "teal" },
  { icon: Lightbulb, label: "Lights On", sub: "2 Rooms", tone: "amber" },
  { icon: Grid2x2, label: "Stove Off", sub: "All Clear", tone: "teal" },
  { icon: KeyRound, label: "Keys Missing", sub: "Not Detected", tone: "red" },
  { icon: LockKeyhole, label: "Door Locked", sub: "Front Door", tone: "teal" },
];

// ---------------------------------------------------------------------------
// Tone → colour tokens (with dark mode variants)
// ---------------------------------------------------------------------------
const TONE_STYLES: Record<StatusTone, { icon: string; bg: string }> = {
  teal:  { icon: "text-teal-600 dark:text-teal-400",  bg: "bg-teal-50 dark:bg-teal-900/30" },
  amber: { icon: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
  red:   { icon: "text-red-500 dark:text-red-400",    bg: "bg-red-50 dark:bg-red-900/30" },
  slate: { icon: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
};

// ---------------------------------------------------------------------------
// Single status tile
// ---------------------------------------------------------------------------
function StatusTile({ icon: Icon, label, sub, tone }: StatusTile) {
  const { icon: iconCls, bg } = TONE_STYLES[tone];
  return (
    <div
      className={`flex flex-col items-start gap-3 rounded-2xl ${bg} p-4 transition-shadow hover:shadow-sm`}
    >
      <Icon
        className={`size-7 ${iconCls}`}
        strokeWidth={1.6}
        aria-hidden="true"
      />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home Status Section
// ---------------------------------------------------------------------------
export function HomeStatusSection() {
  return (
    <section
      className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6"
      aria-labelledby="home-status-heading"
    >
      {/* Section header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Home
            className="size-5 text-slate-500 dark:text-slate-400"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <div>
            <h2
              id="home-status-heading"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              Home Status
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Live overview of your home</p>
          </div>
        </div>

        {/* Updated timestamp + refresh */}
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <Wifi className="size-4" strokeWidth={1.8} aria-hidden="true" />
          <span>Updated just now</span>
          <button
            type="button"
            className="rounded-full p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Refresh home status"
          >
            <RefreshCw className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-slate-100 dark:border-slate-700/60" />

      {/* Content row: house image + status tiles */}
      <div className="grid grid-cols-[auto_1fr] items-center gap-4 sm:gap-6">
        {/* House illustration */}
        <div className="hidden shrink-0 sm:block">
          <div className="size-35 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <svg
              viewBox="0 0 140 140"
              className="size-full"
              aria-hidden="true"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sky */}
              <rect width="140" height="140" fill="#e0f2fe" />
              {/* Ground */}
              <rect y="95" width="140" height="45" fill="#d1fae5" />
              {/* House body */}
              <rect x="25" y="60" width="90" height="55" rx="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Roof */}
              <polygon points="15,62 70,20 125,62" fill="#475569" />
              {/* Door */}
              <rect x="56" y="85" width="28" height="30" rx="2" fill="#94a3b8" />
              <circle cx="80" cy="101" r="2" fill="#f1f5f9" />
              {/* Windows */}
              <rect x="32" y="70" width="22" height="18" rx="2" fill="#bae6fd" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="86" y="70" width="22" height="18" rx="2" fill="#bae6fd" stroke="#cbd5e1" strokeWidth="1" />
              {/* Window cross-bars */}
              <line x1="43" y1="70" x2="43" y2="88" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="32" y1="79" x2="54" y2="79" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="97" y1="70" x2="97" y2="88" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="86" y1="79" x2="108" y2="79" stroke="#cbd5e1" strokeWidth="1" />
              {/* Chimney */}
              <rect x="88" y="28" width="12" height="22" fill="#475569" />
              {/* Tree */}
              <rect x="8" y="88" width="4" height="14" fill="#92400e" />
              <circle cx="10" cy="82" r="10" fill="#34d399" />
            </svg>
          </div>
        </div>

        {/* Status tiles grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STATUS_TILES.map((tile) => (
            <StatusTile key={tile.label} {...tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
