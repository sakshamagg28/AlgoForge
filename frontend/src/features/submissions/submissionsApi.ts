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

export async function getSubmissions() {
  const response = await apiClient.get<{ submissions: Submission[] }>("/submissions");
  return response.data.submissions;
}
