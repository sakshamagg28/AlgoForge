import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { login, logout, me, signup } from "./auth.controller.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

export const authRoutes = Router();

authRoutes.post("/signup", validate(signupSchema), signup);
authRoutes.post("/login", validate(loginSchema), login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", requireAuth, me);
