// ============================================================
// HyperFlow — Metro Map Renderer
// SVG-based subway/metro map style. Nodes become station dots
// on colored tracks with labels and branch connections.
// ============================================================

import * as React from "react";
import type {
  IFlowDiagram,
  IFlowColorThemeDefinition,
  IFlowNode,
  IFlowConnector,
} from "../../models";

// ---- Sub-renderer props (local definition to avoid cross-file dependency) ----
export interface IFlowSubRendererProps {
  diagram: IFlowDiagram;
  theme: IFlowColorThemeDefinition;
  showStepNumbers: boolean;
  showConnectorLabels: boolean;
}

// ---- Layout constants ----
var STATION_RADIUS = 8;
var STATION_HOVER_RADIUS = 10;
var TRACK_WIDTH = 4;
var HORIZONTAL_SPACING = 120;
var VERTICAL_SPACING = 100;
var LABEL_OFFSET = 24;
var PADDING = 60;
var ACCENT_RING_RADIUS = 14;

// ---- Connector index lookup (ES5-safe) ----

function buildNodeIndexMap(nodes: IFlowNode[]): Record<string, number> {
  var map: Record<string, number> = {};
  nodes.forEach(function (node, i) {
    map[node.id] = i;
  });
  return map;
}

function isSequentialConnector(
  connector: IFlowConnector,
  indexMap: Record<string, number>
): boolean {
  var fromIdx = indexMap[connector.fromNodeId];
  var toIdx = indexMap[connector.toNodeId];
  if (fromIdx === undefined || toIdx === undefined) {
    return false;
  }
  return toIdx === fromIdx + 1;
}

// ---- Compute station positions ----

interface IStationPosition {
  x: number;
  y: number;
}

function computePositions(
  nodes: IFlowNode[],
  direction: "horizontal" | "vertical"
): IStationPosition[] {
  var positions: IStationPosition[] = [];
  nodes.forEach(function (_node, i) {
    if (direction === "horizontal") {
      positions.push({
        x: PADDING + i * HORIZONTAL_SPACING,
        y: PADDING + 30,
      });
    } else {
      positions.push({
        x: PADDING + 30,
        y: PADDING + i * VERTICAL_SPACING,
      });
    }
  });
  return positions;
}

function computeViewBox(
  positions: IStationPosition[],
  direction: "horizontal" | "vertical",
  nodeCount: number
): string {
  if (nodeCount === 0) {
    return "0 0 200 100";
  }
  var maxX = 0;
  var maxY = 0;
  positions.forEach(function (pos) {
    if (pos.x > maxX) { maxX = pos.x; }
    if (pos.y > maxY) { maxY = pos.y; }
  });
  // Add space for labels and padding
  if (direction === "horizontal") {
    return "0 0 " + (maxX + PADDING + 20) + " " + (maxY + PADDING + LABEL_OFFSET + 40);
  }
  return "0 0 " + (maxX + PADDING + 160) + " " + (maxY + PADDING + 20);
}

// ---- Container wrapper style ----

function buildContainerStyle(bg: string): React.CSSProperties {
  return {
    padding: "24px 16px",
    backgroundColor: bg,
    borderRadius: 12,
    minHeight: 120,
    overflow: "auto",
  };
}

var diagramTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 16,
  color: "#1a1a1a",
};

// ---- Station component (dot + label) ----

