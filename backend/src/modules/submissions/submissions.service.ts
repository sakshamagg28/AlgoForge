import { SubmissionStatus, type Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import { judgeService } from "../judge/judge.service.js";
import type { JudgeLanguage, JudgeResult } from "../judge/types.js";
import type { CreateSubmissionInput, RunCodeInput } from "./submissions.validation.js";

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

function createPublicJudgeOutput(judgeResult: JudgeResult): Prisma.InputJsonObject {
  return {
    status: judgeResult.status,
    testCaseResults: judgeResult.testCaseResults.map((result, index) => ({
      index: index + 1,
      isHidden: result.isHidden,
      passed: result.passed,
      executionTimeMs: result.executionTimeMs,
      memoryKb: result.memoryKb,
      ...(!result.isHidden
        ? {
            expectedOutput: result.expectedOutput,
            actualOutput: result.actualOutput
          }
        : {})
    }))
  };
}

export const submissionsService = {
  async runCode(input: RunCodeInput) {
    return judgeService.runCustomInput(input.code, input.language as JudgeLanguage, input.input);
  },

  async createSubmission(userId: string, input: CreateSubmissionInput) {
    const problem = await prisma.problem.findUnique({
      where: { id: input.problemId },
      select: { id: true }
    });

    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }

    const judgeResult = await judgeService.judgeProblemSubmission(
      input.problemId,
      input.code,
      input.language as JudgeLanguage
    );

    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId: input.problemId,
        code: input.code,
        language: input.language,
        status: judgeResult.status,
        executionTimeMs: judgeResult.executionTimeMs,
        memoryKb: judgeResult.memoryKb,
        testCasesPassed: judgeResult.testCasesPassed,
        totalTestCases: judgeResult.totalTestCases,
        compileError: judgeResult.compileError,
        runtimeError: judgeResult.runtimeError,
        judgeOutput: createPublicJudgeOutput(judgeResult)
      },
      include: submissionInclude
    });

    await prisma.problemProgress.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId: input.problemId
        }
      },
      create: {
        userId,
        problemId: input.problemId,
        attempted: true,
        solved: judgeResult.status === SubmissionStatus.ACCEPTED,
        solvedAt: judgeResult.status === SubmissionStatus.ACCEPTED ? new Date() : null
      },
      update: {
        attempted: true,
        solved: judgeResult.status === SubmissionStatus.ACCEPTED ? true : undefined,
        solvedAt: judgeResult.status === SubmissionStatus.ACCEPTED ? new Date() : undefined
      }
    });

    return submission;
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
