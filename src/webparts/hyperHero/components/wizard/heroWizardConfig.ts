import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperHeroWebPartProps, IHyperHeroSlide, TransitionEffect } from "../../models";
import { DEFAULT_HERO_FIELD_MAPPING } from "../../models";
import type { LayoutPreset } from "./ListPickerStep";
import SliderModeStep from "./SliderModeStep";
import TemplateGalleryStep from "./TemplateGalleryStep";
import ContentSourceStep from "./ContentSourceStep";
import ListPickerStep from "./ListPickerStep";
import GeneralSettingsStep from "./GeneralSettingsStep";

// ============================================================
// HyperHero Wizard Config — Wires steps + state + result
// ============================================================

/** Wizard state tracked across all steps */
export interface IHeroWizardState {
  // Step 0: Slider Mode
  sliderMode: "simple" | "hyper";
  // Step 1: Templates
  contentPath: "scratch" | "template";
  selectedTemplateId: string;
  templateSlides: IHyperHeroSlide[] | undefined;
  templateLayoutPreset: LayoutPreset | undefined;
  // Step 2: Content source
  mode: "manual" | "list";
  // Step 3: Configure (manual: layout / list: list picker)
  listName: string;
  layoutPreset: LayoutPreset;
  aspectRatio: "16:9" | "4:3" | "21:9" | "custom";
  // Step 4: Settings
  title: string;
  heroHeight: number;
  borderRadius: number;
  fullBleed: boolean;
  rotationEnabled: boolean;
  rotationInterval: number;
  rotationEffect: TransitionEffect;
  pauseOnHover: boolean;
  showDots: boolean;
  showArrows: boolean;
}

export var DEFAULT_HERO_WIZARD_STATE: IHeroWizardState = {
  sliderMode: "hyper",
  contentPath: "scratch",
  selectedTemplateId: "",
  templateSlides: undefined,
  templateLayoutPreset: undefined,
  mode: "manual",
  listName: "",
  layoutPreset: "single",
  aspectRatio: "16:9",
  title: "",
  heroHeight: 400,
  borderRadius: 0,
  fullBleed: false,
  rotationEnabled: false,
  rotationInterval: 5000,
  rotationEffect: "fade",
  pauseOnHover: true,
  showDots: true,
  showArrows: true,
};

/** Output type from the wizard — matches existing IWizardResult interface */
export interface IHeroWizardResult {
  sliderMode: "simple" | "hyper";
  mode: "manual" | "list";
  listName?: string;
  fieldMapping?: typeof DEFAULT_HERO_FIELD_MAPPING;
  slideCount?: number;
  layoutPreset?: LayoutPreset;
  aspectRatio?: "16:9" | "4:3" | "21:9" | "custom";
  generalSettings: {
    title: string;
    heroHeight: number;
    borderRadius: number;
    fullBleed: boolean;
    rotationEnabled: boolean;
    rotationInterval: number;
    rotationEffect: TransitionEffect;
    pauseOnHover: boolean;
    showDots: boolean;
    showArrows: boolean;
  };
  templateSlides?: IHyperHeroSlide[];
}

/** Preset slide counts by layout */
var PRESET_SLIDE_COUNTS: Record<LayoutPreset, number> = {
  single: 1,
  split: 2,
  thirds: 3,
  heroSidebar: 2,
  grid2x2: 4,
};

/** Format layout preset for display */
function formatLayoutPreset(preset: LayoutPreset): string {
  var map: Record<LayoutPreset, string> = {
    single: "Full Width (1 slide)",
    split: "Split (2 slides)",
    thirds: "Thirds (3 slides)",
    heroSidebar: "Hero + Sidebar (2 slides)",
    grid2x2: "Grid 2\u00D72 (4 slides)",
  };
  return map[preset] || preset;
}

// ── Step definitions ──

