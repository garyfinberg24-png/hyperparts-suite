/* ── Border & Frame Config ── */

/** Border configuration */
export interface IBorderConfig {
  width: number;
  color: string;
  style: string;
  radius: number;
  padding: number;
  paddingBottom?: number;
}

/** Shadow presets */
export enum ShadowPreset {
  None = "none",
  Subtle = "subtle",
  Medium = "medium",
  Dramatic = "dramatic",
  Inner = "inner",
  NeonGlow = "neonGlow",
}

/** CSS box-shadow values for each preset */
export var SHADOW_PRESETS: Record<string, string> = {};
SHADOW_PRESETS[ShadowPreset.None] = "none";
SHADOW_PRESETS[ShadowPreset.Subtle] = "0 2px 8px rgba(0,0,0,0.1)";
SHADOW_PRESETS[ShadowPreset.Medium] = "0 4px 16px rgba(0,0,0,0.15)";
SHADOW_PRESETS[ShadowPreset.Dramatic] = "0 8px 32px rgba(0,0,0,0.25)";
SHADOW_PRESETS[ShadowPreset.Inner] = "inset 0 2px 8px rgba(0,0,0,0.2)";
SHADOW_PRESETS[ShadowPreset.NeonGlow] = "0 0 20px rgba(0,120,212,0.4), 0 0 40px rgba(0,120,212,0.2)";

/** Default border config */
export var DEFAULT_BORDER_CONFIG: IBorderConfig = {
  width: 0,
  color: "#e1e1e1",
  style: "solid",
  radius: 0,
  padding: 0,
};

/** Property pane dropdown: shadow presets */
export var SHADOW_PRESET_OPTIONS = [
  { key: ShadowPreset.None, text: "None" },
  { key: ShadowPreset.Subtle, text: "Subtle" },
  { key: ShadowPreset.Medium, text: "Medium" },
  { key: ShadowPreset.Dramatic, text: "Dramatic" },
  { key: ShadowPreset.Inner, text: "Inner Shadow" },
  { key: ShadowPreset.NeonGlow, text: "Neon Glow" },
];

/** Property pane dropdown: border style */
export var BORDER_STYLE_OPTIONS = [
  { key: "solid", text: "Solid" },
  { key: "dashed", text: "Dashed" },
  { key: "dotted", text: "Dotted" },
  { key: "double", text: "Double" },
  { key: "groove", text: "Groove" },
  { key: "ridge", text: "Ridge" },
];

/* ── Border Style Presets ── */

/** Predefined border style combinations */
export enum BorderStylePreset {
  None = "none",
  ThinSolid = "thinSolid",
  ThickSolid = "thickSolid",
  Rounded = "rounded",
  Shadow = "shadow",
  Polaroid = "polaroid",
  Film = "film",
  Frame = "frame",
  Outline = "outline",
  DoubleFrame = "doubleFrame",
}

/** Border preset config including optional shadow and paddingBottom overrides */
export interface IBorderPresetConfig extends IBorderConfig {
  shadow?: string;
}

/** Preset registry mapping each preset to its border config */
export var BORDER_STYLE_PRESETS: Record<string, IBorderPresetConfig> = {};
BORDER_STYLE_PRESETS[BorderStylePreset.None] = { width: 0, color: "#e1e1e1", style: "solid", radius: 0, padding: 0 };
BORDER_STYLE_PRESETS[BorderStylePreset.ThinSolid] = { width: 1, color: "#e1e1e1", style: "solid", radius: 0, padding: 0 };
BORDER_STYLE_PRESETS[BorderStylePreset.ThickSolid] = { width: 4, color: "#323130", style: "solid", radius: 0, padding: 0 };
BORDER_STYLE_PRESETS[BorderStylePreset.Rounded] = { width: 2, color: "#e1e1e1", style: "solid", radius: 16, padding: 0 };
BORDER_STYLE_PRESETS[BorderStylePreset.Shadow] = { width: 0, color: "#e1e1e1", style: "solid", radius: 8, padding: 0, shadow: "0 4px 16px rgba(0,0,0,0.15)" };
BORDER_STYLE_PRESETS[BorderStylePreset.Polaroid] = { width: 0, color: "#ffffff", style: "solid", radius: 2, padding: 12, paddingBottom: 40 };
BORDER_STYLE_PRESETS[BorderStylePreset.Film] = { width: 3, color: "#000000", style: "solid", radius: 0, padding: 8 };
BORDER_STYLE_PRESETS[BorderStylePreset.Frame] = { width: 6, color: "#8b7355", style: "ridge", radius: 0, padding: 4 };
BORDER_STYLE_PRESETS[BorderStylePreset.Outline] = { width: 2, color: "#0078d4", style: "dashed", radius: 8, padding: 0 };
BORDER_STYLE_PRESETS[BorderStylePreset.DoubleFrame] = { width: 4, color: "#323130", style: "double", radius: 0, padding: 0 };

/** Property pane dropdown: border style presets */
export var BORDER_STYLE_PRESET_OPTIONS = [
  { key: BorderStylePreset.None, text: "None" },
  { key: BorderStylePreset.ThinSolid, text: "Thin Solid" },
  { key: BorderStylePreset.ThickSolid, text: "Thick Solid" },
  { key: BorderStylePreset.Rounded, text: "Rounded" },
  { key: BorderStylePreset.Shadow, text: "Shadow" },
  { key: BorderStylePreset.Polaroid, text: "Polaroid" },
  { key: BorderStylePreset.Film, text: "Film" },
  { key: BorderStylePreset.Frame, text: "Frame" },
  { key: BorderStylePreset.Outline, text: "Outline" },
  { key: BorderStylePreset.DoubleFrame, text: "Double Frame" },
];
