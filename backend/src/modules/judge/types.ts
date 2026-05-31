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
  artifact?: RunnerArtifact;
  error?: string;
  failureStatus?: SubmissionStatus;
};

export type ExecutionResult = {
  ok: boolean;
  stdout: string;
  stderr?: string;
  executionTimeMs: number;
  memoryKb: number;
  timedOut?: boolean;
  failureStatus?: SubmissionStatus;
};

export type TestCaseResult = {
  testCaseId: string;
  isHidden: boolean;
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

export type RunnerArtifact = {
  workDir: string;
};

export interface CodeRunner {
  compile(code: string): Promise<CompileResult>;
  execute(artifact: RunnerArtifact, testCase: JudgeTestCase): Promise<ExecutionResult>;
  cleanup(artifact: RunnerArtifact): Promise<void>;
}
