// HyperTicker V2 — Analytics CSV Export
// Pattern: hyperPoll/utils/exportUtils.ts

interface ITickerAnalyticsRow {
  itemId: string;
  title: string;
  action: string;
  timestamp: string;
}

/**
 * Export ticker analytics data as CSV with UTF-8 BOM.
 */
export function exportAnalyticsCSV(
  rows: ITickerAnalyticsRow[],
  filename?: string
): void {
  const BOM = "\uFEFF";
  const headers = "Item ID,Title,Action,Timestamp";

  const csvRows: string[] = [headers];
  rows.forEach(function (row) {
    const escapedTitle = '"' + row.title.replace(/"/g, '""') + '"';
    csvRows.push(
      row.itemId + "," +
      escapedTitle + "," +
      row.action + "," +
      row.timestamp
    );
  });

  const csvContent = BOM + csvRows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "hyperticker-analytics.csv";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(function () {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

export type { ITickerAnalyticsRow };
