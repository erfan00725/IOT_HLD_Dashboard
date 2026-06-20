import {
  getAllRulesForAutomationTable,
  getDashboardDeviceStates,
} from "../supabase/queries/dashboard";
import { ArrayElement } from "../utils/type-utils";

export interface RulesAutomationType extends Omit<
  ArrayElement<Awaited<ReturnType<typeof getAllRulesForAutomationTable>>>,
  "devices"
> {
  devices: {
    name: string;
    category: string;
  };
}

export interface DashboardDeviceStateType extends Omit<
  ArrayElement<Awaited<ReturnType<typeof getDashboardDeviceStates>>>,
  "devices"
> {
  devices: {
    name: string;
    category: string;
    expected_safe_state: string;
    active: boolean;
  };
}
