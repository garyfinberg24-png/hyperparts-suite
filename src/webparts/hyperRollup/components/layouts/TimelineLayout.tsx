import * as React from "react";
import type { IHyperRollupItem } from "../../models";
import type { ITimelineLayoutProps } from "./ILayoutProps";
import { flattenGroups } from "./ILayoutProps";
import { getItemDateString, groupItemsByDate } from "../../utils/timelineUtils";
import styles from "./TimelineLayout.module.scss";

const TimelineLayoutInner: React.FC<ITimelineLayoutProps> = function (props) {
  var allItems = flattenGroups(props.groups);

  if (allItems.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Sort items by date descending for timeline
  var sorted: IHyperRollupItem[] = [];
  allItems.forEach(function (item) { sorted.push(item); });
  sorted.sort(function (a, b) {
    var da = new Date(getItemDateString(a, props.dateField)).getTime();
    var db = new Date(getItemDateString(b, props.dateField)).getTime();
    return db - da;
  });

  var dateGroups = groupItemsByDate(sorted, props.dateField);
  var cardIndex = 0;

  var groupElements: React.ReactElement[] = [];
  dateGroups.forEach(function (group) {
    // Date marker
    groupElements.push(
      React.createElement(
        "div",
        { key: "marker-" + group.dateKey, className: styles.timelineMarker },
        React.createElement("div", { className: styles.markerDot }),
        React.createElement("div", { className: styles.markerLabel }, group.dateLabel)
      )
    );

    // Items under this date
    group.items.forEach(function (item) {
      var side = cardIndex % 2 === 0 ? styles.timelineLeft : styles.timelineRight;
      var isSelected = props.selectedItemId === item.id;

      groupElements.push(
        React.createElement(
          "div",
          {
            key: item.id,
            className: styles.timelineEntry + " " + side + (isSelected ? " " + styles.selected : ""),
          },
          React.createElement("div", { className: styles.entryDot }),
          React.createElement(
            "div",
            {
              className: styles.entryCard,
              onClick: function () { props.onSelectItem(item.id); },
              role: "button",
              tabIndex: 0,
              "aria-selected": isSelected,
              onKeyDown: function (e: React.KeyboardEvent) {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  props.onSelectItem(item.id);
                }
              },
            },
            React.createElement("h4", { className: styles.entryTitle }, item.title),
            item.description
              ? React.createElement(
                  "p",
                  { className: styles.entryDesc },
                  item.description.length > 120
                    ? item.description.substring(0, 120) + "..."
                    : item.description
                )
              : undefined,
            React.createElement(
              "div",
              { className: styles.entryMeta },
              item.author
                ? React.createElement("span", undefined, item.author)
                : undefined,
              React.createElement("span", undefined, item.sourceListName || ""),
              item.fileType
                ? React.createElement("span", { className: styles.entryBadge }, item.fileType.toUpperCase())
                : undefined
            )
          )
        )
      );

      cardIndex++;
    });
  });

  return React.createElement(
    "div",
    {
      className: styles.timelineContainer,
      role: "feed",
      "aria-label": "Timeline view",
    },
    React.createElement("div", { className: styles.timelineLine }),
    groupElements
  );
};

export const TimelineLayout = React.memo(TimelineLayoutInner);
