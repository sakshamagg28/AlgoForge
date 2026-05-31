import { apiClient } from "../../lib/apiClient";
import type { Note } from "../../types/api";

export type NotePayload = {
  title: string;
  content: string;
  topicId?: string | null;
  problemId?: string | null;
  bookmarked?: boolean;
  important?: boolean;
};

export async function getNotes(params?: { topicId?: string; problemId?: string; bookmarked?: boolean }) {
  const response = await apiClient.get<{ notes: Note[] }>("/notes", { params });
  return response.data.notes;
}

export async function createNote(payload: NotePayload) {
  const response = await apiClient.post<{ note: Note }>("/notes", payload);
  return response.data.note;
}

export async function updateNote(id: string, payload: Partial<NotePayload>) {
  const response = await apiClient.patch<{ note: Note }>(`/notes/${id}`, payload);
  return response.data.note;
}

export async function deleteNote(id: string) {
  await apiClient.delete(`/notes/${id}`);
}
