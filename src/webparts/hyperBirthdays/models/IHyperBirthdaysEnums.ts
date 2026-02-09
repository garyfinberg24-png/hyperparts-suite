// HyperBirthdays enum types and dropdown option arrays

export type CelebrationType =
  | "birthday"
  | "workAnniversary"
  | "wedding"
  | "childBirth"
  | "graduation"
  | "retirement"
  | "promotion"
  | "custom";

export type BirthdaysViewMode =
  | "upcomingList"
  | "monthlyCalendar"
  | "cardCarousel"
  | "timeline"
  | "featuredSpotlight"
  | "masonryWall"
  | "compactStrip"
  | "cardGrid";
export type BirthdaysTimeRange = "thisWeek" | "thisMonth" | "thisQuarter";
export type AnimationType = "confetti" | "balloons" | "sparkle" | "none";

export const ALL_CELEBRATION_TYPES: CelebrationType[] = [
  "birthday", "workAnniversary", "wedding", "childBirth",
  "graduation", "retirement", "promotion", "custom",
];

export const ALL_VIEW_MODES: BirthdaysViewMode[] = [
  "upcomingList", "monthlyCalendar", "cardCarousel",
  "timeline", "featuredSpotlight", "masonryWall", "compactStrip", "cardGrid",
];
export const ALL_TIME_RANGES: BirthdaysTimeRange[] = ["thisWeek", "thisMonth", "thisQuarter"];
export const ALL_ANIMATION_TYPES: AnimationType[] = ["confetti", "balloons", "sparkle", "none"];

export function getViewModeDisplayName(mode: BirthdaysViewMode): string {
  const map: Record<BirthdaysViewMode, string> = {
    upcomingList: "Upcoming List",
    monthlyCalendar: "Monthly Calendar",
    cardCarousel: "Card Carousel",
    timeline: "Timeline",
    featuredSpotlight: "Featured Spotlight",
    masonryWall: "Celebration Wall",
    compactStrip: "Compact Strip",
    cardGrid: "Card Grid",
  };
  return map[mode];
}

export function getTimeRangeDisplayName(range: BirthdaysTimeRange): string {
  const map: Record<BirthdaysTimeRange, string> = {
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisQuarter: "This Quarter",
  };
  return map[range];
}

export function getAnimationDisplayName(anim: AnimationType): string {
  const map: Record<AnimationType, string> = {
    confetti: "Confetti",
    balloons: "Balloons",
    sparkle: "Sparkle",
    none: "None",
  };
  return map[anim];
}
