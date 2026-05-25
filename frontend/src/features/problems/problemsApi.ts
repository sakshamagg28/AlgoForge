import { apiClient } from "../../lib/apiClient";
import type { Problem } from "../../types/api";

export async function getProblem(slug: string) {
  const response = await apiClient.get<{ problem: Problem }>(`/problems/${slug}`);
  return response.data.problem;
}
