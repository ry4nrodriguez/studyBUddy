export type SlotStatus = "available" | "upcoming" | "unavailable" | "passed";

/**
 * Parse a time string in HH:MM:SS format to a Date object (today's date).
 */
function parseTimeString(timeStr: string): Date {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
}

/**
 * Get the number of minutes between two times.
 */
function getMinutesUntil(current: Date, target: Date): number {
    return (target.getTime() - current.getTime()) / (1000 * 60);
}

/**
 * Determine the availability status of a time slot based on the current time.
 * Handles special cases like time slots that span midnight.
 *
 * @param currentTime - The current time as a Date object
 * @param startTimeStr - Start time in HH:MM:SS format
 * @param endTimeStr - End time in HH:MM:SS format
 * @returns One of: "available", "upcoming", "unavailable", or "passed"
 */
export function getSlotStatus(
    currentTime: Date,
    startTimeStr: string,
    endTimeStr: string
): SlotStatus {
    const startTime = parseTimeString(startTimeStr);
    const endTime = parseTimeString(endTimeStr);

    // Check if the slot spans midnight (end time is before start time)
    const spansMidnight = endTime < startTime;
    const minutesUntil = getMinutesUntil(currentTime, startTime);

    if (spansMidnight) {
        // For slots spanning midnight: available if after start OR before end
        if (currentTime >= startTime || currentTime <= endTime) {
            return "available";
        }
        if (minutesUntil > 0 && minutesUntil < 20) {
            return "upcoming";
        }
        return "unavailable";
    }

    // Normal slot (doesn't span midnight)
    if (minutesUntil > 0 && minutesUntil < 20) {
        return "upcoming";
    }
    if (currentTime >= startTime && currentTime <= endTime) {
        return "available";
    }
    if (currentTime > endTime) {
        return "passed";
    }
    return "unavailable";
}
