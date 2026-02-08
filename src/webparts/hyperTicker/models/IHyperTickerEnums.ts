// HyperTicker enum types and dropdown option arrays

export type TickerSeverity = "normal" | "warning" | "critical";
export type TickerDisplayMode = "scroll" | "fade" | "static" | "stacked";
export type TickerDirection = "left" | "right";
export type TickerDataSource = "manual" | "spList" | "rss";
export type TickerPosition = "top" | "bottom" | "inline";

export const ALL_SEVERITIES: TickerSeverity[] = ["normal", "warning", "critical"];
export const ALL_DISPLAY_MODES: TickerDisplayMode[] = ["scroll", "fade", "static", "stacked"];
export const ALL_DIRECTIONS: TickerDirection[] = ["left", "right"];
export const ALL_DATA_SOURCES: TickerDataSource[] = ["manual", "spList", "rss"];
export const ALL_POSITIONS: TickerPosition[] = ["top", "bottom", "inline"];

export function getSeverityDisplayName(severity: TickerSeverity): string {
  const map: Record<TickerSeverity, string> = {
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
  };
  return map[severity];
}

export function getDisplayModeDisplayName(mode: TickerDisplayMode): string {
  const map: Record<TickerDisplayMode, string> = {
    scroll: "Scrolling Marquee",
    fade: "Fading Rotation",
    static: "Static Rotation",
    stacked: "Stacked Cards",
  };
  return map[mode];
}

export function getPositionDisplayName(position: TickerPosition): string {
  const map: Record<TickerPosition, string> = {
    top: "Top of Page",
    bottom: "Bottom of Page",
    inline: "Inline",
  };
  return map[position];
}

export function getSeverityColor(severity: TickerSeverity): string {
  const map: Record<TickerSeverity, string> = {
    normal: "#0078d4",
    warning: "#ffaa44",
    critical: "#d13438",
  };
  return map[severity];
}

export function getSeverityBackgroundColor(severity: TickerSeverity): string {
  const map: Record<TickerSeverity, string> = {
    normal: "#deecf9",
    warning: "#fff4ce",
    critical: "#fde7e9",
  };
  return map[severity];
}
