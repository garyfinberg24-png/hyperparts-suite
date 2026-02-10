/* ── Profile ── */
export type { IHyperProfileUser, IHyperProfileManager } from "./IHyperProfile";

/* ── Presence ── */
export type { IHyperPresence, IHyperPresenceConfig } from "./IHyperProfilePresence";

/* ── Quick Action ── */
export type { IHyperQuickAction, QuickActionType } from "./IHyperProfileQuickAction";

/* ── Template ── */
export type { IHyperTemplate, TemplateType, LegacyTemplateType, ITemplateDefaults } from "./IHyperProfileTemplate";
export { mapLegacyTemplate } from "./IHyperProfileTemplate";

/* ── Completeness ── */
export type {
  IProfileCompleteness,
  IFieldScore,
  CompletenessDisplayStyle,
  CompletenessPosition,
} from "./IHyperProfileCompleteness";

/* ── V2: Skills ── */
export type { IProfileSkill, ISkillCategory, SkillDisplayStyle } from "./IHyperProfileSkill";
export { DEFAULT_SKILL_CATEGORIES } from "./IHyperProfileSkill";

/* ── V2: Badges ── */
export type { IProfileBadge, BadgeType } from "./IHyperProfileBadge";

/* ── V2: Personal ── */
export type {
  IProfilePersonal,
  IFavoriteWebsite,
  ISocialLink,
  IProfileEducation,
} from "./IHyperProfilePersonal";

/* ── V2: Org Node ── */
export type { IProfileOrgNode } from "./IHyperProfileOrgNode";

/* ── V2: Calendar ── */
export type { ICalendarSlot, ICalendarDay, CalendarSlotStatus } from "./IHyperProfileCalendar";

/* ── V2: Animation / Appearance ── */
export type {
  ProfileAnimation,
  ProfileHeaderStyle,
  IHeaderConfig,
  PhotoShape,
  TemplateCategory,
  IAnimationMeta,
  IPhotoShapeMeta,
} from "./IHyperProfileAnimation";
export { ANIMATION_OPTIONS, PHOTO_SHAPE_OPTIONS } from "./IHyperProfileAnimation";

/* ── V2: Demo Config ── */
export type { IDemoProfilePerson, DemoPersonId } from "./IHyperProfileDemoConfig";
export { DEMO_PEOPLE_IDS } from "./IHyperProfileDemoConfig";

/* ── V2: Wizard State ── */
export type {
  IProfileWizardState,
  WizardPath,
  WizardStepId,
  IWizardStep,
} from "./IHyperProfileWizardState";
export {
  DEFAULT_WIZARD_STATE,
  TEMPLATE_PATH_STEPS,
  SCRATCH_PATH_STEPS,
  getWizardSteps,
} from "./IHyperProfileWizardState";

/* ── Web part props ── */
export type {
  IHyperProfileWebPartProps,
  DisplayMode,
  CardStyle,
  ActionsLayout,
  ButtonSize,
  PresencePosition,
  BackgroundType,
  OverlayPosition,
  TextAlignment,
  ShadowStyle,
  PhotoSize,
} from "./IHyperProfileWebPartProps";