var steps: Array<IWizardStepDef<IHeroWizardState>> = [
  {
    id: "sliderMode",
    label: "Slider Mode",
    shortLabel: "Mode",
    helpText: "Choose between a quick Simple Slider or the full-featured Hyper Slider with animations, templates, and accessibility tools.",
    component: SliderModeStep,
  },
  {
    id: "templates",
    label: "Template Gallery",
    shortLabel: "Templates",
    helpText: "Browse pre-built hero templates for instant setup, or skip to create your own from scratch.",
    component: TemplateGalleryStep,
    hidden: function (state: IHeroWizardState): boolean {
      // Simple mode skips templates entirely
      return state.sliderMode === "simple";
    },
  },
  {
    id: "contentSource",
    label: "Content Source",
    shortLabel: "Source",
    helpText: "Choose how your hero content is managed \u2014 manually with full creative control, or dynamically from a SharePoint list.",
    component: ContentSourceStep,
    hidden: function (state: IHeroWizardState): boolean {
      // Skip if user chose a template (template path bypasses content source)
      return state.contentPath === "template" && state.selectedTemplateId.length > 0;
    },
  },
  {
    id: "configure",
    label: "Configure",
    shortLabel: "Configure",
    helpText: function (state: IHeroWizardState): string {
      if (state.mode === "list") {
        return "Select an existing SharePoint list or create a new one. The wizard will auto-provision the required columns.";
      }
      return "Pick a layout preset. Each layout creates placeholder slides that you can customize individually after setup.";
    },
    component: ListPickerStep,
    validate: function (state: IHeroWizardState): boolean {
      if (state.mode === "list") {
        return state.listName.length > 0;
      }
      return true; // Manual mode always valid (layout preset has default)
    },
    hidden: function (state: IHeroWizardState): boolean {
      // Skip configure if template path (slides come from template)
      return state.contentPath === "template" && state.selectedTemplateId.length > 0;
    },
  },
  {
    id: "settings",
    label: "General Settings",
    shortLabel: "Settings",
    helpText: "Fine-tune the hero appearance \u2014 height, rounded corners, full bleed, and auto-rotation. These can be changed later in the property pane.",
    component: GeneralSettingsStep,
  },
];

// ── Build result ──

function buildResult(state: IHeroWizardState): IHeroWizardResult {
  var result: IHeroWizardResult = {
    sliderMode: state.sliderMode,
    mode: state.mode,
    aspectRatio: state.aspectRatio,
    generalSettings: {
      title: state.title,
      heroHeight: state.heroHeight,
      borderRadius: state.borderRadius,
      fullBleed: state.fullBleed,
      rotationEnabled: state.rotationEnabled,
      rotationInterval: state.rotationInterval,
      rotationEffect: state.rotationEffect,
      pauseOnHover: state.pauseOnHover,
      showDots: state.showDots,
      showArrows: state.showArrows,
    },
  };

  // Template path: use template slides directly
  if (state.contentPath === "template" && state.templateSlides) {
    result.mode = "manual";
    result.templateSlides = state.templateSlides;
    result.layoutPreset = state.templateLayoutPreset || "single";
    result.slideCount = state.templateSlides.length;
    return result;
  }

  // List mode
  if (state.mode === "list" && state.listName.length > 0) {
    result.listName = state.listName;
    result.fieldMapping = DEFAULT_HERO_FIELD_MAPPING;
    return result;
  }

  // Manual mode
  result.slideCount = PRESET_SLIDE_COUNTS[state.layoutPreset];
  result.layoutPreset = state.layoutPreset;
  return result;
}

// ── Build summary ──

