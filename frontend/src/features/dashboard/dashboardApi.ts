import { apiClient } from "../../lib/apiClient";
import type { DashboardData } from "../../types/api";

export async function getDashboard() {
  const response = await apiClient.get<DashboardData>("/dashboard");
  return response.data;
}
