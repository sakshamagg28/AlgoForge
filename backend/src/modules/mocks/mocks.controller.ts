import type { RequestHandler } from "express";

import { notImplemented } from "../../utils/notImplemented.js";

export const createMock: RequestHandler = notImplemented("POST /api/mocks");
export const getMockById: RequestHandler = notImplemented("GET /api/mocks/:id");
export const startMock: RequestHandler = notImplemented("PATCH /api/mocks/:id/start");
export const updateMockProblemStatus: RequestHandler = notImplemented("PATCH /api/mocks/:id/problems/:problemId/status");
export const submitMock: RequestHandler = notImplemented("PATCH /api/mocks/:id/submit");
