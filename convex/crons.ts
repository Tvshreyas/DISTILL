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

// Every hour: send resurfacing emails to eligible users at their preferred hour
crons.interval(
  "send resurfacing emails",
  { hours: 1 },
  internal.notifications.processResurfacingEmails
);

// Every hour: send streak reminders to users who haven't reflected today
crons.interval(
  "send streak reminders",
  { hours: 1 },
  internal.notifications.processStreakReminders
);

// Every hour: send weekly summaries (action checks for Sunday in user's timezone)
crons.interval(
  "send weekly summaries",
  { hours: 1 },
  internal.notifications.processWeeklySummary
);

// Every 6 hours: check for inactive users and send re-engagement emails
crons.interval(
  "send re-engagement emails",
  { hours: 6 },
  internal.notifications.processReEngagementEmails
);

// Every 6 hours: check for users near/at free tier limit and send upgrade emails
crons.interval(
  "send upgrade emails",
  { hours: 6 },
  internal.notifications.processUpgradeEmails
);

export default crons;
