import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema/index";
import { prisma } from "./context.ts";

async function main() {
  const yoga = createYoga({ schema, context: { prisma } });
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
