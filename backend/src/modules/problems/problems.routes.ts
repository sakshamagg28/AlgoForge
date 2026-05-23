import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
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
problemsRoutes.post("/", requireAuth, validate(createProblemSchema), createProblem);
problemsRoutes.get("/:slug", validate(getProblemBySlugSchema), getProblemBySlug);
problemsRoutes.patch("/:id", requireAuth, validate(updateProblemSchema), updateProblem);
problemsRoutes.delete("/:id", requireAuth, validate(problemIdSchema), deleteProblem);
