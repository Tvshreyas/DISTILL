export const FREE_TIER_LIMIT = 10;
export const FREE_TIER_NUDGE = 8;

// Rate limiting configuration
export const RATE_LIMIT = {
  AUTH: { maxRequests: 5, windowMs: 15 * 60 * 1000 },      // 5 req / 15 min
  API_WRITE: { maxRequests: 30, windowMs: 60 * 1000 },     // 30 req / min
  API_READ: { maxRequests: 60, windowMs: 60 * 1000 },      // 60 req / min
} as const;
