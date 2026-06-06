import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Plus,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusCard } from "@/components/dashboard/status-card";
import { HomeStatusSection } from "@/components/dashboard/home-status-section";
import {
  automationRules,
  devices,
  history,
  reminders,
  statusCards,
} from "@/data/mock";

export default function Home() {
  return (
    <AppShell>
      <div className="grid gap-6">
        {/* ── Home Status hero row ─────────────────────────────────── */}
        <HomeStatusSection />

        {/* ── Main content grid ────────────────────────────────────── */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_420px]">
          <div className="grid gap-6">
            <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {statusCards.map((card) => (
                <StatusCard key={card.label} {...card} />
              ))}
            </section>

            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
              <SectionCard
                title="Priority reminders"
                eyebrow="Checklist"
                action={
                  <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700">
                    <Plus className="size-4" /> Add reminder
                  </button>
                }
              >
                <div className="grid gap-4">
                  {reminders.map((item) => (
                    <article
                      key={item.title}
                      className="flex flex-col gap-4 rounded-[26px] border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-slate-900">
                            {item.title}
                          </h3>
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                            {item.priority}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.detail}
                        </p>
                      </div>
                      <button className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                        Review
                      </button>
                    </article>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Device health" eyebrow="Sensors">
                <div className="grid gap-3">
                  {devices.map((device) => (
                    <article
                      key={device.name}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid size-11 place-items-center rounded-2xl bg-white text-slate-700 ring-1 ring-inset ring-slate-200">
                            <Cpu className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">
                              {device.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {device.meta}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          {device.state}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </SectionCard>
            </div>

            <SectionCard
              title="Recent leave events"
              eyebrow="Timeline"
              action={
                <a
                  href="#history"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
                >
                  Open log <ArrowUpRight className="size-4" />
                </a>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                {history.map((item) => (
                  <article
                    key={item.time + item.event}
                    className="rounded-[26px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-slate-200">
                        {item.time}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {item.event}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-6">
            <SectionCard
              title="Automation rules"
              eyebrow="Logic"
              action={
                <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:bg-white">
                  <Sparkles className="size-4" /> Simulate
                </button>
              }
            >
              <div className="grid gap-4">
                {automationRules.map((rule) => (
                  <article
                    key={rule.name}
                    className="rounded-[26px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {rule.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {rule.description}
                        </p>
                      </div>
                      <span
                        className={
                          rule.enabled
                            ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-200"
                            : "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        }
                      >
                        {rule.enabled ? "Enabled" : "Draft"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Quick checklist" eyebrow="Exit flow">
              <div className="grid gap-3 text-sm text-slate-600">
                {[
                  "Door locked",
                  "Kitchen lights off",
                  "Gas stove off",
                  "Keys packed",
                  "Wallet packed",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <span>{item}</span>
                    <span
                      className={
                        index < 3
                          ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200"
                          : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200"
                      }
                    >
                      {index < 3 ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
