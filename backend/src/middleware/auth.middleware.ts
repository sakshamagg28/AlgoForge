import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/apiError.js";

export function requireAuth(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(501, "Authentication middleware is not implemented yet."));
}
