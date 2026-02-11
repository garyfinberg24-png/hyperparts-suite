import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type {
  HyperLinksLayoutMode,
  HyperLinksTileSize,
  HyperLinksIconSize,
  HyperLinksHoverEffect,
  HyperLinksBorderRadius,
  HyperLinksAlignment,
  HyperLinksBackgroundMode,
} from "./IHyperLink";
import type { LinksDataSourceMode } from "./IHyperLinksWizardState";

export interface IHyperLinksWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  layoutMode: HyperLinksLayoutMode;
  links: string;
  gridColumns: number;
  tileSize: HyperLinksTileSize;
  showIcons: boolean;
  showDescriptions: boolean;
  showThumbnails: boolean;
  iconSize: HyperLinksIconSize;
  enableGrouping: boolean;
  groups: string;
  enableAudienceTargeting: boolean;
  enableAnalytics: boolean;
  enableColorCustomization: boolean;
  hoverEffect: HyperLinksHoverEffect;
  borderRadius: HyperLinksBorderRadius;
  compactAlignment: HyperLinksAlignment;
  /** Whether the setup wizard has been completed */
  wizardCompleted: boolean;
  /** Enable search bar within links */
  enableSearch: boolean;
  /** Enable link health monitoring in edit mode */
  enableHealthCheck: boolean;
  /** Enable popular link badges */
  enablePopularBadges: boolean;
  /** Background mode for the links container */
  backgroundMode: HyperLinksBackgroundMode;
  /** Background color (CSS color) */
  backgroundColor: string;
  /** Background gradient (CSS gradient) */
  backgroundGradient: string;
  /** Background image URL */
  backgroundImageUrl: string;
  /** Darken overlay on background image */
  backgroundImageDarken: boolean;
  /** Custom text color override (CSS color) */
  textColor: string;
  /** Custom icon color override (CSS color) */
  iconColor: string;
  /** Active preset style ID (empty = custom) */
  activePresetId: string;

  // ── Link Data Source ──
  /** Data source mode: inline, preset, or list */
  linkDataSource: LinksDataSourceMode;
  /** Selected preset collection ID */
  linkPresetId: string;
  /** SP list URL or title (when data source is "list") */
  linkListUrl: string;
  /** Column in SP list to use for link titles */
  linkListTitleColumn: string;
  /** Column in SP list to use for link URLs */
  linkListUrlColumn: string;

  // ── Demo Mode ──
  /** Enable sample data / demo mode */
  useSampleData: boolean;
  /** Enable demo mode toolbar for previewing layouts/themes */
  enableDemoMode: boolean;
}
