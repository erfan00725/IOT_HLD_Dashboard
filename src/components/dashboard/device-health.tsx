"use client";

import { Activity, CheckCircle2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Sector,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const SEGMENTS = [
  { label: "Online",  count: 14, pct: 78, color: "#0d9488" }, // teal-600
  { label: "Warning", count: 3,  pct: 17, color: "#f59e0b" }, // amber-400
  { label: "Offline", count: 1,  pct: 5,  color: "#ef4444" }, // red-500
] as const;

const TOTAL = SEGMENTS.reduce((s, seg) => s + seg.count, 0);

const PIE_DATA = SEGMENTS.map((s) => ({
  name: s.label,
  value: s.count,
  pct: s.pct,
  color: s.color,
}));

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------
// @ts-ignore
function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const { name, value, pct } = payload[0].payload as {
    name: string;
    value: number;
    pct: number;
  };
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-slate-800 dark:text-slate-200">{name}</p>
      <p className="text-slate-500 dark:text-slate-400">
        {value} devices ({pct}%)
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Centre label rendered inside the donut hole via a custom SVG label
// ---------------------------------------------------------------------------
function CentreLabel({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fill="currentColor"
        fontSize={22}
        fontWeight={700}
        className="fill-slate-900 dark:fill-slate-100"
      >
        {TOTAL}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#94a3b8" fontSize={10}>
        Total
      </text>
      <text x={cx} y={cy + 23} textAnchor="middle" fill="#94a3b8" fontSize={10}>
        Devices
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Custom slice renderer for Pie (replaces deprecated Cell)
// ---------------------------------------------------------------------------
function renderSlice(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload?.color}
        stroke="transparent"
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Legend row
// ---------------------------------------------------------------------------
function LegendRow({
  label,
  count,
  pct,
  color,
}: {
  label: string;
  count: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="w-6 text-sm font-semibold text-slate-700 dark:text-slate-200">{count}</span>
      <span className="flex-1 text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{pct}%</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Device Health panel
// ---------------------------------------------------------------------------
export function DeviceHealth() {
  return (
    <section
      className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm"
      aria-labelledby="device-health-heading"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity
            className="size-4 text-slate-500 dark:text-slate-400"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <h2
            id="device-health-heading"
            className="text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            Device Health
          </h2>
        </div>
        <a
          href="#devices"
          className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline"
        >
          View all
        </a>
      </div>

      {/* Chart + legend */}
      <div className="flex flex-1 items-center justify-center gap-4">
        {/* Recharts donut */}
        <div className="size-35 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                labelLine={false}
                label={<CentreLabel />}
                isAnimationActive
                animationBegin={0}
                animationDuration={700}
                animationEasing="ease-out"
                shape={renderSlice}
              />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid gap-3">
          {SEGMENTS.map((seg) => (
            <LegendRow key={seg.label} {...seg} />
          ))}
        </div>
      </div>

      {/* Footer status */}
      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/60 pt-4 text-xs text-slate-500 dark:text-slate-400">
        <CheckCircle2
          className="size-4 shrink-0 text-teal-500"
          strokeWidth={2}
          aria-hidden="true"
        />
        All devices are operating normally.
      </div>
    </section>
  );
}
