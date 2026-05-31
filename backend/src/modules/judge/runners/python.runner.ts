import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { SubmissionStatus } from "@prisma/client";

import { env } from "../../../config/env.js";
import type { CodeRunner, CompileResult, ExecutionResult, JudgeTestCase, RunnerArtifact } from "../types.js";
import {
  cleanupArtifact,
  createContainerName,
  createDockerBaseArgs,
  isDockerInfrastructureFailure,
  runDocker,
  toExecutionResult
} from "./dockerSandbox.js";

export class PythonRunner implements CodeRunner {
  async compile(code: string): Promise<CompileResult> {
    const workDir = await mkdtemp(path.join(tmpdir(), "algoforge-judge-"));
    const artifact = { workDir };
    await writeFile(path.join(workDir, "main.py"), code, "utf8");

    const containerName = createContainerName("python-check");
    const args = [
      ...createDockerBaseArgs(containerName, workDir, env.DOCKER_PYTHON_IMAGE),
      "python3",
      "-m",
      "py_compile",
      "main.py"
    ];
    const result = await runDocker(args, {
      timeoutMs: env.JUDGE_COMPILE_TIMEOUT_MS,
      containerName
    });

    if (result.timedOut || isDockerInfrastructureFailure(result)) {
      await this.cleanup(artifact);
      return {
        ok: false,
        error: result.timedOut ? "Syntax check timed out." : result.internalError ?? result.stderr,
        failureStatus: SubmissionStatus.INTERNAL_ERROR
      };
    }

    if (result.exitCode !== 0) {
      await this.cleanup(artifact);
      return {
        ok: false,
        error: result.stderr || "Python syntax check failed.",
        failureStatus: SubmissionStatus.COMPILATION_ERROR
      };
    }

    return { ok: true, artifact };
  }

  async execute(artifact: RunnerArtifact, testCase: JudgeTestCase): Promise<ExecutionResult> {
    const containerName = createContainerName("python-run");
    const args = [...createDockerBaseArgs(containerName, artifact.workDir, env.DOCKER_PYTHON_IMAGE, true), "python3", "main.py"];
    const result = await runDocker(args, {
      input: testCase.input,
      timeoutMs: env.JUDGE_RUN_TIMEOUT_MS,
      containerName
    });

    return toExecutionResult(result);
  }

  async cleanup(artifact: RunnerArtifact) {
    await cleanupArtifact(artifact);
  }
}
