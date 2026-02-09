import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IDirectoryWizardState } from "../../models/IHyperDirectoryWizardState";
import {
  DEFAULT_DIRECTORY_WIZARD_STATE,
  getLayoutDisplayName,
  getCardStyleDisplayName,
  getSortFieldDisplayName,
  getPhotoSizeDisplayName,
  getPaginationDisplayName,
  countNewFeatures,
} from "../../models/IHyperDirectoryWizardState";
import type { IHyperDirectoryWebPartProps } from "../../models/IHyperDirectoryWebPartProps";
import LayoutDisplayStep from "./LayoutDisplayStep";
import SearchFilteringStep from "./SearchFilteringStep";
import ProfilePresenceStep from "./ProfilePresenceStep";
import AdvancedFeaturesStep from "./AdvancedFeaturesStep";

// ============================================================
// HyperDirectory Wizard Config
// ============================================================

var steps: Array<IWizardStepDef<IDirectoryWizardState>> = [
  {
    id: "layoutDisplay",
    label: "Layout & Display",
    shortLabel: "Layout",
    helpText: function (state: IDirectoryWizardState): string {
      var layout = getLayoutDisplayName(state.layoutDisplay.layoutMode);
      if (state.layoutDisplay.layoutMode === "rollerDex") {
        return "Using " + layout + " with " + state.layoutDisplay.rollerDexVisibleCards + " visible cards and " + state.layoutDisplay.rollerDexSpeed + "s rotation.";
      }
      return "Using " + layout + " layout with " + getCardStyleDisplayName(state.layoutDisplay.cardStyle) + " card style.";
    },
    component: LayoutDisplayStep,
  },
  {
    id: "searchFiltering",
    label: "Search & Filtering",
    shortLabel: "Search",
    helpText: function (state: IDirectoryWizardState): string {
      var parts: string[] = [];
      if (state.searchFiltering.showSearch) { parts.push("search"); }
      if (state.searchFiltering.showAlphaIndex) { parts.push("A-Z index"); }
      if (state.searchFiltering.showFilters) { parts.push("filters"); }
      if (parts.length === 0) { return "Enable search, A-Z index, or filters to help users find people quickly."; }
      return "People discovery: " + parts.join(", ") + ". Showing " + state.searchFiltering.pageSize + " per page.";
    },
    component: SearchFilteringStep,
  },
  {
    id: "profilePresence",
    label: "Profile & Presence",
    shortLabel: "Profile",
    helpText: function (state: IDirectoryWizardState): string {
      var parts: string[] = [];
      if (state.profilePresence.showPresence) { parts.push("live presence"); }
      if (state.profilePresence.showProfileCard) { parts.push("profile popup"); }
      if (state.profilePresence.showQuickActions) { parts.push("quick actions"); }
      if (parts.length === 0) { return "Configure how profiles are displayed and what actions are available."; }
      return "Profile features: " + parts.join(", ") + " with " + getPhotoSizeDisplayName(state.profilePresence.photoSize) + " photos.";
    },
    component: ProfilePresenceStep,
  },
  {
    id: "advancedFeatures",
    label: "Advanced Features",
    shortLabel: "Advanced",
    helpText: function (state: IDirectoryWizardState): string {
      var count = countNewFeatures(state.profilePresence, state.advancedFeatures);
      if (count === 0) { return "Enable skills search, caching, and other advanced capabilities."; }
      return count + " Hyper feature" + (count === 1 ? "" : "s") + " enabled. These put your directory ahead of any competitor.";
    },
    component: AdvancedFeaturesStep,
  },
];

