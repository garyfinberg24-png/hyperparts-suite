import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { ViewMode, SortMode, SortDirection, PreviewMode } from "./IExplorerEnums";

/** Full property bag for HyperExplorer web part */
export interface IHyperExplorerWebPartProps extends IBaseHyperWebPartProps {
  /** Page 1 — General */
  title: string;
  libraryName: string;
  rootFolder: string;
  viewMode: ViewMode;
  sortMode: SortMode;
  sortDirection: SortDirection;
  itemsPerPage: number;
  showFolders: boolean;

  /** Page 2 — Preview & Display */
  enablePreview: boolean;
  previewMode: PreviewMode;
  enableLightbox: boolean;
  enableVideoPlaylist: boolean;
  enableMetadataOverlay: boolean;
  showThumbnails: boolean;
  thumbnailSize: number;

  /** Page 3 — Features */
  enableUpload: boolean;
  enableQuickActions: boolean;
  enableCompare: boolean;
  enableWatermark: boolean;
  watermarkText: string;
  fileTypeFilter: string;
  enableRecentFiles: boolean;
  maxRecentFiles: number;
  enableFolderTree: boolean;
  enableBreadcrumbs: boolean;
  cacheEnabled: boolean;
  cacheDuration: number;

  /** File Plan & Compliance */
  enableFilePlan: boolean;
  filePlanConfig: string;
  showComplianceBadges: boolean;
  requireRetentionLabel: boolean;

  /** Sample data & wizard */
  useSampleData: boolean;
  showWizardOnInit: boolean;
}

/** Default property values */
export const DEFAULT_EXPLORER_PROPS: Partial<IHyperExplorerWebPartProps> = {
  title: "HyperExplorer",
  libraryName: "Documents",
  rootFolder: "",
  viewMode: "grid",
  sortMode: "modified",
  sortDirection: "desc",
  itemsPerPage: 30,
  showFolders: true,
  enablePreview: true,
  previewMode: "tab",
  enableLightbox: true,
  enableVideoPlaylist: false,
  enableMetadataOverlay: true,
  showThumbnails: true,
  thumbnailSize: 200,
  enableUpload: true,
  enableQuickActions: true,
  enableCompare: false,
  enableWatermark: false,
  watermarkText: "Confidential",
  fileTypeFilter: "[]",
  enableRecentFiles: false,
  maxRecentFiles: 10,
  enableFolderTree: true,
  enableBreadcrumbs: true,
  cacheEnabled: true,
  cacheDuration: 300000,
  enableFilePlan: false,
  filePlanConfig: "{}",
  showComplianceBadges: false,
  requireRetentionLabel: false,
  useSampleData: true,
  showWizardOnInit: true,
};
