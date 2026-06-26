import {
  getAllRulesForAutomationTable,
  getDashboardDeviceStates,
} from "../prisma/queries/dashboard";
import { ArrayElement } from "../utils/type-utils";

export type RulesAutomationType = ArrayElement<
  Awaited<ReturnType<typeof getAllRulesForAutomationTable>>
>;

export type DashboardDeviceStateType = ArrayElement<
  Awaited<ReturnType<typeof getDashboardDeviceStates>>
>;
