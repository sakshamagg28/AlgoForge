import type { RequestHandler } from "express";

export function notImplemented(routeName: string): RequestHandler {
  return (_req, res) => {
    res.status(501).json({
      message: `${routeName} is registered but not implemented yet.`
    });
  };
}
