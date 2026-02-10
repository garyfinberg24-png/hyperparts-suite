/** Badge type classification */
export type BadgeType = "recognition" | "achievement" | "certification" | "milestone";

/** Individual badge / award */
export interface IProfileBadge {
  id: string;
  name: string;
  /** Emoji icon */
  icon: string;
  color: string;
  description: string;
  awardedDate?: string;
  awardedBy?: string;
  type: BadgeType;
}
