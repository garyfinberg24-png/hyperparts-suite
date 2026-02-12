// ============================================================
// HyperFlow — Designer Canvas
// Main SVG + HTML canvas where nodes are positioned and
// connectors are drawn between them. Supports pan, zoom,
// drag-to-move nodes, click-to-select, and SVG connector lines.
// ============================================================

import * as React from "react";
import styles from "./FlowDesigner.module.scss";
import type { IFlowNode, IFlowConnector, IFlowColorThemeDefinition } from "../../models";
import { useHyperFlowStore } from "../../store/useHyperFlowStore";

// ---- Props ----

export interface IDesignerCanvasProps {
  nodes: IFlowNode[];
  connectors: IFlowConnector[];
  theme: IFlowColorThemeDefinition;
  zoom: number;
  panX: number;
  panY: number;
  onMoveNode: (id: string, x: number, y: number) => void;
  onSelectNode: (id: string) => void;
  onClearSelection: () => void;
  onAddConnector: (fromId: string, toId: string) => void;
}

// ---- Shape helpers ----

/** Returns CSS border-radius for a given node shape */
function getBorderRadiusForShape(shape: string): string {
  if (shape === "pill") { return "24px"; }
  if (shape === "circle") { return "50%"; }
  if (shape === "card") { return "8px"; }
  if (shape === "diamond") { return "4px"; }
  // rectangle
  return "4px";
}

/** Returns additional CSS transform for diamond shape */
function getShapeTransform(shape: string): string {
  if (shape === "diamond") { return "rotate(45deg)"; }
  return "";
}

/** Returns inverse rotation for diamond label so text stays upright */
function getLabelTransform(shape: string): string {
  if (shape === "diamond") { return "rotate(-45deg)"; }
  return "";
}

/** Default node dimensions */
var DEFAULT_WIDTH = 140;
var DEFAULT_HEIGHT = 60;

/** Get center coordinates of a node */
function getNodeCenter(node: IFlowNode): { cx: number; cy: number } {
  var w = node.width || DEFAULT_WIDTH;
  var h = node.height || DEFAULT_HEIGHT;
  return {
    cx: node.x + w / 2,
    cy: node.y + h / 2,
  };
}

// ---- SVG arrow marker ID ----
var ARROW_MARKER_ID = "flow-designer-arrowhead";

// ---- Component ----

