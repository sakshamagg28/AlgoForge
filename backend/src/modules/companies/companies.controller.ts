import type { RequestHandler } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { companiesService } from "./companies.service.js";

export const getCompanies: RequestHandler = async (req, res, next) => {
  try {
    const companies = await companiesService.getCompanies((req as AuthenticatedRequest).user.id);
    res.status(200).json({ companies });
  } catch (error) {
    next(error);
  }
};

export const getCompanyProblems: RequestHandler = async (req, res, next) => {
  try {
    const slug = typeof req.params.slug === "string" ? req.params.slug : "";
    const result = await companiesService.getCompanyProblems((req as AuthenticatedRequest).user.id, slug);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
