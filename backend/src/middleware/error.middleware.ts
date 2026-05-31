import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { ApiError } from "../utils/apiError.js";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.flatten()
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    res.status(503).json({ message: "Database unavailable" });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({ message: "Unique constraint violation" });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json({ message: "Record not found" });
      return;
    }
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ message: "Invalid JSON body" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};
