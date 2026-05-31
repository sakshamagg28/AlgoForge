import { z } from "zod";

export const revisionIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid revision id")
  })
});

export const createRevisionSchema = z.object({
  body: z.object({
    problemId: z.string().cuid("Invalid problem id"),
    dueDate: z.coerce.date(),
    note: z.string().trim().max(1000).optional()
  })
});

export const updateRevisionSchema = z.object({
  params: revisionIdSchema.shape.params,
  body: z
    .object({
      dueDate: z.coerce.date().optional(),
      note: z.string().trim().max(1000).nullable().optional(),
      status: z.enum(["PENDING", "COMPLETED"]).optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required"
    })
});

export type CreateRevisionInput = z.infer<typeof createRevisionSchema>["body"];
export type UpdateRevisionInput = z.infer<typeof updateRevisionSchema>["body"];
