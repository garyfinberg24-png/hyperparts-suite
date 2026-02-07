export type {
  IHyperNewsArticle,
  IHyperNewsUser,
  IReactionCounts,
} from "./IHyperNewsArticle";
export {
  DEFAULT_REACTION_COUNTS,
  calculateReadTime,
} from "./IHyperNewsArticle";

export type {
  LayoutType,
  ILayoutConfig,
} from "./IHyperNewsLayout";
export {
  DEFAULT_LAYOUT_CONFIG,
  LAYOUT_OPTIONS,
} from "./IHyperNewsLayout";

export type {
  SourceType,
  INewsSource,
} from "./IHyperNewsSource";
export { DEFAULT_NEWS_SOURCE } from "./IHyperNewsSource";

export type {
  DateRangeType,
  IFilterConfig,
} from "./IHyperNewsFilter";
export { DEFAULT_FILTER_CONFIG } from "./IHyperNewsFilter";

export type {
  ReactionType,
  INewsReaction,
} from "./IHyperNewsReaction";
export {
  REACTION_EMOJI_MAP,
  REACTION_TYPES,
} from "./IHyperNewsReaction";

export type { IScheduleConfig } from "./IHyperNewsSchedule";
export { isArticlePublished } from "./IHyperNewsSchedule";

export type { IHyperNewsWebPartProps } from "./IHyperNewsWebPartProps";
