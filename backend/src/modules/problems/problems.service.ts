import type { Difficulty, Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateProblemInput, UpdateProblemInput } from "./problems.validation.js";

const problemInclude = {
  topic: {
    select: {
      id: true,
      name: true,
      slug: true,
      difficulty: true,
      orderIndex: true
    }
  }
} satisfies Prisma.ProblemInclude;

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createUniqueSlug(title: string, excludedProblemId?: string) {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    throw new ApiError(400, "Problem title must contain letters or numbers");
  }

  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existingProblem = await prisma.problem.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existingProblem || existingProblem.id === excludedProblemId) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

async function ensureTopicExists(topicId: string) {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    select: { id: true }
  });

  if (!topic) {
    throw new ApiError(404, "Topic not found");
  }
}

export const problemsService = {
  async getProblems(filters?: { company?: string; topic?: string; difficulty?: Difficulty; search?: string }) {
    const where: Prisma.ProblemWhereInput = {};

    if (filters?.company) {
      where.companyTags = { has: filters.company };
    }

    if (filters?.topic) {
      where.topic = { slug: filters.topic };
    }

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { statement: { contains: filters.search, mode: "insensitive" } }
      ];
    }

    return prisma.problem.findMany({
      where,
      include: problemInclude,
      orderBy: [{ topic: { orderIndex: "asc" } }, { difficulty: "asc" }, { title: "asc" }]
    });
  },

  async getProblemBySlug(slug: string) {
    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: problemInclude
    });

    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }

    return problem;
  },

  async getProblemsByTopicSlug(topicSlug: string) {
    const topic = await prisma.topic.findUnique({
      where: { slug: topicSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        difficulty: true,
        orderIndex: true,
        problems: {
          include: problemInclude,
          orderBy: [{ difficulty: "asc" }, { title: "asc" }]
        }
      }
    });

    if (!topic) {
      throw new ApiError(404, "Topic not found");
    }

    return {
      topic: {
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        difficulty: topic.difficulty,
        orderIndex: topic.orderIndex
      },
      problems: topic.problems
    };
  },

  async createProblem(input: CreateProblemInput) {
    const duplicateTitle = await prisma.problem.findUnique({
      where: { title: input.title },
      select: { id: true }
    });

    if (duplicateTitle) {
      throw new ApiError(409, "Problem title already exists");
    }

    await ensureTopicExists(input.topicId);

    const slug = await createUniqueSlug(input.title);

    return prisma.problem.create({
      data: {
        title: input.title,
        slug,
        statement: input.statement,
        difficulty: input.difficulty as Difficulty,
        constraints: input.constraints,
        examples: input.examples,
        hints: input.hints,
        editorial: input.editorial,
        starterCode: input.starterCode,
        companyTags: input.companyTags,
        topicId: input.topicId
      },
      include: problemInclude
    });
  },

  async updateProblem(id: string, input: UpdateProblemInput) {
    const existingProblem = await prisma.problem.findUnique({
      where: { id }
    });

    if (!existingProblem) {
      throw new ApiError(404, "Problem not found");
    }

    if (input.title && input.title !== existingProblem.title) {
      const duplicateTitle = await prisma.problem.findUnique({
        where: { title: input.title },
        select: { id: true }
      });

      if (duplicateTitle && duplicateTitle.id !== id) {
        throw new ApiError(409, "Problem title already exists");
      }
    }

    if (input.topicId) {
      await ensureTopicExists(input.topicId);
    }

    const slug = input.title ? await createUniqueSlug(input.title, id) : undefined;

    return prisma.problem.update({
      where: { id },
      data: {
        title: input.title,
        slug,
        statement: input.statement,
        difficulty: input.difficulty as Difficulty | undefined,
        constraints: input.constraints,
        examples: input.examples,
        hints: input.hints,
        editorial: input.editorial,
        starterCode: input.starterCode,
        companyTags: input.companyTags,
        topicId: input.topicId
      },
      include: problemInclude
    });
  },

  async deleteProblem(id: string) {
    const existingProblem = await prisma.problem.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!existingProblem) {
      throw new ApiError(404, "Problem not found");
    }

    await prisma.problem.delete({
      where: { id }
    });
  }
};
