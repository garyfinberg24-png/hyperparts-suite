import * as React from "react";
import type { IProfileBadge } from "../models/IHyperProfileBadge";
import styles from "./HyperProfileBadges.module.scss";

export interface IHyperProfileBadgesProps {
  badges: IProfileBadge[];
  showDescriptions: boolean;
  accentColor: string;
  onBadgeClick?: (badgeId: string) => void;
}

const HyperProfileBadges: React.FC<IHyperProfileBadgesProps> = function (props) {
  if (!props.badges || props.badges.length === 0) {
    return React.createElement("span", undefined);
  }

  const badgeElements: React.ReactNode[] = [];

  props.badges.forEach(function (badge) {
    const badgeChildren: React.ReactNode[] = [];

    // Emoji icon circle
    badgeChildren.push(
      React.createElement("span", {
        key: "icon",
        className: styles.badgeIcon,
        style: { backgroundColor: badge.color + "20", borderColor: badge.color },
      }, badge.icon)
    );

    // Name + optional description
    const infoChildren: React.ReactNode[] = [];
    infoChildren.push(React.createElement("span", { key: "name", className: styles.badgeName }, badge.name));

    if (props.showDescriptions && badge.description) {
      infoChildren.push(React.createElement("span", { key: "desc", className: styles.badgeDescription }, badge.description));
    }

    if (badge.awardedDate) {
      const dateStr = badge.awardedDate;
      infoChildren.push(React.createElement("span", { key: "date", className: styles.badgeDate },
        (badge.awardedBy ? "by " + badge.awardedBy + " \u2022 " : "") + dateStr
      ));
    }

    badgeChildren.push(React.createElement("div", { key: "info", className: styles.badgeInfo }, infoChildren));

    badgeElements.push(
      React.createElement("div", {
        key: badge.id,
        className: styles.badgeItem,
        role: "listitem",
        tabIndex: 0,
        onClick: function () {
          if (props.onBadgeClick) props.onBadgeClick(badge.id);
        },
        onKeyDown: function (e: React.KeyboardEvent) {
          if ((e.key === "Enter" || e.key === " ") && props.onBadgeClick) {
            e.preventDefault();
            props.onBadgeClick(badge.id);
          }
        },
      }, badgeChildren)
    );
  });

  return React.createElement("div", {
    className: styles.badgesContainer,
    role: "list",
    "aria-label": "Badges and Recognition",
  }, badgeElements);
};

export default HyperProfileBadges;
