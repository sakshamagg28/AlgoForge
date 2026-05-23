import type { CookieOptions, RequestHandler } from "express";

import { env } from "../../config/env.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { signAuthToken } from "../../utils/jwt.js";
import { authService } from "./auth.service.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

const AUTH_COOKIE_NAME = "algoforge_token";

function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
  };
}

function clearAuthCookieOptions(): CookieOptions {
  const { maxAge: _maxAge, ...options } = authCookieOptions();
  return options;
}

function sendAuthResponse(res: Parameters<RequestHandler>[1], user: Awaited<ReturnType<typeof authService.login>>) {
  const token = signAuthToken({ userId: user.id });

  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
  res.status(200).json({ user });
}

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { body } = signupSchema.parse({ body: req.body });
    const user = await authService.signup(body);

    sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { body } = loginSchema.parse({ body: req.body });
    const user = await authService.login(body);

    sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, clearAuthCookieOptions());
  res.status(200).json({ message: "Logged out successfully" });
};

export const me: RequestHandler = (req, res) => {
  res.status(200).json({
    user: (req as AuthenticatedRequest).user
  });
};
