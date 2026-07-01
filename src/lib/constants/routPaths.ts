export const ROUT_PATHS = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  DEVICES: "/devices",
  EVENTS: "/events",
  REMINDERS: "/reminders",
  SIGNUP: "/signup",
} as const;

export type RoutePath = (typeof ROUT_PATHS)[keyof typeof ROUT_PATHS];
