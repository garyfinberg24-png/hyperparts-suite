import type { IHyperLinkPresetStyle } from "../models";

// ============================================================
// HyperLinks — Preset Style Gallery
// ============================================================
// 12 curated preset styles for the links container.

export var PRESET_STYLES: IHyperLinkPresetStyle[] = [
  {
    id: "clean-white",
    name: "Clean White",
    description: "Classic minimal design on a white background",
    preview: "#ffffff",
    background: { mode: "none" },
    hoverEffect: "lift",
    borderRadius: "medium",
  },
  {
    id: "soft-gray",
    name: "Soft Gray",
    description: "Subtle gray background for a muted look",
    preview: "#f3f2f1",
    background: { mode: "color", color: "#f3f2f1" },
    hoverEffect: "lift",
    borderRadius: "medium",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Cool blue gradient with white text",
    preview: "linear-gradient(135deg, #667eea, #764ba2)",
    background: { mode: "gradient", gradient: "linear-gradient(135deg, #667eea, #764ba2)" },
    hoverEffect: "glow",
    borderRadius: "large",
    textColor: "#ffffff",
    iconColor: "#ffffff",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    description: "Warm orange-to-pink gradient with glow effect",
    preview: "linear-gradient(135deg, #f093fb, #f5576c)",
    background: { mode: "gradient", gradient: "linear-gradient(135deg, #f093fb, #f5576c)" },
    hoverEffect: "glow",
    borderRadius: "large",
    textColor: "#ffffff",
    iconColor: "#ffffff",
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    description: "Dark background for modern, high-contrast look",
    preview: "#1b1b1b",
    background: { mode: "color", color: "#1b1b1b" },
    hoverEffect: "glow",
    borderRadius: "medium",
    textColor: "#ffffff",
    iconColor: "#60cdff",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    description: "Deep navy background with shimmer on hover",
    preview: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    background: { mode: "gradient", gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" },
    hoverEffect: "shimmer",
    borderRadius: "medium",
    textColor: "#e0e0e0",
    iconColor: "#4fc3f7",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    description: "Nature-inspired green gradient",
    preview: "linear-gradient(135deg, #11998e, #38ef7d)",
    background: { mode: "gradient", gradient: "linear-gradient(135deg, #11998e, #38ef7d)" },
    hoverEffect: "bounce",
    borderRadius: "large",
    textColor: "#ffffff",
    iconColor: "#ffffff",
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    description: "Professional blue theme matching M365 branding",
    preview: "#0078d4",
    background: { mode: "color", color: "#0078d4" },
    hoverEffect: "lift",
    borderRadius: "small",
    textColor: "#ffffff",
    iconColor: "#ffffff",
  },
  {
    id: "pastel-dream",
    name: "Pastel Dream",
    description: "Soft pastel gradient for a friendly feel",
    preview: "linear-gradient(135deg, #a8edea, #fed6e3)",
    background: { mode: "gradient", gradient: "linear-gradient(135deg, #a8edea, #fed6e3)" },
    hoverEffect: "pulse",
    borderRadius: "round",
    textColor: "#333333",
    iconColor: "#0078d4",
  },
  {
    id: "warm-sand",
    name: "Warm Sand",
    description: "Earthy warm tones for a cozy feel",
    preview: "linear-gradient(135deg, #f5e6ca, #e8d5b7)",
    background: { mode: "gradient", gradient: "linear-gradient(135deg, #f5e6ca, #e8d5b7)" },
    hoverEffect: "lift",
    borderRadius: "medium",
    textColor: "#4a3728",
    iconColor: "#8b6914",
  },
  {
    id: "neon-pop",
    name: "Neon Pop",
    description: "Bold, vibrant dark theme with neon accents",
    preview: "linear-gradient(135deg, #0a0a0a, #1a1a2e)",
    background: { mode: "gradient", gradient: "linear-gradient(135deg, #0a0a0a, #1a1a2e)" },
    hoverEffect: "shimmer",
    borderRadius: "medium",
    textColor: "#00ff88",
    iconColor: "#ff006e",
  },
  {
    id: "glass-morphism",
    name: "Glass Effect",
    description: "Frosted glass look with subtle transparency",
    preview: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
    background: { mode: "gradient", gradient: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))" },
    hoverEffect: "glow",
    borderRadius: "large",
    textColor: "#323130",
    iconColor: "#0078d4",
  },
];

/** Get a preset by ID */
export function getPresetById(id: string): IHyperLinkPresetStyle | undefined {
  var result: IHyperLinkPresetStyle | undefined;
  PRESET_STYLES.forEach(function (p) {
    if (p.id === id) { result = p; }
  });
  return result;
}
