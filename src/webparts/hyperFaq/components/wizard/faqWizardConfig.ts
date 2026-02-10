import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperFaqWebPartProps } from "../../models/IHyperFaqWebPartProps";
import type { FaqAccordionStyle, FaqSortMode } from "../../models/IHyperFaqEnums";
import {
  getAccordionStyleDisplayName,
  getSortModeDisplayName,
} from "../../models/IHyperFaqEnums";
import TemplatesStep from "./TemplatesStep";
import DataSourceStep from "./DataSourceStep";
import LayoutStep from "./LayoutStep";
import FeaturesStep from "./FeaturesStep";
import AppearanceStep from "./AppearanceStep";

// ============================================================
// HyperFAQ V2 Wizard Config — State, Steps, Result, Summary
// ============================================================

/** Wizard state — flat shape for simple onChange(partial) merging */
export interface IFaqWizardState {
  /** Selected template id */
  selectedTemplate: string;
  /** Data source: "list" or "sample" */
  dataSource: "list" | "sample";
  /** SP list name when dataSource is "list" */
  listName: string;
  /** Layout type */
  layout: string;
  /** Accordion style */
  accordionStyle: FaqAccordionStyle;
  /** Sort mode */
  sortMode: FaqSortMode;
  /** Search & Discovery features */
  enableSearch: boolean;
  enableSearchHighlight: boolean;
  enableDeepLink: boolean;
  /** Engagement features */
  enableVoting: boolean;
  enableFeedbackOnDownvote: boolean;
  enableRelated: boolean;
  enableCopyLink: boolean;
  enableContactExpert: boolean;
  enableSubmission: boolean;
  showViewCount: boolean;
  enableExpandAll: boolean;
  enablePinnedFaqs: boolean;
  /** Category grouping */
  enableCategories: boolean;
  showCategoryCards: boolean;
}

/** Default initial wizard state */
var DEFAULT_FAQ_WIZARD_STATE: IFaqWizardState = {
  selectedTemplate: "corporate-clean",
  dataSource: "sample",
  listName: "",
  layout: "accordion",
  accordionStyle: "clean",
  sortMode: "alphabetical",
  enableSearch: true,
  enableSearchHighlight: true,
  enableDeepLink: true,
  enableVoting: true,
  enableFeedbackOnDownvote: false,
  enableRelated: true,
  enableCopyLink: false,
  enableContactExpert: false,
  enableSubmission: false,
  showViewCount: false,
  enableExpandAll: false,
  enablePinnedFaqs: false,
  enableCategories: true,
  showCategoryCards: false,
};

// ── Template definitions ──

export interface IFaqTemplate {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  overrides: Partial<IFaqWizardState>;
}

