import * as React from "react";
import type { IHyperPresence } from "../models";
import { getPresenceConfig } from "../utils/presenceUtils";
import styles from "./HyperProfilePresenceBadge.module.scss";

export interface IHyperProfilePresenceBadgeProps {
  presence?: IHyperPresence;
}

const HyperProfilePresenceBadge: React.FC<IHyperProfilePresenceBadgeProps> = function (props) {
  const config = getPresenceConfig(props.presence);

  const badgeClass = styles.presenceBadge + (config.shouldPulse ? " " + styles.pulse : "");
  const badgeStyle: React.CSSProperties = { backgroundColor: config.color };

  return React.createElement(
    "span",
    {
      className: badgeClass,
      style: badgeStyle,
      title: config.label,
      role: "status",
      "aria-label": "Presence: " + config.label,
    }
  );
};

export default HyperProfilePresenceBadge;
