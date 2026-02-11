import type {
  ViewMode,
  SortMode,
  SortDirection,
  PreviewMode,
} from "./IExplorerEnums";

// ============================================================
// HyperExplorer Wizard — State Model
// ============================================================

/** Step 1: Layout & Display */
export interface IExplorerWizardLayoutDisplay {
  viewMode: ViewMode;
  sortMode: SortMode;
  sortDirection: SortDirection;
  itemsPerPage: number;
  showFolders: boolean;
}

/** Step 2: Preview & Features */
export interface IExplorerWizardPreviewFeatures {
  enablePreview: boolean;
  previewMode: PreviewMode;
  enableLightbox: boolean;
  enableVideoPlaylist: boolean;
  showThumbnails: boolean;
  thumbnailSize: number;
  enableUpload: boolean;
  enableQuickActions: boolean;
}

/** Step 3: Advanced */
export interface IExplorerWizardAdvanced {
  enableFolderTree: boolean;
  enableBreadcrumbs: boolean;
  enableCompare: boolean;
  enableWatermark: boolean;
  enableRecentFiles: boolean;
  enableFilePlan: boolean;
  useSampleData: boolean;
  cacheEnabled: boolean;
  cacheDuration: number;
}

/** Combined wizard state */
export interface IExplorerWizardState {
  layoutDisplay: IExplorerWizardLayoutDisplay;
  previewFeatures: IExplorerWizardPreviewFeatures;
  advanced: IExplorerWizardAdvanced;
}

/** Default wizard state */
export var DEFAULT_EXPLORER_WIZARD_STATE: IExplorerWizardState = {
  layoutDisplay: {
    viewMode: "grid",
    sortMode: "modified",
    sortDirection: "desc",
    itemsPerPage: 30,
    showFolders: true,
  },
  previewFeatures: {
    enablePreview: true,
    previewMode: "tab",
    enableLightbox: true,
    enableVideoPlaylist: false,
    showThumbnails: true,
    thumbnailSize: 200,
    enableUpload: true,
    enableQuickActions: true,
  },
  advanced: {
    enableFolderTree: true,
    enableBreadcrumbs: true,
    enableCompare: false,
    enableWatermark: false,
    enableRecentFiles: false,
    enableFilePlan: false,
    useSampleData: true,
    cacheEnabled: true,
    cacheDuration: 300,
  },
};

// ── Display name helpers ──

var VIEW_MODE_DISPLAY_NAMES: Record<string, string> = {
  grid: "Grid",
  masonry: "Masonry",
  list: "List",
  filmstrip: "Filmstrip",
  tiles: "Tiles",
};

export function getViewModeDisplayName(mode: string): string {
  return VIEW_MODE_DISPLAY_NAMES[mode] || mode;
}

var SORT_MODE_DISPLAY_NAMES: Record<string, string> = {
  name: "Name",
  modified: "Modified Date",
  size: "File Size",
  type: "File Type",
  author: "Author",
};

export function getSortModeDisplayName(mode: string): string {
  return SORT_MODE_DISPLAY_NAMES[mode] || mode;
}

var PREVIEW_MODE_DISPLAY_NAMES: Record<string, string> = {
  tab: "Tabbed",
  split: "Split Screen",
  lightbox: "Lightbox Only",
};

export function getPreviewModeDisplayName(mode: string): string {
  return PREVIEW_MODE_DISPLAY_NAMES[mode] || mode;
}
