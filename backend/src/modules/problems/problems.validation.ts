import { z } from "zod";

const difficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);

const exampleSchema = z.object({
  input: z.string().trim().min(1, "Example input is required"),
  output: z.string().trim().min(1, "Example output is required"),
  explanation: z.string().trim().optional()
});

const starterCodeSchema = z
  .record(
    z.string().trim().min(1, "Language key is required"),
    z.string().min(1, "Starter code cannot be empty")
  )
  .refine((starterCode) => Object.keys(starterCode).length > 0, {
    message: "At least one starter code language is required"
  });

export const getProblemBySlugSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1, "Problem slug is required")
  })
});

export const problemIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid problem id")
  })
});

export const createProblemSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Problem title must be at least 3 characters")
      .max(120, "Problem title must be at most 120 characters"),
    statement: z
      .string()
      .trim()
      .min(20, "Statement must be at least 20 characters")
      .max(10000, "Statement must be at most 10000 characters"),
    difficulty: difficultySchema,
    constraints: z
      .string()
      .trim()
      .min(3, "Constraints must be at least 3 characters")
      .max(3000, "Constraints must be at most 3000 characters"),
    examples: z.array(exampleSchema).min(1, "At least one example is required"),
    hints: z.array(z.string().trim().min(1, "Hint cannot be empty")).default([]),
    editorial: z.string().trim().max(10000, "Editorial must be at most 10000 characters").optional(),
    starterCode: starterCodeSchema,
    topicId: z.string().cuid("Invalid topic id")
  })
});

export const updateProblemSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid problem id")
  }),
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(3, "Problem title must be at least 3 characters")
        .max(120, "Problem title must be at most 120 characters")
        .optional(),
      statement: z
        .string()
        .trim()
        .min(20, "Statement must be at least 20 characters")
        .max(10000, "Statement must be at most 10000 characters")
        .optional(),
      difficulty: difficultySchema.optional(),
      constraints: z
        .string()
        .trim()
        .min(3, "Constraints must be at least 3 characters")
        .max(3000, "Constraints must be at most 3000 characters")
        .optional(),
      examples: z.array(exampleSchema).min(1, "At least one example is required").optional(),
      hints: z.array(z.string().trim().min(1, "Hint cannot be empty")).optional(),
      editorial: z.string().trim().max(10000, "Editorial must be at most 10000 characters").nullable().optional(),
      starterCode: starterCodeSchema.optional(),
      topicId: z.string().cuid("Invalid topic id").optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required"
    })
});

export type CreateProblemInput = z.infer<typeof createProblemSchema>["body"];
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>["body"];
