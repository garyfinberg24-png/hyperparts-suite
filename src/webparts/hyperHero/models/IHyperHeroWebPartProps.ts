import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { IHyperHeroTile } from "./IHyperHeroTile";
import type { IHyperHeroResponsiveLayouts } from "./IHyperHeroLayout";
import type { IHyperHeroRotation } from "./IHyperHeroTransition";

/** Field mapping from a SharePoint list to tile properties */
export interface IHyperHeroFieldMapping {
  headingField: string;
  subheadingField?: string;
  descriptionField?: string;
  imageUrlField?: string;
  linkUrlField?: string;
  publishDateField?: string;
  unpublishDateField?: string;
  sortOrderField?: string;
}

/** Dynamic content binding to a SharePoint list */
export interface IHyperHeroContentBinding {
  enabled: boolean;
  listName?: string;
  fieldMapping: IHyperHeroFieldMapping;
  filter?: string;
  orderBy?: string;
  ascending: boolean;
  maxItems: number;
  cacheTTL: number;
}

/** A/B test variation */
export interface IHyperHeroABVariation {
  id: string;
  name: string;
  weight: number;
  tileOverrides: Array<Record<string, unknown>>;
}

/** A/B testing configuration */
export interface IHyperHeroABTestConfig {
  enabled: boolean;
  variations: IHyperHeroABVariation[];
  trackingListName?: string;
}

/** Default content binding configuration */
export const DEFAULT_CONTENT_BINDING: IHyperHeroContentBinding = {
  enabled: false,
  ascending: true,
  maxItems: 10,
  cacheTTL: 300000,
  fieldMapping: { headingField: "Title" },
};

/** Default A/B testing configuration */
export const DEFAULT_AB_TESTING: IHyperHeroABTestConfig = {
  enabled: false,
  variations: [],
};

/** The full HyperHero web part property bag */
export interface IHyperHeroWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  tiles: IHyperHeroTile[];
  layouts: IHyperHeroResponsiveLayouts;
  heroHeight: number;
  rotation: IHyperHeroRotation;
  contentBinding: IHyperHeroContentBinding;
  abTesting: IHyperHeroABTestConfig;
  borderRadius: number;
  fullBleed: boolean;
}
