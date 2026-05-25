import { Link } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../auth/AuthContext";

const actions = [
  {
    title: "Browse DSA topics",
    description: "Start from a topic and move into curated problems.",
    to: "/topics"
  },
  {
    title: "Review submissions",
    description: "See your latest mock judge attempts and results.",
    to: "/submissions"
  }
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.username ?? "coder"}`} description="Your AlgoForge workspace is ready." />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-ink/60">Signed in as</p>
          <p className="mt-2 text-lg font-bold text-ink">{user?.email}</p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-ink/60">Backend session</p>
          <p className="mt-2 text-lg font-bold text-moss">Cookie auth active</p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-ink/60">Judge mode</p>
          <p className="mt-2 text-lg font-bold text-amber">Mock submissions</p>
        </div>
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <Link
            className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-moss"
            key={action.to}
            to={action.to}
          >
            <h2 className="text-xl font-bold text-ink">{action.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">{action.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
