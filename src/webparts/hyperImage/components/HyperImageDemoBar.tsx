import * as React from "react";
import { useHyperImageStore } from "../store/useHyperImageStore";
import { ShapeMask } from "../models/IHyperImageShape";
import { ImageLayout } from "../models/IHyperImageLayout";
import { FilterPreset } from "../models/IHyperImageFilter";
import { HoverEffect } from "../models/IHyperImageHover";
import { BorderStylePreset } from "../models/IHyperImageBorder";
import styles from "../../../common/components/demoBar/DemoBarRichPanel.module.scss";

/* ── Quick-pick options for each category ── */

var DEMO_LAYOUTS: Array<{ key: ImageLayout; label: string }> = [
  { key: ImageLayout.Single, label: "Single" },
  { key: ImageLayout.Row, label: "Row" },
  { key: ImageLayout.Grid, label: "Grid" },
  { key: ImageLayout.Collage, label: "Collage" },
  { key: ImageLayout.Filmstrip, label: "Filmstrip" },
];

var DEMO_SHAPES: Array<{ key: ShapeMask; label: string }> = [
  { key: ShapeMask.Rectangle, label: "Rectangle" },
  { key: ShapeMask.Circle, label: "Circle" },
  { key: ShapeMask.RoundedRect, label: "Rounded" },
  { key: ShapeMask.Hexagon, label: "Hexagon" },
  { key: ShapeMask.Star, label: "Star" },
  { key: ShapeMask.Diamond, label: "Diamond" },
  { key: ShapeMask.Heart, label: "Heart" },
  { key: ShapeMask.Blob1, label: "Blob" },
  { key: ShapeMask.Shield, label: "Shield" },
  { key: ShapeMask.Leaf, label: "Leaf" },
];

var DEMO_FILTERS: Array<{ key: FilterPreset; label: string }> = [
  { key: FilterPreset.None, label: "None" },
  { key: FilterPreset.Vintage, label: "Vintage" },
  { key: FilterPreset.Cinematic, label: "Cinematic" },
  { key: FilterPreset.DramaticBW, label: "B&W" },
  { key: FilterPreset.WarmGlow, label: "Warm" },
  { key: FilterPreset.CoolBreeze, label: "Cool" },
  { key: FilterPreset.Faded, label: "Faded" },
  { key: FilterPreset.HighContrast, label: "Hi-Con" },
  { key: FilterPreset.Duotone, label: "Duotone" },
  { key: FilterPreset.SoftFocus, label: "Soft" },
];

var DEMO_HOVERS: Array<{ key: HoverEffect; label: string }> = [
  { key: HoverEffect.None, label: "None" },
  { key: HoverEffect.ZoomIn, label: "Zoom In" },
  { key: HoverEffect.Lift, label: "Lift" },
  { key: HoverEffect.Rotate, label: "Rotate" },
  { key: HoverEffect.GrayscaleToColor, label: "Gray\u2192Color" },
  { key: HoverEffect.BlurToClear, label: "Blur\u2192Clear" },
  { key: HoverEffect.ShineSweep, label: "Shine" },
  { key: HoverEffect.Tilt3d, label: "Tilt 3D" },
  { key: HoverEffect.Darken, label: "Darken" },
];

var DEMO_BORDERS: Array<{ key: BorderStylePreset; label: string }> = [
  { key: BorderStylePreset.None, label: "None" },
  { key: BorderStylePreset.ThinSolid, label: "Thin" },
  { key: BorderStylePreset.ThickSolid, label: "Thick" },
  { key: BorderStylePreset.Rounded, label: "Rounded" },
  { key: BorderStylePreset.Shadow, label: "Shadow" },
  { key: BorderStylePreset.Polaroid, label: "Polaroid" },
  { key: BorderStylePreset.Film, label: "Film" },
  { key: BorderStylePreset.Frame, label: "Frame" },
  { key: BorderStylePreset.Outline, label: "Outline" },
  { key: BorderStylePreset.DoubleFrame, label: "Double" },
];

