// ============================================================
// HyperFlow — Gradient Lane Renderer
// Full-width horizontal gradient bars stacked vertically.
// Each node becomes a colored lane with icon, title, description.
// ============================================================

import * as React from "react";
import type {
  IFlowDiagram,
  IFlowColorThemeDefinition,
  IFlowNode,
  IFlowConnector,
} from "../../models";
import FlowIcon from "../../utils/FlowIcon";

// ---- Sub-renderer props (local definition to avoid cross-file dependency) ----
export interface IFlowSubRendererProps {
  diagram: IFlowDiagram;
  theme: IFlowColorThemeDefinition;
  showStepNumbers: boolean;
  showConnectorLabels: boolean;
}

// ---- Hex-to-rgba utility (ES5-safe) ----

function hexToRgba(hex: string, alpha: number): string {
  var cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex =
      cleanHex.charAt(0) + cleanHex.charAt(0) +
      cleanHex.charAt(1) + cleanHex.charAt(1) +
      cleanHex.charAt(2) + cleanHex.charAt(2);
  }
  var r = parseInt(cleanHex.substring(0, 2), 16);
  var g = parseInt(cleanHex.substring(2, 4), 16);
  var b = parseInt(cleanHex.substring(4, 6), 16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

// ---- Style factories ----

function buildContainerStyle(bg: string): React.CSSProperties {
  return {
    padding: "24px 16px",
    backgroundColor: bg,
    borderRadius: 12,
    minHeight: 120,
  };
}

function buildLaneStyle(nodeColor: string, isHovered: boolean): React.CSSProperties {
  var opacity = isHovered ? 1.0 : 0.8;
  return {
    display: "flex",
    alignItems: "center",
    height: 56,
    borderRadius: 8,
    background:
      "linear-gradient(90deg, " +
      hexToRgba(nodeColor, opacity) +
      " 0%, " +
      hexToRgba(nodeColor, 0.05) +
      " 100%)",
    padding: "0 20px",
    cursor: "default",
    transition: "background 0.2s ease",
    position: "relative",
  };
}

function buildStepNumberStyle(): React.CSSProperties {
  return {
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.85)",
    color: "#1a1a1a",
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginRight: 14,
    boxShadow: "0 1px 2px rgba(0,0,0,0.10)",
  };
}

function buildIconTitleGroupStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  };
}

function buildTitleStyle(isLight: boolean): React.CSSProperties {
  return {
    fontSize: 14,
    fontWeight: 600,
    color: isLight ? "#ffffff" : "#1a1a1a",
    lineHeight: "20px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
}

function buildDescStyle(isLight: boolean): React.CSSProperties {
  return {
    fontSize: 12,
    color: isLight ? "rgba(255,255,255,0.80)" : "#6b7280",
    lineHeight: "18px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "right",
    maxWidth: 280,
    flexShrink: 0,
    marginLeft: 16,
  };
}

var chevronContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  height: 4,
};

function buildChevronStyle(color: string): React.CSSProperties {
  return {
    width: 0,
    height: 0,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
    borderTop: "6px solid " + hexToRgba(color, 0.5),
  };
}

var connectorLabelRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "2px 0",
};

var connectorLabelTextStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  color: "#6b7280",
  backgroundColor: "rgba(255,255,255,0.7)",
  borderRadius: 8,
  padding: "1px 8px",
};

var diagramTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 20,
  color: "#1a1a1a",
};

// ---- Luminance check — determines if text should be white on dark bg ----

function isColorDark(hex: string): boolean {
  var cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex =
      cleanHex.charAt(0) + cleanHex.charAt(0) +
      cleanHex.charAt(1) + cleanHex.charAt(1) +
      cleanHex.charAt(2) + cleanHex.charAt(2);
  }
  var r = parseInt(cleanHex.substring(0, 2), 16);
  var g = parseInt(cleanHex.substring(2, 4), 16);
  var b = parseInt(cleanHex.substring(4, 6), 16);
  // Relative luminance (simplified)
  var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

// ---- Connector label finder ----

function findConnectorLabel(
  connectors: IFlowConnector[],
  fromId: string,
  toId: string
): string | undefined {
  var label: string | undefined;
  connectors.forEach(function (c) {
    if (c.fromNodeId === fromId && c.toNodeId === toId && c.label) {
      label = c.label;
    }
  });
  return label;
}

