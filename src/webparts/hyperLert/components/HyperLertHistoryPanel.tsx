import * as React from "react";
import { HyperModal } from "../../../common/components";
import type { IAlertHistoryEntry } from "../models";
import { useHyperLertStore } from "../store/useHyperLertStore";
import { formatHistoryTimestamp, getSeverityColor } from "../utils/historyUtils";
import HyperLertStatusBadge from "./HyperLertStatusBadge";
import styles from "./HyperLertHistoryPanel.module.scss";

export interface IHyperLertHistoryPanelProps {
  entries: IAlertHistoryEntry[];
  loading: boolean;
}

type SortField = "timestamp" | "ruleName" | "severity" | "status";

const PAGE_SIZE = 20;

const HyperLertHistoryPanel: React.FC<IHyperLertHistoryPanelProps> = function (panelProps) {
  const isHistoryOpen = useHyperLertStore(function (s) { return s.isHistoryOpen; });
  const closeHistory = useHyperLertStore(function (s) { return s.closeHistory; });

  const [sortField, setSortField] = React.useState<SortField>("timestamp");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const handleSort = React.useCallback(function (field: SortField) {
    setSortField(function (prev) {
      if (prev === field) {
        setSortAsc(function (asc) { return !asc; });
        return prev;
      }
      setSortAsc(false);
      return field;
    });
    setPage(0);
  }, []);

  // Sort entries
  const sorted = React.useMemo(function () {
    const copy = panelProps.entries.slice();
    copy.sort(function (a, b) {
      let cmp = 0;
      switch (sortField) {
        case "timestamp":
          cmp = a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0;
          break;
        case "ruleName":
          cmp = a.ruleName.toLowerCase() < b.ruleName.toLowerCase() ? -1 : a.ruleName.toLowerCase() > b.ruleName.toLowerCase() ? 1 : 0;
          break;
        case "severity":
          cmp = a.severity < b.severity ? -1 : a.severity > b.severity ? 1 : 0;
          break;
        case "status":
          cmp = a.status < b.status ? -1 : a.status > b.status ? 1 : 0;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [panelProps.entries, sortField, sortAsc]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageStart = page * PAGE_SIZE;
  const pageEntries = sorted.slice(pageStart, pageStart + PAGE_SIZE);

  const sortIcon = function (field: SortField): string {
    if (sortField !== field) return "";
    return sortAsc ? " \u25B2" : " \u25BC";
  };

  // Build table rows
  const rows: React.ReactElement[] = [];
  pageEntries.forEach(function (entry) {
    const channelChips: React.ReactElement[] = [];
    entry.notifiedChannels.forEach(function (ch, idx) {
      channelChips.push(
        React.createElement("span", { key: String(idx), className: styles.channelChip }, ch)
      );
    });

    rows.push(
      React.createElement(
        "tr",
        { key: String(entry.id) + "-" + entry.timestamp },
        React.createElement("td", undefined, formatHistoryTimestamp(entry.timestamp)),
        React.createElement("td", undefined, entry.ruleName),
        React.createElement(
          "td",
          undefined,
          React.createElement("span", {
            className: styles.severityDot,
            style: { backgroundColor: getSeverityColor(entry.severity) },
          }),
          entry.severity
        ),
        React.createElement("td", undefined, entry.conditionSummary || entry.triggeredValue),
        React.createElement("td", undefined, channelChips),
        React.createElement("td", undefined,
          React.createElement(HyperLertStatusBadge, { status: entry.status })
        )
      )
    );
  });

  const tableContent = panelProps.entries.length === 0
    ? React.createElement("div", { className: styles.emptyMessage }, "No alert history entries found.")
    : React.createElement(
        React.Fragment,
        undefined,
        React.createElement(
          "table",
          { className: styles.historyTable, role: "table", "aria-label": "Alert history" },
          React.createElement(
            "thead",
            undefined,
            React.createElement(
              "tr",
              undefined,
              React.createElement("th", { onClick: function () { handleSort("timestamp"); } }, "Time" + sortIcon("timestamp")),
              React.createElement("th", { onClick: function () { handleSort("ruleName"); } }, "Rule" + sortIcon("ruleName")),
              React.createElement("th", { onClick: function () { handleSort("severity"); } }, "Severity" + sortIcon("severity")),
              React.createElement("th", undefined, "Details"),
              React.createElement("th", undefined, "Channels"),
              React.createElement("th", { onClick: function () { handleSort("status"); } }, "Status" + sortIcon("status"))
            )
          ),
          React.createElement("tbody", undefined, rows)
        ),
        // Pagination
        totalPages > 1
          ? React.createElement(
              "div",
              { className: styles.pagination },
              React.createElement("button", {
                className: styles.pageBtn,
                disabled: page === 0,
                onClick: function () { setPage(function (p) { return Math.max(0, p - 1); }); },
                type: "button",
              }, "Previous"),
              React.createElement("span", { className: styles.pageInfo },
                "Page " + (page + 1) + " of " + totalPages
              ),
              React.createElement("button", {
                className: styles.pageBtn,
                disabled: page >= totalPages - 1,
                onClick: function () { setPage(function (p) { return Math.min(totalPages - 1, p + 1); }); },
                type: "button",
              }, "Next")
            )
          : undefined
      );

  return React.createElement(
    HyperModal,
    {
      isOpen: isHistoryOpen,
      onClose: closeHistory,
      title: "Alert History",
      size: "large",
    },
    tableContent
  );
};

export default HyperLertHistoryPanel;
