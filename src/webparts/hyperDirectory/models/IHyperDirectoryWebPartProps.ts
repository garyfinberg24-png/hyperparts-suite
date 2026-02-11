import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type {
  DirectoryLayoutMode,
  DirectoryCardStyle,
  DirectoryPhotoSize,
  DirectoryPaginationMode,
  DirectorySortDirection,
} from "./IHyperDirectoryUser";

/** HyperDirectory web part properties */
export interface IHyperDirectoryWebPartProps extends IBaseHyperWebPartProps {
  // General
  title: string;

  // Layout & Display
  layoutMode: DirectoryLayoutMode;
  cardStyle: DirectoryCardStyle;
  gridColumns: number;
  masonryColumns: number;
  sortField: string;
  sortDirection: DirectorySortDirection;

  // RollerDex settings
  rollerDexSpeed: number;
  rollerDexVisibleCards: number;

  // Features
  showSearch: boolean;
  showAlphaIndex: boolean;
  showFilters: boolean;
  showPresence: boolean;
  presenceRefreshInterval: number;
  showProfileCard: boolean;
  showQuickActions: boolean;
  enabledActions: string;
  enableVCardExport: boolean;

  // Data & Fields
  userFilter: string;
  visibleFields: string;
  customFieldMappings: string;
  pageSize: number;
  paginationMode: DirectoryPaginationMode;

  // Photo
  showPhotoPlaceholder: boolean;
  photoSize: DirectoryPhotoSize;

  // Performance
  cacheEnabled: boolean;
  cacheDuration: number;

  // Wizard
  /** Whether the setup wizard has been completed */
  wizardCompleted: boolean;

  // New Hyper features
  /** Enable CSV export of filtered results */
  enableExport: boolean;
  /** Show profile completeness score on cards */
  showCompletenessScore: boolean;
  /** Display pronouns, languages, timezone from extension attributes */
  showPronouns: boolean;
  /** Smart out-of-office status with return dates */
  showSmartOoo: boolean;
  /** Scannable QR code on profile cards */
  showQrCode: boolean;
  /** Enable skills & expertise search */
  enableSkillsSearch: boolean;
  /** Seed directory with sample data until real data is connected */
  useSampleData: boolean;
  /** Enable demo mode toolbar for previewing layouts/themes */
  enableDemoMode: boolean;
}
