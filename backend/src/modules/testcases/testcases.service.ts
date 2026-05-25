import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateTestCaseInput, UpdateTestCaseInput } from "./testcases.validation.js";

async function ensureProblemExists(problemId: string) {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true }
  });

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }
}

export const testCasesService = {
  async getProblemTestCases(problemId: string) {
    await ensureProblemExists(problemId);

    return prisma.testCase.findMany({
      where: { problemId },
      orderBy: { createdAt: "asc" }
    });
  },

  async createTestCase(input: CreateTestCaseInput) {
    await ensureProblemExists(input.problemId);

    return prisma.testCase.create({
      data: {
        problemId: input.problemId,
        input: input.input,
        expectedOutput: input.expectedOutput,
        isHidden: input.isHidden
      }
    });
  },

  async updateTestCase(id: string, input: UpdateTestCaseInput) {
    const existingTestCase = await prisma.testCase.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!existingTestCase) {
      throw new ApiError(404, "Test case not found");
    }

    return prisma.testCase.update({
      where: { id },
      data: {
        input: input.input,
        expectedOutput: input.expectedOutput,
        isHidden: input.isHidden
      }
    });
  },

  async deleteTestCase(id: string) {
    const existingTestCase = await prisma.testCase.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!existingTestCase) {
      throw new ApiError(404, "Test case not found");
    }

    await prisma.testCase.delete({
      where: { id }
    });
  }
};
