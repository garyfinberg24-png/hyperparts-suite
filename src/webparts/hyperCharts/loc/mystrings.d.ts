declare interface IHyperChartsWebPartStrings {
  // Page headers
  PropertyPaneDescription: string;
  ChartsPageDescription: string;
  AdvancedPageDescription: string;

  // Page 1 - Layout
  LayoutGroupName: string;
  TitleFieldLabel: string;
  GridColumnsFieldLabel: string;
  GridGapFieldLabel: string;

  // Page 2 - Features
  FeaturesGroupName: string;
  EnableDrillDownLabel: string;
  EnableExportLabel: string;
  EnableConditionalColorsLabel: string;
  EnableComparisonLabel: string;
  EnableAccessibilityTablesLabel: string;

  // Page 3 - Advanced
  DataGroupName: string;
  RefreshIntervalFieldLabel: string;
  CacheDurationFieldLabel: string;
  PowerBiEmbedUrlFieldLabel: string;

  // Chart management
  ChartsGroupName: string;
  ChartHeaderPrefix: string;
  ChartTitleLabel: string;
  ChartKindLabel: string;
  ChartDisplayTypeLabel: string;
  ChartShowLegendLabel: string;
  ChartAnimateLabel: string;
  ChartColSpanLabel: string;
  AddChartLabel: string;
  RemoveChartLabel: string;
  MoveUpLabel: string;
  MoveDownLabel: string;
  NewChartDefaultTitle: string;

  // Data source
  DataSourceTypeLabel: string;
  ListNameLabel: string;
  SiteUrlLabel: string;
  FilterLabel: string;
  ManualLabelsLabel: string;
  ManualValuesLabel: string;

  // Wizard & Demo
  ShowWizardOnInitLabel: string;
  UseSampleDataLabel: string;
  DemoModeLabel: string;
  SetupGroupName: string;
}

declare module "HyperChartsWebPartStrings" {
  const strings: IHyperChartsWebPartStrings;
  export = strings;
}
