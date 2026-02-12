// ============================================================
// FlowDesigner — 3-column drag-drop canvas for flow diagrams
// Toolbox (240px) | Canvas (flex 1) | Properties (280px)
// ============================================================

import * as React from "react";
import styles from "./FlowDesigner.module.scss";
import type {
  IFlowDiagram,
  IFlowNode,
  IFlowConnector,
  IFlowColorThemeDefinition,
  FlowNodeShape,
} from "../../models";
import { useHyperFlowStore } from "../../store/useHyperFlowStore";
import FlowIcon from "../../utils/FlowIcon";
import DesignerToolbox from "./DesignerToolbox";
import DesignerCanvas from "./DesignerCanvas";
import DesignerProperties from "./DesignerProperties";

export interface IFlowDesignerProps {
  diagram: IFlowDiagram;
  theme: IFlowColorThemeDefinition;
  onSave: (diagram: IFlowDiagram) => void;
  onCancel: () => void;
}

/** Generate a unique ID for new nodes/connectors (ES5-safe) */
function generateId(prefix: string): string {
  return prefix + "-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
}

/** ES5-safe shallow copy of an object, overriding select keys */
function mergeNode(node: IFlowNode, updates: Partial<IFlowNode>): IFlowNode {
  var result: Record<string, unknown> = {};
  var keys = Object.keys(node);
  var i: number;
  for (i = 0; i < keys.length; i++) {
    result[keys[i]] = (node as unknown as Record<string, unknown>)[keys[i]];
  }
  var updateKeys = Object.keys(updates);
  for (i = 0; i < updateKeys.length; i++) {
    result[updateKeys[i]] = (updates as unknown as Record<string, unknown>)[updateKeys[i]];
  }
  return result as unknown as IFlowNode;
}

/** ES5-safe array copy */
function copyArray<T>(arr: T[]): T[] {
  var out: T[] = [];
  arr.forEach(function (item) {
    out.push(item);
  });
  return out;
}

/** Clamp a number between min and max */
function clamp(value: number, min: number, max: number): number {
  if (value < min) { return min; }
  if (value > max) { return max; }
  return value;
}

