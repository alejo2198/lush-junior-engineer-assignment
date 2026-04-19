import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema/index";
import { prisma } from "./context.ts";

async function main() {
  // I kept getting a cors error on the Yoga GraphiQL interface, so I set up cors to be accepted from any origin.
  // In production I would sync it to my frontend domain.
  const yoga = createYoga({
    schema,
    context: { prisma },
    cors: {
      origin: "*",
      credentials: false,
    },
  });

  //I also binded the server to "0.0.0.0" instead of "localhost" to allow it to be accessed from outside the container,
  //which let me run a docker environment
  const server = createServer(yoga);
  server.listen(4000, "0.0.0.0", () => {
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
