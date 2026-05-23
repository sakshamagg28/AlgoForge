import type { NextFunction, Request, Response } from "express";

import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";
import { verifyAuthToken } from "../utils/jwt.js";

export type AuthenticatedUser = {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
};

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

function getTokenFromRequest(req: Request) {
  const cookieToken = req.cookies?.algoforge_token as string | undefined;

  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  return null;
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new ApiError(401, "Invalid or expired session");
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired session"));
  }
}
