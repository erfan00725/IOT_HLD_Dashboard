import { redirect } from "next/navigation";
import { ROUT_PATHS } from "@/lib/constants/routPaths";

export default async function Home() {
  redirect(ROUT_PATHS.DASHBOARD);

  return null;
}
