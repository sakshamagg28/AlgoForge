import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { getRoadmap, updateProblemProgress } from "./roadmap.controller.js";
import { updateProblemProgressSchema } from "./roadmap.validation.js";

export const roadmapRoutes = Router();

roadmapRoutes.use(requireAuth);

roadmapRoutes.get("/", getRoadmap);
roadmapRoutes.patch("/problems/:problemId/progress", validate(updateProblemProgressSchema), updateProblemProgress);
