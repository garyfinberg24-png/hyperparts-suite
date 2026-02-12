import * as React from "react";
import type { ILertLayoutProps } from "./ILertLayoutProps";
import type { ILertAlert } from "../../models/ILertAlert";
import { getSeverityColor } from "../../models/IHyperLertV2Enums";
import type { LertSeverityV2, LertAlertState } from "../../models/IHyperLertV2Enums";
import HyperLertKpiBar from "../HyperLertKpiBar";
import HyperLertAlertDetail from "../HyperLertAlertDetail";
import styles from "./CommandCenterLayout.module.scss";

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

/** Sort alerts: severity order (critical first), then most recent */
function sortAlerts(alerts: ILertAlert[]): ILertAlert[] {
  var severityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };
  var sorted: ILertAlert[] = [];
  alerts.forEach(function (a: ILertAlert): void { sorted.push(a); });
  sorted.sort(function (a: ILertAlert, b: ILertAlert): number {
    var sa = severityOrder[a.severity] !== undefined ? severityOrder[a.severity] : 5;
    var sb = severityOrder[b.severity] !== undefined ? severityOrder[b.severity] : 5;
    if (sa !== sb) return sa - sb;
    return new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime();
  });
  return sorted;
}

const CommandCenterLayout: React.FC<ILertLayoutProps> = function (props) {
  if (props.alerts.length === 0) {
    return React.createElement("div", { className: styles.commandCenter },
      props.showKpi ? React.createElement("div", { className: styles.kpiRow },
        React.createElement(HyperLertKpiBar, { kpiCards: props.kpiCards })
      ) : undefined,
      React.createElement("div", { className: styles.emptyState },
        React.createElement("i", { className: "ms-Icon ms-Icon--Completed" }),
        React.createElement("p", undefined, "No alerts to display")
      )
    );
  }

  var sorted = sortAlerts(props.alerts);
  var selectedAlert: ILertAlert | undefined = undefined;
  sorted.forEach(function (a: ILertAlert): void {
    if (a.id === props.selectedAlertId) selectedAlert = a;
  });

  var feedCards: React.ReactNode[] = [];
  sorted.forEach(function (alert: ILertAlert): void {
    var isSelected = alert.id === props.selectedAlertId;
    var cardClass = isSelected ? styles.alertCardSelected : styles.alertCard;
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
        key: "ack", className: styles.cardActionBtn, onClick: handleAck, type: "button", "aria-label": "Acknowledge",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--Completed" }), "Ack"));
    }
    if (alert.state !== "resolved") {
      actionBtns.push(React.createElement("button", {
        key: "res", className: styles.cardActionBtn, onClick: handleResolve, type: "button", "aria-label": "Resolve",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--CheckMark" }), "Resolve"));
      actionBtns.push(React.createElement("button", {
        key: "snz", className: styles.cardActionBtn, onClick: handleSnooze, type: "button", "aria-label": "Snooze 30m",
      }, React.createElement("i", { className: "ms-Icon ms-Icon--Snooze" }), "Snooze"));
    }

    feedCards.push(React.createElement("div", {
      key: alert.id,
      className: cardClass,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      tabIndex: 0,
      role: "button",
      "aria-label": alert.title,
      "aria-pressed": isSelected,
    },
      React.createElement("div", { className: styles.severityBar, style: { backgroundColor: sevColor } }),
      React.createElement("div", { className: styles.cardContent },
        React.createElement("div", { className: styles.cardHeader },
          React.createElement("span", { className: styles.cardTitle }, alert.title),
          React.createElement("span", { className: styles.cardTime }, formatTimeAgo(alert.triggeredAt))
        ),
        React.createElement("div", { className: styles.cardMeta },
          React.createElement("span", { className: styles.cardSource }, alert.source),
          React.createElement("span", {
            className: styles.cardStateBadge,
            style: { backgroundColor: getStateColor(alert.state as LertAlertState) },
          }, getStateLabel(alert.state as LertAlertState))
        ),
        actionBtns.length > 0
          ? React.createElement("div", { className: styles.cardActions }, actionBtns)
          : undefined
      )
    ));
  });

  return React.createElement("div", {
    className: styles.commandCenter,
    role: "region",
    "aria-label": "Command Center",
  },
    props.showKpi ? React.createElement("div", { className: styles.kpiRow },
      React.createElement(HyperLertKpiBar, { kpiCards: props.kpiCards })
    ) : undefined,
    React.createElement("div", { className: styles.mainPanel },
      React.createElement("div", {
        className: styles.feedPanel,
        role: "list",
        "aria-label": "Alert feed",
      }, feedCards),
      React.createElement("div", { className: styles.detailPanel },
        React.createElement(HyperLertAlertDetail, {
          alert: selectedAlert,
          onAcknowledge: props.onAcknowledge,
          onResolve: props.onResolve,
          onSnooze: props.onSnooze,
        })
      )
    )
  );
};

export default CommandCenterLayout;
