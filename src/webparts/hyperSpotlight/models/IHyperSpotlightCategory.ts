import { SpotlightCategory } from "./IHyperSpotlightEnums";

/** Category theme configuration */
export interface ISpotlightCategoryTheme {
  name: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientStart: string;
  gradientEnd: string;
  emoji: string;
  displayName: string;
}

const CATEGORY_THEMES: { [key: string]: ISpotlightCategoryTheme } = {
  [SpotlightCategory.Birthday]: {
    name: "Birthday",
    icon: "CakeSmall",
    primaryColor: "#ff6b6b",
    secondaryColor: "#ffd93d",
    accentColor: "#ff8787",
    gradientStart: "#ff6b6b",
    gradientEnd: "#ff8787",
    emoji: "🎂",
    displayName: "Birthday",
  },
  [SpotlightCategory.WorkAnniversary]: {
    name: "Work Anniversary",
    icon: "PartyLeader",
    primaryColor: "#4ecdc4",
    secondaryColor: "#44a3a0",
    accentColor: "#6edcd4",
    gradientStart: "#4ecdc4",
    gradientEnd: "#44a3a0",
    emoji: "🎉",
    displayName: "Work Anniversary",
  },
  [SpotlightCategory.Anniversary]: {
    name: "Personal Anniversary",
    icon: "Heart",
    primaryColor: "#ff69b4",
    secondaryColor: "#ff85c1",
    accentColor: "#ffa1d4",
    gradientStart: "#ff69b4",
    gradientEnd: "#ffa1d4",
    emoji: "💑",
    displayName: "Personal Anniversary",
  },
  [SpotlightCategory.Graduation]: {
    name: "Graduation",
    icon: "Education",
    primaryColor: "#95e1d3",
    secondaryColor: "#7dd3c0",
    accentColor: "#b0ede1",
    gradientStart: "#95e1d3",
    gradientEnd: "#7dd3c0",
    emoji: "🎓",
    displayName: "Graduation",
  },
  [SpotlightCategory.Wedding]: {
    name: "Wedding",
    icon: "Diamond",
    primaryColor: "#ffd93d",
    secondaryColor: "#ffc107",
    accentColor: "#ffe66d",
    gradientStart: "#ffd93d",
    gradientEnd: "#ffe66d",
    emoji: "💍",
    displayName: "Wedding",
  },
  [SpotlightCategory.Engagement]: {
    name: "Engagement",
    icon: "HeartFill",
    primaryColor: "#ff85a2",
    secondaryColor: "#ff6b8a",
    accentColor: "#ffa1b5",
    gradientStart: "#ff85a2",
    gradientEnd: "#ffa1b5",
    emoji: "💝",
    displayName: "Engagement",
  },
  [SpotlightCategory.Achievement]: {
    name: "Achievement",
    icon: "Trophy",
    primaryColor: "#ffa502",
    secondaryColor: "#ff8c00",
    accentColor: "#ffb732",
    gradientStart: "#ffa502",
    gradientEnd: "#ffb732",
    emoji: "🏆",
    displayName: "Personal Achievement",
  },
};

/** Get theme configuration for a category */
export function getCategoryTheme(category: SpotlightCategory): ISpotlightCategoryTheme {
  return CATEGORY_THEMES[category] || CATEGORY_THEMES[SpotlightCategory.Birthday];
}

/** Get gradient CSS for a category */
export function getCategoryGradient(
  category: SpotlightCategory,
  direction: string = "to right"
): string {
  const theme = getCategoryTheme(category);
  return "linear-gradient(" + direction + ", " + theme.gradientStart + ", " + theme.gradientEnd + ")";
}

/** Get primary color for a category */
export function getCategoryColor(category: SpotlightCategory): string {
  return getCategoryTheme(category).primaryColor;
}

/** Get emoji for a category */
export function getCategoryEmoji(category: SpotlightCategory): string {
  return getCategoryTheme(category).emoji;
}

/** Get display name for a category */
export function getCategoryDisplayName(category: SpotlightCategory): string {
  return getCategoryTheme(category).displayName;
}
