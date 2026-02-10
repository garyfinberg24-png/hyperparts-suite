import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { TemplateType } from "./IHyperProfileTemplate";
import type { QuickActionType } from "./IHyperProfileQuickAction";
import type { CompletenessDisplayStyle, CompletenessPosition } from "./IHyperProfileCompleteness";
import type { ProfileAnimation, ProfileHeaderStyle, PhotoShape } from "./IHyperProfileAnimation";
import type { SkillDisplayStyle } from "./IHyperProfileSkill";
import type { DemoPersonId } from "./IHyperProfileDemoConfig";

/** Display mode for the web part */
export type DisplayMode = "myProfile" | "directory";

/** Layout style for the profile card */
export type CardStyle = "compact" | "standard" | "expanded";

/** Layout for quick actions */
export type ActionsLayout = "horizontal" | "vertical" | "dropdown";

/** Button size */
export type ButtonSize = "small" | "medium" | "large";

/** Position for presence badge */
export type PresencePosition = "onPhoto" | "nextToName" | "separate";

/** Background type */
export type BackgroundType = "color" | "image";

/** Overlay position */
export type OverlayPosition = "top" | "bottom" | "full";

/** Text alignment */
export type TextAlignment = "left" | "center" | "right";

/** Shadow style */
export type ShadowStyle = "none" | "light" | "medium" | "strong";

/** Photo size */
export type PhotoSize = "small" | "medium" | "large";

/** HyperProfile web part properties */
export interface IHyperProfileWebPartProps extends IBaseHyperWebPartProps {
  // Mode & Display
  displayMode: DisplayMode;
  selectedTemplate: TemplateType;
  defaultUserId?: string;

  // Quick Actions
  showQuickActions: boolean;
  enabledActions: QuickActionType[];
  actionsLayout: ActionsLayout;
  buttonSize: ButtonSize;
  showActionLabels: boolean;

  // Presence Settings
  showPresence: boolean;
  showStatusMessage: boolean;
  presenceRefreshInterval: number;
  presencePosition: PresencePosition;

  // Profile Completeness
  showCompletenessScore: boolean;
  scorePosition: CompletenessPosition;
  scoreStyle: CompletenessDisplayStyle;
  fieldWeights?: string; // JSON string of Record<string, number>

  // Field Selection
  visibleFields: string[];
  fieldOrder?: string[];

  // Layout & Dimensions
  width: string;
  height: string;
  cardStyle: CardStyle;
  photoSize: PhotoSize;

  // Background
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundImageUrl?: string;
  backgroundImageFit?: "cover" | "contain" | "fill" | "none";
  backgroundImagePosition?: "top" | "center" | "bottom";

  // Overlay
  enableOverlay: boolean;
  overlayText?: string;
  overlayColor: string;
  overlayTransparency: number;
  overlayPosition: OverlayPosition;
  overlayTextColor: string;
  overlayTextAlignment: TextAlignment;

  // Additional Styling
  borderRadius: number;
  shadow: ShadowStyle;
  useThemeColors: boolean;

  /* ── V2 Properties ── */

  // Skills & Expertise
  showSkills: boolean;
  skillDisplayStyle: SkillDisplayStyle;
  showEndorsements: boolean;
  skillsListName?: string;

  // Badges & Recognition
  showBadges: boolean;
  showBadgeDescriptions: boolean;
  badgesListName?: string;

  // Personal Info
  showHobbies: boolean;
  showSlogan: boolean;
  showWebsites: boolean;
  showInterests: boolean;
  showFunFacts: boolean;
  showEducation: boolean;

  // Organization
  showOrgChart: boolean;
  showManager: boolean;
  showDirectReports: boolean;

  // Calendar Availability
  showCalendar: boolean;

  // Photo Shape & Appearance
  photoShape: PhotoShape;
  accentColor: string;
  coverPhotoUrl?: string;

  // Header Style
  headerStyle: ProfileHeaderStyle;
  headerPrimaryColor?: string;
  headerSecondaryColor?: string;
  headerImageUrl?: string;
  headerPatternId?: string;
  headerHeight?: number;

  // Animation
  animation: ProfileAnimation;

  // Demo Mode
  enableDemoMode: boolean;
  demoPersonId?: DemoPersonId;

  // Wizard
  showWizardOnInit: boolean;
  wizardCompleted: boolean;

  // Analytics
  enableAnalytics: boolean;

  // Auto Refresh
  autoRefreshInterval?: number;
}
