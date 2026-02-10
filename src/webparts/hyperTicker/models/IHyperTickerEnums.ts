// HyperTicker V2 — enum types and dropdown option arrays

export type TickerSeverity = "normal" | "warning" | "critical";
export type TickerDisplayMode = "scroll" | "fade" | "static" | "stacked" | "vertical" | "typewriter" | "split" | "breaking";
export type TickerDirection = "left" | "right";
export type TickerDataSource = "manual" | "spList" | "rss" | "graph" | "restApi";
export type TickerPosition = "top" | "bottom" | "inline";
export type TickerHeightPreset = "compact" | "standard" | "large";

export const ALL_SEVERITIES: TickerSeverity[] = ["normal", "warning", "critical"];
export const ALL_DISPLAY_MODES: TickerDisplayMode[] = [
  "scroll", "fade", "static", "stacked", "vertical", "typewriter", "split", "breaking",
];
export const ALL_DIRECTIONS: TickerDirection[] = ["left", "right"];
export const ALL_DATA_SOURCES: TickerDataSource[] = ["manual", "spList", "rss", "graph", "restApi"];
export const ALL_POSITIONS: TickerPosition[] = ["top", "bottom", "inline"];
export const ALL_HEIGHT_PRESETS: TickerHeightPreset[] = ["compact", "standard", "large"];

export function getSeverityDisplayName(severity: TickerSeverity): string {
  const map: Record<TickerSeverity, string> = {
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
  };
  return map[severity] || "Normal";
}

export function getDisplayModeDisplayName(mode: TickerDisplayMode): string {
  const map: Record<TickerDisplayMode, string> = {
    scroll: "Scrolling Marquee",
    fade: "Fading Rotation",
    static: "Static Rotation",
    stacked: "Stacked Cards",
    vertical: "Vertical Scroll",
    typewriter: "Typewriter",
    split: "Split Panel",
    breaking: "Breaking News",
  };
  return map[mode] || "Scrolling Marquee";
}

export function getDisplayModeIcon(mode: TickerDisplayMode): string {
  const map: Record<TickerDisplayMode, string> = {
    scroll: "ChromeRestore",
    fade: "TransitionEffect",
    static: "Pause",
    stacked: "GridViewSmall",
    vertical: "SortLines",
    typewriter: "TextDocument",
    split: "SplitObject",
    breaking: "Warning",
  };
  return map[mode] || "ChromeRestore";
}

export function getPositionDisplayName(position: TickerPosition): string {
  const map: Record<TickerPosition, string> = {
    top: "Top of Page",
    bottom: "Bottom of Page",
    inline: "Inline",
  };
  return map[position] || "Inline";
}

export function getHeightPresetDisplayName(preset: TickerHeightPreset): string {
  const map: Record<TickerHeightPreset, string> = {
    compact: "Compact (32px)",
    standard: "Standard (40px)",
    large: "Large (52px)",
  };
  return map[preset] || "Standard (40px)";
}

export function getHeightPresetPx(preset: TickerHeightPreset): number {
  const map: Record<TickerHeightPreset, number> = {
    compact: 32,
    standard: 40,
    large: 52,
  };
  return map[preset] || 40;
}

export function getDataSourceDisplayName(source: TickerDataSource): string {
  const map: Record<TickerDataSource, string> = {
    manual: "Manual Items",
    spList: "SharePoint List",
    rss: "RSS Feed",
    graph: "Microsoft Graph",
    restApi: "REST API",
  };
  return map[source] || "Manual Items";
}

export function getSeverityColor(severity: TickerSeverity): string {
  const map: Record<TickerSeverity, string> = {
    normal: "#0078d4",
    warning: "#ffaa44",
    critical: "#d13438",
  };
  return map[severity] || "#0078d4";
}

export function getSeverityBackgroundColor(severity: TickerSeverity): string {
  const map: Record<TickerSeverity, string> = {
    normal: "#deecf9",
    warning: "#fff4ce",
    critical: "#fde7e9",
  };
  return map[severity] || "#deecf9";
}
