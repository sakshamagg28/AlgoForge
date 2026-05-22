import type { RequestHandler } from "express";

import { notImplemented } from "../../utils/notImplemented.js";

export const getCompanies: RequestHandler = notImplemented("GET /api/companies");
export const getCompanyProblems: RequestHandler = notImplemented("GET /api/companies/:slug/problems");
