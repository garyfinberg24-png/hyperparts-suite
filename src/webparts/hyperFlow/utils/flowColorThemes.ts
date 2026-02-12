// ============================================================
// HyperFlow — Color theme definitions
// 6 curated color palettes for flow diagrams & process steppers
// ============================================================

import type { FlowColorTheme, IFlowColorThemeDefinition } from "../models";

export var FLOW_COLOR_THEMES: Record<FlowColorTheme, IFlowColorThemeDefinition> = {
  // ---- 1. Corporate — Professional blues ----
  "corporate": {
    id: "corporate",
    name: "Corporate",
    primary: "#0078d4",
    secondary: "#106ebe",
    accent: "#2b88d8",
    background: "#f0f4f8",
    text: "#1a1a1a",
    nodeColors: [
      "#0078d4",
      "#106ebe",
      "#2b88d8",
      "#005a9e",
      "#004578",
      "#3a96dd",
    ],
    connectorColor: "#a0aec0",
  },

  // ---- 2. Purple Haze — Creative purples ----
  "purple-haze": {
    id: "purple-haze",
    name: "Purple Haze",
    primary: "#7c3aed",
    secondary: "#a855f7",
    accent: "#c084fc",
    background: "#f5f3ff",
    text: "#1a1a2e",
    nodeColors: [
      "#7c3aed",
      "#a855f7",
      "#c084fc",
      "#6d28d9",
      "#8b5cf6",
      "#ddd6fe",
    ],
    connectorColor: "#c4b5fd",
  },

  // ---- 3. Ocean — Calm blue-greens ----
  "ocean": {
    id: "ocean",
    name: "Ocean",
    primary: "#0ea5e9",
    secondary: "#06b6d4",
    accent: "#22d3ee",
    background: "#ecfeff",
    text: "#0c1821",
    nodeColors: [
      "#0ea5e9",
      "#06b6d4",
      "#22d3ee",
      "#0284c7",
      "#0891b2",
      "#67e8f9",
    ],
    connectorColor: "#a5f3fc",
  },

  // ---- 4. Sunset — Warm oranges and reds ----
  "sunset": {
    id: "sunset",
    name: "Sunset",
    primary: "#f59e0b",
    secondary: "#ef4444",
    accent: "#f97316",
    background: "#fffbeb",
    text: "#1a1a1a",
    nodeColors: [
      "#f59e0b",
      "#ef4444",
      "#f97316",
      "#d97706",
      "#dc2626",
      "#fb923c",
    ],
    connectorColor: "#fcd34d",
  },

  // ---- 5. Forest — Natural greens ----
  "forest": {
    id: "forest",
    name: "Forest",
    primary: "#059669",
    secondary: "#10b981",
    accent: "#34d399",
    background: "#ecfdf5",
    text: "#0f1a12",
    nodeColors: [
      "#059669",
      "#10b981",
      "#34d399",
      "#047857",
      "#065f46",
      "#6ee7b7",
    ],
    connectorColor: "#a7f3d0",
  },

  // ---- 6. Monochrome — Elegant grays ----
  "monochrome": {
    id: "monochrome",
    name: "Monochrome",
    primary: "#374151",
    secondary: "#6b7280",
    accent: "#9ca3af",
    background: "#f9fafb",
    text: "#111827",
    nodeColors: [
      "#374151",
      "#6b7280",
      "#9ca3af",
      "#1f2937",
      "#4b5563",
      "#d1d5db",
    ],
    connectorColor: "#e5e7eb",
  },
};

/** All theme definitions as an array (convenience for iteration) */
export var ALL_THEME_DEFINITIONS: IFlowColorThemeDefinition[] = [
  FLOW_COLOR_THEMES["corporate"],
  FLOW_COLOR_THEMES["purple-haze"],
  FLOW_COLOR_THEMES["ocean"],
  FLOW_COLOR_THEMES["sunset"],
  FLOW_COLOR_THEMES["forest"],
  FLOW_COLOR_THEMES["monochrome"],
];
