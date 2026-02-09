import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IBirthdaysWizardState } from "../../models/IHyperBirthdaysWizardState";
import { DEFAULT_WIZARD_STATE, getEnabledTypeNames, countEnabledTypes } from "../../models/IHyperBirthdaysWizardState";
import type { IHyperBirthdaysWebPartProps } from "../../models/IHyperBirthdaysWebPartProps";
import { getViewModeDisplayName, getTimeRangeDisplayName, getAnimationDisplayName } from "../../models";
import CelebrationTypesStep from "./CelebrationTypesStep";
import DataSourcesStep from "./DataSourcesStep";
import LayoutStep from "./LayoutStep";
import EngagementStep from "./EngagementStep";

// ============================================================
// HyperBirthdays Wizard Config
// ============================================================

var steps: Array<IWizardStepDef<IBirthdaysWizardState>> = [
  {
    id: "celebrationTypes",
    label: "Celebration Types",
    shortLabel: "Types",
    helpText: "Choose which celebration types to track. Each type has its own color, emoji, and animation style.",
    component: CelebrationTypesStep,
    validate: function (state: IBirthdaysWizardState): boolean {
      return countEnabledTypes(state.celebrationTypes) > 0;
    },
  },
  {
    id: "dataSources",
    label: "Data Sources",
    shortLabel: "Sources",
    helpText: function (state: IBirthdaysWizardState): string {
      if (state.dataSources.enableEntraId && state.dataSources.enableSpList) {
        return "Both Entra ID and SharePoint List are enabled. Celebrations will be merged from both sources.";
      }
      if (state.dataSources.enableSpList) {
        return "Configure the SharePoint list that contains your celebration data.";
      }
      return "Choose where to pull celebration data from. Entra ID provides birthdays and hire dates automatically.";
    },
    component: DataSourcesStep,
    validate: function (state: IBirthdaysWizardState): boolean {
      var hasSource = state.dataSources.enableEntraId || state.dataSources.enableSpList;
      if (state.dataSources.enableSpList && !state.dataSources.spListName) {
        return false;
      }
      return hasSource;
    },
  },
  {
    id: "layout",
    label: "Layout & Display",
    shortLabel: "Layout",
    helpText: "Choose how celebrations are displayed. You can change this at any time from the toolbar.",
    component: LayoutStep,
  },
  {
    id: "engagement",
    label: "Engagement Features",
    shortLabel: "Features",
    helpText: "Enable interactive features to boost celebration engagement across your organization.",
    component: EngagementStep,
  },
];

/** Transform wizard state into web part properties */
function buildResult(state: IBirthdaysWizardState): Partial<IHyperBirthdaysWebPartProps> {
  return {
    // Celebration types
    enableBirthdays: state.celebrationTypes.enableBirthdays,
    enableAnniversaries: state.celebrationTypes.enableAnniversaries,
    enableWeddings: state.celebrationTypes.enableWeddings,
    enableChildBirth: state.celebrationTypes.enableChildBirth,
    enableGraduation: state.celebrationTypes.enableGraduation,
    enableRetirement: state.celebrationTypes.enableRetirement,
    enablePromotion: state.celebrationTypes.enablePromotion,
    enableCustom: state.celebrationTypes.enableCustom,

    // Data sources
    enableEntraId: state.dataSources.enableEntraId,
    enableSpList: state.dataSources.enableSpList,
    spListName: state.dataSources.spListName,

    // Layout
    viewMode: state.layout.viewMode,
    timeRange: state.layout.timeRange,
    maxItems: state.layout.maxItems,
    photoSize: state.layout.photoSize,

    // Engagement
    enableTeamsDeepLink: state.engagement.enableTeamsDeepLink,
    enableAnimations: state.engagement.enableAnimations,
    animationType: state.engagement.animationType,
    enableMilestoneBadges: state.engagement.enableMilestoneBadges,
    enablePrivacyOptOut: state.engagement.enablePrivacyOptOut,
    optOutListName: state.engagement.optOutListName,

    // Mark wizard as done
    showWizardOnInit: false,
  };
}

