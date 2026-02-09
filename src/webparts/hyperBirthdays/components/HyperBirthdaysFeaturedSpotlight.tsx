import * as React from "react";
import type { ICelebration } from "../models";
import { getCelebrationConfig, getCelebrationColor, getCelebrationGradient } from "../models";
import { getTeamsDeepLink } from "../utils/celebrationUtils";
import { getNextOccurrence, isToday } from "../utils/dateHelpers";
import { format } from "date-fns";
import HyperBirthdaysCard from "./HyperBirthdaysCard";
import HyperBirthdaysMilestoneBadge from "./HyperBirthdaysMilestoneBadge";
import styles from "./HyperBirthdaysFeaturedSpotlight.module.scss";

export interface IHyperBirthdaysFeaturedSpotlightProps {
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

var HyperBirthdaysFeaturedSpotlight: React.FC<IHyperBirthdaysFeaturedSpotlightProps> = function (props) {
  if (props.celebrations.length === 0) {
    return React.createElement("div", { className: styles.emptySpotlight }, "No celebrations to spotlight.");
  }

  // Find the first "today" celebration, or fall back to the first upcoming
  var featured: ICelebration = props.celebrations[0];
  props.celebrations.forEach(function (c) {
    if (isToday(c.celebrationDate) && !isToday(featured.celebrationDate)) {
      featured = c;
    }
  });

  var remaining = props.celebrations.filter(function (c) { return c.id !== featured.id; });
  var config = getCelebrationConfig(featured.celebrationType);
  var gradient = getCelebrationGradient(featured.celebrationType);
  var color = getCelebrationColor(featured.celebrationType);
  var photoUrl = props.photoMap[featured.userId] || "";
  var photoSize = Math.max(props.photoSize, 80); // Bigger for featured
  var nextDate = getNextOccurrence(featured.celebrationDate);
  var dateStr = nextDate ? format(nextDate, "EEEE, MMMM d") : "";
  var isTodayCelebration = isToday(featured.celebrationDate);

  // Featured hero photo
  var heroPhoto = photoUrl
    ? React.createElement("img", {
        src: photoUrl,
        alt: featured.displayName,
        className: styles.heroPhoto,
        style: { width: photoSize, height: photoSize },
      })
    : React.createElement("div", {
        className: styles.heroInitials,
        style: {
          width: photoSize,
          height: photoSize,
          fontSize: Math.round(photoSize * 0.4),
          backgroundColor: color,
        },
      }, getInitials(featured.displayName));

  // Teams wish button for featured
  var wishButton = props.enableTeamsDeepLink && featured.email
    ? React.createElement("a", {
        href: getTeamsDeepLink(featured.email),
        target: "_blank",
        rel: "noopener noreferrer",
        className: styles.heroWishButton,
        onClick: function (e: React.MouseEvent): void { e.stopPropagation(); },
      }, "\uD83C\uDF89 " + props.sendWishesLabel)
    : undefined;

  // Milestone badge for featured
  var milestoneBadge = props.enableMilestoneBadges && featured.celebrationYear > 0
    ? React.createElement(HyperBirthdaysMilestoneBadge, { celebrationYear: featured.celebrationYear })
    : undefined;

  // Featured hero card
  var heroCard = React.createElement("div", {
    className: styles.heroCard,
    style: { background: gradient },
    onClick: function () { props.onSelectCelebration(featured.id); },
    role: "article",
    "aria-label": featured.displayName + " celebration spotlight",
  },
    isTodayCelebration
      ? React.createElement("div", { className: styles.todayBadge }, "Today!")
      : undefined,
    React.createElement("div", { className: styles.heroEmoji }, config.emoji),
    heroPhoto,
    React.createElement("div", { className: styles.heroInfo },
      React.createElement("div", { className: styles.heroName }, featured.displayName),
      React.createElement("div", { className: styles.heroType },
        config.displayName,
        milestoneBadge
      ),
      dateStr
        ? React.createElement("div", { className: styles.heroDate }, dateStr)
        : undefined,
      featured.jobTitle
        ? React.createElement("div", { className: styles.heroJobTitle }, featured.jobTitle)
        : undefined,
      featured.department
        ? React.createElement("div", { className: styles.heroDepartment }, featured.department)
        : undefined
    ),
    wishButton
  );

  // Remaining cards in a small grid below
  var remainingCards: React.ReactElement[] = [];
  remaining.forEach(function (c) {
    remainingCards.push(
      React.createElement(HyperBirthdaysCard, {
        key: c.id,
        celebration: c,
        photoUrl: props.photoMap[c.userId] || "",
        photoSize: props.photoSize,
        enableTeamsDeepLink: props.enableTeamsDeepLink,
        enableMilestoneBadges: props.enableMilestoneBadges,
        sendWishesLabel: props.sendWishesLabel,
        onClick: function () { props.onSelectCelebration(c.id); },
      })
    );
  });

  return React.createElement("div", { className: styles.spotlightContainer },
    heroCard,
    remainingCards.length > 0
      ? React.createElement("div", {
          className: styles.remainingGrid,
          role: "list",
          "aria-label": "Other celebrations",
        }, remainingCards)
      : undefined
  );
};

export default HyperBirthdaysFeaturedSpotlight;