/* ── Helper: build a chip row ── */

function buildChipRow(
  label: string,
  activeKey: string | undefined,
  items: Array<{ key: string; label: string }>,
  onSelect: (key: string) => void
): React.ReactElement {
  var chips: React.ReactNode[] = [];
  items.forEach(function (item) {
    var isActive = activeKey === item.key;
    var chipClass = isActive
      ? styles.chip + " " + styles.chipActive
      : styles.chip;

    chips.push(
      React.createElement("button", {
        key: item.key,
        className: chipClass,
        type: "button",
        onClick: function (): void { onSelect(item.key); },
        "aria-pressed": isActive ? "true" : "false",
      }, item.label)
    );
  });

  return React.createElement("div", { className: styles.chipRow },
    React.createElement("span", { className: styles.chipRowLabel }, label),
    React.createElement("div", { className: styles.chipGroup }, chips)
  );
}

/* ── Component ── */

var HyperImageDemoBar: React.FC = function () {
  var demoShape = useHyperImageStore(function (s) { return s.demoShape; });
  var demoLayout = useHyperImageStore(function (s) { return s.demoLayout; });
  var demoFilter = useHyperImageStore(function (s) { return s.demoFilter; });
  var demoHover = useHyperImageStore(function (s) { return s.demoHover; });
  var demoBorderPreset = useHyperImageStore(function (s) { return s.demoBorderPreset; });
  var setDemoShape = useHyperImageStore(function (s) { return s.setDemoShape; });
  var setDemoLayout = useHyperImageStore(function (s) { return s.setDemoLayout; });
  var setDemoFilter = useHyperImageStore(function (s) { return s.setDemoFilter; });
  var setDemoHover = useHyperImageStore(function (s) { return s.setDemoHover; });
  var setDemoBorderPreset = useHyperImageStore(function (s) { return s.setDemoBorderPreset; });
  var resetDemo = useHyperImageStore(function (s) { return s.resetDemo; });

  var expandedState = React.useState(false);
  var isExpanded = expandedState[0];
  var setExpanded = expandedState[1];

  // -- Build collapsed summary --
  var summaryParts: string[] = [];
  if (demoLayout) { summaryParts.push(demoLayout); }
  if (demoShape) { summaryParts.push(demoShape); }
  if (demoFilter && demoFilter !== FilterPreset.None) { summaryParts.push(demoFilter); }
  var summary = summaryParts.length > 0 ? summaryParts.join(" | ") : "Default settings";

  // -- Expanded panel class --
  var panelClass = isExpanded
    ? styles.expandPanel + " " + styles.expandPanelOpen
    : styles.expandPanel;

  return React.createElement("div", {
    className: styles.demoBar,
    role: "toolbar",
    "aria-label": "Image demo controls",
  },
    // ---- Header row (always visible) ----
    React.createElement("div", { className: styles.headerRow },
      React.createElement("span", { className: styles.demoBadge }, "DEMO"),
      React.createElement("span", { className: styles.wpName }, "HyperImage Preview"),
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
        "aria-label": "Reset and exit demo mode",
      }, "\u2715 Exit Demo")
    ),

    // ---- Expandable panel ----
    React.createElement("div", { className: panelClass },
      buildChipRow("Layout:", demoLayout, DEMO_LAYOUTS, function (key) {
        setDemoLayout(key as ImageLayout);
      }),
      buildChipRow("Shape:", demoShape, DEMO_SHAPES, function (key) {
        setDemoShape(key as ShapeMask);
      }),
      buildChipRow("Filter:", demoFilter, DEMO_FILTERS, function (key) {
        setDemoFilter(key as FilterPreset);
      }),
      buildChipRow("Hover:", demoHover, DEMO_HOVERS, function (key) {
        setDemoHover(key as HoverEffect);
      }),
      buildChipRow("Border:", demoBorderPreset, DEMO_BORDERS, function (key) {
        setDemoBorderPreset(key as BorderStylePreset);
      })
    )
  );
};

export default HyperImageDemoBar;
