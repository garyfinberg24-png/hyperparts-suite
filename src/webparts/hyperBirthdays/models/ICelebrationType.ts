import type { CelebrationType, AnimationType } from "./IHyperBirthdaysEnums";

export interface ICelebrationTypeConfig {
  type: CelebrationType;
  displayName: string;
  emoji: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  animation: AnimationType;
  defaultMessageTemplate: string;
}

export const CELEBRATION_CONFIGS: Record<CelebrationType, ICelebrationTypeConfig> = {
  birthday: {
    type: "birthday",
    displayName: "Birthday",
    emoji: "\uD83C\uDF82",    // cake
    icon: "CakeSmall",
    primaryColor: "#ff6b6b",
    secondaryColor: "#ee5a5a",
    gradient: "linear-gradient(135deg, #ff6b6b, #ee5a5a)",
    animation: "confetti",
    defaultMessageTemplate: "Happy Birthday, {name}!",
  },
  workAnniversary: {
    type: "workAnniversary",
    displayName: "Work Anniversary",
    emoji: "\uD83C\uDF89",    // party popper
    icon: "PartyLeader",
    primaryColor: "#4ecdc4",
    secondaryColor: "#3dbdb4",
    gradient: "linear-gradient(135deg, #4ecdc4, #3dbdb4)",
    animation: "sparkle",
    defaultMessageTemplate: "Congratulations on {years} years, {name}!",
  },
  wedding: {
    type: "wedding",
    displayName: "Wedding",
    emoji: "\uD83D\uDC8D",    // ring
    icon: "Diamond",
    primaryColor: "#ffd93d",
    secondaryColor: "#e6c235",
    gradient: "linear-gradient(135deg, #ffd93d, #e6c235)",
    animation: "sparkle",
    defaultMessageTemplate: "Congratulations on your wedding, {name}!",
  },
  childBirth: {
    type: "childBirth",
    displayName: "New Baby",
    emoji: "\uD83D\uDC76",    // baby
    icon: "ChildOf",
    primaryColor: "#87ceeb",
    secondaryColor: "#74b8d4",
    gradient: "linear-gradient(135deg, #87ceeb, #74b8d4)",
    animation: "balloons",
    defaultMessageTemplate: "Welcome to the new addition, {name}!",
  },
  graduation: {
    type: "graduation",
    displayName: "Graduation",
    emoji: "\uD83C\uDF93",    // graduation cap
    icon: "Education",
    primaryColor: "#95e1d3",
    secondaryColor: "#82cbbf",
    gradient: "linear-gradient(135deg, #95e1d3, #82cbbf)",
    animation: "confetti",
    defaultMessageTemplate: "Congratulations on your graduation, {name}!",
  },
  retirement: {
    type: "retirement",
    displayName: "Retirement",
    emoji: "\uD83C\uDF34",    // palm tree
    icon: "Vacation",
    primaryColor: "#dda0dd",
    secondaryColor: "#c78ec7",
    gradient: "linear-gradient(135deg, #dda0dd, #c78ec7)",
    animation: "confetti",
    defaultMessageTemplate: "Happy retirement, {name}!",
  },
  promotion: {
    type: "promotion",
    displayName: "Promotion",
    emoji: "\uD83D\uDE80",    // rocket
    icon: "Up",
    primaryColor: "#ffa502",
    secondaryColor: "#e69502",
    gradient: "linear-gradient(135deg, #ffa502, #e69502)",
    animation: "sparkle",
    defaultMessageTemplate: "Congratulations on your promotion, {name}!",
  },
  custom: {
    type: "custom",
    displayName: "Custom",
    emoji: "\u2B50",           // star
    icon: "FavoriteStar",
    primaryColor: "#778899",
    secondaryColor: "#68798a",
    gradient: "linear-gradient(135deg, #778899, #68798a)",
    animation: "none",
    defaultMessageTemplate: "Celebrating {name}!",
  },
};

export function getCelebrationConfig(type: CelebrationType): ICelebrationTypeConfig {
  return CELEBRATION_CONFIGS[type] || CELEBRATION_CONFIGS.custom;
}

export function getCelebrationEmoji(type: CelebrationType): string {
  return getCelebrationConfig(type).emoji;
}

export function getCelebrationColor(type: CelebrationType): string {
  return getCelebrationConfig(type).primaryColor;
}

export function getCelebrationGradient(type: CelebrationType): string {
  return getCelebrationConfig(type).gradient;
}
