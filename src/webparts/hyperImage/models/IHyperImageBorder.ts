/* ── Border & Frame Config ── */

/** Border configuration */
export interface IBorderConfig {
  width: number;
  color: string;
  style: string;
  radius: number;
  padding: number;
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
