import { NextResponse } from "next/server";
import {
  getActiveLeaveSessionForDashboard,
  getDashboardDeviceStates,
  getFirstHome,
} from "@/lib/prisma/queries/dashboard";

export async function GET() {
  try {
    const home = await getFirstHome();

    if (!home) {
      return NextResponse.json(
        { home: null, deviceStates: [], activeSession: null },
        { status: 200 },
      );
    }

    const deviceStates = await getDashboardDeviceStates(home.id);
    const activeSession = await getActiveLeaveSessionForDashboard(home.id);

    return NextResponse.json(
      { home, deviceStates, activeSession },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 401 },
    );
  }
}
