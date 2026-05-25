import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/ui/PageHeader";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { Topic } from "../../types/api";
import { difficultyClass, difficultyLabel } from "../../utils/format";
import { getTopics } from "./topicsApi";

export function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTopics()
      .then(setTopics)
      .catch((caughtError) => setError(getApiErrorMessage(caughtError)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <StateBlock title="Loading topics" />;
  }

  if (error) {
    return <StateBlock title="Could not load topics">{error}</StateBlock>;
  }

  return (
    <div>
      <PageHeader title="DSA Topics" description="Choose a foundation area and move into its interview problems." />
      {topics.length === 0 ? (
        <StateBlock title="No topics yet">Create topics from the backend API to start populating the learning path.</StateBlock>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <Link
              className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-moss"
              key={topic.id}
              to={`/topics/${topic.slug}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-ink">{topic.name}</h2>
                <Badge className={difficultyClass(topic.difficulty)}>{difficultyLabel(topic.difficulty)}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/65">{topic.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