// ---- Single lane ----

var GradientLane: React.FC<{
  node: IFlowNode;
  index: number;
  theme: IFlowColorThemeDefinition;
  showStepNumber: boolean;
}> = function (props) {
  var hoverState = React.useState(false);
  var isHovered = hoverState[0];
  var setIsHovered = hoverState[1];

  var nodeColor = props.node.color
    || props.theme.nodeColors[props.index % props.theme.nodeColors.length];
  var useLight = isColorDark(nodeColor);
  var iconColor = useLight ? "#ffffff" : "#1a1a1a";

  var children: React.ReactNode[] = [];

  // Step number
  if (props.showStepNumber) {
    children.push(
      React.createElement("div", {
        key: "step",
        style: buildStepNumberStyle(),
        "aria-label": "Step " + (props.index + 1),
      }, String(props.index + 1))
    );
  }

  // Icon + title group
  var titleGroupChildren: React.ReactNode[] = [];
  if (props.node.icon) {
    titleGroupChildren.push(
      React.createElement(FlowIcon, {
        key: "icon",
        name: props.node.icon,
        size: 20,
        color: iconColor,
      })
    );
  }
  titleGroupChildren.push(
    React.createElement("span", {
      key: "title",
      style: buildTitleStyle(useLight),
    }, props.node.label)
  );
  children.push(
    React.createElement("div", {
      key: "titleGroup",
      style: buildIconTitleGroupStyle(),
    }, titleGroupChildren)
  );

  // Description (right side)
  if (props.node.description) {
    children.push(
      React.createElement("span", {
        key: "desc",
        style: buildDescStyle(useLight),
        title: props.node.description,
      }, props.node.description)
    );
  }

  return React.createElement("div", {
    style: buildLaneStyle(nodeColor, isHovered),
    onMouseEnter: function () { setIsHovered(true); },
    onMouseLeave: function () { setIsHovered(false); },
    role: "listitem",
    "aria-label": props.node.label,
  }, children);
};

// ---- Main renderer ----

var GradientLaneRenderer: React.FC<IFlowSubRendererProps> = function (props) {
  var diagram = props.diagram;
  var theme = props.theme;
  var nodes = diagram.nodes;

  if (!nodes || nodes.length === 0) {
    return React.createElement("div", {
      style: buildContainerStyle(theme.background),
    }, React.createElement("p", {
      style: { color: "#6b7280", textAlign: "center", padding: 24 },
    }, "No steps to display."));
  }

  var elements: React.ReactNode[] = [];

  // Diagram title
  if (diagram.title) {
    elements.push(
      React.createElement("div", {
        key: "title",
        style: diagramTitleStyle,
      }, diagram.title)
    );
  }

  // Lanes with chevrons and connector labels between them
  nodes.forEach(function (node, i) {
    // Lane
    elements.push(
      React.createElement(GradientLane, {
        key: "lane-" + node.id,
        node: node,
        index: i,
        theme: theme,
        showStepNumber: props.showStepNumbers,
      })
    );

    // Chevron / connector label between lanes
    if (i < nodes.length - 1) {
      var nextNode = nodes[i + 1];
      var nodeColor = node.color
        || theme.nodeColors[i % theme.nodeColors.length];

      // Connector label (if any)
      if (props.showConnectorLabels) {
        var connLabel = findConnectorLabel(diagram.connectors, node.id, nextNode.id);
        if (connLabel) {
          elements.push(
            React.createElement("div", {
              key: "clabel-" + i,
              style: connectorLabelRowStyle,
            }, React.createElement("span", {
              style: connectorLabelTextStyle,
            }, connLabel))
          );
        }
      }

      // Chevron arrow
      elements.push(
        React.createElement("div", {
          key: "chevron-" + i,
          style: chevronContainerStyle,
          "aria-hidden": "true",
        }, React.createElement("div", {
          style: buildChevronStyle(nodeColor),
        }))
      );
    }
  });

  return React.createElement("div", {
    style: buildContainerStyle(theme.background),
    role: "list",
    "aria-label": diagram.title || "Gradient lane diagram",
  }, elements);
};

export default GradientLaneRenderer;
