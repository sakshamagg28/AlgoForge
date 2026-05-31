import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";

import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";
import { verifyAuthToken } from "../utils/jwt.js";

export type AuthenticatedUser = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
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

    let payload: ReturnType<typeof verifyAuthToken>;
    try {
      payload = verifyAuthToken(token);
    } catch {
      throw new ApiError(401, "Invalid or expired session");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new ApiError(401, "Invalid or expired session");
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const user = (req as Partial<AuthenticatedRequest>).user;

  if (!user) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  if (user.role !== UserRole.ADMIN) {
    next(new ApiError(403, "Admin access required"));
    return;
  }

  next();
}
