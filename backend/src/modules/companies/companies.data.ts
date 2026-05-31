export const companies = [
  { name: "Amazon", slug: "amazon" },
  { name: "Google", slug: "google" },
  { name: "Microsoft", slug: "microsoft" },
  { name: "Uber", slug: "uber" },
  { name: "Atlassian", slug: "atlassian" },
  { name: "Adobe", slug: "adobe" }
];

export function companyNameFromSlug(slug: string) {
  return companies.find((company) => company.slug === slug)?.name;
}
