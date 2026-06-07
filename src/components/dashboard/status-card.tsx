import { cn } from "@/lib/utils/utils";
import { STATUS_CARD_TONE_STYLES } from "@/lib/utils/tone-styles";

export function StatusCard({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: keyof typeof STATUS_CARD_TONE_STYLES;
}) {
  return (
    <article className="rounded-[28px] border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", STATUS_CARD_TONE_STYLES[tone])}>
          {hint}
        </span>
      </div>
    </article>
  );
}
