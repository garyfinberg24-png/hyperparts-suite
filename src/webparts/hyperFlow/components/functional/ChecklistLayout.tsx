// ============================================================
// HyperFlow — ChecklistLayout
// Checklist view: steps as section headers with subtask items,
// circular checkbox icons styled by status, progress summary.
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

/** Get the checkbox class for a step based on status */
function getCheckboxClass(status: FlowStepStatus): string {
  var base = styles.checklistCheckbox;
  if (status === "completed") {
    return base + " " + styles.checklistCheckboxDone;
  } else if (status === "in-progress") {
    return base + " " + styles.checklistCheckboxProgress;
  } else if (status === "blocked") {
    return base + " " + styles.checklistCheckboxBlocked;
  } else if (status === "skipped") {
    return base + " " + styles.checklistCheckboxSkipped;
  }
  return base;
}

/** Get the icon to show inside the checkbox */
function getCheckboxIcon(status: FlowStepStatus): string {
  if (status === "completed") { return "check"; }
  if (status === "in-progress") { return "clock"; }
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

/** Render a single subtask */
function renderSubtask(subtask: IFlowSubtask): React.ReactElement {
  var checkClass = styles.checklistSubtaskCheck;
  if (subtask.completed) {
    checkClass = checkClass + " " + styles.checklistSubtaskCheckDone;
  }

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

  var textStyle: React.CSSProperties | undefined;
  if (subtask.completed) {
    textStyle = { textDecoration: "line-through", color: "#a0aec0" };
  }

  return React.createElement("div", {
    key: subtask.id,
    className: styles.checklistSubtaskItem,
  },
    React.createElement("div", { className: checkClass }, checkChildren),
    React.createElement("span", { style: textStyle }, subtask.title)
  );
}

/** Render a step group (section header + subtasks) */
function renderStepGroup(
  step: IFlowStep,
  index: number,
  theme: IFlowColorThemeDefinition,
  showStepNumbers: boolean
): React.ReactElement {
  var colorCount = theme.nodeColors.length;
  var groupColor = step.color || theme.nodeColors[index % colorCount];

  // Group header
  var headerChildren: React.ReactElement[] = [];

  // Group icon circle
  var iconContent: React.ReactElement[] = [];
  if (showStepNumbers) {
    iconContent.push(
      React.createElement("span", {
        key: "num",
        style: { fontSize: "12px", fontWeight: 700 },
      }, String(index + 1))
    );
  } else if (step.icon) {
    iconContent.push(
      React.createElement(FlowIcon, {
        key: "icon",
        name: step.icon,
        size: 16,
        color: "white",
      })
    );
  } else {
    iconContent.push(
      React.createElement("span", {
        key: "num-fallback",
        style: { fontSize: "12px", fontWeight: 700 },
      }, String(index + 1))
    );
  }

  headerChildren.push(
    React.createElement("div", {
      key: "icon",
      className: styles.checklistGroupIcon,
      style: { backgroundColor: groupColor },
    }, iconContent)
  );

  headerChildren.push(
    React.createElement("span", {
      key: "title",
      className: styles.checklistGroupTitle,
    }, step.title)
  );

  // Count of subtasks if any
  if (step.subtasks && step.subtasks.length > 0) {
    var completed = 0;
    step.subtasks.forEach(function (st) {
      if (st.completed) { completed = completed + 1; }
    });
    headerChildren.push(
      React.createElement("span", {
        key: "count",
        className: styles.checklistGroupCount,
      }, completed + "/" + step.subtasks.length)
    );
  }

  var groupChildren: React.ReactElement[] = [];

  // Header
  groupChildren.push(
    React.createElement("div", {
      key: "header",
      className: styles.checklistGroupHeader,
    }, headerChildren)
  );

  // Step as checklist item
  var checkboxClass = getCheckboxClass(step.status);
  var checkboxIconName = getCheckboxIcon(step.status);
  var checkboxContent: React.ReactElement[] = [];
  if (checkboxIconName) {
    checkboxContent.push(
      React.createElement(FlowIcon, {
        key: "ci",
        name: checkboxIconName,
        size: 12,
        color: "white",
      })
    );
  }

  var titleClass = styles.checklistItemTitle;
  if (step.status === "completed") {
    titleClass = titleClass + " " + styles.checklistItemTitleDone;
  }

  var itemContentChildren: React.ReactElement[] = [];
  itemContentChildren.push(
    React.createElement("div", {
      key: "title",
      className: titleClass,
    }, step.title)
  );

  // Meta line: assignee, due date, status
  var metaParts: string[] = [];
  if (step.assignee) {
    metaParts.push(step.assignee);
  }
  if (step.dueDate) {
    metaParts.push("Due: " + step.dueDate);
  }
  metaParts.push(getStepStatusDisplayName(step.status));

  itemContentChildren.push(
    React.createElement("div", {
      key: "meta",
      className: styles.checklistItemMeta,
    }, metaParts.join(" \u2022 "))
  );

  // Description
  if (step.description) {
    itemContentChildren.push(
      React.createElement("div", {
        key: "desc",
        style: { fontSize: "11px", color: "#718096", marginTop: "2px" },
      }, step.description)
    );
  }

  groupChildren.push(
    React.createElement("div", {
      key: "item",
      className: styles.checklistItem,
      role: "listitem",
      "aria-label": step.title + " - " + getStepStatusDisplayName(step.status),
    },
      React.createElement("div", {
        className: checkboxClass,
        "aria-hidden": "true",
      }, checkboxContent),
      React.createElement("div", {
        className: styles.checklistItemContent,
      }, itemContentChildren)
    )
  );

  // Subtasks
  if (step.subtasks && step.subtasks.length > 0) {
    var subtaskElements: React.ReactElement[] = [];
    step.subtasks.forEach(function (st) {
      subtaskElements.push(renderSubtask(st));
    });

    groupChildren.push(
      React.createElement("div", {
        key: "subtasks",
        className: styles.checklistSubtasks,
      }, subtaskElements)
    );
  }

  return React.createElement("div", {
    key: "group-" + step.id,
    className: styles.checklistGroup,
  }, groupChildren);
}

var ChecklistLayout: React.FC<IFunctionalLayoutProps> = function (props) {
  var sortedSteps = React.useMemo(function () {
    return sortSteps(props.process.steps);
  }, [props.process.steps]);

  var children: React.ReactElement[] = [];

  // Step groups
  sortedSteps.forEach(function (step, index) {
    children.push(renderStepGroup(step, index, props.theme, props.showStepNumbers));
  });

  // Progress summary bar at the bottom
  var totalSteps = sortedSteps.length;
  var completedSteps = 0;
  sortedSteps.forEach(function (step) {
    if (step.status === "completed") {
      completedSteps = completedSteps + 1;
    }
  });
  var progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  children.push(
    React.createElement("div", {
      key: "summary",
      className: styles.checklistSummary,
      role: "status",
      "aria-label": completedSteps + " of " + totalSteps + " steps completed (" + progressPct + "%)",
    },
      React.createElement("span", { key: "label" },
        completedSteps + " of " + totalSteps + " completed"
      ),
      React.createElement("div", {
        key: "bar",
        className: styles.checklistSummaryBar,
      },
        React.createElement("div", {
          className: styles.checklistSummaryFill,
          style: { width: progressPct + "%" },
        })
      ),
      React.createElement("span", {
        key: "pct",
        style: { fontWeight: 600 },
      }, progressPct + "%")
    )
  );

  return React.createElement("div", {
    className: styles.checklistContainer,
    role: "list",
    "aria-label": "Checklist process view",
  }, children);
};

export default ChecklistLayout;
