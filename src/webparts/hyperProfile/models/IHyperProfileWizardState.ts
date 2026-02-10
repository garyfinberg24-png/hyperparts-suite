import type { TemplateType } from "./IHyperProfileTemplate";
import type { ProfileAnimation, ProfileHeaderStyle, PhotoShape, TemplateCategory } from "./IHyperProfileAnimation";
import type { QuickActionType } from "./IHyperProfileQuickAction";
import type { SkillDisplayStyle } from "./IHyperProfileSkill";
import type { CardStyle, ShadowStyle, PhotoSize, ActionsLayout, ButtonSize, PresencePosition } from "./IHyperProfileWebPartProps";

/** Wizard path selection */
export type WizardPath = "template" | "scratch";

/** Wizard step identifiers */
export type WizardStepId = "path" | "template" | "display" | "features" | "appearance" | "review";

/** Wizard step definition */
export interface IWizardStep {
  id: WizardStepId;
  label: string;
  icon: string;
}

/** Full wizard state */
export interface IProfileWizardState {
  /** Which path user chose */
  path: WizardPath | undefined;
  /** Current step index */
  currentStepIndex: number;
  /** Selected template (from gallery or scratch) */
  selectedTemplate: TemplateType;
  /** Category filter for template gallery */
  categoryFilter: TemplateCategory | "all";

  /* Display */
  cardStyle: CardStyle;
  photoSize: PhotoSize;
  photoShape: PhotoShape;

  /* Features */
  showPresence: boolean;
  showStatusMessage: boolean;
  presencePosition: PresencePosition;
  showQuickActions: boolean;
  enabledActions: QuickActionType[];
  actionsLayout: ActionsLayout;
  buttonSize: ButtonSize;
  showActionLabels: boolean;
  showSkills: boolean;
  skillDisplayStyle: SkillDisplayStyle;
  showEndorsements: boolean;
  showBadges: boolean;
  showBadgeDescriptions: boolean;
  showHobbies: boolean;
  showSlogan: boolean;
  showWebsites: boolean;
  showInterests: boolean;
  showFunFacts: boolean;
  showEducation: boolean;
  showOrgChart: boolean;
  showManager: boolean;
  showDirectReports: boolean;
  showCalendar: boolean;
  showCompletenessScore: boolean;

  /* Appearance */
  accentColor: string;
  headerStyle: ProfileHeaderStyle;
  animation: ProfileAnimation;
  shadow: ShadowStyle;
  borderRadius: number;
  backgroundColor: string;
}

/** Default wizard state */
export const DEFAULT_WIZARD_STATE: IProfileWizardState = {
  path: undefined,
  currentStepIndex: 0,
  selectedTemplate: "standard",
  categoryFilter: "all",
  cardStyle: "standard",
  photoSize: "medium",
  photoShape: "circle",
  showPresence: true,
  showStatusMessage: true,
  presencePosition: "onPhoto",
  showQuickActions: true,
  enabledActions: ["email", "teams_chat", "teams_call", "schedule"],
  actionsLayout: "horizontal",
  buttonSize: "medium",
  showActionLabels: true,
  showSkills: true,
  skillDisplayStyle: "tags",
  showEndorsements: true,
  showBadges: true,
  showBadgeDescriptions: true,
  showHobbies: false,
  showSlogan: false,
  showWebsites: false,
  showInterests: false,
  showFunFacts: false,
  showEducation: false,
  showOrgChart: false,
  showManager: true,
  showDirectReports: false,
  showCalendar: false,
  showCompletenessScore: false,
  accentColor: "#0078d4",
  headerStyle: "gradient",
  animation: "none",
  shadow: "medium",
  borderRadius: 8,
  backgroundColor: "#FFFFFF",
};

/** Steps for the "template" path */
export const TEMPLATE_PATH_STEPS: IWizardStep[] = [
  { id: "path", label: "Welcome", icon: "\uD83D\uDC4B" },
  { id: "template", label: "Template", icon: "\uD83C\uDFA8" },
  { id: "features", label: "Features", icon: "\u2699\uFE0F" },
  { id: "appearance", label: "Appearance", icon: "\uD83D\uDD8C\uFE0F" },
  { id: "review", label: "Review", icon: "\u2705" },
];

/** Steps for the "scratch" path */
export const SCRATCH_PATH_STEPS: IWizardStep[] = [
  { id: "path", label: "Welcome", icon: "\uD83D\uDC4B" },
  { id: "display", label: "Display", icon: "\uD83D\uDCBB" },
  { id: "features", label: "Features", icon: "\u2699\uFE0F" },
  { id: "appearance", label: "Appearance", icon: "\uD83D\uDD8C\uFE0F" },
  { id: "review", label: "Review", icon: "\u2705" },
];

/** Get active steps based on chosen path */
export function getWizardSteps(path: WizardPath | undefined): IWizardStep[] {
  if (path === "template") return TEMPLATE_PATH_STEPS;
  if (path === "scratch") return SCRATCH_PATH_STEPS;
  // Before path chosen, show just the welcome step
  return [{ id: "path", label: "Welcome", icon: "\uD83D\uDC4B" }];
}
