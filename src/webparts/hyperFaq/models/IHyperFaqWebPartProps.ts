import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { FaqAccordionStyle, FaqLayout, FaqSortMode, FaqTemplateId } from "./IHyperFaqEnums";

export interface IHyperFaqWebPartProps extends IBaseHyperWebPartProps {
  // ── V1 properties (preserved) ──
  title: string;
  listName: string;
  reviewQueueListName: string;
  accordionStyle: FaqAccordionStyle;
  sortMode: FaqSortMode;
  enableSearch: boolean;
  enableVoting: boolean;
  enableSubmission: boolean;
  enableRelated: boolean;
  enableCategories: boolean;
  maxItems: number;
  cacheDuration: number;
  showViewCount: boolean;
  enableDeepLink: boolean;

  // ── V2 additions ──

  // Layout & Template
  layout: FaqLayout;
  selectedTemplate: FaqTemplateId;

  // Wizard
  wizardCompleted: boolean;
  showWizardOnInit: boolean;

  // Demo mode
  useSampleData: boolean;

  // Features
  enableExpandAll: boolean;
  enableCopyLink: boolean;
  enableContactExpert: boolean;
  enableFeedbackOnDownvote: boolean;
  enableSearchHighlight: boolean;
  enablePinnedFaqs: boolean;
  pinnedFaqIds: string; // comma-separated IDs

  // Category
  categoryIcons: string; // JSON string: Record<string, string>

  // Appearance
  showCategoryCards: boolean;
  showHeroFaq: boolean;
  heroFaqId: number;

  /** Enable demo mode toolbar for previewing layouts/themes */
  enableDemoMode: boolean;
}
