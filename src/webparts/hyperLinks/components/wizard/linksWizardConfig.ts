import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { ILinksWizardState } from "../../models/IHyperLinksWizardState";
import {
  DEFAULT_LINKS_WIZARD_STATE,
  getLayoutDisplayName,
  getHoverEffectDisplayName,
  getBackgroundModeDisplayName,
  getBorderRadiusDisplayName,
  getIconSizeDisplayName,
  countEnabledFeatures,
} from "../../models/IHyperLinksWizardState";
import type { IHyperLinksWebPartProps } from "../../models/IHyperLinksWebPartProps";
import { getPresetById } from "../../utils/presetStyles";
import { getPresetLinksById } from "../../utils/linkPresets";
import { stringifyLinks, stringifyGroups } from "../../utils/linkParser";
import AddLinksStep from "./AddLinksStep";
import PresetGalleryStep from "./PresetGalleryStep";
import LayoutStyleStep from "./LayoutStyleStep";
import IconsDisplayStep from "./IconsDisplayStep";
import GroupingTargetingStep from "./GroupingTargetingStep";
import FeaturesStep from "./FeaturesStep";

// ============================================================
// HyperLinks Wizard Config
// ============================================================

var steps: Array<IWizardStepDef<ILinksWizardState>> = [
  {
    id: "addLinks",
    label: "Add Your Links",
    shortLabel: "Links",
    helpText: function (state: ILinksWizardState): string {
      if (state.linksData.dataSourceMode === "preset") {
        var preset = getPresetLinksById(state.linksData.selectedPresetId);
        if (preset) {
          return "Using \"" + preset.name + "\" preset with " + preset.links.length + " links. Continue to choose a visual style.";
        }
        return "Select a preset link collection to get started quickly.";
      }
      if (state.linksData.dataSourceMode === "list") {
        return state.linksData.listUrl
          ? "Connecting to list: " + state.linksData.listUrl + ". Continue to configure the visual style."
          : "Enter a SharePoint list name or URL to pull links from.";
      }
      return "You'll add your own links via the property pane after the wizard completes.";
    },
    component: AddLinksStep,
  },
  {
    id: "presetGallery",
    label: "Style Gallery",
    shortLabel: "Gallery",
    helpText: function (state: ILinksWizardState): string {
      if (state.layoutStyle.activePresetId) {
        var preset = getPresetById(state.layoutStyle.activePresetId);
        if (preset) {
          return "Using \"" + preset.name + "\" preset. Continue to Layout & Style to customize further.";
        }
      }
      return "Pick a preset style to instantly theme your links, or choose Custom to configure everything yourself.";
    },
    component: PresetGalleryStep,
  },
  {
    id: "layoutStyle",
    label: "Layout & Style",
    shortLabel: "Layout",
    helpText: "Choose your layout, hover effects, background, and visual style. 10 hover effects and 4 background modes available.",
    component: LayoutStyleStep,
  },
  {
    id: "iconsDisplay",
    label: "Icons & Display",
    shortLabel: "Display",
    helpText: function (state: ILinksWizardState): string {
      var parts: string[] = [];
      if (state.iconsDisplay.showIcons) { parts.push("icons"); }
      if (state.iconsDisplay.showDescriptions) { parts.push("descriptions"); }
      if (state.iconsDisplay.showThumbnails) { parts.push("thumbnails"); }
      if (parts.length === 0) { return "Enable icons, descriptions, or thumbnails to enrich your links."; }
      return "Showing " + parts.join(", ") + " on each link. Adjust display options to match your content.";
    },
    component: IconsDisplayStep,
  },
  {
    id: "groupingTargeting",
    label: "Grouping & Targeting",
    shortLabel: "Groups",
    helpText: function (state: ILinksWizardState): string {
      if (state.groupingTargeting.enableGrouping && state.groupingTargeting.enableAudienceTargeting) {
        return "Links are grouped and audience-targeted. Different users will see different links in organized sections.";
      }
      if (state.groupingTargeting.enableGrouping) {
        return "Links are organized into collapsible groups. Assign group names per link in the property pane.";
      }
      if (state.groupingTargeting.enableAudienceTargeting) {
        return "Audience targeting is active. Links can be shown to specific Azure AD groups.";
      }
      return "Enable grouping to organize links into sections, or audience targeting for personalized views.";
    },
    component: GroupingTargetingStep,
  },
  {
    id: "features",
    label: "Advanced Features",
    shortLabel: "Features",
    helpText: function (state: ILinksWizardState): string {
      var count = countEnabledFeatures(state.features);
      if (count === 0) { return "Enable optional features like analytics, health monitoring, and popular badges."; }
      return count + " feature" + (count === 1 ? "" : "s") + " enabled. These features enhance link management and user experience.";
    },
    component: FeaturesStep,
  },
];

