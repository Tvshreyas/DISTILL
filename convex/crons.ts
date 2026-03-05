import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// 1st of every month at midnight UTC: reset monthly reflection counts and streak freeze usage
crons.monthly(
  "reset monthly counts",
  { day: 1, hourUTC: 0, minuteUTC: 0 },
  internal.profiles.resetMonthlyCounts
);

// Every hour: abandon sessions that have been active for more than 8 hours
crons.interval(
  "auto-abandon stale sessions",
  { hours: 1 },
  internal.sessions.autoAbandonStaleSessions
);

// Daily at 2 AM UTC: permanently delete reflections soft-deleted more than 30 days ago
crons.daily(
  "purge soft-deleted reflections",
  { hourUTC: 2, minuteUTC: 0 },
  internal.reflections.purgeSoftDeletedReflections
);

export default crons;
