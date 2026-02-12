// ============================================================
// HyperFlow — KanbanLayout
// Kanban board: steps grouped by status into columns.
// 5 possible columns (Not Started, In Progress, Completed,
// Blocked, Skipped) — only shown if they have steps.
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

/** Column order for kanban display */
var COLUMN_ORDER: FlowStepStatus[] = [
  "not-started",
  "in-progress",
  "completed",
  "blocked",
  "skipped",
];

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

/** Sort steps by order field */
function sortSteps(steps: IFlowStep[]): IFlowStep[] {
  var sorted: IFlowStep[] = [];
  steps.forEach(function (step) { sorted.push(step); });
  sorted.sort(function (a, b) { return a.order - b.order; });
  return sorted;
}

/** Group steps by status */
function groupByStatus(steps: IFlowStep[]): Record<string, IFlowStep[]> {
  var groups: Record<string, IFlowStep[]> = {};
  steps.forEach(function (step) {
    if (!groups[step.status]) {
      groups[step.status] = [];
    }
    groups[step.status].push(step);
  });
  return groups;
}

/** Calculate subtask progress percentage */
function getSubtaskProgress(step: IFlowStep): number {
  if (!step.subtasks || step.subtasks.length === 0) {
    return -1; // no subtasks
  }
  var completed = 0;
  step.subtasks.forEach(function (st) {
    if (st.completed) {
      completed = completed + 1;
    }
  });
  return Math.round((completed / step.subtasks.length) * 100);
}

/** Render a single kanban card */
function renderCard(step: IFlowStep, index: number, showStepNumbers: boolean): React.ReactElement {
  var cardChildren: React.ReactElement[] = [];

  // Title with optional step number
  var titleContent: React.ReactElement[] = [];
  if (showStepNumbers) {
    titleContent.push(
      React.createElement("span", {
        key: "num",
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: getStatusColor(step.status),
          color: "white",
          fontSize: "10px",
          fontWeight: 700,
          marginRight: "6px",
          flexShrink: 0,
        },
      }, String(step.order))
    );
  }
  titleContent.push(
    React.createElement("span", { key: "t" }, step.title)
  );

  cardChildren.push(
    React.createElement("div", {
      key: "title",
      className: styles.kanbanCardTitle,
      style: { display: "flex", alignItems: "center" },
    }, titleContent)
  );

  // Description
  if (step.description) {
    cardChildren.push(
      React.createElement("div", {
        key: "desc",
        className: styles.kanbanCardDesc,
      }, step.description)
    );
  }

  // Footer: assignee + due date
  var footerLeft: React.ReactElement[] = [];
  var footerRight: React.ReactElement[] = [];

  if (step.assignee) {
    footerLeft.push(
      React.createElement("span", {
        key: "assignee",
        style: { display: "flex", alignItems: "center", gap: "3px" },
      },
        React.createElement(FlowIcon, { name: "user", size: 10, color: "#a0aec0" }),
        step.assignee
      )
    );
  }

  if (step.dueDate) {
    footerRight.push(
      React.createElement("span", {
        key: "due",
        style: { display: "flex", alignItems: "center", gap: "3px" },
      },
        React.createElement(FlowIcon, { name: "clock", size: 10, color: "#a0aec0" }),
        step.dueDate
      )
    );
  }

  if (footerLeft.length > 0 || footerRight.length > 0) {
    cardChildren.push(
      React.createElement("div", {
        key: "footer",
        className: styles.kanbanCardFooter,
      },
        React.createElement("span", { key: "left" }, footerLeft),
        React.createElement("span", { key: "right" }, footerRight)
      )
    );
  }

  // Subtask progress bar
  var progress = getSubtaskProgress(step);
  if (progress >= 0 && step.subtasks) {
    var completed = 0;
    step.subtasks.forEach(function (st) {
      if (st.completed) { completed = completed + 1; }
    });

    cardChildren.push(
      React.createElement("div", {
        key: "progress-label",
        style: { fontSize: "10px", color: "#a0aec0", marginTop: "4px" },
      }, completed + "/" + step.subtasks.length + " subtasks")
    );

    cardChildren.push(
      React.createElement("div", {
        key: "progress",
        className: styles.kanbanProgress,
      },
        React.createElement("div", {
          className: styles.kanbanProgressFill,
          style: {
            width: progress + "%",
            backgroundColor: getStatusColor(step.status),
          },
        })
      )
    );
  }

  return React.createElement("div", {
    key: "card-" + step.id,
    className: styles.kanbanCard,
    role: "listitem",
    "aria-label": step.title + " - " + getStepStatusDisplayName(step.status),
  }, cardChildren);
}

var KanbanLayout: React.FC<IFunctionalLayoutProps> = function (props) {
  var sortedSteps = React.useMemo(function () {
    return sortSteps(props.process.steps);
  }, [props.process.steps]);

  var groupedSteps = React.useMemo(function () {
    return groupByStatus(sortedSteps);
  }, [sortedSteps]);

  var columns: React.ReactElement[] = [];

  COLUMN_ORDER.forEach(function (status) {
    var stepsInColumn = groupedSteps[status];
    if (!stepsInColumn || stepsInColumn.length === 0) {
      return; // skip empty columns
    }

    var statusColor = getStatusColor(status);
    var statusLabel = getStepStatusDisplayName(status);

    // Column header
    var headerEl = React.createElement("div", {
      key: "header",
      className: styles.kanbanColumnHeader,
      style: { borderBottomColor: statusColor, color: statusColor },
    },
      statusLabel,
      React.createElement("span", {
        className: styles.kanbanColumnCount,
      }, String(stepsInColumn.length))
    );

    // Cards
    var cards: React.ReactElement[] = [];
    stepsInColumn.forEach(function (step, idx) {
      cards.push(renderCard(step, idx, props.showStepNumbers));
    });

    columns.push(
      React.createElement("div", {
        key: "col-" + status,
        className: styles.kanbanColumn,
        role: "list",
        "aria-label": statusLabel + " column",
      }, headerEl, cards)
    );
  });

  return React.createElement("div", {
    className: styles.kanbanBoard,
    role: "region",
    "aria-label": "Kanban board view",
  }, columns);
};

export default KanbanLayout;
