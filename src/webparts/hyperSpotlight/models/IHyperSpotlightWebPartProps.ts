import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type {
  SelectionMode,
  SpotlightCategory,
  DateRange,
  LayoutMode,
  CardStyle,
  SortOrder,
  AnimationEntrance,
  MessagePosition,
  ImageQuality,
} from "./IHyperSpotlightEnums";

/** HyperSpotlight web part properties */
export interface IHyperSpotlightWebPartProps extends IBaseHyperWebPartProps {
  // Data Source & Employee Selection
  selectionMode: SelectionMode;
  category: SpotlightCategory;
  dateRange: DateRange;
  customStartDate?: string;
  customEndDate?: string;
  manualEmployeeIds: string[];
  manualEmployeeIdsText?: string;
  manualEmployeeCategories: string;
  maxEmployees: number;
  sortOrder: SortOrder;
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number;
  departmentFilter: string;
  locationFilter: string;

  // Attributes
  selectedAttributes: string;
  attributeLabels: string;
  showAttributeLabels: boolean;
  showAttributeIcons: boolean;

  // Layout
  layoutMode: LayoutMode;
  cardStyle: CardStyle;
  animationEntrance: AnimationEntrance;

  // Layout-specific settings (JSON strings)
  carouselSettings: string;
  gridSettings: string;
  tiledSettings: string;
  masonrySettings: string;
  listSettings: string;
  heroSettings: string;
  bannerSettings: string;
  timelineSettings: string;
  wallOfFameSettings: string;

  // Content & Messaging
  customMessage: string;
  messagePosition: MessagePosition;
  showProfilePicture: boolean;
  showEmployeeName: boolean;
  showJobTitle: boolean;
  showDepartment: boolean;
  showCategoryBadge: boolean;
  showCustomMessage: boolean;
  showActionButtons: boolean;

  // "Get to Know Me" personal fields
  showNickname: boolean;
  showPersonalQuote: boolean;
  showHobbies: boolean;
  showSkillset: boolean;
  showFavoriteWebsites: boolean;
  showHireDate: boolean;
  enableExpandableCards: boolean;

  // Runtime controls
  showRuntimeViewSwitcher: boolean;
  showRuntimeDepartmentFilter: boolean;

  // SP List data source
  spListTitle: string;

  // Action Buttons
  enableEmailButton: boolean;
  enableTeamsButton: boolean;
  enableProfileButton: boolean;

  // Styling
  styleSettings: string;
  applyStyleTo: "container" | "cards" | "both";
  useCategoryThemes: boolean;

  // Responsive
  mobileColumns: number;
  tabletColumns: number;

  // Performance
  lazyLoadImages: boolean;
  imageQuality: ImageQuality;
  cacheEnabled: boolean;
  cacheDuration: number;

  // Sample / Demo Data
  useSampleData: boolean;

  // Advanced
  debugMode?: boolean;
}
