import type { IHyperRollupItem, IHyperRollupColumn } from "../models";

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
 * Gets a display value from an item for a specific column.
 */
function getFieldValue(item: IHyperRollupItem, column: IHyperRollupColumn): string {
  const fieldName = column.fieldName;

  // Check top-level known fields first
  if (fieldName === "title") return item.title || "";
  if (fieldName === "description") return item.description || "";
  if (fieldName === "author") return item.author || "";
  if (fieldName === "editor") return item.editor || "";
  if (fieldName === "created") return item.created || "";
  if (fieldName === "modified") return item.modified || "";
  if (fieldName === "fileType") return item.fileType || "";
  if (fieldName === "contentType") return item.contentType || "";
  if (fieldName === "category") return item.category || "";
  if (fieldName === "sourceSiteName") return item.sourceSiteName || "";
  if (fieldName === "sourceListName") return item.sourceListName || "";

  // Check fields map
  const raw = item.fields[fieldName];
  if (raw === undefined) return "";
  return String(raw);
}

/**
 * Generates a CSV string from items and visible columns.
 * Includes UTF-8 BOM for Excel compatibility.
 */
export function generateCsv(items: IHyperRollupItem[], columns: IHyperRollupColumn[]): string {
  const visibleColumns: IHyperRollupColumn[] = [];
  columns.forEach(function (col) {
    if (col.visible) {
      visibleColumns.push(col);
    }
  });

  // Header row
  const headers: string[] = [];
  visibleColumns.forEach(function (col) {
    headers.push(escapeCsvField(col.displayName));
  });

  const rows: string[] = [headers.join(",")];

  // Data rows
  items.forEach(function (item) {
    const cells: string[] = [];
    visibleColumns.forEach(function (col) {
      cells.push(escapeCsvField(getFieldValue(item, col)));
    });
    rows.push(cells.join(","));
  });

  // UTF-8 BOM + CSV content
  return "\uFEFF" + rows.join("\r\n");
}

/**
 * Triggers a file download in the browser.
 */
export function downloadFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
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
 * Exports items to CSV and triggers download.
 */
export function exportToCsv(items: IHyperRollupItem[], columns: IHyperRollupColumn[], fileName?: string): void {
  const csv = generateCsv(items, columns);
  downloadFile(csv, fileName || "rollup-export.csv", "text/csv;charset=utf-8;");
}