var DesignerCanvas: React.FC<IDesignerCanvasProps> = function (props) {
  var selectedNodeId = useHyperFlowStore(function (s) { return s.selectedNodeId; });

  // -- Refs for drag state (mutable) --
  // eslint-disable-next-line @rushstack/no-new-null
  var canvasRef = React.useRef<HTMLDivElement>(null);
  var isDraggingRef = React.useRef(false);
  var dragNodeIdRef = React.useRef("");
  var dragStartXRef = React.useRef(0);
  var dragStartYRef = React.useRef(0);
  var nodeStartXRef = React.useRef(0);
  var nodeStartYRef = React.useRef(0);

  // -- Mouse handlers --
  var handleMouseDown = function (nodeId: string, nodeX: number, nodeY: number, e: React.MouseEvent<HTMLDivElement>): void {
    e.stopPropagation();
    e.preventDefault();
    isDraggingRef.current = true;
    dragNodeIdRef.current = nodeId;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    nodeStartXRef.current = nodeX;
    nodeStartYRef.current = nodeY;
    props.onSelectNode(nodeId);
  };

  React.useEffect(function () {
    var handleMouseMove = function (e: MouseEvent): void {
      if (!isDraggingRef.current) { return; }
      var dx = (e.clientX - dragStartXRef.current) / props.zoom;
      var dy = (e.clientY - dragStartYRef.current) / props.zoom;
      var newX = nodeStartXRef.current + dx;
      var newY = nodeStartYRef.current + dy;
      props.onMoveNode(dragNodeIdRef.current, Math.round(newX), Math.round(newY));
    };

    var handleMouseUp = function (): void {
      isDraggingRef.current = false;
      dragNodeIdRef.current = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return function () {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [props.zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  // -- Canvas background click --
  var handleCanvasClick = function (e: React.MouseEvent<HTMLDivElement>): void {
    // Only clear selection if clicking the canvas itself, not a node
    if (e.target === e.currentTarget || e.target === canvasRef.current) {
      props.onClearSelection();
    }
  };

  // -- Build node elements --
  var nodeElements = props.nodes.map(function (node, index) {
    var isSelected = selectedNodeId === node.id;
    var w = node.width || DEFAULT_WIDTH;
    var h = node.height || DEFAULT_HEIGHT;
    var bgColor = node.color || props.theme.nodeColors[index % props.theme.nodeColors.length];
    var borderColor = node.borderColor || bgColor;
    var textColor = node.textColor || "#ffffff";
    var shapeTransform = getShapeTransform(node.shape);
    var borderRadius = getBorderRadiusForShape(node.shape);

    var nodeStyle: React.CSSProperties = {
      position: "absolute",
      left: node.x,
      top: node.y,
      width: w,
      height: h,
      backgroundColor: bgColor,
      border: "2px solid " + borderColor,
      borderRadius: borderRadius,
      color: textColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "grab",
      userSelect: "none",
      transition: "box-shadow 0.15s ease",
      boxShadow: isSelected ? "0 0 0 3px #0078d4, 0 4px 12px rgba(0,0,0,0.15)" : "0 2px 6px rgba(0,0,0,0.1)",
      zIndex: isSelected ? 10 : 1,
      transform: shapeTransform || undefined,
      overflow: "hidden",
    };

    var nodeClasses = styles.canvasNode;
    if (isSelected) {
      nodeClasses = nodeClasses + " " + styles.canvasNodeSelected;
    }
    if (isDraggingRef.current && dragNodeIdRef.current === node.id) {
      nodeClasses = nodeClasses + " " + styles.canvasNodeDragging;
    }

    var labelTransform = getLabelTransform(node.shape);
    var labelStyle: React.CSSProperties = {
      transform: labelTransform || undefined,
      fontSize: 13,
      fontWeight: 600,
      textAlign: "center",
      padding: "0 8px",
      lineHeight: "1.3",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    };

    return React.createElement("div", {
      key: node.id,
      className: nodeClasses,
      style: nodeStyle,
      onMouseDown: function (e: React.MouseEvent<HTMLDivElement>): void {
        handleMouseDown(node.id, node.x, node.y, e);
      },
      onClick: function (e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation();
        props.onSelectNode(node.id);
      },
      role: "button",
      tabIndex: 0,
      "aria-label": node.label || "Node " + node.id,
      "aria-selected": isSelected ? "true" : "false",
    },
      React.createElement("span", {
        className: styles.nodeLabel,
        style: labelStyle,
      }, node.label || "")
    );
  });

  // -- Build SVG connector elements --
  var nodeMap: Record<string, IFlowNode> = {};
  props.nodes.forEach(function (n) {
    nodeMap[n.id] = n;
  });

  var connectorElements = props.connectors.map(function (conn) {
    var fromNode = nodeMap[conn.fromNodeId];
    var toNode = nodeMap[conn.toNodeId];
    if (!fromNode || !toNode) { return undefined; }

    var from = getNodeCenter(fromNode);
    var to = getNodeCenter(toNode);
    var strokeColor = conn.color || props.theme.connectorColor;
    var strokeWidth = 2;
    var strokeDasharray: string | undefined;
    var markerEnd: string | undefined;

    if (conn.style === "arrow") {
      markerEnd = "url(#" + ARROW_MARKER_ID + ")";
    } else if (conn.style === "dashed") {
      strokeDasharray = "8,4";
    } else if (conn.style === "dotted") {
      strokeDasharray = "3,3";
    } else if (conn.style === "thick") {
      strokeWidth = 4;
    }

    var lineStyle: React.CSSProperties = {
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      fill: "none",
    };
    if (strokeDasharray) {
      lineStyle.strokeDasharray = strokeDasharray;
    }

    var lineChildren: React.ReactElement[] = [];

    lineChildren.push(
      React.createElement("line", {
        key: conn.id + "-line",
        x1: from.cx,
        y1: from.cy,
        x2: to.cx,
        y2: to.cy,
        style: lineStyle,
        markerEnd: markerEnd,
      })
    );

    // Optional connector label at midpoint
    if (conn.label) {
      var midX = (from.cx + to.cx) / 2;
      var midY = (from.cy + to.cy) / 2;
      lineChildren.push(
        React.createElement("text", {
          key: conn.id + "-label",
          x: midX,
          y: midY - 8,
          textAnchor: "middle",
          style: {
            fontSize: 11,
            fill: props.theme.text,
            fontFamily: "inherit",
          } as React.CSSProperties,
        }, conn.label)
      );
    }

    return React.createElement("g", { key: conn.id }, lineChildren);
  });

  // Filter out undefined connectors (from missing nodes)
  var validConnectors: React.ReactElement[] = [];
  connectorElements.forEach(function (el) {
    if (el) { validConnectors.push(el); }
  });

  // -- Dot grid background style --
  var gridSize = 20 * props.zoom;
  var dotGridStyle: React.CSSProperties = {
    backgroundImage: "radial-gradient(circle, #d0d5dd 1px, transparent 1px)",
    backgroundSize: gridSize + "px " + gridSize + "px",
  };

  // -- Transform wrapper style --
  var transformStyle: React.CSSProperties = {
    transform: "scale(" + props.zoom + ") translate(" + props.panX + "px, " + props.panY + "px)",
    transformOrigin: "0 0",
    position: "relative",
    width: "100%",
    height: "100%",
  };

  // -- SVG overlay style --
  var svgOverlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "visible",
  };

  // -- Arrow marker definition --
  var svgDefs = React.createElement("defs", { key: "defs" },
    React.createElement("marker", {
      id: ARROW_MARKER_ID,
      markerWidth: "10",
      markerHeight: "7",
      refX: "10",
      refY: "3.5",
      orient: "auto",
      markerUnits: "strokeWidth",
    },
      React.createElement("polygon", {
        points: "0 0, 10 3.5, 0 7",
        fill: props.theme.connectorColor,
      })
    )
  );

  // -- Canvas container --
  return React.createElement("div", {
    ref: canvasRef,
    className: styles.canvasContainer,
    style: dotGridStyle,
    onClick: handleCanvasClick,
    role: "application",
    "aria-label": "Flow designer canvas",
  },
    React.createElement("div", { style: transformStyle },
      // SVG overlay for connectors
      React.createElement("svg", {
        className: styles.connectorOverlay,
        style: svgOverlayStyle,
        "aria-hidden": "true",
      }, svgDefs, validConnectors),
      // HTML nodes
      nodeElements
    )
  );
};

export default DesignerCanvas;
