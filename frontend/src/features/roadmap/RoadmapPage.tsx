import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { RoadmapResponse } from "../../types/api";
import { getRoadmap } from "./roadmapApi";

export function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getRoadmap()
      .then(setRoadmap)
      .catch((caughtError) => setError(getApiErrorMessage(caughtError)));
  }, []);

  if (error) {
    return <StateBlock title="Could not load roadmap">{error}</StateBlock>;
  }

  if (!roadmap) {
    return <StateBlock title="Loading roadmap" />;
  }

  return (
    <div>
      <PageHeader
        title="DSA Roadmap"
        description={`${roadmap.summary.solvedProblems}/${roadmap.summary.totalProblems} problems solved across ${roadmap.summary.totalTopics} interview topics.`}
      />
      <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="mb-2 flex justify-between text-sm text-slate-400">
          <span>Overall completion</span>
          <span>{roadmap.summary.completionPercent}%</span>
        </div>
        <ProgressBar value={roadmap.summary.completionPercent} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roadmap.items.map((item) => (
          <Link
            className="rounded-lg border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400/60"
            key={item.name}
            to={item.topic ? `/topics/${item.topic.slug}` : "/topics"}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">#{item.orderIndex}</p>
                <h2 className="mt-1 text-lg font-bold text-white">{item.name}</h2>
              </div>
              <span className="rounded-md bg-slate-950 px-2 py-1 text-xs text-slate-400">
                {item.solvedCount}/{item.totalProblems}
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
              {item.topic?.description ?? "Seed this topic to unlock linked problems and progress."}
            </p>
            <div className="mt-4">
              <ProgressBar value={item.completionPercent} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
