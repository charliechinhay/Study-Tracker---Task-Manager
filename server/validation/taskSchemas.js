import { z } from "zod";
import { CATEGORIES, PRIORITIES } from "../constants/tasks.js";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

// FormData invia tutto come stringa: "true"/"false" 
const booleanField = z.preprocess(
  (v) => (v === "true" ? true : v === "false" ? false : v),
  z.boolean({ error: "Must be true or false" }),
);

// "" o null - nessuna scadenza; altrimenti una data valida
const dueDateField = z.preprocess(
  (v) => (v === "" ? null : v),
  z.coerce.date({ error: "Invalid due date" }).nullable(),
);

const titleField = z
  .string({ error: "Title is required" })
  .trim()
  .min(1, "Title is required")
  .max(200, "Title must be at most 200 characters");

const descriptionField = z
  .string()
  .trim()
  .max(2000, "Description must be at most 2000 characters");

export const createTaskSchema = z.object({
  title: titleField,
  description: descriptionField.optional(),
  priority: z.enum(PRIORITIES).optional(),
  category: z.enum(CATEGORIES).optional(),
  dueDate: dueDateField.optional(),
});

// campi modificabili - solo quelli definiti nello schema di update
export const updateTaskSchema = z.object({
  title: titleField.optional(),
  description: descriptionField.optional(),
  priority: z.enum(PRIORITIES).optional(),
  category: z.enum(CATEGORIES).optional(),
  dueDate: dueDateField.optional(),
  completed: booleanField.optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export const reorderTasksSchema = z.object({
  tasks: z
    .array(z.object({ _id: objectIdSchema }), { error: "tasks must be an array" })
    .min(1, "tasks must not be empty")
    .max(500, "Too many tasks"),
});