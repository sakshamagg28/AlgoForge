import type { Difficulty } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import type { CreateTopicInput, UpdateTopicInput } from "./topics.validation.js";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createUniqueSlug(name: string, excludedTopicId?: string) {
  const baseSlug = slugify(name);

  if (!baseSlug) {
    throw new ApiError(400, "Topic name must contain letters or numbers");
  }

  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existingTopic = await prisma.topic.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!existingTopic || existingTopic.id === excludedTopicId) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export const topicsService = {
  async getTopics() {
    return prisma.topic.findMany({
      orderBy: [{ orderIndex: "asc" }, { name: "asc" }]
    });
  },

  async getTopicBySlug(slug: string) {
    const topic = await prisma.topic.findUnique({
      where: { slug }
    });

    if (!topic) {
      throw new ApiError(404, "Topic not found");
    }

    return topic;
  },

  async createTopic(input: CreateTopicInput) {
    const existingTopic = await prisma.topic.findUnique({
      where: { name: input.name },
      select: { id: true }
    });

    if (existingTopic) {
      throw new ApiError(409, "Topic name already exists");
    }

    const slug = await createUniqueSlug(input.name);

    return prisma.topic.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        difficulty: input.difficulty as Difficulty,
        orderIndex: input.orderIndex
      }
    });
  },

  async updateTopic(id: string, input: UpdateTopicInput) {
    const existingTopic = await prisma.topic.findUnique({
      where: { id }
    });

    if (!existingTopic) {
      throw new ApiError(404, "Topic not found");
    }

    if (input.name && input.name !== existingTopic.name) {
      const duplicateName = await prisma.topic.findUnique({
        where: { name: input.name },
        select: { id: true }
      });

      if (duplicateName && duplicateName.id !== id) {
        throw new ApiError(409, "Topic name already exists");
      }
    }

    const slug = input.name ? await createUniqueSlug(input.name, id) : undefined;

    return prisma.topic.update({
      where: { id },
      data: {
        name: input.name,
        slug,
        description: input.description,
        difficulty: input.difficulty as Difficulty | undefined,
        orderIndex: input.orderIndex
      }
    });
  },

  async deleteTopic(id: string) {
    const existingTopic = await prisma.topic.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!existingTopic) {
      throw new ApiError(404, "Topic not found");
    }

    await prisma.topic.delete({
      where: { id }
    });
  }
};
