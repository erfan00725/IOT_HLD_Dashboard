export function SectionCard({
  title,
  eyebrow,
  action,
  children,
  className = '',
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[30px] border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] sm:p-6 ${className}`}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{eyebrow}</p> : null}
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
