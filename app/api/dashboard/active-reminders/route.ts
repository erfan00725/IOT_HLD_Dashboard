import { NextResponse } from "next/server";
import {
  getActiveReminderRulesForDashboard,
  getFirstHome,
} from "@/lib/prisma/queries/dashboard";

export async function GET() {
  try {
    const home = await getFirstHome();

    if (!home) {
      return NextResponse.json([], { status: 200 });
    }

    const rules = await getActiveReminderRulesForDashboard(home.id);
    return NextResponse.json(rules, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 401 },
    );
  }
}
