import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Priority } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existingTasksCount = await prisma.task.count();

  // don't seed for repeated container restarts.
  if (existingTasksCount > 0) {
    console.log("Seed skipped: tasks already exist.");
    return;
  }

  await prisma.task.createMany({
    data: [
      {
        title: "Watch the Raptors. Game",
        description: "Turn on TNT and hope they can beat the cavs.",
        priority: Priority.HIGH,
      },
      {
        title: "Wash the dishes",
        description: "Use a new sponge too. This one is getting old.",
        priority: Priority.MEDIUM,
      },
      {
        title: "Clean my room",
        description: "Gotta stay nice and tidy",
        priority: Priority.MEDIUM,
      },
      {
        title: "Go for a run",
        description:
          "My quarter life crisis is making me run a half marathon. I need to get in shape.",
        priority: Priority.HIGH,
      },
      {
        title: "Call my mom",
        description: "I should probably check in with her.",
        priority: Priority.LOW,
      },
    ],
  });

  console.log("Seed completed: 5 tasks created.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
