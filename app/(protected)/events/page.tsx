import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getEventsPageData,
  getFirstHome,
  type EventsPageEvent,
} from "@/lib/prisma/queries/dashboard";
import { AppShell } from "@/components/layout/app-shell";
import { EventsSummary } from "@/components/dashboard/events-summary";
import { EventsTimeline } from "@/components/dashboard/events-timeline";
import { ROUT_PATHS } from "@/lib/constants/routPaths";
import { eventStateToTone, isToday } from "@/lib/utils/events";

/**
 * A server-side protected page.
 * Users who are not authenticated are redirected to /login.
 */
export default async function EventsPage() {
  const supabase = await createClient();

  // Fast local JWT validation (no network call).
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect(ROUT_PATHS.LOGIN);
  }

  const home = await getFirstHome();
  const events = home ? await getEventsPageData(home.id) : [];

  const summary = computeSummary(events);

  return (
    <AppShell
      pageTitle="Events"
      pageSubtitle="A timeline of everything happening in your home"
    >
      <div className="grid gap-6">
        {/* ── Summary row ─────────────────────────────────────────────── */}
        <EventsSummary {...summary} />

        {/* ── Search + filter + timeline ──────────────────────────────── */}
        <EventsTimeline events={events} />
      </div>
    </AppShell>
  );
}

// ─── Summary helper ────────────────────────────────────────────────────────

function computeSummary(events: EventsPageEvent[]) {
  let today = 0;
  let alerts = 0;
  const dayKeys = new Set<string>();

  for (const e of events) {
    if (isToday(e.observed_at)) today += 1;
    dayKeys.add(e.observed_at.slice(0, 10));
    if (eventStateToTone(e.state_key) !== "teal") alerts += 1;
  }

  return { total: events.length, today, activeDays: dayKeys.size, alerts };
}
