import * as React from "react";
import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardStepProps,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperTabsWebPartProps } from "../../models";

export interface ITabsWizardState {
  title: string;
  displayMode: string;
  tabStyle: string;
  enableDeepLinking: boolean;
  enableLazyLoading: boolean;
  enableResponsiveCollapse: boolean;
  animationEnabled: boolean;
}

var DEFAULT_TABS_WIZARD_STATE: ITabsWizardState = {
  title: "",
  displayMode: "tabs",
  tabStyle: "horizontal",
  enableDeepLinking: true,
  enableLazyLoading: true,
  enableResponsiveCollapse: true,
  animationEnabled: true,
};

var SettingsStep: React.FC<IWizardStepProps<ITabsWizardState>> = function (_props) {
  return React.createElement("div", { style: { padding: "16px" } },
    React.createElement("p", undefined, "Tab container settings will be configured in the property pane after setup.")
  );
};

var steps: Array<IWizardStepDef<ITabsWizardState>> = [
  {
    id: "settings",
    label: "Container Settings",
    shortLabel: "Settings",
    helpText: "Configure the tab container display options. Add tab panels in the property pane after setup.",
    component: SettingsStep,
  },
];

function buildResult(state: ITabsWizardState): Partial<IHyperTabsWebPartProps> {
  return {
    title: state.title,
    displayMode: state.displayMode as IHyperTabsWebPartProps["displayMode"],
    tabStyle: state.tabStyle as IHyperTabsWebPartProps["tabStyle"],
    enableDeepLinking: state.enableDeepLinking,
    enableLazyLoading: state.enableLazyLoading,
    enableResponsiveCollapse: state.enableResponsiveCollapse,
    animationEnabled: state.animationEnabled,
  };
}

function buildSummary(state: ITabsWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];
  if (state.title.length > 0) {
    rows.push({ label: "Title", value: state.title, type: "text" });
  }
  var MODE_LABELS: Record<string, string> = {
    tabs: "Tabbed View",
    accordion: "Accordion",
    wizard: "Wizard Steps",
  };
  var STYLE_LABELS: Record<string, string> = {
    horizontal: "Horizontal Tabs",
    vertical: "Vertical Tabs",
    pill: "Pill Tabs",
    underline: "Underline Tabs",
  };
  rows.push({ label: "Display Mode", value: MODE_LABELS[state.displayMode] || state.displayMode, type: "badge" });
  rows.push({ label: "Tab Style", value: STYLE_LABELS[state.tabStyle] || state.tabStyle, type: "badge" });
  var features: string[] = [];
  if (state.enableDeepLinking) features.push("Deep Links");
  if (state.enableLazyLoading) features.push("Lazy Load");
  if (state.enableResponsiveCollapse) features.push("Responsive");
  if (state.animationEnabled) features.push("Animations");
  rows.push({
    label: "Features",
    value: features.length > 0 ? features.join(", ") : "None",
    type: features.length > 0 ? "badgeGreen" : "text",
  });
  return rows;
}

export function buildStateFromProps(props: IHyperTabsWebPartProps): ITabsWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }
  return {
    title: props.title || "",
    displayMode: props.displayMode || "tabs",
    tabStyle: props.tabStyle || "horizontal",
    enableDeepLinking: props.enableDeepLinking !== false,
    enableLazyLoading: props.enableLazyLoading !== false,
    enableResponsiveCollapse: props.enableResponsiveCollapse !== false,
    animationEnabled: props.animationEnabled !== false,
  };
}

export var TABS_WIZARD_CONFIG: IHyperWizardConfig<ITabsWizardState, Partial<IHyperTabsWebPartProps>> = {
  title: "HyperTabs Setup Wizard",
  welcome: {
    productName: "Tabs",
    tagline: "A versatile content container with tabs, accordion, and wizard modes",
    features: [
      {
        icon: "\uD83D\uDCCB",
        title: "3 Display Modes",
        description: "Horizontal/vertical tabs, collapsible accordion, and step-by-step wizard",
      },
      {
        icon: "\uD83C\uDFA8",
        title: "4 Tab Styles",
        description: "Horizontal, Vertical, Pill, and Underline tab variants",
      },
      {
        icon: "\uD83D\uDD17",
        title: "Deep Linking",
        description: "URL hash-based deep linking to specific tabs (#tab=panelId)",
      },
      {
        icon: "\u26A1",
        title: "Smart Loading",
        description: "Lazy loading, responsive collapse, and smooth animations",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_TABS_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "Add tab panels and configure content in the property pane after setup.",
};
