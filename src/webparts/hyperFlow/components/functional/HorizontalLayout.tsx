// ============================================================
// HyperFlow — HorizontalLayout
// Horizontal stepper: row of step circles with connector lines,
// status-colored circles, step numbers/icons, and metadata.
// ============================================================

import * as React from "react";
import styles from "./FlowFunctionalRenderer.module.scss";
import type {
  IFlowProcess,
  IFlowStep,
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

/** Map step status to its designated color */
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

/** Map step status to a badge background + text color */
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

/** Map status to an icon name for the circle content */
function getStatusIcon(status: FlowStepStatus): string {
  if (status === "completed") { return "check"; }
  if (status === "in-progress") { return "play"; }
  if (status === "blocked") { return "lock"; }
  if (status === "skipped") { return "eye"; }
  return "";
}

/** Sort steps by order field */
function sortSteps(steps: IFlowStep[]): IFlowStep[] {
  var sorted: IFlowStep[] = [];
  steps.forEach(function (step) { sorted.push(step); });
  sorted.sort(function (a, b) { return a.order - b.order; });
  return sorted;
}

var HorizontalLayout: React.FC<IFunctionalLayoutProps> = function (props) {
  var sortedSteps = React.useMemo(function () {
    return sortSteps(props.process.steps);
  }, [props.process.steps]);

  var currentStepId = props.process.currentStepId;
  var elements: React.ReactElement[] = [];

  sortedSteps.forEach(function (step, index) {
    var isCurrent = step.id === currentStepId;
    var statusColor = getStatusColor(step.status);

    // Build circle content
    var circleChildren: React.ReactElement[] = [];

    if (props.showStepNumbers) {
      circleChildren.push(
        React.createElement("span", {
          key: "num",
          style: {
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: 1,
          },
        }, String(index + 1))
      );
    } else if (step.icon) {
      circleChildren.push(
        React.createElement(FlowIcon, {
          key: "icon",
          name: step.icon,
          size: 20,
          color: "white",
        })
      );
    } else {
      // Show status icon as fallback
      var statusIcon = getStatusIcon(step.status);
      if (statusIcon) {
        circleChildren.push(
          React.createElement(FlowIcon, {
            key: "si",
            name: statusIcon,
            size: 20,
            color: "white",
          })
        );
      } else {
        circleChildren.push(
          React.createElement("span", {
            key: "num-fallback",
            style: { fontSize: "14px", fontWeight: 700 },
          }, String(index + 1))
        );
      }
    }

    // Circle class — add current highlight
    var circleClass = styles.stepCircle;
    if (isCurrent) {
      circleClass = circleClass + " " + styles.stepCircleCurrent;
    }

    // Step node children
    var nodeChildren: React.ReactElement[] = [];

    // Circle
    nodeChildren.push(
      React.createElement("div", {
        key: "circle",
        className: circleClass,
        style: { backgroundColor: statusColor },
        "aria-label": "Step " + (index + 1) + " " + step.title + " - " + getStepStatusDisplayName(step.status),
      }, circleChildren)
    );

    // Title
    nodeChildren.push(
      React.createElement("div", {
        key: "title",
        className: styles.stepTitle,
      }, step.title)
    );

    // Description
    if (step.description) {
      nodeChildren.push(
        React.createElement("div", {
          key: "desc",
          className: styles.stepDesc,
        }, step.description)
      );
    }

    // Assignee
    if (step.assignee) {
      nodeChildren.push(
        React.createElement("div", {
          key: "assignee",
          className: styles.stepAssignee,
        },
          React.createElement(FlowIcon, { name: "user", size: 10, color: "#a0aec0" }),
          " ",
          step.assignee
        )
      );
    }

    // Status badge
    nodeChildren.push(
      React.createElement("span", {
        key: "badge",
        className: styles.stepStatusBadge,
        style: getStatusBadgeStyle(step.status),
      }, getStepStatusDisplayName(step.status))
    );

    // Push step node
    elements.push(
      React.createElement("div", {
        key: "step-" + step.id,
        className: styles.stepNode,
        role: "listitem",
      }, nodeChildren)
    );

    // Connector between steps (not after last)
    if (index < sortedSteps.length - 1) {
      var connectorColor = props.theme.connectorColor;

      var connectorChildren: React.ReactElement[] = [];
      connectorChildren.push(
        React.createElement("div", {
          key: "line",
          className: styles.stepConnectorLine,
          style: { backgroundColor: connectorColor },
        })
      );

      elements.push(
        React.createElement("div", {
          key: "conn-" + step.id,
          className: styles.stepConnector,
          "aria-hidden": "true",
        }, connectorChildren)
      );
    }
  });

  return React.createElement("div", {
    className: styles.horizontalStepper,
    role: "list",
    "aria-label": "Horizontal process stepper",
  }, elements);
};

export default HorizontalLayout;
