import { apiClient } from "./client";

export interface DashboardStatusResponse {
  home: { id: string; name: string; slug: string } | null;
  deviceStates: Array<{
    external_key: string;
    state_key: string | null;
    is_safe_state: boolean | null;
    last_seen_at: string;
    devices: {
      name: string;
      device_type_id: string;
      device_type_label: string;
      active: boolean;
    };
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
  external_key: string;
  devices: {
    name: string;
    device_type_id: string;
    device_type_label: string;
  } | null;
  created_at: string;
}

export interface RecentLeaveEvent {
  id: number;
  external_key: string;
  state_key: string | null;
  observed_at: string;
  devices: {
    name: string;
    device_type_id: string;
    device_type_label: string;
  } | null;
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
