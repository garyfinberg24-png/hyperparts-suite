import * as React from "react";
import type { IShapeLayerConfig } from "../../models";
import styles from "./ShapeLayer.module.scss";

export interface IShapeLayerProps {
  config: IShapeLayerConfig;
}

const ShapeLayer: React.FC<IShapeLayerProps> = function (props) {
  const { config } = props;

  const commonProps = {
    fill: config.fill,
    stroke: config.stroke,
    strokeWidth: config.strokeWidth,
    opacity: config.opacity,
  };

  let shapeElement: React.ReactNode;

  if (config.shape === "rectangle") {
    shapeElement = React.createElement("rect", {
      ...commonProps,
      x: "0",
      y: "0",
      width: "100%",
      height: "100%",
      rx: config.borderRadius,
      ry: config.borderRadius,
    });
  } else if (config.shape === "circle") {
    shapeElement = React.createElement("circle", {
      ...commonProps,
      cx: "50%",
      cy: "50%",
      r: "45%",
    });
  } else if (config.shape === "line") {
    shapeElement = React.createElement("line", {
      ...commonProps,
      x1: "0",
      y1: "50%",
      x2: "100%",
      y2: "50%",
    });
  } else if (config.shape === "triangle") {
    shapeElement = React.createElement("polygon", {
      ...commonProps,
      points: "50,5 95,95 5,95",
    });
  } else if (config.shape === "custom" && config.svgPath) {
    shapeElement = React.createElement("path", {
      ...commonProps,
      d: config.svgPath,
    });
  } else {
    // Fallback to rectangle
    shapeElement = React.createElement("rect", {
      ...commonProps,
      x: "0",
      y: "0",
      width: "100%",
      height: "100%",
    });
  }

  return React.createElement(
    "div",
    { className: styles.shapeLayer },
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: config.shape === "triangle" ? "0 0 100 100" : undefined,
        preserveAspectRatio: "none",
      },
      shapeElement
    )
  );
};

export default ShapeLayer;
