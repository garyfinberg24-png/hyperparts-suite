import * as React from "react";
import { useHyperLertStore } from "../store/useHyperLertStore";
import styles from "./HyperLertToolbar.module.scss";

export interface IHyperLertToolbarProps {
  title: string;
  activeRuleCount: number;
  activeAlertCount: number;
  onAddRule: () => void;
  onRefresh: () => void;
}

const HyperLertToolbar: React.FC<IHyperLertToolbarProps> = function (props) {
  const toggleFilters = useHyperLertStore(function (s) { return s.toggleFilters; });
  const openHistory = useHyperLertStore(function (s) { return s.openHistory; });

  return React.createElement(
    "div",
    { className: styles.toolbar },
    // Title + count badge
    React.createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "8px" } },
      React.createElement("h2", { className: styles.title }, props.title),
      props.activeAlertCount > 0
        ? React.createElement(
            "span",
            {
              className: styles.badge,
              role: "status",
              "aria-label": props.activeAlertCount + " active alerts",
            },
            String(props.activeAlertCount)
          )
        : undefined
    ),
    // Action buttons
    React.createElement(
      "div",
      { className: styles.actions },
      React.createElement(
        "button",
        {
          className: styles.btnPrimary,
          onClick: props.onAddRule,
          type: "button",
          "aria-label": "Add alert rule",
        },
        "+ Add Rule"
      ),
      React.createElement(
        "button",
        {
          className: styles.btn,
          onClick: toggleFilters,
          type: "button",
          "aria-label": "Toggle filters",
        },
        "Filter"
      ),
      React.createElement(
        "button",
        {
          className: styles.btn,
          onClick: openHistory,
          type: "button",
          "aria-label": "View alert history",
        },
        "History"
      ),
      React.createElement(
        "button",
        {
          className: styles.btn,
          onClick: props.onRefresh,
          type: "button",
          "aria-label": "Refresh alerts",
        },
        "Refresh"
      )
    )
  );
};

export default HyperLertToolbar;