/** Transform wizard state into web part properties */
function buildResult(state: ILinksWizardState): Partial<IHyperLinksWebPartProps> {
  var result: Partial<IHyperLinksWebPartProps> = {
    // Layout & style
    layoutMode: state.layoutStyle.layoutMode,
    hoverEffect: state.layoutStyle.hoverEffect,
    borderRadius: state.layoutStyle.borderRadius,
    tileSize: state.layoutStyle.tileSize,
    gridColumns: state.layoutStyle.gridColumns,
    compactAlignment: state.layoutStyle.compactAlignment,

    // Background
    backgroundMode: state.layoutStyle.backgroundMode,
    backgroundColor: state.layoutStyle.backgroundColor,
    backgroundGradient: state.layoutStyle.backgroundGradient,
    backgroundImageUrl: state.layoutStyle.backgroundImageUrl,
    backgroundImageDarken: state.layoutStyle.backgroundImageDarken,
    textColor: state.layoutStyle.textColor,
    iconColor: state.layoutStyle.iconColor,
    activePresetId: state.layoutStyle.activePresetId,

    // Icons & display
    showIcons: state.iconsDisplay.showIcons,
    iconSize: state.iconsDisplay.iconSize,
    showDescriptions: state.iconsDisplay.showDescriptions,
    showThumbnails: state.iconsDisplay.showThumbnails,
    enableColorCustomization: state.iconsDisplay.enableColorCustomization,

    // Grouping & targeting
    enableGrouping: state.groupingTargeting.enableGrouping,
    enableAudienceTargeting: state.groupingTargeting.enableAudienceTargeting,
    enableSearch: state.groupingTargeting.enableSearch,

    // Features
    enableAnalytics: state.features.enableAnalytics,
    enableHealthCheck: state.features.enableHealthCheck,
    enablePopularBadges: state.features.enablePopularBadges,

    // Demo mode / sample data
    useSampleData: state.linksData.useSampleData,

    // Mark wizard as done
    showWizardOnInit: false,
  };

  // If preset mode selected, populate links and groups from preset
  if (state.linksData.dataSourceMode === "preset" && state.linksData.selectedPresetId) {
    var preset = getPresetLinksById(state.linksData.selectedPresetId);
    if (preset) {
      result.links = stringifyLinks(preset.links);
      if (preset.groups) {
        result.groups = stringifyGroups(preset.groups);
        // Auto-enable grouping when preset has groups
        result.enableGrouping = true;
      }
      // Store selected preset for reference
      result.linkPresetId = state.linksData.selectedPresetId;
    }
  }

  // If list mode, store list config
  if (state.linksData.dataSourceMode === "list") {
    result.linkListUrl = state.linksData.listUrl;
    result.linkListTitleColumn = state.linksData.listTitleColumn;
    result.linkListUrlColumn = state.linksData.listUrlColumn;
  }

  // Store data source mode
  result.linkDataSource = state.linksData.dataSourceMode;

  return result;
}

