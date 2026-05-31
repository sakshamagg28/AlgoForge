import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/ui/PageHeader";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { Submission } from "../../types/api";
import { formatDateTime, statusClass } from "../../utils/format";
import { getSubmissions } from "./submissionsApi";

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSubmissions()
      .then(setSubmissions)
      .catch((caughtError) => setError(getApiErrorMessage(caughtError)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <StateBlock title="Loading submissions" />;
  }

  if (error) {
    return <StateBlock title="Could not load submissions">{error}</StateBlock>;
  }

  return (
    <div>
      <PageHeader title="Submission History" description="Your latest mock judge attempts, newest first." />
      {submissions.length === 0 ? (
        <StateBlock title="No submissions yet">Open a problem and submit code to see results here.</StateBlock>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <Link
              className="grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-soft transition hover:border-cyan-400/60 md:grid-cols-[1fr_auto]"
              key={submission.id}
              to={`/problems/${submission.problem.slug}`}
            >
              <div>
                <h2 className="text-lg font-bold text-white">{submission.problem.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {submission.language.toUpperCase()} · {formatDateTime(submission.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <Badge className={statusClass(submission.status)}>{submission.status.replaceAll("_", " ")}</Badge>
                <span className="text-sm text-slate-500">{submission.executionTimeMs ?? 0} ms</span>
                <span className="text-sm text-slate-500">{submission.memoryKb ?? 0} KB</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
