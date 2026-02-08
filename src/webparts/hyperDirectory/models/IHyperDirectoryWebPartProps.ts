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
}
