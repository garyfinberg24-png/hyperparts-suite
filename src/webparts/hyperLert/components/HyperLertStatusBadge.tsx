import * as React from "react";
import type { AlertStatus } from "../models";
import { getStatusLabel } from "../utils/historyUtils";
import styles from "./HyperLertStatusBadge.module.scss";

export interface IHyperLertStatusBadgeProps {
  status: AlertStatus | string;
}

function getStatusClassName(status: string): string {
  switch (status) {
    case "active": return styles.active;
    case "snoozed": return styles.snoozed;
    case "acknowledged": return styles.acknowledged;
    case "expired": return styles.expired;
    case "disabled": return styles.disabled;
    default: return styles.badge;
  }
}

const HyperLertStatusBadge: React.FC<IHyperLertStatusBadgeProps> = function (props) {
  return React.createElement(
    "span",
    { className: getStatusClassName(props.status) },
    getStatusLabel(props.status)
  );
};

export default HyperLertStatusBadge;
