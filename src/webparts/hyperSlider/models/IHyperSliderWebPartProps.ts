// ─── HyperSlider Web Part Properties ──────────────────────────────────────────
import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type {
  SliderMode, SliderHeightMode, AspectRatio, EasingType,
  TransitionType, AutoplayDirection, ReducedMotionPref,
} from "./IHyperSliderEnums";

/** Autoplay configuration */
export interface ISliderAutoplay {
  enabled: boolean;
  interval: number;
  pauseOnHover: boolean;
  pauseOnInteraction: boolean;
  direction: AutoplayDirection;
  loop: boolean;
}

/** Field mapping from SP list columns to slide properties */
export interface ISliderFieldMapping {
  headingField: string;
  descriptionField: string;
  imageUrlField: string;
  linkUrlField: string;
  publishDateField: string;
  unpublishDateField: string;
  sortOrderField: string;
}

/** Dynamic content binding to SP list */
export interface ISliderContentBinding {
  enabled: boolean;
  listName: string;
  fieldMapping: ISliderFieldMapping;
  filter: string;
  orderBy: string;
  ascending: boolean;
  maxItems: number;
  cacheTTL: number;
}

/** Transition config (stored at web part level) */
export interface ISliderTransitionConfig {
  type: TransitionType;
  duration: number;
  easing: EasingType;
}

/** Full HyperSlider web part property bag */
export interface IHyperSliderWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  mode: SliderMode;
  heightMode: SliderHeightMode;
  fixedHeight: number;
  aspectRatio: AspectRatio;
  customRatioWidth: number;
  customRatioHeight: number;
  fullBleed: boolean;
  borderRadius: number;

  // Slide data (JSON strings)
  slides: string;
  navigation: string;

  // Transition
  transition: ISliderTransitionConfig;

  // Autoplay
  autoplay: ISliderAutoplay;

  // Particle (JSON string)
  particle: string;

  // Before/After (JSON string)
  beforeAfter: string;

  // Dynamic content
  contentBinding: ISliderContentBinding;

  // Responsive overrides
  mobileHeight: number;
  tabletHeight: number;

  // Performance
  lazyLoad: boolean;
  preloadCount: number;

  // Advanced effects
  enableTypewriter: boolean;
  enableReveal: boolean;
  enableSnow: boolean;

  // Accessibility
  reducedMotion: ReducedMotionPref;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_AUTOPLAY: ISliderAutoplay = {
  enabled: true,
  interval: 5000,
  pauseOnHover: true,
  pauseOnInteraction: true,
  direction: "forward",
  loop: true,
};

export const DEFAULT_FIELD_MAPPING: ISliderFieldMapping = {
  headingField: "Title",
  descriptionField: "",
  imageUrlField: "",
  linkUrlField: "",
  publishDateField: "",
  unpublishDateField: "",
  sortOrderField: "",
};

export const DEFAULT_CONTENT_BINDING: ISliderContentBinding = {
  enabled: false,
  listName: "",
  fieldMapping: DEFAULT_FIELD_MAPPING,
  filter: "",
  orderBy: "",
  ascending: true,
  maxItems: 10,
  cacheTTL: 300000,
};

export const DEFAULT_TRANSITION_CONFIG: ISliderTransitionConfig = {
  type: "fade",
  duration: 800,
  easing: "easeInOut",
};
