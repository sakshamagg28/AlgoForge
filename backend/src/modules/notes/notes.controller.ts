import type { RequestHandler } from "express";

import { notImplemented } from "../../utils/notImplemented.js";

export const getProblemNote: RequestHandler = notImplemented("GET /api/notes/problems/:problemId");
export const upsertProblemNote: RequestHandler = notImplemented("PUT /api/notes/problems/:problemId");
export const deleteProblemNote: RequestHandler = notImplemented("DELETE /api/notes/problems/:problemId");
