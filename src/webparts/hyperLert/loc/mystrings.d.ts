declare interface IHyperLertWebPartStrings {
  // Page headers
  PropertyPaneDescription: string;
  NotificationPageDescription: string;
  AdvancedPageDescription: string;

  // Page 1 - Rules Overview
  RulesGroupName: string;
  TitleFieldLabel: string;
  RefreshIntervalFieldLabel: string;
  RuleCountLabel: string;
  AddRuleLabel: string;

  // Page 2 - Notification Defaults
  NotificationGroupName: string;
  EnableEmailLabel: string;
  EnableTeamsLabel: string;
  EnableBannerLabel: string;
  EmailFromNameLabel: string;
  DefaultEmailTemplateLabel: string;
  MaxBannersLabel: string;
  DefaultSeverityLabel: string;

  // Page 3 - Advanced
  AdvancedGroupName: string;
  HistoryListNameLabel: string;
  MaxHistoryItemsLabel: string;
  GlobalCooldownLabel: string;
  AutoCreateListLabel: string;

  // Dashboard UI
  DashboardTitle: string;
  NoRulesTitle: string;
  NoRulesDescription: string;
  ActiveAlertsLabel: string;
  FilterLabel: string;
  HistoryLabel: string;
  RefreshLabel: string;
  SearchPlaceholder: string;
  SeverityFilterLabel: string;
  StatusFilterLabel: string;
  ClearFiltersLabel: string;
  AllLabel: string;

  // Rule Card
  LastTriggeredLabel: string;
  NeverTriggeredLabel: string;
  TriggerCountLabel: string;
  SnoozeLabel: string;
  AcknowledgeLabel: string;
  EditRuleLabel: string;
  EnableLabel: string;
  DisableLabel: string;

  // Snooze options
  Snooze15Min: string;
  Snooze30Min: string;
  Snooze1Hour: string;
  Snooze4Hours: string;
  Snooze24Hours: string;

  // History Panel
  HistoryPanelTitle: string;
  TimestampColumn: string;
  RuleNameColumn: string;
  SeverityColumn: string;
  TriggeredValueColumn: string;
  ChannelsColumn: string;
  StatusColumn: string;
  NoHistoryMessage: string;

  // Banner
  DismissLabel: string;

  // Severity labels
  SeverityInfo: string;
  SeverityWarning: string;
  SeverityCritical: string;
  SeveritySuccess: string;

  // Status labels
  StatusActive: string;
  StatusSnoozed: string;
  StatusAcknowledged: string;
  StatusExpired: string;
  StatusDisabled: string;

  // Rule Builder
  RuleBuilderTitle: string;
  RuleBuilderEditTitle: string;
  StepDataSource: string;
  StepConditions: string;
  StepActions: string;
  StepSchedule: string;
  NextLabel: string;
  PreviousLabel: string;
  SaveRuleLabel: string;
  CancelLabel: string;

  // Data Source Step
  DataSourceTypeLabel: string;
  SpListLabel: string;
  GraphApiLabel: string;
  ListNameLabel: string;
  SiteUrlLabel: string;
  SelectFieldsLabel: string;
  FilterExpressionLabel: string;
  MaxItemsLabel: string;
  GraphEndpointLabel: string;
  GraphEndpointHint: string;

  // Condition Step
  AddConditionLabel: string;
  RemoveConditionLabel: string;
  FieldLabel: string;
  OperatorLabel: string;
  ValueLabel: string;
  Value2Label: string;
  LogicalOperatorLabel: string;
  NoConditionsMessage: string;

  // Action Step
  EmailChannelLabel: string;
  TeamsChannelLabel: string;
  BannerChannelLabel: string;
  RecipientsLabel: string;
  SubjectLabel: string;
  BodyTemplateLabel: string;
  PreviewEmailLabel: string;
  TeamsRecipientsLabel: string;
  BannerMessageLabel: string;
  BannerDurationLabel: string;

  // Schedule Step
  RuleNameLabel: string;
  RuleDescriptionLabel: string;
  SeverityLabel: string;
  CheckIntervalLabel: string;
  CooldownLabel: string;
  MaxNotificationsLabel: string;
  ActiveHoursStartLabel: string;
  ActiveHoursEndLabel: string;
  ActiveHoursHint: string;

  // Email Preview
  EmailPreviewTitle: string;
  ShowPreviewLabel: string;
  ShowTemplateLabel: string;
}

declare module "HyperLertWebPartStrings" {
  const strings: IHyperLertWebPartStrings;
  export = strings;
}
