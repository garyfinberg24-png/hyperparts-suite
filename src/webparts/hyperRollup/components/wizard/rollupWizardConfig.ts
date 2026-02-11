import * as React from "react";
import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardStepProps,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperRollupWebPartProps } from "../../models";

// ============================================================
// HyperRollup Wizard Config
// ============================================================

export interface IRollupWizardState {
  title: string;
  viewMode: string;
  pageSize: number;
  enableFilters: boolean;
  enableSearch: boolean;
  enableExport: boolean;
  enableTemplates: boolean;
  cacheEnabled: boolean;
}

var DEFAULT_ROLLUP_WIZARD_STATE: IRollupWizardState = {
  title: "",
  viewMode: "card",
  pageSize: 10,
  enableFilters: true,
  enableSearch: true,
  enableExport: false,
  enableTemplates: false,
  cacheEnabled: true,
};

// Inline placeholder step
var SettingsStep: React.FC<IWizardStepProps<IRollupWizardState>> = function (_props) {
  return React.createElement("div", { style: { padding: "16px" } },
    React.createElement("p", undefined, "Content rollup settings will be configured in the property pane after setup.")
  );
};

var steps: Array<IWizardStepDef<IRollupWizardState>> = [
  {
    id: "settings",
    label: "Rollup Settings",
    shortLabel: "Settings",
    helpText: "Configure the basic rollup display options. Connect data sources and fine-tune views in the property pane.",
    component: SettingsStep,
  },
];

function buildResult(state: IRollupWizardState): Partial<IHyperRollupWebPartProps> {
  return {
    title: state.title,
    viewMode: state.viewMode as IHyperRollupWebPartProps["viewMode"],
    pageSize: state.pageSize,
    enableFilters: state.enableFilters,
    enableSearch: state.enableSearch,
    enableExport: state.enableExport,
    enableTemplates: state.enableTemplates,
    cacheEnabled: state.cacheEnabled,
  };
}

function buildSummary(state: IRollupWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];
  if (state.title.length > 0) {
    rows.push({ label: "Title", value: state.title, type: "text" });
  }
  var VIEW_LABELS: Record<string, string> = {
    card: "Card View",
    table: "Table View",
    kanban: "Kanban Board",
    list: "List View",
    carousel: "Carousel",
    filmstrip: "Film Strip",
    gallery: "Gallery",
    timeline: "Timeline",
    calendar: "Calendar",
    magazine: "Magazine",
    top10: "Top 10",
  };
  rows.push({ label: "View Mode", value: VIEW_LABELS[state.viewMode] || state.viewMode, type: "badge" });
  rows.push({ label: "Page Size", value: String(state.pageSize) + " items", type: "text" });

  var features: string[] = [];
  if (state.enableFilters) features.push("Filters");
  if (state.enableSearch) features.push("Search");
  if (state.enableExport) features.push("Export");
  if (state.enableTemplates) features.push("Templates");
  if (state.cacheEnabled) features.push("Cache");
  rows.push({
    label: "Features",
    value: features.length > 0 ? features.join(", ") : "None",
    type: features.length > 0 ? "badgeGreen" : "text",
  });
  return rows;
}

export function buildStateFromProps(props: IHyperRollupWebPartProps): IRollupWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }
  return {
    title: props.title || "",
    viewMode: props.viewMode || "card",
    pageSize: props.pageSize || 10,
    enableFilters: props.enableFilters !== false,
    enableSearch: props.enableSearch !== false,
    enableExport: props.enableExport === true,
    enableTemplates: props.enableTemplates === true,
    cacheEnabled: props.cacheEnabled !== false,
  };
}

export var ROLLUP_WIZARD_CONFIG: IHyperWizardConfig<IRollupWizardState, Partial<IHyperRollupWebPartProps>> = {
  title: "HyperRollup Setup Wizard",
  welcome: {
    productName: "Rollup",
    tagline: "A universal content aggregator with 11 views, Handlebars templates, and cross-site rollup",
    features: [
      {
        icon: "\uD83D\uDCCA",
        title: "11 View Modes",
        description: "Card, Table, Kanban, List, Carousel, Film Strip, Gallery, Timeline, Calendar, Magazine, Top 10",
      },
      {
        icon: "\uD83D\uDD17",
        title: "Cross-Site Rollup",
        description: "Aggregate content from multiple SharePoint sites, lists, and libraries",
      },
      {
        icon: "\uD83C\uDFA8",
        title: "Handlebars Templates",
        description: "Custom rendering with built-in and user-defined Handlebars templates",
      },
      {
        icon: "\u26A1",
        title: "Smart Features",
        description: "Faceted filters, inline editing, saved views, and Power Automate actions",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_ROLLUP_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "Connect data sources and fine-tune views in the property pane after setup.",
};
