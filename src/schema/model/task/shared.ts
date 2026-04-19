import { z } from "zod";
import { notFound } from "../../../errors";
import type { GraphQLContext } from "../../../context";

export const taskIdSchema = z.uuid("Invalid ID format");

// This function will find a task in Prisma or throw an error if it doesn't exist.
// Helps to avoid repeating the same code in multiple resolvers.
export async function findTaskOrThrow(ctx: GraphQLContext, id: string) {
  const task = await ctx.prisma.task.findUnique({ where: { id } });
  if (!task) notFound("Task", id);
  return task;
}
