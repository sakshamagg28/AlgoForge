import { z } from "zod";

export const languageSchema = z.enum(["cpp", "java", "python", "javascript"]);

export const createSubmissionSchema = z.object({
  body: z.object({
    problemId: z.string().cuid("Invalid problem id"),
    code: z
      .string()
      .trim()
      .min(10, "Code must be at least 10 characters")
      .max(50000, "Code must be at most 50000 characters"),
    language: languageSchema
  })
});

export const submissionIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid submission id")
  })
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>["body"];
export type SubmissionLanguage = z.infer<typeof languageSchema>;