/** Transform wizard state into web part properties */
function buildResult(state: IDirectoryWizardState): Partial<IHyperDirectoryWebPartProps> {
  return {
    // Layout & Display
    layoutMode: state.layoutDisplay.layoutMode,
    cardStyle: state.layoutDisplay.cardStyle,
    gridColumns: state.layoutDisplay.gridColumns,
    masonryColumns: state.layoutDisplay.masonryColumns,
    sortField: state.layoutDisplay.sortField,
    sortDirection: state.layoutDisplay.sortDirection,
    rollerDexSpeed: state.layoutDisplay.rollerDexSpeed,
    rollerDexVisibleCards: state.layoutDisplay.rollerDexVisibleCards,

    // Search & Filtering
    showSearch: state.searchFiltering.showSearch,
    showAlphaIndex: state.searchFiltering.showAlphaIndex,
    showFilters: state.searchFiltering.showFilters,
    pageSize: state.searchFiltering.pageSize,
    paginationMode: state.searchFiltering.paginationMode,
    enableExport: state.searchFiltering.enableExport,

    // Profile & Presence
    showPresence: state.profilePresence.showPresence,
    presenceRefreshInterval: state.profilePresence.presenceRefreshInterval,
    showProfileCard: state.profilePresence.showProfileCard,
    showQuickActions: state.profilePresence.showQuickActions,
    enableVCardExport: state.profilePresence.enableVCardExport,
    showPhotoPlaceholder: state.profilePresence.showPhotoPlaceholder,
    photoSize: state.profilePresence.photoSize,
    showCompletenessScore: state.profilePresence.showCompletenessScore,
    showPronouns: state.profilePresence.showPronouns,
    showSmartOoo: state.profilePresence.showSmartOoo,
    showQrCode: state.profilePresence.showQrCode,

    // Advanced
    enableSkillsSearch: state.advancedFeatures.enableSkillsSearch,
    useSampleData: state.advancedFeatures.useSampleData,
    cacheEnabled: state.advancedFeatures.cacheEnabled,
    cacheDuration: state.advancedFeatures.cacheDuration,

    // Mark wizard as done
    showWizardOnInit: false,
  };
}

/** Generate summary rows for the review step */
function buildSummary(state: IDirectoryWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Layout
  rows.push({
    label: "Layout",
    value: getLayoutDisplayName(state.layoutDisplay.layoutMode),
    type: "badge",
  });

  rows.push({
    label: "Card Style",
    value: getCardStyleDisplayName(state.layoutDisplay.cardStyle),
    type: "text",
  });

  rows.push({
    label: "Sort",
    value: getSortFieldDisplayName(state.layoutDisplay.sortField) + " (" + state.layoutDisplay.sortDirection + ")",
    type: "text",
  });

  if (state.layoutDisplay.layoutMode === "rollerDex") {
    rows.push({
      label: "RollerDex",
      value: state.layoutDisplay.rollerDexVisibleCards + " cards, " + state.layoutDisplay.rollerDexSpeed + "s rotation",
      type: "mono",
    });
  }

  // Search tools
  var searchOpts: string[] = [];
  if (state.searchFiltering.showSearch) { searchOpts.push("Search"); }
  if (state.searchFiltering.showAlphaIndex) { searchOpts.push("A-Z"); }
  if (state.searchFiltering.showFilters) { searchOpts.push("Filters"); }
  if (state.searchFiltering.enableExport) { searchOpts.push("CSV Export"); }
  rows.push({
    label: "Discovery",
    value: searchOpts.length > 0 ? searchOpts.join(", ") : "None",
    type: "badge",
  });

  rows.push({
    label: "Pagination",
    value: getPaginationDisplayName(state.searchFiltering.paginationMode) + " (" + state.searchFiltering.pageSize + "/page)",
    type: "text",
  });

  // Profile features
  var profileOpts: string[] = [];
  if (state.profilePresence.showPresence) { profileOpts.push("Presence"); }
  if (state.profilePresence.showProfileCard) { profileOpts.push("Profile Card"); }
  if (state.profilePresence.showQuickActions) { profileOpts.push("Quick Actions"); }
  if (state.profilePresence.enableVCardExport) { profileOpts.push("vCard"); }
  rows.push({
    label: "Profile",
    value: profileOpts.length > 0 ? profileOpts.join(", ") : "Basic display only",
    type: "badge",
  });

  rows.push({
    label: "Photo Size",
    value: getPhotoSizeDisplayName(state.profilePresence.photoSize),
    type: "text",
  });

  // New features
  var newOpts: string[] = [];
  if (state.profilePresence.showCompletenessScore) { newOpts.push("Completeness Score"); }
  if (state.profilePresence.showPronouns) { newOpts.push("Pronouns & Details"); }
  if (state.profilePresence.showSmartOoo) { newOpts.push("Smart OOO"); }
  if (state.profilePresence.showQrCode) { newOpts.push("QR Code"); }
  if (state.advancedFeatures.enableSkillsSearch) { newOpts.push("Skills Search"); }
  rows.push({
    label: "Hyper Features",
    value: newOpts.length > 0 ? newOpts.join(", ") : "None",
    type: "badgeGreen",
  });

  // Sample Data
  rows.push({
    label: "Sample Data",
    value: state.advancedFeatures.useSampleData ? "Enabled (12 sample people)" : "Disabled",
    type: state.advancedFeatures.useSampleData ? "badgeGreen" : "text",
  });

  // Performance
  rows.push({
    label: "Caching",
    value: state.advancedFeatures.cacheEnabled
      ? "Enabled (" + state.advancedFeatures.cacheDuration + " min)"
      : "Disabled",
    type: "text",
  });

  return rows;
}

