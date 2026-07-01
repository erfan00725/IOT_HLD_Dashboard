import { apiClient } from "./client";

export interface DashboardStatusResponse {
  home: { id: string; name: string; slug: string } | null;
  deviceStates: Array<{
    device_external_key: string;
    state_value: string;
    last_seen_at: string;
    devices: {
      name: string;
      category: string;
      expected_safe_state: string;
      active: boolean;
    } | null;
  }>;
  activeSession: {
    id: string;
    started_at: string;
    ended_at: string | null;
  } | null;
}

export interface ActiveReminderRule {
  id: string;
  reminder_text: string;
  severity: number;
  device_external_key: string;
  devices: { name: string; category: string } | null;
  created_at: string;
}

export interface RecentLeaveEvent {
  id: number;
  device_external_key: string;
  state_value: string;
  observed_at: string;
  devices: { name: string; category: string } | null;
}

export function fetchDashboardStatus() {
  return apiClient.get<DashboardStatusResponse>("/api/dashboard/status");
}

export function fetchActiveReminders() {
  return apiClient.get<ActiveReminderRule[]>("/api/dashboard/active-reminders");
}

export function fetchRecentLeaveEvents() {
  return apiClient.get<RecentLeaveEvent[]>(
    "/api/dashboard/recent-leave-events",
  );
}
