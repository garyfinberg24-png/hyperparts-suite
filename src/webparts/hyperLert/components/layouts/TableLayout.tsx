import * as React from "react";
import type { ILertLayoutProps } from "./ILertLayoutProps";
import type { ILertAlert } from "../../models/ILertAlert";
import { getSeverityColor } from "../../models/IHyperLertV2Enums";
import type { LertSeverityV2, LertAlertState } from "../../models/IHyperLertV2Enums";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles: Record<string, string> = require("./TableLayout.module.scss");

type SortField = "severity" | "title" | "source" | "category" | "triggeredAt" | "state";
type SortDir = "asc" | "desc";

function formatTimeAgo(isoString: string): string {
  if (!isoString) return "";
  var now = Date.now();
  var then = new Date(isoString).getTime();
  var diffMs = now - then;
  var diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return diffMin + "m ago";
  var diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + "h ago";
  var diffDay = Math.floor(diffHr / 24);
  return diffDay + "d ago";
}

function getStateColor(state: LertAlertState): string {
  switch (state) {
    case "triggered": return "#dc2626";
    case "acknowledged": return "#2563eb";
    case "resolved": return "#16a34a";
    case "snoozed": return "#d97706";
    case "escalated": return "#ea580c";
    case "expired": return "#6b7280";
    default: return "#6b7280";
  }
}

function getStateLabel(state: LertAlertState): string {
  switch (state) {
    case "triggered": return "Triggered";
    case "acknowledged": return "Acknowledged";
    case "resolved": return "Resolved";
    case "snoozed": return "Snoozed";
    case "escalated": return "Escalated";
    case "expired": return "Expired";
    default: return String(state);
  }
}

var SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

function sortAlerts(alerts: ILertAlert[], field: SortField, dir: SortDir): ILertAlert[] {
  var result: ILertAlert[] = [];
  alerts.forEach(function (a: ILertAlert): void { result.push(a); });
  result.sort(function (a: ILertAlert, b: ILertAlert): number {
    var cmp = 0;
    switch (field) {
      case "severity": {
        var sa = SEVERITY_ORDER[a.severity] !== undefined ? SEVERITY_ORDER[a.severity] : 5;
        var sb = SEVERITY_ORDER[b.severity] !== undefined ? SEVERITY_ORDER[b.severity] : 5;
        cmp = sa - sb;
        break;
      }
      case "title":
        cmp = a.title.toLowerCase() < b.title.toLowerCase() ? -1 : a.title.toLowerCase() > b.title.toLowerCase() ? 1 : 0;
        break;
      case "source":
        cmp = a.source.toLowerCase() < b.source.toLowerCase() ? -1 : a.source.toLowerCase() > b.source.toLowerCase() ? 1 : 0;
        break;
      case "category":
        cmp = a.category.toLowerCase() < b.category.toLowerCase() ? -1 : a.category.toLowerCase() > b.category.toLowerCase() ? 1 : 0;
        break;
      case "triggeredAt":
        cmp = new Date(a.triggeredAt).getTime() - new Date(b.triggeredAt).getTime();
        break;
      case "state":
        cmp = a.state < b.state ? -1 : a.state > b.state ? 1 : 0;
        break;
    }
    return dir === "desc" ? -cmp : cmp;
  });
  return result;
}