var MetroStation: React.FC<{
  node: IFlowNode;
  index: number;
  position: IStationPosition;
  theme: IFlowColorThemeDefinition;
  direction: "horizontal" | "vertical";
  showStepNumber: boolean;
}> = function (props) {
  var hoverState = React.useState(false);
  var isHovered = hoverState[0];
  var setIsHovered = hoverState[1];

  var nodeColor = props.node.color
    || props.theme.nodeColors[props.index % props.theme.nodeColors.length];
  var cx = props.position.x;
  var cy = props.position.y;
  var radius = isHovered ? STATION_HOVER_RADIUS : STATION_RADIUS;
  var isAbove = props.index % 2 === 0;

  var elements: React.ReactElement[] = [];

  // Hover accent ring
  if (isHovered) {
    elements.push(
      React.createElement("circle", {
        key: "ring",
        cx: cx,
        cy: cy,
        r: ACCENT_RING_RADIUS,
        fill: "none",
        stroke: props.theme.accent,
        strokeWidth: 2,
        opacity: 0.6,
      })
    );
  }

  // Station dot
  elements.push(
    React.createElement("circle", {
      key: "dot",
      cx: cx,
      cy: cy,
      r: radius,
      fill: nodeColor,
      stroke: "#ffffff",
      strokeWidth: 2,
      style: { cursor: "default", transition: "r 0.15s ease" },
      onMouseEnter: function () { setIsHovered(true); },
      onMouseLeave: function () { setIsHovered(false); },
    })
  );

  // Step number inside dot (only when hovered or always if showStepNumber)
  if (props.showStepNumber) {
    elements.push(
      React.createElement("text", {
        key: "stepnum",
        x: cx,
        y: cy,
        textAnchor: "middle",
        dominantBaseline: "central",
        fill: "#ffffff",
        fontSize: 9,
        fontWeight: 700,
        pointerEvents: "none",
      }, String(props.index + 1))
    );
  }

  // Station label
  if (props.direction === "horizontal") {
    var labelY = isAbove
      ? cy - LABEL_OFFSET
      : cy + LABEL_OFFSET + 4;
    elements.push(
      React.createElement("text", {
        key: "label",
        x: cx,
        y: labelY,
        textAnchor: "middle",
        dominantBaseline: isAbove ? "auto" : "hanging",
        fill: props.theme.text,
        fontSize: 12,
        fontWeight: 600,
      }, props.node.label)
    );

    // Description below label
    if (props.node.description && isHovered) {
      var descY = isAbove
        ? labelY - 16
        : labelY + 16;
      elements.push(
        React.createElement("text", {
          key: "desc",
          x: cx,
          y: descY,
          textAnchor: "middle",
          dominantBaseline: isAbove ? "auto" : "hanging",
          fill: "#6b7280",
          fontSize: 10,
          fontWeight: 400,
        }, props.node.description.length > 30
          ? props.node.description.substring(0, 30) + "..."
          : props.node.description
        )
      );
    }
  } else {
    // Vertical — label to the right
    elements.push(
      React.createElement("text", {
        key: "label",
        x: cx + LABEL_OFFSET,
        y: cy,
        textAnchor: "start",
        dominantBaseline: "central",
        fill: props.theme.text,
        fontSize: 12,
        fontWeight: 600,
      }, props.node.label)
    );

    // Description below label
    if (props.node.description && isHovered) {
      elements.push(
        React.createElement("text", {
          key: "desc",
          x: cx + LABEL_OFFSET,
          y: cy + 16,
          textAnchor: "start",
          dominantBaseline: "central",
          fill: "#6b7280",
          fontSize: 10,
          fontWeight: 400,
        }, props.node.description.length > 40
          ? props.node.description.substring(0, 40) + "..."
          : props.node.description
        )
      );
    }
  }

  return React.createElement("g", {
    "aria-label": props.node.label,
    role: "listitem",
  }, elements);
};

// ---- Main renderer ----

