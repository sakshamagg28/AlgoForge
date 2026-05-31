import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  JSON_BODY_LIMIT: z.string().default("1mb"),
  DOCKER_CPP_IMAGE: z.string().default("gcc:13"),
  DOCKER_PYTHON_IMAGE: z.string().default("python:3.12-slim"),
  DOCKER_JAVA_IMAGE: z.string().default("eclipse-temurin:21-jdk"),
  DOCKER_JAVASCRIPT_IMAGE: z.string().default("node:22-slim"),
  DOCKER_PLATFORM: z.string().default("linux/arm64"),
  JUDGE_COMPILE_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  JUDGE_RUN_TIMEOUT_MS: z.coerce.number().int().positive().default(3000),
  JUDGE_MEMORY_LIMIT: z.string().default("256m"),
  JUDGE_CPUS: z.string().default("1"),
  JUDGE_MAX_OUTPUT_BYTES: z.coerce.number().int().positive().default(65536)
});

export const env = envSchema.parse(process.env);