/** Generate summary rows for the review step */
function buildSummary(state: ILinksWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Link source
  if (state.linksData.dataSourceMode === "preset") {
    var linkPreset = getPresetLinksById(state.linksData.selectedPresetId);
    rows.push({
      label: "Link Source",
      value: linkPreset ? linkPreset.name + " (" + linkPreset.links.length + " links)" : "Preset",
      type: "badgeGreen",
    });
  } else if (state.linksData.dataSourceMode === "list") {
    rows.push({
      label: "Link Source",
      value: "SharePoint List: " + (state.linksData.listUrl || "(not set)"),
      type: "badge",
    });
  } else {
    rows.push({
      label: "Link Source",
      value: "Manual (property pane)",
      type: "text",
    });
  }

  // Demo mode
  if (state.linksData.useSampleData) {
    rows.push({
      label: "Demo Mode",
      value: "Enabled",
      type: "badgeGreen",
    });
  }

  // Preset style
  if (state.layoutStyle.activePresetId) {
    var stylePreset = getPresetById(state.layoutStyle.activePresetId);
    rows.push({
      label: "Preset Style",
      value: stylePreset ? stylePreset.name : state.layoutStyle.activePresetId,
      type: "badgeGreen",
    });
  }

  // Layout
  rows.push({
    label: "Layout",
    value: getLayoutDisplayName(state.layoutStyle.layoutMode),
    type: "badge",
  });

  rows.push({
    label: "Hover Effect",
    value: getHoverEffectDisplayName(state.layoutStyle.hoverEffect),
    type: "text",
  });

  rows.push({
    label: "Corner Style",
    value: getBorderRadiusDisplayName(state.layoutStyle.borderRadius),
    type: "text",
  });

  // Background
  if (state.layoutStyle.backgroundMode !== "none") {
    rows.push({
      label: "Background",
      value: getBackgroundModeDisplayName(state.layoutStyle.backgroundMode),
      type: "badge",
    });
  }

  // Color overrides
  if (state.layoutStyle.textColor || state.layoutStyle.iconColor) {
    var colorParts: string[] = [];
    if (state.layoutStyle.textColor) { colorParts.push("Text: " + state.layoutStyle.textColor); }
    if (state.layoutStyle.iconColor) { colorParts.push("Icon: " + state.layoutStyle.iconColor); }
    rows.push({
      label: "Color Overrides",
      value: colorParts.join(", "),
      type: "text",
    });
  }

  // Show columns for grid-based layouts
  if (["grid", "tiles", "card", "iconGrid"].indexOf(state.layoutStyle.layoutMode) !== -1) {
    rows.push({
      label: "Grid Columns",
      value: String(state.layoutStyle.gridColumns),
      type: "text",
    });
  }

  // Display
  var displayOpts: string[] = [];
  if (state.iconsDisplay.showIcons) { displayOpts.push("Icons (" + getIconSizeDisplayName(state.iconsDisplay.iconSize) + ")"); }
  if (state.iconsDisplay.showDescriptions) { displayOpts.push("Descriptions"); }
  if (state.iconsDisplay.showThumbnails) { displayOpts.push("Thumbnails"); }
  if (state.iconsDisplay.enableColorCustomization) { displayOpts.push("Colors"); }
  rows.push({
    label: "Display Options",
    value: displayOpts.length > 0 ? displayOpts.join(", ") : "Minimal (title only)",
    type: "badge",
  });

  // Grouping & targeting
  var orgOpts: string[] = [];
  if (state.groupingTargeting.enableGrouping) { orgOpts.push("Grouping"); }
  if (state.groupingTargeting.enableAudienceTargeting) { orgOpts.push("Audience Targeting"); }
  if (state.groupingTargeting.enableSearch) { orgOpts.push("Search"); }
  rows.push({
    label: "Organization",
    value: orgOpts.length > 0 ? orgOpts.join(", ") : "None",
    type: "badge",
  });

  // Features
  var featureOpts: string[] = [];
  if (state.features.enableAnalytics) { featureOpts.push("Analytics"); }
  if (state.features.enableHealthCheck) { featureOpts.push("Health Monitoring"); }
  if (state.features.enablePopularBadges) { featureOpts.push("Popular Badges"); }
  rows.push({
    label: "Features",
    value: featureOpts.length > 0 ? featureOpts.join(", ") : "None",
    type: "badgeGreen",
  });

  return rows;
}

