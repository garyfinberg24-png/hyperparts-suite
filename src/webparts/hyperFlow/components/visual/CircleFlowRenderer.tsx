// ============================================================
// HyperFlow — CircleFlowRenderer
// Circle-based flow: each node is a circle with the step number
// or icon inside, label and description below.
// ============================================================

import * as React from "react";
import styles from "./FlowVisualRenderer.module.scss";
import type { IFlowConnector } from "../../models";
import type { IFlowSubRendererProps } from "./PillFlowRenderer";
import FlowIcon from "../../utils/FlowIcon";

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

var CircleFlowRenderer: React.FC<IFlowSubRendererProps> = function (props) {
  var nodes = props.diagram.nodes;
  var connectors = props.diagram.connectors;
  var theme = props.theme;
  var colorCount = theme.nodeColors.length;

  var elements: React.ReactElement[] = [];

  nodes.forEach(function (node, index) {
    var bgColor = node.color || theme.nodeColors[index % colorCount];

    // ---- Build circle content ----
    var circleChildren: React.ReactElement[] = [];

    // Ring around circle (decorative, uses node color)
    circleChildren.push(
      React.createElement("span", {
        key: "ring",
        className: styles.circleNodeRing,
        style: { borderColor: bgColor },
        "aria-hidden": "true",
      })
    );

    // Inner content: icon or step number
    if (node.icon) {
      circleChildren.push(
        React.createElement(FlowIcon, {
          key: "icon",
          name: node.icon,
          size: 28,
          color: "white",
        })
      );
    } else {
      circleChildren.push(
        React.createElement("span", { key: "num" }, String(index + 1))
      );
    }

    // Tooltip with description
    if (node.description) {
      circleChildren.push(
        React.createElement("span", {
          key: "tooltip",
          className: styles.nodeTooltip,
        }, node.description)
      );
    }

    // ---- Build wrapper children: circle + label + description ----
    var wrapperChildren: React.ReactElement[] = [];

    // Circle element
    wrapperChildren.push(
      React.createElement("div", {
        key: "circle",
        className: styles.circleNode,
        style: { background: bgColor },
        role: "listitem",
        "aria-label": "Step " + (index + 1) + ": " + node.label,
      }, circleChildren)
    );

    // Label below circle
    wrapperChildren.push(
      React.createElement("span", {
        key: "label",
        className: styles.circleNodeLabel,
      }, node.label)
    );

    // Description below label
    if (node.description) {
      wrapperChildren.push(
        React.createElement("span", {
          key: "desc",
          className: styles.circleNodeDesc,
        }, node.description)
      );
    }

    // Node wrapper (vertical column: circle, label, description)
    elements.push(
      React.createElement("div", {
        key: "wrapper-" + node.id,
        className: styles.circleNodeWrapper,
      }, wrapperChildren)
    );

    // ---- Connector between this node and the next ----
    if (index < nodes.length - 1) {
      var nextNode = nodes[index + 1];
      var connector = findConnector(connectors, node.id, nextNode.id);
      var connectorColor = theme.connectorColor;
      if (connector && connector.color) {
        connectorColor = connector.color;
      }

      var connectorChildren: React.ReactElement[] = [];

      connectorChildren.push(
        React.createElement(FlowIcon, {
          key: "arrow",
          name: "chevron-right",
          size: 22,
          color: connectorColor,
        })
      );

      // Connector label if enabled
      if (props.showConnectorLabels && connector && connector.label) {
        connectorChildren.push(
          React.createElement("span", {
            key: "clabel",
            style: {
              fontSize: "10px",
              color: "#718096",
              marginTop: "2px",
              display: "block",
              textAlign: "center" as "center",
            },
          }, connector.label)
        );
      }

      elements.push(
        React.createElement("div", {
          key: "conn-" + node.id + "-" + nextNode.id,
          className: styles.circleConnector,
          "aria-hidden": "true",
        }, connectorChildren)
      );
    }
  });

  return React.createElement("div", {
    className: styles.circleFlow,
    role: "list",
    "aria-label": "Circle flow diagram",
  }, elements);
};

export default CircleFlowRenderer;
