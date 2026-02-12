// ============================================================
// DesignerToolbox — Left panel shape palette for FlowDesigner
// Shapes: Pill, Circle, Card, Diamond, Rectangle
// Connectors: Arrow, Dashed, Dotted, Thick (informational)
// ============================================================

import * as React from "react";
import styles from "./FlowDesigner.module.scss";
import type { IFlowColorThemeDefinition, FlowNodeShape } from "../../models";
import FlowIcon from "../../utils/FlowIcon";

export interface IDesignerToolboxProps {
  theme: IFlowColorThemeDefinition;
  onAddNode: (shape: FlowNodeShape) => void;
}

/** Shape definitions for the palette */
interface IShapeDefinition {
  shape: FlowNodeShape;
  label: string;
  icon: string;
}

var SHAPE_DEFINITIONS: IShapeDefinition[] = [
  { shape: "pill", label: "Pill", icon: "pill" },
  { shape: "circle", label: "Circle", icon: "circle" },
  { shape: "card", label: "Card", icon: "card" },
  { shape: "diamond", label: "Diamond", icon: "diamond" },
  { shape: "rectangle", label: "Rectangle", icon: "rectangle" },
];

/** Connector style definitions (informational only) */
interface IConnectorDefinition {
  label: string;
  styleClass: string;
}

var CONNECTOR_DEFINITIONS: IConnectorDefinition[] = [
  { label: "Arrow", styleClass: "connectorSolid" },
  { label: "Dashed", styleClass: "connectorDashed" },
  { label: "Dotted", styleClass: "connectorDotted" },
  { label: "Thick", styleClass: "connectorThick" },
];

var DesignerToolbox: React.FC<IDesignerToolboxProps> = function (props) {
  // -- Shape buttons --
  var shapeButtons: React.ReactElement[] = [];

  SHAPE_DEFINITIONS.forEach(function (shapeDef, index) {
    var colorIndex = index % props.theme.nodeColors.length;
    var previewColor = props.theme.nodeColors[colorIndex];

    shapeButtons.push(
      React.createElement("button", {
        key: shapeDef.shape,
        className: styles.shapeButton,
        onClick: function () { props.onAddNode(shapeDef.shape); },
        type: "button",
        "aria-label": "Add " + shapeDef.label + " node",
        title: "Add " + shapeDef.label + " node to canvas",
      },
        React.createElement("span", {
          className: styles.shapePreview,
          style: { borderColor: previewColor },
        },
          React.createElement(FlowIcon, {
            name: shapeDef.icon,
            size: 18,
            color: previewColor,
          })
        ),
        React.createElement("span", { className: styles.shapeLabel }, shapeDef.label)
      )
    );
  });

  // -- Connector info items --
  var connectorItems: React.ReactElement[] = [];

  CONNECTOR_DEFINITIONS.forEach(function (connDef) {
    var lineClass = styles[connDef.styleClass as keyof typeof styles] || "";

    connectorItems.push(
      React.createElement("div", {
        key: connDef.label,
        className: styles.connectorInfo,
      },
        React.createElement("span", { className: lineClass }),
        React.createElement("span", undefined, connDef.label)
      )
    );
  });

  // -- Render --
  return React.createElement("div", {
    className: styles.toolboxPanel,
    role: "region",
    "aria-label": "Shape toolbox",
  },
    // Header
    React.createElement("div", { className: styles.toolboxHeader }, "Toolbox"),

    // Shapes section
    React.createElement("div", { className: styles.toolboxSection },
      React.createElement("div", { className: styles.toolboxSectionTitle }, "Shapes"),
      shapeButtons
    ),

    // Connectors section
    React.createElement("div", { className: styles.toolboxSection },
      React.createElement("div", { className: styles.toolboxSectionTitle }, "Connectors"),
      connectorItems
    )
  );
};

export default DesignerToolbox;
