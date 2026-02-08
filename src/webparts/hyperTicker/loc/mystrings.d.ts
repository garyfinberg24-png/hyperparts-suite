declare interface IHyperTickerWebPartStrings {
  PropertyPaneDescription: string;
  ContentSourcesGroupName: string;
  AppearanceGroupName: string;
  AdvancedGroupName: string;
  AppearancePageDescription: string;
  AdvancedPageDescription: string;

  TitleFieldLabel: string;
  DisplayModeFieldLabel: string;
  ListNameFieldLabel: string;
  ListFilterFieldLabel: string;
  RssConfigsFieldLabel: string;
  ManualItemCountLabel: string;

  PositionFieldLabel: string;
  DirectionFieldLabel: string;
  SpeedFieldLabel: string;
  PauseOnHoverFieldLabel: string;
  DefaultSeverityFieldLabel: string;
  CriticalOverrideBgFieldLabel: string;
  CriticalOverrideTextFieldLabel: string;

  AutoRefreshIntervalFieldLabel: string;
  EnableItemAudienceFieldLabel: string;

  NoItemsTitle: string;
  NoItemsDescription: string;
}

declare module "HyperTickerWebPartStrings" {
  const strings: IHyperTickerWebPartStrings;
  export = strings;
}
