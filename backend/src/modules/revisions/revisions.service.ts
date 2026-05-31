import { RevisionStatus, type Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateRevisionInput, UpdateRevisionInput } from "./revisions.validation.js";

const revisionInclude = {
  problem: {
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      topic: { select: { id: true, name: true, slug: true } }
    }
  }
} satisfies Prisma.RevisionInclude;

async function ensureProblem(problemId: string) {
  const problem = await prisma.problem.findUnique({ where: { id: problemId }, select: { id: true } });
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }
}

async function getOwnedRevision(userId: string, id: string) {
  const revision = await prisma.revision.findUnique({ where: { id }, select: { userId: true } });
  if (!revision) {
    throw new ApiError(404, "Revision not found");
  }

  if (revision.userId !== userId) {
    throw new ApiError(403, "You do not have access to this revision");
  }
}

export const revisionsService = {
  async getRevisions(userId: string, filters: { status?: RevisionStatus; dueOnly?: boolean }) {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return prisma.revision.findMany({
      where: {
        userId,
        status: filters.status,
        dueDate: filters.dueOnly ? { lte: todayEnd } : undefined
      },
      include: revisionInclude,
      orderBy: [{ status: "desc" }, { dueDate: "asc" }]
    });
  },

  async createRevision(userId: string, input: CreateRevisionInput) {
    await ensureProblem(input.problemId);

    return prisma.revision.create({
      data: {
        userId,
        problemId: input.problemId,
        dueDate: input.dueDate,
        note: input.note
      },
      include: revisionInclude
    });
  },

  async updateRevision(userId: string, id: string, input: UpdateRevisionInput) {
    await getOwnedRevision(userId, id);

    return prisma.revision.update({
      where: { id },
      data: {
        dueDate: input.dueDate,
        note: input.note,
        status: input.status,
        revisedAt: input.status === RevisionStatus.COMPLETED ? new Date() : input.status === RevisionStatus.PENDING ? null : undefined
      },
      include: revisionInclude
    });
  },

  async completeRevision(userId: string, id: string) {
    await getOwnedRevision(userId, id);

    return prisma.revision.update({
      where: { id },
      data: {
        status: RevisionStatus.COMPLETED,
        revisedAt: new Date()
      },
      include: revisionInclude
    });
  },

  async deleteRevision(userId: string, id: string) {
    await getOwnedRevision(userId, id);
    await prisma.revision.delete({ where: { id } });
  }
};
