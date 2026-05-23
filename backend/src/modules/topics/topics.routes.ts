import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createTopic,
  deleteTopic,
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
topicsRoutes.get("/:slug", validate(getTopicBySlugSchema), getTopicBySlug);
topicsRoutes.post("/", requireAuth, validate(createTopicSchema), createTopic);
topicsRoutes.patch("/:id", requireAuth, validate(updateTopicSchema), updateTopic);
topicsRoutes.delete("/:id", requireAuth, validate(topicIdSchema), deleteTopic);
