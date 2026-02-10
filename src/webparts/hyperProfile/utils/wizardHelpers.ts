import type { IProfileWizardState } from "../models/IHyperProfileWizardState";
import type { IHyperProfileWebPartProps } from "../models/IHyperProfileWebPartProps";
import type { IHyperTemplate } from "../models/IHyperProfileTemplate";

/**
 * Applies a template preset to wizard state (mutates provided state copy).
 * Copies over the template's defaults and configuration values.
 */
export function applyTemplateToState(
  state: IProfileWizardState,
  template: IHyperTemplate
): IProfileWizardState {
  const result: IProfileWizardState = {
    path: state.path,
    currentStepIndex: state.currentStepIndex,
    selectedTemplate: template.id,
    categoryFilter: state.categoryFilter,
    cardStyle: (template.configuration.cardStyle as IProfileWizardState["cardStyle"]) || state.cardStyle,
    photoSize: (template.configuration.photoSize as IProfileWizardState["photoSize"]) || state.photoSize,
    photoShape: template.defaults.photoShape || state.photoShape,
    showPresence: template.configuration.showPresence !== undefined ? template.configuration.showPresence : state.showPresence,
    showStatusMessage: template.configuration.showStatusMessage !== undefined ? template.configuration.showStatusMessage : state.showStatusMessage,
    presencePosition: (template.configuration.presencePosition as IProfileWizardState["presencePosition"]) || state.presencePosition,
    showQuickActions: template.configuration.showQuickActions !== undefined ? template.configuration.showQuickActions : state.showQuickActions,
    enabledActions: template.configuration.enabledActions || state.enabledActions,
    actionsLayout: (template.configuration.actionsLayout as IProfileWizardState["actionsLayout"]) || state.actionsLayout,
    buttonSize: (template.configuration.buttonSize as IProfileWizardState["buttonSize"]) || state.buttonSize,
    showActionLabels: template.configuration.showActionLabels !== undefined ? template.configuration.showActionLabels : state.showActionLabels,
    showSkills: template.defaults.showSkills,
    skillDisplayStyle: state.skillDisplayStyle,
    showEndorsements: state.showEndorsements,
    showBadges: template.defaults.showBadges,
    showBadgeDescriptions: state.showBadgeDescriptions,
    showHobbies: template.defaults.showHobbies,
    showSlogan: template.defaults.showSlogan,
    showWebsites: state.showWebsites,
    showInterests: state.showInterests,
    showFunFacts: state.showFunFacts,
    showEducation: template.defaults.showEducation,
    showOrgChart: template.defaults.showOrgChart,
    showManager: state.showManager,
    showDirectReports: state.showDirectReports,
    showCalendar: template.defaults.showCalendar,
    showCompletenessScore: template.configuration.showCompletenessScore !== undefined ? template.configuration.showCompletenessScore : state.showCompletenessScore,
    accentColor: template.defaults.accentColor || state.accentColor,
    headerStyle: template.defaults.headerStyle || state.headerStyle,
    animation: template.defaults.animation || state.animation,
    shadow: (template.defaults.shadow as IProfileWizardState["shadow"]) || state.shadow,
    borderRadius: template.configuration.borderRadius !== undefined ? template.configuration.borderRadius : state.borderRadius,
    backgroundColor: template.configuration.backgroundColor || state.backgroundColor,
  };
  return result;
}

/**
 * Build web part properties from wizard state.
 * Returns a Partial that can be merged into the web part's properties.
 */
