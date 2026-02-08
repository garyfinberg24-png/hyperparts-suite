import * as React from "react";
import type { IMilestoneBadge } from "../models";
import { getMilestoneBadge, calculateYears } from "../models";
import styles from "./HyperBirthdaysMilestoneBadge.module.scss";

export interface IHyperBirthdaysMilestoneBadgeProps {
  celebrationYear: number;
}

const HyperBirthdaysMilestoneBadge: React.FC<IHyperBirthdaysMilestoneBadgeProps> = function (props) {
  if (props.celebrationYear <= 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const years = calculateYears(props.celebrationYear);
  const badge: IMilestoneBadge | undefined = getMilestoneBadge(years);

  if (!badge) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  return React.createElement(
    "span",
    {
      className: styles.badge,
      style: { backgroundColor: badge.color },
      title: badge.label,
    },
    React.createElement("span", { className: styles.badgeIcon }, badge.icon),
    React.createElement("span", { className: styles.badgeLabel }, badge.label)
  );
};

export default HyperBirthdaysMilestoneBadge;