export var FAQ_TEMPLATES: IFaqTemplate[] = [
  {
    id: "corporate-clean",
    name: "Corporate Clean",
    description: "Professional FAQ with clean styling and search",
    primaryColor: "#0078d4",
    secondaryColor: "#f3f2f1",
    accentColor: "#106ebe",
    overrides: { accordionStyle: "clean", enableSearch: true, enableVoting: true, enableRelated: true, layout: "accordion" },
  },
  {
    id: "helpdesk",
    name: "Help Desk",
    description: "IT support style with categories and voting",
    primaryColor: "#107c10",
    secondaryColor: "#dff6dd",
    accentColor: "#0b6a0b",
    overrides: { accordionStyle: "boxed", enableSearch: true, enableVoting: true, enableCategories: true, enableSubmission: true, layout: "accordion", sortMode: "category" },
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    description: "Comprehensive KB with deep links and related items",
    primaryColor: "#8764b8",
    secondaryColor: "#f0e6ff",
    accentColor: "#6b4fa2",
    overrides: { accordionStyle: "bordered", enableSearch: true, enableDeepLink: true, enableRelated: true, enableExpandAll: true, showViewCount: true, layout: "knowledgeBase" },
  },
  {
    id: "product-faq",
    name: "Product FAQ",
    description: "Customer-facing FAQ with card layout",
    primaryColor: "#d83b01",
    secondaryColor: "#fde7e9",
    accentColor: "#b02c00",
    overrides: { accordionStyle: "clean", enableSearch: true, enableVoting: true, layout: "cardGrid", enableCategories: true, showCategoryCards: true },
  },
  {
    id: "onboarding",
    name: "Onboarding Guide",
    description: "New hire FAQ organized by timeline",
    primaryColor: "#00b7c3",
    secondaryColor: "#e0f7fa",
    accentColor: "#008b94",
    overrides: { accordionStyle: "bordered", enableSearch: true, sortMode: "category", enableCategories: true, layout: "tabs" },
  },
  {
    id: "policy-hub",
    name: "Policy Hub",
    description: "Company policy FAQ with search highlights",
    primaryColor: "#323130",
    secondaryColor: "#f3f2f1",
    accentColor: "#605e5c",
    overrides: { accordionStyle: "minimal", enableSearch: true, enableSearchHighlight: true, enableDeepLink: true, layout: "accordion", sortMode: "alphabetical" },
  },
  {
    id: "community-qa",
    name: "Community Q&A",
    description: "Community-driven FAQ with voting and submissions",
    primaryColor: "#e3008c",
    secondaryColor: "#fce4ec",
    accentColor: "#b4009e",
    overrides: { accordionStyle: "boxed", enableVoting: true, enableSubmission: true, enableFeedbackOnDownvote: true, showViewCount: true, layout: "accordion", sortMode: "popular" },
  },
  {
    id: "legal-compliance",
    name: "Legal & Compliance",
    description: "Compliance FAQ with pinned items and deep links",
    primaryColor: "#004578",
    secondaryColor: "#deecf9",
    accentColor: "#005a9e",
    overrides: { accordionStyle: "bordered", enableSearch: true, enablePinnedFaqs: true, enableDeepLink: true, layout: "accordion", sortMode: "category" },
  },
  {
    id: "modern-cards",
    name: "Modern Cards",
    description: "Tile-based layout with category cards",
    primaryColor: "#881798",
    secondaryColor: "#f3e5f5",
    accentColor: "#6b2fa0",
    overrides: { accordionStyle: "clean", enableCategories: true, showCategoryCards: true, enableSearch: true, layout: "cardGrid" },
  },
  {
    id: "magazine-style",
    name: "Magazine Style",
    description: "Rich magazine layout with images and highlights",
    primaryColor: "#ca5010",
    secondaryColor: "#fff4ce",
    accentColor: "#986f0b",
    overrides: { accordionStyle: "clean", enableSearch: true, enableRelated: true, layout: "magazine" },
  },
  {
    id: "minimal-zen",
    name: "Minimal Zen",
    description: "Clean minimal design with just the essentials",
    primaryColor: "#8a8886",
    secondaryColor: "#faf9f8",
    accentColor: "#605e5c",
    overrides: { accordionStyle: "minimal", enableSearch: true, layout: "compact", enableCategories: false },
  },
  {
    id: "custom",
    name: "Start from Scratch",
    description: "Configure every detail yourself",
    primaryColor: "#0078d4",
    secondaryColor: "#ffffff",
    accentColor: "#c8c6c4",
    overrides: {},
  },
];

// ── Step definitions ──

var steps: Array<IWizardStepDef<IFaqWizardState>> = [
  {
    id: "templates",
    label: "Choose a Template",
    shortLabel: "Template",
    helpText: "Pick a pre-built template to get started quickly, or choose Start from Scratch to configure everything yourself.",
    component: TemplatesStep,
  },
  {
    id: "dataSource",
    label: "Data Source",
    shortLabel: "Data",
    helpText: "Choose where your FAQ content comes from. Use sample data to explore, or connect a SharePoint list.",
    component: DataSourceStep,
    validate: function (state: IFaqWizardState): boolean {
      if (state.dataSource === "list") {
        return state.listName.length > 0;
      }
      return true;
    },
  },
  {
    id: "layout",
    label: "Layout & Display",
    shortLabel: "Layout",
    helpText: "Choose how your FAQs are displayed. Pick a layout and accordion style.",
    component: LayoutStep,
  },
  {
    id: "features",
    label: "Features",
    shortLabel: "Features",
    helpText: "Enable or disable interactive features for your FAQ experience.",
    component: FeaturesStep,
  },
  {
    id: "appearance",
    label: "Appearance",
    shortLabel: "Style",
    helpText: "Fine-tune the visual appearance of your FAQ section.",
    component: AppearanceStep,
  },
];

// ── Build result ──

function buildResult(state: IFaqWizardState): Partial<IHyperFaqWebPartProps> {
  return {
    listName: state.dataSource === "list" ? state.listName : "",
    accordionStyle: state.accordionStyle,
    sortMode: state.sortMode,
    enableSearch: state.enableSearch,
    enableVoting: state.enableVoting,
    enableSubmission: state.enableSubmission,
    enableRelated: state.enableRelated,
    enableCategories: state.enableCategories,
    showViewCount: state.showViewCount,
    enableDeepLink: state.enableDeepLink,
  };
}

// ── Build summary ──

