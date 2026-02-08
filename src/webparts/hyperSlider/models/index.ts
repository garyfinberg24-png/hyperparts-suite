// ─── HyperSlider Models Barrel ────────────────────────────────────────────────

// Enums & type aliases
export type {
  SliderMode, SliderHeightMode, AspectRatio, TransitionType, LayerType,
  EntranceAnimation, ExitAnimation, LoopAnimation, HoverEffect, EasingType,
  NavArrowStyle, BulletStyle, BulletPosition, ThumbnailPosition, BreakpointKey,
  VideoSource, ShapeType, SlideBackgroundType, GradientType, BeforeAfterOrientation,
  ParticleShape, ParticleDirection, AutoplayDirection, SwipeDirection,
  LayerAnimationState, ReducedMotionPref, SizeUnit, PositionUnit,
  ButtonVariant, IconPosition, VerticalAlign, HorizontalAlign, TransitionDirection,
} from "./IHyperSliderEnums";
export {
  SLIDER_MODE_OPTIONS, HEIGHT_MODE_OPTIONS, ASPECT_RATIO_OPTIONS,
  TRANSITION_TYPE_OPTIONS, EASING_TYPE_OPTIONS, NAV_ARROW_STYLE_OPTIONS,
  BULLET_STYLE_OPTIONS, BULLET_POSITION_OPTIONS, THUMBNAIL_POSITION_OPTIONS,
  PARTICLE_SHAPE_OPTIONS, PARTICLE_DIRECTION_OPTIONS, REDUCED_MOTION_OPTIONS,
  AUTOPLAY_DIRECTION_OPTIONS,
} from "./IHyperSliderEnums";

// Animation
export type {
  ILayerEntranceAnim, ILayerExitAnim, ILayerLoopAnim,
  ILayerHoverEffect, ILayerScrollAnim, ILayerAnimation,
} from "./ISliderAnimation";
export {
  DEFAULT_ENTRANCE, DEFAULT_EXIT, DEFAULT_LOOP,
  DEFAULT_HOVER, DEFAULT_SCROLL, DEFAULT_ANIMATION,
} from "./ISliderAnimation";

// Responsive
export type {
  ILayerVisibility, ILayerBreakpointOverride, ILayerResponsive,
} from "./ISliderResponsive";
export {
  BREAKPOINT_WIDTHS, BREAKPOINT_ORDER,
  DEFAULT_VISIBILITY, DEFAULT_RESPONSIVE,
} from "./ISliderResponsive";

// Transition
export type { ISliderTransition, ISliderKenBurns } from "./ISliderTransition";
export { DEFAULT_TRANSITION, DEFAULT_KEN_BURNS, EASING_CSS_MAP } from "./ISliderTransition";

// Layer
export type {
  ILayerPosition, ILayerSize,
  ITextLayerConfig, IImageLayerConfig, ISliderVideoConfig,
  IButtonLayerConfig, IShapeLayerConfig, IIconLayerConfig,
  ISliderLottieConfig, IGroupLayerConfig, ISliderLayer,
} from "./ISliderLayer";
export {
  DEFAULT_POSITION, DEFAULT_SIZE, DEFAULT_TEXT_CONFIG, DEFAULT_IMAGE_CONFIG,
  DEFAULT_VIDEO_CONFIG, DEFAULT_BUTTON_CONFIG, DEFAULT_SHAPE_CONFIG,
  DEFAULT_ICON_CONFIG, DEFAULT_LOTTIE_CONFIG, DEFAULT_LAYER,
} from "./ISliderLayer";

// Slide
export type {
  ISliderGradientStop, ISliderGradient, ISlideBackgroundParallax,
  ISlideBackground, ISlideTransitionOverride, ISliderSlide,
} from "./ISliderSlide";
export {
  DEFAULT_OVERLAY_GRADIENT, DEFAULT_BACKGROUND, DEFAULT_SLIDE,
} from "./ISliderSlide";

// Navigation
export type {
  ISliderArrowsConfig, ISliderBulletsConfig, ISliderThumbnailsConfig,
  ISliderTabsConfig, ISliderProgressConfig, ISliderCountConfig,
  ISliderSwipeConfig, ISliderNavigation,
} from "./ISliderNavigation";
export {
  DEFAULT_ARROWS, DEFAULT_BULLETS, DEFAULT_THUMBNAILS, DEFAULT_TABS,
  DEFAULT_PROGRESS, DEFAULT_COUNT, DEFAULT_SWIPE, DEFAULT_NAVIGATION,
} from "./ISliderNavigation";

// Particle
export type { ISliderParticle, IParticleInstance } from "./ISliderParticle";
export { DEFAULT_PARTICLE } from "./ISliderParticle";

// Before/After
export type { ISliderBeforeAfter } from "./ISliderBeforeAfter";
export { DEFAULT_BEFORE_AFTER } from "./ISliderBeforeAfter";

// Web Part Props
export type {
  ISliderAutoplay, ISliderFieldMapping, ISliderContentBinding,
  ISliderTransitionConfig, IHyperSliderWebPartProps,
} from "./IHyperSliderWebPartProps";
export {
  DEFAULT_AUTOPLAY, DEFAULT_FIELD_MAPPING, DEFAULT_CONTENT_BINDING,
  DEFAULT_TRANSITION_CONFIG,
} from "./IHyperSliderWebPartProps";
