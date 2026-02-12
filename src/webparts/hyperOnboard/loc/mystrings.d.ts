declare interface IHyperOnboardWebPartStrings {
  PropertyPaneDescription: string;
  ContentGroupName: string;
  FeaturesGroupName: string;
  AdvancedGroupName: string;
  FeaturesPageDescription: string;
  AdvancedPageDescription: string;

  TitleFieldLabel: string;
  LayoutModeFieldLabel: string;
  TrackTemplateFieldLabel: string;
  TasksListNameFieldLabel: string;
  ProgressListNameFieldLabel: string;
  UseSampleDataFieldLabel: string;

  EnableProgressRingFieldLabel: string;
  EnableCheckInStreakFieldLabel: string;
  EnableMilestonesFieldLabel: string;
  EnableMentorFieldLabel: string;
  EnableResourcesFieldLabel: string;
  EnableDependenciesFieldLabel: string;
  EnableConfettiFieldLabel: string;

  MentorEmailFieldLabel: string;
  MaxTasksFieldLabel: string;
  CacheDurationFieldLabel: string;

  DashboardLabel: string;
  TimelineLabel: string;
  ChecklistLabel: string;
  CardsLabel: string;
  ProgressLabel: string;
  TasksCompleteLabel: string;
  StreakLabel: string;
  CheckInLabel: string;
  MentorLabel: string;
  ChatLabel: string;
  ResourcesLabel: string;
  MilestoneUnlockedLabel: string;
  NoTasksTitle: string;
  NoTasksDescription: string;
  SampleDataBanner: string;
}

declare module "HyperOnboardWebPartStrings" {
  const strings: IHyperOnboardWebPartStrings;
  export = strings;
}
