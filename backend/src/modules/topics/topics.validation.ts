import { z } from "zod";

const difficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);

export const getTopicBySlugSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1, "Topic slug is required")
  })
});

export const topicIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid topic id")
  })
});

export const createTopicSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Topic name must be at least 2 characters")
      .max(80, "Topic name must be at most 80 characters"),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be at most 500 characters"),
    difficulty: difficultySchema,
    orderIndex: z.coerce.number().int().min(0, "Order index cannot be negative")
  })
});

export const updateTopicSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid topic id")
  }),
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Topic name must be at least 2 characters")
        .max(80, "Topic name must be at most 80 characters")
        .optional(),
      description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be at most 500 characters")
        .optional(),
      difficulty: difficultySchema.optional(),
      orderIndex: z.coerce.number().int().min(0, "Order index cannot be negative").optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required"
    })
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>["body"];
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>["body"];