export function buildPropsFromWizardState(
  state: IProfileWizardState
): Partial<IHyperProfileWebPartProps> {
  return {
    selectedTemplate: state.selectedTemplate,
    cardStyle: state.cardStyle,
    photoSize: state.photoSize,
    photoShape: state.photoShape,
    showPresence: state.showPresence,
    showStatusMessage: state.showStatusMessage,
    presencePosition: state.presencePosition,
    showQuickActions: state.showQuickActions,
    enabledActions: state.enabledActions,
    actionsLayout: state.actionsLayout,
    buttonSize: state.buttonSize,
    showActionLabels: state.showActionLabels,
    showSkills: state.showSkills,
    skillDisplayStyle: state.skillDisplayStyle,
    showEndorsements: state.showEndorsements,
    showBadges: state.showBadges,
    showBadgeDescriptions: state.showBadgeDescriptions,
    showHobbies: state.showHobbies,
    showSlogan: state.showSlogan,
    showWebsites: state.showWebsites,
    showInterests: state.showInterests,
    showFunFacts: state.showFunFacts,
    showEducation: state.showEducation,
    showOrgChart: state.showOrgChart,
    showManager: state.showManager,
    showDirectReports: state.showDirectReports,
    showCalendar: state.showCalendar,
    showCompletenessScore: state.showCompletenessScore,
    accentColor: state.accentColor,
    headerStyle: state.headerStyle,
    animation: state.animation,
    shadow: state.shadow,
    borderRadius: state.borderRadius,
    backgroundColor: state.backgroundColor,
    wizardCompleted: true,
  };
}

/**
 * Build wizard state from existing web part properties (for re-edit).
 */
export function buildStateFromProps(
  props: IHyperProfileWebPartProps
): IProfileWizardState {
  return {
    path: undefined,
    currentStepIndex: 0,
    selectedTemplate: props.selectedTemplate || "standard",
    categoryFilter: "all",
    cardStyle: props.cardStyle || "standard",
    photoSize: props.photoSize || "medium",
    photoShape: props.photoShape || "circle",
    showPresence: props.showPresence !== false,
    showStatusMessage: props.showStatusMessage !== false,
    presencePosition: props.presencePosition || "onPhoto",
    showQuickActions: props.showQuickActions !== false,
    enabledActions: props.enabledActions || ["email", "teams_chat", "teams_call", "schedule"],
    actionsLayout: props.actionsLayout || "horizontal",
    buttonSize: props.buttonSize || "medium",
    showActionLabels: props.showActionLabels !== false,
    showSkills: props.showSkills !== false,
    skillDisplayStyle: props.skillDisplayStyle || "tags",
    showEndorsements: props.showEndorsements !== false,
    showBadges: props.showBadges !== false,
    showBadgeDescriptions: props.showBadgeDescriptions !== false,
    showHobbies: props.showHobbies === true,
    showSlogan: props.showSlogan === true,
    showWebsites: props.showWebsites === true,
    showInterests: props.showInterests === true,
    showFunFacts: props.showFunFacts === true,
    showEducation: props.showEducation === true,
    showOrgChart: props.showOrgChart === true,
    showManager: props.showManager !== false,
    showDirectReports: props.showDirectReports === true,
    showCalendar: props.showCalendar === true,
    showCompletenessScore: props.showCompletenessScore === true,
    accentColor: props.accentColor || "#0078d4",
    headerStyle: props.headerStyle || "gradient",
    animation: props.animation || "none",
    shadow: props.shadow || "medium",
    borderRadius: props.borderRadius !== undefined ? props.borderRadius : 8,
    backgroundColor: props.backgroundColor || "#FFFFFF",
  };
}

/**
 * Build summary lines for the Review step.
 */
export function buildWizardSummary(state: IProfileWizardState): string[] {
  const lines: string[] = [];
  lines.push("Template: " + state.selectedTemplate);
  lines.push("Card Style: " + state.cardStyle);
  lines.push("Photo: " + state.photoShape + " / " + state.photoSize);

  const features: string[] = [];
  if (state.showSkills) features.push("Skills");
  if (state.showBadges) features.push("Badges");
  if (state.showHobbies) features.push("Hobbies");
  if (state.showSlogan) features.push("Slogan");
  if (state.showEducation) features.push("Education");
  if (state.showOrgChart) features.push("Org Chart");
  if (state.showCalendar) features.push("Calendar");
  if (state.showPresence) features.push("Presence");
  if (state.showQuickActions) features.push("Quick Actions");
  if (state.showCompletenessScore) features.push("Completeness");
  lines.push("Features: " + (features.length > 0 ? features.join(", ") : "None"));

  lines.push("Accent: " + state.accentColor);
  lines.push("Animation: " + state.animation);
  lines.push("Shadow: " + state.shadow);
  return lines;
}
