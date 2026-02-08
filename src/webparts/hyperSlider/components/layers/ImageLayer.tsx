import * as React from "react";
import type { IImageLayerConfig } from "../../models";
import styles from "./ImageLayer.module.scss";

export interface IImageLayerProps {
  config: IImageLayerConfig;
}

const ImageLayer: React.FC<IImageLayerProps> = function (props) {
  const { config } = props;

  const containerStyle: React.CSSProperties = {};
  if (config.mask) {
    containerStyle.clipPath = config.mask;
  }

  const imgStyle: React.CSSProperties = {
    objectFit: config.objectFit as React.CSSProperties["objectFit"],
    objectPosition: config.objectPosition,
    borderRadius: config.borderRadius + "px",
    opacity: config.opacity,
  };

  return React.createElement(
    "div",
    { className: styles.imageLayer, style: containerStyle },
    React.createElement("img", {
      src: config.url,
      alt: config.alt,
      style: imgStyle,
    })
  );
};

export default ImageLayer;
