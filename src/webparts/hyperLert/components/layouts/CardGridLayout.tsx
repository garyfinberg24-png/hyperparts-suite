import * as React from "react";
import type { ILertLayoutProps } from "./ILertLayoutProps";
import type { ILertAlert } from "../../models/ILertAlert";
import { getSeverityColor, getSeverityIcon } from "../../models/IHyperLertV2Enums";
import type { LertSeverityV2, LertAlertState } from "../../models/IHyperLertV2Enums";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles: Record<string, string> = require("./CardGridLayout.module.scss");

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

const CardGridLayout: React.FC<ILertLayoutProps> = function (props) {
  if (props.alerts.length === 0) {
    return React.createElement("div", { className: styles.cardGrid },
      React.createElement("div", { className: styles.emptyState },
        React.createElement("i", { className: "ms-Icon ms-Icon--GridViewMedium" }),
        React.createElement("p", undefined, "No alerts to display")
      )
    );
  }

  var cardElements: React.ReactNode[] = [];
  props.alerts.forEach(function (alert: ILertAlert): void {
    var sevColor = getSeverityColor(alert.severity as LertSeverityV2);
    var sevIcon = getSeverityIcon(alert.severity as LertSeverityV2);

    var handleClick = function (): void { props.onAlertClick(alert.id); };
    var handleAck = function (e: React.MouseEvent): void { e.stopPropagation(); props.onAcknowledge(alert.id); };
    var handleResolve = function (e: React.MouseEvent): void { e.stopPropagation(); props.onResolve(alert.id); };
    var handleSnoozeChange = function (e: React.ChangeEvent<HTMLSelectElement>): void {
      e.stopPropagation();
      var minutes = parseInt(e.target.value, 10);
      if (!isNaN(minutes) && minutes > 0) {
        props.onSnooze(alert.id, minutes);
      }
    };
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
      actionBtns.push(React.createElement("select", {
        key: "snz",
        className: styles.snoozeSelect,
        onChange: handleSnoozeChange,
        onClick: function (e: React.MouseEvent): void { e.stopPropagation(); },
        defaultValue: "",
        "aria-label": "Snooze duration",
      },
        React.createElement("option", { value: "", disabled: true }, "Snooze..."),
        React.createElement("option", { value: "5" }, "5 min"),
        React.createElement("option", { value: "15" }, "15 min"),
        React.createElement("option", { value: "30" }, "30 min"),
        React.createElement("option", { value: "60" }, "1 hour"),
        React.createElement("option", { value: "240" }, "4 hours")
      ));
    }

    cardElements.push(React.createElement("div", {
      key: alert.id,
      className: styles.card,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      tabIndex: 0,
      role: "button",
      "aria-label": alert.severity + " alert: " + alert.title,
    },
      React.createElement("div", { className: styles.cardTopBorder, style: { backgroundColor: sevColor } }),
      React.createElement("div", { className: styles.severityCorner, style: { backgroundColor: sevColor } }),
      React.createElement("div", { className: styles.cardBody },
        React.createElement("div", { className: styles.cardHeaderRow },
          React.createElement("div", {
            className: styles.cardIcon,
            style: { backgroundColor: sevColor },
          },
            React.createElement("i", { className: "ms-Icon ms-Icon--" + sevIcon })
          ),
          React.createElement("div", { className: styles.cardTitleWrap },
            React.createElement("h4", { className: styles.cardTitle }, alert.title)
          )
        ),
        alert.description
          ? React.createElement("p", { className: styles.cardDescription }, alert.description)
          : undefined,
        React.createElement("div", { className: styles.cardMetaRow },
          React.createElement("span", { className: styles.cardSource },
            React.createElement("i", { className: "ms-Icon ms-Icon--Database" }),
            " " + alert.source
          ),
          React.createElement("span", { className: styles.cardTime }, formatTimeAgo(alert.triggeredAt))
        ),
        React.createElement("span", {
          className: styles.cardStateBadge,
          style: { backgroundColor: getStateColor(alert.state as LertAlertState) },
        }, getStateLabel(alert.state as LertAlertState)),
        actionBtns.length > 0
          ? React.createElement("div", { className: styles.cardActions }, actionBtns)
          : undefined
      )
    ));
  });

  return React.createElement("div", {
    className: styles.cardGrid,
    role: "list",
    "aria-label": "Alert cards",
  }, cardElements);
};

export default CardGridLayout;
