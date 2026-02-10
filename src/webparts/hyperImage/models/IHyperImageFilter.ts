/* ── CSS Filter Effects ── */

/** All configurable CSS filter values (0-100 range, blur 0-20px) */
export interface IFilterConfig {
  grayscale: number;
  sepia: number;
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  invert: number;
  opacity: number;
}

/** 10 filter presets */
export enum FilterPreset {
  None = "none",
  Vintage = "vintage",
  Cinematic = "cinematic",
  DramaticBW = "dramaticBW",
  WarmGlow = "warmGlow",
  CoolBreeze = "coolBreeze",
  Faded = "faded",
  HighContrast = "highContrast",
  Duotone = "duotone",
  SoftFocus = "softFocus",
}

/** Default filter config — no filters applied */
export var DEFAULT_FILTER_CONFIG: IFilterConfig = {
  grayscale: 0,
  sepia: 0,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
};

/** Pre-tuned filter preset values */
export var FILTER_PRESETS: Record<string, IFilterConfig> = {};
FILTER_PRESETS[FilterPreset.None] = {
  grayscale: 0, sepia: 0, blur: 0, brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, invert: 0, opacity: 100,
};
FILTER_PRESETS[FilterPreset.Vintage] = {
  grayscale: 10, sepia: 40, blur: 0, brightness: 95, contrast: 90, saturate: 85, hueRotate: 0, invert: 0, opacity: 100,
};
FILTER_PRESETS[FilterPreset.Cinematic] = {
  grayscale: 5, sepia: 10, blur: 0, brightness: 90, contrast: 120, saturate: 80, hueRotate: 0, invert: 0, opacity: 100,
};
FILTER_PRESETS[FilterPreset.DramaticBW] = {
  grayscale: 100, sepia: 0, blur: 0, brightness: 95, contrast: 130, saturate: 0, hueRotate: 0, invert: 0, opacity: 100,
};
FILTER_PRESETS[FilterPreset.WarmGlow] = {
  grayscale: 0, sepia: 25, blur: 0, brightness: 110, contrast: 95, saturate: 110, hueRotate: 10, invert: 0, opacity: 100,
};
FILTER_PRESETS[FilterPreset.CoolBreeze] = {
  grayscale: 10, sepia: 0, blur: 0, brightness: 105, contrast: 95, saturate: 90, hueRotate: 190, invert: 0, opacity: 100,
};
FILTER_PRESETS[FilterPreset.Faded] = {
  grayscale: 15, sepia: 10, blur: 0, brightness: 115, contrast: 80, saturate: 75, hueRotate: 0, invert: 0, opacity: 90,
};
FILTER_PRESETS[FilterPreset.HighContrast] = {
  grayscale: 0, sepia: 0, blur: 0, brightness: 110, contrast: 150, saturate: 120, hueRotate: 0, invert: 0, opacity: 100,
};
FILTER_PRESETS[FilterPreset.Duotone] = {
  grayscale: 100, sepia: 50, blur: 0, brightness: 100, contrast: 110, saturate: 120, hueRotate: 160, invert: 0, opacity: 100,
};
FILTER_PRESETS[FilterPreset.SoftFocus] = {
  grayscale: 0, sepia: 5, blur: 2, brightness: 105, contrast: 90, saturate: 95, hueRotate: 0, invert: 0, opacity: 100,
};

/** Build a CSS filter string from a config */
export function buildFilterString(config: IFilterConfig): string {
  var parts: string[] = [];
  if (config.grayscale !== 0) parts.push("grayscale(" + config.grayscale + "%)");
  if (config.sepia !== 0) parts.push("sepia(" + config.sepia + "%)");
  if (config.blur !== 0) parts.push("blur(" + config.blur + "px)");
  if (config.brightness !== 100) parts.push("brightness(" + config.brightness + "%)");
  if (config.contrast !== 100) parts.push("contrast(" + config.contrast + "%)");
  if (config.saturate !== 100) parts.push("saturate(" + config.saturate + "%)");
  if (config.hueRotate !== 0) parts.push("hue-rotate(" + config.hueRotate + "deg)");
  if (config.invert !== 0) parts.push("invert(" + config.invert + "%)");
  if (config.opacity !== 100) parts.push("opacity(" + config.opacity + "%)");
  return parts.length > 0 ? parts.join(" ") : "none";
}

/** Property pane dropdown options */
export var FILTER_PRESET_OPTIONS = [
  { key: FilterPreset.None, text: "None" },
  { key: FilterPreset.Vintage, text: "Vintage" },
  { key: FilterPreset.Cinematic, text: "Cinematic" },
  { key: FilterPreset.DramaticBW, text: "Dramatic B&W" },
  { key: FilterPreset.WarmGlow, text: "Warm Glow" },
  { key: FilterPreset.CoolBreeze, text: "Cool Breeze" },
  { key: FilterPreset.Faded, text: "Faded" },
  { key: FilterPreset.HighContrast, text: "High Contrast" },
  { key: FilterPreset.Duotone, text: "Duotone" },
  { key: FilterPreset.SoftFocus, text: "Soft Focus" },
];
