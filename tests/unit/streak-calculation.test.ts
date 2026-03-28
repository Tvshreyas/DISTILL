import { describe, it, expect } from "vitest";
import {
  toDateString,
  getWeekDays,
  hasReflectedToday,
  isStreakBroken,
} from "@/lib/streak";

describe("toDateString", () => {
  it("formats a date in UTC", () => {
    const date = new Date("2026-02-27T12:00:00Z");
    expect(toDateString(date, "UTC")).toBe("2026-02-27");
  });

  it("handles timezone ahead of UTC (Asia/Kolkata, UTC+5:30)", () => {
    // At 10pm UTC on Feb 27, it's already Feb 28 in IST
    const date = new Date("2026-02-27T22:00:00Z");
    expect(toDateString(date, "Asia/Kolkata")).toBe("2026-02-28");
  });

  it("handles timezone behind UTC (America/New_York, UTC-5)", () => {
    // At 3am UTC on Feb 28, it's still Feb 27 in New York
    const date = new Date("2026-02-28T03:00:00Z");
    expect(toDateString(date, "America/New_York")).toBe("2026-02-27");
  });

  it("handles UTC+14 (Pacific/Kiritimati — furthest ahead)", () => {
    const date = new Date("2026-02-27T08:00:00Z");
    // UTC+14: 8am UTC = 10pm same day
    expect(toDateString(date, "Pacific/Kiritimati")).toBe("2026-02-27");
  });

  it("handles UTC+14 crossing midnight", () => {
    const date = new Date("2026-02-27T11:00:00Z");
    // UTC+14: 11am UTC = 1am next day
    expect(toDateString(date, "Pacific/Kiritimati")).toBe("2026-02-28");
  });

  it("handles UTC-12 (Etc/GMT+12 — furthest behind)", () => {
    const date = new Date("2026-02-28T10:00:00Z");
    // UTC-12: 10am UTC on Feb 28 = 10pm Feb 27
    expect(toDateString(date, "Etc/GMT+12")).toBe("2026-02-27");
  });

  it("handles year boundary (New Year's Eve)", () => {
    const date = new Date("2026-12-31T23:30:00Z");
    expect(toDateString(date, "UTC")).toBe("2026-12-31");
    // In IST (UTC+5:30), this is already Jan 1
    expect(toDateString(date, "Asia/Kolkata")).toBe("2027-01-01");
  });

  it("handles month boundary", () => {
    const date = new Date("2026-01-31T23:30:00Z");
    expect(toDateString(date, "UTC")).toBe("2026-01-31");
    expect(toDateString(date, "Asia/Kolkata")).toBe("2026-02-01");
  });

  it("handles leap year edge case (Feb 28 → Feb 29 in leap year)", () => {
    // 2028 is a leap year
    const date = new Date("2028-02-28T23:30:00Z");
    expect(toDateString(date, "Asia/Kolkata")).toBe("2028-02-29");
  });
});

describe("getWeekDays", () => {
  it("returns exactly 7 days", () => {
    const days = getWeekDays("UTC");
    expect(days).toHaveLength(7);
  });

  it("last day is today", () => {
    const now = new Date("2026-02-27T12:00:00Z");
    const days = getWeekDays("UTC", now);
    expect(days[6].dateStr).toBe("2026-02-27");
  });

  it("first day is 6 days ago", () => {
    const now = new Date("2026-02-27T12:00:00Z");
    const days = getWeekDays("UTC", now);
    expect(days[0].dateStr).toBe("2026-02-21");
  });

  it("returns consecutive dates", () => {
    const now = new Date("2026-02-27T12:00:00Z");
    const days = getWeekDays("UTC", now);
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1].dateStr);
      const curr = new Date(days[i].dateStr);
      const diffMs = curr.getTime() - prev.getTime();
      expect(diffMs).toBe(24 * 60 * 60 * 1000); // exactly 1 day
    }
  });

  it("respects timezone for 'today'", () => {
    // 11pm UTC on Feb 27 = 4:30am IST on Feb 28
    const now = new Date("2026-02-27T23:00:00Z");
    const utcDays = getWeekDays("UTC", now);
    const istDays = getWeekDays("Asia/Kolkata", now);
    expect(utcDays[6].dateStr).toBe("2026-02-27");
    expect(istDays[6].dateStr).toBe("2026-02-28");
  });

  it("each day has a single-char weekday label", () => {
    const days = getWeekDays("UTC");
    days.forEach((day) => {
      expect(day.label).toMatch(/^[SMTWF]$/);
    });
  });
});

