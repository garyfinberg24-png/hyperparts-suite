import * as React from "react";
import type { LinkHealthStatus } from "../store/useHyperNavStore";
import styles from "./HyperNavHealthIndicator.module.scss";

export interface IHyperNavHealthIndicatorProps {
  status: LinkHealthStatus;
}

function getStatusLabel(status: LinkHealthStatus): string {
  switch (status) {
    case "healthy": return "Link is reachable";
    case "broken": return "Link may be broken";
    case "unknown": return "Link status unknown";
    default: return "Link status unknown";
  }
}

export const HyperNavHealthIndicator: React.FC<IHyperNavHealthIndicatorProps> = function (props) {
  const statusClass =
    props.status === "healthy" ? styles.healthy :
    props.status === "broken" ? styles.broken :
    styles.unknown;

  return React.createElement("span", {
    className: styles.healthDot + " " + statusClass,
    title: getStatusLabel(props.status),
    "aria-label": getStatusLabel(props.status),
    role: "img",
  });
};
