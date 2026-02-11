import * as React from "react";
import type { ILertLayoutProps } from "./ILertLayoutProps";
import type { ILertAlert } from "../../models/ILertAlert";
import { getSeverityColor } from "../../models/IHyperLertV2Enums";
import type { LertSeverityV2 } from "../../models/IHyperLertV2Enums";
import HyperLertAlertDetail from "../HyperLertAlertDetail";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles: Record<string, string> = require("./InboxLayout.module.scss");

type InboxTab = "all" | "unread" | "critical" | "archived";

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

function filterByTab(alerts: ILertAlert[], tab: InboxTab): ILertAlert[] {
  var result: ILertAlert[] = [];
  alerts.forEach(function (a: ILertAlert): void {
    switch (tab) {
      case "all":
        if (!a.isArchived) result.push(a);
        break;
      case "unread":
        if (!a.isRead && !a.isArchived) result.push(a);
        break;
      case "critical":
        if (a.severity === "critical" && !a.isArchived) result.push(a);
        break;
      case "archived":
        if (a.isArchived) result.push(a);
        break;
    }
  });
  return result;
}

function countUnread(alerts: ILertAlert[]): number {
  var count = 0;
  alerts.forEach(function (a: ILertAlert): void {
    if (!a.isRead && !a.isArchived) count++;
  });
  return count;
}

function countCritical(alerts: ILertAlert[]): number {
  var count = 0;
  alerts.forEach(function (a: ILertAlert): void {
    if (a.severity === "critical" && !a.isArchived) count++;
  });
  return count;
}

const InboxLayout: React.FC<ILertLayoutProps> = function (props) {
  var tabState = React.useState<InboxTab>("all");
  var activeTab = tabState[0];
  var setActiveTab = tabState[1];

  var filtered = filterByTab(props.alerts, activeTab);
  var unreadCount = countUnread(props.alerts);
  var criticalCount = countCritical(props.alerts);

  var selectedAlert: ILertAlert | undefined = undefined;
  filtered.forEach(function (a: ILertAlert): void {
    if (a.id === props.selectedAlertId) selectedAlert = a;
  });

  var tabs: Array<{ id: InboxTab; label: string; count: number | undefined }> = [
    { id: "all", label: "All", count: undefined },
    { id: "unread", label: "Unread", count: unreadCount > 0 ? unreadCount : undefined },
    { id: "critical", label: "Critical", count: criticalCount > 0 ? criticalCount : undefined },
    { id: "archived", label: "Archived", count: undefined },
  ];

  var tabElements: React.ReactNode[] = [];
  tabs.forEach(function (tab: { id: InboxTab; label: string; count: number | undefined }): void {
    var isActive = tab.id === activeTab;
    var tabClass = isActive ? styles.tabActive : styles.tab;
    var handleClick = function (): void { setActiveTab(tab.id); };

    var children: React.ReactNode[] = [tab.label];
    if (tab.count !== undefined) {
      children.push(React.createElement("span", { key: "badge", className: styles.tabBadge }, String(tab.count)));
    }

    tabElements.push(React.createElement("button", {
      key: tab.id,
      className: tabClass,
      onClick: handleClick,
      type: "button",
      role: "tab",
      "aria-selected": isActive,
      "aria-controls": "lert-inbox-list",
    }, children));
  });

  if (props.alerts.length === 0) {
    return React.createElement("div", { className: styles.inbox },
      React.createElement("div", { className: styles.tabBar, role: "tablist" }, tabElements),
      React.createElement("div", { className: styles.emptyState },
        React.createElement("i", { className: "ms-Icon ms-Icon--Inbox" }),
        React.createElement("p", undefined, "No alerts to display")
      )
    );
  }

  var messageRows: React.ReactNode[] = [];
  filtered.forEach(function (alert: ILertAlert): void {
    var isSelected = alert.id === props.selectedAlertId;
    var isUnread = !alert.isRead;
    var rowClasses: string[] = [];
    if (isSelected) rowClasses.push(styles.messageRowSelected);
    else rowClasses.push(styles.messageRow);
    if (isUnread) rowClasses.push(styles.messageRowUnread);
    var rowClass = rowClasses.join(" ");

    var handleClick = function (): void { props.onAlertClick(alert.id); };
    var handleKeyDown = function (e: React.KeyboardEvent): void {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); props.onAlertClick(alert.id); }
    };

    messageRows.push(React.createElement("div", {
      key: alert.id,
      className: rowClass,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      tabIndex: 0,
      role: "option",
      "aria-selected": isSelected,
    },
      React.createElement("div", { className: styles.severityDot, style: {
        backgroundColor: getSeverityColor(alert.severity as LertSeverityV2),
      } }),
      React.createElement("div", { className: styles.messageContent },
        React.createElement("div", { className: styles.messageTitle }, alert.title),
        React.createElement("div", { className: styles.messageSource }, alert.source)
      ),
      React.createElement("span", { className: styles.messageTime }, formatTimeAgo(alert.triggeredAt))
    ));
  });

  return React.createElement("div", {
    className: styles.inbox,
    role: "region",
    "aria-label": "Alert inbox",
  },
    React.createElement("div", { className: styles.tabBar, role: "tablist" }, tabElements),
    React.createElement("div", { className: styles.inboxBody },
      React.createElement("div", {
        id: "lert-inbox-list",
        className: styles.messageList,
        role: "listbox",
        "aria-label": "Alert messages",
      }, messageRows.length > 0 ? messageRows : React.createElement("div", { className: styles.emptyState },
        React.createElement("p", undefined, "No alerts in this view")
      )),
      React.createElement("div", { className: styles.previewPane },
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

export default InboxLayout;
