export const FREE_TIER_LIMIT = 3;
export const FREE_TIER_NUDGE = 2;

// Pricing configuration
export const PRICING = {
  USD: { monthly: 8, yearly: 72, symbol: "$", code: "USD" },
  INR: { monthly: 249, yearly: 2490, symbol: "\u20B9", code: "INR" },
} as const;

export const PPP_COUNTRIES: Record<string, keyof typeof PRICING> = {
  IN: "INR",
};

// Rate limiting configuration
export const RATE_LIMIT = {
  AUTH: { maxRequests: 5, windowMs: 15 * 60 * 1000 },      // 5 req / 15 min
  API_WRITE: { maxRequests: 30, windowMs: 60 * 1000 },     // 30 req / min
  API_READ: { maxRequests: 60, windowMs: 60 * 1000 },      // 60 req / min
} as const;

// Notification configuration
export const NOTIFICATION_COOLDOWN_HOURS = 24;
export const NOTIFICATION_BATCH_SIZE = 50;
export const DEFAULT_NOTIFICATION_HOUR = 9;
