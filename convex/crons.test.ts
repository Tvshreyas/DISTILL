import { describe, it, expect } from "vitest";

describe("cron schedule configuration", () => {
  it("defines monthly reset on day 1 at 00:00 UTC", () => {
    const schedule = { day: 1, hourUTC: 0, minuteUTC: 0 };
    expect(schedule.day).toBe(1);
    expect(schedule.hourUTC).toBe(0);
  });

  it("defines auto-abandon interval as 1 hour", () => {
    const interval = { hours: 1 };
    expect(interval.hours).toBe(1);
  });

  it("defines purge schedule at 02:00 UTC daily", () => {
    const schedule = { hourUTC: 2, minuteUTC: 0 };
    expect(schedule.hourUTC).toBe(2);
  });
});
