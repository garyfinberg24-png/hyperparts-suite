/** 10-color Fluent UI palette for chart segments */
export const CHART_COLORS: string[] = [
  "#0078d4", "#00b7c3", "#8764b8", "#e74856",
  "#ff8c00", "#107c10", "#ffb900", "#5c2d91",
  "#00ad56", "#d83b01",
];

/** Get color by index with wrapping */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/** Get a color with alpha channel (for area fills) */
export function getChartColorAlpha(index: number, alpha: number): string {
  const hex = CHART_COLORS[index % CHART_COLORS.length];
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

/** Format a number for display (integers stay whole, decimals get 1 place) */
export function formatChartValue(value: number): string {
  if (value === Math.floor(value)) return String(value);
  return value.toFixed(1);
}

/** Format as percentage */
export function formatPercentage(value: number): string {
  return Math.round(value) + "%";
}
