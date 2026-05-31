import type { RequestHandler } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { createSubmissionSchema, runCodeSchema, submissionIdSchema } from "./submissions.validation.js";
import { submissionsService } from "./submissions.service.js";

export const runCode: RequestHandler = async (req, res, next) => {
  try {
    const { body } = runCodeSchema.parse({ body: req.body });
    const result = await submissionsService.runCode(body);

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const createSubmission: RequestHandler = async (req, res, next) => {
  try {
    const { body } = createSubmissionSchema.parse({ body: req.body });
    const submission = await submissionsService.createSubmission((req as AuthenticatedRequest).user.id, body);

    res.status(201).json({ submission });
  } catch (error) {
    next(error);
  }
};

export const getSubmissions: RequestHandler = async (req, res, next) => {
  try {
    const submissions = await submissionsService.getUserSubmissions((req as AuthenticatedRequest).user.id);

    res.status(200).json({ submissions });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionById: RequestHandler = async (req, res, next) => {
  try {
    const { params } = submissionIdSchema.parse({ params: req.params });
    const submission = await submissionsService.getUserSubmissionById(
      (req as AuthenticatedRequest).user.id,
      params.id
    );

    res.status(200).json({ submission });
  } catch (error) {
    next(error);
  }
};
