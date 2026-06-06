import { cn } from "@/lib/utils/utils";

const toneStyles = {
  teal: "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 ring-1 ring-inset ring-teal-200 dark:ring-teal-700",
  slate: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-200 dark:ring-slate-600",
  amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-200 dark:ring-amber-700",
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
    <article className="rounded-[28px] border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
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
