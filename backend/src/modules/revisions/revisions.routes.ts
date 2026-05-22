import { Router } from "express";

import {
  completeRevision,
  createProblemRevision,
  getDueRevisions,
  rescheduleRevision
} from "./revisions.controller.js";

export const revisionsRoutes = Router();

revisionsRoutes.get("/due", getDueRevisions);
revisionsRoutes.post("/problems/:problemId", createProblemRevision);
revisionsRoutes.patch("/:id/complete", completeRevision);
revisionsRoutes.patch("/:id/reschedule", rescheduleRevision);
