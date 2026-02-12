import * as React from "react";
import type { ILertAlert } from "../models/ILertAlert";
import { getSeverityColor } from "../models/IHyperLertV2Enums";
import type { LertSeverityV2, LertAlertState } from "../models/IHyperLertV2Enums";
import styles from "./HyperLertAlertDetail.module.scss";

export interface IHyperLertAlertDetailProps {
  alert: ILertAlert | undefined;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  onSnooze: (alertId: string, minutes: number) => void;
}

function formatTimestamp(isoString: string): string {
  if (!isoString) return "";
  var d = new Date(isoString);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var year = d.getFullYear();
  var hours = d.getHours();
  var mins = d.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  var minStr = mins < 10 ? "0" + mins : String(mins);
  return month + "/" + day + "/" + year + " " + hours + ":" + minStr + " " + ampm;
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

var SNOOZE_OPTIONS: Array<{ label: string; minutes: number }> = [
  { label: "5 minutes", minutes: 5 },
  { label: "15 minutes", minutes: 15 },
  { label: "30 minutes", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "4 hours", minutes: 240 },
];

const HyperLertAlertDetail: React.FC<IHyperLertAlertDetailProps> = function (props) {
  var alert = props.alert;
  var snoozeOpenState = React.useState<boolean>(false);
  var snoozeOpen = snoozeOpenState[0];
  var setSnoozeOpen = snoozeOpenState[1];

  if (!alert) {
    return React.createElement("div", { className: styles.emptyDetail },
      React.createElement("i", { className: "ms-Icon ms-Icon--AlertSolid" }),
      React.createElement("p", undefined, "Select an alert to view details")
    );
  }

  var alertId = alert.id;

  var handleAck = React.useCallback(function (): void {
    props.onAcknowledge(alertId);
  }, [alertId, props.onAcknowledge]);

  var handleResolve = React.useCallback(function (): void {
    props.onResolve(alertId);
  }, [alertId, props.onResolve]);

  var handleSnooze = React.useCallback(function (minutes: number): () => void {
    return function (): void {
      props.onSnooze(alertId, minutes);
      setSnoozeOpen(false);
    };
  }, [alertId, props.onSnooze, setSnoozeOpen]);

  var toggleSnooze = React.useCallback(function (): void {
    setSnoozeOpen(function (prev: boolean): boolean { return !prev; });
  }, [setSnoozeOpen]);

  // Severity badge
  var severityBadge = React.createElement("span", {
    className: styles.severityBadge,
    style: { backgroundColor: getSeverityColor(alert.severity as LertSeverityV2) },
  }, alert.severity.charAt(0).toUpperCase() + alert.severity.substring(1));

  // State badge
  var stateBadge = React.createElement("span", {
    className: styles.stateBadge,
    style: { backgroundColor: getStateColor(alert.state as LertAlertState) },
  }, getStateLabel(alert.state as LertAlertState));

  // Header
  var header = React.createElement("div", { className: styles.detailHeader },
    React.createElement("h3", { className: styles.detailTitle }, alert.title),
    severityBadge
  );

  // Description
  var descriptionEl = alert.description
    ? React.createElement("p", { className: styles.description }, alert.description)
    : undefined;

  // Source + Category + State badges
  var badgeElements: React.ReactNode[] = [];
  if (alert.source) {
    badgeElements.push(React.createElement("span", { key: "src", className: styles.sourceBadge },
      React.createElement("i", { className: "ms-Icon ms-Icon--Database" }),
      alert.source
    ));
  }
  if (alert.category) {
    badgeElements.push(React.createElement("span", { key: "cat", className: styles.categoryBadge },
      React.createElement("i", { className: "ms-Icon ms-Icon--Tag" }),
      alert.category
    ));
  }
  badgeElements.push(React.createElement("span", { key: "state" }, stateBadge));
  var badgeRow = React.createElement("div", { className: styles.badgeRow }, badgeElements);

  // Trigger Data table
  var triggerData = alert.triggerData;
  var triggerDataKeys = Object.keys(triggerData);
  var triggerTableEl: React.ReactElement | undefined = undefined;
  if (triggerDataKeys.length > 0) {
    var rows: React.ReactNode[] = [];
    triggerDataKeys.forEach(function (key: string): void {
      rows.push(React.createElement("tr", { key: key },
        React.createElement("td", undefined, key),
        React.createElement("td", undefined, triggerData[key])
      ));
    });
    triggerTableEl = React.createElement("div", undefined,
      React.createElement("div", { className: styles.sectionLabel }, "Trigger Data"),
      React.createElement("table", { className: styles.triggerTable },
        React.createElement("thead", undefined,
          React.createElement("tr", undefined,
            React.createElement("th", undefined, "Field"),
            React.createElement("th", undefined, "Value")
          )
        ),
        React.createElement("tbody", undefined, rows)
      )
    );
  }

  // Timeline
  var timelineItems: React.ReactNode[] = [];
  if (alert.triggeredAt) {
    timelineItems.push(React.createElement("div", { key: "triggered", className: styles.timelineItem },
      React.createElement("span", { className: styles.timelineDot, style: { backgroundColor: "#dc2626" } }),
      React.createElement("span", { className: styles.timelineLabel }, "Triggered"),
      React.createElement("span", { className: styles.timelineTime }, formatTimestamp(alert.triggeredAt))
    ));
  }
  if (alert.acknowledgedAt) {
    timelineItems.push(React.createElement("div", { key: "acked", className: styles.timelineItem },
      React.createElement("span", { className: styles.timelineDot, style: { backgroundColor: "#2563eb" } }),
      React.createElement("span", { className: styles.timelineLabel }, "Acknowledged"),
      React.createElement("span", { className: styles.timelineTime }, formatTimestamp(alert.acknowledgedAt)),
      alert.acknowledgedBy ? React.createElement("span", { className: styles.timelineUser }, "by " + alert.acknowledgedBy) : undefined
    ));
  }
  if (alert.resolvedAt) {
    timelineItems.push(React.createElement("div", { key: "resolved", className: styles.timelineItem },
      React.createElement("span", { className: styles.timelineDot, style: { backgroundColor: "#16a34a" } }),
      React.createElement("span", { className: styles.timelineLabel }, "Resolved"),
      React.createElement("span", { className: styles.timelineTime }, formatTimestamp(alert.resolvedAt)),
      alert.resolvedBy ? React.createElement("span", { className: styles.timelineUser }, "by " + alert.resolvedBy) : undefined
    ));
  }
  var timelineEl = timelineItems.length > 0
    ? React.createElement("div", undefined,
        React.createElement("div", { className: styles.sectionLabel }, "Timeline"),
        React.createElement("div", { className: styles.timeline }, timelineItems)
      )
    : undefined;

  // Escalation
  var escalationEl: React.ReactElement | undefined = undefined;
  if (alert.escalatedAt) {
    escalationEl = React.createElement("div", { className: styles.escalationRow },
      React.createElement("i", { className: "ms-Icon ms-Icon--Up" }),
      "Escalated to " + alert.escalatedTo + " at " + formatTimestamp(alert.escalatedAt)
    );
  }

  // Tags
  var tagsEl: React.ReactElement | undefined = undefined;
  if (alert.tags.length > 0) {
    var tagElements: React.ReactNode[] = [];
    alert.tags.forEach(function (tag: string, idx: number): void {
      tagElements.push(React.createElement("span", { key: idx, className: styles.tag }, tag));
    });
    tagsEl = React.createElement("div", undefined,
      React.createElement("div", { className: styles.sectionLabel }, "Tags"),
      React.createElement("div", { className: styles.tagsRow }, tagElements)
    );
  }

  // Notes
  var notesEl: React.ReactElement | undefined = undefined;
  if (alert.notes.length > 0) {
    var noteElements: React.ReactNode[] = [];
    alert.notes.forEach(function (note: string, idx: number): void {
      noteElements.push(React.createElement("div", { key: idx, className: styles.noteItem }, note));
    });
    notesEl = React.createElement("div", { className: styles.notesSection },
      React.createElement("div", { className: styles.sectionLabel }, "Notes"),
      noteElements
    );
  }

  // Snooze dropdown
  var snoozeMenuItems: React.ReactNode[] = [];
  SNOOZE_OPTIONS.forEach(function (opt: { label: string; minutes: number }): void {
    snoozeMenuItems.push(React.createElement("button", {
      key: opt.minutes,
      className: styles.snoozeMenuItem,
      onClick: handleSnooze(opt.minutes),
      type: "button",
    }, opt.label));
  });

  var snoozeDropdownEl = React.createElement("div", { className: styles.snoozeDropdown },
    React.createElement("button", {
      className: styles.snoozeBtn,
      onClick: toggleSnooze,
      type: "button",
      "aria-expanded": snoozeOpen,
      "aria-haspopup": "true",
    },
      React.createElement("i", { className: "ms-Icon ms-Icon--Snooze" }),
      "Snooze"
    ),
    snoozeOpen ? React.createElement("div", {
      className: styles.snoozeMenu,
      role: "menu",
    }, snoozeMenuItems) : undefined
  );

  // Action bar
  var actionBarChildren: React.ReactNode[] = [];
  if (alert.state === "triggered") {
    actionBarChildren.push(React.createElement("button", {
      key: "ack",
      className: styles.actionBtnPrimary,
      onClick: handleAck,
      type: "button",
    },
      React.createElement("i", { className: "ms-Icon ms-Icon--Completed" }),
      "Acknowledge"
    ));
  }
  if (alert.state !== "resolved") {
    actionBarChildren.push(React.createElement("button", {
      key: "resolve",
      className: styles.actionBtnSuccess,
      onClick: handleResolve,
      type: "button",
    },
      React.createElement("i", { className: "ms-Icon ms-Icon--CheckMark" }),
      "Resolve"
    ));
    actionBarChildren.push(React.createElement("span", { key: "snooze" }, snoozeDropdownEl));
  }
  var actionBar = React.createElement("div", { className: styles.actionBar }, actionBarChildren);

  return React.createElement("div", {
    className: styles.alertDetail,
    role: "region",
    "aria-label": "Alert details for " + alert.title,
  },
    header,
    descriptionEl,
    badgeRow,
    triggerTableEl,
    timelineEl,
    escalationEl,
    tagsEl,
    notesEl,
    actionBar
  );
};

export default HyperLertAlertDetail;
