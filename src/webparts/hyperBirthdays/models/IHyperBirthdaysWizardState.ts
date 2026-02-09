import type { BirthdaysViewMode, BirthdaysTimeRange, AnimationType, CelebrationType } from "./IHyperBirthdaysEnums";

// ============================================================
// HyperBirthdays Wizard State — Configuration wizard data model
// ============================================================

/** Celebration type toggles (Step 1) */
export interface IWizardCelebrationTypes {
  enableBirthdays: boolean;
  enableAnniversaries: boolean;
  enableWeddings: boolean;
  enableChildBirth: boolean;
  enableGraduation: boolean;
  enableRetirement: boolean;
  enablePromotion: boolean;
  enableCustom: boolean;
}

/** Data source settings (Step 2) */
export interface IWizardDataSources {
  enableEntraId: boolean;
  enableSpList: boolean;
  spListName: string;
}

/** Layout and display settings (Step 3) */
export interface IWizardLayout {
  viewMode: BirthdaysViewMode;
  timeRange: BirthdaysTimeRange;
  maxItems: number;
  photoSize: number;
}

/** Engagement and feature settings (Step 4) */
export interface IWizardEngagement {
  enableTeamsDeepLink: boolean;
  enableAnimations: boolean;
  animationType: AnimationType;
  enableMilestoneBadges: boolean;
  enablePrivacyOptOut: boolean;
  optOutListName: string;
}

/** Complete wizard state */
export interface IBirthdaysWizardState {
  celebrationTypes: IWizardCelebrationTypes;
  dataSources: IWizardDataSources;
  layout: IWizardLayout;
  engagement: IWizardEngagement;
}

/** Default wizard state for fresh configuration */
export var DEFAULT_WIZARD_STATE: IBirthdaysWizardState = {
  celebrationTypes: {
    enableBirthdays: true,
    enableAnniversaries: true,
    enableWeddings: false,
    enableChildBirth: false,
    enableGraduation: false,
    enableRetirement: false,
    enablePromotion: false,
    enableCustom: false,
  },
  dataSources: {
    enableEntraId: true,
    enableSpList: false,
    spListName: "",
  },
  layout: {
    viewMode: "upcomingList",
    timeRange: "thisMonth",
    maxItems: 50,
    photoSize: 48,
  },
  engagement: {
    enableTeamsDeepLink: true,
    enableAnimations: true,
    animationType: "confetti",
    enableMilestoneBadges: true,
    enablePrivacyOptOut: false,
    optOutListName: "",
  },
};

/** Get list of enabled celebration type keys for display */
export function getEnabledTypeNames(types: IWizardCelebrationTypes): string[] {
  var names: string[] = [];
  if (types.enableBirthdays) { names.push("Birthdays"); }
  if (types.enableAnniversaries) { names.push("Anniversaries"); }
  if (types.enableWeddings) { names.push("Weddings"); }
  if (types.enableChildBirth) { names.push("New Babies"); }
  if (types.enableGraduation) { names.push("Graduations"); }
  if (types.enableRetirement) { names.push("Retirements"); }
  if (types.enablePromotion) { names.push("Promotions"); }
  if (types.enableCustom) { names.push("Custom"); }
  return names;
}

/** Count enabled celebration types */
export function countEnabledTypes(types: IWizardCelebrationTypes): number {
  return getEnabledTypeNames(types).length;
}

/** Get list of enabled CelebrationType values */
export function getEnabledCelebrationTypes(types: IWizardCelebrationTypes): CelebrationType[] {
  var result: CelebrationType[] = [];
  if (types.enableBirthdays) { result.push("birthday"); }
  if (types.enableAnniversaries) { result.push("workAnniversary"); }
  if (types.enableWeddings) { result.push("wedding"); }
  if (types.enableChildBirth) { result.push("childBirth"); }
  if (types.enableGraduation) { result.push("graduation"); }
  if (types.enableRetirement) { result.push("retirement"); }
  if (types.enablePromotion) { result.push("promotion"); }
  if (types.enableCustom) { result.push("custom"); }
  return result;
}
