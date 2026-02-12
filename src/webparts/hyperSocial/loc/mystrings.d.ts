declare interface IHyperSocialWebPartStrings {
  PropertyPaneDescription: string;
  ContentGroupName: string;
  FeaturesGroupName: string;
  AdvancedGroupName: string;
  FeaturesPageDescription: string;
  AdvancedPageDescription: string;

  TitleFieldLabel: string;
  LayoutModeFieldLabel: string;
  SortModeFieldLabel: string;
  PostsPerLoadFieldLabel: string;
  ListNameFieldLabel: string;
  VisibilityFieldLabel: string;
  UseSampleDataFieldLabel: string;

  EnableReactionsFieldLabel: string;
  EnableCommentsFieldLabel: string;
  EnableBookmarksFieldLabel: string;
  EnableHashtagsFieldLabel: string;
  EnableMentionsFieldLabel: string;
  EnableTrendingWidgetFieldLabel: string;

  EnableModerationFieldLabel: string;
  ModerationThresholdFieldLabel: string;
  AutoHideFlaggedFieldLabel: string;
  CacheDurationFieldLabel: string;
  EnableLazyLoadFieldLabel: string;

  NewPostPlaceholder: string;
  PostButtonLabel: string;
  CommentPlaceholder: string;
  ReplyLabel: string;
  BookmarkLabel: string;
  FlagLabel: string;
  PinnedLabel: string;
  EditedLabel: string;
  TrendingLabel: string;
  NoPostsTitle: string;
  NoPostsDescription: string;
  SampleDataBanner: string;
}

declare module "HyperSocialWebPartStrings" {
  const strings: IHyperSocialWebPartStrings;
  export = strings;
}
