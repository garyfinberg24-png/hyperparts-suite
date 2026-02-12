// ============================================================
// HyperFlow — FlowFunctionalRenderer
// Layout router: receives process data + functional layout +
// color theme + display options, routes to the correct
// sub-renderer (Horizontal, Timeline, Kanban, Checklist).
// ============================================================

import * as React from "react";
import styles from "./FlowFunctionalRenderer.module.scss";
import type {
  IFlowProcess,
  IFlowColorThemeDefinition,
  FlowFunctionalLayout,
} from "../../models";
import HorizontalLayout from "./HorizontalLayout";
import TimelineLayout from "./TimelineLayout";
import KanbanLayout from "./KanbanLayout";
import ChecklistLayout from "./ChecklistLayout";

export interface IFlowFunctionalRendererProps {
  process: IFlowProcess;
  functionalLayout: FlowFunctionalLayout;
  theme: IFlowColorThemeDefinition;
  showStepNumbers: boolean;
  enableAnimation: boolean;
  showConnectorLabels: boolean;
}

var FlowFunctionalRenderer: React.FC<IFlowFunctionalRendererProps> = function (props) {
  if (!props.process || !props.process.steps || props.process.steps.length === 0) {
    return null; // eslint-disable-line @rushstack/no-new-null
  }

  var containerClass = styles.functionalContainer;
  if (props.enableAnimation) {
    containerClass = containerClass + " " + styles.animated;
  }

  var subProps = {
    process: props.process,
    theme: props.theme,
    showStepNumbers: props.showStepNumbers,
    showConnectorLabels: props.showConnectorLabels,
  };

  var renderer: React.ReactElement;

  if (props.functionalLayout === "horizontal") {
    renderer = React.createElement(HorizontalLayout, subProps);
  } else if (props.functionalLayout === "timeline") {
    renderer = React.createElement(TimelineLayout, subProps);
  } else if (props.functionalLayout === "kanban") {
    renderer = React.createElement(KanbanLayout, subProps);
  } else if (props.functionalLayout === "checklist") {
    renderer = React.createElement(ChecklistLayout, subProps);
  } else {
    // Default fallback to horizontal
    renderer = React.createElement(HorizontalLayout, subProps);
  }

  var children: React.ReactElement[] = [];

  if (props.process.title) {
    children.push(
      React.createElement("div", {
        key: "title",
        className: styles.functionalTitle,
      }, props.process.title)
    );
  }

  children.push(
    React.createElement("div", { key: "renderer" }, renderer)
  );

  var ariaLabel = "Process stepper";
  if (props.process.title) {
    ariaLabel = ariaLabel + ": " + props.process.title;
  }

  return React.createElement("div", {
    className: containerClass,
    style: { background: props.theme.background },
    role: "region",
    "aria-label": ariaLabel,
  }, children);
};

export default FlowFunctionalRenderer;
