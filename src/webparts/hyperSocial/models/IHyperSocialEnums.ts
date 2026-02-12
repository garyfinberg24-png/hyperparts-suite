// ============================================================
// HyperSocial — Enum types and display helpers
// ============================================================

export type SocialLayoutMode = "feed" | "grid" | "compact" | "wall";
export type SocialSortMode = "latest" | "popular" | "trending";
export type SocialVisibility = "everyone" | "department" | "private";
export type SocialMediaType = "image" | "video" | "link" | "document";

export type SocialReactionType =
  | "like"
  | "love"
  | "celebrate"
  | "insightful"
  | "curious"
  | "support"
  | "funny"
  | "sad";

export var ALL_LAYOUT_MODES: SocialLayoutMode[] = ["feed", "grid", "compact", "wall"];
export var ALL_SORT_MODES: SocialSortMode[] = ["latest", "popular", "trending"];

export interface IReactionDefinition {
  type: SocialReactionType;
  emoji: string;
  label: string;
}

export var REACTION_DEFINITIONS: IReactionDefinition[] = [
  { type: "like", emoji: "\uD83D\uDC4D", label: "Like" },
  { type: "love", emoji: "\u2764\uFE0F", label: "Love" },
  { type: "celebrate", emoji: "\uD83C\uDF89", label: "Celebrate" },
  { type: "insightful", emoji: "\uD83D\uDCA1", label: "Insightful" },
  { type: "curious", emoji: "\uD83E\uDD14", label: "Curious" },
  { type: "support", emoji: "\uD83D\uDE4F", label: "Support" },
  { type: "funny", emoji: "\uD83D\uDE02", label: "Funny" },
  { type: "sad", emoji: "\uD83D\uDE22", label: "Sad" },
];

export function getLayoutDisplayName(mode: SocialLayoutMode): string {
  var LABELS: Record<string, string> = {
    feed: "Feed",
    grid: "Grid",
    compact: "Compact",
    wall: "Wall",
  };
  return LABELS[mode] || mode;
}

export function getSortDisplayName(mode: SocialSortMode): string {
  var LABELS: Record<string, string> = {
    latest: "Latest",
    popular: "Most Popular",
    trending: "Trending",
  };
  return LABELS[mode] || mode;
}

export function getReactionEmoji(type: SocialReactionType): string {
  var found: IReactionDefinition | undefined;
  REACTION_DEFINITIONS.forEach(function (def) {
    if (def.type === type) {
      found = def;
    }
  });
  return found ? found.emoji : "";
}
