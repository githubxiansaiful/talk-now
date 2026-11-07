import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipBuckets = new Map<string, RateLimitRecord>();
const memberMessageBuckets = new Map<string, number[]>();

// Cleanup stale IP buckets periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of ipBuckets.entries()) {
    if (value.resetTime <= now) {
      ipBuckets.delete(key);
    }
  }

  for (const [memberId, timestamps] of memberMessageBuckets.entries()) {
    const recent = timestamps.filter((t) => now - t < 5000);
    if (recent.length === 0) {
      memberMessageBuckets.delete(memberId);
    } else {
      memberMessageBuckets.set(memberId, recent);
    }
  }
}, 60000);

export function createIpRateLimiter(options: {
  windowMs: number;
  max: number;
  message: string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${req.baseUrl || ''}${req.path}:${ip}`;
    const now = Date.now();

    const record = ipBuckets.get(key);
    if (!record || record.resetTime <= now) {
      ipBuckets.set(key, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    record.count++;
    if (record.count > options.max) {
      res.status(429).json({
        success: false,
        error: options.message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
      return;
    }

    next();
  };
}

/**
 * Socket message spam rate limit: max 5 messages per 3 seconds per member
 */
export function checkSocketMessageRateLimit(
  memberId: string,
  maxMessages = 5,
  windowMs = 3000
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const timestamps = memberMessageBuckets.get(memberId) || [];
  const windowStart = now - windowMs;
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= maxMessages) {
    const oldestInWindow = recent[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs) };
  }

  recent.push(now);
  memberMessageBuckets.set(memberId, recent);
  return { allowed: true, retryAfterMs: 0 };
}