describe("hasReflectedToday", () => {
  it("returns false when lastReflectionDate is null", () => {
    expect(hasReflectedToday(null, "UTC")).toBe(false);
  });

  it("returns true when lastReflectionDate matches today", () => {
    const now = new Date("2026-02-27T12:00:00Z");
    expect(hasReflectedToday("2026-02-27", "UTC", now)).toBe(true);
  });

  it("returns false when lastReflectionDate is yesterday", () => {
    const now = new Date("2026-02-27T12:00:00Z");
    expect(hasReflectedToday("2026-02-26", "UTC", now)).toBe(false);
  });

  it("respects timezone — same UTC time can be different local dates", () => {
    const now = new Date("2026-02-27T22:00:00Z");
    // In UTC it's still Feb 27
    expect(hasReflectedToday("2026-02-27", "UTC", now)).toBe(true);
    // In IST it's already Feb 28
    expect(hasReflectedToday("2026-02-27", "Asia/Kolkata", now)).toBe(false);
    expect(hasReflectedToday("2026-02-28", "Asia/Kolkata", now)).toBe(true);
  });
});

describe("isStreakBroken", () => {
  it("returns true when lastReflectionDate is null (never reflected)", () => {
    expect(isStreakBroken(null, "UTC")).toBe(true);
  });

  it("returns false when reflected today", () => {
    const now = new Date("2026-02-27T12:00:00Z");
    expect(isStreakBroken("2026-02-27", "UTC", now)).toBe(false);
  });

  it("returns false when reflected yesterday (streak intact)", () => {
    const now = new Date("2026-02-27T12:00:00Z");
    expect(isStreakBroken("2026-02-26", "UTC", now)).toBe(false);
  });

  it("returns true when last reflection was 2+ days ago", () => {
    const now = new Date("2026-02-27T12:00:00Z");
    expect(isStreakBroken("2026-02-25", "UTC", now)).toBe(true);
    expect(isStreakBroken("2026-02-20", "UTC", now)).toBe(true);
    expect(isStreakBroken("2026-01-15", "UTC", now)).toBe(true);
  });

  it("timezone edge: reflected at 11pm IST (still Feb 27 UTC) — streak intact in IST", () => {
    // User in IST reflected late on Feb 27 IST = Feb 27 17:30 UTC
    // Now it's Feb 28 morning IST = Feb 27 late UTC
    const now = new Date("2026-02-28T01:00:00Z"); // Feb 28 6:30am IST
    expect(isStreakBroken("2026-02-27", "Asia/Kolkata", now)).toBe(false);
  });

  it("timezone edge: streak breaks across timezone day boundary", () => {
    // User in IST: last reflected Feb 26. Now it's Feb 28 IST = missed Feb 27
    const now = new Date("2026-02-27T19:00:00Z"); // Feb 28 00:30 IST
    expect(isStreakBroken("2026-02-26", "Asia/Kolkata", now)).toBe(true);
  });

  it("DST transition: US spring forward doesn't break streak", () => {
    // March 8, 2026 US spring forward. Reflected on March 7.
    const now = new Date("2026-03-08T16:00:00Z"); // March 8 11am ET
    expect(isStreakBroken("2026-03-07", "America/New_York", now)).toBe(false);
  });

  it("DST transition: US fall back doesn't break streak", () => {
    // Nov 1, 2026 US fall back. Reflected on Oct 31.
    const now = new Date("2026-11-01T15:00:00Z"); // Nov 1 10am ET
    expect(isStreakBroken("2026-10-31", "America/New_York", now)).toBe(false);
  });
});
