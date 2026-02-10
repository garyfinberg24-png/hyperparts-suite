import type { FaqAccordionStyle, FaqLayout, FaqSortMode, FaqTemplateId } from "./IHyperFaqEnums";

export interface IFaqWizardState {
  // Template
  selectedTemplate: FaqTemplateId;

  // Data source
  dataSource: "list" | "sample";
  listName: string;

  // Layout
  layout: FaqLayout;
  accordionStyle: FaqAccordionStyle;
  enableCategories: boolean;
  showCategoryCards: boolean;

  // Features
  enableSearch: boolean;
  enableVoting: boolean;
  enableRelated: boolean;
  enableSubmission: boolean;
  enableExpandAll: boolean;
  enableCopyLink: boolean;
  enableSearchHighlight: boolean;
  enablePinnedFaqs: boolean;
  showViewCount: boolean;
  enableDeepLink: boolean;
  enableContactExpert: boolean;
  enableFeedbackOnDownvote: boolean;

  // Sort
  sortMode: FaqSortMode;
}

export const DEFAULT_FAQ_WIZARD_STATE: IFaqWizardState = {
  // Template
  selectedTemplate: "corporate-clean",

  // Data source
  dataSource: "sample",
  listName: "FAQs",

  // Layout
  layout: "accordion",
  accordionStyle: "clean",
  enableCategories: true,
  showCategoryCards: true,

  // Features
  enableSearch: true,
  enableVoting: true,
  enableRelated: true,
  enableSubmission: true,
  enableExpandAll: true,
  enableCopyLink: true,
  enableSearchHighlight: true,
  enablePinnedFaqs: false,
  showViewCount: true,
  enableDeepLink: true,
  enableContactExpert: false,
  enableFeedbackOnDownvote: false,

  // Sort
  sortMode: "category",
};
