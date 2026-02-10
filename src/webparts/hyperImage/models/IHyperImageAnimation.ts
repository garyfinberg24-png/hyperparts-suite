/* ── Entrance Animations ── */

/** Entrance animation for the entire image container */
export enum EntranceAnimation {
  None = "none",
  FadeIn = "fadeIn",
  SlideUp = "slideUp",
  SlideLeft = "slideLeft",
  ZoomIn = "zoomIn",
  BounceIn = "bounceIn",
}

/** Property pane dropdown options */
export var ENTRANCE_ANIMATION_OPTIONS = [
  { key: EntranceAnimation.None, text: "None" },
  { key: EntranceAnimation.FadeIn, text: "Fade In" },
  { key: EntranceAnimation.SlideUp, text: "Slide Up" },
  { key: EntranceAnimation.SlideLeft, text: "Slide Left" },
  { key: EntranceAnimation.ZoomIn, text: "Zoom In" },
  { key: EntranceAnimation.BounceIn, text: "Bounce In" },
];
