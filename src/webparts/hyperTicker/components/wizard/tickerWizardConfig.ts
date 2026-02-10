import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperTickerWebPartProps } from "../../models";
import type { ITickerWizardState } from "../../models/ITickerWizardState";
import { DEFAULT_TICKER_WIZARD_STATE } from "../../models/ITickerWizardState";
import { getDisplayModeDisplayName, getHeightPresetDisplayName, getDataSourceDisplayName } from "../../models";
import { getTickerTemplateDisplayName } from "../../models";
import TemplatesStep from "./TemplatesStep";
import DataSourceStep from "./DataSourceStep";
import DisplayModeStep from "./DisplayModeStep";
import FeaturesStep from "./FeaturesStep";
import AppearanceStep from "./AppearanceStep";

// ============================================================
// HyperTicker Wizard Config — Wires steps + state + result
// ============================================================

/** Step definitions */
const steps: Array<IWizardStepDef<ITickerWizardState>> = [
  {
    id: "templates",
    label: "Template Gallery",
    shortLabel: "Templates",
    helpText: "Browse pre-built ticker templates for instant setup, or skip to create your own from scratch.",
    component: TemplatesStep,
    hidden: function (state: ITickerWizardState): boolean {
      // Skip templates if user chose scratch or demo path
      return state.path !== "template";
    },
  },
  {
    id: "dataSource",
    label: "Data Source",
    shortLabel: "Source",
    helpText: function (state: ITickerWizardState): string {
      if (state.dataSource === "spList") {
        return "Enter the name of an existing SharePoint list containing your ticker items.";
      }
      if (state.dataSource === "rss") {
        return "Enter the URL of an RSS feed to pull news headlines from.";
      }
      if (state.dataSource === "graph") {
        return "Enter a Microsoft Graph API endpoint to fetch items from.";
      }
      if (state.dataSource === "restApi") {
        return "Enter an external REST API URL and optional headers.";
      }
      return "Choose how your ticker content is managed \u2014 manually or from an external source.";
    },
    component: DataSourceStep,
    hidden: function (state: ITickerWizardState): boolean {
      // Skip data source if template or demo path
      return state.path === "template" || state.path === "demo";
    },
  },
  {
    id: "displayMode",
    label: "Display Mode",
    shortLabel: "Mode",
    helpText: "Choose how your ticker items are displayed. Pick a mode and height preset.",
    component: DisplayModeStep,
    hidden: function (state: ITickerWizardState): boolean {
      return state.path === "demo";
    },
  },
  {
    id: "features",
    label: "Features",
    shortLabel: "Features",
    helpText: "Enable or disable interactive features like dismiss, acknowledge, expand, and analytics.",
    component: FeaturesStep,
    hidden: function (state: ITickerWizardState): boolean {
      return state.path === "demo";
    },
  },
  {
    id: "appearance",
    label: "Appearance",
    shortLabel: "Look",
    helpText: "Fine-tune the ticker speed, severity colors, and visual effects. These can be changed later in the property pane.",
    component: AppearanceStep,
    hidden: function (state: ITickerWizardState): boolean {
      return state.path === "demo";
    },
  },
];

// ── Build result ──

function buildResult(state: ITickerWizardState): Partial<IHyperTickerWebPartProps> {
  const result: Partial<IHyperTickerWebPartProps> = {
    wizardCompleted: true,
    displayMode: state.displayMode,
    heightPreset: state.heightPreset,
    speed: state.speed,
    pauseOnHover: state.pauseOnHover,
    defaultSeverity: state.defaultSeverity,
    enableDismiss: state.enableDismiss,
    enableAcknowledge: state.enableAcknowledge,
    enableExpand: state.enableExpand,
    enableCopy: state.enableCopy,
    enableAnalytics: state.enableAnalytics,
    enableItemAudience: state.enableItemAudience,
    enableEmergencyMode: state.enableEmergencyMode,
    enableGradientFade: state.enableGradientFade,
    backgroundGradient: state.backgroundGradient,
  };

  // Template path: apply template preset
  if (state.path === "template" && state.templateId) {
    result.templateId = state.templateId;
  }

  // Demo path
  if (state.path === "demo") {
    result.enableDemoMode = true;
    result.demoPresetId = "companyNews";
  }

  // Data source config
  if (state.dataSource === "spList" && state.listName) {
    result.listName = state.listName;
  }
  if (state.dataSource === "graph" && state.graphEndpoint) {
    result.graphEndpoint = state.graphEndpoint;
  }
  if (state.dataSource === "restApi" && state.restApiUrl) {
    result.restApiUrl = state.restApiUrl;
    result.restApiHeaders = state.restApiHeaders;
  }

  return result;
}

// ── Build summary ──

