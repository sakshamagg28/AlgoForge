import type { RequestHandler } from "express";

import { notImplemented } from "../../utils/notImplemented.js";

export const getProblems: RequestHandler = notImplemented("GET /api/problems");
export const getProblemBySlug: RequestHandler = notImplemented("GET /api/problems/:slug");
export const updateProblemProgress: RequestHandler = notImplemented("PATCH /api/problems/:id/progress");
export const bookmarkProblem: RequestHandler = notImplemented("PATCH /api/problems/:id/bookmark");
