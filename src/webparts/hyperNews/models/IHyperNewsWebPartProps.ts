import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { LayoutType } from "./IHyperNewsLayout";
import type { INewsSource } from "./IHyperNewsSource";
import type { IFilterConfig } from "./IHyperNewsFilter";

/** The full HyperNews web part property bag */
export interface IHyperNewsWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  layoutType: LayoutType;
  pageSize: number;
  sources: INewsSource[];

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

  /** Filter bar configuration */
  filterConfig: IFilterConfig;

  /** SharePoint list names for social features */
  reactionListName: string;
  bookmarkListName: string;
}
