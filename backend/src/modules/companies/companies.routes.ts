import { Router } from "express";

import { getCompanies, getCompanyProblems } from "./companies.controller.js";

export const companiesRoutes = Router();

companiesRoutes.get("/", getCompanies);
companiesRoutes.get("/:slug/problems", getCompanyProblems);
