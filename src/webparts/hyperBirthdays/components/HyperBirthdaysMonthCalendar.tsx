import * as React from "react";
import type { ICelebration } from "../models";
import { getCelebrationEmoji } from "../models";
import { useCelebrationCalendar } from "../hooks/useCelebrationCalendar";
import HyperBirthdaysCard from "./HyperBirthdaysCard";
import styles from "./HyperBirthdaysMonthCalendar.module.scss";

export interface IHyperBirthdaysMonthCalendarProps {
  celebrations: ICelebration[];
  photoMap: Record<string, string>;
  photoSize: number;
  year: number;
  month: number;
  enableTeamsDeepLink: boolean;
  enableMilestoneBadges: boolean;
  sendWishesLabel: string;
  onSelectCelebration: (id: string) => void;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HyperBirthdaysMonthCalendar: React.FC<IHyperBirthdaysMonthCalendarProps> = function (props) {
  const rows = useCelebrationCalendar(props.celebrations, props.year, props.month);
  const [expandedDay, setExpandedDay] = React.useState<number>(0);

  // Day headers
  const headerElements: React.ReactNode[] = [];
  DAY_LABELS.forEach(function (label, i) {
    headerElements.push(
      React.createElement("div", { key: "h-" + String(i), className: styles.dayHeader }, label)
    );
  });

  // Day cells
  const cellElements: React.ReactNode[] = [];
  rows.forEach(function (row, rowIdx) {
    row.forEach(function (day, colIdx) {
      const key = "d-" + String(rowIdx) + "-" + String(colIdx);
      const hasCelebrations = day.celebrations.length > 0;

      let cellClass = styles.dayCell;
      if (!day.isCurrentMonth) cellClass += " " + styles.dayCellOtherMonth;
      if (day.isToday) cellClass += " " + styles.dayCellToday;
      if (hasCelebrations) cellClass += " " + styles.dayCellHasCelebrations;

      // Day number
      let numberClass = styles.dayNumber;
      if (day.isToday) numberClass = styles.dayNumberToday;
      else if (!day.isCurrentMonth) numberClass += " " + styles.dayNumberOther;

      const dayNumberEl = React.createElement(
        "div",
        { className: numberClass },
        String(day.dayOfMonth)
      );

      // Celebration emoji dots
      const dots: React.ReactNode[] = [];
      day.celebrations.forEach(function (c, ci) {
        dots.push(
          React.createElement(
            "span",
            { key: ci, className: styles.celebrationDot, title: c.displayName },
            getCelebrationEmoji(c.celebrationType)
          )
        );
      });

      const dotsEl = dots.length > 0
        ? React.createElement("div", { className: styles.celebrationDots }, dots)
        : undefined;

      // Expanded day cards
      const isExpanded = expandedDay === day.dayOfMonth && day.isCurrentMonth && hasCelebrations;
      const expandedCards: React.ReactNode[] = [];
      if (isExpanded) {
        day.celebrations.forEach(function (c) {
          expandedCards.push(
            React.createElement(HyperBirthdaysCard, {
              key: c.id,
              celebration: c,
              photoUrl: props.photoMap[c.userId] || "",
              photoSize: Math.min(props.photoSize, 36),
              enableTeamsDeepLink: props.enableTeamsDeepLink,
              enableMilestoneBadges: props.enableMilestoneBadges,
              sendWishesLabel: props.sendWishesLabel,
              onClick: function (): void { props.onSelectCelebration(c.id); },
            })
          );
        });
      }

      const expandedEl = expandedCards.length > 0
        ? React.createElement("div", { className: styles.expandedDay }, expandedCards)
        : undefined;

      const handleClick = hasCelebrations
        ? function (): void {
            setExpandedDay(function (prev) {
              return prev === day.dayOfMonth ? 0 : day.dayOfMonth;
            });
          }
        : undefined;

      cellElements.push(
        React.createElement(
          "div",
          { key: key, className: cellClass, onClick: handleClick },
          dayNumberEl,
          dotsEl,
          expandedEl
        )
      );
    });
  });

  return React.createElement(
    "div",
    { className: styles.calendarGrid, role: "grid", "aria-label": "Celebration calendar" },
    headerElements,
    cellElements
  );
};

export default HyperBirthdaysMonthCalendar;
