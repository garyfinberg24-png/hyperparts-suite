declare interface IHyperPollWebPartStrings {
  PropertyPaneDescription: string;
  GeneralGroupName: string;
  FeaturesGroupName: string;
  PollManagementGroupName: string;
  TitleFieldLabel: string;
  DisplayModeFieldLabel: string;
  DefaultChartTypeFieldLabel: string;
  ShowInlineResultsLabel: string;
  ApplyTemplateLabel: string;
  ApplyTemplateNone: string;
  EnableExportLabel: string;
  RefreshIntervalFieldLabel: string;
  CacheDurationFieldLabel: string;
  ResponseListNameLabel: string;
  FeaturesPageDescription: string;
  DataPageDescription: string;
  DisplayModeCarousel: string;
  DisplayModeStacked: string;
  ChartTypeBar: string;
  ChartTypePie: string;
  ChartTypeDonut: string;
  // Poll management
  PollHeaderPrefix: string;
  PollTitleLabel: string;
  PollDescriptionLabel: string;
  PollStatusLabel: string;
  PollAnonymousLabel: string;
  PollResultsVisibilityLabel: string;
  PollStartDateLabel: string;
  PollEndDateLabel: string;
  AddPollLabel: string;
  RemovePollLabel: string;
  MoveUpLabel: string;
  MoveDownLabel: string;
  // Question management
  QuestionHeaderPrefix: string;
  QuestionTextLabel: string;
  QuestionTypeLabel: string;
  QuestionRequiredLabel: string;
  QuestionRatingMaxLabel: string;
  AddQuestionLabel: string;
  RemoveQuestionLabel: string;
  // Option management
  OptionHeaderPrefix: string;
  OptionTextLabel: string;
  OptionColorLabel: string;
  AddOptionLabel: string;
  RemoveOptionLabel: string;
  // Status options
  StatusDraft: string;
  StatusActive: string;
  StatusClosed: string;
  StatusArchived: string;
  // Results visibility options
  VisibilityAfterVote: string;
  VisibilityAfterClose: string;
  VisibilityAdminOnly: string;
  // Question type options
  TypeSingleChoice: string;
  TypeMultipleChoice: string;
  TypeRating: string;
  TypeNps: string;
  TypeRanking: string;
  TypeOpenText: string;
  // Template names
  TemplateNpsSurvey: string;
  TemplateEventFeedback: string;
  TemplateQuickPulse: string;
  // Wizard & Demo
  WizardGroupName: string;
  ShowWizardOnInitLabel: string;
  UseSampleDataLabel: string;
  EnableDemoModeLabel: string;
}

declare module "HyperPollWebPartStrings" {
  const strings: IHyperPollWebPartStrings;
  export = strings;
}
