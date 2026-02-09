/* ── Enums ── */
export {
  SelectionMode,
  SpotlightCategory,
  DateRange,
  LayoutMode,
  CardStyle,
  SortOrder,
  AnimationEntrance,
  MessagePosition,
  ImageQuality,
  SELECTION_MODE_OPTIONS,
  CATEGORY_OPTIONS,
  DATE_RANGE_OPTIONS,
  LAYOUT_MODE_OPTIONS,
  CARD_STYLE_OPTIONS,
  SORT_ORDER_OPTIONS,
  ANIMATION_OPTIONS,
  MESSAGE_POSITION_OPTIONS,
  IMAGE_QUALITY_OPTIONS,
} from "./IHyperSpotlightEnums";

/* ── Employee ── */
export type { IHyperSpotlightEmployee, IBasicUser } from "./IHyperSpotlightEmployee";
export { DEFAULT_EMPLOYEE } from "./IHyperSpotlightEmployee";

/* ── Category ── */
export type { ISpotlightCategoryTheme } from "./IHyperSpotlightCategory";
export {
  getCategoryTheme,
  getCategoryGradient,
  getCategoryColor,
  getCategoryEmoji,
  getCategoryDisplayName,
} from "./IHyperSpotlightCategory";

/* ── Layout settings ── */
export type {
  ICarouselSettings,
  IGridSettings,
  ITiledSettings,
  IMasonrySettings,
  IListSettings,
  IHeroSettings,
  IBannerSettings,
  ITimelineSettings,
  IWallOfFameSettings,
} from "./IHyperSpotlightLayout";
export {
  DEFAULT_CAROUSEL_SETTINGS,
  DEFAULT_GRID_SETTINGS,
  DEFAULT_TILED_SETTINGS,
  DEFAULT_MASONRY_SETTINGS,
  DEFAULT_LIST_SETTINGS,
  DEFAULT_HERO_SETTINGS,
  DEFAULT_BANNER_SETTINGS,
  DEFAULT_TIMELINE_SETTINGS,
  DEFAULT_WALL_OF_FAME_SETTINGS,
} from "./IHyperSpotlightLayout";

/* ── Style settings ── */
export type {
  IStyleSettings,
  IGradientSettings,
  IImageSettings,
  IShadowSettings,
} from "./IHyperSpotlightStyle";
export {
  DEFAULT_STYLE_SETTINGS,
  generateStyles,
  rgbaColor,
} from "./IHyperSpotlightStyle";

/* ── Personal / "Get to Know Me" utilities ── */
export type { IWebsiteLink } from "./IHyperSpotlightPersonal";
export {
  parseWebsites,
  parseCommaSeparated,
  getHobbyIcon,
  getTimeSinceHire,
} from "./IHyperSpotlightPersonal";

/* ── Web part props ── */
export type { IHyperSpotlightWebPartProps } from "./IHyperSpotlightWebPartProps";

/* ── Mock / sample data ── */
export { generateMockEmployees } from "../utils/mockEmployees";
