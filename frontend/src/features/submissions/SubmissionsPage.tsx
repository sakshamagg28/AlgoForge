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
              className="grid gap-3 rounded-lg border border-ink/10 bg-white p-5 shadow-soft transition hover:border-moss md:grid-cols-[1fr_auto]"
              key={submission.id}
              to={`/problems/${submission.problem.slug}`}
            >
              <div>
                <h2 className="text-lg font-bold text-ink">{submission.problem.title}</h2>
                <p className="mt-1 text-sm text-ink/60">
                  {submission.language.toUpperCase()} · {formatDateTime(submission.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <Badge className={statusClass(submission.status)}>{submission.status.replaceAll("_", " ")}</Badge>
                <span className="text-sm text-ink/65">{submission.executionTimeMs} ms</span>
                <span className="text-sm text-ink/65">{submission.memoryKb} KB</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
