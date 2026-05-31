import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ProgressBar } from "../../components/ui/ProgressBar";
import { Skeleton } from "../../components/ui/Skeleton";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { DashboardData } from "../../types/api";
import { formatDateTime } from "../../utils/format";
import { useAuth } from "../auth/AuthContext";
import { getDashboard } from "./dashboardApi";

export function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch((caughtError) => setError(getApiErrorMessage(caughtError)));
  }, []);

  if (error) {
    return <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200">{error}</div>;
  }

  if (!dashboard) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-28" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  const statCards = [
    ["Total solved", dashboard.stats.totalSolved],
    ["Attempts", dashboard.stats.totalAttempts],
    ["Due revisions", dashboard.stats.dueRevisions],
    ["Roadmap", `${dashboard.stats.roadmapCompletionPercent}%`]
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Placement cockpit</p>
        <h1 className="mt-3 text-3xl font-black text-white">Welcome back, {user?.username ?? "coder"}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Your roadmap, judge verdicts, revision queue, notes, and company prep now feed into one dashboard.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {statCards.map(([label, value]) => (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Solved by topic</h2>
          <div className="mt-4 space-y-4">
            {dashboard.solvedByTopic.length === 0 ? (
              <p className="text-sm text-slate-500">Solve a problem to start topic analytics.</p>
            ) : (
              dashboard.solvedByTopic.map((item) => (
                <div key={item.topic}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">{item.topic}</span>
                    <span className="text-slate-500">{item.solved}</span>
                  </div>
                  <ProgressBar value={(item.solved / Math.max(1, dashboard.stats.totalSolved)) * 100} />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Company progress</h2>
          <div className="mt-4 space-y-3">
            {dashboard.companyProgress.map((company) => (
              <Link className="block rounded-md bg-slate-950 p-3 hover:bg-slate-800" key={company.slug} to={`/companies/${company.slug}`}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-200">{company.name}</span>
                  <span className="text-slate-500">
                    {company.solvedCount}/{company.totalProblems}
                  </span>
                </div>
                <ProgressBar value={company.completionPercent} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <h2 className="font-bold text-white">Recent activity</h2>
        <div className="mt-4 space-y-2">
          {dashboard.recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500">Activity will appear after notes, revisions, and submissions.</p>
          ) : (
            dashboard.recentActivity.map((activity) => (
              <Link className="flex justify-between rounded-md bg-slate-950 p-3 text-sm hover:bg-slate-800" key={activity.id} to={activity.href}>
                <span className="text-slate-300">{activity.label}</span>
                <span className="text-slate-500">{formatDateTime(activity.at)}</span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
