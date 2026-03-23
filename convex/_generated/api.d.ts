/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as crons from "../crons.js";
import type * as export_ from "../export.js";
import type * as http from "../http.js";
import type * as notificationLogs from "../notificationLogs.js";
import type * as notifications from "../notifications.js";
import type * as onboarding from "../onboarding.js";
import type * as profiles from "../profiles.js";
import type * as reflections from "../reflections.js";
import type * as resurfacing from "../resurfacing.js";
import type * as safety from "../safety.js";
import type * as sessions from "../sessions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  export: typeof export_;
  http: typeof http;
  notificationLogs: typeof notificationLogs;
  notifications: typeof notifications;
  onboarding: typeof onboarding;
  profiles: typeof profiles;
  reflections: typeof reflections;
  resurfacing: typeof resurfacing;
  safety: typeof safety;
  sessions: typeof sessions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
