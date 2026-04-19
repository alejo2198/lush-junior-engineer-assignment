import builder from "../../builder";
import { TaskType } from "./type";
import { z } from "zod";
import { findTaskOrThrow, taskIdSchema } from "./shared";

builder.queryType({
  fields: (t) => ({
    //Query to get a single task by ID and to get all tasks
    task: t.field({
      type: TaskType,
      nullable: true,
      args: { id: t.arg.id({ required: true }) },
      validate: taskQuerySchema,
      resolve: async (_, { id }, ctx) => findTaskOrThrow(ctx, id),
    }),
    tasks: t.field({
      type: [TaskType],
      nullable: false,
      // No error handling needed here since we're just returning an empty array if there are no tasks, which is a valid response.
      resolve: (_, {}, ctx) => ctx.prisma.task.findMany({}),
    }),
  }),
});

// ZOD SCHEMAS
const taskQuerySchema = z.object({
  id: taskIdSchema,
});
