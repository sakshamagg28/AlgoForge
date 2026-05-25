import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/ui/PageHeader";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { Problem, Topic } from "../../types/api";
import { difficultyClass, difficultyLabel } from "../../utils/format";
import { getTopicProblems } from "./topicsApi";

export function TopicProblemsPage() {
  const { slug } = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Topic slug is missing.");
      setIsLoading(false);
      return;
    }

    getTopicProblems(slug)
      .then((data) => {
        setTopic(data.topic);
        setProblems(data.problems);
      })
      .catch((caughtError) => setError(getApiErrorMessage(caughtError)))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return <StateBlock title="Loading topic problems" />;
  }

  if (error) {
    return <StateBlock title="Could not load problems">{error}</StateBlock>;
  }

  return (
    <div>
      <PageHeader
        title={topic?.name ?? "Topic"}
        description="Problems linked to this topic."
        action={
          topic ? <Badge className={difficultyClass(topic.difficulty)}>{difficultyLabel(topic.difficulty)}</Badge> : null
        }
      />
      {problems.length === 0 ? (
        <StateBlock title="No problems in this topic yet" />
      ) : (
        <div className="space-y-3">
          {problems.map((problem) => (
            <Link
              className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-white p-5 shadow-soft transition hover:border-moss sm:flex-row sm:items-center sm:justify-between"
              key={problem.id}
              to={`/problems/${problem.slug}`}
            >
              <div>
                <h2 className="text-lg font-bold text-ink">{problem.title}</h2>
                <p className="mt-1 text-sm text-ink/60">{problem.constraints}</p>
              </div>
              <Badge className={difficultyClass(problem.difficulty)}>{difficultyLabel(problem.difficulty)}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
