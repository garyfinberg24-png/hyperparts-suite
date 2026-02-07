/* ── Profile ── */
export type { IHyperProfileUser, IHyperProfileManager } from "./IHyperProfile";

/* ── Presence ── */
export type { IHyperPresence, IHyperPresenceConfig } from "./IHyperProfilePresence";

/* ── Quick Action ── */
export type { IHyperQuickAction, QuickActionType } from "./IHyperProfileQuickAction";

/* ── Template ── */
export type { IHyperTemplate, TemplateType } from "./IHyperProfileTemplate";

/* ── Completeness ── */
export type {
  IProfileCompleteness,
  IFieldScore,
  CompletenessDisplayStyle,
  CompletenessPosition,
} from "./IHyperProfileCompleteness";

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
