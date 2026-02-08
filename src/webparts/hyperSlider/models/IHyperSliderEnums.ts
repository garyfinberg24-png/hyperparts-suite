// ─── HyperSlider Enums & Type Aliases ─────────────────────────────────────────

/** Slider display mode */
export type SliderMode = "slider" | "carousel" | "hero" | "beforeAfter";

/** Height calculation mode */
export type SliderHeightMode = "fixed" | "auto" | "fullscreen" | "ratio";

/** Aspect ratio presets */
export type AspectRatio = "16:9" | "4:3" | "21:9" | "1:1" | "custom";

/** Slide transition effects */
export type TransitionType =
  | "fade" | "slideHorizontal" | "slideVertical"
  | "zoom" | "zoomOut" | "rotate"
  | "cube3D" | "flip3D" | "coverflow3D"
  | "kenBurns" | "wipe" | "curtain" | "blinds"
  | "crossFade" | "none";

/** Layer content types */
export type LayerType = "text" | "image" | "video" | "button" | "shape" | "icon" | "lottie" | "group";

/** Entrance animation types */
export type EntranceAnimation =
  | "fade" | "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight"
  | "zoomIn" | "zoomOut" | "rotateIn" | "bounceIn" | "elasticIn"
  | "slideUp" | "slideDown" | "slideLeft" | "slideRight"
  | "typewriter" | "none";

/** Exit animation types */
export type ExitAnimation =
  | "fadeOut" | "fadeOutUp" | "fadeOutDown" | "fadeOutLeft" | "fadeOutRight"
  | "zoomOutExit" | "zoomInExit" | "rotateOut" | "bounceOut" | "elasticOut"
  | "slideOutUp" | "slideOutDown" | "slideOutLeft" | "slideOutRight"
  | "typewriterOut" | "none";

/** Loop animation types */
export type LoopAnimation = "pulse" | "pendulum" | "wave" | "wiggle" | "rotate" | "float" | "blink" | "none";

/** Hover effect types */
export type HoverEffect = "scale" | "rotate" | "brightness" | "blur" | "shadow" | "lift" | "none";

/** CSS easing presets */
export type EasingType =
  | "linear" | "ease" | "easeIn" | "easeOut" | "easeInOut"
  | "easeInBack" | "easeOutBack" | "easeInOutBack"
  | "easeInElastic" | "easeOutElastic" | "easeInOutElastic"
  | "easeInBounce" | "easeOutBounce";

/** Navigation arrow styles */
export type NavArrowStyle = "minimal" | "rounded" | "square" | "circle";

/** Navigation bullet styles */
export type BulletStyle = "solid" | "ring" | "dash" | "numbered";

/** Bullet position */
export type BulletPosition = "bottom" | "top" | "left" | "right";

/** Thumbnail strip position */
export type ThumbnailPosition = "bottom" | "left" | "right";

/** Responsive breakpoint keys */
export type BreakpointKey = "mobile" | "tablet" | "desktop" | "widescreen";

/** Video source types */
export type VideoSource = "mp4" | "youtube" | "vimeo" | "stream";

/** Shape types for shape layer */
export type ShapeType = "rectangle" | "circle" | "line" | "triangle" | "custom";

/** Slide background types */
export type SlideBackgroundType = "image" | "video" | "lottie" | "gradient" | "solidColor";

/** Gradient types */
export type GradientType = "linear" | "radial" | "conic";

/** Before/After orientation */
export type BeforeAfterOrientation = "horizontal" | "vertical";

/** Particle shape types */
export type ParticleShape = "circle" | "square" | "triangle" | "star" | "snow";

/** Particle direction */
export type ParticleDirection = "up" | "down" | "left" | "right" | "random";

/** Autoplay direction */
export type AutoplayDirection = "forward" | "reverse";

/** Swipe direction */
export type SwipeDirection = "horizontal" | "vertical" | "both";

/** Layer animation state */
export type LayerAnimationState = "idle" | "entering" | "visible" | "exiting" | "hidden";

/** Reduced motion preference */
export type ReducedMotionPref = "respect" | "ignore";

/** Size unit types */
export type SizeUnit = "px" | "%" | "auto";

/** Position unit types */
export type PositionUnit = "px" | "%";

/** Button variant types */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "custom";

/** Icon position relative to label */
export type IconPosition = "before" | "after";

/** Vertical alignment */
export type VerticalAlign = "top" | "center" | "bottom";

/** Horizontal alignment */
export type HorizontalAlign = "left" | "center" | "right";

/** Transition direction for internal tracking */
export type TransitionDirection = "forward" | "reverse";

// ─── Dropdown option arrays (for property pane) ──────────────────────────────

export const SLIDER_MODE_OPTIONS: Array<{ key: SliderMode; text: string }> = [
  { key: "slider", text: "Slider" },
  { key: "carousel", text: "Carousel" },
  { key: "hero", text: "Hero Scene" },
  { key: "beforeAfter", text: "Before / After" },
];

