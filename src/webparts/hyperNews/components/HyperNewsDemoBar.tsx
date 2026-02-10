import * as React from "react";
import { useHyperNewsStore } from "../store/useHyperNewsStore";
import type { LayoutType } from "../models";
import styles from "./HyperNewsDemoBar.module.scss";

/* ── Quick-pick options for each category ── */

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

/* ── Sub-components ── */

interface IDemoBarSectionProps {
  title: string;
  activeKey: string | undefined;
  items: Array<{ key: string; label: string }>;
  onSelect: (key: string) => void;
}

var DemoBarSection: React.FC<IDemoBarSectionProps> = function (props) {
  var buttons = props.items.map(function (item) {
    var isActive = props.activeKey === item.key;
    var cls = styles.demoBtn + (isActive ? " " + styles.demoBtnActive : "");
    return React.createElement("button", {
      key: item.key,
      className: cls,
      type: "button",
      onClick: function () { props.onSelect(item.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, item.label);
  });

  return React.createElement("div", { className: styles.demoSection },
    React.createElement("span", { className: styles.demoSectionTitle }, props.title),
    React.createElement("div", { className: styles.demoBtnGroup }, buttons)
  );
};

interface IDemoToggleSectionProps {
  title: string;
  items: Array<{ key: string; label: string }>;
  activeKeys: Record<string, boolean>;
  onToggle: (key: string) => void;
}

var DemoToggleSection: React.FC<IDemoToggleSectionProps> = function (props) {
  var buttons = props.items.map(function (item) {
    var isActive = props.activeKeys[item.key] !== false;
    var cls = styles.demoBtn + (isActive ? " " + styles.demoBtnActive : "");
    return React.createElement("button", {
      key: item.key,
      className: cls,
      type: "button",
      onClick: function () { props.onToggle(item.key); },
      "aria-pressed": isActive ? "true" : "false",
    }, item.label);
  });

  return React.createElement("div", { className: styles.demoSection },
    React.createElement("span", { className: styles.demoSectionTitle }, props.title),
    React.createElement("div", { className: styles.demoBtnGroup }, buttons)
  );
};

/* ── Main Component ── */

var HyperNewsDemoBar: React.FC = function () {
  var demoLayout = useHyperNewsStore(function (s) { return s.demoLayout; });
  var demoPageSize = useHyperNewsStore(function (s) { return s.demoPageSize; });
  var demoDisplayToggles = useHyperNewsStore(function (s) { return s.demoDisplayToggles; });
  var setDemoLayout = useHyperNewsStore(function (s) { return s.setDemoLayout; });
  var setDemoPageSize = useHyperNewsStore(function (s) { return s.setDemoPageSize; });
  var toggleDemoDisplay = useHyperNewsStore(function (s) { return s.toggleDemoDisplay; });
  var resetDemo = useHyperNewsStore(function (s) { return s.resetDemo; });

  return React.createElement("div", { className: styles.demoBar, role: "toolbar", "aria-label": "Demo mode controls" },
    React.createElement("div", { className: styles.demoBarHeader },
      React.createElement("span", { className: styles.demoBarTitle }, "Demo Mode"),
      React.createElement("button", {
        className: styles.demoResetBtn,
        type: "button",
        onClick: function () { resetDemo(); },
        "aria-label": "Reset demo overrides",
      }, "Reset")
    ),
    React.createElement("div", { className: styles.demoSections },
      React.createElement(DemoBarSection, {
        title: "Layout",
        activeKey: demoLayout,
        items: DEMO_LAYOUTS,
        onSelect: function (key) { setDemoLayout(key as LayoutType); },
      }),
      React.createElement(DemoBarSection, {
        title: "Items",
        activeKey: demoPageSize !== undefined ? String(demoPageSize) : undefined,
        items: DEMO_PAGE_SIZES.map(function (p) { return { key: String(p.key), label: p.label }; }),
        onSelect: function (key) { setDemoPageSize(Number(key)); },
      }),
      React.createElement(DemoToggleSection, {
        title: "Show",
        items: DEMO_DISPLAY_TOGGLES,
        activeKeys: demoDisplayToggles,
        onToggle: function (key) { toggleDemoDisplay(key); },
      })
    )
  );
};

export default HyperNewsDemoBar;