/** Hydrate wizard state from existing web part properties (for re-editing) */
export function buildStateFromProps(props: IHyperDirectoryWebPartProps): IDirectoryWizardState | undefined {
  // If wizard hasn't been configured yet, return undefined (shows welcome screen)
  if (props.showWizardOnInit !== false) {
    return undefined;
  }

  return {
    layoutDisplay: {
      layoutMode: props.layoutMode || "grid",
      cardStyle: props.cardStyle || "standard",
      gridColumns: props.gridColumns || 3,
      masonryColumns: props.masonryColumns || 3,
      sortField: props.sortField || "displayName",
      sortDirection: props.sortDirection || "asc",
      rollerDexSpeed: props.rollerDexSpeed || 5,
      rollerDexVisibleCards: props.rollerDexVisibleCards || 5,
    },
    searchFiltering: {
      showSearch: props.showSearch,
      showAlphaIndex: props.showAlphaIndex,
      showFilters: props.showFilters,
      pageSize: props.pageSize || 20,
      paginationMode: props.paginationMode || "paged",
      enableExport: !!props.enableExport,
    },
    profilePresence: {
      showPresence: props.showPresence,
      presenceRefreshInterval: props.presenceRefreshInterval || 30,
      showProfileCard: props.showProfileCard,
      showQuickActions: props.showQuickActions,
      enableVCardExport: props.enableVCardExport,
      showPhotoPlaceholder: props.showPhotoPlaceholder,
      photoSize: props.photoSize || "medium",
      showCompletenessScore: !!props.showCompletenessScore,
      showPronouns: !!props.showPronouns,
      showSmartOoo: !!props.showSmartOoo,
      showQrCode: !!props.showQrCode,
    },
    advancedFeatures: {
      enableSkillsSearch: !!props.enableSkillsSearch,
      useSampleData: !!props.useSampleData,
      cacheEnabled: props.cacheEnabled,
      cacheDuration: props.cacheDuration || 10,
    },
  };
}

/** Exported wizard configuration */
export var DIRECTORY_WIZARD_CONFIG: IHyperWizardConfig<IDirectoryWizardState, Partial<IHyperDirectoryWebPartProps>> = {
  title: "HyperDirectory Setup Wizard",
  welcome: {
    productName: "Directory",
    tagline: "The ultimate employee directory with 7 stunning layouts, live presence, skills search, and the legendary RollerDex 3D carousel",
    taglineBold: ["ultimate employee directory", "RollerDex 3D carousel", "skills search"],
    features: [
      {
        icon: "\uD83C\uDFA0",
        title: "7 Layouts + RollerDex 3D",
        description: "Grid, list, masonry, org chart, and a jaw-dropping 3D rotating carousel that no competitor has",
      },
      {
        icon: "\uD83D\uDFE2",
        title: "Live Presence & Actions",
        description: "Real-time availability from Graph, one-click email, Teams chat, call, and meeting scheduling",
      },
      {
        icon: "\uD83C\uDF93",
        title: "Skills & Expertise Search",
        description: "Find people by skills, certifications, and expertise \u2014 no other SPFx directory can do this",
      },
      {
        icon: "\uD83D\uDCCA",
        title: "Profile Intelligence",
        description: "Completeness scores, smart OOO status, pronouns, QR codes, and CSV export",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_DIRECTORY_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the Configure button or the property pane.",
};
