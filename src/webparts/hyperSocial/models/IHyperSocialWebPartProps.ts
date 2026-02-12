import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { SocialLayoutMode, SocialSortMode, SocialVisibility } from "./IHyperSocialEnums";

export interface IHyperSocialWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  layoutMode: SocialLayoutMode;
  sortMode: SocialSortMode;
  postsPerLoad: number;

  // Data source
  listName: string;
  visibility: SocialVisibility;

  // Engagement features
  enableReactions: boolean;
  enableComments: boolean;
  enableBookmarks: boolean;
  enableHashtags: boolean;
  enableMentions: boolean;

  // Moderation
  enableModeration: boolean;
  moderationThreshold: number;
  autoHideFlagged: boolean;

  // Widgets
  enableTrendingWidget: boolean;

  // Performance
  cacheDuration: number;
  enableLazyLoad: boolean;

  // Standard props
  useSampleData: boolean;
  wizardCompleted: boolean;
  enableDemoMode: boolean;
}
