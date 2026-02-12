// ============================================================
// HyperFlow — FlowVisualRenderer
// Style router: receives diagram data + visual style + color
// theme + display options, routes to the correct sub-renderer.
// ============================================================

import * as React from "react";
import styles from "./FlowVisualRenderer.module.scss";
import type { IFlowDiagram, IFlowColorThemeDefinition, FlowVisualStyle } from "../../models";
import PillFlowRenderer from "./PillFlowRenderer";
import CircleFlowRenderer from "./CircleFlowRenderer";
import CardFlowRenderer from "./CardFlowRenderer";
import GradientLaneRenderer from "./GradientLaneRenderer";
import MetroMapRenderer from "./MetroMapRenderer";

export interface IFlowVisualRendererProps {
  diagram: IFlowDiagram;
  visualStyle: FlowVisualStyle;
  theme: IFlowColorThemeDefinition;
  showStepNumbers: boolean;
  enableAnimation: boolean;
  showConnectorLabels: boolean;
}

var FlowVisualRenderer: React.FC<IFlowVisualRendererProps> = function (props) {
  if (!props.diagram || !props.diagram.nodes || props.diagram.nodes.length === 0) {
    return null; // eslint-disable-line @rushstack/no-new-null
  }

  var containerClass = styles.visualContainer;
  if (props.enableAnimation) {
    containerClass = containerClass + " " + styles.animated;
  }

  var subProps = {
    diagram: props.diagram,
    theme: props.theme,
    showStepNumbers: props.showStepNumbers,
    showConnectorLabels: props.showConnectorLabels,
  };

  var renderer: React.ReactElement;

  if (props.visualStyle === "pill") {
    renderer = React.createElement(PillFlowRenderer, subProps);
  } else if (props.visualStyle === "circle") {
    renderer = React.createElement(CircleFlowRenderer, subProps);
  } else if (props.visualStyle === "card") {
    renderer = React.createElement(CardFlowRenderer, subProps);
  } else if (props.visualStyle === "gradient-lane") {
    renderer = React.createElement(GradientLaneRenderer, subProps);
  } else if (props.visualStyle === "metro-map") {
    renderer = React.createElement(MetroMapRenderer, subProps);
  } else {
    // Default fallback to pill
    renderer = React.createElement(PillFlowRenderer, subProps);
  }

  var children: React.ReactElement[] = [];

  if (props.diagram.title) {
    children.push(
      React.createElement("div", { key: "title", className: styles.visualTitle }, props.diagram.title)
    );
  }

  children.push(
    React.createElement("div", { key: "renderer" }, renderer)
  );

  var ariaLabel = "Flow diagram";
  if (props.diagram.title) {
    ariaLabel = ariaLabel + ": " + props.diagram.title;
  }

  return React.createElement("div", {
    className: containerClass,
    style: { background: props.theme.background },
    role: "img",
    "aria-label": ariaLabel,
  }, children);
};

export default FlowVisualRenderer;
