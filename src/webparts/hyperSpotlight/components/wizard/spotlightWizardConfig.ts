import * as React from "react";
import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardStepProps,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperSpotlightWebPartProps } from "../../models";

// ============================================================
// HyperSpotlight Wizard Config
// ============================================================

export interface ISpotlightWizardState {
  selectionMode: string;
  category: string;
  layoutMode: string;
  cardStyle: string;
  maxEmployees: number;
  showProfilePicture: boolean;
  showJobTitle: boolean;
  showDepartment: boolean;
  showCategoryBadge: boolean;
  showActionButtons: boolean;
  enableExpandableCards: boolean;
}

var DEFAULT_SPOTLIGHT_WIZARD_STATE: ISpotlightWizardState = {
  selectionMode: "automatic",
  category: "birthday",
  layoutMode: "carousel",
  cardStyle: "standard",
  maxEmployees: 6,
  showProfilePicture: true,
  showJobTitle: true,
  showDepartment: true,
  showCategoryBadge: true,
  showActionButtons: true,
  enableExpandableCards: true,
};

// Inline placeholder step
var SettingsStep: React.FC<IWizardStepProps<ISpotlightWizardState>> = function (_props) {
  return React.createElement("div", { style: { padding: "16px" } },
    React.createElement("p", undefined, "Spotlight settings will be configured in the property pane after setup.")
  );
};

var steps: Array<IWizardStepDef<ISpotlightWizardState>> = [
  {
    id: "settings",
    label: "Spotlight Settings",
    shortLabel: "Settings",
    helpText: "Configure employee spotlight display. You can fine-tune all settings later in the property pane.",
    component: SettingsStep,
  },
];

function buildResult(state: ISpotlightWizardState): Partial<IHyperSpotlightWebPartProps> {
  return {
    selectionMode: state.selectionMode as IHyperSpotlightWebPartProps["selectionMode"],
    category: state.category as IHyperSpotlightWebPartProps["category"],
    layoutMode: state.layoutMode as IHyperSpotlightWebPartProps["layoutMode"],
    cardStyle: state.cardStyle as IHyperSpotlightWebPartProps["cardStyle"],
    maxEmployees: state.maxEmployees,
    showProfilePicture: state.showProfilePicture,
    showJobTitle: state.showJobTitle,
    showDepartment: state.showDepartment,
    showCategoryBadge: state.showCategoryBadge,
    showActionButtons: state.showActionButtons,
    enableExpandableCards: state.enableExpandableCards,
  };
}

function buildSummary(state: ISpotlightWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];
  var CATEGORY_LABELS: Record<string, string> = {
    birthday: "Birthday",
    workAnniversary: "Work Anniversary",
    anniversary: "Personal Anniversary",
    graduation: "Graduation",
    wedding: "Wedding",
    engagement: "Engagement",
    achievement: "Achievement",
  };
  var LAYOUT_LABELS: Record<string, string> = {
    carousel: "Carousel",
    grid: "Grid",
    tiled: "Tiled",
    masonry: "Masonry",
    list: "List",
    featuredHero: "Featured Hero",
    banner: "Scrolling Banner",
    timeline: "Timeline",
    wallOfFame: "Wall of Fame",
  };
  rows.push({ label: "Category", value: CATEGORY_LABELS[state.category] || state.category, type: "badge" });
  rows.push({ label: "Layout", value: LAYOUT_LABELS[state.layoutMode] || state.layoutMode, type: "badge" });
  rows.push({ label: "Card Style", value: state.cardStyle, type: "text" });
  rows.push({ label: "Max Employees", value: String(state.maxEmployees), type: "text" });

  var shown: string[] = [];
  if (state.showProfilePicture) shown.push("Photo");
  if (state.showJobTitle) shown.push("Title");
  if (state.showDepartment) shown.push("Dept");
  if (state.showCategoryBadge) shown.push("Badge");
  if (state.showActionButtons) shown.push("Actions");
  rows.push({
    label: "Visible Fields",
    value: shown.length > 0 ? shown.join(", ") : "Minimal",
    type: "text",
  });
  return rows;
}

export function buildStateFromProps(props: IHyperSpotlightWebPartProps): ISpotlightWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }
  return {
    selectionMode: props.selectionMode || "automatic",
    category: props.category || "birthday",
    layoutMode: props.layoutMode || "carousel",
    cardStyle: props.cardStyle || "standard",
    maxEmployees: props.maxEmployees || 6,
    showProfilePicture: props.showProfilePicture !== false,
    showJobTitle: props.showJobTitle !== false,
    showDepartment: props.showDepartment !== false,
    showCategoryBadge: props.showCategoryBadge !== false,
    showActionButtons: props.showActionButtons !== false,
    enableExpandableCards: props.enableExpandableCards !== false,
  };
}

export var SPOTLIGHT_WIZARD_CONFIG: IHyperWizardConfig<ISpotlightWizardState, Partial<IHyperSpotlightWebPartProps>> = {
  title: "HyperSpotlight Setup Wizard",
  welcome: {
    productName: "Spotlight",
    tagline: "Celebrate your people with dynamic employee spotlights, recognition cards, and team highlights",
    features: [
      {
        icon: "\u2B50",
        title: "9 Layout Modes",
        description: "Carousel, Grid, Tiled, Masonry, List, Hero, Banner, Timeline, and Wall of Fame",
      },
      {
        icon: "\uD83C\uDFC6",
        title: "Recognition Categories",
        description: "Birthdays, Anniversaries, Graduations, Weddings, Engagements, and Achievements",
      },
      {
        icon: "\uD83D\uDC64",
        title: "Rich Profile Cards",
        description: "Photos, titles, departments, action buttons, and expandable details",
      },
      {
        icon: "\u267F",
        title: "Accessible",
        description: "WCAG 2.1 AA compliant with keyboard nav, screen reader support, and reduced motion",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_SPOTLIGHT_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can change any of these settings later via the property pane.",
};
