// ── Enums and type aliases ──
export type {
  FaqAccordionStyle,
  FaqCategoryIcon,
  FaqLayout,
  FaqSortMode,
  FaqTemplateId,
} from "./IHyperFaqEnums";
export {
  ALL_ACCORDION_STYLES,
  ALL_FAQ_CATEGORY_ICONS,
  ALL_FAQ_LAYOUTS,
  ALL_FAQ_TEMPLATE_IDS,
  ALL_SORT_MODES,
  getAccordionStyleDisplayName,
  getFaqCategoryIconDisplayName,
  getFaqLayoutDisplayName,
  getFaqTemplateDisplayName,
  getSortModeDisplayName,
} from "./IHyperFaqEnums";

// ── FAQ item ──
export type { IFaqItem } from "./IFaqItem";
export { mapListItemToFaq } from "./IFaqItem";

// ── FAQ category grouping ──
export type { IFaqCategoryGroup } from "./IFaqCategory";
export { groupFaqsByCategory } from "./IFaqCategory";

// ── FAQ submission ──
export type { IFaqSubmission } from "./IFaqSubmission";
export { createFaqSubmission } from "./IFaqSubmission";

// ── FAQ templates ──
export type { IFaqTemplate, IFaqTemplateColors } from "./IHyperFaqTemplate";
export { FAQ_TEMPLATES, getFaqTemplateById } from "./IHyperFaqTemplate";

// ── Web part props ──
export type { IHyperFaqWebPartProps } from "./IHyperFaqWebPartProps";

// ── Wizard state ──
export type { IFaqWizardState } from "./IHyperFaqWizardState";
export { DEFAULT_FAQ_WIZARD_STATE } from "./IHyperFaqWizardState";
