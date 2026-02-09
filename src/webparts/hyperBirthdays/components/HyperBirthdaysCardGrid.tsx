import * as React from "react";
import type { ICelebration } from "../models";
import HyperBirthdaysCard from "./HyperBirthdaysCard";
import styles from "./HyperBirthdaysCardGrid.module.scss";

export interface IHyperBirthdaysCardGridProps {
  celebrations: ICelebration[];
  photoMap: Record<string, string>;
  photoSize: number;
  enableTeamsDeepLink: boolean;
  enableMilestoneBadges: boolean;
  sendWishesLabel: string;
  onSelectCelebration: (id: string) => void;
}

var HyperBirthdaysCardGrid: React.FC<IHyperBirthdaysCardGridProps> = function (props) {
  if (props.celebrations.length === 0) {
    return React.createElement("div", { className: styles.emptyGrid }, "No celebrations to display.");
  }

  var cards: React.ReactElement[] = [];

  props.celebrations.forEach(function (celebration) {
    cards.push(
      React.createElement(HyperBirthdaysCard, {
        key: celebration.id,
        celebration: celebration,
        photoUrl: props.photoMap[celebration.userId] || "",
        photoSize: props.photoSize,
        enableTeamsDeepLink: props.enableTeamsDeepLink,
        enableMilestoneBadges: props.enableMilestoneBadges,
        sendWishesLabel: props.sendWishesLabel,
        onClick: function () { props.onSelectCelebration(celebration.id); },
      })
    );
  });

  return React.createElement("div", {
    className: styles.cardGrid,
    role: "list",
    "aria-label": "Celebrations grid",
  }, cards);
};

export default HyperBirthdaysCardGrid;
