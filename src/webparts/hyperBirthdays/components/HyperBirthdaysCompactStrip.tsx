import * as React from "react";
import type { ICelebration } from "../models";
import { getCelebrationConfig, getCelebrationColor } from "../models";
import { getTeamsDeepLink } from "../utils/celebrationUtils";
import { getNextOccurrence, isToday } from "../utils/dateHelpers";
import { format } from "date-fns";
import HyperBirthdaysMilestoneBadge from "./HyperBirthdaysMilestoneBadge";
import styles from "./HyperBirthdaysCompactStrip.module.scss";

export interface IHyperBirthdaysCompactStripProps {
  celebrations: ICelebration[];
  photoMap: Record<string, string>;
  photoSize: number;
  enableTeamsDeepLink: boolean;
  enableMilestoneBadges: boolean;
  sendWishesLabel: string;
  onSelectCelebration: (id: string) => void;
}

function getInitials(name: string): string {
  if (!name) return "?";
  var parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

var HyperBirthdaysCompactStrip: React.FC<IHyperBirthdaysCompactStripProps> = function (props) {
  var hoveredIdState = React.useState<string>("");
  var hoveredId = hoveredIdState[0];
  var setHoveredId = hoveredIdState[1];

  if (props.celebrations.length === 0) {
    return React.createElement("div", { className: styles.emptyStrip }, "No celebrations to display.");
  }

  var avatarSize = Math.min(props.photoSize, 56);

  var items: React.ReactElement[] = [];

  props.celebrations.forEach(function (celebration) {
    var config = getCelebrationConfig(celebration.celebrationType);
    var color = getCelebrationColor(celebration.celebrationType);
    var photoUrl = props.photoMap[celebration.userId] || "";
    var isTodayCelebration = isToday(celebration.celebrationDate);
    var nextDate = getNextOccurrence(celebration.celebrationDate);
    var dateStr = nextDate ? format(nextDate, "MMM d") : "";
    var isHovered = hoveredId === celebration.id;

    // Avatar element
    var avatarElement = photoUrl
      ? React.createElement("img", {
          src: photoUrl,
          alt: celebration.displayName,
          className: styles.avatar,
          style: { width: avatarSize, height: avatarSize, borderColor: color },
        })
      : React.createElement("div", {
          className: styles.avatarInitials,
          style: {
            width: avatarSize,
            height: avatarSize,
            fontSize: Math.round(avatarSize * 0.38),
            backgroundColor: color,
          },
        }, getInitials(celebration.displayName));

    // Tooltip popup (visible on hover)
    var tooltip = isHovered
      ? React.createElement("div", {
          className: styles.tooltip,
          role: "tooltip",
          id: "tooltip-" + celebration.id,
        },
          React.createElement("div", { className: styles.tooltipName }, celebration.displayName),
          React.createElement("div", { className: styles.tooltipType },
            config.emoji + " " + (celebration.customLabel || config.displayName)
          ),
          dateStr
            ? React.createElement("div", { className: styles.tooltipDate }, dateStr)
            : undefined,
          celebration.jobTitle
            ? React.createElement("div", { className: styles.tooltipJob }, celebration.jobTitle)
            : undefined,
          props.enableMilestoneBadges && celebration.celebrationYear > 0
            ? React.createElement(HyperBirthdaysMilestoneBadge, { celebrationYear: celebration.celebrationYear })
            : undefined,
          props.enableTeamsDeepLink && celebration.email
            ? React.createElement("a", {
                href: getTeamsDeepLink(celebration.email),
                target: "_blank",
                rel: "noopener noreferrer",
                className: styles.tooltipWish,
                onClick: function (e: React.MouseEvent): void { e.stopPropagation(); },
              }, props.sendWishesLabel)
            : undefined
        )
      : undefined;

    items.push(
      React.createElement("div", {
        key: celebration.id,
        className: isTodayCelebration ? styles.stripItem + " " + styles.stripItemToday : styles.stripItem,
        onClick: function () { props.onSelectCelebration(celebration.id); },
        onMouseEnter: function () { setHoveredId(celebration.id); },
        onMouseLeave: function () { setHoveredId(""); },
        onFocus: function () { setHoveredId(celebration.id); },
        onBlur: function () { setHoveredId(""); },
        tabIndex: 0,
        role: "listitem",
        "aria-describedby": isHovered ? "tooltip-" + celebration.id : undefined,
      },
        avatarElement,
        React.createElement("span", { className: styles.stripEmoji }, config.emoji),
        tooltip
      )
    );
  });

  return React.createElement("div", {
    className: styles.strip,
    role: "list",
    "aria-label": "Celebrations strip",
  }, items);
};

export default HyperBirthdaysCompactStrip;
