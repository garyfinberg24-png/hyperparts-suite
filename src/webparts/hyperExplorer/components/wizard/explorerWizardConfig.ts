import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IExplorerWizardState } from "../../models/IHyperExplorerWizardState";
import {
  DEFAULT_EXPLORER_WIZARD_STATE,
  getViewModeDisplayName,
  getSortModeDisplayName,
  getPreviewModeDisplayName,
} from "../../models/IHyperExplorerWizardState";
import type { IHyperExplorerWebPartProps } from "../../models/IHyperExplorerWebPartProps";
import LayoutDisplayStep from "./LayoutDisplayStep";
import PreviewFeaturesStep from "./PreviewFeaturesStep";
import AdvancedStep from "./AdvancedStep";

// ============================================================
// HyperExplorer Wizard Config
// ============================================================

var steps: Array<IWizardStepDef<IExplorerWizardState>> = [
  {
    id: "layoutDisplay",
    label: "Layout & Display",
    shortLabel: "Layout",
    helpText: function (state: IExplorerWizardState): string {
      return "Using " + getViewModeDisplayName(state.layoutDisplay.viewMode) +
        " layout, sorted by " + getSortModeDisplayName(state.layoutDisplay.sortMode) +
        " (" + state.layoutDisplay.sortDirection + "), " +
        state.layoutDisplay.itemsPerPage + " items per page.";
    },
    component: LayoutDisplayStep,
  },
  {
    id: "previewFeatures",
    label: "Preview & Features",
    shortLabel: "Preview",
    helpText: function (state: IExplorerWizardState): string {
      var parts: string[] = [];
      if (state.previewFeatures.enablePreview) {
        parts.push(getPreviewModeDisplayName(state.previewFeatures.previewMode) + " preview");
      }
      if (state.previewFeatures.enableLightbox) { parts.push("lightbox"); }
      if (state.previewFeatures.enableVideoPlaylist) { parts.push("video playlist"); }
      if (state.previewFeatures.enableUpload) { parts.push("upload"); }
      if (state.previewFeatures.enableQuickActions) { parts.push("quick actions"); }
      if (parts.length === 0) { return "Configure preview, upload, and interaction features."; }
      return "Enabled: " + parts.join(", ") + ".";
    },
    component: PreviewFeaturesStep,
  },
  {
    id: "advanced",
    label: "Advanced Settings",
    shortLabel: "Advanced",
    helpText: function (state: IExplorerWizardState): string {
      var count = 0;
      if (state.advanced.enableFolderTree) { count++; }
      if (state.advanced.enableBreadcrumbs) { count++; }
      if (state.advanced.enableCompare) { count++; }
      if (state.advanced.enableWatermark) { count++; }
      if (state.advanced.enableRecentFiles) { count++; }
      if (state.advanced.enableFilePlan) { count++; }
      if (count === 0) { return "Enable navigation, compliance, and caching features."; }
      return count + " advanced feature" + (count === 1 ? "" : "s") + " enabled" +
        (state.advanced.cacheEnabled ? ", caching on (" + state.advanced.cacheDuration + "s)" : "") + ".";
    },
    component: AdvancedStep,
  },
];

/** Transform wizard state into web part properties */
function buildResult(state: IExplorerWizardState): Partial<IHyperExplorerWebPartProps> {
  return {
    // Layout & Display
    viewMode: state.layoutDisplay.viewMode,
    sortMode: state.layoutDisplay.sortMode,
    sortDirection: state.layoutDisplay.sortDirection,
    itemsPerPage: state.layoutDisplay.itemsPerPage,
    showFolders: state.layoutDisplay.showFolders,

    // Preview & Features
    enablePreview: state.previewFeatures.enablePreview,
    previewMode: state.previewFeatures.previewMode,
    enableLightbox: state.previewFeatures.enableLightbox,
    enableVideoPlaylist: state.previewFeatures.enableVideoPlaylist,
    showThumbnails: state.previewFeatures.showThumbnails,
    thumbnailSize: state.previewFeatures.thumbnailSize,
    enableUpload: state.previewFeatures.enableUpload,
    enableQuickActions: state.previewFeatures.enableQuickActions,

    // Advanced
    enableFolderTree: state.advanced.enableFolderTree,
    enableBreadcrumbs: state.advanced.enableBreadcrumbs,
    enableCompare: state.advanced.enableCompare,
    enableWatermark: state.advanced.enableWatermark,
    enableRecentFiles: state.advanced.enableRecentFiles,
    enableFilePlan: state.advanced.enableFilePlan,
    useSampleData: state.advanced.useSampleData,
    cacheEnabled: state.advanced.cacheEnabled,
    cacheDuration: state.advanced.cacheDuration,

    // Mark wizard as done
    wizardCompleted: true,
  };
}