/** Hydrate wizard state from existing web part properties (for re-editing) */
export function buildStateFromProps(props: IHyperLinksWebPartProps): ILinksWizardState | undefined {
  // If wizard hasn't been configured yet, return undefined (shows welcome screen)
  if (props.showWizardOnInit !== false) {
    return undefined;
  }

  return {
    linksData: {
      dataSourceMode: props.linkDataSource || "inline",
      selectedPresetId: props.linkPresetId || "",
      listUrl: props.linkListUrl || "",
      listTitleColumn: props.linkListTitleColumn || "Title",
      listUrlColumn: props.linkListUrlColumn || "URL",
      useSampleData: !!props.useSampleData,
    },
    layoutStyle: {
      layoutMode: props.layoutMode || "grid",
      hoverEffect: props.hoverEffect || "lift",
      borderRadius: props.borderRadius || "medium",
      tileSize: props.tileSize || "medium",
      gridColumns: props.gridColumns || 4,
      compactAlignment: props.compactAlignment || "left",
      backgroundMode: props.backgroundMode || "none",
      backgroundColor: props.backgroundColor || "",
      backgroundGradient: props.backgroundGradient || "",
      backgroundImageUrl: props.backgroundImageUrl || "",
      backgroundImageDarken: !!props.backgroundImageDarken,
      textColor: props.textColor || "",
      iconColor: props.iconColor || "",
      activePresetId: props.activePresetId || "",
    },
    iconsDisplay: {
      showIcons: props.showIcons,
      iconSize: props.iconSize || "medium",
      showDescriptions: props.showDescriptions,
      showThumbnails: props.showThumbnails,
      enableColorCustomization: props.enableColorCustomization,
    },
    groupingTargeting: {
      enableGrouping: props.enableGrouping,
      enableAudienceTargeting: props.enableAudienceTargeting,
      enableSearch: !!props.enableSearch,
    },
    features: {
      enableAnalytics: props.enableAnalytics,
      enableHealthCheck: !!props.enableHealthCheck,
      enablePopularBadges: !!props.enablePopularBadges,
    },
  };
}

/** Exported wizard configuration */
export var LINKS_WIZARD_CONFIG: IHyperWizardConfig<ILinksWizardState, Partial<IHyperLinksWebPartProps>> = {
  title: "HyperLinks Setup Wizard",
  welcome: {
    productName: "Links",
    tagline: "A supercharged quick links experience with stunning layouts, smart grouping, and built-in analytics",
    taglineBold: ["supercharged", "stunning layouts", "built-in analytics"],
    features: [
      {
        icon: "\uD83D\uDCE6",
        title: "7 Preset Collections",
        description: "M365 Apps, Departments, Intranet Nav, Social Media, HR Resources, and more. One-click link sets.",
      },
      {
        icon: "\uD83C\uDFA8",
        title: "12 Visual Styles",
        description: "Ocean Breeze, Dark Mode, Neon Pop, Corporate Blue, and more. One-click themes for your links.",
      },
      {
        icon: "\uD83C\uDFAF",
        title: "Smart Targeting",
        description: "Show different links to different audiences using Azure AD group membership",
      },
      {
        icon: "\uD83C\uDFAD",
        title: "Demo Mode",
        description: "Showcase the web part with sample data without entering edit mode. Perfect for demos and presentations.",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_LINKS_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the Configure button in the toolbar.",
};
