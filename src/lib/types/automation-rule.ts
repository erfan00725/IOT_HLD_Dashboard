import type { ToneColor } from "@/lib/utils/tone-styles";

/**
 * Shared automation-rule shape used by both the AutomationRules panel
 * and the dashboard-mappers (server → client mapping).
 *
 * Moved here to break the circular dependency between
 * `automation-rules.tsx` and `dashboard-mappers.ts`.
 */
export interface AutomationRule {
  id: string;
  name: string;
  icon: "home" | "lightbulb" | "shield";
  iconColor: ToneColor;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
}
