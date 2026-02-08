import type { IEventSource } from "../models";

/** Default palette for source overlay colors */
const SOURCE_COLORS = [
  "#0078d4", "#107c10", "#d83b01", "#8764b8",
  "#ff8c00", "#00b7c3", "#e3008c", "#4f6bed",
];

/** Get the display color for a source (or assign from palette by index) */
export function getSourceColor(source: IEventSource, index: number): string {
  if (source.color) return source.color;
  return SOURCE_COLORS[index % SOURCE_COLORS.length];
}

/** Filter to only enabled sources */
export function getEnabledSources(sources: IEventSource[]): IEventSource[] {
  return sources.filter(function (s) {
    return s.enabled;
  });
}
