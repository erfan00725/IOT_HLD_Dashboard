"use client";

import { Activity, CheckCircle2, AlertCircle } from "lucide-react";
import {
  PieChart,
  Pie,
  Sector,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { CardPanel } from "@/components/ui/card-panel";
import { PanelHeader } from "@/components/ui/panel-header";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeviceHealthSegment {
  label: string;
  count: number;
  pct: number;
  color: string;
}

export interface DeviceHealthProps {
  segments: DeviceHealthSegment[];
  total: number;
  hasWarning: boolean;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

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
        {value} device{value !== 1 ? "s" : ""} ({pct}%)
      </p>
    </div>
  );
}

// ─── Donut centre label ────────────────────────────────────────────────────────

function CentreLabel({
  cx,
  cy,
  total,
}: {
  cx?: number;
  cy?: number;
  total: number;
}) {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize={22}
        fontWeight={700}
        className="fill-slate-900 dark:fill-slate-100"
      >
        {total}
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

function renderSlice(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload } =
    props;
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

function LegendRow({ label, count, pct, color }: DeviceHealthSegment) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="w-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {count}
      </span>
      <span className="flex-1 text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
        {pct}%
      </span>
    </div>
  );
}

// ─── Client component (receives pre-computed props from server wrapper) ────────

export function DeviceHealthChart({
  segments,
  total,
  hasWarning,
}: DeviceHealthProps) {
  const pieData = segments.map((s) => ({
    name: s.label,
    value: s.count,
    pct: s.pct,
    color: s.color,
  }));

  return (
    <CardPanel aria-labelledby="device-health-heading">
      <PanelHeader
        icon={Activity}
        title="Device Health"
        headingId="device-health-heading"
        viewAllHref="#devices"
      />

      <div className="flex flex-1 items-center justify-center gap-4">
        <div className="size-35 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                labelLine={false}
                // @ts-ignore — recharts label prop accepts a render function
                label={<CentreLabel total={total} />}
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
        <div className="grid gap-3">
          {segments.map((seg) => (
            <LegendRow key={seg.label} {...seg} />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/60 pt-4 text-xs text-slate-500 dark:text-slate-400">
        {hasWarning ? (
          <>
            <AlertCircle
              className="size-4 shrink-0 text-amber-500"
              strokeWidth={2}
              aria-hidden="true"
            />
            Some devices need attention.
          </>
        ) : (
          <>
            <CheckCircle2
              className="size-4 shrink-0 text-teal-500"
              strokeWidth={2}
              aria-hidden="true"
            />
            All devices are operating normally.
          </>
        )}
      </div>
    </CardPanel>
  );
}
