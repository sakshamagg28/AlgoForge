import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export type AuthTokenPayload = {
  userId: string;
};

const TOKEN_EXPIRES_IN = "7d";

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
    throw new Error("Invalid token payload");
  }

  return {
    userId: String(decoded.userId)
  };
}
