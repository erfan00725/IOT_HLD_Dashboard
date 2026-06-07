import {
  PersonStanding,
  Lightbulb,
  Grid2x2,
  KeyRound,
  LockKeyhole,
  Home,
  Wifi,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import {
  type ToneColor,
  ICON_BUBBLE_STYLES,
  STATUS_TILE_ICON_STYLES,
} from "@/lib/utils/tone-styles";
import { CardPanel, PanelHeader } from "../ui";

interface StatusTile {
  icon: LucideIcon;
  label: string;
  sub: string;
  tone: ToneColor;
}

const STATUS_TILES: StatusTile[] = [
  { icon: PersonStanding, label: "Away", sub: "Since 8:42 AM", tone: "teal" },
  { icon: Lightbulb, label: "Lights On", sub: "2 Rooms", tone: "amber" },
  { icon: Grid2x2, label: "Stove Off", sub: "All Clear", tone: "teal" },
  { icon: KeyRound, label: "Keys Missing", sub: "Not Detected", tone: "red" },
  { icon: LockKeyhole, label: "Door Locked", sub: "Front Door", tone: "teal" },
];

function StatusTile({ icon: Icon, label, sub, tone }: StatusTile) {
  return (
    <div
      className={`flex flex-col items-start gap-3 rounded-2xl ${ICON_BUBBLE_STYLES[tone]} p-4 transition-shadow hover:shadow-sm`}
    >
      <Icon
        className={`size-7 ${STATUS_TILE_ICON_STYLES[tone]}`}
        strokeWidth={1.6}
        aria-hidden="true"
      />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {sub}
        </p>
      </div>
    </div>
  );
}

const HeaderActions = () => (
  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
    <div className="flex items-center gap-1">
      <Wifi className="size-3.5" strokeWidth={2} aria-hidden="true" />
      <span>Connected</span>
    </div>
    <button
      type="button"
      className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="Refresh home status"
    >
      <RefreshCw className="size-3.5" strokeWidth={2} aria-hidden="true" />
      <span>Refresh</span>
    </button>
  </div>
);

export function HomeStatusSection() {
  return (
    <CardPanel className="p-5 sm:p-6" aria-labelledby="home-status-heading">
      <PanelHeader
        icon={Home}
        title="Home Status"
        headingId="home-status-heading"
        short_description="Live snapshot"
        actions={<HeaderActions />}
      />
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {STATUS_TILES.map((tile) => (
          <StatusTile key={tile.label} {...tile} />
        ))}
      </div>
    </CardPanel>
  );
}
