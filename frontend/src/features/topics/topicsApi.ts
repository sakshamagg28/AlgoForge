import { apiClient } from "../../lib/apiClient";
import type { Problem, Topic } from "../../types/api";

export async function getTopics() {
  const response = await apiClient.get<{ topics: Topic[] }>("/topics");
  return response.data.topics;
}

export async function getTopicProblems(slug: string) {
  const response = await apiClient.get<{ topic: Topic; problems: Problem[] }>(`/topics/${slug}/problems`);
  return response.data;
}
