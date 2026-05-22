import { Router } from "express";

import { deleteProblemNote, getProblemNote, upsertProblemNote } from "./notes.controller.js";

export const notesRoutes = Router();

notesRoutes.get("/problems/:problemId", getProblemNote);
notesRoutes.put("/problems/:problemId", upsertProblemNote);
notesRoutes.delete("/problems/:problemId", deleteProblemNote);
