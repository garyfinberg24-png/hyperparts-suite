import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { FaqAccordionStyle, FaqSortMode } from "./IHyperFaqEnums";

export interface IHyperFaqWebPartProps extends IBaseHyperWebPartProps {
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
}