function buildSummary(state: IHeroWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Slider mode
  rows.push({
    label: "Slider Mode",
    value: state.sliderMode === "hyper" ? "Hyper Slider" : "Simple Slider",
    type: "badge",
  });

  // Content source
  if (state.contentPath === "template" && state.selectedTemplateId.length > 0) {
    rows.push({ label: "Content Mode", value: "Template", type: "badge" });
    rows.push({ label: "Template", value: state.selectedTemplateId, type: "mono" });
  } else if (state.mode === "list") {
    rows.push({ label: "Content Mode", value: "SharePoint List", type: "badge" });
    if (state.listName.length > 0) {
      rows.push({ label: "List Name", value: state.listName, type: "mono" });
    }
  } else {
    rows.push({ label: "Content Mode", value: "Manual Slides", type: "badge" });
    rows.push({ label: "Layout", value: formatLayoutPreset(state.layoutPreset), type: "text" });
    rows.push({ label: "Slides Created", value: String(PRESET_SLIDE_COUNTS[state.layoutPreset]), type: "text" });
  }

  // General settings
  if (state.title.length > 0) {
    rows.push({ label: "Title", value: state.title, type: "text" });
  }
  rows.push({ label: "Height", value: state.heroHeight + "px", type: "text" });
  rows.push({ label: "Aspect Ratio", value: state.aspectRatio, type: "text" });
  if (state.borderRadius > 0) {
    rows.push({ label: "Corner Rounding", value: state.borderRadius + "px", type: "text" });
  }
  if (state.fullBleed) {
    rows.push({ label: "Full Bleed", value: "Enabled", type: "badgeGreen" });
  }
  if (state.rotationEnabled) {
    rows.push({
      label: "Auto-Rotation",
      value: (state.rotationInterval / 1000) + "s \u00B7 " + state.rotationEffect,
      type: "text",
    });
  }

  return rows;
}

/**
 * Hydrate wizard state from existing web part properties (for re-editing).
 * Returns undefined if the wizard hasn't been completed (first-time setup).
 */
export function buildStateFromProps(props: IHyperHeroWebPartProps): IHeroWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }

  var rotation = props.rotation;
  return {
    sliderMode: props.sliderMode === "simple" ? "simple" : "hyper",
    contentPath: "scratch",
    selectedTemplateId: "",
    templateSlides: undefined,
    templateLayoutPreset: undefined,
    mode: props.contentBinding && props.contentBinding.enabled ? "list" : "manual",
    listName: props.contentBinding && props.contentBinding.listName ? props.contentBinding.listName : "",
    layoutPreset: "single",
    aspectRatio: props.aspectRatio || "16:9",
    title: props.title || "",
    heroHeight: props.heroHeight || 400,
    borderRadius: props.borderRadius || 0,
    fullBleed: props.fullBleed || false,
    rotationEnabled: rotation ? rotation.enabled : false,
    rotationInterval: rotation ? rotation.intervalMs : 5000,
    rotationEffect: rotation ? rotation.effect : "fade",
    pauseOnHover: rotation ? rotation.pauseOnHover : true,
    showDots: rotation ? rotation.showDots : true,
    showArrows: rotation ? rotation.showArrows : true,
  };
}

/** The full wizard configuration */
export var HERO_WIZARD_CONFIG: IHyperWizardConfig<IHeroWizardState, IHeroWizardResult> = {
  title: "HyperHero Setup Wizard",
  welcome: {
    productName: "Hero",
    tagline: "The most powerful hero banner for SharePoint with rotating slides, animations, and smart automation",
    features: [
      {
        icon: "\uD83C\uDF05",
        title: "Rich Backgrounds",
        description: "Images, videos, gradients, Lottie animations, and parallax effects",
      },
      {
        icon: "\uD83C\uDFA8",
        title: "Visual Designer",
        description: "6-tab slide editor with live preview, device toggles, and animation timeline",
      },
      {
        icon: "\u26A1",
        title: "Smart Automation",
        description: "Auto-rotation, scheduling, audience targeting, and SP list binding",
      },
      {
        icon: "\u267F",
        title: "Fully Accessible",
        description: "WCAG 2.1 AA, keyboard navigation, reduced motion, and ARIA landmarks",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_HERO_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can change any of these settings later via the property pane or by clicking Re-run Setup in edit mode.",
};
