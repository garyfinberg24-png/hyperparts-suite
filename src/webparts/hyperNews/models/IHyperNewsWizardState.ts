// ============================================================
// HyperNews — Wizard State Model
// ============================================================

import type { INewsSource } from "./IHyperNewsSource";
import type { LayoutType } from "./IHyperNewsLayout";
import type { DateRangeType } from "./IHyperNewsFilter";

/** Feature toggles for the wizard features step */
export interface IWizardFeatures {
  enableInfiniteScroll: boolean;
  enableQuickRead: boolean;
  enableReactions: boolean;
  enableBookmarks: boolean;
  enableReadTracking: boolean;
  enableScheduling: boolean;
}

/** Display options for the wizard display step */
export interface IWizardDisplayOptions {
  pageSize: number;
  showFeatured: boolean;
  maxFeatured: number;
  showImages: boolean;
  showDescription: boolean;
  showAuthor: boolean;
  showDate: boolean;
  showReadTime: boolean;
}

/** Filter presets for the wizard filters step */
export interface IWizardFilterPresets {
  enableFilters: boolean;
  defaultDateRange: DateRangeType;
  categoryPresets: string;
  authorPresets: string;
}

/** Full wizard state — each step reads/writes a subset of this */
export interface INewsWizardState {
  /** Step 1: Content sources */
  sources: INewsSource[];
  /** Step 2: Layout selection */
  layoutType: LayoutType;
  /** Step 3: Display options */
  displayOptions: IWizardDisplayOptions;
  /** Step 4: Feature toggles */
  features: IWizardFeatures;
  /** Step 5: Filter presets */
  filterPresets: IWizardFilterPresets;
}

/** Default wizard state */
export const DEFAULT_WIZARD_STATE: INewsWizardState = {
  sources: [],
  layoutType: "cardGrid",
  displayOptions: {
    pageSize: 12,
    showFeatured: true,
    maxFeatured: 3,
    showImages: true,
    showDescription: true,
    showAuthor: true,
    showDate: true,
    showReadTime: true,
  },
  features: {
    enableInfiniteScroll: true,
    enableQuickRead: true,
    enableReactions: true,
    enableBookmarks: true,
    enableReadTracking: true,
    enableScheduling: true,
  },
  filterPresets: {
    enableFilters: true,
    defaultDateRange: "all",
    categoryPresets: "",
    authorPresets: "",
  },
};
