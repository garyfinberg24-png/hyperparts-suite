/* ── Hover Effects ── */

/** 13 hover effects for image interactions */
export enum HoverEffect {
  None = "none",
  ZoomIn = "zoomIn",
  ZoomOut = "zoomOut",
  Lift = "lift",
  Rotate = "rotate",
  GrayscaleToColor = "grayscaleToColor",
  ColorToGrayscale = "colorToGrayscale",
  BlurToClear = "blurToClear",
  Darken = "darken",
  Brighten = "brighten",
  SlideReveal = "slideReveal",
  ShineSweep = "shineSweep",
  Tilt3d = "tilt3d",
  Flip = "flip",
}

/** Property pane dropdown options */
export var HOVER_EFFECT_OPTIONS = [
  { key: HoverEffect.None, text: "None" },
  { key: HoverEffect.ZoomIn, text: "Zoom In" },
  { key: HoverEffect.ZoomOut, text: "Zoom Out" },
  { key: HoverEffect.Lift, text: "Lift" },
  { key: HoverEffect.Rotate, text: "Rotate" },
  { key: HoverEffect.GrayscaleToColor, text: "Grayscale to Color" },
  { key: HoverEffect.ColorToGrayscale, text: "Color to Grayscale" },
  { key: HoverEffect.BlurToClear, text: "Blur to Clear" },
  { key: HoverEffect.Darken, text: "Darken" },
  { key: HoverEffect.Brighten, text: "Brighten" },
  { key: HoverEffect.SlideReveal, text: "Slide Reveal" },
  { key: HoverEffect.ShineSweep, text: "Shine Sweep" },
  { key: HoverEffect.Tilt3d, text: "Tilt 3D" },
  { key: HoverEffect.Flip, text: "Flip (Click)" },
];
