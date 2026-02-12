import * as React from "react";
import type { ILertLayoutProps } from "./ILertLayoutProps";
import type { ILertAlert } from "../../models/ILertAlert";
import { getSeverityColor } from "../../models/IHyperLertV2Enums";
import type { LertSeverityV2, LertAlertState } from "../../models/IHyperLertV2Enums";
import styles from "./KanbanLayout.module.scss";

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

interface IKanbanColumn {
  state: LertAlertState;
  label: string;
  bgClass: string;
}

var KANBAN_COLUMNS: IKanbanColumn[] = [
  { state: "triggered", label: "Triggered", bgClass: "columnTriggered" },
  { state: "acknowledged", label: "Acknowledged", bgClass: "columnAcknowledged" },
  { state: "resolved", label: "Resolved", bgClass: "columnResolved" },
];

const KanbanLayout: React.FC<ILertLayoutProps> = function (props) {
  if (props.alerts.length === 0) {
    return React.createElement("div", { className: styles.kanban },
      React.createElement("div", { className: styles.emptyState },
        React.createElement("i", { className: "ms-Icon ms-Icon--Taskboard" }),
        React.createElement("p", undefined, "No alerts to display")
      )
    );
  }

  // Group alerts by state
  var groups: Record<string, ILertAlert[]> = {};
  KANBAN_COLUMNS.forEach(function (col: IKanbanColumn): void {
    groups[col.state] = [];
  });
  props.alerts.forEach(function (alert: ILertAlert): void {
    if (groups[alert.state]) {
      groups[alert.state].push(alert);
    } else {
      // Put snoozed/escalated/expired into triggered column
      if (groups.triggered) {
        groups.triggered.push(alert);
      }
    }
  });

  var columnElements: React.ReactNode[] = [];
  KANBAN_COLUMNS.forEach(function (col: IKanbanColumn): void {
    var colAlerts = groups[col.state] || [];
    var bgClass = (styles as Record<string, string>)[col.bgClass] || "";

    var cardElements: React.ReactNode[] = [];
    colAlerts.forEach(function (alert: ILertAlert): void {
      var sevColor = getSeverityColor(alert.severity as LertSeverityV2);
      var handleClick = function (): void { props.onAlertClick(alert.id); };
      var handleKeyDown = function (e: React.KeyboardEvent): void {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); props.onAlertClick(alert.id); }
      };

      cardElements.push(React.createElement("div", {
        key: alert.id,
        className: styles.kanbanCard,
        style: { borderLeftColor: sevColor },
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        role: "button",
        "aria-label": alert.title,
      },
        React.createElement("div", { className: styles.kanbanCardTitle }, alert.title),
        React.createElement("div", { className: styles.kanbanCardSource }, alert.source),
        React.createElement("div", { className: styles.kanbanCardTime }, formatTimeAgo(alert.triggeredAt))
      ));
    });

    columnElements.push(React.createElement("div", {
      key: col.state,
      className: styles.kanbanColumn + " " + bgClass,
    },
      React.createElement("div", { className: styles.columnHeader },
        col.label,
        React.createElement("span", { className: styles.columnCount }, String(colAlerts.length))
      ),
      React.createElement("div", { className: styles.columnBody },
        cardElements.length > 0
          ? cardElements
          : React.createElement("div", { className: styles.emptyColumn }, "No alerts")
      )
    ));
  });

  return React.createElement("div", {
    className: styles.kanban,
    role: "region",
    "aria-label": "Kanban board",
  }, columnElements);
};

export default KanbanLayout;
