import * as React from "react";
import { useHyperEventsStore } from "../store/useHyperEventsStore";
import type { HyperEventsViewMode } from "../models";
import styles from "./HyperEventsDemoBar.module.scss";

/* ── Quick-pick options for each category ── */

var DEMO_VIEWS: Array<{ key: HyperEventsViewMode; label: string }> = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "day", label: "Day" },
  { key: "agenda", label: "Agenda" },
  { key: "timeline", label: "Timeline" },
  { key: "cardGrid", label: "Card Grid" },
];

var DEMO_FEATURE_TOGGLES: Array<{ key: string; label: string }> = [
  { key: "rsvp", label: "RSVP" },
  { key: "categories", label: "Categories" },
  { key: "overlay", label: "Overlay" },
  { key: "registration", label: "Registration" },
  { key: "countdown", label: "Countdown" },
  { key: "location", label: "Location" },
  { key: "teams", label: "Teams Links" },
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

var HyperEventsDemoBar: React.FC = function () {
  var demoViewMode = useHyperEventsStore(function (s) { return s.demoViewMode; });
  var demoFeatureToggles = useHyperEventsStore(function (s) { return s.demoFeatureToggles; });
  var setDemoViewMode = useHyperEventsStore(function (s) { return s.setDemoViewMode; });
  var toggleDemoFeature = useHyperEventsStore(function (s) { return s.toggleDemoFeature; });
  var resetDemo = useHyperEventsStore(function (s) { return s.resetDemo; });

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
        title: "View",
        activeKey: demoViewMode,
        items: DEMO_VIEWS,
        onSelect: function (key) { setDemoViewMode(key as HyperEventsViewMode); },
      }),
      React.createElement(DemoToggleSection, {
        title: "Show",
        items: DEMO_FEATURE_TOGGLES,
        activeKeys: demoFeatureToggles,
        onToggle: function (key) { toggleDemoFeature(key); },
      })
    )
  );
};

export default HyperEventsDemoBar;
