import { differenceInYears } from "date-fns";

export interface IMilestoneBadge {
  years: number;
  label: string;
  icon: string;
  color: string;
}

export const MILESTONE_BADGES: IMilestoneBadge[] = [
  { years: 1, label: "1 Year", icon: "\uD83C\uDF31", color: "#4caf50" },   // seedling
  { years: 5, label: "5 Years", icon: "\u2B50", color: "#ffc107" },         // star
  { years: 10, label: "10 Years", icon: "\uD83C\uDFC6", color: "#ff9800" }, // trophy
  { years: 15, label: "15 Years", icon: "\uD83D\uDC8E", color: "#2196f3" }, // gem
  { years: 20, label: "20 Years", icon: "\uD83C\uDF96\uFE0F", color: "#9c27b0" }, // medal
  { years: 25, label: "25 Years", icon: "\uD83D\uDC51", color: "#f44336" }, // crown
  { years: 30, label: "30 Years", icon: "\uD83C\uDF1F", color: "#e91e63" }, // glowing star
];

/**
 * Calculate years since the celebration year to now.
 */
export function calculateYears(celebrationYear: number): number {
  if (celebrationYear <= 0) return 0;
  const start = new Date(celebrationYear, 0, 1);
  const now = new Date();
  return differenceInYears(now, start);
}

/**
 * Get the appropriate milestone badge for the given years.
 * Returns the highest milestone badge that the years qualifies for, or undefined.
 */
export function getMilestoneBadge(years: number): IMilestoneBadge | undefined {
  let best: IMilestoneBadge | undefined;
  MILESTONE_BADGES.forEach(function (badge) {
    if (years >= badge.years) {
      best = badge;
    }
  });
  return best;
}
