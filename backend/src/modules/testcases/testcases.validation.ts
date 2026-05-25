import { z } from "zod";

export const testCaseIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid test case id")
  })
});

export const getProblemTestCasesSchema = z.object({
  params: z.object({
    problemId: z.string().cuid("Invalid problem id")
  })
});

export const createTestCaseSchema = z.object({
  body: z.object({
    problemId: z.string().cuid("Invalid problem id"),
    input: z.string().max(20000, "Input must be at most 20000 characters"),
    expectedOutput: z.string().max(20000, "Expected output must be at most 20000 characters"),
    isHidden: z.boolean().default(false)
  })
});

export const updateTestCaseSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid test case id")
  }),
  body: z
    .object({
      input: z.string().max(20000, "Input must be at most 20000 characters").optional(),
      expectedOutput: z.string().max(20000, "Expected output must be at most 20000 characters").optional(),
      isHidden: z.boolean().optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required"
    })
});

export type CreateTestCaseInput = z.infer<typeof createTestCaseSchema>["body"];
export type UpdateTestCaseInput = z.infer<typeof updateTestCaseSchema>["body"];
