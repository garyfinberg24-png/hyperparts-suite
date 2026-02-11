import * as React from "react";
import type { ILertLayoutProps } from "./ILertLayoutProps";
import type { ILertAlert } from "../../models/ILertAlert";
import { getSeverityColor } from "../../models/IHyperLertV2Enums";
import type { LertSeverityV2 } from "../../models/IHyperLertV2Enums";
import HyperLertAlertDetail from "../HyperLertAlertDetail";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles: Record<string, string> = require("./SplitLayout.module.scss");

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

const SplitLayout: React.FC<ILertLayoutProps> = function (props) {
  if (props.alerts.length === 0) {
    return React.createElement("div", { className: styles.emptyState },
      React.createElement("i", { className: "ms-Icon ms-Icon--SplitObject" }),
      React.createElement("p", undefined, "No alerts to display")
    );
  }

  var selectedAlert: ILertAlert | undefined = undefined;
  props.alerts.forEach(function (a: ILertAlert): void {
    if (a.id === props.selectedAlertId) selectedAlert = a;
  });

  var listItems: React.ReactNode[] = [];
  props.alerts.forEach(function (alert: ILertAlert): void {
    var isSelected = alert.id === props.selectedAlertId;
    var itemClass = isSelected ? styles.listItemSelected : styles.listItem;
    var sevColor = getSeverityColor(alert.severity as LertSeverityV2);

    var handleClick = function (): void { props.onAlertClick(alert.id); };
    var handleKeyDown = function (e: React.KeyboardEvent): void {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); props.onAlertClick(alert.id); }
    };

    listItems.push(React.createElement("div", {
      key: alert.id,
      className: itemClass,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      tabIndex: 0,
      role: "option",
      "aria-selected": isSelected,
    },
      React.createElement("span", { className: styles.severityDot, style: { backgroundColor: sevColor } }),
      React.createElement("div", { className: styles.listItemContent },
        React.createElement("div", { className: styles.listItemTitle }, alert.title),
        React.createElement("div", { className: styles.listItemMeta },
          React.createElement("span", { className: styles.listItemSource }, alert.source)
        )
      ),
      React.createElement("span", { className: styles.listItemTime }, formatTimeAgo(alert.triggeredAt))
    ));
  });

  return React.createElement("div", {
    className: styles.splitView,
    role: "region",
    "aria-label": "Split view",
  },
    React.createElement("div", {
      className: styles.listPanel,
      role: "listbox",
      "aria-label": "Alert list",
    }, listItems),
    React.createElement("div", { className: styles.detailPanel },
      React.createElement(HyperLertAlertDetail, {
        alert: selectedAlert,
        onAcknowledge: props.onAcknowledge,
        onResolve: props.onResolve,
        onSnooze: props.onSnooze,
      })
    )
  );
};

export default SplitLayout;
