import { redirect } from "next/navigation";
import { ROUT_PATHS } from "@/lib/constants/routPaths";
import { getFirstHome } from "@/lib/prisma/queries/dashboard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // for (let i = 0; i < 20; i++) {
  //   const res = await prisma.device_state_events.findMany({
  //     take: 1,
  //   });

  //   console.log(i, "ok", res.length);
  // }

  // return <div>Home</div>;
  redirect(ROUT_PATHS.DASHBOARD);

  return null;
}
