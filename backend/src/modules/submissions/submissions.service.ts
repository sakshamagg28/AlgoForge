import { SubmissionStatus, type Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateSubmissionInput } from "./submissions.validation.js";

const submissionInclude = {
  problem: {
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      topic: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  }
} satisfies Prisma.SubmissionInclude;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function runMockJudge() {
  return {
    status: SubmissionStatus.ACCEPTED,
    executionTimeMs: randomInt(24, 240),
    memoryKb: randomInt(12000, 96000),
    testCasesPassed: 10,
    totalTestCases: 10
  };
}

export const submissionsService = {
  async createSubmission(userId: string, input: CreateSubmissionInput) {
    const problem = await prisma.problem.findUnique({
      where: { id: input.problemId },
      select: { id: true }
    });

    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }

    const judgeResult = runMockJudge();

    return prisma.submission.create({
      data: {
        userId,
        problemId: input.problemId,
        code: input.code,
        language: input.language,
        status: judgeResult.status,
        executionTimeMs: judgeResult.executionTimeMs,
        memoryKb: judgeResult.memoryKb,
        testCasesPassed: judgeResult.testCasesPassed,
        totalTestCases: judgeResult.totalTestCases
      },
      include: submissionInclude
    });
  },

  async getUserSubmissions(userId: string) {
    return prisma.submission.findMany({
      where: { userId },
      include: submissionInclude,
      orderBy: { createdAt: "desc" }
    });
  },

  async getUserSubmissionById(userId: string, submissionId: string) {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: submissionInclude
    });

    if (!submission) {
      throw new ApiError(404, "Submission not found");
    }

    if (submission.userId !== userId) {
      throw new ApiError(403, "You do not have access to this submission");
    }

    return submission;
  }
};
