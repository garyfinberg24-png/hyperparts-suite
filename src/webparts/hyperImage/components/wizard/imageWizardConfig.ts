import * as React from "react";
import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardStepProps,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperImageWebPartProps } from "../../models";

// ============================================================
// HyperImage Wizard Config — State, Steps, Result, Summary
// ============================================================

/** Wizard state — flat shape for simple onChange(partial) merging */
export interface IImageWizardState {
  /** How the image is sourced */
  imageSource: "url" | "upload" | "sample";
  /** Image URL (when imageSource is "url") */
  imageUrl: string;
  /** Alt text for accessibility */
  altText: string;
  /** Whether the image is decorative (hidden from screen readers) */
  isDecorative: boolean;
  /** Shape mask preset */
  shape: string;
  /** CSS filter preset */
  filterPreset: string;
  /** Hover effect preset */
  hoverEffect: string;
  /** Aspect ratio (auto, 1:1, 4:3, 16:9, 21:9) */
  aspectRatio: string;
  /** Object fit (cover, contain, fill, none) */
  objectFit: string;
  /** Open in lightbox on click */
  openLightbox: boolean;
  /** Lazy load the image */
  lazyLoad: boolean;
  /** Entrance animation preset */
  entranceAnimation: string;
}

var DEFAULT_IMAGE_WIZARD_STATE: IImageWizardState = {
  imageSource: "sample",
  imageUrl: "",
  altText: "",
  isDecorative: false,
  shape: "none",
  filterPreset: "none",
  hoverEffect: "none",
  aspectRatio: "auto",
  objectFit: "cover",
  openLightbox: false,
  lazyLoad: true,
  entranceAnimation: "none",
};

// ── Inline placeholder step ──
// Will be replaced with a full step UI later; for now the wizard
// welcome + summary screens are the primary interaction.

var SettingsStep: React.FC<IWizardStepProps<IImageWizardState>> = function (_props) {
  return React.createElement("div", { style: { padding: "16px" } },
    React.createElement("p", undefined,
      "Image settings will be configured in the property pane after setup."
    ),
    React.createElement("p", { style: { color: "#605e5c", fontSize: "13px", marginTop: "8px" } },
      "Use the property pane to set the image URL, alt text, shape mask, filter preset, hover effect, and more."
    )
  );
};

// ── Step definitions ──

var steps: Array<IWizardStepDef<IImageWizardState>> = [
  {
    id: "settings",
    label: "Image Settings",
    shortLabel: "Settings",
    helpText: "Configure the basic image display options. You can fine-tune all settings later in the property pane.",
    component: SettingsStep,
  },
];

// ── Build result ──

function buildResult(state: IImageWizardState): Partial<IHyperImageWebPartProps> {
  return {
    imageUrl: state.imageUrl,
    altText: state.altText,
    isDecorative: state.isDecorative,
    aspectRatio: state.aspectRatio,
    objectFit: state.objectFit,
    openLightbox: state.openLightbox,
    lazyLoad: state.lazyLoad,
  };
}

// ── Build summary ──

function buildSummary(state: IImageWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Image source
  var sourceLabel = "Sample Image";
  if (state.imageSource === "url") {
    sourceLabel = "Custom URL";
  } else if (state.imageSource === "upload") {
    sourceLabel = "Uploaded Image";
  }
  rows.push({ label: "Image Source", value: sourceLabel, type: "badge" });

  // Alt text
  if (state.altText.length > 0) {
    rows.push({ label: "Alt Text", value: state.altText, type: "text" });
  }

  // Decorative
  if (state.isDecorative) {
    rows.push({ label: "Decorative", value: "Yes (hidden from screen readers)", type: "text" });
  }

  // Aspect ratio
  rows.push({ label: "Aspect Ratio", value: state.aspectRatio, type: "text" });

  // Object fit
  rows.push({ label: "Object Fit", value: state.objectFit, type: "text" });

  // Shape
  if (state.shape !== "none") {
    rows.push({ label: "Shape Mask", value: state.shape, type: "badge" });
  }

  // Filter
  if (state.filterPreset !== "none") {
    rows.push({ label: "Filter", value: state.filterPreset, type: "badge" });
  }

  // Hover effect
  if (state.hoverEffect !== "none") {
    rows.push({ label: "Hover Effect", value: state.hoverEffect, type: "badge" });
  }

  // Entrance animation
  if (state.entranceAnimation !== "none") {
    rows.push({ label: "Entrance Animation", value: state.entranceAnimation, type: "badge" });
  }

  // Lightbox
  rows.push({
    label: "Lightbox",
    value: state.openLightbox ? "Enabled" : "Disabled",
    type: state.openLightbox ? "badgeGreen" : "text",
  });

  // Lazy load
  rows.push({
    label: "Lazy Load",
    value: state.lazyLoad ? "Enabled" : "Disabled",
    type: state.lazyLoad ? "badgeGreen" : "text",
  });

  return rows;
}

// ── Build state from existing props (for re-editing) ──

export function buildStateFromProps(props: IHyperImageWebPartProps): IImageWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }

  return {
    imageSource: props.imageUrl ? "url" : "sample",
    imageUrl: props.imageUrl || "",
    altText: props.altText || "",
    isDecorative: props.isDecorative || false,
    shape: props.shape || "none",
    filterPreset: props.filterPreset || "none",
    hoverEffect: props.hoverEffect || "none",
    aspectRatio: props.aspectRatio || "auto",
    objectFit: props.objectFit || "cover",
    openLightbox: props.openLightbox || false,
    lazyLoad: props.lazyLoad !== false,
    entranceAnimation: props.entranceAnimation || "none",
  };
}

// ── Full wizard configuration ──

export var IMAGE_WIZARD_CONFIG: IHyperWizardConfig<IImageWizardState, Partial<IHyperImageWebPartProps>> = {
  title: "HyperImage Setup Wizard",
  welcome: {
    productName: "Image",
    tagline: "A powerful image web part with shapes, filters, hover effects, and lightbox",
    features: [
      {
        icon: "\uD83D\uDDBC\uFE0F",
        title: "Shape Masks",
        description: "Circle, hexagon, diamond, star, and custom clip paths",
      },
      {
        icon: "\uD83C\uDFA8",
        title: "CSS Filters",
        description: "Grayscale, sepia, blur, vintage, and custom filter presets",
      },
      {
        icon: "\u2728",
        title: "Hover Effects",
        description: "Zoom, flip, overlay, parallax, and tilt animations",
      },
      {
        icon: "\u267F",
        title: "Accessible",
        description: "Alt text, decorative marking, reduced motion, and ARIA landmarks",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_IMAGE_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can change any of these settings later via the property pane.",
};
