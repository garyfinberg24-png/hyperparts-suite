import * as React from "react";
import type { IGroupLayerConfig, ISliderLayer } from "../../models";
import styles from "./GroupLayer.module.scss";

export interface IGroupLayerProps {
  config: IGroupLayerConfig;
  isCurrentSlide: boolean;
}

const GroupLayer: React.FC<IGroupLayerProps> = function (props) {
  const { config, isCurrentSlide } = props;

  // Use require to break circular dependency:
  // HyperSliderLayer imports GroupLayer, and GroupLayer renders HyperSliderLayer for children.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const HyperSliderLayer = require("../HyperSliderLayer").default as React.FC<{
    layer: ISliderLayer;
    isCurrentSlide: boolean;
  }>;

  const children: React.ReactNode[] = [];
  if (config.childLayers && config.childLayers.length > 0) {
    config.childLayers.forEach(function (childLayer: ISliderLayer, index: number) {
      children.push(
        React.createElement(HyperSliderLayer, {
          key: childLayer.id || "child-" + String(index),
          layer: childLayer,
          isCurrentSlide: isCurrentSlide,
        })
      );
    });
  }

  return React.createElement(
    "div",
    { className: styles.groupLayer },
    children
  );
};

export default GroupLayer;
