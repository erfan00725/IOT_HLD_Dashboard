import {
  PersonStanding, Lightbulb, Grid2x2, KeyRound, LockKeyhole,
  Home, Wifi, RefreshCw, type LucideIcon,
} from "lucide-react";
import {
  type ToneColor,
  ICON_BUBBLE_STYLES,
  STATUS_TILE_ICON_STYLES,
} from "@/lib/utils/tone-styles";

interface StatusTile {
  icon: LucideIcon;
  label: string;
  sub: string;
  tone: ToneColor;
}

const STATUS_TILES: StatusTile[] = [
  { icon: PersonStanding, label: "Away",         sub: "Since 8:42 AM",  tone: "teal"  },
  { icon: Lightbulb,      label: "Lights On",    sub: "2 Rooms",        tone: "amber" },
  { icon: Grid2x2,        label: "Stove Off",    sub: "All Clear",      tone: "teal"  },
  { icon: KeyRound,       label: "Keys Missing", sub: "Not Detected",   tone: "red"   },
  { icon: LockKeyhole,    label: "Door Locked",  sub: "Front Door",     tone: "teal"  },
];

function StatusTile({ icon: Icon, label, sub, tone }: StatusTile) {
  return (
    <div className={`flex flex-col items-start gap-3 rounded-2xl ${ICON_BUBBLE_STYLES[tone]} p-4 transition-shadow hover:shadow-sm`}>
      <Icon className={`size-7 ${STATUS_TILE_ICON_STYLES[tone]}`} strokeWidth={1.6} aria-hidden="true" />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

export function HomeStatusSection() {
  return (
    <section
      className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6"
      aria-labelledby="home-status-heading"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Home className="size-5 text-slate-500 dark:text-slate-400" strokeWidth={1.8} aria-hidden="true" />
          <div>
            <h2 id="home-status-heading" className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Home Status
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Live snapshot</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <Wifi className="size-3.5" strokeWidth={2} aria-hidden="true" />
            <span>Connected</span>
          </div>
          <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Refresh home status">
            <RefreshCw className="size-3.5" strokeWidth={2} aria-hidden="true" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {STATUS_TILES.map((tile) => <StatusTile key={tile.label} {...tile} />)}
      </div>
    </section>
  );
}
