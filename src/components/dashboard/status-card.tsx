import { cn } from "@/lib/utils/utils";

const toneStyles = {
  teal: "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200",
  slate: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
};

export function StatusCard({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
            toneStyles[tone],
          )}
        >
          {hint}
        </span>
      </div>
    </article>
  );
}
