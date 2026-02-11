import * as React from "react";
import { useHyperImageStore } from "../store/useHyperImageStore";
import { ShapeMask } from "../models/IHyperImageShape";
import { ImageLayout } from "../models/IHyperImageLayout";
import { FilterPreset } from "../models/IHyperImageFilter";
import { HoverEffect } from "../models/IHyperImageHover";
import { BorderStylePreset } from "../models/IHyperImageBorder";
import styles from "./HyperImageDemoBar.module.scss";

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

/* ── Component ── */

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
  var openLayoutGallery = useHyperImageStore(function (s) { return s.openLayoutGallery; });

  return React.createElement("div", { className: styles.demoBar, role: "toolbar", "aria-label": "Demo mode controls" },
    React.createElement("div", { className: styles.demoBarHeader },
      React.createElement("span", { className: styles.demoBarTitle }, "Demo Mode"),
      React.createElement("button", {
        className: styles.demoResetBtn,
        type: "button",
        onClick: function () { openLayoutGallery(); },
        "aria-label": "Browse layout gallery",
      }, "Layouts"),
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
        onSelect: function (key) { setDemoLayout(key as ImageLayout); },
      }),
      React.createElement(DemoBarSection, {
        title: "Shape",
        activeKey: demoShape,
        items: DEMO_SHAPES,
        onSelect: function (key) { setDemoShape(key as ShapeMask); },
      }),
      React.createElement(DemoBarSection, {
        title: "Filter",
        activeKey: demoFilter,
        items: DEMO_FILTERS,
        onSelect: function (key) { setDemoFilter(key as FilterPreset); },
      }),
      React.createElement(DemoBarSection, {
        title: "Hover",
        activeKey: demoHover,
        items: DEMO_HOVERS,
        onSelect: function (key) { setDemoHover(key as HoverEffect); },
      }),
      React.createElement(DemoBarSection, {
        title: "Border",
        activeKey: demoBorderPreset,
        items: DEMO_BORDERS,
        onSelect: function (key) { setDemoBorderPreset(key as BorderStylePreset); },
      })
    )
  );
};

export default HyperImageDemoBar;
