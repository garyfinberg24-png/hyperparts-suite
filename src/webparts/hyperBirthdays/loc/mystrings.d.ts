declare interface IHyperBirthdaysWebPartStrings {
  PropertyPaneDescription: string;
  DataSourcesGroupName: string;
  CelebrationTypesGroupName: string;
  FeaturesGroupName: string;
  CelebrationTypesPageDescription: string;
  FeaturesPageDescription: string;

  TitleFieldLabel: string;
  ViewModeFieldLabel: string;
  TimeRangeFieldLabel: string;
  EnableEntraIdFieldLabel: string;
  EnableSpListFieldLabel: string;
  SpListNameFieldLabel: string;

  EnableBirthdaysFieldLabel: string;
  EnableAnniversariesFieldLabel: string;
  EnableWeddingsFieldLabel: string;
  EnableChildBirthFieldLabel: string;
  EnableGraduationFieldLabel: string;
  EnableRetirementFieldLabel: string;
  EnablePromotionFieldLabel: string;
  EnableCustomFieldLabel: string;
  MessageTemplatesFieldLabel: string;

  EnableTeamsDeepLinkFieldLabel: string;
  EnableAnimationsFieldLabel: string;
  AnimationTypeFieldLabel: string;
  EnableMilestoneBadgesFieldLabel: string;
  EnablePrivacyOptOutFieldLabel: string;
  OptOutListNameFieldLabel: string;
  EnableManagerNotifyFieldLabel: string;
  EnableGreetingCardFieldLabel: string;
  EnableChannelPostFieldLabel: string;
  TeamsTeamIdFieldLabel: string;
  TeamsChannelIdFieldLabel: string;
  EnableWeekendShiftFieldLabel: string;
  EnableSelfServiceFieldLabel: string;
  SelfServiceListNameFieldLabel: string;
  MaxItemsFieldLabel: string;
  CacheDurationFieldLabel: string;
  PhotoSizeFieldLabel: string;

  TodayLabel: string;
  ThisWeekLabel: string;
  ThisMonthLabel: string;
  NoCelebrationsTitle: string;
  NoCelebrationsDescription: string;
  SendWishesLabel: string;
  YearsLabel: string;
  MyDatesLabel: string;
}

declare module "HyperBirthdaysWebPartStrings" {
  const strings: IHyperBirthdaysWebPartStrings;
  export = strings;
}
