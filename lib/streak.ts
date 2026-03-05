/** Convert a Date to YYYY-MM-DD in a specific timezone */
export function toDateString(date: Date, timeZone: string): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);
    const y = parts.find((p) => p.type === "year")!.value;
    const m = parts.find((p) => p.type === "month")!.value;
    const d = parts.find((p) => p.type === "day")!.value;
    return `${y}-${m}-${d}`;
}

/** Get the last 7 days with labels and date strings in a specific timezone */
export function getWeekDays(
    timeZone: string,
    now: Date = new Date()
): { label: string; dateStr: string }[] {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        days.push({
            label: d.toLocaleDateString("en-US", { weekday: "narrow", timeZone }),
            dateStr: toDateString(d, timeZone),
        });
    }
    return days;
}

/**
 * Check if today has a reflection (timezone-aware).
 * Compares `lastReflectionDate` (YYYY-MM-DD) to today in the user's timezone.
 */
export function hasReflectedToday(
    lastReflectionDate: string | null,
    timeZone: string,
    now: Date = new Date()
): boolean {
    if (!lastReflectionDate) return false;
    const todayStr = toDateString(now, timeZone);
    return lastReflectionDate === todayStr;
}

/**
 * Check if a streak should be broken.
 * A streak breaks if the user missed the ENTIRE previous day (no reflection yesterday).
 */
export function isStreakBroken(
    lastReflectionDate: string | null,
    timeZone: string,
    now: Date = new Date()
): boolean {
    if (!lastReflectionDate) return true;

    const todayStr = toDateString(now, timeZone);

    // If they reflected today, streak is fine
    if (lastReflectionDate === todayStr) return false;

    // Check if they reflected yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toDateString(yesterday, timeZone);

    return lastReflectionDate !== yesterdayStr;
}
