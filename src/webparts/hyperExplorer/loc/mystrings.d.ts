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
}

declare module "HyperExplorerWebPartStrings" {
  const strings: IHyperExplorerWebPartStrings;
  export = strings;
}
