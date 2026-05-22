import type { RequestHandler } from "express";

import { notImplemented } from "../../utils/notImplemented.js";

export const signup: RequestHandler = notImplemented("POST /api/auth/signup");
export const login: RequestHandler = notImplemented("POST /api/auth/login");
export const logout: RequestHandler = notImplemented("POST /api/auth/logout");
export const me: RequestHandler = notImplemented("GET /api/auth/me");
