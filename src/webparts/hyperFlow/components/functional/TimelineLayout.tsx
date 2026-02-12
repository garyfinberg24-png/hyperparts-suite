// ============================================================
// HyperFlow — TimelineLayout
// Vertical timeline: colored line on the left, status dots,
// step cards with title, description, assignee, due date,
// and subtask checklists.
// ============================================================

import * as React from "react";
import styles from "./FlowFunctionalRenderer.module.scss";
import type {
  IFlowProcess,
  IFlowStep,
  IFlowSubtask,
  IFlowColorThemeDefinition,
  FlowStepStatus,
} from "../../models";
import { getStepStatusDisplayName } from "../../models";
import FlowIcon from "../../utils/FlowIcon";

export interface IFunctionalLayoutProps {
  process: IFlowProcess;
  theme: IFlowColorThemeDefinition;
  showStepNumbers: boolean;
  showConnectorLabels: boolean;
}

/** Map step status to color */
function getStatusColor(status: FlowStepStatus): string {
  var STATUS_COLORS: Record<string, string> = {
    "completed": "#059669",
    "in-progress": "#0078d4",
    "not-started": "#9ca3af",
    "blocked": "#dc2626",
    "skipped": "#f59e0b",
  };
  return STATUS_COLORS[status] || "#9ca3af";
}

/** Map status to badge style */
function getStatusBadgeStyle(status: FlowStepStatus): React.CSSProperties {
  var bg: string;
  var color: string;
  if (status === "completed") {
    bg = "#d1fae5"; color = "#065f46";
  } else if (status === "in-progress") {
    bg = "#dbeafe"; color = "#1e40af";
  } else if (status === "blocked") {
    bg = "#fee2e2"; color = "#991b1b";
  } else if (status === "skipped") {
    bg = "#fef3c7"; color = "#92400e";
  } else {
    bg = "#f3f4f6"; color = "#4b5563";
  }
  return { backgroundColor: bg, color: color };
}

/** Sort steps by order field */
function sortSteps(steps: IFlowStep[]): IFlowStep[] {
  var sorted: IFlowStep[] = [];
  steps.forEach(function (step) { sorted.push(step); });
  sorted.sort(function (a, b) { return a.order - b.order; });
  return sorted;
}

/** Render a single subtask item */
function renderSubtask(subtask: IFlowSubtask): React.ReactElement {
  var checkClass = styles.subtaskCheck;
  if (subtask.completed) {
    checkClass = checkClass + " " + styles.subtaskCheckDone;
  }

  var textClass = subtask.completed ? styles.subtaskTextDone : undefined;

  var checkChildren: React.ReactElement[] = [];
  if (subtask.completed) {
    checkChildren.push(
      React.createElement(FlowIcon, {
        key: "ci",
        name: "check",
        size: 10,
        color: "white",
      })
    );
  }

  return React.createElement("div", {
    key: subtask.id,
    className: styles.subtaskItem,
  },
    React.createElement("div", { className: checkClass }, checkChildren),
    React.createElement("span", { className: textClass }, subtask.title)
  );
}

var TimelineLayout: React.FC<IFunctionalLayoutProps> = function (props) {
  var sortedSteps = React.useMemo(function () {
    return sortSteps(props.process.steps);
  }, [props.process.steps]);

  var theme = props.theme;

  // Timeline line (uses theme primary for the vertical line)
  var timelineLineEl = React.createElement("div", {
    className: styles.timelineLine,
    style: { backgroundColor: theme.connectorColor },
    "aria-hidden": "true",
  });

  // Build step items
  var items: React.ReactElement[] = [];

  sortedSteps.forEach(function (step, index) {
    var statusColor = getStatusColor(step.status);

    // Dot
    var dotEl = React.createElement("div", {
      className: styles.timelineDot,
      style: {
        backgroundColor: statusColor,
        boxShadow: "0 0 0 2px " + statusColor,
      },
    });

    // Card children
    var cardChildren: React.ReactElement[] = [];

    // Title row: step number + title + status badge
    var titleParts: React.ReactElement[] = [];

    if (props.showStepNumbers) {
      titleParts.push(
        React.createElement("span", {
          key: "num",
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: statusColor,
            color: "white",
            fontSize: "10px",
            fontWeight: 700,
            marginRight: "8px",
            flexShrink: 0,
          },
        }, String(index + 1))
      );
    }

    titleParts.push(
      React.createElement("span", { key: "t" }, step.title)
    );

    titleParts.push(
      React.createElement("span", {
        key: "badge",
        className: styles.stepStatusBadge,
        style: getStatusBadgeStyle(step.status),
      }, getStepStatusDisplayName(step.status))
    );

    cardChildren.push(
      React.createElement("div", {
        key: "title",
        className: styles.timelineCardTitle,
        style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
      }, titleParts)
    );

    // Description
    if (step.description) {
      cardChildren.push(
        React.createElement("div", {
          key: "desc",
          className: styles.timelineCardDesc,
        }, step.description)
      );
    }

    // Meta row: assignee + due date
    var metaItems: React.ReactElement[] = [];

    if (step.assignee) {
      metaItems.push(
        React.createElement("span", {
          key: "assignee",
          className: styles.timelineCardMetaItem,
        },
          React.createElement(FlowIcon, { name: "user", size: 12, color: "#a0aec0" }),
          " ",
          step.assignee
        )
      );
    }

    if (step.dueDate) {
      metaItems.push(
        React.createElement("span", {
          key: "due",
          className: styles.timelineCardMetaItem,
        },
          React.createElement(FlowIcon, { name: "clock", size: 12, color: "#a0aec0" }),
          " ",
          step.dueDate
        )
      );
    }

    if (metaItems.length > 0) {
      cardChildren.push(
        React.createElement("div", {
          key: "meta",
          className: styles.timelineCardMeta,
        }, metaItems)
      );
    }

    // Subtasks
    if (step.subtasks && step.subtasks.length > 0) {
      var subtaskElements: React.ReactElement[] = [];
      step.subtasks.forEach(function (st) {
        subtaskElements.push(renderSubtask(st));
      });

      cardChildren.push(
        React.createElement("div", {
          key: "subtasks",
          className: styles.timelineSubtasks,
        }, subtaskElements)
      );
    }

    // Card
    var cardEl = React.createElement("div", {
      className: styles.timelineCard,
      style: { borderLeftColor: statusColor, borderLeftWidth: "3px" },
    }, cardChildren);

    // Timeline item
    items.push(
      React.createElement("div", {
        key: "item-" + step.id,
        className: styles.timelineItem,
        role: "listitem",
        "aria-label": "Step " + (index + 1) + ": " + step.title + " - " + getStepStatusDisplayName(step.status),
      }, dotEl, cardEl)
    );
  });

  return React.createElement("div", {
    className: styles.timelineContainer,
    role: "list",
    "aria-label": "Timeline process view",
  }, timelineLineEl, items);
};

export default TimelineLayout;
