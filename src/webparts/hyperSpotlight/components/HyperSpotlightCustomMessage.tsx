import * as React from "react";
import type { IHyperSpotlightEmployee } from "../models";
import { replaceTokens } from "../utils/tokenReplacer";
import styles from "./HyperSpotlightCustomMessage.module.scss";

export interface IHyperSpotlightCustomMessageProps {
  message: string;
  employee: IHyperSpotlightEmployee;
  position: "above" | "below" | "overlay-center" | "overlay-bottom";
}

const POSITION_MAP: Record<string, string> = {
  above: styles.positionAbove,
  below: styles.positionBelow,
  "overlay-center": styles.positionOverlayCenter,
  "overlay-bottom": styles.positionOverlayBottom,
};

const HyperSpotlightCustomMessage: React.FC<IHyperSpotlightCustomMessageProps> = function (props) {
  const processed = replaceTokens(props.message, props.employee);
  const posClass = POSITION_MAP[props.position] || "";

  return React.createElement(
    "div",
    { className: styles.customMessage + " " + posClass },
    processed
  );
};

export default HyperSpotlightCustomMessage;
