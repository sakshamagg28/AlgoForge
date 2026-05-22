import type { RequestHandler } from "express";

import { notImplemented } from "../../utils/notImplemented.js";

export const getDueRevisions: RequestHandler = notImplemented("GET /api/revisions/due");
export const createProblemRevision: RequestHandler = notImplemented("POST /api/revisions/problems/:problemId");
export const completeRevision: RequestHandler = notImplemented("PATCH /api/revisions/:id/complete");
export const rescheduleRevision: RequestHandler = notImplemented("PATCH /api/revisions/:id/reschedule");
