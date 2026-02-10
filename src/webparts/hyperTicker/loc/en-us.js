define([], function () {
  return {
    // Property pane
    PropertyPaneDescription: "Configure the HyperTicker news ticker web part.",
    ContentSourcesGroupName: "Content Sources",
    AppearanceGroupName: "Appearance",
    AdvancedGroupName: "Advanced",
    AppearancePageDescription: "Customize the ticker appearance and behavior.",
    AdvancedPageDescription: "Configure auto-refresh, audience targeting, and analytics.",

    // Page 1: Content Sources
    TitleFieldLabel: "Title",
    DisplayModeFieldLabel: "Display Mode",
    ListNameFieldLabel: "SharePoint List Name",
    ListFilterFieldLabel: "List Filter (OData)",
    RssConfigsFieldLabel: "RSS Feed Configurations (JSON)",
    ManualItemCountLabel: "Manual Items",

    // Page 2: Appearance
    PositionFieldLabel: "Position",
    DirectionFieldLabel: "Scroll Direction",
    SpeedFieldLabel: "Speed",
    PauseOnHoverFieldLabel: "Pause on Hover",
    DefaultSeverityFieldLabel: "Default Severity",
    CriticalOverrideBgFieldLabel: "Critical Background Color",
    CriticalOverrideTextFieldLabel: "Critical Text Color",

    // Page 3: Advanced
    AutoRefreshIntervalFieldLabel: "Auto-Refresh Interval (seconds)",
    EnableItemAudienceFieldLabel: "Enable Item Audience Targeting",

    // Component strings
    NoItemsTitle: "No Ticker Items",
    NoItemsDescription: "Add ticker items via the property pane, connect a SharePoint list, or configure an RSS feed.",

    // V2: Wizard
    WizardTitle: "HyperTicker Setup Wizard",
    WizardWelcomeTagline: "The most powerful communication command strip for SharePoint",
    WizardPathTemplate: "Template",
    WizardPathScratch: "From Scratch",
    WizardPathDemo: "Demo Mode",
    WizardStepTemplates: "Template Gallery",
    WizardStepDataSource: "Data Source",
    WizardStepDisplayMode: "Display Mode",
    WizardStepFeatures: "Features",
    WizardStepAppearance: "Appearance",
    WizardRunSetup: "Run Setup Wizard",
    WizardReRunSetup: "Re-run Setup",

    // V2: Templates
    TemplateCompanyNews: "Company News",
    TemplateItServiceDesk: "IT Service Desk",
    TemplateHrAnnouncements: "HR Announcements",
    TemplateEmergencyAlerts: "Emergency Alerts",
    TemplateEventCountdown: "Event Countdown",
    TemplateStockTicker: "Stock Ticker",
    TemplateSocialFeed: "Social Feed",
    TemplateProjectStatus: "Project Status",
    TemplateCompliance: "Compliance",
    TemplateMultiSource: "Multi-Source Mix",

    // V2: Data Sources
    DataSourceManual: "Manual Items",
    DataSourceSpList: "SharePoint List",
    DataSourceRss: "RSS Feed",
    DataSourceGraph: "Microsoft Graph",
    DataSourceRestApi: "REST API",
    GraphEndpointFieldLabel: "Graph API Endpoint",
    RestApiUrlFieldLabel: "REST API URL",
    RestApiHeadersFieldLabel: "Custom Headers (JSON)",

    // V2: Display Modes
    DisplayModeScroll: "Scrolling Marquee",
    DisplayModeFade: "Fading Rotation",
    DisplayModeStatic: "Static Rotation",
    DisplayModeStacked: "Stacked Cards",
    DisplayModeVertical: "Vertical Scroll",
    DisplayModeTypewriter: "Typewriter",
    DisplayModeSplit: "Split Panel",
    DisplayModeBreaking: "Breaking News",

    // V2: Features
    EnableDismissFieldLabel: "Enable Dismiss",
    EnableAcknowledgeFieldLabel: "Enable Acknowledge",
    EnableExpandFieldLabel: "Enable Expand Details",
    EnableCopyFieldLabel: "Enable Copy to Clipboard",
    EnableAnalyticsFieldLabel: "Enable Analytics",
    EnableEmergencyModeFieldLabel: "Enable Emergency Mode",
    EnableGradientFadeFieldLabel: "Enable Gradient Edge Fade",
    EnableCategoryDividersFieldLabel: "Enable Category Dividers",

    // V2: Appearance
    HeightPresetFieldLabel: "Ticker Height",
    HeightPresetCompact: "Compact (32px)",
    HeightPresetStandard: "Standard (40px)",
    HeightPresetLarge: "Large (52px)",
    TemplateFieldLabel: "Template",
    BackgroundGradientFieldLabel: "Background CSS",
    EnableDemoModeFieldLabel: "Enable Demo Mode",
    DemoPresetFieldLabel: "Demo Preset",

    // V2: Demo Bar
    DemoModeLabel: "DEMO MODE",
    DemoExitLabel: "Exit Demo",
    DemoItemCount: "items",
  };
});
