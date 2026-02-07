/** Available emoji reaction types */
export type ReactionType = "like" | "love" | "celebrate" | "insightful" | "curious";

/** A single reaction record stored in the reactions SP list */
export interface INewsReaction {
  Id?: number;
  ArticleId: number;
  UserId: number;
  UserName: string;
  ReactionType: ReactionType;
  Created?: string;
}

/** Emoji display map for reaction buttons */
export const REACTION_EMOJI_MAP: Record<ReactionType, string> = {
  like: "\uD83D\uDC4D",
  love: "\u2764\uFE0F",
  celebrate: "\uD83C\uDF89",
  insightful: "\uD83E\uDD14",
  curious: "\uD83D\uDE2E",
};

/** All reaction types in display order */
export const REACTION_TYPES: ReactionType[] = [
  "like",
  "love",
  "celebrate",
  "insightful",
  "curious",
];
