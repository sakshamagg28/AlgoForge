import { apiClient } from "../../lib/apiClient";
import type { RoadmapResponse } from "../../types/api";

export async function getRoadmap() {
  const response = await apiClient.get<RoadmapResponse>("/roadmap");
  return response.data;
}

export async function updateProblemProgress(problemId: string, payload: { attempted?: boolean; solved?: boolean; bookmarked?: boolean }) {
  const response = await apiClient.patch(`/roadmap/problems/${problemId}/progress`, payload);
  return response.data.progress;
}
