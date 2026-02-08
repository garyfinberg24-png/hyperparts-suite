import * as React from "react";
import type { IIconLayerConfig } from "../../models";
import styles from "./IconLayer.module.scss";

export interface IIconLayerProps {
  config: IIconLayerConfig;
}

const IconLayer: React.FC<IIconLayerProps> = function (props) {
  const { config } = props;

  const style: React.CSSProperties = {
    fontSize: config.size + "px",
    color: config.color,
    backgroundColor: config.backgroundColor,
    borderRadius: config.borderRadius + "px",
  };

  return React.createElement(
    "div",
    { className: styles.iconLayer, style: style },
    React.createElement("i", {
      className: "ms-Icon ms-Icon--" + config.iconName,
      "aria-hidden": "true",
    })
  );
};

export default IconLayer;
