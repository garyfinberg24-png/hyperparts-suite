declare interface IHyperDirectoryWebPartStrings {
  // Page headers
  PropertyPaneDescription: string;
  LayoutPageDescription: string;
  FeaturesPageDescription: string;
  DataPageDescription: string;

  // Group names
  LayoutGroupName: string;
  RollerDexGroupName: string;
  FeaturesGroupName: string;
  ActionsGroupName: string;
  DataGroupName: string;
  FieldsGroupName: string;
  PerformanceGroupName: string;
  PhotoGroupName: string;

  // Layout fields
  TitleFieldLabel: string;
  LayoutModeFieldLabel: string;
  CardStyleFieldLabel: string;
  GridColumnsFieldLabel: string;
  MasonryColumnsFieldLabel: string;
  SortFieldLabel: string;
  SortDirectionFieldLabel: string;

  // RollerDex fields
  RollerDexSpeedFieldLabel: string;
  RollerDexVisibleCardsFieldLabel: string;

  // Feature fields
  ShowSearchFieldLabel: string;
  ShowAlphaIndexFieldLabel: string;
  ShowFiltersFieldLabel: string;
  ShowPresenceFieldLabel: string;
  PresenceRefreshFieldLabel: string;
  ShowProfileCardFieldLabel: string;
  ShowQuickActionsFieldLabel: string;
  EnabledActionsFieldLabel: string;
  EnableVCardFieldLabel: string;

  // Data fields
  UserFilterFieldLabel: string;
  UserFilterDescription: string;
  VisibleFieldsFieldLabel: string;
  VisibleFieldsDescription: string;
  CustomFieldMappingsFieldLabel: string;
  CustomFieldMappingsDescription: string;
  PageSizeFieldLabel: string;
  PaginationModeFieldLabel: string;

  // Photo fields
  ShowPhotoPlaceholderFieldLabel: string;
  PhotoSizeFieldLabel: string;

  // Performance fields
  CacheEnabledFieldLabel: string;
  CacheDurationFieldLabel: string;

  // UI strings
  SearchPlaceholder: string;
  NoResultsTitle: string;
  NoResultsDescription: string;
  LoadingTitle: string;
  ErrorTitle: string;
  ClearFiltersLabel: string;
  AllDepartmentsLabel: string;
  AllLocationsLabel: string;
  AllTitlesLabel: string;
  AllCompaniesLabel: string;
  PreviousPageLabel: string;
  NextPageLabel: string;
  PageOfLabel: string;
  ShowingResultsLabel: string;
  ProfileCardTitle: string;
  EmailActionLabel: string;
  TeamsChatActionLabel: string;
  TeamsCallActionLabel: string;
  ScheduleActionLabel: string;
  CopyEmailActionLabel: string;
  VCardActionLabel: string;
  DepartmentLabel: string;
  LocationLabel: string;
  TitleLabel: string;
  CompanyLabel: string;
  PhoneLabel: string;
  MobileLabel: string;
  ManagerLabel: string;
}

declare module "HyperDirectoryWebPartStrings" {
  const strings: IHyperDirectoryWebPartStrings;
  export = strings;
}
