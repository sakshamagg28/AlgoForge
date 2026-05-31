import { apiClient } from "../../lib/apiClient";
import type { Problem } from "../../types/api";

export async function getProblems(params?: { company?: string; topic?: string; difficulty?: string; search?: string }) {
  const response = await apiClient.get<{ problems: Problem[] }>("/problems", { params });
  return response.data.problems;
}

export async function getProblem(slug: string) {
  const response = await apiClient.get<{ problem: Problem }>(`/problems/${slug}`);
  return response.data.problem;
}
