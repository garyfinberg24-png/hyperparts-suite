import * as React from "react";
import type { IHyperRollupItem } from "../../models";
import type { ICalendarLayoutProps } from "./ILayoutProps";
import { flattenGroups } from "./ILayoutProps";
import { getMonthDays, getMonthLabel, getDayHeaders, getItemDateField } from "../../utils/calendarUtils";
import styles from "./CalendarLayout.module.scss";

/** Build a map of day-number -> items for the current month */
function buildDayItemMap(
  items: IHyperRollupItem[],
  year: number,
  month: number,
  dateField: string
): Record<number, IHyperRollupItem[]> {
  var map: Record<number, IHyperRollupItem[]> = {};
  items.forEach(function (item) {
    var d = getItemDateField(item, dateField);
    if (!isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month) {
      var day = d.getDate();
      if (!map[day]) {
        map[day] = [];
      }
      map[day].push(item);
    }
  });
  return map;
}

var MAX_CHIPS_PER_DAY = 3;

var CalendarLayoutInner: React.FC<ICalendarLayoutProps> = function (props) {
  var allItems = flattenGroups(props.groups);
  var year = props.calendarYear;
  var month = props.calendarMonth;

  var grid = React.useMemo(function () {
    return getMonthDays(year, month);
  }, [year, month]);

  var dayItems = React.useMemo(function () {
    return buildDayItemMap(allItems, year, month, props.dateField);
  }, [allItems, year, month, props.dateField]);

  var today = new Date();
  var isTodayMonth = today.getFullYear() === year && today.getMonth() === month;
  var todayDate = today.getDate();

  var handlePrevMonth = React.useCallback(function (): void {
    var newMonth = month - 1;
    var newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    }
    props.onNavigateMonth(newYear, newMonth);
  }, [year, month, props.onNavigateMonth]);

  var handleNextMonth = React.useCallback(function (): void {
    var newMonth = month + 1;
    var newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    }
    props.onNavigateMonth(newYear, newMonth);
  }, [year, month, props.onNavigateMonth]);

  var handleToday = React.useCallback(function (): void {
    var now = new Date();
    props.onNavigateMonth(now.getFullYear(), now.getMonth());
  }, [props.onNavigateMonth]);

  // Navigation bar
  var navBar = React.createElement(
    "div",
    { className: styles.calendarNav },
    React.createElement(
      "button",
      {
        className: styles.navButton,
        onClick: handlePrevMonth,
        "aria-label": "Previous month",
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--ChevronLeft", "aria-hidden": "true" })
    ),
    React.createElement(
      "h3",
      { className: styles.navTitle },
      getMonthLabel(year, month)
    ),
    React.createElement(
      "button",
      {
        className: styles.navButton,
        onClick: handleNextMonth,
        "aria-label": "Next month",
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--ChevronRight", "aria-hidden": "true" })
    ),
    React.createElement(
      "button",
      {
        className: styles.todayButton,
        onClick: handleToday,
      },
      "Today"
    )
  );

  // Day headers
  var headerCells: React.ReactElement[] = [];
  getDayHeaders().forEach(function (dayName) {
    headerCells.push(
      React.createElement("div", { key: dayName, className: styles.dayHeader }, dayName)
    );
  });

  // Calendar cells
  var dayCells: React.ReactElement[] = [];
  grid.forEach(function (cell, idx) {
    var isToday = isTodayMonth && cell.isCurrentMonth && cell.day === todayDate;
    var items = cell.isCurrentMonth ? (dayItems[cell.day] || []) : [];
    var hasMore = items.length > MAX_CHIPS_PER_DAY;
    var visibleItems = hasMore ? items.slice(0, MAX_CHIPS_PER_DAY) : items;

    var chipElements: React.ReactElement[] = [];
    visibleItems.forEach(function (item) {
      chipElements.push(
        React.createElement(
          "div",
          {
            key: item.id,
            className: styles.eventChip + (props.selectedItemId === item.id ? " " + styles.chipSelected : ""),
            onClick: function (e: React.MouseEvent) {
              e.stopPropagation();
              props.onSelectItem(item.id);
            },
            title: item.title,
            role: "button",
            tabIndex: 0,
            onKeyDown: function (e: React.KeyboardEvent) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                props.onSelectItem(item.id);
              }
            },
          },
          item.title
        )
      );
    });

    if (hasMore) {
      chipElements.push(
        React.createElement(
          "div",
          { key: "more-" + String(idx), className: styles.moreChip },
          "+" + String(items.length - MAX_CHIPS_PER_DAY) + " more"
        )
      );
    }

    var cellClasses = styles.dayCell
      + (cell.isCurrentMonth ? "" : " " + styles.otherMonth)
      + (isToday ? " " + styles.today : "");

    dayCells.push(
      React.createElement(
        "div",
        { key: "cell-" + String(idx), className: cellClasses },
        React.createElement(
          "span",
          { className: styles.dayNumber + (isToday ? " " + styles.todayNumber : "") },
          String(cell.day)
        ),
        chipElements.length > 0
          ? React.createElement("div", { className: styles.chipContainer }, chipElements)
          : undefined
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.calendarContainer,
      role: "grid",
      "aria-label": getMonthLabel(year, month) + " calendar view",
    },
    navBar,
    React.createElement("div", { className: styles.calendarGrid, role: "row" }, headerCells),
    React.createElement("div", { className: styles.calendarGrid }, dayCells)
  );
};

export var CalendarLayout = React.memo(CalendarLayoutInner);
