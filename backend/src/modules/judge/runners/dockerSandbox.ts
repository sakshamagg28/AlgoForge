import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";

import { SubmissionStatus } from "@prisma/client";

import { env } from "../../../config/env.js";
import type { ExecutionResult, RunnerArtifact } from "../types.js";

export type DockerRunResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  durationMs: number;
  timedOut: boolean;
  internalError?: string;
};

export function createContainerName(prefix: string) {
  return `algoforge-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createDockerBaseArgs(containerName: string, workDir: string, image: string, interactive = false) {
  const args = [
    "run",
    "--rm",
    "--name",
    containerName,
    "--network",
    "none",
    "--memory",
    env.JUDGE_MEMORY_LIMIT,
    "--memory-swap",
    env.JUDGE_MEMORY_LIMIT,
    "--cpus",
    env.JUDGE_CPUS,
    "--pids-limit",
    "128",
    "--security-opt",
    "no-new-privileges",
    "--platform",
    env.DOCKER_PLATFORM,
    "-v",
    `${workDir}:/workspace`,
    "-w",
    "/workspace"
  ];

  if (interactive) {
    args.push("-i");
  }

  args.push(image);
  return args;
}

async function forceRemoveContainer(containerName: string) {
  await new Promise<void>((resolve) => {
    const child = spawn("docker", ["rm", "-f", containerName], {
      stdio: "ignore"
    });

    child.on("error", () => resolve());
    child.on("close", () => resolve());
  });
}

export function runDocker(
  args: string[],
  options: { input?: string; timeoutMs: number; containerName: string }
): Promise<DockerRunResult> {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const child = spawn("docker", args, {
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
      void forceRemoveContainer(options.containerName);
    }, options.timeoutMs);

    function appendOutput(current: string, chunk: Buffer) {
      if (current.length >= env.JUDGE_MAX_OUTPUT_BYTES) {
        return current;
      }

      return (current + chunk.toString("utf8")).slice(0, env.JUDGE_MAX_OUTPUT_BYTES);
    }

    child.stdout.on("data", (chunk: Buffer) => {
      stdout = appendOutput(stdout, chunk);
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderr = appendOutput(stderr, chunk);
    });

    child.on("error", (error) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      resolve({
        exitCode: null,
        stdout,
        stderr,
        durationMs: Date.now() - startedAt,
        timedOut,
        internalError: error.message
      });
    });

    child.on("close", (exitCode) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      resolve({
        exitCode,
        stdout,
        stderr,
        durationMs: Date.now() - startedAt,
        timedOut
      });
    });

    if (options.input) {
      child.stdin.write(options.input);
    }
    child.stdin.end();
  });
}

export function isDockerInfrastructureFailure(result: DockerRunResult) {
  return Boolean(result.internalError) || result.exitCode === 125 || result.exitCode === 126 || result.exitCode === 127;
}

export function toExecutionResult(result: DockerRunResult): ExecutionResult {
  if (result.timedOut) {
    return {
      ok: false,
      stdout: result.stdout,
      stderr: "Execution timed out.",
      executionTimeMs: env.JUDGE_RUN_TIMEOUT_MS,
      memoryKb: 0,
      timedOut: true,
      failureStatus: SubmissionStatus.TIME_LIMIT_EXCEEDED
    };
  }

  if (isDockerInfrastructureFailure(result)) {
    return {
      ok: false,
      stdout: result.stdout,
      stderr: result.internalError ?? (result.stderr || "Docker failed during execution."),
      executionTimeMs: result.durationMs,
      memoryKb: 0,
      failureStatus: SubmissionStatus.INTERNAL_ERROR
    };
  }

  if (result.exitCode !== 0) {
    return {
      ok: false,
      stdout: result.stdout,
      stderr: result.stderr || `Process exited with code ${result.exitCode}.`,
      executionTimeMs: result.durationMs,
      memoryKb: 0,
      failureStatus: SubmissionStatus.RUNTIME_ERROR
    };
  }

  return {
    ok: true,
    stdout: result.stdout,
    stderr: result.stderr,
    executionTimeMs: result.durationMs,
    memoryKb: 0
  };
}

export async function cleanupArtifact(artifact: RunnerArtifact) {
  await rm(artifact.workDir, {
    recursive: true,
    force: true
  });
}