/** Generate summary rows for the review step */
function buildSummary(state: IExplorerWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Layout
  rows.push({
    label: "View Mode",
    value: getViewModeDisplayName(state.layoutDisplay.viewMode),
    type: "badge",
  });

  rows.push({
    label: "Sort",
    value: getSortModeDisplayName(state.layoutDisplay.sortMode) + " (" + state.layoutDisplay.sortDirection + ")",
    type: "text",
  });

  rows.push({
    label: "Items Per Page",
    value: String(state.layoutDisplay.itemsPerPage),
    type: "mono",
  });

  // Preview features
  var previewOpts: string[] = [];
  if (state.previewFeatures.enablePreview) {
    previewOpts.push(getPreviewModeDisplayName(state.previewFeatures.previewMode) + " Preview");
  }
  if (state.previewFeatures.enableLightbox) { previewOpts.push("Lightbox"); }
  if (state.previewFeatures.enableVideoPlaylist) { previewOpts.push("Video Playlist"); }
  rows.push({
    label: "Preview",
    value: previewOpts.length > 0 ? previewOpts.join(", ") : "Disabled",
    type: "badge",
  });

  // Interaction features
  var interactionOpts: string[] = [];
  if (state.previewFeatures.enableUpload) { interactionOpts.push("Upload"); }
  if (state.previewFeatures.enableQuickActions) { interactionOpts.push("Quick Actions"); }
  if (state.previewFeatures.showThumbnails) { interactionOpts.push("Thumbnails"); }
  rows.push({
    label: "Interactions",
    value: interactionOpts.length > 0 ? interactionOpts.join(", ") : "None",
    type: "badge",
  });

  // Navigation
  var navOpts: string[] = [];
  if (state.advanced.enableFolderTree) { navOpts.push("Folder Tree"); }
  if (state.advanced.enableBreadcrumbs) { navOpts.push("Breadcrumbs"); }
  rows.push({
    label: "Navigation",
    value: navOpts.length > 0 ? navOpts.join(", ") : "None",
    type: "text",
  });

  // Advanced features
  var advancedOpts: string[] = [];
  if (state.advanced.enableCompare) { advancedOpts.push("Compare View"); }
  if (state.advanced.enableWatermark) { advancedOpts.push("Watermark"); }
  if (state.advanced.enableRecentFiles) { advancedOpts.push("Recent Files"); }
  if (state.advanced.enableFilePlan) { advancedOpts.push("File Plan"); }
  rows.push({
    label: "Advanced",
    value: advancedOpts.length > 0 ? advancedOpts.join(", ") : "None",
    type: "badgeGreen",
  });

  // Sample Data
  rows.push({
    label: "Sample Data",
    value: state.advanced.useSampleData ? "Enabled (15 sample files)" : "Disabled",
    type: state.advanced.useSampleData ? "badgeGreen" : "text",
  });

  // Cache
  rows.push({
    label: "Caching",
    value: state.advanced.cacheEnabled
      ? "Enabled (" + state.advanced.cacheDuration + "s)"
      : "Disabled",
    type: "text",
  });

  return rows;
}

/** Hydrate wizard state from existing web part properties (for re-editing) */
export function buildStateFromProps(props: IHyperExplorerWebPartProps): IExplorerWizardState | undefined {
  // If wizard hasn't been configured yet, return undefined (shows welcome screen)
  if (props.wizardCompleted !== true) {
    return undefined;
  }

  return {
    layoutDisplay: {
      viewMode: props.viewMode || "grid",
      sortMode: props.sortMode || "modified",
      sortDirection: props.sortDirection || "desc",
      itemsPerPage: props.itemsPerPage || 30,
      showFolders: props.showFolders !== false,
    },
    previewFeatures: {
      enablePreview: props.enablePreview !== false,
      previewMode: props.previewMode || "tab",
      enableLightbox: props.enableLightbox !== false,
      enableVideoPlaylist: !!props.enableVideoPlaylist,
      showThumbnails: props.showThumbnails !== false,
      thumbnailSize: props.thumbnailSize || 200,
      enableUpload: !!props.enableUpload,
      enableQuickActions: props.enableQuickActions !== false,
    },
    advanced: {
      enableFolderTree: props.enableFolderTree !== false,
      enableBreadcrumbs: props.enableBreadcrumbs !== false,
      enableCompare: !!props.enableCompare,
      enableWatermark: !!props.enableWatermark,
      enableRecentFiles: !!props.enableRecentFiles,
      enableFilePlan: !!props.enableFilePlan,
      useSampleData: !!props.useSampleData,
      cacheEnabled: props.cacheEnabled !== false,
      cacheDuration: props.cacheDuration || 300,
    },
  };
}

/** Exported wizard configuration */
export var EXPLORER_WIZARD_CONFIG: IHyperWizardConfig<IExplorerWizardState, Partial<IHyperExplorerWebPartProps>> = {
  title: "HyperExplorer Setup Wizard",
  welcome: {
    productName: "Explorer",
    tagline: "The ultimate file explorer with 5 stunning layouts, lightbox viewer, video playlists, File Plan compliance, and drag-drop uploads",
    taglineBold: ["ultimate file explorer", "lightbox viewer", "File Plan compliance"],
    features: [
      {
        icon: "\uD83D\uDCC2",
        title: "5 Layouts + Lightbox",
        description: "Grid, masonry, list, filmstrip, and tiles views with fullscreen lightbox, zoom, pan, and slideshow",
      },
      {
        icon: "\uD83C\uDFA5",
        title: "Video Playlists & Preview",
        description: "Built-in video player with playlists, auto-advance, and support for MP4, YouTube, Vimeo, and Stream",
      },
      {
        icon: "\uD83D\uDDC2\uFE0F",
        title: "File Plan & Compliance",
        description: "Microsoft Purview retention labels, compliance badges, and records management integration",
      },
      {
        icon: "\u2B06\uFE0F",
        title: "Smart Upload & Actions",
        description: "Drag-drop upload with metadata profiles, naming conventions, compare view, watermarks, and keyboard shortcuts",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_EXPLORER_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the Configure button or the property pane.",
};
