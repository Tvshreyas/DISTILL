export type Plan = "free" | "pro";

export type ContentType = "book" | "video" | "article" | "podcast" | "realization" | "workout" | "walk" | "other";

export type SessionStatus = "active" | "complete" | "abandoned";

export type ResurfacingIntervalType = "3d" | "7d" | "30d" | "90d";

export type ResurfacingStatus =
  | "pending"
  | "surfaced"
  | "dismissed"
  | "layered";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing";

// API response shapes
export interface ApiError {
  error: {
    code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "FREE_TIER_LIMIT"
      | "NOT_FOUND"
      | "VALIDATION_ERROR"
      | "RATE_LIMITED"
      | "SERVER_ERROR";
    message: string;
    field?: string;
  };
}
