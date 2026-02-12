// ============================================================
// HyperFlow — Designer Properties Panel
// Right-side panel for editing the selected node's properties:
// label, description, shape, color, border color, position, size.
// ============================================================

import * as React from "react";
import styles from "./FlowDesigner.module.scss";
import type { IFlowNode, IFlowColorThemeDefinition, FlowNodeShape } from "../../models";
import { useHyperFlowStore } from "../../store/useHyperFlowStore";
import FlowIcon from "../../utils/FlowIcon";

// ---- Props ----

export interface IDesignerPropertiesProps {
  nodes: IFlowNode[];
  theme: IFlowColorThemeDefinition;
  onUpdateNode: (id: string, updates: Partial<IFlowNode>) => void;
  onDeleteNode: (id: string) => void;
}

// ---- Shape options ----

var SHAPE_OPTIONS: Array<{ key: FlowNodeShape; label: string; icon: string }> = [
  { key: "pill", label: "Pill", icon: "pill" },
  { key: "circle", label: "Circle", icon: "circle" },
  { key: "card", label: "Card", icon: "card" },
  { key: "diamond", label: "Diamond", icon: "diamond" },
  { key: "rectangle", label: "Rectangle", icon: "rectangle" },
];

// ---- Component ----

var DesignerProperties: React.FC<IDesignerPropertiesProps> = function (props) {
  var selectedNodeId = useHyperFlowStore(function (s) { return s.selectedNodeId; });

  // Find the selected node
  var selectedNode: IFlowNode | undefined;
  props.nodes.forEach(function (n) {
    if (n.id === selectedNodeId) {
      selectedNode = n;
    }
  });

  // -- Empty state --
  if (!selectedNode) {
    return React.createElement("div", { className: styles.propsEmpty },
      React.createElement(FlowIcon, { name: "settings", size: 32, color: "#a0aec0" }),
      React.createElement("p", undefined, "Select a node to edit its properties")
    );
  }

  var node = selectedNode;

  // -- Field change handlers --
  var handleLabelChange = function (e: React.ChangeEvent<HTMLInputElement>): void {
    var updates: Record<string, unknown> = {};
    updates["label"] = e.target.value;
    props.onUpdateNode(node.id, updates as Partial<IFlowNode>);
  };

  var handleDescriptionChange = function (e: React.ChangeEvent<HTMLTextAreaElement>): void {
    var updates: Record<string, unknown> = {};
    updates["description"] = e.target.value;
    props.onUpdateNode(node.id, updates as Partial<IFlowNode>);
  };

  var handleShapeChange = function (shape: FlowNodeShape): void {
    var updates: Record<string, unknown> = {};
    updates["shape"] = shape;
    props.onUpdateNode(node.id, updates as Partial<IFlowNode>);
  };

  var handleColorChange = function (e: React.ChangeEvent<HTMLInputElement>): void {
    var updates: Record<string, unknown> = {};
    updates["color"] = e.target.value;
    props.onUpdateNode(node.id, updates as Partial<IFlowNode>);
  };

  var handleBorderColorChange = function (e: React.ChangeEvent<HTMLInputElement>): void {
    var updates: Record<string, unknown> = {};
    updates["borderColor"] = e.target.value;
    props.onUpdateNode(node.id, updates as Partial<IFlowNode>);
  };

  var handleWidthChange = function (e: React.ChangeEvent<HTMLInputElement>): void {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 40) { return; }
    var updates: Record<string, unknown> = {};
    updates["width"] = val;
    props.onUpdateNode(node.id, updates as Partial<IFlowNode>);
  };

  var handleHeightChange = function (e: React.ChangeEvent<HTMLInputElement>): void {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 20) { return; }
    var updates: Record<string, unknown> = {};
    updates["height"] = val;
    props.onUpdateNode(node.id, updates as Partial<IFlowNode>);
  };

  var handleDelete = function (): void {
    props.onDeleteNode(node.id);
  };

  // -- Shape selector buttons --
  var shapeButtons = SHAPE_OPTIONS.map(function (opt) {
    var isActive = node.shape === opt.key;
    var btnStyle: React.CSSProperties = {
      padding: "6px 10px",
      border: isActive ? "2px solid #0078d4" : "1px solid #d0d5dd",
      borderRadius: 6,
      background: isActive ? "#e8f0fe" : "#fff",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: isActive ? 600 : 400,
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      marginRight: 4,
      marginBottom: 4,
    };

    return React.createElement("button", {
      key: opt.key,
      type: "button",
      style: btnStyle,
      onClick: function (): void { handleShapeChange(opt.key); },
      "aria-pressed": isActive ? "true" : "false",
      "aria-label": opt.label + " shape",
    },
      React.createElement(FlowIcon, { name: opt.icon, size: 14 }),
      " ",
      opt.label
    );
  });

  // -- Build layout --
  var children: React.ReactElement[] = [];

  // Header
  children.push(
    React.createElement("div", { key: "header", className: styles.propsHeader },
      React.createElement(FlowIcon, { name: node.shape || "rectangle", size: 18 }),
      React.createElement("span", { style: { marginLeft: 8, fontWeight: 600, fontSize: 14 } as React.CSSProperties }, "Node Properties"),
      React.createElement("span", { style: { flex: 1 } as React.CSSProperties }),
      React.createElement("button", {
        type: "button",
        onClick: handleDelete,
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
          borderRadius: 6,
          padding: "4px 10px",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
        } as React.CSSProperties,
        "aria-label": "Delete node",
      }, "Delete")
    )
  );

  // Label field
  children.push(
    React.createElement("div", { key: "label", className: styles.propsField },
      React.createElement("label", { className: styles.propsLabel }, "Label"),
      React.createElement("input", {
        type: "text",
        className: styles.propsInput,
        value: node.label || "",
        onChange: handleLabelChange,
        placeholder: "Enter node label",
        "aria-label": "Node label",
      })
    )
  );

  // Description field
  children.push(
    React.createElement("div", { key: "desc", className: styles.propsField },
      React.createElement("label", { className: styles.propsLabel }, "Description"),
      React.createElement("textarea", {
        className: styles.propsInput,
        value: node.description || "",
        onChange: handleDescriptionChange,
        placeholder: "Enter a description",
        rows: 3,
        style: { resize: "vertical", minHeight: 60 } as React.CSSProperties,
        "aria-label": "Node description",
      })
    )
  );

  // Shape selector
  children.push(
    React.createElement("div", { key: "shape", className: styles.propsField },
      React.createElement("label", { className: styles.propsLabel }, "Shape"),
      React.createElement("div", { style: { display: "flex", flexWrap: "wrap" } as React.CSSProperties }, shapeButtons)
    )
  );

  // Color field
  var nodeColor = node.color || props.theme.nodeColors[0];
  children.push(
    React.createElement("div", { key: "color", className: styles.propsField },
      React.createElement("label", { className: styles.propsLabel }, "Fill Color"),
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } as React.CSSProperties },
        React.createElement("input", {
          type: "color",
          value: nodeColor,
          onChange: handleColorChange,
          style: { width: 36, height: 28, border: "none", padding: 0, cursor: "pointer" } as React.CSSProperties,
          "aria-label": "Node fill color",
        }),
        React.createElement("span", {
          className: styles.propsColorSwatch,
          style: { backgroundColor: nodeColor } as React.CSSProperties,
        }),
        React.createElement("span", { style: { fontSize: 12, color: "#64748b" } as React.CSSProperties }, nodeColor)
      )
    )
  );

  // Border Color field
  var borderColor = node.borderColor || nodeColor;
  children.push(
    React.createElement("div", { key: "border-color", className: styles.propsField },
      React.createElement("label", { className: styles.propsLabel }, "Border Color"),
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } as React.CSSProperties },
        React.createElement("input", {
          type: "color",
          value: borderColor,
          onChange: handleBorderColorChange,
          style: { width: 36, height: 28, border: "none", padding: 0, cursor: "pointer" } as React.CSSProperties,
          "aria-label": "Node border color",
        }),
        React.createElement("span", {
          className: styles.propsColorSwatch,
          style: { backgroundColor: borderColor } as React.CSSProperties,
        }),
        React.createElement("span", { style: { fontSize: 12, color: "#64748b" } as React.CSSProperties }, borderColor)
      )
    )
  );

  // Position fields (read-only display)
  children.push(
    React.createElement("div", { key: "position", className: styles.propsField },
      React.createElement("label", { className: styles.propsLabel }, "Position"),
      React.createElement("div", { style: { display: "flex", gap: "12px" } as React.CSSProperties },
        React.createElement("div", { style: { flex: 1 } as React.CSSProperties },
          React.createElement("span", { style: { fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 2 } as React.CSSProperties }, "X"),
          React.createElement("input", {
            type: "number",
            className: styles.propsInput,
            value: node.x,
            readOnly: true,
            "aria-label": "Node X position",
            style: { backgroundColor: "#f8fafc" } as React.CSSProperties,
          })
        ),
        React.createElement("div", { style: { flex: 1 } as React.CSSProperties },
          React.createElement("span", { style: { fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 2 } as React.CSSProperties }, "Y"),
          React.createElement("input", {
            type: "number",
            className: styles.propsInput,
            value: node.y,
            readOnly: true,
            "aria-label": "Node Y position",
            style: { backgroundColor: "#f8fafc" } as React.CSSProperties,
          })
        )
      )
    )
  );

  // Size fields
  children.push(
    React.createElement("div", { key: "size", className: styles.propsField },
      React.createElement("label", { className: styles.propsLabel }, "Size"),
      React.createElement("div", { style: { display: "flex", gap: "12px" } as React.CSSProperties },
        React.createElement("div", { style: { flex: 1 } as React.CSSProperties },
          React.createElement("span", { style: { fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 2 } as React.CSSProperties }, "Width"),
          React.createElement("input", {
            type: "number",
            className: styles.propsInput,
            value: node.width || 140,
            onChange: handleWidthChange,
            min: 40,
            "aria-label": "Node width",
          })
        ),
        React.createElement("div", { style: { flex: 1 } as React.CSSProperties },
          React.createElement("span", { style: { fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 2 } as React.CSSProperties }, "Height"),
          React.createElement("input", {
            type: "number",
            className: styles.propsInput,
            value: node.height || 60,
            onChange: handleHeightChange,
            min: 20,
            "aria-label": "Node height",
          })
        )
      )
    )
  );

  return React.createElement("div", {
    className: styles.fadeIn,
    role: "form",
    "aria-label": "Node properties editor",
  }, children);
};

export default DesignerProperties;
