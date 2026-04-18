import { z } from "zod";
import builder from "../../builder";
import { TaskType } from "./type";

builder.mutationType({
  fields: (t) => ({
    addTask: t.field({
      type: TaskType,
      args: {
        title: t.arg.string({ required: true }),
        description: t.arg.string(),
      },
      validate: addTaskSchema,
      resolve: (_, { title, description }, ctx) => {
        return ctx.prisma.task.create({
          data: { title, ...(description && { description }) },
        });
      },
    }),
    toggleTask: t.field({
      type: TaskType,
      nullable: true,
      args: { id: t.arg.id({ required: true }) },
      validate: toggleTaskSchema,
      resolve: async (_, { id }, ctx) => {
        const task = await ctx.prisma.task.findUnique({ where: { id } });
        if (!task) return null;
        return ctx.prisma.task.update({
          where: { id },
          data: { completed: !task.completed },
        });
      },
    }),
    deleteTask: t.field({
      type: TaskType,
      args: { id: t.arg.id({ required: true }) },
      validate: deleteTaskSchema,
      resolve: async (_, { id }, ctx) => {
        const task = await ctx.prisma.task.findUnique({ where: { id } });
        if (!task) return null;
        await ctx.prisma.task.delete({ where: { id } });
        return task;
      },
    }),
    editTask: t.field({
      type: TaskType,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
        title: t.arg.string(),
        description: t.arg.string(),
      },
      validate: editTaskSchema,
      resolve: async (_, { id, title, description }, ctx) => {
        return ctx.prisma.task.update({
          where: { id },
          data: {
            ...(title != null && { title }),
            ...(description != null && { description }),
          },
        });
      },
    }),
  }),
});

//ZOD SCHEMAS
const titleSchema = z
  .string()
  .min(1, "Title cannot be empty")
  .max(100, "Title must be less than 100 characters");

const descriptionSchema = z
  .string()
  .min(1, "Description cannot be empty")
  .max(500, "Description must be less than 500 characters")
  .optional();

const addTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
});

const toggleTaskSchema = z.object({
  id: z.uuid("Invalid ID format"),
});

const deleteTaskSchema = z.object({
  id: z.uuid("Invalid ID format"),
});

const editTaskSchema = z.object({
  id: z.uuid("Invalid ID format"),
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
});
