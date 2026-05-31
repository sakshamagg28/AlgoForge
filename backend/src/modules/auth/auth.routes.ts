import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { login, logout, me, signup } from "./auth.controller.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

export const authRoutes = Router();

authRoutes.post("/signup", authRateLimiter, validate(signupSchema), signup);
authRoutes.post("/login", authRateLimiter, validate(loginSchema), login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", requireAuth, me);
