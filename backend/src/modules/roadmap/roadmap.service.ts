import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import { roadmapTopicNames } from "./roadmap.data.js";
import type { UpdateProblemProgressInput } from "./roadmap.validation.js";

export const roadmapService = {
  async getRoadmap(userId: string) {
    const topics = await prisma.topic.findMany({
      where: {
        name: { in: roadmapTopicNames }
      },
      include: {
        problems: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            progress: {
              where: { userId },
              select: {
                attempted: true,
                solved: true,
                bookmarked: true
              }
            }
          }
        }
      }
    });

    const topicMap = new Map(topics.map((topic) => [topic.name, topic]));

    const items = roadmapTopicNames.map((name, index) => {
      const topic = topicMap.get(name);
      const problems = topic?.problems ?? [];
      const solvedCount = problems.filter((problem) => problem.progress[0]?.solved).length;
      const attemptedCount = problems.filter((problem) => problem.progress[0]?.attempted).length;

      return {
        name,
        orderIndex: index + 1,
        topic: topic
          ? {
              id: topic.id,
              name: topic.name,
              slug: topic.slug,
              difficulty: topic.difficulty,
              description: topic.description
            }
          : null,
        totalProblems: problems.length,
        solvedCount,
        attemptedCount,
        completionPercent: problems.length === 0 ? 0 : Math.round((solvedCount / problems.length) * 100)
      };
    });

    const totalProblems = items.reduce((sum, item) => sum + item.totalProblems, 0);
    const solvedProblems = items.reduce((sum, item) => sum + item.solvedCount, 0);

    return {
      items,
      summary: {
        totalTopics: items.length,
        totalProblems,
        solvedProblems,
        completionPercent: totalProblems === 0 ? 0 : Math.round((solvedProblems / totalProblems) * 100)
      }
    };
  },

  async updateProblemProgress(userId: string, problemId: string, input: UpdateProblemProgressInput) {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { id: true }
    });

    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }

    const solved = input.solved;

    return prisma.problemProgress.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId
        }
      },
      create: {
        userId,
        problemId,
        attempted: input.attempted ?? solved ?? false,
        solved: solved ?? false,
        bookmarked: input.bookmarked ?? false,
        solvedAt: solved ? new Date() : null
      },
      update: {
        attempted: input.attempted ?? (solved ? true : undefined),
        solved,
        bookmarked: input.bookmarked,
        solvedAt: solved === true ? new Date() : solved === false ? null : undefined
      }
    });
  }
};
