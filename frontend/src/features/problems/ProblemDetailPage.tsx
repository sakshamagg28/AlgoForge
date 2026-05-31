import Editor from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { Problem, Submission, SubmissionLanguage } from "../../types/api";
import { difficultyClass, difficultyLabel, statusClass } from "../../utils/format";
import { updateProblemProgress } from "../roadmap/roadmapApi";
import { createSubmission, runCode } from "../submissions/submissionsApi";
import { getProblem } from "./problemsApi";

const languageLabels: Record<SubmissionLanguage, string> = {
  cpp: "C++",
  python: "Python",
  java: "Java",
  javascript: "JavaScript"
};

const monacoLanguages: Record<SubmissionLanguage, string> = {
  cpp: "cpp",
  python: "python",
  java: "java",
  javascript: "javascript"
};

export function ProblemDetailPage() {
  const { slug } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<SubmissionLanguage>("cpp");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [runResult, setRunResult] = useState<Awaited<ReturnType<typeof runCode>> | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("Problem slug is missing.");
      return;
    }

    getProblem(slug)
      .then((loadedProblem) => {
        setProblem(loadedProblem);
        setCode(loadedProblem.starterCode.cpp ?? "");
        const firstExample = loadedProblem.examples[0]?.input ?? "";
        setCustomInput(firstExample);
      })
      .catch((caughtError) => setError(getApiErrorMessage(caughtError)));
  }, [slug]);

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language] ?? "");
    }
  }, [language, problem]);

  const visibleResult = useMemo(() => submission?.judgeOutput?.testCaseResults?.[0], [submission]);

  async function handleRun() {
    setError("");
    setSubmission(null);
    setRunResult(null);
    setIsSubmitting(true);
    try {
      const result = await runCode({ code, language, input: customInput });
      setRunResult(result);
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitCode(markSolved = false) {
    if (!problem) {
      return;
    }

    setError("");
    setSubmission(null);
    setRunResult(null);
    setIsSubmitting(true);
    try {
      const result = await createSubmission({ problemId: problem.id, code, language });
      setSubmission(result);
      await updateProblemProgress(problem.id, {
        attempted: true,
        solved: markSolved && result.status === "ACCEPTED"
      });
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (error && !problem) {
    return <StateBlock title="Could not load problem">{error}</StateBlock>;
  }

  if (!problem) {
    return <StateBlock title="Loading problem" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black text-white">{problem.title}</h1>
            <Badge className={difficultyClass(problem.difficulty)}>{difficultyLabel(problem.difficulty)}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {problem.topic.name} · stdin/stdout · {problem.companyTags.join(", ") || "General"}
          </p>
        </div>
        <select
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
          value={language}
          onChange={(event) => setLanguage(event.target.value as SubmissionLanguage)}
        >
          {Object.entries(languageLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="max-h-[calc(100vh-9rem)] overflow-y-auto rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Statement</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">{problem.statement}</p>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Input / Output</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Read from standard input and print the required answer to standard output.</p>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Constraints</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{problem.constraints}</p>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Examples</h3>
          <div className="mt-3 space-y-3">
            {problem.examples.map((example, index) => (
              <div className="rounded-md border border-slate-800 bg-slate-950 p-4" key={`${example.input}-${index}`}>
                <p className="text-sm font-semibold text-slate-200">Example {index + 1}</p>
                <pre className="mt-2 text-sm text-slate-400">Input: {example.input}</pre>
                <pre className="mt-1 text-sm text-slate-400">Output: {example.output}</pre>
                {example.explanation ? <p className="mt-2 text-sm text-slate-500">{example.explanation}</p> : null}
              </div>
            ))}
          </div>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Hints</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {problem.hints.map((hint) => (
              <li className="rounded-md bg-slate-950 px-3 py-2" key={hint}>
                {hint}
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
            <p className="font-semibold text-slate-200">Editor</p>
            <div className="flex gap-2">
              <Button disabled={isSubmitting} type="button" variant="secondary" onClick={handleRun}>
                {isSubmitting ? "Running..." : "Run"}
              </Button>
              <Button disabled={isSubmitting} type="button" onClick={() => submitCode(true)}>
                Submit
              </Button>
            </div>
          </div>
          <Editor
            height="520px"
            language={monacoLanguages[language]}
            theme="vs-dark"
            value={code}
            options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false }}
            onChange={(value) => setCode(value ?? "")}
          />
          <div className="grid gap-0 border-t border-slate-800 lg:grid-cols-2">
            <div className="border-b border-slate-800 p-4 lg:border-b-0 lg:border-r">
              <p className="text-sm font-semibold text-slate-200">Custom input</p>
              <textarea
                className="mt-2 h-28 w-full rounded-md border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-slate-200 outline-none focus:border-cyan-400"
                value={customInput}
                onChange={(event) => setCustomInput(event.target.value)}
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-200">Result</p>
                {submission ? <Badge className={statusClass(submission.status)}>{submission.status.replaceAll("_", " ")}</Badge> : null}
                {runResult ? <Badge className={statusClass(runResult.status)}>{runResult.status.replaceAll("_", " ")}</Badge> : null}
              </div>
              {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
              {runResult ? (
                <div className="mt-3 space-y-2 text-sm text-slate-400">
                  <p>{runResult.executionTimeMs ?? 0} ms</p>
                  {runResult.stderr ? <pre className="rounded-md bg-rose-950/40 p-3 text-rose-200">{runResult.stderr}</pre> : null}
                  <pre className="rounded-md bg-slate-950 p-3 text-slate-300">{runResult.stdout || "No stdout"}</pre>
                </div>
              ) : submission ? (
                <div className="mt-3 space-y-2 text-sm text-slate-400">
                  <p>
                    Passed {submission.testCasesPassed}/{submission.totalTestCases} · {submission.executionTimeMs ?? 0} ms
                  </p>
                  {submission.compileError ? <pre className="rounded-md bg-rose-950/40 p-3 text-rose-200">{submission.compileError}</pre> : null}
                  {submission.runtimeError ? <pre className="rounded-md bg-rose-950/40 p-3 text-rose-200">{submission.runtimeError}</pre> : null}
                  {visibleResult && !visibleResult.isHidden ? (
                    <pre className="rounded-md bg-slate-950 p-3 text-slate-300">
                      Expected: {visibleResult.expectedOutput}
                      {"\n"}Actual: {visibleResult.actualOutput}
                    </pre>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Run or submit to see judge output.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
