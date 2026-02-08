import * as React from "react";
import type { ICelebration } from "../models";
import { getCelebrationConfig, getCelebrationColor } from "../models";
import { getTeamsDeepLink } from "../utils/celebrationUtils";
import { getNextOccurrence } from "../utils/dateHelpers";
import { format } from "date-fns";
import HyperBirthdaysMilestoneBadge from "./HyperBirthdaysMilestoneBadge";
import styles from "./HyperBirthdaysCard.module.scss";

export interface IHyperBirthdaysCardProps {
  celebration: ICelebration;
  photoUrl: string;
  photoSize: number;
  enableTeamsDeepLink: boolean;
  enableMilestoneBadges: boolean;
  sendWishesLabel: string;
  onClick?: () => void;
}

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

const HyperBirthdaysCard: React.FC<IHyperBirthdaysCardProps> = function (props) {
  const celebration = props.celebration;
  const config = getCelebrationConfig(celebration.celebrationType);
  const borderColor = getCelebrationColor(celebration.celebrationType);
  const size = props.photoSize || 48;

  // Next occurrence date
  const nextDate = getNextOccurrence(celebration.celebrationDate);
  const dateStr = nextDate ? format(nextDate, "MMM d") : "";

  // Photo or initials
  const photoElement = props.photoUrl
    ? React.createElement("img", {
        src: props.photoUrl,
        alt: celebration.displayName,
        className: styles.photo,
        style: { width: size, height: size },
      })
    : React.createElement(
        "div",
        {
          className: styles.initialsCircle,
          style: {
            width: size,
            height: size,
            fontSize: Math.round(size * 0.4),
            backgroundColor: borderColor,
          },
        },
        getInitials(celebration.displayName)
      );

  // Teams deep link
  const wishButton = props.enableTeamsDeepLink && celebration.email
    ? React.createElement(
        "a",
        {
          href: getTeamsDeepLink(celebration.email),
          target: "_blank",
          rel: "noopener noreferrer",
          className: styles.wishButton,
          onClick: function (e: React.MouseEvent): void { e.stopPropagation(); },
        },
        props.sendWishesLabel
      )
    : undefined;

  // Milestone badge
  const milestoneBadge = props.enableMilestoneBadges && celebration.celebrationYear > 0
    ? React.createElement(HyperBirthdaysMilestoneBadge, {
        celebrationYear: celebration.celebrationYear,
      })
    : undefined;

  // Type label
  const typeText = celebration.customLabel || config.displayName;

  return React.createElement(
    "div",
    {
      className: styles.card,
      style: { borderLeftColor: borderColor },
      onClick: props.onClick,
      role: "listitem",
    },
    photoElement,
    React.createElement(
      "div",
      { className: styles.info },
      React.createElement(
        "div",
        { className: styles.nameRow },
        React.createElement("span", { className: styles.emoji }, config.emoji),
        React.createElement("span", { className: styles.name }, celebration.displayName),
        milestoneBadge
      ),
      React.createElement("div", { className: styles.typeLabel }, typeText),
      dateStr
        ? React.createElement("div", { className: styles.dateLabel }, dateStr)
        : undefined
    ),
    React.createElement(
      "div",
      { className: styles.actions },
      wishButton
    )
  );
};

export default HyperBirthdaysCard;