/** Generate summary rows for the review step */
function buildSummary(state: IBirthdaysWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Celebration types
  var typeNames = getEnabledTypeNames(state.celebrationTypes);
  rows.push({
    label: "Celebration Types",
    value: typeNames.length > 0 ? typeNames.join(", ") : "None selected",
    type: "badge",
  });

  // Data sources
  var sources: string[] = [];
  if (state.dataSources.enableEntraId) { sources.push("Entra ID (Microsoft 365)"); }
  if (state.dataSources.enableSpList) { sources.push("SharePoint List"); }
  rows.push({
    label: "Data Sources",
    value: sources.length > 0 ? sources.join(" + ") : "None",
    type: "badge",
  });

  if (state.dataSources.enableSpList && state.dataSources.spListName) {
    rows.push({
      label: "List Name",
      value: state.dataSources.spListName,
      type: "mono",
    });
  }

  // Layout
  rows.push({
    label: "Layout",
    value: getViewModeDisplayName(state.layout.viewMode),
    type: "badge",
  });

  rows.push({
    label: "Time Range",
    value: getTimeRangeDisplayName(state.layout.timeRange),
    type: "text",
  });

  rows.push({
    label: "Max Items",
    value: String(state.layout.maxItems),
    type: "text",
  });

  // Engagement features
  var features: string[] = [];
  if (state.engagement.enableTeamsDeepLink) { features.push("Teams Wishes"); }
  if (state.engagement.enableAnimations) {
    features.push("Animations (" + getAnimationDisplayName(state.engagement.animationType) + ")");
  }
  if (state.engagement.enableMilestoneBadges) { features.push("Milestone Badges"); }
  if (state.engagement.enablePrivacyOptOut) { features.push("Privacy Opt-Out"); }

  rows.push({
    label: "Features",
    value: features.length > 0 ? features.join(", ") : "None",
    type: "badgeGreen",
  });

  return rows;
}

/** Hydrate wizard state from existing web part properties (for re-editing) */
export function buildStateFromProps(props: IHyperBirthdaysWebPartProps): IBirthdaysWizardState | undefined {
  // If wizard hasn't been configured yet, return undefined (shows welcome screen)
  if (props.showWizardOnInit !== false) {
    return undefined;
  }

  return {
    celebrationTypes: {
      enableBirthdays: props.enableBirthdays,
      enableAnniversaries: props.enableAnniversaries,
      enableWeddings: props.enableWeddings,
      enableChildBirth: props.enableChildBirth,
      enableGraduation: props.enableGraduation,
      enableRetirement: props.enableRetirement,
      enablePromotion: props.enablePromotion,
      enableCustom: props.enableCustom,
    },
    dataSources: {
      enableEntraId: props.enableEntraId,
      enableSpList: props.enableSpList,
      spListName: props.spListName || "",
    },
    layout: {
      viewMode: props.viewMode || "upcomingList",
      timeRange: props.timeRange || "thisMonth",
      maxItems: props.maxItems || 50,
      photoSize: props.photoSize || 48,
    },
    engagement: {
      enableTeamsDeepLink: props.enableTeamsDeepLink,
      enableAnimations: props.enableAnimations,
      animationType: props.animationType || "confetti",
      enableMilestoneBadges: props.enableMilestoneBadges,
      enablePrivacyOptOut: props.enablePrivacyOptOut,
      optOutListName: props.optOutListName || "",
    },
  };
}

/** Exported wizard configuration */
export var BIRTHDAYS_WIZARD_CONFIG: IHyperWizardConfig<IBirthdaysWizardState, Partial<IHyperBirthdaysWebPartProps>> = {
  title: "HyperBirthdays Setup Wizard",
  welcome: {
    productName: "Birthdays",
    tagline: "A stunning celebration engine that surfaces birthdays, anniversaries, and life milestones across your organization",
    taglineBold: ["celebration engine", "life milestones"],
    features: [
      {
        icon: "\uD83C\uDF82",
        title: "8 Celebration Types",
        description: "Birthday, anniversary, wedding, new baby, graduation, retirement, promotion, and custom events",
      },
      {
        icon: "\uD83D\uDCCA",
        title: "Multi-Source Data",
        description: "Auto-detect from Entra ID or use a SharePoint list \u2014 or merge both sources together",
      },
      {
        icon: "\uD83C\uDF86",
        title: "Animations & Badges",
        description: "Confetti, balloons, and sparkle effects with milestone badges for years of service",
      },
      {
        icon: "\uD83D\uDCC5",
        title: "3 View Modes",
        description: "Upcoming list, month calendar with emoji dots, or horizontal card carousel",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the Configure button in the toolbar.",
};
