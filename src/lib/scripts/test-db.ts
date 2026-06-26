// scripts/test-db.ts

import { prisma } from "@/lib/prisma";

async function main() {
  for (let i = 0; i < 20; i++) {
    const res = await prisma.device_state_events.findMany({
      take: 1,
    });

    console.log(i, "ok", res.length);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
