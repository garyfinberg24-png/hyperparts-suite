import * as React from "react";
import { SHAPE_REGISTRY } from "../../models/IHyperImageShape";
import type { ShapeMask } from "../../models/IHyperImageShape";
import styles from "./HyperImageEditorModal.module.scss";

export interface IShapePanelProps {
  currentShape: ShapeMask;
  customClipPath: string;
  onShapeChange: (shape: ShapeMask) => void;
  onCustomPathChange: (path: string) => void;
}

var ShapePanel: React.FC<IShapePanelProps> = function (props) {
  var children: React.ReactNode[] = [];

  // Section title
  children.push(React.createElement("h4", {
    key: "title",
    className: styles.propSectionTitle,
  }, "Select a Shape Mask"));

  // Shape grid
  var shapeItems = SHAPE_REGISTRY.map(function (shape) {
    var isActive = props.currentShape === shape.id;
    var thumbnailClass = styles.shapeThumbnail + (isActive ? " " + styles.shapeThumbnailActive : "");

    return React.createElement("div", { key: shape.id, style: { textAlign: "center" } },
      React.createElement("button", {
        className: thumbnailClass,
        style: {
          clipPath: shape.clipPath !== "none" ? shape.clipPath : undefined,
          WebkitClipPath: shape.clipPath !== "none" ? shape.clipPath : undefined,
        },
        onClick: function () { props.onShapeChange(shape.id); },
        "aria-label": shape.label,
        title: shape.label,
        type: "button",
      }),
      React.createElement("div", { className: styles.shapeThumbnailLabel }, shape.label)
    );
  });

  children.push(React.createElement("div", {
    key: "grid",
    className: styles.shapeGrid,
  }, shapeItems));

  // Custom clip-path input (shown when Custom is selected)
  if (props.currentShape === "custom") {
    children.push(React.createElement("div", {
      key: "custom",
      className: styles.propField,
      style: { marginTop: "16px" },
    },
      React.createElement("label", { className: styles.propLabel }, "Custom CSS Clip Path"),
      React.createElement("textarea", {
        className: styles.propInput,
        value: props.customClipPath,
        onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>) {
          props.onCustomPathChange(e.target.value);
        },
        rows: 3,
        placeholder: "polygon(50% 0%, 0% 100%, 100% 100%)",
      })
    ));
  }

  return React.createElement("div", { className: styles.propSection }, children);
};

export default ShapePanel;
