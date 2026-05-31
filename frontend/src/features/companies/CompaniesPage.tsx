import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { CompanyProgress } from "../../types/api";
import { getCompanies } from "./companiesApi";

export function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyProgress[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getCompanies()
      .then(setCompanies)
      .catch((caughtError) => setError(getApiErrorMessage(caughtError)));
  }, []);

  if (error) {
    return <StateBlock title="Could not load companies">{error}</StateBlock>;
  }

  return (
    <div>
      <PageHeader title="Company Prep" description="Track progress through company-tagged interview questions." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <Link
            className="rounded-lg border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400/60"
            key={company.slug}
            to={`/companies/${company.slug}`}
          >
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-xl font-bold text-white">{company.name}</h2>
              <span className="rounded-md bg-slate-950 px-2 py-1 text-xs text-slate-400">
                {company.solvedCount}/{company.totalProblems}
              </span>
            </div>
            <ProgressBar value={company.completionPercent} />
          </Link>
        ))}
      </div>
    </div>
  );
}
