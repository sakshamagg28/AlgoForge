import { SubmissionStatus } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import { CppRunner } from "./runners/cpp.runner.js";
import type { CodeRunner, JudgeLanguage, JudgeResult, JudgeRunInput, JudgeTestCase, TestCaseResult } from "./types.js";

function normalizeOutput(output: string) {
  return output.replace(/\r\n/g, "\n").trim();
}

function compareOutput(actualOutput: string, expectedOutput: string) {
  return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
}

function getRunner(_language: JudgeLanguage): CodeRunner {
  return new CppRunner();
}

function createFallbackTestCase(): JudgeTestCase {
  return {
    id: "fallback",
    input: "",
    expectedOutput: "",
    isHidden: false
  };
}

async function runJudge(input: JudgeRunInput): Promise<JudgeResult> {
  const runner = getRunner(input.language);
  const compileResult = await runner.compile(input.code);

  if (!compileResult.ok) {
    return {
      status: SubmissionStatus.COMPILATION_ERROR,
      executionTimeMs: null,
      memoryKb: null,
      testCasesPassed: 0,
      totalTestCases: input.testCases.length,
      compileError: compileResult.error,
      testCaseResults: []
    };
  }

  const testCaseResults: TestCaseResult[] = [];
  let totalExecutionTimeMs = 0;
  let peakMemoryKb = 0;

  for (const testCase of input.testCases) {
    const executionResult = await runner.execute(input.code, testCase);
    totalExecutionTimeMs += executionResult.executionTimeMs;
    peakMemoryKb = Math.max(peakMemoryKb, executionResult.memoryKb);

    if (executionResult.timedOut) {
      return {
        status: SubmissionStatus.TIME_LIMIT_EXCEEDED,
        executionTimeMs: totalExecutionTimeMs,
        memoryKb: peakMemoryKb,
        testCasesPassed: testCaseResults.filter((result) => result.passed).length,
        totalTestCases: input.testCases.length,
        runtimeError: executionResult.stderr,
        testCaseResults
      };
    }

    if (!executionResult.ok) {
      return {
        status: SubmissionStatus.RUNTIME_ERROR,
        executionTimeMs: totalExecutionTimeMs,
        memoryKb: peakMemoryKb,
        testCasesPassed: testCaseResults.filter((result) => result.passed).length,
        totalTestCases: input.testCases.length,
        runtimeError: executionResult.stderr,
        testCaseResults
      };
    }

    const passed = compareOutput(executionResult.stdout, testCase.expectedOutput);
    testCaseResults.push({
      testCaseId: testCase.id,
      passed,
      expectedOutput: testCase.expectedOutput,
      actualOutput: executionResult.stdout,
      executionTimeMs: executionResult.executionTimeMs,
      memoryKb: executionResult.memoryKb
    });

    if (!passed) {
      return {
        status: SubmissionStatus.WRONG_ANSWER,
        executionTimeMs: totalExecutionTimeMs,
        memoryKb: peakMemoryKb,
        testCasesPassed: testCaseResults.filter((result) => result.passed).length,
        totalTestCases: input.testCases.length,
        testCaseResults
      };
    }
  }

  return {
    status: SubmissionStatus.ACCEPTED,
    executionTimeMs: totalExecutionTimeMs,
    memoryKb: peakMemoryKb,
    testCasesPassed: testCaseResults.length,
    totalTestCases: input.testCases.length,
    testCaseResults
  };
}

export const judgeService = {
  async judgeProblemSubmission(problemId: string, code: string, language: JudgeLanguage) {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: {
        id: true,
        testCases: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            input: true,
            expectedOutput: true,
            isHidden: true
          }
        }
      }
    });

    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }

    const testCases = problem.testCases.length > 0 ? problem.testCases : [createFallbackTestCase()];

    return runJudge({
      code,
      language,
      testCases
    });
  }
};