export const HEIGHT_MODE_OPTIONS: Array<{ key: SliderHeightMode; text: string }> = [
  { key: "fixed", text: "Fixed Height" },
  { key: "auto", text: "Auto" },
  { key: "fullscreen", text: "Fullscreen" },
  { key: "ratio", text: "Aspect Ratio" },
];

export const ASPECT_RATIO_OPTIONS: Array<{ key: AspectRatio; text: string }> = [
  { key: "16:9", text: "16:9 (Widescreen)" },
  { key: "4:3", text: "4:3 (Standard)" },
  { key: "21:9", text: "21:9 (Ultra-wide)" },
  { key: "1:1", text: "1:1 (Square)" },
  { key: "custom", text: "Custom" },
];

export const TRANSITION_TYPE_OPTIONS: Array<{ key: TransitionType; text: string }> = [
  { key: "fade", text: "Fade" },
  { key: "slideHorizontal", text: "Slide Horizontal" },
  { key: "slideVertical", text: "Slide Vertical" },
  { key: "zoom", text: "Zoom In" },
  { key: "zoomOut", text: "Zoom Out" },
  { key: "rotate", text: "Rotate" },
  { key: "cube3D", text: "3D Cube" },
  { key: "flip3D", text: "3D Flip" },
  { key: "coverflow3D", text: "3D Coverflow" },
  { key: "kenBurns", text: "Ken Burns" },
  { key: "wipe", text: "Wipe" },
  { key: "curtain", text: "Curtain" },
  { key: "blinds", text: "Blinds" },
  { key: "crossFade", text: "Cross Fade" },
  { key: "none", text: "None (Instant)" },
];

export const EASING_TYPE_OPTIONS: Array<{ key: EasingType; text: string }> = [
  { key: "linear", text: "Linear" },
  { key: "ease", text: "Ease" },
  { key: "easeIn", text: "Ease In" },
  { key: "easeOut", text: "Ease Out" },
  { key: "easeInOut", text: "Ease In/Out" },
  { key: "easeInBack", text: "Ease In Back" },
  { key: "easeOutBack", text: "Ease Out Back" },
  { key: "easeInOutBack", text: "Ease In/Out Back" },
  { key: "easeInElastic", text: "Ease In Elastic" },
  { key: "easeOutElastic", text: "Ease Out Elastic" },
  { key: "easeInOutElastic", text: "Ease In/Out Elastic" },
  { key: "easeInBounce", text: "Ease In Bounce" },
  { key: "easeOutBounce", text: "Ease Out Bounce" },
];

export const NAV_ARROW_STYLE_OPTIONS: Array<{ key: NavArrowStyle; text: string }> = [
  { key: "minimal", text: "Minimal" },
  { key: "rounded", text: "Rounded" },
  { key: "square", text: "Square" },
  { key: "circle", text: "Circle" },
];

export const BULLET_STYLE_OPTIONS: Array<{ key: BulletStyle; text: string }> = [
  { key: "solid", text: "Solid" },
  { key: "ring", text: "Ring" },
  { key: "dash", text: "Dash" },
  { key: "numbered", text: "Numbered" },
];

export const BULLET_POSITION_OPTIONS: Array<{ key: BulletPosition; text: string }> = [
  { key: "bottom", text: "Bottom" },
  { key: "top", text: "Top" },
  { key: "left", text: "Left" },
  { key: "right", text: "Right" },
];

export const THUMBNAIL_POSITION_OPTIONS: Array<{ key: ThumbnailPosition; text: string }> = [
  { key: "bottom", text: "Bottom" },
  { key: "left", text: "Left" },
  { key: "right", text: "Right" },
];

export const PARTICLE_SHAPE_OPTIONS: Array<{ key: ParticleShape; text: string }> = [
  { key: "circle", text: "Circle" },
  { key: "square", text: "Square" },
  { key: "triangle", text: "Triangle" },
  { key: "star", text: "Star" },
  { key: "snow", text: "Snowflake" },
];

export const PARTICLE_DIRECTION_OPTIONS: Array<{ key: ParticleDirection; text: string }> = [
  { key: "up", text: "Up" },
  { key: "down", text: "Down" },
  { key: "left", text: "Left" },
  { key: "right", text: "Right" },
  { key: "random", text: "Random" },
];

export const REDUCED_MOTION_OPTIONS: Array<{ key: ReducedMotionPref; text: string }> = [
  { key: "respect", text: "Respect User Preference" },
  { key: "ignore", text: "Always Animate" },
];

export const AUTOPLAY_DIRECTION_OPTIONS: Array<{ key: AutoplayDirection; text: string }> = [
  { key: "forward", text: "Forward" },
  { key: "reverse", text: "Reverse" },
];
