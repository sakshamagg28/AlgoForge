import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { companiesRoutes } from "./modules/companies/companies.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { mocksRoutes } from "./modules/mocks/mocks.routes.js";
import { notesRoutes } from "./modules/notes/notes.routes.js";
import { playgroundRoutes } from "./modules/playground/playground.routes.js";
import { problemsRoutes } from "./modules/problems/problems.routes.js";
import { revisionsRoutes } from "./modules/revisions/revisions.routes.js";
import { snippetsRoutes } from "./modules/snippets/snippets.routes.js";
import { submissionsRoutes } from "./modules/submissions/submissions.routes.js";
import { topicsRoutes } from "./modules/topics/topics.routes.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "algoforge-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/topics", topicsRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/snippets", snippetsRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/revisions", revisionsRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/mocks", mocksRoutes);
app.use("/api/playground", playgroundRoutes);

app.use(errorMiddleware);
