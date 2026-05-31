import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { getCompanies, getCompanyProblems } from "./companies.controller.js";

export const companiesRoutes = Router();

companiesRoutes.use(requireAuth);

companiesRoutes.get("/", getCompanies);
companiesRoutes.get("/:slug/problems", getCompanyProblems);
