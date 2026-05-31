import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { submissionsRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createSubmission, getSubmissionById, getSubmissions, runCode } from "./submissions.controller.js";
import { createSubmissionSchema, runCodeSchema, submissionIdSchema } from "./submissions.validation.js";

export const submissionsRoutes = Router();

submissionsRoutes.use(requireAuth);

submissionsRoutes.post("/run", submissionsRateLimiter, validate(runCodeSchema), runCode);
submissionsRoutes.post("/", submissionsRateLimiter, validate(createSubmissionSchema), createSubmission);
submissionsRoutes.get("/", getSubmissions);
submissionsRoutes.get("/:id", validate(submissionIdSchema), getSubmissionById);