function buildSummary(state: ITickerWizardState): IWizardSummaryRow[] {
  const rows: IWizardSummaryRow[] = [];

  // Path
  if (state.path === "template") {
    rows.push({ label: "Setup Path", value: "Template", type: "badge" });
    if (state.templateId) {
      rows.push({ label: "Template", value: getTickerTemplateDisplayName(state.templateId), type: "mono" });
    }
  } else if (state.path === "demo") {
    rows.push({ label: "Setup Path", value: "Demo Mode", type: "badge" });
  } else {
    rows.push({ label: "Setup Path", value: "From Scratch", type: "badge" });
    rows.push({ label: "Data Source", value: getDataSourceDisplayName(state.dataSource), type: "text" });
    if (state.dataSource === "spList" && state.listName) {
      rows.push({ label: "List Name", value: state.listName, type: "mono" });
    }
    if (state.dataSource === "graph" && state.graphEndpoint) {
      rows.push({ label: "Graph Endpoint", value: state.graphEndpoint, type: "mono" });
    }
    if (state.dataSource === "restApi" && state.restApiUrl) {
      rows.push({ label: "API URL", value: state.restApiUrl, type: "mono" });
    }
  }

  // Display mode
  rows.push({ label: "Display Mode", value: getDisplayModeDisplayName(state.displayMode), type: "text" });
  rows.push({ label: "Height", value: getHeightPresetDisplayName(state.heightPreset), type: "text" });

  // Features
  const features: string[] = [];
  if (state.enableDismiss) features.push("Dismiss");
  if (state.enableAcknowledge) features.push("Acknowledge");
  if (state.enableExpand) features.push("Expand");
  if (state.enableCopy) features.push("Copy");
  if (state.enableAnalytics) features.push("Analytics");
  if (state.enableItemAudience) features.push("Audience");
  if (state.enableEmergencyMode) features.push("Emergency");
  if (features.length > 0) {
    rows.push({ label: "Features", value: features.join(", "), type: "text" });
  }

  // Appearance
  rows.push({ label: "Speed", value: String(state.speed) + "/10", type: "text" });
  if (state.pauseOnHover) {
    rows.push({ label: "Pause on Hover", value: "Enabled", type: "badgeGreen" });
  }
  if (state.enableGradientFade) {
    rows.push({ label: "Gradient Fade", value: "Enabled", type: "badgeGreen" });
  }

  return rows;
}

/**
 * Hydrate wizard state from existing web part properties (for re-editing).
 */
export function buildStateFromProps(props: IHyperTickerWebPartProps): ITickerWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }

  return {
    path: props.templateId ? "template" : "scratch",
    templateId: props.templateId || "",
    dataSource: props.graphEndpoint ? "graph"
      : props.restApiUrl ? "restApi"
      : props.listName ? "spList"
      : "manual",
    listName: props.listName || "",
    rssUrl: "",
    graphEndpoint: props.graphEndpoint || "",
    restApiUrl: props.restApiUrl || "",
    restApiHeaders: props.restApiHeaders || "",
    displayMode: props.displayMode || "scroll",
    heightPreset: props.heightPreset || "standard",
    enableDismiss: props.enableDismiss || false,
    enableAcknowledge: props.enableAcknowledge || false,
    enableExpand: props.enableExpand || false,
    enableCopy: props.enableCopy || false,
    enableAnalytics: props.enableAnalytics || false,
    enableItemAudience: props.enableItemAudience || false,
    enableEmergencyMode: props.enableEmergencyMode || false,
    speed: props.speed || 5,
    pauseOnHover: props.pauseOnHover !== false,
    enableGradientFade: props.enableGradientFade || false,
    backgroundGradient: props.backgroundGradient || "",
    defaultSeverity: props.defaultSeverity || "normal",
  };
}

/** The full wizard configuration */
export const TICKER_WIZARD_CONFIG: IHyperWizardConfig<ITickerWizardState, Partial<IHyperTickerWebPartProps>> = {
  title: "HyperTicker Setup Wizard",
  welcome: {
    productName: "Ticker",
    tagline: "The most powerful communication command strip for SharePoint with 8 display modes, 10 templates, and emergency messaging",
    features: [
      {
        icon: "\uD83D\uDCE2",
        title: "8 Display Modes",
        description: "Scroll, fade, static, stacked, vertical, typewriter, split, and breaking news",
      },
      {
        icon: "\uD83C\uDFA8",
        title: "10 Templates",
        description: "Company News, IT Service Desk, HR, Emergency, Events, Stock, and more",
      },
      {
        icon: "\u26A1",
        title: "5 Data Sources",
        description: "Manual items, SharePoint list, RSS feed, Microsoft Graph, and REST API",
      },
      {
        icon: "\uD83D\uDEA8",
        title: "Emergency Mode",
        description: "Critical alerts with pulsing overlay, mandatory acknowledgment, and priority override",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_TICKER_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can change any of these settings later via the property pane or by clicking Re-run Setup in edit mode.",
};
