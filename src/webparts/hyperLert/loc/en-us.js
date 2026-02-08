define([], function () {
  return {
    // Page headers
    PropertyPaneDescription: "Configure alert rules and notification settings.",
    NotificationPageDescription: "Configure notification delivery channels and defaults.",
    AdvancedPageDescription: "Configure alert history, cooldown, and advanced settings.",

    // Page 1 - Rules Overview
    RulesGroupName: "Rules Overview",
    TitleFieldLabel: "Dashboard Title",
    RefreshIntervalFieldLabel: "Auto-Refresh Interval (seconds)",
    RuleCountLabel: "Configured Rules",
    AddRuleLabel: "Add Rule",

    // Page 2 - Notification Defaults
    NotificationGroupName: "Notification Channels",
    EnableEmailLabel: "Enable Email Notifications",
    EnableTeamsLabel: "Enable Teams Chat Notifications",
    EnableBannerLabel: "Enable In-Page Banners",
    EmailFromNameLabel: "Email From Name",
    DefaultEmailTemplateLabel: "Default Email Template (HTML)",
    MaxBannersLabel: "Maximum Visible Banners (1-10)",
    DefaultSeverityLabel: "Default Severity for New Rules",

    // Page 3 - Advanced
    AdvancedGroupName: "History & Advanced",
    HistoryListNameLabel: "History List Name",
    MaxHistoryItemsLabel: "Maximum History Items (50-500)",
    GlobalCooldownLabel: "Global Cooldown Between Notifications (minutes)",
    AutoCreateListLabel: "Auto-Create History List If Missing",

    // Dashboard UI
    DashboardTitle: "Alert Dashboard",
    NoRulesTitle: "No Alert Rules Configured",
    NoRulesDescription: "Add alert rules using the property pane to get started.",
    ActiveAlertsLabel: "Active Alerts",
    FilterLabel: "Filter",
    HistoryLabel: "History",
    RefreshLabel: "Refresh",
    SearchPlaceholder: "Search rules...",
    SeverityFilterLabel: "Severity",
    StatusFilterLabel: "Status",
    ClearFiltersLabel: "Clear Filters",
    AllLabel: "All",

    // Rule Card
    LastTriggeredLabel: "Last triggered",
    NeverTriggeredLabel: "Never triggered",
    TriggerCountLabel: "Triggers today",
    SnoozeLabel: "Snooze",
    AcknowledgeLabel: "Acknowledge",
    EditRuleLabel: "Edit",
    EnableLabel: "Enabled",
    DisableLabel: "Disabled",

    // Snooze options
    Snooze15Min: "15 minutes",
    Snooze30Min: "30 minutes",
    Snooze1Hour: "1 hour",
    Snooze4Hours: "4 hours",
    Snooze24Hours: "24 hours",

    // History Panel
    HistoryPanelTitle: "Alert History",
    TimestampColumn: "Time",
    RuleNameColumn: "Rule",
    SeverityColumn: "Severity",
    TriggeredValueColumn: "Triggered Value",
    ChannelsColumn: "Channels",
    StatusColumn: "Status",
    NoHistoryMessage: "No alert history entries found.",

    // Banner
    DismissLabel: "Dismiss",

    // Severity labels
    SeverityInfo: "Info",
    SeverityWarning: "Warning",
    SeverityCritical: "Critical",
    SeveritySuccess: "Success",

    // Status labels
    StatusActive: "Active",
    StatusSnoozed: "Snoozed",
    StatusAcknowledged: "Acknowledged",
    StatusExpired: "Expired",
    StatusDisabled: "Disabled",

    // Rule Builder
    RuleBuilderTitle: "Rule Builder",
    RuleBuilderEditTitle: "Edit Rule",
    StepDataSource: "Data Source",
    StepConditions: "Conditions",
    StepActions: "Actions",
    StepSchedule: "Schedule",
    NextLabel: "Next",
    PreviousLabel: "Previous",
    SaveRuleLabel: "Save Rule",
    CancelLabel: "Cancel",

    // Data Source Step
    DataSourceTypeLabel: "Data Source Type",
    SpListLabel: "SharePoint List",
    GraphApiLabel: "Graph API",
    ListNameLabel: "List Name",
    SiteUrlLabel: "Site URL (blank = current site)",
    SelectFieldsLabel: "Select Fields (comma-separated)",
    FilterExpressionLabel: "OData Filter Expression",
    MaxItemsLabel: "Max Items to Fetch",
    GraphEndpointLabel: "Graph API Endpoint",
    GraphEndpointHint: "e.g., /me/presence, /me/calendar/events",

    // Condition Step
    AddConditionLabel: "Add Condition",
    RemoveConditionLabel: "Remove",
    FieldLabel: "Field",
    OperatorLabel: "Operator",
    ValueLabel: "Value",
    Value2Label: "Value 2 (upper bound)",
    LogicalOperatorLabel: "Join With",
    NoConditionsMessage: "Add at least one condition.",

    // Action Step
    EmailChannelLabel: "Email",
    TeamsChannelLabel: "Teams Chat",
    BannerChannelLabel: "In-Page Banner",
    RecipientsLabel: "Recipients (comma-separated emails)",
    SubjectLabel: "Email Subject",
    BodyTemplateLabel: "Email Body Template (HTML)",
    PreviewEmailLabel: "Preview Email",
    TeamsRecipientsLabel: "Teams Recipients (comma-separated emails)",
    BannerMessageLabel: "Banner Message",
    BannerDurationLabel: "Auto-Dismiss (seconds, 0 = manual)",

    // Schedule Step
    RuleNameLabel: "Rule Name",
    RuleDescriptionLabel: "Description",
    SeverityLabel: "Severity",
    CheckIntervalLabel: "Check Interval (seconds)",
    CooldownLabel: "Cooldown Between Notifications (minutes)",
    MaxNotificationsLabel: "Max Notifications Per Day",
    ActiveHoursStartLabel: "Active Hours Start (HH:mm)",
    ActiveHoursEndLabel: "Active Hours End (HH:mm)",
    ActiveHoursHint: "Leave blank for always active",

    // Email Preview
    EmailPreviewTitle: "Email Preview",
    ShowPreviewLabel: "Preview",
    ShowTemplateLabel: "Template",
  };
});
