import type { Difficulty, SubmissionStatus } from "../types/api";

export function difficultyLabel(difficulty: Difficulty) {
  return difficulty[0] + difficulty.slice(1).toLowerCase();
}

export function difficultyClass(difficulty: Difficulty) {
  if (difficulty === "EASY") {
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  }

  if (difficulty === "MEDIUM") {
    return "bg-amber-500/10 text-amber-300 border-amber-500/30";
  }

  return "bg-rose-500/10 text-rose-300 border-rose-500/30";
}

export function statusClass(status: SubmissionStatus) {
  if (status === "ACCEPTED") {
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  }

  if (status === "PENDING") {
    return "bg-slate-800 text-slate-300 border-slate-700";
  }

  return "bg-rose-500/10 text-rose-300 border-rose-500/30";
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
