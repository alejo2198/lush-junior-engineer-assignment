import builder from "../../builder";
import { TaskType } from "./type";
import { z } from "zod";

builder.queryType({
  fields: (t) => ({
    //Query to get a single task by ID and to get all tasks
    task: t.field({
      type: TaskType,
      nullable: true,
      args: { id: t.arg.id({ required: true }) },
      validate: taskQuerySchema,
      resolve: (_, { id }, ctx) =>
        ctx.prisma.task.findUnique({ where: { id } }),
    }),
    tasks: t.field({
      type: [TaskType],
      nullable: false,
      resolve: (_, {}, ctx) => ctx.prisma.task.findMany({}),
    }),
  }),
});

// ZOD SCHEMAS
const taskQuerySchema = z.object({
  id: z.uuid("Invalid ID format"),
});
