import { z } from "zod";
import builder from "../../builder";
import { PriorityEnum, TaskType } from "./type";
import { gqlError } from "../../../errors";
import { findTaskOrThrow, taskIdSchema } from "./shared";

builder.mutationType({
  fields: (t) => ({
    addTask: t.field({
      type: TaskType,
      args: {
        title: t.arg.string({ required: true }),
        description: t.arg.string(),
      },
      validate: addTaskSchema,
      resolve: async (_, { title, description }, ctx) => {
        try {
          return await ctx.prisma.task.create({
            data: { title, ...(description != null && { description }) },
          });
        } catch {
          gqlError("Failed to create task", "INTERNAL");
        }
      },
    }),
    toggleTask: t.field({
      type: TaskType,
      nullable: true,
      args: { id: t.arg.id({ required: true }) },
      validate: toggleTaskSchema,
      resolve: async (_, { id }, ctx) => {
        const task = await findTaskOrThrow(ctx, id);
        try {
          return await ctx.prisma.task.update({
            where: { id },
            data: { completed: !task.completed },
          });
        } catch {
          gqlError("Failed to toggle task", "INTERNAL");
        }
      },
    }),
    deleteTask: t.field({
      type: TaskType,
      args: { id: t.arg.id({ required: true }) },
      validate: deleteTaskSchema,
      resolve: async (_, { id }, ctx) => {
        const task = await findTaskOrThrow(ctx, id);
        try {
          await ctx.prisma.task.delete({ where: { id } });
        } catch {
          gqlError("Failed to delete task", "INTERNAL");
        }

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
        await findTaskOrThrow(ctx, id);
        try {
          return await ctx.prisma.task.update({
            where: { id },
            data: {
              ...(title != null && { title }),
              ...(description != null && { description }),
            },
          });
        } catch {
          gqlError("Failed to edit task", "INTERNAL");
        }
      },
    }),
    setPriority: t.field({
      type: TaskType,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
        priority: t.arg({ type: PriorityEnum, required: true }),
      },
      validate: setPrioritySchema,
      resolve: async (_, { id, priority }, ctx) => {
        await findTaskOrThrow(ctx, id);
        try {
          return await ctx.prisma.task.update({
            where: { id },
            data: { priority },
          });
        } catch {
          gqlError("Failed to set priority", "INTERNAL");
        }
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
  id: taskIdSchema,
});

const deleteTaskSchema = z.object({
  id: taskIdSchema,
});

const editTaskSchema = z.object({
  id: taskIdSchema,
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
});

const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
const setPrioritySchema = z.object({
  id: taskIdSchema,
  priority: prioritySchema,
});
