import { z } from "zod";

export const updateProblemProgressSchema = z.object({
  params: z.object({
    problemId: z.string().cuid("Invalid problem id")
  }),
  body: z
    .object({
      attempted: z.boolean().optional(),
      solved: z.boolean().optional(),
      bookmarked: z.boolean().optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one progress field is required"
    })
});

export type UpdateProblemProgressInput = z.infer<typeof updateProblemProgressSchema>["body"];
