import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema.ts";
import { prisma } from "./context.ts";

async function main() {
  const task = await prisma.task.create({
    data: {
      title: "Test Task",
      description: "This is a test task",
    },
  });
  console.log("Created task:", task);
  const yoga = createYoga({ schema });
  const server = createServer(yoga);
  server.listen(4000, () => {
    console.info("Server is running on http://localhost:4000/graphql");
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
