import * as React from "react";
import type { ILertLayoutProps } from "./ILertLayoutProps";
import type { ILertAlert } from "../../models/ILertAlert";
import { getSeverityColor } from "../../models/IHyperLertV2Enums";
import type { LertSeverityV2, LertAlertState } from "../../models/IHyperLertV2Enums";
import styles from "./CompactLayout.module.scss";

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
    case "acknowledged": return "Ack'd";
    case "resolved": return "Resolved";
    case "snoozed": return "Snoozed";
    case "escalated": return "Escalated";
    case "expired": return "Expired";
    default: return String(state);
  }
}

const CompactLayout: React.FC<ILertLayoutProps> = function (props) {
  if (props.alerts.length === 0) {
    return React.createElement("div", { className: styles.emptyState },
      React.createElement("i", { className: "ms-Icon ms-Icon--BulletedList" }),
      React.createElement("p", undefined, "No alerts to display")
    );
  }

  var rows: React.ReactNode[] = [];
  props.alerts.forEach(function (alert: ILertAlert): void {
    var isUnread = !alert.isRead;
    var rowClass = isUnread ? styles.compactRowUnread : styles.compactRow;
    var sevColor = getSeverityColor(alert.severity as LertSeverityV2);

    var handleClick = function (): void { props.onAlertClick(alert.id); };
    var handleAck = function (e: React.MouseEvent): void { e.stopPropagation(); props.onAcknowledge(alert.id); };
    var handleResolve = function (e: React.MouseEvent): void { e.stopPropagation(); props.onResolve(alert.id); };
    var handleSnooze = function (e: React.MouseEvent): void { e.stopPropagation(); props.onSnooze(alert.id, 30); };
    var handleKeyDown = function (e: React.KeyboardEvent): void {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); props.onAlertClick(alert.id); }
    };

    var actionBtns: React.ReactNode[] = [];
    if (alert.state === "triggered") {
      actionBtns.push(React.createElement("button", {
        key: "ack", className: styles.rowActionBtn, onClick: handleAck, type: "button",
        "aria-label": "Acknowledge", title: "Acknowledge",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--Completed" })));
    }
    if (alert.state !== "resolved") {
      actionBtns.push(React.createElement("button", {
        key: "res", className: styles.rowActionBtn, onClick: handleResolve, type: "button",
        "aria-label": "Resolve", title: "Resolve",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--CheckMark" })));
      actionBtns.push(React.createElement("button", {
        key: "snz", className: styles.rowActionBtn, onClick: handleSnooze, type: "button",
        "aria-label": "Snooze 30 minutes", title: "Snooze 30m",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--Snooze" })));
    }

    rows.push(React.createElement("div", {
      key: alert.id,
      className: rowClass,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      tabIndex: 0,
      role: "row",
    },
      React.createElement("span", { className: styles.severityDot, style: { backgroundColor: sevColor } }),
      React.createElement("span", { className: styles.rowTitle }, alert.title),
      React.createElement("span", { className: styles.rowSource }, alert.source),
      React.createElement("span", { className: styles.rowCategory }, alert.category),
      React.createElement("span", { className: styles.rowTime }, formatTimeAgo(alert.triggeredAt)),
      React.createElement("span", {
        className: styles.rowStateBadge,
        style: { backgroundColor: getStateColor(alert.state as LertAlertState) },
      }, getStateLabel(alert.state as LertAlertState)),
      React.createElement("div", { className: styles.rowActions }, actionBtns)
    ));
  });

  return React.createElement("div", {
    className: styles.compactList,
    role: "grid",
    "aria-label": "Compact alert list",
  }, rows);
};

export default CompactLayout;
