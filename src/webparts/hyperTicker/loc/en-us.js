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
  };
});
