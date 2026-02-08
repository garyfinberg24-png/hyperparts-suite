/**
 * Escapes a CSV field value: wraps in quotes if it contains commas, quotes, or newlines.
 */
function escapeCsvField(value: string): string {
  if (value.indexOf(",") !== -1 || value.indexOf("\"") !== -1 || value.indexOf("\n") !== -1) {
    return "\"" + value.replace(/"/g, "\"\"") + "\"";
  }
  return value;
}

/**
 * Triggers a file download in the browser.
 */
function downloadFile(content: string | Blob, fileName: string, mimeType: string): void {
  const blob = typeof content === "string" ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Export chart data as CSV with UTF-8 BOM.
 * @param labels  Category labels
 * @param datasets  Array of { label, data } series
 * @param fileName  Filename to download
 */
export function exportChartDataAsCsv(
  labels: string[],
  datasets: Array<{ label: string; data: number[] }>,
  fileName?: string
): void {
  // Header row: Category, Series1, Series2, ...
  const headers: string[] = ["Category"];
  datasets.forEach(function (ds) {
    headers.push(escapeCsvField(ds.label));
  });

  const rows: string[] = [headers.join(",")];

  // Data rows
  labels.forEach(function (label, rowIdx) {
    const cells: string[] = [escapeCsvField(label)];
    datasets.forEach(function (ds) {
      const val = rowIdx < ds.data.length ? String(ds.data[rowIdx]) : "";
      cells.push(val);
    });
    rows.push(cells.join(","));
  });

  // UTF-8 BOM + CSV
  const csv = "\uFEFF" + rows.join("\r\n");
  downloadFile(csv, fileName || "chart-export.csv", "text/csv;charset=utf-8;");
}

/**
 * Export a chart canvas element as a PNG image.
 * Falls back to a no-op if canvas ref is not provided.
 * @param canvasElement  The HTML canvas element from Chart.js
 * @param fileName  Filename to download
 */
export function exportChartAsPng(
  canvasElement: HTMLCanvasElement | undefined,
  fileName?: string
): void {
  if (!canvasElement) return;

  try {
    const dataUrl = canvasElement.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = fileName || "chart-export.png";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } catch {
    // Canvas tainted by CORS or export not available
  }
}
