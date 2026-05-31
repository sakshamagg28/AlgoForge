import { SubmissionStatus } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import { CppRunner } from "./runners/cpp.runner.js";
import { JavaRunner } from "./runners/java.runner.js";
import { JavaScriptRunner } from "./runners/javascript.runner.js";
import { PythonRunner } from "./runners/python.runner.js";
import type { CodeRunner, JudgeLanguage, JudgeResult, JudgeRunInput, JudgeTestCase, TestCaseResult } from "./types.js";

function normalizeOutput(output: string) {
  return output.replace(/\r\n/g, "\n").trim();
}

function compareOutput(actualOutput: string, expectedOutput: string) {
  return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
}

function getRunner(language: JudgeLanguage): CodeRunner {
  if (language === "cpp") {
    return new CppRunner();
  }

  if (language === "python") {
    return new PythonRunner();
  }

  if (language === "java") {
    return new JavaRunner();
  }

  if (language === "javascript") {
    return new JavaScriptRunner();
  }

  throw new ApiError(400, "Unsupported judge language");
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
      status: compileResult.failureStatus ?? SubmissionStatus.COMPILATION_ERROR,
      executionTimeMs: null,
      memoryKb: null,
      testCasesPassed: 0,
      totalTestCases: input.testCases.length,
      compileError: compileResult.error,
      testCaseResults: []
    };
  }

  if (!compileResult.artifact) {
    return {
      status: SubmissionStatus.INTERNAL_ERROR,
      executionTimeMs: null,
      memoryKb: null,
      testCasesPassed: 0,
      totalTestCases: input.testCases.length,
      runtimeError: "Judge artifact was not created.",
      testCaseResults: []
    };
  }

  const testCaseResults: TestCaseResult[] = [];
  let totalExecutionTimeMs = 0;
  let peakMemoryKb = 0;

  try {
    for (const testCase of input.testCases) {
      const executionResult = await runner.execute(compileResult.artifact, testCase);
      totalExecutionTimeMs += executionResult.executionTimeMs;
      peakMemoryKb = Math.max(peakMemoryKb, executionResult.memoryKb);

      if (!executionResult.ok) {
        return {
          status:
            executionResult.failureStatus ??
            (executionResult.timedOut ? SubmissionStatus.TIME_LIMIT_EXCEEDED : SubmissionStatus.RUNTIME_ERROR),
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
        isHidden: testCase.isHidden,
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
  } finally {
    await runner.cleanup(compileResult.artifact);
  }
}

export const judgeService = {
  async runCustomInput(code: string, language: JudgeLanguage, input: string) {
    const runner = getRunner(language);
    const compileResult = await runner.compile(code);

    if (!compileResult.ok) {
      return {
        status: compileResult.failureStatus ?? SubmissionStatus.COMPILATION_ERROR,
        stdout: "",
        stderr: compileResult.error ?? "",
        executionTimeMs: null,
        memoryKb: null
      };
    }

    if (!compileResult.artifact) {
      return {
        status: SubmissionStatus.INTERNAL_ERROR,
        stdout: "",
        stderr: "Judge artifact was not created.",
        executionTimeMs: null,
        memoryKb: null
      };
    }

    try {
      const result = await runner.execute(compileResult.artifact, {
        id: "custom-input",
        input,
        expectedOutput: "",
        isHidden: false
      });

      return {
        status:
          result.failureStatus ??
          (result.ok ? SubmissionStatus.ACCEPTED : result.timedOut ? SubmissionStatus.TIME_LIMIT_EXCEEDED : SubmissionStatus.RUNTIME_ERROR),
        stdout: result.stdout,
        stderr: result.stderr ?? "",
        executionTimeMs: result.executionTimeMs,
        memoryKb: result.memoryKb
      };
    } finally {
      await runner.cleanup(compileResult.artifact);
    }
  },

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
