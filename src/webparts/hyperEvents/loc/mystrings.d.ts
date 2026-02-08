declare interface IHyperEventsWebPartStrings {
  PropertyPaneDescription: string;
  LayoutGroupName: string;
  FeaturesGroupName: string;
  DataGroupName: string;
  TitleFieldLabel: string;
  ViewModeFieldLabel: string;
  DefaultViewFieldLabel: string;
  RefreshIntervalFieldLabel: string;
  EnableRsvpLabel: string;
  EnableRegistrationLabel: string;
  EnableCountdownLabel: string;
  CountdownEventIdLabel: string;
  EnableNotificationsLabel: string;
  EnableCategoryFilterLabel: string;
  EnableLocationLinksLabel: string;
  EnableVirtualLinksLabel: string;
  EnablePastArchiveLabel: string;
  ShowCalendarOverlayLabel: string;
  RsvpListNameLabel: string;
  RegistrationListNameLabel: string;
  CacheDurationFieldLabel: string;
  FeaturesPageDescription: string;
  DataPageDescription: string;
  ViewModeMonth: string;
  ViewModeWeek: string;
  ViewModeDay: string;
  ViewModeAgenda: string;
  ViewModeTimeline: string;
  ViewModeCardGrid: string;
  // Source management
  SourcesGroupName: string;
  SourceHeaderPrefix: string;
  SourceNameLabel: string;
  SourceTypeLabel: string;
  SourceColorLabel: string;
  SourceListNameLabel: string;
  SourceSiteUrlLabel: string;
  SourceCalendarIdLabel: string;
  SourceGroupIdLabel: string;
  SourceEnabledLabel: string;
  AddSourceLabel: string;
  RemoveSourceLabel: string;
  NewSourceDefaultName: string;
  MoveUpLabel: string;
  MoveDownLabel: string;
  // Category management
  CategoriesGroupName: string;
  CategoriesSectionLabel: string;
  CategoryNameLabel: string;
  CategoryColorLabel: string;
  AddCategoryLabel: string;
  RemoveCategoryLabel: string;
  NewCategoryDefaultName: string;
  // Registration field management
  RegistrationFieldsGroupName: string;
  RegistrationFieldsSectionLabel: string;
  FieldLabelLabel: string;
  FieldTypeLabel: string;
  FieldOptionsLabel: string;
  FieldRequiredLabel: string;
  AddFieldLabel: string;
  RemoveFieldLabel: string;
  NewFieldDefaultLabel: string;
  // Storage
  StorageGroupName: string;
}

declare module "HyperEventsWebPartStrings" {
  const strings: IHyperEventsWebPartStrings;
  export = strings;
}
