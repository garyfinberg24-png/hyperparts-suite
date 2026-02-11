declare interface IHyperSearchWebPartStrings {
  PropertyPaneDescription: string;
  // Page 1 — Search Configuration
  SearchConfigGroupName: string;
  TitleFieldLabel: string;
  PlaceholderTextLabel: string;
  ShowScopeSelectorLabel: string;
  DefaultScopeLabel: string;
  DefaultSortByLabel: string;
  ResultsPerPageLabel: string;
  EnableTypeAheadLabel: string;
  TypeAheadDebounceLabel: string;
  // Page 2 — Refiners & Display
  RefinersGroupName: string;
  EnableRefinersLabel: string;
  RefinerFieldsLabel: string;
  ShowResultIconLabel: string;
  ShowResultPathLabel: string;
  EnableResultPreviewsLabel: string;
  RefinersPageDescription: string;
  // Page 3 — Advanced Features
  AdvancedGroupName: string;
  EnableSearchHistoryLabel: string;
  EnableAnalyticsLabel: string;
  PromotedResultsLabel: string;
  ValidateJsonLabel: string;
  JsonValidLabel: string;
  JsonInvalidLabel: string;
  AdvancedPageDescription: string;
  // Scope options
  ScopeEverything: string;
  ScopeSharePoint: string;
  ScopeOneDrive: string;
  ScopeTeams: string;
  ScopeExchange: string;
  ScopeCurrentSite: string;
  // Sort options
  SortRelevance: string;
  SortDateModified: string;
  SortAuthor: string;
  // UI strings
  SearchAriaLabel: string;
  ClearSearchLabel: string;
  SuggestionsLabel: string;
  NoResultsTitle: string;
  NoResultsDescription: string;
  ResultCountSingular: string;
  ResultCountPlural: string;
  LoadingResults: string;
  PageLabel: string;
  OfLabel: string;
  PreviousPageLabel: string;
  NextPageLabel: string;
  // V2 — Template & Layout
  V2TemplateGroupName: string;
  SelectedTemplateLabel: string;
  ResultLayoutLabel: string;
  SearchBarStyleLabel: string;
  // V2 — Features
  V2FeaturesPageDescription: string;
  V2FeaturesGroupName: string;
  EnableInstantSearchLabel: string;
  EnableSearchVerticalsLabel: string;
  ShowScopeTabsLabel: string;
  EnableZeroQueryLabel: string;
  EnableQuickActionsLabel: string;
  EnableHitHighlightLabel: string;
  EnableResultGroupingLabel: string;
  EnableThumbnailPreviewsLabel: string;
  EnableSavedSearchesLabel: string;
  EnablePeopleCardsLabel: string;
  EnableSpellingCorrectionLabel: string;
  // V2 — Appearance
  V2AppearancePageDescription: string;
  V2AppearanceGroupName: string;
  AccentColorLabel: string;
  BorderRadiusLabel: string;
  EnableDemoModeLabel: string;
  ShowWizardOnInitLabel: string;
}

declare module "HyperSearchWebPartStrings" {
  const strings: IHyperSearchWebPartStrings;
  export = strings;
}
