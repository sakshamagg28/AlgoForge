import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/ui/PageHeader";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { CompanyProgress, Problem } from "../../types/api";
import { difficultyClass, difficultyLabel } from "../../utils/format";
import { getCompanyProblems } from "./companiesApi";

export function CompanyProblemsPage() {
  const { slug } = useParams();
  const [company, setCompany] = useState<CompanyProgress | null>(null);
  const [problems, setProblems] = useState<Array<Problem & { solved: boolean }>>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Company slug is missing.");
      return;
    }

    getCompanyProblems(slug)
      .then((data) => {
        setCompany(data.company);
        setProblems(data.problems);
      })
      .catch((caughtError) => setError(getApiErrorMessage(caughtError)));
  }, [slug]);

  if (error) {
    return <StateBlock title="Could not load company problems">{error}</StateBlock>;
  }

  return (
    <div>
      <PageHeader title={company?.name ?? "Company"} description="Company-tagged practice set." />
      <div className="space-y-3">
        {problems.map((problem) => (
          <Link
            className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400/60 sm:flex-row sm:items-center sm:justify-between"
            key={problem.id}
            to={`/problems/${problem.slug}`}
          >
            <div>
              <h2 className="text-lg font-bold text-white">{problem.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{problem.topic.name}</p>
            </div>
            <div className="flex gap-2">
              {problem.solved ? <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">Solved</Badge> : null}
              <Badge className={difficultyClass(problem.difficulty)}>{difficultyLabel(problem.difficulty)}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
