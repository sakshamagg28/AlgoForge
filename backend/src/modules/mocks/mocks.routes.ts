import { Router } from "express";

import {
  createMock,
  getMockById,
  startMock,
  submitMock,
  updateMockProblemStatus
} from "./mocks.controller.js";

export const mocksRoutes = Router();

mocksRoutes.post("/", createMock);
mocksRoutes.get("/:id", getMockById);
mocksRoutes.patch("/:id/start", startMock);
mocksRoutes.patch("/:id/problems/:problemId/status", updateMockProblemStatus);
mocksRoutes.patch("/:id/submit", submitMock);
