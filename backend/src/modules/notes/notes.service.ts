import type { Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateNoteInput, UpdateNoteInput } from "./notes.validation.js";

const noteInclude = {
  topic: { select: { id: true, name: true, slug: true } },
  problem: { select: { id: true, title: true, slug: true, difficulty: true } }
} satisfies Prisma.NoteInclude;

async function ensureLinks(input: { topicId?: string | null; problemId?: string | null }) {
  if (input.topicId) {
    const topic = await prisma.topic.findUnique({ where: { id: input.topicId }, select: { id: true } });
    if (!topic) {
      throw new ApiError(404, "Topic not found");
    }
  }

  if (input.problemId) {
    const problem = await prisma.problem.findUnique({ where: { id: input.problemId }, select: { id: true } });
    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }
  }
}

export const notesService = {
  async getNotes(userId: string, filters: { topicId?: string; problemId?: string; bookmarked?: boolean }) {
    return prisma.note.findMany({
      where: {
        userId,
        topicId: filters.topicId,
        problemId: filters.problemId,
        bookmarked: filters.bookmarked
      },
      include: noteInclude,
      orderBy: [{ important: "desc" }, { updatedAt: "desc" }]
    });
  },

  async createNote(userId: string, input: CreateNoteInput) {
    await ensureLinks(input);

    return prisma.note.create({
      data: {
        userId,
        title: input.title,
        content: input.content,
        bookmarked: input.bookmarked,
        important: input.important,
        topicId: input.topicId ?? null,
        problemId: input.problemId ?? null
      },
      include: noteInclude
    });
  },

  async updateNote(userId: string, id: string, input: UpdateNoteInput) {
    const note = await prisma.note.findUnique({ where: { id }, select: { userId: true } });
    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    if (note.userId !== userId) {
      throw new ApiError(403, "You do not have access to this note");
    }

    await ensureLinks(input);

    return prisma.note.update({
      where: { id },
      data: {
        title: input.title,
        content: input.content,
        bookmarked: input.bookmarked,
        important: input.important,
        topicId: input.topicId,
        problemId: input.problemId
      },
      include: noteInclude
    });
  },

  async deleteNote(userId: string, id: string) {
    const note = await prisma.note.findUnique({ where: { id }, select: { userId: true } });
    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    if (note.userId !== userId) {
      throw new ApiError(403, "You do not have access to this note");
    }

    await prisma.note.delete({ where: { id } });
  }
};
