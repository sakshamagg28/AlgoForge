import { Router } from "express";

import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createProblem,
  deleteProblem,
  getProblemBySlug,
  getProblems,
  updateProblem
} from "./problems.controller.js";
import {
  createProblemSchema,
  getProblemBySlugSchema,
  problemIdSchema,
  updateProblemSchema
} from "./problems.validation.js";

export const problemsRoutes = Router();

problemsRoutes.get("/", getProblems);
problemsRoutes.post("/", requireAuth, requireAdmin, validate(createProblemSchema), createProblem);
problemsRoutes.get("/:slug", validate(getProblemBySlugSchema), getProblemBySlug);
problemsRoutes.patch("/:id", requireAuth, requireAdmin, validate(updateProblemSchema), updateProblem);
problemsRoutes.delete("/:id", requireAuth, requireAdmin, validate(problemIdSchema), deleteProblem);
