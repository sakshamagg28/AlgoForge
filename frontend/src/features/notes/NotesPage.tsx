import { FormEvent, useEffect, useState } from "react";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { StateBlock } from "../../components/ui/StateBlock";
import { getApiErrorMessage } from "../../lib/apiClient";
import type { Note, Problem } from "../../types/api";
import { getProblems } from "../problems/problemsApi";
import { createNote, deleteNote, getNotes, updateNote } from "./notesApi";

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [problemId, setProblemId] = useState("");
  const [important, setImportant] = useState(false);

  async function load() {
    const [loadedNotes, loadedProblems] = await Promise.all([getNotes(), getProblems()]);
    setNotes(loadedNotes);
    setProblems(loadedProblems);
  }

  useEffect(() => {
    load().catch((caughtError) => setError(getApiErrorMessage(caughtError)));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await createNote({ title, content, problemId: problemId || null, important, bookmarked: important });
      setTitle("");
      setContent("");
      setProblemId("");
      setImportant(false);
      await load();
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    }
  }

  async function toggleImportant(note: Note) {
    await updateNote(note.id, { important: !note.important, bookmarked: !note.important });
    await load();
  }

  async function remove(note: Note) {
    await deleteNote(note.id);
    await load();
  }

  return (
    <div>
      <PageHeader title="Notes" description="Capture problem observations, topic reminders, and revision cues." />
      {error ? <StateBlock title="Notes error">{error}</StateBlock> : null}
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <form className="rounded-lg border border-slate-800 bg-slate-900 p-5" onSubmit={handleSubmit}>
          <h2 className="font-bold text-white">Create note</h2>
          <input
            className="mt-4 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <select
            className="mt-3 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            value={problemId}
            onChange={(event) => setProblemId(event.target.value)}
          >
            <option value="">Link to problem</option>
            {problems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.title}
              </option>
            ))}
          </select>
          <textarea
            className="mt-3 min-h-40 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
            placeholder="Markdown-style note"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-300">
            <input checked={important} type="checkbox" onChange={(event) => setImportant(event.target.checked)} />
            Mark important
          </label>
          <Button className="mt-4 w-full" type="submit">
            Save note
          </Button>
        </form>
        <div className="space-y-3">
          {notes.length === 0 ? (
            <StateBlock title="No notes yet">Create your first note from the panel.</StateBlock>
          ) : (
            notes.map((note) => (
              <article className="rounded-lg border border-slate-800 bg-slate-900 p-5" key={note.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-white">{note.title}</h2>
                    <p className="mt-1 text-xs text-slate-500">{note.problem?.title ?? note.topic?.name ?? "Linked note"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={() => toggleImportant(note)}>
                      {note.important ? "Unmark" : "Important"}
                    </Button>
                    <Button type="button" variant="danger" onClick={() => remove(note)}>
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">{note.content}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
