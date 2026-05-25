import type { CodeRunner, CompileResult, ExecutionResult, JudgeTestCase } from "../types.js";

function deterministicMetric(seed: string, min: number, max: number) {
  let hash = 0;

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return min + (hash % (max - min + 1));
}

export class CppRunner implements CodeRunner {
  async compile(code: string): Promise<CompileResult> {
    if (/\bCOMPILE_ERROR\b|\bsyntax_error\b|#include\s*<bad>/i.test(code)) {
      return {
        ok: false,
        error: "Compilation failed in deterministic judge placeholder."
      };
    }

    return { ok: true };
  }

  async execute(code: string, testCase: JudgeTestCase): Promise<ExecutionResult> {
    const metricSeed = `${code.length}:${testCase.input.length}:${testCase.expectedOutput.length}`;

    if (/while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)|\bTIME_LIMIT_EXCEEDED\b/i.test(code)) {
      return {
        ok: false,
        stdout: "",
        stderr: "Execution timed out in deterministic judge placeholder.",
        executionTimeMs: 1000,
        memoryKb: deterministicMetric(metricSeed, 16000, 96000),
        timedOut: true
      };
    }

    if (/\bRUNTIME_ERROR\b|\bsegfault\b|throw\s+runtime_error/i.test(code)) {
      return {
        ok: false,
        stdout: "",
        stderr: "Runtime error in deterministic judge placeholder.",
        executionTimeMs: deterministicMetric(metricSeed, 20, 180),
        memoryKb: deterministicMetric(metricSeed, 16000, 96000)
      };
    }

    if (/\bWRONG_ANSWER\b|cout\s*<<\s*0\s*;|print\s*\(\s*0\s*\)/i.test(code)) {
      return {
        ok: true,
        stdout: "__wrong_output__",
        executionTimeMs: deterministicMetric(metricSeed, 20, 220),
        memoryKb: deterministicMetric(metricSeed, 16000, 96000)
      };
    }

    return {
      ok: true,
      stdout: testCase.expectedOutput,
      executionTimeMs: deterministicMetric(metricSeed, 20, 220),
      memoryKb: deterministicMetric(metricSeed, 16000, 96000)
    };
  }
}
