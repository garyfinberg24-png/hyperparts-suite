import * as React from "react";
import { useHyperNewsStore } from "../store/useHyperNewsStore";
import type { LayoutType } from "../models";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

/* -- Quick-pick options for each category -- */

var DEMO_LAYOUTS: Array<{ key: LayoutType; label: string }> = [
  { key: "cardGrid", label: "Card Grid" },
  { key: "list", label: "List" },
  { key: "magazine", label: "Magazine" },
  { key: "newspaper", label: "Newspaper" },
  { key: "timeline", label: "Timeline" },
  { key: "carousel", label: "Carousel" },
  { key: "heroGrid", label: "Hero Grid" },
  { key: "compact", label: "Compact" },
  { key: "filmstrip", label: "Filmstrip" },
  { key: "mosaic", label: "Mosaic" },
  { key: "sideBySide", label: "Side-by-Side" },
  { key: "tiles", label: "Tiles" },
];

var DEMO_PAGE_SIZES: Array<{ key: number; label: string }> = [
  { key: 3, label: "3" },
  { key: 6, label: "6" },
  { key: 9, label: "9" },
  { key: 12, label: "12" },
];

var DEMO_DISPLAY_TOGGLES: Array<{ key: string; label: string }> = [
  { key: "showImages", label: "Images" },
  { key: "showDescription", label: "Desc" },
  { key: "showAuthor", label: "Author" },
  { key: "showDate", label: "Date" },
  { key: "showReadTime", label: "Read Time" },
];

function getLayoutLabel(key: LayoutType): string {
  var label = "";
  DEMO_LAYOUTS.forEach(function (item) {
    if (item.key === key) { label = item.label; }
  });
  return label || String(key);
}

/* -- Main Component -- */

var HyperNewsDemoBar: React.FC = function () {
  var demoLayout = useHyperNewsStore(function (s) { return s.demoLayout; });
  var demoPageSize = useHyperNewsStore(function (s) { return s.demoPageSize; });
  var demoDisplayToggles = useHyperNewsStore(function (s) { return s.demoDisplayToggles; });
  var setDemoLayout = useHyperNewsStore(function (s) { return s.setDemoLayout; });
  var setDemoPageSize = useHyperNewsStore(function (s) { return s.setDemoPageSize; });
  var toggleDemoDisplay = useHyperNewsStore(function (s) { return s.toggleDemoDisplay; });
  var resetDemo = useHyperNewsStore(function (s) { return s.resetDemo; });

  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summary = (demoLayout ? getLayoutLabel(demoLayout) : "Default") +
    " | " + (demoPageSize !== undefined ? demoPageSize + " items" : "Default");

  // -- Layout chips --
  var layoutChips: React.ReactNode[] = [];
  DEMO_LAYOUTS.forEach(function (item) {
    var isActive = demoLayout === item.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    layoutChips.push(
      React.createElement("button", {
        key: item.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { setDemoLayout(item.key as LayoutType); },
        "aria-pressed": isActive ? "true" : "false",
      }, item.label)
    );
  });

  // -- Page size chips --
  var pageSizeChips: React.ReactNode[] = [];
  DEMO_PAGE_SIZES.forEach(function (item) {
    var isActive = demoPageSize === item.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    pageSizeChips.push(
      React.createElement("button", {
        key: String(item.key),
        className: chipClass,
        type: "button",
        onClick: function (): void { setDemoPageSize(item.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, item.label)
    );
  });

  // -- Display toggle chips --
  var toggleChips: React.ReactNode[] = [];
  DEMO_DISPLAY_TOGGLES.forEach(function (item) {
    var isActive = demoDisplayToggles[item.key] !== false;
    var chipClass = isActive
      ? styles.toggleChip + " " + styles.toggleChipActive
      : styles.toggleChip;
    var dotClass = isActive
      ? styles.toggleDot + " " + styles.toggleDotActive
      : styles.toggleDot;

    toggleChips.push(
      React.createElement("button", {
        key: item.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { toggleDemoDisplay(item.key); },
        "aria-pressed": isActive ? "true" : "false",
      },
        React.createElement("span", { className: dotClass }),
        item.label
      )
    );
  });

  // -- Expanded panel class --
  var panelClass = isExpanded
    ? styles.expandPanel + " " + styles.expandPanelOpen
    : styles.expandPanel;

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Demo mode controls",
  },
    // ---- Header row (always visible) ----
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperNews Preview"),
      !isExpanded ? React.createElement("span", { className: styles.collapsedSummary }, summary) : undefined,
      React.createElement("span", { className: styles.spacer }),
      React.createElement("button", {
        className: styles.expandToggle,
        type: "button",
        onClick: function (): void { setExpanded(!isExpanded); },
        "aria-expanded": isExpanded ? "true" : "false",
      },
        isExpanded ? "Collapse" : "Customize",
        React.createElement("span", {
          className: styles.chevron + (isExpanded ? " " + styles.chevronExpanded : ""),
        }, "\u25BC")
      ),
      React.createElement("button", {
        className: styles.exitButton,
        type: "button",
        onClick: function (): void { resetDemo(); },
        "aria-label": "Exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      // Layout row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Layout:"),
        React.createElement("div", { className: styles.chipGroup }, layoutChips)
      ),

      // Items per page row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Items:"),
        React.createElement("div", { className: styles.chipGroup }, pageSizeChips)
      ),

      // Display toggles row
      React.createElement("div", { className: styles.chipRow },
        React.createElement("span", { className: styles.chipRowLabel }, "Show:"),
        React.createElement("div", { className: styles.chipGroup }, toggleChips)
      )
    )
  );
};

export default HyperNewsDemoBar;
