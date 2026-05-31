import type { Request, RequestHandler } from "express";

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  message: string;
  keyGenerator?: (req: Request) => string;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

export function createRateLimiter(options: RateLimitOptions): RequestHandler {
  const buckets = new Map<string, RateLimitBucket>();

  return (req, res, next) => {
    const now = Date.now();
    const key = options.keyGenerator?.(req) ?? req.ip ?? req.socket.remoteAddress ?? "unknown";
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + options.windowMs
      });
      next();
      return;
    }

    if (bucket.count >= options.maxRequests) {
      const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSeconds));
      res.status(429).json({ message: options.message });
      return;
    }

    bucket.count += 1;
    next();
  };
}

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: "Too many authentication attempts. Please try again later."
});

export const submissionsRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: "Too many submissions. Please slow down.",
  keyGenerator: (req) => {
    const maybeUser = req as Request & { user?: { id?: string } };
    return maybeUser.user?.id ?? req.ip ?? req.socket.remoteAddress ?? "unknown";
  }
});
