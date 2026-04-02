/**
 * In-memory rate limiter.
 * Note: In a multi-instance (serverless) deployment this is per-instance only.
 * It still provides meaningful protection for low-traffic admin routes.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

// Prune expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (record.resetAt < now) store.delete(key);
  }
}, 60_000);

export function checkRateLimit(
  identifier: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || record.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxAttempts - 1, resetAt };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    resetAt: record.resetAt,
  };
}

export function clearRateLimit(identifier: string) {
  store.delete(identifier);
}
