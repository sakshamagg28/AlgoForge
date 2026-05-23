import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createSubmission, getSubmissionById, getSubmissions } from "./submissions.controller.js";
import { createSubmissionSchema, submissionIdSchema } from "./submissions.validation.js";

export const submissionsRoutes = Router();

submissionsRoutes.use(requireAuth);

submissionsRoutes.post("/", validate(createSubmissionSchema), createSubmission);
submissionsRoutes.get("/", getSubmissions);
submissionsRoutes.get("/:id", validate(submissionIdSchema), getSubmissionById);
