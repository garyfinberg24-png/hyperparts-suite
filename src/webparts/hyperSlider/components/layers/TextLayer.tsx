import * as React from "react";
import type { ITextLayerConfig } from "../../models";
import styles from "./TextLayer.module.scss";

export interface ITextLayerProps {
  config: ITextLayerConfig;
}

const TextLayer: React.FC<ITextLayerProps> = function (props) {
  const { config } = props;

  const style: React.CSSProperties = {
    fontSize: config.fontSize + "px",
    fontWeight: config.fontWeight,
    fontFamily: config.fontFamily,
    color: config.color,
    textAlign: config.textAlign as React.CSSProperties["textAlign"],
    lineHeight: config.lineHeight,
    letterSpacing: config.letterSpacing + "px",
    textShadow: config.textShadow,
    whiteSpace: config.whiteSpace as React.CSSProperties["whiteSpace"],
  };

  return React.createElement("div", {
    className: styles.textLayer,
    style: style,
    dangerouslySetInnerHTML: { __html: config.content },
  });
};

export default TextLayer;
