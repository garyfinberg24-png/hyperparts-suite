import * as React from "react";
import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardStepProps,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperProfileWebPartProps } from "../../models";

export interface IProfileWizardState {
  displayMode: string;
  selectedTemplate: string;
  cardStyle: string;
  showQuickActions: boolean;
  showPresence: boolean;
  showCompletenessScore: boolean;
  showSkills: boolean;
  showBadges: boolean;
  showOrgChart: boolean;
  showCalendar: boolean;
}

var DEFAULT_PROFILE_WIZARD_STATE: IProfileWizardState = {
  displayMode: "myProfile",
  selectedTemplate: "modern",
  cardStyle: "standard",
  showQuickActions: true,
  showPresence: true,
  showCompletenessScore: false,
  showSkills: true,
  showBadges: true,
  showOrgChart: true,
  showCalendar: false,
};

var SettingsStep: React.FC<IWizardStepProps<IProfileWizardState>> = function (_props) {
  return React.createElement("div", { style: { padding: "16px" } },
    React.createElement("p", undefined, "Profile display settings will be configured in the property pane after setup.")
  );
};

var steps: Array<IWizardStepDef<IProfileWizardState>> = [
  {
    id: "settings",
    label: "Profile Settings",
    shortLabel: "Settings",
    helpText: "Configure the profile card appearance and features. Fine-tune details in the property pane.",
    component: SettingsStep,
  },
];

function buildResult(state: IProfileWizardState): Partial<IHyperProfileWebPartProps> {
  return {
    displayMode: state.displayMode as IHyperProfileWebPartProps["displayMode"],
    selectedTemplate: state.selectedTemplate as IHyperProfileWebPartProps["selectedTemplate"],
    cardStyle: state.cardStyle as IHyperProfileWebPartProps["cardStyle"],
    showQuickActions: state.showQuickActions,
    showPresence: state.showPresence,
    showCompletenessScore: state.showCompletenessScore,
    showSkills: state.showSkills,
    showBadges: state.showBadges,
    showOrgChart: state.showOrgChart,
    showCalendar: state.showCalendar,
  };
}

function buildSummary(state: IProfileWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];
  var MODE_LABELS: Record<string, string> = {
    myProfile: "My Profile",
    directory: "Directory Lookup",
  };
  rows.push({ label: "Display Mode", value: MODE_LABELS[state.displayMode] || state.displayMode, type: "badge" });
  rows.push({ label: "Template", value: state.selectedTemplate, type: "badge" });
  rows.push({ label: "Card Style", value: state.cardStyle, type: "text" });
  var features: string[] = [];
  if (state.showQuickActions) features.push("Quick Actions");
  if (state.showPresence) features.push("Presence");
  if (state.showCompletenessScore) features.push("Completeness");
  if (state.showSkills) features.push("Skills");
  if (state.showBadges) features.push("Badges");
  if (state.showOrgChart) features.push("Org Chart");
  if (state.showCalendar) features.push("Calendar");
  rows.push({
    label: "Features",
    value: features.length > 0 ? String(features.length) + " enabled (" + features.join(", ") + ")" : "None",
    type: features.length > 0 ? "badgeGreen" : "text",
  });
  return rows;
}

export function buildStateFromProfileProps(props: IHyperProfileWebPartProps): IProfileWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }
  return {
    displayMode: props.displayMode || "myProfile",
    selectedTemplate: props.selectedTemplate || "modern",
    cardStyle: props.cardStyle || "standard",
    showQuickActions: props.showQuickActions !== false,
    showPresence: props.showPresence !== false,
    showCompletenessScore: props.showCompletenessScore === true,
    showSkills: props.showSkills !== false,
    showBadges: props.showBadges !== false,
    showOrgChart: props.showOrgChart !== false,
    showCalendar: props.showCalendar === true,
  };
}

export var PROFILE_WIZARD_CONFIG: IHyperWizardConfig<IProfileWizardState, Partial<IHyperProfileWebPartProps>> = {
  title: "HyperProfile Setup Wizard",
  welcome: {
    productName: "Profile",
    tagline: "A rich, interactive employee profile card with presence, skills, badges, and org chart",
    features: [
      {
        icon: "\uD83D\uDC64",
        title: "Rich Profile Display",
        description: "Photo, title, department, contact info with multiple card styles and templates",
      },
      {
        icon: "\uD83D\uDFE2",
        title: "Live Presence",
        description: "Real-time Teams presence status with status message display",
      },
      {
        icon: "\uD83C\uDFC5",
        title: "Skills & Badges",
        description: "Skill tags with endorsements and achievement badges from SharePoint lists",
      },
      {
        icon: "\uD83C\uDFE2",
        title: "Org Chart",
        description: "Manager, direct reports, and organizational hierarchy integration",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_PROFILE_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can change any of these settings later via the property pane.",
};
