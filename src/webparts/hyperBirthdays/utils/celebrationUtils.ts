import type { ICelebration, CelebrationType } from "../models";
import { getCelebrationConfig } from "../models";
import { getNextOccurrence, isToday, isThisWeek, isThisMonth } from "./dateHelpers";

/**
 * Check if a celebration is upcoming (within the given time range).
 */
export function isUpcoming(
  celebration: ICelebration,
  range: "thisWeek" | "thisMonth" | "thisQuarter"
): boolean {
  if (range === "thisWeek") return isThisWeek(celebration.celebrationDate);
  if (range === "thisMonth") return isThisMonth(celebration.celebrationDate);
  // thisQuarter — import is used in dateHelpers but we inline the check here
  const next = getNextOccurrence(celebration.celebrationDate);
  if (!next) return false;
  const now = new Date();
  const threeMonths = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
  return next >= now && next <= threeMonths;
}

/**
 * Get upcoming celebrations filtered by time range and sorted by next occurrence.
 */
export function getUpcomingCelebrations(
  celebrations: ICelebration[],
  range: "thisWeek" | "thisMonth" | "thisQuarter"
): ICelebration[] {
  const upcoming: ICelebration[] = [];

  celebrations.forEach(function (c) {
    if (isUpcoming(c, range)) {
      upcoming.push(c);
    }
  });

  return sortByUpcoming(upcoming);
}

/**
 * Sort celebrations by next occurrence date (soonest first).
 */
export function sortByUpcoming(celebrations: ICelebration[]): ICelebration[] {
  const sorted: ICelebration[] = [];
  celebrations.forEach(function (c) { sorted.push(c); });

  sorted.sort(function (a, b) {
    const dateA = getNextOccurrence(a.celebrationDate);
    const dateB = getNextOccurrence(b.celebrationDate);
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateA.getTime() - dateB.getTime();
  });

  return sorted;
}

/**
 * Calculate milestone years from celebration year to current year.
 */
export function calculateMilestoneYears(celebrationYear: number): number {
  if (celebrationYear <= 0) return 0;
  const now = new Date();
  return now.getFullYear() - celebrationYear;
}

/**
 * Generate Teams deep link for chat.
 */
export function getTeamsDeepLink(email: string): string {
  if (!email) return "";
  return "https://teams.microsoft.com/l/chat/0/0?users=" + encodeURIComponent(email);
}

/**
 * Generate wish message from template with token replacement.
 */
export function generateWishMessage(
  template: string,
  name: string,
  years: number,
  celebrationType: CelebrationType
): string {
  if (!template) {
    const config = getCelebrationConfig(celebrationType);
    template = config.defaultMessageTemplate;
  }

  let message = template;
  // Replace {name}
  while (message.indexOf("{name}") !== -1) {
    message = message.replace("{name}", name);
  }
  // Replace {years}
  while (message.indexOf("{years}") !== -1) {
    message = message.replace("{years}", String(years));
  }
  // Replace {type}
  while (message.indexOf("{type}") !== -1) {
    const config = getCelebrationConfig(celebrationType);
    message = message.replace("{type}", config.displayName);
  }

  return message;
}

/**
 * Categorize celebrations into "Today", "This Week", "This Month" groups.
 */
export function categorizeCelebrations(celebrations: ICelebration[]): {
  today: ICelebration[];
  thisWeek: ICelebration[];
  thisMonth: ICelebration[];
} {
  const today: ICelebration[] = [];
  const thisWeek: ICelebration[] = [];
  const thisMonth: ICelebration[] = [];

  celebrations.forEach(function (c) {
    if (isToday(c.celebrationDate)) {
      today.push(c);
    } else if (isThisWeek(c.celebrationDate)) {
      thisWeek.push(c);
    } else if (isThisMonth(c.celebrationDate)) {
      thisMonth.push(c);
    }
  });

  return { today: today, thisWeek: thisWeek, thisMonth: thisMonth };
}
