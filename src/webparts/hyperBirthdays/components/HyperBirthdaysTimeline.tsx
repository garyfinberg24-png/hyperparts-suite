import * as React from "react";
import type { ICelebration } from "../models";
import { getCelebrationColor, getCelebrationConfig } from "../models";
import { getNextOccurrence, isToday } from "../utils/dateHelpers";
import { format } from "date-fns";
import HyperBirthdaysCard from "./HyperBirthdaysCard";
import styles from "./HyperBirthdaysTimeline.module.scss";

export interface IHyperBirthdaysTimelineProps {
  celebrations: ICelebration[];
  photoMap: Record<string, string>;
  photoSize: number;
  enableTeamsDeepLink: boolean;
  enableMilestoneBadges: boolean;
  sendWishesLabel: string;
  onSelectCelebration: (id: string) => void;
}

const HyperBirthdaysTimeline: React.FC<IHyperBirthdaysTimelineProps> = function (props) {
  if (props.celebrations.length === 0) {
    return React.createElement("div", { className: styles.emptyTimeline }, "No celebrations to display.");
  }

  // Group by date for date markers
  var dateGroups: Array<{ dateKey: string; dateLabel: string; items: ICelebration[] }> = [];
  var groupMap: Record<string, ICelebration[]> = {};
  var groupOrder: string[] = [];

  props.celebrations.forEach(function (c) {
    var nextDate = getNextOccurrence(c.celebrationDate);
    var key = nextDate ? format(nextDate, "yyyy-MM-dd") : "unknown";
    if (!groupMap[key]) {
      groupMap[key] = [];
      groupOrder.push(key);
    }
    groupMap[key].push(c);
  });

  groupOrder.forEach(function (key) {
    var firstItem = groupMap[key][0];
    var nextDate = getNextOccurrence(firstItem.celebrationDate);
    var label = nextDate ? format(nextDate, "EEEE, MMM d") : "Unknown Date";
    var isTodayDate = isToday(firstItem.celebrationDate);
    if (isTodayDate) {
      label = "Today \u2014 " + label;
    }
    dateGroups.push({
      dateKey: key,
      dateLabel: label,
      items: groupMap[key],
    });
  });

  var timelineItems: React.ReactElement[] = [];
  var itemIndex = 0;

  dateGroups.forEach(function (group) {
    // Date marker
    var markerIsToday = group.items.length > 0 && isToday(group.items[0].celebrationDate);
    timelineItems.push(
      React.createElement("div", {
        key: "marker-" + group.dateKey,
        className: markerIsToday ? styles.dateMarker + " " + styles.dateMarkerToday : styles.dateMarker,
      },
        React.createElement("span", { className: styles.dateMarkerDot }),
        React.createElement("span", { className: styles.dateMarkerLabel }, group.dateLabel)
      )
    );

    // Celebration items — alternate left/right
    group.items.forEach(function (celebration) {
      var side = itemIndex % 2 === 0 ? "left" : "right";
      var color = getCelebrationColor(celebration.celebrationType);
      var config = getCelebrationConfig(celebration.celebrationType);

      timelineItems.push(
        React.createElement("div", {
          key: celebration.id,
          className: side === "left" ? styles.timelineItemLeft : styles.timelineItemRight,
        },
          React.createElement("div", {
            className: styles.timelineConnector,
            style: { backgroundColor: color },
          }),
          React.createElement("div", { className: styles.timelineEmoji },
            React.createElement("span", {
              className: styles.emojiDot,
              style: { backgroundColor: color },
            }, config.emoji)
          ),
          React.createElement("div", { className: styles.timelineCardWrapper },
            React.createElement(HyperBirthdaysCard, {
              celebration: celebration,
              photoUrl: props.photoMap[celebration.userId] || "",
              photoSize: props.photoSize,
              enableTeamsDeepLink: props.enableTeamsDeepLink,
              enableMilestoneBadges: props.enableMilestoneBadges,
              sendWishesLabel: props.sendWishesLabel,
              onClick: function () { props.onSelectCelebration(celebration.id); },
            })
          )
        )
      );
      itemIndex++;
    });
  });

  return React.createElement(
    "div",
    { className: styles.timeline, role: "list", "aria-label": "Celebrations timeline" },
    React.createElement("div", { className: styles.timelineLine }),
    timelineItems
  );
};

export default HyperBirthdaysTimeline;
