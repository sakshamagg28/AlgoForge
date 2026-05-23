import type { RequestHandler } from "express";

import { topicsService } from "./topics.service.js";
import {
  createTopicSchema,
  getTopicBySlugSchema,
  topicIdSchema,
  updateTopicSchema
} from "./topics.validation.js";

export const getTopics: RequestHandler = async (_req, res, next) => {
  try {
    const topics = await topicsService.getTopics();
    res.status(200).json({ topics });
  } catch (error) {
    next(error);
  }
};

export const getTopicBySlug: RequestHandler = async (req, res, next) => {
  try {
    const { params } = getTopicBySlugSchema.parse({ params: req.params });
    const topic = await topicsService.getTopicBySlug(params.slug);

    res.status(200).json({ topic });
  } catch (error) {
    next(error);
  }
};

export const createTopic: RequestHandler = async (req, res, next) => {
  try {
    const { body } = createTopicSchema.parse({ body: req.body });
    const topic = await topicsService.createTopic(body);

    res.status(201).json({ topic });
  } catch (error) {
    next(error);
  }
};

export const updateTopic: RequestHandler = async (req, res, next) => {
  try {
    const { params, body } = updateTopicSchema.parse({
      params: req.params,
      body: req.body
    });
    const topic = await topicsService.updateTopic(params.id, body);

    res.status(200).json({ topic });
  } catch (error) {
    next(error);
  }
};

export const deleteTopic: RequestHandler = async (req, res, next) => {
  try {
    const { params } = topicIdSchema.parse({ params: req.params });
    await topicsService.deleteTopic(params.id);

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    next(error);
  }
};
