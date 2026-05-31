import { z } from "zod";

const optionalCuid = z.string().cuid().optional().nullable();

export const noteIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid note id")
  })
});

export const createNoteSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(2, "Title must be at least 2 characters").max(120),
      content: z.string().trim().min(1, "Note content is required").max(20000),
      bookmarked: z.boolean().default(false),
      important: z.boolean().default(false),
      topicId: optionalCuid,
      problemId: optionalCuid
    })
    .refine((body) => body.topicId || body.problemId, {
      message: "Link the note to a topic or problem"
    })
});

export const updateNoteSchema = z.object({
  params: noteIdSchema.shape.params,
  body: z
    .object({
      title: z.string().trim().min(2).max(120).optional(),
      content: z.string().trim().min(1).max(20000).optional(),
      bookmarked: z.boolean().optional(),
      important: z.boolean().optional(),
      topicId: optionalCuid,
      problemId: optionalCuid
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required"
    })
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>["body"];
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>["body"];
