import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { Problem, Revision } from "../../types/api";
import { formatDateTime } from "../../utils/format";
import { getProblems } from "../problems/problemsApi";
import { completeRevision, createRevision, deleteRevision, getRevisions } from "./revisionsApi";

function tomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function RevisionsPage() {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemId, setProblemId] = useState("");
  const [dueDate, setDueDate] = useState(tomorrowDate());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [loadedRevisions, loadedProblems] = await Promise.all([getRevisions(), getProblems()]);
    setRevisions(loadedRevisions);
    setProblems(loadedProblems);
    if (!problemId && loadedProblems[0]) {
      setProblemId(loadedProblems[0].id);
    }
  }

  useEffect(() => {
    load().catch((caughtError) => setError(getApiErrorMessage(caughtError)));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await createRevision({ problemId, dueDate: new Date(dueDate).toISOString(), note });
      setNote("");
      await load();
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    }
  }

  return (
    <div>
      <PageHeader title="Revision Tracker" description="Schedule problems for spaced repetition and close the loop after review." />
      {error ? <StateBlock title="Revision error">{error}</StateBlock> : null}
      <section className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <form className="rounded-lg border border-slate-800 bg-slate-900 p-5" onSubmit={handleSubmit}>
          <h2 className="font-bold text-white">Schedule revision</h2>
          <select
            className="mt-4 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={problemId}
            onChange={(event) => setProblemId(event.target.value)}
          >
            {problems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.title}
              </option>
            ))}
          </select>
          <input
            className="mt-3 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
          <textarea
            className="mt-3 min-h-28 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            placeholder="What should you revisit?"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button className="mt-4 w-full" type="submit">
            Add revision
          </Button>
        </form>
        <div className="space-y-3">
          {revisions.length === 0 ? (
            <StateBlock title="No revisions scheduled" />
          ) : (
            revisions.map((revision) => (
              <article className="rounded-lg border border-slate-800 bg-slate-900 p-5" key={revision.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link className="font-bold text-white hover:text-cyan-300" to={`/problems/${revision.problem.slug}`}>
                      {revision.problem.title}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      Due {formatDateTime(revision.dueDate)} · {revision.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {revision.status === "PENDING" ? (
                      <Button type="button" onClick={() => completeRevision(revision.id).then(load)}>
                        Revised
                      </Button>
                    ) : null}
                    <Button type="button" variant="danger" onClick={() => deleteRevision(revision.id).then(load)}>
                      Delete
                    </Button>
                  </div>
                </div>
                {revision.note ? <p className="mt-3 text-sm text-slate-400">{revision.note}</p> : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
