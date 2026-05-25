import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { Problem, Submission, SubmissionLanguage } from "../../types/api";
import { difficultyClass, difficultyLabel, statusClass } from "../../utils/format";
import { createSubmission } from "../submissions/submissionsApi";
import { getProblem } from "./problemsApi";

const languageLabels: Record<SubmissionLanguage, string> = {
  cpp: "C++",
  java: "Java",
  python: "Python",
  javascript: "JavaScript"
};

export function ProblemDetailPage() {
  const { slug } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<SubmissionLanguage>("cpp");
  const [code, setCode] = useState("");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("Problem slug is missing.");
      setIsLoading(false);
      return;
    }

    getProblem(slug)
      .then((loadedProblem) => {
        setProblem(loadedProblem);
        const firstStarterCode = loadedProblem.starterCode.cpp ?? Object.values(loadedProblem.starterCode)[0] ?? "";
        setCode(firstStarterCode);
      })
      .catch((caughtError) => setError(getApiErrorMessage(caughtError)))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const starterEntries = useMemo(() => Object.entries(problem?.starterCode ?? {}), [problem]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSubmission(null);

    if (!problem) {
      return;
    }

    if (code.trim().length < 10) {
      setSubmitError("Code must be at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createSubmission({
        problemId: problem.id,
        code,
        language
      });
      setSubmission(result);
    } catch (caughtError) {
      setSubmitError(getApiErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <StateBlock title="Loading problem" />;
  }

  if (error || !problem) {
    return <StateBlock title="Could not load problem">{error}</StateBlock>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={problem.title}
        description={`${problem.topic.name} problem`}
        action={<Badge className={difficultyClass(problem.difficulty)}>{difficultyLabel(problem.difficulty)}</Badge>}
      />
      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold text-ink">Statement</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/75">{problem.statement}</p>
        <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-ink/55">Constraints</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink/75">{problem.constraints}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Examples</h2>
          <div className="mt-4 space-y-4">
            {problem.examples.map((example, index) => (
              <div className="rounded-md bg-paper p-4" key={`${example.input}-${index}`}>
                <p className="text-sm font-semibold text-ink">Example {index + 1}</p>
                <pre className="mt-2 overflow-x-auto text-sm text-ink/75">Input: {example.input}</pre>
                <pre className="mt-1 overflow-x-auto text-sm text-ink/75">Output: {example.output}</pre>
                {example.explanation ? <p className="mt-2 text-sm text-ink/60">{example.explanation}</p> : null}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Hints</h2>
          {problem.hints.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">No hints added.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
              {problem.hints.map((hint) => (
                <li className="rounded-md bg-paper px-3 py-2" key={hint}>
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold text-ink">Starter Code</h2>
        <div className="mt-4 grid gap-4">
          {starterEntries.map(([entryLanguage, starterCode]) => (
            <div key={entryLanguage}>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-ink/55">{entryLanguage}</p>
              <pre className="overflow-x-auto rounded-md bg-ink p-4 text-sm leading-6 text-paper">{starterCode}</pre>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold text-ink">Submit Code</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-ink">Language</span>
            <select
              className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
              value={language}
              onChange={(event) => setLanguage(event.target.value as SubmissionLanguage)}
            >
              {Object.entries(languageLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <textarea
            className="min-h-72 w-full rounded-md border border-ink/15 bg-ink px-4 py-3 font-mono text-sm leading-6 text-paper outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
          />
          {submitError ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</p> : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit mock attempt"}
          </Button>
        </form>
        {submission ? (
          <div className="mt-6 rounded-lg border border-ink/10 bg-paper p-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-bold text-ink">Submission result</p>
              <Badge className={statusClass(submission.status)}>{submission.status.replaceAll("_", " ")}</Badge>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
              <p>Time: {submission.executionTimeMs} ms</p>
              <p>Memory: {submission.memoryKb} KB</p>
              <p>Passed: {submission.testCasesPassed}</p>
              <p>Total: {submission.totalTestCases}</p>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
