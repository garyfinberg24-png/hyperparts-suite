import type {
  DirectoryLayoutMode,
  DirectoryCardStyle,
  DirectoryPhotoSize,
  DirectoryPaginationMode,
  DirectorySortDirection,
} from "./IHyperDirectoryUser";

// ============================================================
// HyperDirectory Wizard — State Model
// ============================================================

/** Step 1: Layout & Display */
export interface IWizardLayoutDisplay {
  layoutMode: DirectoryLayoutMode;
  cardStyle: DirectoryCardStyle;
  gridColumns: number;
  masonryColumns: number;
  sortField: string;
  sortDirection: DirectorySortDirection;
  rollerDexSpeed: number;
  rollerDexVisibleCards: number;
}

/** Step 2: Search & Filtering */
export interface IWizardSearchFiltering {
  showSearch: boolean;
  showAlphaIndex: boolean;
  showFilters: boolean;
  pageSize: number;
  paginationMode: DirectoryPaginationMode;
  enableExport: boolean;
}

/** Step 3: Profile & Presence */
export interface IWizardProfilePresence {
  showPresence: boolean;
  presenceRefreshInterval: number;
  showProfileCard: boolean;
  showQuickActions: boolean;
  enableVCardExport: boolean;
  showPhotoPlaceholder: boolean;
  photoSize: DirectoryPhotoSize;
  showCompletenessScore: boolean;
  showPronouns: boolean;
  showSmartOoo: boolean;
  showQrCode: boolean;
}

/** Step 4: Advanced Features */
export interface IWizardAdvancedFeatures {
  enableSkillsSearch: boolean;
  useSampleData: boolean;
  cacheEnabled: boolean;
  cacheDuration: number;
}

/** Combined wizard state */
export interface IDirectoryWizardState {
  layoutDisplay: IWizardLayoutDisplay;
  searchFiltering: IWizardSearchFiltering;
  profilePresence: IWizardProfilePresence;
  advancedFeatures: IWizardAdvancedFeatures;
}

/** Default wizard state */
export var DEFAULT_DIRECTORY_WIZARD_STATE: IDirectoryWizardState = {
  layoutDisplay: {
    layoutMode: "grid",
    cardStyle: "standard",
    gridColumns: 3,
    masonryColumns: 3,
    sortField: "displayName",
    sortDirection: "asc",
    rollerDexSpeed: 5,
    rollerDexVisibleCards: 5,
  },
  searchFiltering: {
    showSearch: true,
    showAlphaIndex: true,
    showFilters: true,
    pageSize: 20,
    paginationMode: "paged",
    enableExport: false,
  },
  profilePresence: {
    showPresence: true,
    presenceRefreshInterval: 30,
    showProfileCard: true,
    showQuickActions: true,
    enableVCardExport: true,
    showPhotoPlaceholder: true,
    photoSize: "medium",
    showCompletenessScore: false,
    showPronouns: false,
    showSmartOoo: false,
    showQrCode: false,
  },
  advancedFeatures: {
    enableSkillsSearch: false,
    useSampleData: true,
    cacheEnabled: true,
    cacheDuration: 10,
  },
};

// ── Display name helpers ──

var LAYOUT_DISPLAY_NAMES: Record<string, string> = {
  grid: "Grid",
  list: "List",
  compact: "Compact",
  card: "Card",
  masonry: "Masonry",
  rollerDex: "RollerDex 3D",
  orgChart: "Org Chart",
};

export function getLayoutDisplayName(mode: string): string {
  return LAYOUT_DISPLAY_NAMES[mode] || mode;
}

var CARD_STYLE_NAMES: Record<string, string> = {
  standard: "Standard",
  compact: "Compact",
  detailed: "Detailed",
};

export function getCardStyleDisplayName(style: string): string {
  return CARD_STYLE_NAMES[style] || style;
}

var SORT_FIELD_NAMES: Record<string, string> = {
  displayName: "Display Name",
  surname: "Last Name",
  department: "Department",
  jobTitle: "Job Title",
  officeLocation: "Office",
};

export function getSortFieldDisplayName(field: string): string {
  return SORT_FIELD_NAMES[field] || field;
}

var PHOTO_SIZE_NAMES: Record<string, string> = {
  small: "Small (48px)",
  medium: "Medium (120px)",
  large: "Large (240px)",
};

export function getPhotoSizeDisplayName(size: string): string {
  return PHOTO_SIZE_NAMES[size] || size;
}

var PAGINATION_NAMES: Record<string, string> = {
  paged: "Paginated",
  infinite: "Infinite Scroll",
};

export function getPaginationDisplayName(mode: string): string {
  return PAGINATION_NAMES[mode] || mode;
}

/** Count enabled new features across Steps 3 + 4 */
export function countNewFeatures(
  profile: IWizardProfilePresence,
  advanced: IWizardAdvancedFeatures
): number {
  var count = 0;
  if (profile.showCompletenessScore) count++;
  if (profile.showPronouns) count++;
  if (profile.showSmartOoo) count++;
  if (profile.showQrCode) count++;
  if (advanced.enableSkillsSearch) count++;
  return count;
}
