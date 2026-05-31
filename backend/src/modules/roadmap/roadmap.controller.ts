import type { RequestHandler } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { roadmapService } from "./roadmap.service.js";
import { updateProblemProgressSchema } from "./roadmap.validation.js";

export const getRoadmap: RequestHandler = async (req, res, next) => {
  try {
    const roadmap = await roadmapService.getRoadmap((req as AuthenticatedRequest).user.id);
    res.status(200).json(roadmap);
  } catch (error) {
    next(error);
  }
};

export const updateProblemProgress: RequestHandler = async (req, res, next) => {
  try {
    const { params, body } = updateProblemProgressSchema.parse({
      params: req.params,
      body: req.body
    });
    const progress = await roadmapService.updateProblemProgress(
      (req as AuthenticatedRequest).user.id,
      params.problemId,
      body
    );

    res.status(200).json({ progress });
  } catch (error) {
    next(error);
  }
};
