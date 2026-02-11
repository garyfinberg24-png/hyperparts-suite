import * as React from "react";
import type { ILertLayoutProps } from "./ILertLayoutProps";
import type { ILertAlert } from "../../models/ILertAlert";
import { getSeverityColor } from "../../models/IHyperLertV2Enums";
import type { LertSeverityV2, LertAlertState } from "../../models/IHyperLertV2Enums";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles: Record<string, string> = require("./TimelineLayout.module.scss");

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

const TimelineLayout: React.FC<ILertLayoutProps> = function (props) {
  if (props.alerts.length === 0) {
    return React.createElement("div", { className: styles.emptyState },
      React.createElement("i", { className: "ms-Icon ms-Icon--TimelineProgress" }),
      React.createElement("p", undefined, "No alerts to display")
    );
  }

  // Sort by triggered time descending
  var sorted: ILertAlert[] = [];
  props.alerts.forEach(function (a: ILertAlert): void { sorted.push(a); });
  sorted.sort(function (a: ILertAlert, b: ILertAlert): number {
    return new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime();
  });

  var entries: React.ReactNode[] = [];
  sorted.forEach(function (alert: ILertAlert, idx: number): void {
    var isLeft = idx % 2 === 0;
    var entryClass = isLeft ? styles.timelineEntryLeft : styles.timelineEntryRight;
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
        key: "ack", className: styles.cardActionBtn, onClick: handleAck, type: "button",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--Completed" }), " Ack"));
    }
    if (alert.state !== "resolved") {
      actionBtns.push(React.createElement("button", {
        key: "res", className: styles.cardActionBtn, onClick: handleResolve, type: "button",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--CheckMark" }), " Resolve"));
      actionBtns.push(React.createElement("button", {
        key: "snz", className: styles.cardActionBtn, onClick: handleSnooze, type: "button",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--Snooze" }), " Snooze"));
    }

    var card = React.createElement("div", {
      className: styles.timelineCard,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      tabIndex: 0,
      role: "button",
      "aria-label": alert.title,
    },
      React.createElement("h4", { className: styles.cardTitle }, alert.title),
      alert.description
        ? React.createElement("p", { className: styles.cardDescription }, alert.description)
        : undefined,
      React.createElement("div", { className: styles.cardMeta },
        React.createElement("span", { className: styles.cardSource }, alert.source),
        React.createElement("span", {
          className: styles.stateBadge,
          style: { backgroundColor: getStateColor(alert.state as LertAlertState) },
        }, getStateLabel(alert.state as LertAlertState))
      ),
      actionBtns.length > 0
        ? React.createElement("div", { className: styles.cardActions }, actionBtns)
        : undefined
    );

    var timestamp = React.createElement("div", { className: styles.timelineTimestamp },
      formatTimeAgo(alert.triggeredAt)
    );

    entries.push(React.createElement("div", { key: alert.id, className: entryClass },
      React.createElement("div", {
        className: styles.timelineDot,
        style: { backgroundColor: sevColor },
      }),
      card,
      timestamp
    ));
  });

  return React.createElement("div", { className: styles.timelineWrapper },
    React.createElement("div", {
      className: styles.timeline,
      role: "list",
      "aria-label": "Alert timeline",
    }, entries)
  );
};

export default TimelineLayout;
