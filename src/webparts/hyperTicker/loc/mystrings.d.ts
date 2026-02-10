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

  // V2: Wizard
  WizardTitle: string;
  WizardWelcomeTagline: string;
  WizardPathTemplate: string;
  WizardPathScratch: string;
  WizardPathDemo: string;
  WizardStepTemplates: string;
  WizardStepDataSource: string;
  WizardStepDisplayMode: string;
  WizardStepFeatures: string;
  WizardStepAppearance: string;
  WizardRunSetup: string;
  WizardReRunSetup: string;

  // V2: Templates
  TemplateCompanyNews: string;
  TemplateItServiceDesk: string;
  TemplateHrAnnouncements: string;
  TemplateEmergencyAlerts: string;
  TemplateEventCountdown: string;
  TemplateStockTicker: string;
  TemplateSocialFeed: string;
  TemplateProjectStatus: string;
  TemplateCompliance: string;
  TemplateMultiSource: string;

  // V2: Data Sources
  DataSourceManual: string;
  DataSourceSpList: string;
  DataSourceRss: string;
  DataSourceGraph: string;
  DataSourceRestApi: string;
  GraphEndpointFieldLabel: string;
  RestApiUrlFieldLabel: string;
  RestApiHeadersFieldLabel: string;

  // V2: Display Modes
  DisplayModeScroll: string;
  DisplayModeFade: string;
  DisplayModeStatic: string;
  DisplayModeStacked: string;
  DisplayModeVertical: string;
  DisplayModeTypewriter: string;
  DisplayModeSplit: string;
  DisplayModeBreaking: string;

  // V2: Features
  EnableDismissFieldLabel: string;
  EnableAcknowledgeFieldLabel: string;
  EnableExpandFieldLabel: string;
  EnableCopyFieldLabel: string;
  EnableAnalyticsFieldLabel: string;
  EnableEmergencyModeFieldLabel: string;
  EnableGradientFadeFieldLabel: string;
  EnableCategoryDividersFieldLabel: string;

  // V2: Appearance
  HeightPresetFieldLabel: string;
  HeightPresetCompact: string;
  HeightPresetStandard: string;
  HeightPresetLarge: string;
  TemplateFieldLabel: string;
  BackgroundGradientFieldLabel: string;
  EnableDemoModeFieldLabel: string;
  DemoPresetFieldLabel: string;

  // V2: Demo Bar
  DemoModeLabel: string;
  DemoExitLabel: string;
  DemoItemCount: string;
}

declare module "HyperTickerWebPartStrings" {
  const strings: IHyperTickerWebPartStrings;
  export = strings;
}
