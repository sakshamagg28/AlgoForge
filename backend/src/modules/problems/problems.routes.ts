import { Router } from "express";

import {
  bookmarkProblem,
  getProblemBySlug,
  getProblems,
  updateProblemProgress
} from "./problems.controller.js";

export const problemsRoutes = Router();

problemsRoutes.get("/", getProblems);
problemsRoutes.get("/:slug", getProblemBySlug);
problemsRoutes.patch("/:id/progress", updateProblemProgress);
problemsRoutes.patch("/:id/bookmark", bookmarkProblem);
