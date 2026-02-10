import * as React from "react";
import type { IHyperRollupItem } from "../../models";
import type { ITop10LayoutProps } from "./ILayoutProps";
import { flattenGroups } from "./ILayoutProps";
import styles from "./Top10Layout.module.scss";

/** Get the numeric rank value from an item */
function getRankValue(item: IHyperRollupItem, rankField: string): number {
  // Check fields map first
  if (rankField && item.fields && item.fields[rankField] !== undefined) {
    var val = Number(item.fields[rankField]);
    if (!isNaN(val)) return val;
  }
  // Built-in field shortcuts
  if (rankField === "modified" || rankField === "Modified") {
    return new Date(item.modified).getTime();
  }
  if (rankField === "created" || rankField === "Created") {
    return new Date(item.created).getTime();
  }
  // Default to modified date
  return new Date(item.modified).getTime();
}

/** Format the rank value for display */
function formatRankDisplay(item: IHyperRollupItem, rankField: string): string {
  if (!rankField) return "";
  var lower = rankField.toLowerCase();
  // Date fields: show date
  if (lower === "modified" || lower === "created") {
    var dateStr = lower === "created" ? item.created : item.modified;
    return new Date(dateStr).toLocaleDateString();
  }
  // View/like counts: show number
  if (item.fields && item.fields[rankField] !== undefined) {
    var val = item.fields[rankField];
    if (typeof val === "number") {
      // Format large numbers
      if (val >= 1000000) return String(Math.round(val / 100000) / 10) + "M";
      if (val >= 1000) return String(Math.round(val / 100) / 10) + "K";
      return String(val);
    }
    return String(val);
  }
  return "";
}

/** Get rank badge class based on position */
function getRankClass(position: number): string {
  if (position === 0) return styles.rankGold;
  if (position === 1) return styles.rankSilver;
  if (position === 2) return styles.rankBronze;
  return styles.rankDefault;
}

var Top10LayoutInner: React.FC<ITop10LayoutProps> = function (props) {
  var allItems = flattenGroups(props.groups);
  var maxItems = props.maxItems || 10;
  var rankField = props.rankByField || "modified";
  var direction = props.rankDirection || "desc";

  // Sort by rank field
  var ranked = React.useMemo(function () {
    var items: IHyperRollupItem[] = [];
    allItems.forEach(function (item) { items.push(item); });

    items.sort(function (a, b) {
      var va = getRankValue(a, rankField);
      var vb = getRankValue(b, rankField);
      return direction === "desc" ? vb - va : va - vb;
    });

    return items.slice(0, maxItems);
  }, [allItems, rankField, direction, maxItems]);

  if (ranked.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  var rowElements: React.ReactElement[] = [];
  ranked.forEach(function (item, idx) {
    var isSelected = props.selectedItemId === item.id;
    var rankDisplay = formatRankDisplay(item, rankField);

    rowElements.push(
      React.createElement(
        "div",
        {
          key: item.id,
          className: styles.top10Row + (isSelected ? " " + styles.selected : ""),
          onClick: function () { props.onSelectItem(item.id); },
          role: "row",
          tabIndex: 0,
          "aria-selected": isSelected,
          onKeyDown: function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              props.onSelectItem(item.id);
            }
          },
        },
        // Rank number badge
        React.createElement(
          "div",
          { className: styles.rankBadge + " " + getRankClass(idx) },
          String(idx + 1)
        ),
        // Item content
        React.createElement(
          "div",
          { className: styles.top10Content },
          React.createElement("div", { className: styles.top10Title, title: item.title }, item.title),
          React.createElement(
            "div",
            { className: styles.top10Subtitle },
            (item.author || "") +
              (item.sourceListName ? " \u00B7 " + item.sourceListName : "")
          )
        ),
        // Rank value
        rankDisplay
          ? React.createElement(
              "div",
              { className: styles.rankValue },
              React.createElement(
                "span",
                { className: styles.rankValueNumber },
                rankDisplay
              ),
              React.createElement(
                "span",
                { className: styles.rankValueLabel },
                rankField
              )
            )
          : undefined,
        // File type badge
        item.fileType
          ? React.createElement(
              "span",
              { className: styles.top10Badge },
              item.fileType.toUpperCase()
            )
          : undefined,
        // Bar indicator (proportional)
        idx === 0
          ? undefined // First item is the baseline
          : React.createElement(
              "div",
              { className: styles.barTrack },
              React.createElement("div", {
                className: styles.barFill + " " + getRankClass(idx),
                style: {
                  width: ranked[0]
                    ? String(Math.round((getRankValue(item, rankField) / getRankValue(ranked[0], rankField)) * 100)) + "%"
                    : "0%",
                },
              })
            )
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.top10Container,
      role: "grid",
      "aria-label": "Top " + String(maxItems) + " view ranked by " + rankField,
    },
    // Header
    React.createElement(
      "div",
      { className: styles.top10Header },
      React.createElement(
        "h3",
        { className: styles.top10HeaderTitle },
        "Top " + String(Math.min(maxItems, ranked.length))
      ),
      React.createElement(
        "span",
        { className: styles.top10HeaderMeta },
        "Ranked by " + rankField + " (" + (direction === "desc" ? "highest first" : "lowest first") + ")"
      )
    ),
    rowElements
  );
};

export var Top10Layout = React.memo(Top10LayoutInner);
