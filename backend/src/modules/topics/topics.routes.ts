import { Router } from "express";

import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createTopic,
  deleteTopic,
  getProblemsByTopicSlug,
  getTopicBySlug,
  getTopics,
  updateTopic
} from "./topics.controller.js";
import {
  createTopicSchema,
  getTopicBySlugSchema,
  topicIdSchema,
  updateTopicSchema
} from "./topics.validation.js";

export const topicsRoutes = Router();

topicsRoutes.get("/", getTopics);
topicsRoutes.get("/:slug/problems", validate(getTopicBySlugSchema), getProblemsByTopicSlug);
topicsRoutes.get("/:slug", validate(getTopicBySlugSchema), getTopicBySlug);
topicsRoutes.post("/", requireAuth, requireAdmin, validate(createTopicSchema), createTopic);
topicsRoutes.patch("/:id", requireAuth, requireAdmin, validate(updateTopicSchema), updateTopic);
topicsRoutes.delete("/:id", requireAuth, requireAdmin, validate(topicIdSchema), deleteTopic);
