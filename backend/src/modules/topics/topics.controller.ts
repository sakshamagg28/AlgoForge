import type { RequestHandler } from "express";

import { notImplemented } from "../../utils/notImplemented.js";

export const getTopics: RequestHandler = notImplemented("GET /api/topics");
export const getTopicBySlug: RequestHandler = notImplemented("GET /api/topics/:slug");
