declare interface IHyperExplorerWebPartStrings {
  PropertyPaneDescription: string;

  /* Page 1 — General */
  GeneralGroupName: string;
  TitleFieldLabel: string;
  LibraryNameFieldLabel: string;
  RootFolderFieldLabel: string;
  ViewModeFieldLabel: string;
  SortModeFieldLabel: string;
  SortDirectionFieldLabel: string;
  ItemsPerPageFieldLabel: string;
  ShowFoldersFieldLabel: string;
  UseSampleDataFieldLabel: string;
  WizardCompletedFieldLabel: string;

  /* Page 2 — Preview & Display */
  PreviewDisplayPageDescription: string;
  PreviewGroupName: string;
  EnablePreviewFieldLabel: string;
  PreviewModeFieldLabel: string;
  EnableLightboxFieldLabel: string;
  EnableVideoPlaylistFieldLabel: string;
  EnableMetadataOverlayFieldLabel: string;
  ShowThumbnailsFieldLabel: string;
  ThumbnailSizeFieldLabel: string;

  /* Page 3 — Features */
  FeaturesPageDescription: string;
  FeaturesGroupName: string;
  EnableUploadFieldLabel: string;
  EnableQuickActionsFieldLabel: string;
  EnableCompareFieldLabel: string;
  EnableWatermarkFieldLabel: string;
  WatermarkTextFieldLabel: string;
  FileTypeFilterFieldLabel: string;
  EnableRecentFilesFieldLabel: string;
  MaxRecentFilesFieldLabel: string;
  EnableFolderTreeFieldLabel: string;
  EnableBreadcrumbsFieldLabel: string;
  CacheEnabledFieldLabel: string;

  /* Page 3 — File Plan & Compliance */
  FilePlanGroupName: string;
  EnableFilePlanFieldLabel: string;
  ShowComplianceBadgesFieldLabel: string;
  RequireRetentionLabelFieldLabel: string;

  /* Component strings */
  NoFilesTitle: string;
  NoFilesDescription: string;
  LoadingLabel: string;
  UploadFilesLabel: string;
  DropFilesHereLabel: string;
  SearchPlaceholder: string;
  SelectAllLabel: string;
  ClearSelectionLabel: string;
  DownloadSelectedLabel: string;
  CompareLabel: string;
  PreviewLabel: string;
  CloseLabel: string;
  NextLabel: string;
  PreviousLabel: string;
  ZoomInLabel: string;
  ZoomOutLabel: string;
  ResetZoomLabel: string;
  ShareLabel: string;
  CopyLinkLabel: string;
  DownloadLabel: string;
  RenameLabel: string;
  MoveLabel: string;
  DeleteLabel: string;
  PropertiesLabel: string;
  WatermarkLabel: string;
  RecentFilesLabel: string;
  LoadMoreLabel: string;
  EditModeLabel: string;

  /* File Plan component strings */
  FilePlanDashboardTitle: string;
  FilePlanWizardTitle: string;
  ApplyRetentionLabelTitle: string;
  ApplyRetentionLabelAction: string;
  RetentionLabelLabel: string;
  FilePlanDescriptorsLabel: string;
  LabeledLabel: string;
  UnlabeledLabel: string;
  CoverageLabel: string;
  LabelsInUseLabel: string;
  RecentActivityLabel: string;
  ConfigureFilePlanLabel: string;
  NoLabelsAppliedLabel: string;
  SelectRetentionLabelLabel: string;
  ApplyLabelButton: string;
  CancelButton: string;
  FilePlanButton: string;
  ComplianceBadgeNoLabel: string;
  ComplianceBadgeExpired: string;
  ComplianceBadgeLocked: string;
  ComplianceBadgeRecord: string;
  ComplianceBadgeLabeled: string;
  WizardScopeStepTitle: string;
  WizardLabelsStepTitle: string;
  WizardDescriptorsStepTitle: string;
  WizardRulesStepTitle: string;
  PurviewPermissionHint: string;

  /* Metadata Profiles & Naming */
  MetadataProfilesGroupName: string;
  EnableMetadataProfilesFieldLabel: string;
  EnableNamingConventionFieldLabel: string;
  EnableZipDownloadFieldLabel: string;
  MetadataUploadTitle: string;
  NamingConventionTitle: string;
  KeyboardShortcutsTitle: string;
  DemoModeLabel: string;
  SampleDataBannerText: string;
  ProfiledUploadLabel: string;
  NamingLabel: string;
  UploadWithProfileAction: string;
  AddToZipAction: string;
}

declare module "HyperExplorerWebPartStrings" {
  const strings: IHyperExplorerWebPartStrings;
  export = strings;
}
