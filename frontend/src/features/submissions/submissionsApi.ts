import { apiClient } from "../../lib/apiClient";
import type { Submission, SubmissionLanguage } from "../../types/api";

export type CreateSubmissionPayload = {
  problemId: string;
  code: string;
  language: SubmissionLanguage;
};

export async function createSubmission(payload: CreateSubmissionPayload) {
  const response = await apiClient.post<{ submission: Submission }>("/submissions", payload);
  return response.data.submission;
}

export async function runCode(payload: { code: string; language: SubmissionLanguage; input: string }) {
  const response = await apiClient.post<{
    result: {
      status: Submission["status"];
      stdout: string;
      stderr: string;
      executionTimeMs: number | null;
      memoryKb: number | null;
    };
  }>("/submissions/run", payload);
  return response.data.result;
}

export async function getSubmissions() {
  const response = await apiClient.get<{ submissions: Submission[] }>("/submissions");
  return response.data.submissions;
}
