import * as React from "react";
import Masonry from "react-masonry-css";
import type { ICelebration } from "../models";
import { getCelebrationConfig, getCelebrationColor, getCelebrationGradient } from "../models";
import { getTeamsDeepLink } from "../utils/celebrationUtils";
import { getNextOccurrence, isToday } from "../utils/dateHelpers";
import { format } from "date-fns";
import HyperBirthdaysMilestoneBadge from "./HyperBirthdaysMilestoneBadge";
import styles from "./HyperBirthdaysMasonryWall.module.scss";

export interface IHyperBirthdaysMasonryWallProps {
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

var MASONRY_BREAKPOINTS: Record<string, number> = {
  default: 4,
  1100: 3,
  700: 2,
  400: 1,
};

var HyperBirthdaysMasonryWall: React.FC<IHyperBirthdaysMasonryWallProps> = function (props) {
  if (props.celebrations.length === 0) {
    return React.createElement("div", { className: styles.emptyWall }, "No celebrations to display.");
  }

  var cards: React.ReactElement[] = [];

  props.celebrations.forEach(function (celebration, index) {
    var config = getCelebrationConfig(celebration.celebrationType);
    var color = getCelebrationColor(celebration.celebrationType);
    var gradient = getCelebrationGradient(celebration.celebrationType);
    var photoUrl = props.photoMap[celebration.userId] || "";
    var nextDate = getNextOccurrence(celebration.celebrationDate);
    var dateStr = nextDate ? format(nextDate, "MMM d") : "";
    var isTodayCelebration = isToday(celebration.celebrationDate);

    // Vary card height for masonry effect — every 3rd card is "tall" (has gradient banner)
    var isFeatured = index % 3 === 0;

    // Photo element
    var photoSize = isFeatured ? Math.max(props.photoSize, 64) : props.photoSize;
    var photoElement = photoUrl
      ? React.createElement("img", {
          src: photoUrl,
          alt: celebration.displayName,
          className: styles.wallPhoto,
          style: { width: photoSize, height: photoSize },
        })
      : React.createElement("div", {
          className: styles.wallInitials,
          style: {
            width: photoSize,
            height: photoSize,
            fontSize: Math.round(photoSize * 0.4),
            backgroundColor: color,
          },
        }, getInitials(celebration.displayName));

    // Wish button
    var wishButton = props.enableTeamsDeepLink && celebration.email
      ? React.createElement("a", {
          href: getTeamsDeepLink(celebration.email),
          target: "_blank",
          rel: "noopener noreferrer",
          className: styles.wallWishButton,
          onClick: function (e: React.MouseEvent): void { e.stopPropagation(); },
        }, props.sendWishesLabel)
      : undefined;

    // Milestone badge
    var milestoneBadge = props.enableMilestoneBadges && celebration.celebrationYear > 0
      ? React.createElement(HyperBirthdaysMilestoneBadge, { celebrationYear: celebration.celebrationYear })
      : undefined;

    cards.push(
      React.createElement("div", {
        key: celebration.id,
        className: isFeatured ? styles.wallCard + " " + styles.wallCardFeatured : styles.wallCard,
        onClick: function () { props.onSelectCelebration(celebration.id); },
        role: "listitem",
      },
        // Featured cards get a gradient banner
        isFeatured
          ? React.createElement("div", {
              className: styles.wallBanner,
              style: { background: gradient },
            },
              React.createElement("span", { className: styles.bannerEmoji }, config.emoji),
              isTodayCelebration
                ? React.createElement("span", { className: styles.todayTag }, "Today!")
                : undefined
            )
          : undefined,

        React.createElement("div", { className: styles.wallCardBody },
          photoElement,
          React.createElement("div", { className: styles.wallInfo },
            React.createElement("div", { className: styles.wallNameRow },
              !isFeatured
                ? React.createElement("span", { className: styles.wallEmoji }, config.emoji)
                : undefined,
              React.createElement("span", { className: styles.wallName }, celebration.displayName),
              milestoneBadge
            ),
            React.createElement("div", { className: styles.wallType },
              celebration.customLabel || config.displayName
            ),
            dateStr
              ? React.createElement("div", { className: styles.wallDate }, dateStr)
              : undefined,
            celebration.jobTitle
              ? React.createElement("div", { className: styles.wallJobTitle }, celebration.jobTitle)
              : undefined
          )
        ),
        wishButton
          ? React.createElement("div", { className: styles.wallActions }, wishButton)
          : undefined
      )
    );
  });

  return React.createElement(
    Masonry,
    {
      breakpointCols: MASONRY_BREAKPOINTS,
      className: styles.masonryGrid,
      columnClassName: styles.masonryColumn,
    },
    cards
  );
};

export default HyperBirthdaysMasonryWall;
