import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { LayoutType } from "./IHyperNewsLayout";
import type { IFilterConfig } from "./IHyperNewsFilter";

/** The full HyperNews web part property bag */
export interface IHyperNewsWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  layoutType: LayoutType;
  pageSize: number;

  /** Serialized INewsSource[] — all configured content sources */
  sourcesJson: string;
  /** Serialized IExternalArticle[] — external link articles */
  externalArticlesJson: string;
  /** Serialized IExternalArticle[] — manually authored articles */
  manualArticlesJson: string;

  /** Feature toggles */
  enableInfiniteScroll: boolean;
  enableQuickRead: boolean;
  enableReactions: boolean;
  enableBookmarks: boolean;
  enableReadTracking: boolean;
  enableScheduling: boolean;

  /** Featured / pinned articles */
  showFeatured: boolean;
  maxFeatured: number;

  /** Display options */
  showImages: boolean;
  showDescription: boolean;
  showAuthor: boolean;
  showDate: boolean;
  showReadTime: boolean;

  /** Filter bar configuration */
  filterConfig: IFilterConfig;

  /** SharePoint list names for social features */
  reactionListName: string;
  bookmarkListName: string;

  /** Whether to show wizard on first load (true until user completes wizard) */
  showWizardOnInit: boolean;
}
