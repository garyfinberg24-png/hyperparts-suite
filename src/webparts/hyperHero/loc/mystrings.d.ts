declare interface IHyperHeroWebPartStrings {
  PropertyPaneDescription: string;
  LayoutGroupName: string;
  TilesGroupName: string;
  RotationGroupName: string;
  ContentBindingGroupName: string;
  AdvancedGroupName: string;
  TitleFieldLabel: string;
  HeroHeightFieldLabel: string;
  BorderRadiusFieldLabel: string;
  FullBleedFieldLabel: string;
  ConfigureTilesLabel: string;
  ConfigureLayoutLabel: string;
  RotationEnabledLabel: string;
  RotationIntervalLabel: string;
  TransitionEffectLabel: string;
  TransitionDurationLabel: string;
  PauseOnHoverLabel: string;
  ShowDotsLabel: string;
  ShowArrowsLabel: string;
  ContentBindingEnabledLabel: string;
  ListNameLabel: string;
  MaxItemsLabel: string;
}

declare module 'HyperHeroWebPartStrings' {
  const strings: IHyperHeroWebPartStrings;
  export = strings;
}
