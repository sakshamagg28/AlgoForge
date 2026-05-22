import type { RequestHandler } from "express";

import { notImplemented } from "../../utils/notImplemented.js";

export const runCode: RequestHandler = notImplemented("POST /api/playground/run");
