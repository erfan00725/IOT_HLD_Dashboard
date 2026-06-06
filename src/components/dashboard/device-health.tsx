'use client';

import { Activity, CheckCircle2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const SEGMENTS = [
  { label: 'Online',  count: 14, pct: 78, color: '#0d9488' /* teal-600  */ },
  { label: 'Warning', count: 3,  pct: 17, color: '#f59e0b' /* amber-400 */ },
  { label: 'Offline', count: 1,  pct: 5,  color: '#ef4444' /* red-500   */ },
] as const;

const TOTAL = SEGMENTS.reduce((s, seg) => s + seg.count, 0);

// ---------------------------------------------------------------------------
// Donut chart (pure SVG, no external lib)
// ---------------------------------------------------------------------------
function DonutChart() {
  const R  = 54;          // radius
  const CX = 70;          // centre x
  const CY = 70;          // centre y
  const STROKE = 18;      // ring thickness
  const CIRC = 2 * Math.PI * R;

  // Build segments from 12-o'clock (offset -90deg)
  let offset = 0;
  const slices = SEGMENTS.map((seg) => {
    const dash  = (seg.pct / 100) * CIRC;
    const gap   = CIRC - dash;
    const rotate = (offset / 100) * 360 - 90;
    offset += seg.pct;
    return { ...seg, dash, gap, rotate };
  });

  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      aria-label={`Device health donut chart: ${TOTAL} total devices`}
      role="img"
    >
      {/* Background ring */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />

      {/* Coloured segments */}
      {slices.map((s) => (
        <circle
          key={s.label}
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={s.color}
          strokeWidth={STROKE}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeLinecap="round"
          transform={`rotate(${s.rotate} ${CX} ${CY})`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      ))}

      {/* Centre label */}
      <text x={CX} y={CY - 6} textAnchor="middle" className="fill-slate-900" fontSize="22" fontWeight="700" fontFamily="inherit">
        {TOTAL}
      </text>
      <text x={CX} y={CY + 10} textAnchor="middle" className="fill-slate-400" fontSize="10" fontFamily="inherit">
        Total
      </text>
      <text x={CX} y={CY + 22} textAnchor="middle" className="fill-slate-400" fontSize="10" fontFamily="inherit">
        Devices
      </text>
    </svg>
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
      <span className="w-16 text-sm font-semibold text-slate-700">{count}</span>
      <span className="flex-1 text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-400">{pct}%</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Device Health panel
// ---------------------------------------------------------------------------
export function DeviceHealth() {
  return (
    <section
      className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
      aria-labelledby="device-health-heading"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-slate-500" strokeWidth={1.8} aria-hidden="true" />
          <h2 id="device-health-heading" className="text-sm font-semibold text-slate-900">
            Device Health
          </h2>
        </div>
        <a href="#devices" className="text-xs font-medium text-teal-600 hover:underline">
          View all
        </a>
      </div>

      {/* Chart + legend */}
      <div className="flex flex-1 items-center justify-center gap-6">
        <DonutChart />

        <div className="grid gap-3">
          {SEGMENTS.map((seg) => (
            <LegendRow key={seg.label} {...seg} />
          ))}
        </div>
      </div>

      {/* Footer status */}
      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <CheckCircle2 className="size-4 shrink-0 text-teal-500" strokeWidth={2} aria-hidden="true" />
        All devices are operating normally.
      </div>
    </section>
  );
}
