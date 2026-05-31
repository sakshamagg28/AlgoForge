import type { RequestHandler } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { dashboardService } from "./dashboard.service.js";

export const getDashboard: RequestHandler = async (req, res, next) => {
  try {
    const dashboard = await dashboardService.getDashboard((req as AuthenticatedRequest).user.id);
    res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
};
