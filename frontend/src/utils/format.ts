import type { Difficulty, SubmissionStatus } from "../types/api";

export function difficultyLabel(difficulty: Difficulty) {
  return difficulty[0] + difficulty.slice(1).toLowerCase();
}

export function difficultyClass(difficulty: Difficulty) {
  if (difficulty === "EASY") {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }

  if (difficulty === "MEDIUM") {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }

  return "bg-rose-100 text-rose-800 border-rose-200";
}

export function statusClass(status: SubmissionStatus) {
  if (status === "ACCEPTED") {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }

  if (status === "PENDING") {
    return "bg-slate-100 text-slate-700 border-slate-200";
  }

  return "bg-rose-100 text-rose-800 border-rose-200";
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
