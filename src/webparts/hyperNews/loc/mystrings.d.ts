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
  WizardGroupName: string;
  LaunchWizardLabel: string;
  LaunchWizardDesc: string;
  SourcesSummaryLabel: string;
  DisplayGroupName: string;
  ShowImagesLabel: string;
  ShowDescriptionLabel: string;
  ShowAuthorLabel: string;
  ShowDateLabel: string;
  ShowReadTimeLabel: string;
}

declare module "HyperNewsWebPartStrings" {
  const strings: IHyperNewsWebPartStrings;
  export = strings;
}
