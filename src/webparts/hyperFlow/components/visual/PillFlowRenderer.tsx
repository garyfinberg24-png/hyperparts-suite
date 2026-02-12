// ============================================================
// HyperFlow — PillFlowRenderer
// Horizontal pill flow: rounded pills with icons and optional
// step numbers, connected by arrow connectors.
// ============================================================

import * as React from "react";
import styles from "./FlowVisualRenderer.module.scss";
import type { IFlowDiagram, IFlowColorThemeDefinition, IFlowConnector } from "../../models";
import FlowIcon from "../../utils/FlowIcon";

export interface IFlowSubRendererProps {
  diagram: IFlowDiagram;
  theme: IFlowColorThemeDefinition;
  showStepNumbers: boolean;
  showConnectorLabels: boolean;
}

/**
 * Find the connector between two nodes (if any).
 * Uses .forEach() for ES5 safety.
 */
function findConnector(
  connectors: IFlowConnector[],
  fromId: string,
  toId: string
): IFlowConnector | undefined {
  var found: IFlowConnector | undefined;
  connectors.forEach(function (c) {
    if (c.fromNodeId === fromId && c.toNodeId === toId) {
      found = c;
    }
  });
  return found;
}

var PillFlowRenderer: React.FC<IFlowSubRendererProps> = function (props) {
  var nodes = props.diagram.nodes;
  var connectors = props.diagram.connectors;
  var theme = props.theme;
  var colorCount = theme.nodeColors.length;

  var elements: React.ReactElement[] = [];

  nodes.forEach(function (node, index) {
    var bgColor = node.color || theme.nodeColors[index % colorCount];

    // Build pill content
    var pillChildren: React.ReactElement[] = [];

    // Step number badge
    if (props.showStepNumbers) {
      pillChildren.push(
        React.createElement("span", {
          key: "num",
          className: styles.pillNodeNumber,
        }, String(index + 1))
      );
    }

    // Icon
    if (node.icon) {
      pillChildren.push(
        React.createElement("span", {
          key: "icon",
          className: styles.pillNodeIcon,
        }, React.createElement(FlowIcon, {
          name: node.icon,
          size: 16,
          color: "white",
        }))
      );
    }

    // Label text
    pillChildren.push(
      React.createElement("span", { key: "label" }, node.label)
    );

    // Tooltip with description
    if (node.description) {
      pillChildren.push(
        React.createElement("span", {
          key: "tooltip",
          className: styles.nodeTooltip,
        }, node.description)
      );
    }

    // Pill element
    elements.push(
      React.createElement("div", {
        key: "pill-" + node.id,
        className: styles.pillNode,
        style: { background: bgColor },
        role: "listitem",
        "aria-label": "Step " + (index + 1) + ": " + node.label,
      }, pillChildren)
    );

    // Connector between this node and the next
    if (index < nodes.length - 1) {
      var nextNode = nodes[index + 1];
      var connector = findConnector(connectors, node.id, nextNode.id);
      var connectorColor = theme.connectorColor;
      if (connector && connector.color) {
        connectorColor = connector.color;
      }

      var connectorChildren: React.ReactElement[] = [];

      // Arrow icon
      connectorChildren.push(
        React.createElement("span", {
          key: "arrow",
          className: styles.pillConnectorIcon,
        }, React.createElement(FlowIcon, {
          name: "chevron-right",
          size: 18,
          color: connectorColor,
        }))
      );

      // Connector label
      if (props.showConnectorLabels && connector && connector.label) {
        connectorChildren.push(
          React.createElement("span", {
            key: "clabel",
            className: styles.pillConnectorLabel,
          }, connector.label)
        );
      }

      elements.push(
        React.createElement("div", {
          key: "conn-" + node.id + "-" + nextNode.id,
          className: styles.pillConnector,
          "aria-hidden": "true",
        }, connectorChildren)
      );
    }
  });

  return React.createElement("div", {
    className: styles.pillFlow,
    role: "list",
    "aria-label": "Pill flow diagram",
  }, elements);
};

export default PillFlowRenderer;
