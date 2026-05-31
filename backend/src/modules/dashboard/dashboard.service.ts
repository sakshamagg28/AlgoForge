import { Difficulty, RevisionStatus, SubmissionStatus } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { companiesService } from "../companies/companies.service.js";
import { roadmapService } from "../roadmap/roadmap.service.js";

export const dashboardService = {
  async getDashboard(userId: string) {
    const [acceptedSubmissions, attempts, dueRevisions, completedRevisions, recentSubmissions, recentNotes, roadmap, companies] =
      await Promise.all([
        prisma.submission.findMany({
          where: { userId, status: SubmissionStatus.ACCEPTED },
          distinct: ["problemId"],
          include: { problem: { include: { topic: true } } }
        }),
        prisma.submission.count({ where: { userId } }),
        prisma.revision.count({ where: { userId, status: RevisionStatus.PENDING, dueDate: { lte: new Date() } } }),
        prisma.revision.count({ where: { userId, status: RevisionStatus.COMPLETED } }),
        prisma.submission.findMany({
          where: { userId },
          include: { problem: { select: { title: true, slug: true } } },
          orderBy: { createdAt: "desc" },
          take: 5
        }),
        prisma.note.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          take: 5,
          select: { id: true, title: true, updatedAt: true, important: true }
        }),
        roadmapService.getRoadmap(userId),
        companiesService.getCompanies(userId)
      ]);

    const solvedByDifficulty = Object.fromEntries(
      Object.values(Difficulty).map((difficulty) => [
        difficulty,
        acceptedSubmissions.filter((submission) => submission.problem.difficulty === difficulty).length
      ])
    );

    const topicMap = new Map<string, { topic: string; solved: number }>();
    for (const submission of acceptedSubmissions) {
      const name = submission.problem.topic.name;
      topicMap.set(name, {
        topic: name,
        solved: (topicMap.get(name)?.solved ?? 0) + 1
      });
    }

    return {
      stats: {
        totalSolved: acceptedSubmissions.length,
        totalAttempts: attempts,
        dueRevisions,
        completedRevisions,
        roadmapCompletionPercent: roadmap.summary.completionPercent
      },
      solvedByDifficulty,
      solvedByTopic: Array.from(topicMap.values()).sort((a, b) => b.solved - a.solved),
      roadmap,
      companyProgress: companies,
      recentActivity: [
        ...recentSubmissions.map((submission) => ({
          id: submission.id,
          type: "submission",
          label: `${submission.status.replaceAll("_", " ")} on ${submission.problem.title}`,
          at: submission.createdAt,
          href: `/problems/${submission.problem.slug}`
        })),
        ...recentNotes.map((note) => ({
          id: note.id,
          type: "note",
          label: `${note.important ? "Important note" : "Note"}: ${note.title}`,
          at: note.updatedAt,
          href: "/notes"
        }))
      ]
        .sort((a, b) => b.at.getTime() - a.at.getTime())
        .slice(0, 8)
    };
  }
};
