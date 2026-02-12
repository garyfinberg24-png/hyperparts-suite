// ============================================================
// HyperFlow — Card Flow Renderer
// Vertical card-based flow with gradient timeline line,
// step number badges, and alternating card positions.
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

// ---- Style factories (ES5-safe, no Object.assign / spread) ----

function buildContainerStyle(bg: string): React.CSSProperties {
  return {
    position: "relative",
    padding: "32px 16px",
    backgroundColor: bg,
    borderRadius: 12,
    minHeight: 120,
  };
}

function buildTimelineStyle(primary: string, accent: string): React.CSSProperties {
  return {
    position: "absolute",
    left: 28,
    top: 0,
    bottom: 0,
    width: 3,
    background: "linear-gradient(180deg, " + primary + " 0%, " + accent + " 100%)",
    borderRadius: 2,
    zIndex: 0,
  };
}

function buildRowStyle(index: number): React.CSSProperties {
  return {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingLeft: index % 2 === 0 ? 60 : 68,
    zIndex: 1,
  };
}

function buildBadgeStyle(color: string): React.CSSProperties {
  return {
    position: "absolute",
    left: 17,
    top: 12,
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor: color,
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
  };
}

function buildCardStyle(borderColor: string): React.CSSProperties {
  return {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderLeft: "4px solid " + borderColor,
    borderRadius: 12,
    padding: "14px 18px",
    flex: 1,
    maxWidth: 420,
    cursor: "default",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };
}

function buildCardHoverStyle(borderColor: string): React.CSSProperties {
  return {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderLeft: "4px solid " + borderColor,
    borderRadius: 12,
    padding: "14px 18px",
    flex: 1,
    maxWidth: 420,
    cursor: "default",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
    transform: "translateY(-1px)",
  };
}

var titleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 4,
};

function buildTitleStyle(textColor: string): React.CSSProperties {
  return {
    fontSize: 14,
    fontWeight: 600,
    color: textColor,
    lineHeight: "20px",
    margin: 0,
  };
}

var descriptionStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  lineHeight: "18px",
  margin: 0,
};

function buildConnectorLabelStyle(): React.CSSProperties {
  return {
    position: "relative",
    marginBottom: 12,
    paddingLeft: 60,
    zIndex: 1,
  };
}

var connectorLabelBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  fontSize: 11,
  fontWeight: 500,
  color: "#6b7280",
  backgroundColor: "#f3f4f6",
  borderRadius: 10,
  padding: "2px 10px",
  border: "1px solid #e5e7eb",
};

var diagramTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 24,
  paddingLeft: 60,
  color: "#1a1a1a",
};

// ---- Single card component ----

var CardFlowCard: React.FC<{
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
  var borderColor = props.node.borderColor || nodeColor;
  var textColor = props.node.textColor || props.theme.text;

  var cardSt = isHovered
    ? buildCardHoverStyle(borderColor)
    : buildCardStyle(borderColor);

  var children: React.ReactNode[] = [];

  // Step number badge on timeline
  if (props.showStepNumber) {
    children.push(
      React.createElement("div", {
        key: "badge",
        style: buildBadgeStyle(nodeColor),
        "aria-label": "Step " + (props.index + 1),
      }, String(props.index + 1))
    );
  }

  // Card element
  var cardChildren: React.ReactNode[] = [];

  // Title row (icon + label)
  var titleRowChildren: React.ReactNode[] = [];
  if (props.node.icon) {
    titleRowChildren.push(
      React.createElement(FlowIcon, {
        key: "icon",
        name: props.node.icon,
        size: 20,
        color: nodeColor,
      })
    );
  }
  titleRowChildren.push(
    React.createElement("span", {
      key: "label",
      style: buildTitleStyle(textColor),
    }, props.node.label)
  );
  cardChildren.push(
    React.createElement("div", {
      key: "titleRow",
      style: titleRowStyle,
    }, titleRowChildren)
  );

  // Description
  if (props.node.description) {
    cardChildren.push(
      React.createElement("p", {
        key: "desc",
        style: descriptionStyle,
      }, props.node.description)
    );
  }

  children.push(
    React.createElement("div", {
      key: "card",
      style: cardSt,
      onMouseEnter: function () { setIsHovered(true); },
      onMouseLeave: function () { setIsHovered(false); },
      role: "listitem",
      "aria-label": props.node.label,
    }, cardChildren)
  );

  return React.createElement("div", {
    style: buildRowStyle(props.index),
  }, children);
};

// ---- Connector label between cards ----

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

// ---- Main renderer ----

var CardFlowRenderer: React.FC<IFlowSubRendererProps> = function (props) {
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

  // Timeline gradient line
  elements.push(
    React.createElement("div", {
      key: "timeline",
      style: buildTimelineStyle(theme.primary, theme.accent),
      "aria-hidden": "true",
    })
  );

  // Optional diagram title
  if (diagram.title) {
    elements.push(
      React.createElement("div", {
        key: "title",
        style: diagramTitleStyle,
      }, diagram.title)
    );
  }

  // Cards with connector labels between them
  nodes.forEach(function (node, i) {
    // Connector label above this card (from previous node)
    if (i > 0 && props.showConnectorLabels) {
      var prevNode = nodes[i - 1];
      var connLabel = findConnectorLabel(diagram.connectors, prevNode.id, node.id);
      if (connLabel) {
        elements.push(
          React.createElement("div", {
            key: "clabel-" + i,
            style: buildConnectorLabelStyle(),
          }, React.createElement("span", {
            style: connectorLabelBadgeStyle,
          }, connLabel))
        );
      }
    }

    elements.push(
      React.createElement(CardFlowCard, {
        key: "card-" + node.id,
        node: node,
        index: i,
        theme: theme,
        showStepNumber: props.showStepNumbers,
      })
    );
  });

  return React.createElement("div", {
    style: buildContainerStyle(theme.background),
    role: "list",
    "aria-label": diagram.title || "Card flow diagram",
  }, elements);
};

export default CardFlowRenderer;
