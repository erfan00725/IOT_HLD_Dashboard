import { NextResponse } from "next/server";
import {
  getFirstHome,
  getRecentStateEventsForDashboard,
} from "@/lib/prisma/queries/dashboard";

export async function GET() {
  try {
    const home = await getFirstHome();

    if (!home) {
      return NextResponse.json([], { status: 200 });
    }

    const events = await getRecentStateEventsForDashboard(home.id);
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 401 },
    );
  }
}
