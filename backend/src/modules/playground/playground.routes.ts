import { Router } from "express";

import { runCode } from "./playground.controller.js";

export const playgroundRoutes = Router();

playgroundRoutes.post("/run", runCode);
