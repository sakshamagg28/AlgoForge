import { apiClient } from "../../lib/apiClient";
import type { CompanyProgress, Problem } from "../../types/api";

export async function getCompanies() {
  const response = await apiClient.get<{ companies: CompanyProgress[] }>("/companies");
  return response.data.companies;
}

export async function getCompanyProblems(slug: string) {
  const response = await apiClient.get<{ company: CompanyProgress; problems: Array<Problem & { solved: boolean }> }>(
    `/companies/${slug}/problems`
  );
  return response.data;
}