const TableLayout: React.FC<ILertLayoutProps> = function (props) {
  var sortState = React.useState<SortField>("triggeredAt");
  var sortField = sortState[0];
  var setSortField = sortState[1];

  var dirState = React.useState<SortDir>("desc");
  var sortDir = dirState[0];
  var setSortDir = dirState[1];

  var handleSort = React.useCallback(function (field: SortField): () => void {
    return function (): void {
      if (sortField === field) {
        setSortDir(function (d: SortDir): SortDir { return d === "asc" ? "desc" : "asc"; });
      } else {
        setSortField(field);
        setSortDir("asc");
      }
    };
  }, [sortField, setSortField, setSortDir]);

  if (props.alerts.length === 0) {
    return React.createElement("div", { className: styles.emptyState },
      React.createElement("i", { className: "ms-Icon ms-Icon--Table" }),
      React.createElement("p", undefined, "No alerts to display")
    );
  }

  var sorted = sortAlerts(props.alerts, sortField, sortDir);

  var columns: Array<{ field: SortField; label: string }> = [
    { field: "severity", label: "Severity" },
    { field: "title", label: "Title" },
    { field: "source", label: "Source" },
    { field: "category", label: "Category" },
    { field: "triggeredAt", label: "Triggered" },
    { field: "state", label: "State" },
  ];

  var headerCells: React.ReactNode[] = [];
  columns.forEach(function (col: { field: SortField; label: string }): void {
    var isActive = sortField === col.field;
    var arrowChar = isActive ? (sortDir === "asc" ? "\u25B2" : "\u25BC") : "\u25B2";
    var arrowClass = isActive ? styles.sortArrowActive : styles.sortArrow;

    headerCells.push(React.createElement("th", {
      key: col.field,
      onClick: handleSort(col.field),
      "aria-sort": isActive ? (sortDir === "asc" ? "ascending" : "descending") : "none",
      role: "columnheader",
    },
      col.label,
      React.createElement("span", { className: arrowClass }, arrowChar)
    ));
  });
  headerCells.push(React.createElement("th", { key: "actions" }, "Actions"));

  var bodyRows: React.ReactNode[] = [];
  sorted.forEach(function (alert: ILertAlert): void {
    var sevColor = getSeverityColor(alert.severity as LertSeverityV2);
    var handleClick = function (): void { props.onAlertClick(alert.id); };
    var handleAck = function (): void { props.onAcknowledge(alert.id); };
    var handleResolve = function (): void { props.onResolve(alert.id); };
    var handleSnooze = function (): void { props.onSnooze(alert.id, 30); };

    var actionBtns: React.ReactNode[] = [];
    if (alert.state === "triggered") {
      actionBtns.push(React.createElement("button", {
        key: "ack", className: styles.actionBtn, onClick: handleAck, type: "button",
        "aria-label": "Acknowledge", title: "Acknowledge",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--Completed" })));
    }
    if (alert.state !== "resolved") {
      actionBtns.push(React.createElement("button", {
        key: "res", className: styles.actionBtn, onClick: handleResolve, type: "button",
        "aria-label": "Resolve", title: "Resolve",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--CheckMark" })));
      actionBtns.push(React.createElement("button", {
        key: "snz", className: styles.actionBtn, onClick: handleSnooze, type: "button",
        "aria-label": "Snooze 30 minutes", title: "Snooze 30m",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--Snooze" })));
    }

    bodyRows.push(React.createElement("tr", {
      key: alert.id,
      onClick: handleClick,
      tabIndex: 0,
      style: { cursor: "pointer" },
    },
      React.createElement("td", undefined,
        React.createElement("div", { className: styles.severityCell },
          React.createElement("span", { className: styles.severityDot, style: { backgroundColor: sevColor } }),
          alert.severity.charAt(0).toUpperCase() + alert.severity.substring(1)
        )
      ),
      React.createElement("td", { className: styles.titleCell }, alert.title),
      React.createElement("td", undefined, alert.source),
      React.createElement("td", undefined, alert.category),
      React.createElement("td", undefined, formatTimeAgo(alert.triggeredAt)),
      React.createElement("td", undefined,
        React.createElement("span", {
          className: styles.stateBadge,
          style: { backgroundColor: getStateColor(alert.state as LertAlertState) },
        }, getStateLabel(alert.state as LertAlertState))
      ),
      React.createElement("td", undefined,
        React.createElement("div", { className: styles.actionCell }, actionBtns)
      )
    ));
  });

  return React.createElement("div", {
    className: styles.tableWrapper,
    role: "region",
    "aria-label": "Alert table",
  },
    React.createElement("table", { className: styles.alertTable, role: "grid" },
      React.createElement("thead", undefined,
        React.createElement("tr", undefined, headerCells)
      ),
      React.createElement("tbody", undefined, bodyRows)
    )
  );
};

export default TableLayout;
