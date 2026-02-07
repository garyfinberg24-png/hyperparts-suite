declare interface IHyperNewsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  LayoutGroupName: string;
  SourcesGroupName: string;
  FeaturesGroupName: string;
  FiltersGroupName: string;
  TitleFieldLabel: string;
  LayoutTypeFieldLabel: string;
  PageSizeFieldLabel: string;
  EnableInfiniteScrollLabel: string;
  EnableQuickReadLabel: string;
  EnableReactionsLabel: string;
  EnableBookmarksLabel: string;
  EnableReadTrackingLabel: string;
  EnableSchedulingLabel: string;
  ShowFeaturedLabel: string;
  MaxFeaturedLabel: string;
  ReactionListNameLabel: string;
  BookmarkListNameLabel: string;
  EnableFiltersLabel: string;
  DateRangeLabel: string;
}

declare module "HyperNewsWebPartStrings" {
  const strings: IHyperNewsWebPartStrings;
  export = strings;
}
