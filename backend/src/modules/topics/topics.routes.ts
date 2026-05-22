import { Router } from "express";

import { getTopicBySlug, getTopics } from "./topics.controller.js";

export const topicsRoutes = Router();

topicsRoutes.get("/", getTopics);
topicsRoutes.get("/:slug", getTopicBySlug);