var FlowDesigner: React.FC<IFlowDesignerProps> = function (props) {
  // -- Zustand store for selection state --
  var selectNode = useHyperFlowStore(function (s) { return s.selectNode; });
  var clearSelection = useHyperFlowStore(function (s) { return s.clearSelection; });

  // -- Local mutable state --
  var nodesState = React.useState(function () { return copyArray(props.diagram.nodes || []); });
  var nodes = nodesState[0];
  var setNodes = nodesState[1];

  var connectorsState = React.useState(function () { return copyArray(props.diagram.connectors || []); });
  var connectors = connectorsState[0];
  var setConnectors = connectorsState[1];

  var zoomState = React.useState(1);
  var zoom = zoomState[0];
  var setZoom = zoomState[1];

  var panXState = React.useState(0);
  var panX = panXState[0];

  var panYState = React.useState(0);
  var panY = panYState[0];

  // -- Handlers --

  /** Add a new node of the given shape at canvas center */
  var handleAddNode = React.useCallback(function (shape: FlowNodeShape): void {
    var colorIndex = nodes.length % props.theme.nodeColors.length;
    var nodeColor = props.theme.nodeColors[colorIndex];

    var newNode: IFlowNode = {
      id: generateId("node"),
      label: shape.charAt(0).toUpperCase() + shape.substr(1),
      description: "",
      shape: shape,
      color: nodeColor,
      textColor: "#ffffff",
      x: 200 + (nodes.length * 30) % 300,
      y: 120 + (nodes.length * 25) % 200,
      width: shape === "circle" ? 72 : 120,
      height: shape === "circle" || shape === "diamond" ? 72 : 56,
    };

    setNodes(function (prev) {
      var next = copyArray(prev);
      next.push(newNode);
      return next;
    });

    selectNode(newNode.id);
  }, [nodes.length, props.theme.nodeColors, selectNode]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Update a node's properties by ID */
  var handleUpdateNode = React.useCallback(function (id: string, updates: Partial<IFlowNode>): void {
    setNodes(function (prev) {
      var next: IFlowNode[] = [];
      prev.forEach(function (n) {
        if (n.id === id) {
          next.push(mergeNode(n, updates));
        } else {
          next.push(n);
        }
      });
      return next;
    });
  }, []);

  /** Delete a node and any connectors attached to it */
  var handleDeleteNode = React.useCallback(function (id: string): void {
    setNodes(function (prev) {
      var next: IFlowNode[] = [];
      prev.forEach(function (n) {
        if (n.id !== id) {
          next.push(n);
        }
      });
      return next;
    });

    // Remove connectors referencing this node
    setConnectors(function (prev) {
      var next: IFlowConnector[] = [];
      prev.forEach(function (c) {
        if (c.fromNodeId !== id && c.toNodeId !== id) {
          next.push(c);
        }
      });
      return next;
    });

    clearSelection();
  }, [clearSelection]);

  /** Move a node to a new position */
  var handleMoveNode = React.useCallback(function (id: string, x: number, y: number): void {
    setNodes(function (prev) {
      var next: IFlowNode[] = [];
      prev.forEach(function (n) {
        if (n.id === id) {
          next.push(mergeNode(n, { x: x, y: y }));
        } else {
          next.push(n);
        }
      });
      return next;
    });
  }, []);

  /** Add a new connector between two nodes */
  var handleAddConnector = React.useCallback(function (fromId: string, toId: string): void {
    var newConn: IFlowConnector = {
      id: generateId("conn"),
      fromNodeId: fromId,
      toNodeId: toId,
      style: "arrow",
      color: props.theme.connectorColor,
    };

    setConnectors(function (prev) {
      var next = copyArray(prev);
      next.push(newConn);
      return next;
    });
  }, [props.theme.connectorColor]);

  /** Zoom in — max 2x */
  var handleZoomIn = React.useCallback(function (): void {
    setZoom(function (prev) { return clamp(Math.round((prev + 0.1) * 10) / 10, 0.5, 2); });
  }, []);

  /** Zoom out — min 0.5x */
  var handleZoomOut = React.useCallback(function (): void {
    setZoom(function (prev) { return clamp(Math.round((prev - 0.1) * 10) / 10, 0.5, 2); });
  }, []);

  /** Save diagram and call onSave */
  var handleSave = React.useCallback(function (): void {
    var diagram: IFlowDiagram = {
      nodes: nodes,
      connectors: connectors,
      direction: props.diagram.direction || "horizontal",
      title: props.diagram.title,
    };
    props.onSave(diagram);
  }, [nodes, connectors, props]); // eslint-disable-line react-hooks/exhaustive-deps

  // -- Build toolbar --
  var toolbar = React.createElement("div", {
    className: styles.designerToolbar,
    role: "toolbar",
    "aria-label": "Designer toolbar",
  },
    // Left: icon + title
    React.createElement("div", { className: styles.toolbarLeft },
      React.createElement("span", { className: styles.toolbarIcon },
        React.createElement(FlowIcon, { name: "designer", size: 20 })
      ),
      React.createElement("span", { className: styles.toolbarTitle }, "Flow Designer")
    ),

    // Center: zoom controls
    React.createElement("div", { className: styles.toolbarCenter },
      React.createElement("div", { className: styles.zoomControls },
        React.createElement("button", {
          className: styles.zoomButton,
          onClick: handleZoomOut,
          "aria-label": "Zoom out",
          title: "Zoom out",
          type: "button",
        }, "\u2212"),
        React.createElement("span", { className: styles.zoomLabel },
          Math.round(zoom * 100) + "%"
        ),
        React.createElement("button", {
          className: styles.zoomButton,
          onClick: handleZoomIn,
          "aria-label": "Zoom in",
          title: "Zoom in",
          type: "button",
        }, "+")
      )
    ),

    // Right: save and cancel
    React.createElement("div", { className: styles.toolbarRight },
      React.createElement("button", {
        className: styles.cancelButton,
        onClick: props.onCancel,
        type: "button",
      },
        React.createElement(FlowIcon, { name: "unlink", size: 14 }),
        "Cancel"
      ),
      React.createElement("button", {
        className: styles.saveButton,
        onClick: handleSave,
        type: "button",
      },
        React.createElement(FlowIcon, { name: "save", size: 14 }),
        "Save"
      )
    )
  );

  // -- Build body (3-column layout) --
  var body = React.createElement("div", { className: styles.designerBody },
    // Left: Toolbox
    React.createElement(DesignerToolbox, {
      theme: props.theme,
      onAddNode: handleAddNode,
    }),

    // Center: Canvas (delegated to DesignerCanvas)
    React.createElement("div", { className: styles.canvasPanel },
      React.createElement(DesignerCanvas, {
        nodes: nodes,
        connectors: connectors,
        theme: props.theme,
        zoom: zoom,
        panX: panX,
        panY: panY,
        onMoveNode: handleMoveNode,
        onSelectNode: selectNode,
        onClearSelection: clearSelection,
        onAddConnector: handleAddConnector,
      })
    ),

    // Right: Properties
    React.createElement("div", { className: styles.propertiesPanel },
      React.createElement(DesignerProperties, {
        nodes: nodes,
        theme: props.theme,
        onUpdateNode: handleUpdateNode,
        onDeleteNode: handleDeleteNode,
      })
    )
  );

  // -- Root --
  return React.createElement("div", { className: styles.designer + " " + styles.fadeIn },
    toolbar,
    body
  );
};

export default FlowDesigner;