var MetroMapRenderer: React.FC<IFlowSubRendererProps> = function (props) {
  var diagram = props.diagram;
  var theme = props.theme;
  var nodes = diagram.nodes;

  if (!nodes || nodes.length === 0) {
    return React.createElement("div", {
      style: buildContainerStyle(theme.background),
    }, React.createElement("p", {
      style: { color: "#6b7280", textAlign: "center", padding: 24 },
    }, "No stations to display."));
  }

  var direction = diagram.direction || "horizontal";
  var positions = computePositions(nodes, direction);
  var viewBox = computeViewBox(positions, direction, nodes.length);
  var indexMap = buildNodeIndexMap(nodes);

  var svgChildren: React.ReactElement[] = [];

  // ---- Draw main track line (sequential path through all nodes) ----
  if (positions.length > 1) {
    var pathParts: string[] = [];
    pathParts.push("M " + positions[0].x + " " + positions[0].y);
    var i: number;
    for (i = 1; i < positions.length; i++) {
      pathParts.push("L " + positions[i].x + " " + positions[i].y);
    }
    svgChildren.push(
      React.createElement("path", {
        key: "track-main",
        d: pathParts.join(" "),
        stroke: theme.primary,
        strokeWidth: TRACK_WIDTH,
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        opacity: 0.7,
      })
    );
  }

  // ---- Draw branch connections (non-sequential connectors) ----
  diagram.connectors.forEach(function (connector, ci) {
    if (isSequentialConnector(connector, indexMap)) {
      return; // already drawn as part of the main track
    }
    var fromIdx = indexMap[connector.fromNodeId];
    var toIdx = indexMap[connector.toNodeId];
    if (fromIdx === undefined || toIdx === undefined) {
      return;
    }
    var fromPos = positions[fromIdx];
    var toPos = positions[toIdx];
    var connColor = connector.color || theme.connectorColor;

    // Curved path for non-sequential connections
    var midX = (fromPos.x + toPos.x) / 2;
    var midY = (fromPos.y + toPos.y) / 2;
    var curveOffset = direction === "horizontal" ? 40 : 40;
    var ctrlX = direction === "horizontal" ? midX : midX + curveOffset;
    var ctrlY = direction === "horizontal" ? midY + curveOffset : midY;

    var branchD =
      "M " + fromPos.x + " " + fromPos.y +
      " Q " + ctrlX + " " + ctrlY +
      " " + toPos.x + " " + toPos.y;

    // Dashed style for non-sequential
    var dashArray: string | undefined;
    if (connector.style === "dashed") {
      dashArray = "6,4";
    } else if (connector.style === "dotted") {
      dashArray = "2,4";
    }

    svgChildren.push(
      React.createElement("path", {
        key: "branch-" + ci,
        d: branchD,
        stroke: connColor,
        strokeWidth: 2,
        fill: "none",
        strokeDasharray: dashArray,
        strokeLinecap: "round",
        opacity: 0.5,
      })
    );

    // Connector label on branch
    if (props.showConnectorLabels && connector.label) {
      svgChildren.push(
        React.createElement("text", {
          key: "branch-label-" + ci,
          x: ctrlX,
          y: ctrlY - 6,
          textAnchor: "middle",
          dominantBaseline: "auto",
          fill: "#6b7280",
          fontSize: 9,
          fontWeight: 500,
        }, connector.label)
      );
    }
  });

  // ---- Draw connector labels on sequential connectors ----
  if (props.showConnectorLabels) {
    diagram.connectors.forEach(function (connector, ci) {
      if (!isSequentialConnector(connector, indexMap)) {
        return;
      }
      if (!connector.label) {
        return;
      }
      var fromIdx = indexMap[connector.fromNodeId];
      var toIdx = indexMap[connector.toNodeId];
      if (fromIdx === undefined || toIdx === undefined) {
        return;
      }
      var fromPos = positions[fromIdx];
      var toPos = positions[toIdx];
      var midX = (fromPos.x + toPos.x) / 2;
      var midY = (fromPos.y + toPos.y) / 2;

      // Background rect for readability
      svgChildren.push(
        React.createElement("rect", {
          key: "seq-label-bg-" + ci,
          x: midX - 30,
          y: direction === "horizontal" ? midY + 8 : midY - 8,
          width: 60,
          height: 16,
          rx: 8,
          fill: theme.background,
          stroke: "#e5e7eb",
          strokeWidth: 1,
        })
      );
      svgChildren.push(
        React.createElement("text", {
          key: "seq-label-" + ci,
          x: midX,
          y: direction === "horizontal" ? midY + 18 : midY + 2,
          textAnchor: "middle",
          dominantBaseline: "central",
          fill: "#6b7280",
          fontSize: 9,
          fontWeight: 500,
        }, connector.label)
      );
    });
  }

  // ---- Draw stations (on top of tracks) ----
  nodes.forEach(function (node, i) {
    svgChildren.push(
      React.createElement(MetroStation, {
        key: "station-" + node.id,
        node: node,
        index: i,
        position: positions[i],
        theme: theme,
        direction: direction,
        showStepNumber: props.showStepNumbers,
      })
    );
  });

  // ---- Assemble the full component ----

  var wrapperChildren: React.ReactNode[] = [];

  if (diagram.title) {
    wrapperChildren.push(
      React.createElement("div", {
        key: "title",
        style: diagramTitleStyle,
      }, diagram.title)
    );
  }

  wrapperChildren.push(
    React.createElement("svg", {
      key: "svg",
      viewBox: viewBox,
      width: "100%",
      preserveAspectRatio: "xMidYMid meet",
      role: "list",
      "aria-label": diagram.title || "Metro map diagram",
      style: { display: "block", maxHeight: 400 },
    }, svgChildren)
  );

  return React.createElement("div", {
    style: buildContainerStyle(theme.background),
  }, wrapperChildren);
};

export default MetroMapRenderer;
