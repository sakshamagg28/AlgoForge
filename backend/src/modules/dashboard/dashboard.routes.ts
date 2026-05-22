import { Router } from "express";

import { getDashboard } from "./dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", getDashboard);
