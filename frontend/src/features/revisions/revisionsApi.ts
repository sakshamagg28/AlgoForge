import { apiClient } from "../../lib/apiClient";
import type { Revision } from "../../types/api";

export async function getRevisions(params?: { due?: boolean; status?: "PENDING" | "COMPLETED" }) {
  const response = await apiClient.get<{ revisions: Revision[] }>("/revisions", { params });
  return response.data.revisions;
}

export async function createRevision(payload: { problemId: string; dueDate: string; note?: string }) {
  const response = await apiClient.post<{ revision: Revision }>("/revisions", payload);
  return response.data.revision;
}

export async function completeRevision(id: string) {
  const response = await apiClient.patch<{ revision: Revision }>(`/revisions/${id}/complete`);
  return response.data.revision;
}

export async function deleteRevision(id: string) {
  await apiClient.delete(`/revisions/${id}`);
}
