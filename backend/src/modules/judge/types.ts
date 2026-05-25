import type { SubmissionStatus } from "@prisma/client";

export type JudgeLanguage = "cpp" | "java" | "python" | "javascript";

export type JudgeTestCase = {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
};

export type CompileResult = {
  ok: boolean;
  error?: string;
};

export type ExecutionResult = {
  ok: boolean;
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
  memoryKb: number;
  timedOut?: boolean;
};

export type TestCaseResult = {
  testCaseId: string;
  passed: boolean;
  expectedOutput: string;
  actualOutput: string;
  executionTimeMs: number;
  memoryKb: number;
};

export type JudgeResult = {
  status: SubmissionStatus;
  executionTimeMs: number | null;
  memoryKb: number | null;
  testCasesPassed: number;
  totalTestCases: number;
  compileError?: string;
  runtimeError?: string;
  testCaseResults: TestCaseResult[];
};

export type JudgeRunInput = {
  code: string;
  language: JudgeLanguage;
  testCases: JudgeTestCase[];
};

export interface CodeRunner {
  compile(code: string): Promise<CompileResult>;
  execute(code: string, testCase: JudgeTestCase): Promise<ExecutionResult>;
}
