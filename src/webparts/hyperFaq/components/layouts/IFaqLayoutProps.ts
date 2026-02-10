import type { IFaqItem } from "../../models/IFaqItem";
import type { FaqAccordionStyle } from "../../models/IHyperFaqEnums";

export interface IFaqLayoutProps {
  items: IFaqItem[];
  allItems: IFaqItem[]; // for related FAQ lookups
  expandedItemId: number;
  onToggleItem: (id: number) => void;
  accordionStyle: FaqAccordionStyle;
  enableVoting: boolean;
  enableRelated: boolean;
  showViewCount: boolean;
  enableCopyLink: boolean;
  enableContactExpert: boolean;
  enableFeedbackOnDownvote: boolean;
  enableCategories: boolean;
  expandedCategories: Record<string, boolean>;
  onToggleCategory: (name: string) => void;
  votingHook: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vote: (...args: any[]) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasVoted: (...args: any[]) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getVoteDirection: (...args: any[]) => any;
  };
  onRelatedNavigate: (id: number) => void;
  onFirstExpand: (item: IFaqItem) => void;
}