function buildSummary(state: IFaqWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Template
  var templateName = state.selectedTemplate;
  FAQ_TEMPLATES.forEach(function (t) {
    if (t.id === state.selectedTemplate) {
      templateName = t.name;
    }
  });
  rows.push({ label: "Template", value: templateName, type: "badge" });

  // Data source
  var sourceText = state.dataSource === "sample"
    ? "Sample Data (30 built-in FAQs)"
    : "SharePoint List: " + state.listName;
  rows.push({ label: "Data Source", value: sourceText, type: "text" });

  // Layout
  var LAYOUT_LABELS: Record<string, string> = {
    accordion: "Accordion",
    cardGrid: "Card Grid",
    magazine: "Magazine",
    tabs: "Tabs",
    timeline: "Timeline",
    masonry: "Masonry",
    compact: "Compact",
    knowledgeBase: "Knowledge Base",
  };
  var layoutLabel = LAYOUT_LABELS[state.layout] || state.layout;
  rows.push({ label: "Layout", value: layoutLabel, type: "badge" });

  // Accordion style
  rows.push({
    label: "Accordion Style",
    value: getAccordionStyleDisplayName(state.accordionStyle),
    type: "badge",
  });

  // Sort mode
  rows.push({
    label: "Sort Mode",
    value: getSortModeDisplayName(state.sortMode),
    type: "text",
  });

  // Features count
  var enabledFeatures: string[] = [];
  if (state.enableSearch) enabledFeatures.push("Search");
  if (state.enableVoting) enabledFeatures.push("Voting");
  if (state.enableRelated) enabledFeatures.push("Related");
  if (state.enableDeepLink) enabledFeatures.push("Deep Links");
  if (state.enableSubmission) enabledFeatures.push("Ask Guru");
  if (state.showViewCount) enabledFeatures.push("View Count");
  if (state.enableExpandAll) enabledFeatures.push("Expand All");
  if (state.enablePinnedFaqs) enabledFeatures.push("Pinned FAQs");
  if (state.enableCopyLink) enabledFeatures.push("Copy Link");
  if (state.enableContactExpert) enabledFeatures.push("Contact Expert");
  if (state.enableSearchHighlight) enabledFeatures.push("Search Highlight");
  if (state.enableFeedbackOnDownvote) enabledFeatures.push("Downvote Feedback");

  rows.push({
    label: "Features",
    value: enabledFeatures.length > 0
      ? String(enabledFeatures.length) + " enabled (" + enabledFeatures.join(", ") + ")"
      : "None",
    type: enabledFeatures.length > 0 ? "badgeGreen" : "text",
  });

  // Categories
  rows.push({
    label: "Category Grouping",
    value: state.enableCategories ? "Enabled" : "Disabled",
    type: state.enableCategories ? "badgeGreen" : "text",
  });

  return rows;
}

// ── Build state from existing props (for re-editing) ──

export function buildStateFromFaqProps(props: IHyperFaqWebPartProps): IFaqWizardState | undefined {
  // If no list name and not obviously configured, return undefined for fresh wizard
  if (!props.listName && props.accordionStyle === undefined) {
    return undefined;
  }

  return {
    selectedTemplate: "custom",
    dataSource: props.listName ? "list" : "sample",
    listName: props.listName || "",
    layout: "accordion",
    accordionStyle: props.accordionStyle || "clean",
    sortMode: props.sortMode || "alphabetical",
    enableSearch: props.enableSearch !== false,
    enableSearchHighlight: true,
    enableDeepLink: props.enableDeepLink !== false,
    enableVoting: props.enableVoting !== false,
    enableFeedbackOnDownvote: false,
    enableRelated: props.enableRelated !== false,
    enableCopyLink: false,
    enableContactExpert: false,
    enableSubmission: props.enableSubmission === true,
    showViewCount: props.showViewCount === true,
    enableExpandAll: false,
    enablePinnedFaqs: false,
    enableCategories: props.enableCategories !== false,
    showCategoryCards: false,
  };
}

// ── Full wizard configuration ──

export var FAQ_WIZARD_CONFIG: IHyperWizardConfig<IFaqWizardState, Partial<IHyperFaqWebPartProps>> = {
  title: "HyperFAQ Setup Wizard",
  welcome: {
    productName: "FAQ",
    tagline: "A powerful, searchable FAQ knowledge base with voting, deep links, and community submissions",
    features: [
      {
        icon: "\uD83D\uDD0D",
        title: "Weighted Search",
        description: "Fuzzy matching across questions, answers, categories, and tags with highlighting",
      },
      {
        icon: "\uD83C\uDFA8",
        title: "8 Layouts & 4 Styles",
        description: "Accordion, Card Grid, Magazine, Tabs, Timeline, Masonry, Compact, and Knowledge Base",
      },
      {
        icon: "\uD83D\uDC4D",
        title: "Voting & Feedback",
        description: "Thumbs up/down voting with optional feedback form on downvotes",
      },
      {
        icon: "\uD83D\uDCAC",
        title: "Ask Guru",
        description: "Let users submit questions to a review queue for expert answers",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_FAQ_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the toolbar Configure button or the property pane.",
};
