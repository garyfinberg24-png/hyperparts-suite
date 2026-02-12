// ============================================================
// HyperFlow — Enum types and display helpers
// ============================================================

export type FlowMode = "visual" | "functional";
export type FlowVisualStyle = "pill" | "circle" | "card" | "gradient-lane" | "metro-map";
export type FlowFunctionalLayout = "horizontal" | "timeline" | "kanban" | "checklist";
export type FlowColorTheme = "corporate" | "purple-haze" | "ocean" | "sunset" | "forest" | "monochrome";
export type FlowCreationPath = "design-your-own" | "templates" | "visual-presets";
export type FlowNodeShape = "pill" | "circle" | "card" | "diamond" | "rectangle";
export type FlowConnectorStyle = "arrow" | "dashed" | "dotted" | "thick";
export type FlowStepStatus = "not-started" | "in-progress" | "completed" | "blocked" | "skipped";
export type FlowDataSource = "manual" | "list";

export var ALL_FLOW_MODES: FlowMode[] = ["visual", "functional"];
export var ALL_VISUAL_STYLES: FlowVisualStyle[] = ["pill", "circle", "card", "gradient-lane", "metro-map"];
export var ALL_FUNCTIONAL_LAYOUTS: FlowFunctionalLayout[] = ["horizontal", "timeline", "kanban", "checklist"];
export var ALL_COLOR_THEMES: FlowColorTheme[] = ["corporate", "purple-haze", "ocean", "sunset", "forest", "monochrome"];

export function getFlowModeDisplayName(mode: FlowMode): string {
  var LABELS: Record<string, string> = {
    visual: "Visual Diagram",
    functional: "Process Stepper",
  };
  return LABELS[mode] || mode;
}

export function getVisualStyleDisplayName(style: FlowVisualStyle): string {
  var LABELS: Record<string, string> = {
    pill: "Pill Flow",
    circle: "Circle Flow",
    card: "Card Flow",
    "gradient-lane": "Gradient Lane",
    "metro-map": "Metro Map",
  };
  return LABELS[style] || style;
}

export function getFunctionalLayoutDisplayName(layout: FlowFunctionalLayout): string {
  var LABELS: Record<string, string> = {
    horizontal: "Horizontal",
    timeline: "Timeline",
    kanban: "Kanban",
    checklist: "Checklist",
  };
  return LABELS[layout] || layout;
}

export function getColorThemeDisplayName(theme: FlowColorTheme): string {
  var LABELS: Record<string, string> = {
    corporate: "Corporate",
    "purple-haze": "Purple Haze",
    ocean: "Ocean",
    sunset: "Sunset",
    forest: "Forest",
    monochrome: "Monochrome",
  };
  return LABELS[theme] || theme;
}

export function getStepStatusDisplayName(status: FlowStepStatus): string {
  var LABELS: Record<string, string> = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    completed: "Completed",
    blocked: "Blocked",
    skipped: "Skipped",
  };
  return LABELS[status] || status;
}
