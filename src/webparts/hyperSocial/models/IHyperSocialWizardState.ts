import type { SocialLayoutMode, SocialSortMode, SocialVisibility } from "./IHyperSocialEnums";

export interface IHyperSocialWizardState {
  title: string;
  listName: string;
  layoutMode: SocialLayoutMode;
  sortMode: SocialSortMode;
  visibility: SocialVisibility;
  postsPerLoad: number;
  enableReactions: boolean;
  enableComments: boolean;
  enableBookmarks: boolean;
  enableHashtags: boolean;
  enableMentions: boolean;
  enableModeration: boolean;
  moderationThreshold: number;
  autoHideFlagged: boolean;
  enableTrendingWidget: boolean;
}

export var DEFAULT_WIZARD_STATE: IHyperSocialWizardState = {
  title: "Social Feed",
  listName: "HyperSocial_Posts",
  layoutMode: "feed",
  sortMode: "latest",
  visibility: "everyone",
  postsPerLoad: 10,
  enableReactions: true,
  enableComments: true,
  enableBookmarks: true,
  enableHashtags: true,
  enableMentions: true,
  enableModeration: false,
  moderationThreshold: 3,
  autoHideFlagged: false,
  enableTrendingWidget: true,
};
