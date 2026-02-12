declare interface IHyperFlowWebPartStrings {
  PropertyPaneDescription: string;
  ContentGroupName: string;
  LayoutGroupName: string;
  FeaturesGroupName: string;
  LayoutPageDescription: string;
  FeaturesPageDescription: string;

  TitleFieldLabel: string;
  FlowModeFieldLabel: string;
  DataSourceFieldLabel: string;
  ListIdFieldLabel: string;
  UseSampleDataFieldLabel: string;

  VisualStyleFieldLabel: string;
  FunctionalLayoutFieldLabel: string;
  ColorThemeFieldLabel: string;

  ShowStepNumbersFieldLabel: string;
  EnableAnimationFieldLabel: string;
  ShowConnectorLabelsFieldLabel: string;
  EnableDemoModeFieldLabel: string;

  SampleDataBanner: string;
  NoFlowTitle: string;
  NoFlowDescription: string;
  VisualModeLabel: string;
  FunctionalModeLabel: string;
}

declare module "HyperFlowWebPartStrings" {
  const strings: IHyperFlowWebPartStrings;
  export = strings;
}
