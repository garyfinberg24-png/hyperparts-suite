define([], function () {
  return {
    // Page headers
    PropertyPaneDescription: "Configure the HyperDirectory employee directory web part.",
    LayoutPageDescription: "Layout and display settings for the directory.",
    FeaturesPageDescription: "Enable or disable directory features.",
    DataPageDescription: "Data source, field mappings, and performance settings.",

    // Group names
    LayoutGroupName: "Layout & Display",
    RollerDexGroupName: "RollerDex Settings",
    FeaturesGroupName: "Features",
    ActionsGroupName: "Quick Actions",
    DataGroupName: "Data Source",
    FieldsGroupName: "Field Configuration",
    PerformanceGroupName: "Performance",
    PhotoGroupName: "Photo Settings",

    // Layout fields
    TitleFieldLabel: "Web Part Title",
    LayoutModeFieldLabel: "Layout Mode",
    CardStyleFieldLabel: "Card Style",
    GridColumnsFieldLabel: "Grid Columns",
    MasonryColumnsFieldLabel: "Masonry Columns",
    SortFieldLabel: "Sort By",
    SortDirectionFieldLabel: "Sort Direction",

    // RollerDex fields
    RollerDexSpeedFieldLabel: "Rotation Speed (seconds)",
    RollerDexVisibleCardsFieldLabel: "Visible Cards",

    // Feature fields
    ShowSearchFieldLabel: "Show Search Bar",
    ShowAlphaIndexFieldLabel: "Show A-Z Index",
    ShowFiltersFieldLabel: "Show Filters",
    ShowPresenceFieldLabel: "Show Presence Indicators",
    PresenceRefreshFieldLabel: "Presence Refresh Interval (seconds)",
    ShowProfileCardFieldLabel: "Enable Profile Card Popup",
    ShowQuickActionsFieldLabel: "Show Quick Actions",
    EnabledActionsFieldLabel: "Enabled Actions (JSON)",
    EnableVCardFieldLabel: "Enable vCard Export",

    // Hyper features
    HyperFeaturesGroupName: "Hyper Features",
    EnableExportFieldLabel: "Enable CSV Export",
    EnableSkillsSearchFieldLabel: "Enable Skills & Expertise Search",
    ShowCompletenessScoreFieldLabel: "Show Profile Completeness Score",
    ShowPronounsFieldLabel: "Show Pronouns & Personal Details",
    ShowSmartOooFieldLabel: "Show Smart Out-of-Office Status",
    ShowQrCodeFieldLabel: "Show Profile QR Code",
    UseSampleDataFieldLabel: "Seed with Sample Data",

    // Data fields
    UserFilterFieldLabel: "User Filter (OData)",
    UserFilterDescription: "Optional OData filter for Graph /users endpoint. Example: department eq 'Engineering'",
    VisibleFieldsFieldLabel: "Visible Fields (JSON)",
    VisibleFieldsDescription: "JSON array of field names to display. Example: [\"displayName\",\"jobTitle\",\"department\"]",
    CustomFieldMappingsFieldLabel: "Custom Field Mappings (JSON)",
    CustomFieldMappingsDescription: "Map extension attributes to labels. Example: {\"extensionAttribute1\":\"Employee Type\"}",
    PageSizeFieldLabel: "Page Size",
    PaginationModeFieldLabel: "Pagination Mode",

    // Photo fields
    ShowPhotoPlaceholderFieldLabel: "Show Photo Placeholder",
    PhotoSizeFieldLabel: "Photo Size",

    // Performance fields
    CacheEnabledFieldLabel: "Enable Caching",
    CacheDurationFieldLabel: "Cache Duration (minutes)",

    // UI strings
    SearchPlaceholder: "Search people...",
    NoResultsTitle: "No People Found",
    NoResultsDescription: "Try adjusting your search or filters.",
    LoadingTitle: "Loading directory...",
    ErrorTitle: "Unable to Load Directory",
    ClearFiltersLabel: "Clear All Filters",
    AllDepartmentsLabel: "All Departments",
    AllLocationsLabel: "All Locations",
    AllTitlesLabel: "All Titles",
    AllCompaniesLabel: "All Companies",
    PreviousPageLabel: "Previous Page",
    NextPageLabel: "Next Page",
    PageOfLabel: "Page {0} of {1}",
    ShowingResultsLabel: "Showing {0} of {1} people",
    ProfileCardTitle: "Profile Details",
    EmailActionLabel: "Send Email",
    TeamsChatActionLabel: "Teams Chat",
    TeamsCallActionLabel: "Teams Call",
    ScheduleActionLabel: "Schedule Meeting",
    CopyEmailActionLabel: "Copy Email",
    VCardActionLabel: "Download vCard",
    DepartmentLabel: "Department",
    LocationLabel: "Location",
    TitleLabel: "Title",
    CompanyLabel: "Company",
    PhoneLabel: "Phone",
    MobileLabel: "Mobile",
    ManagerLabel: "Manager",
  };
});
