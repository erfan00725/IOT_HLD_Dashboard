import { type LucideIcon } from "lucide-react";
import { CardPanel, StatusTile } from "@/components/ui";
import { type ToneColor } from "@/lib/utils/tone-styles";

export interface SummaryTileData {
  icon: LucideIcon;
  label: string;
  sub: string;
  tone: ToneColor;
}

interface SummaryPanelProps {
  headingId?: string;
  title?: string;
  tiles: SummaryTileData[];
}

/**
 * Generic overview panel that renders a heading + grid of StatusTile cards.
 * Replaces the duplicated `<CardPanel>` + "Overview" + `<StatusTile>` grid
 * pattern found in DevicesSummary and EventsSummary.
 */
export function SummaryPanel({
  headingId = "summary-heading",
  title = "Overview",
  tiles,
}: SummaryPanelProps) {
  return (
    <CardPanel className="gap-4 p-5 sm:p-6" aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="text-sm font-semibold text-slate-900 dark:text-slate-100"
      >
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => (
          <StatusTile key={tile.sub} {...tile} />
        ))}
      </div>
    </CardPanel>
  );
}
