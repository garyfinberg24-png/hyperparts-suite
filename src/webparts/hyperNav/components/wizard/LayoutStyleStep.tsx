import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperNavWizardState } from "../../models/IHyperNavWizardState";
import styles from "./LayoutStyleStep.module.scss";

/** Layout options */
var LAYOUT_OPTIONS = [
  { key: "topbar", label: "Top Bar" },
  { key: "megaMenu", label: "Mega Menu" },
  { key: "sidebar", label: "Sidebar" },
  { key: "tiles", label: "Tiles" },
  { key: "grid", label: "Grid" },
  { key: "card", label: "Cards" },
  { key: "list", label: "List" },
  { key: "compact", label: "Compact" },
  { key: "iconOnly", label: "Icon Only" },
  { key: "dropdown", label: "Dropdown" },
  { key: "tabbar", label: "Tab Bar" },
  { key: "hamburger", label: "Hamburger" },
  { key: "breadcrumb", label: "Breadcrumb" },
  { key: "cmdPalette", label: "Cmd Palette" },
  { key: "fab", label: "FAB" },
];

var HOVER_OPTIONS = [
  { key: "lift", label: "Lift" },
  { key: "glow", label: "Glow" },
  { key: "zoom", label: "Zoom" },
  { key: "darken", label: "Darken" },
  { key: "underline", label: "Underline" },
  { key: "bgfill", label: "Bg Fill" },
  { key: "none", label: "None" },
];

var RADIUS_OPTIONS = [
  { key: "none", label: "Square" },
  { key: "slight", label: "Slight" },
  { key: "rounded", label: "Rounded" },
  { key: "pill", label: "Pill" },
];

var THEME_OPTIONS = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "auto", label: "Auto" },
];

var SEPARATOR_OPTIONS = [
  { key: "line", label: "Line" },
  { key: "dot", label: "Dot" },
  { key: "slash", label: "Slash" },
  { key: "pipe", label: "Pipe" },
  { key: "none", label: "None" },
];

var SHADOW_OPTIONS = [
  { key: "none", label: "None" },
  { key: "small", label: "Small" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Large" },
];

var ANIMATION_OPTIONS = [
  { key: "fade", label: "Fade" },
  { key: "slide", label: "Slide" },
  { key: "scale", label: "Scale" },
  { key: "none", label: "None" },
];

/** Helper to create a chip selector group */
function renderChipGroup(
  options: Array<{ key: string; label: string }>,
  selectedKey: string,
  onChange: (key: string) => void
): React.ReactElement {
  return React.createElement("div", { className: styles.chipGroup },
    options.map(function (opt) {
      var isActive = opt.key === selectedKey;
      return React.createElement("button", {
        key: opt.key,
        className: styles.chip + (isActive ? " " + styles.chipActive : ""),
        onClick: function () { onChange(opt.key); },
        type: "button",
        "aria-pressed": isActive,
      }, opt.label);
    })
  );
}

/** Helper to create a color input row */
function renderColorInput(
  label: string,
  value: string,
  onChange: (val: string) => void
): React.ReactElement {
  return React.createElement("div", { className: styles.colorRow },
    React.createElement("label", { className: styles.colorLabel }, label),
    React.createElement("div", { className: styles.colorInputWrap },
      React.createElement("input", {
        type: "color",
        value: value,
        className: styles.colorInput,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { onChange(e.target.value); },
      }),
      React.createElement("span", { className: styles.colorHex }, value)
    )
  );
}

const LayoutStyleStep: React.FC<IWizardStepProps<IHyperNavWizardState>> = function (props) {
  var s = props.state;
  var set = props.onChange;

  return React.createElement("div", { className: styles.layoutStyleStep },

    // ── Section 1: Layout Mode ──
    React.createElement("div", { className: styles.section },
      React.createElement("h4", { className: styles.sectionTitle }, "Layout Mode"),
      renderChipGroup(LAYOUT_OPTIONS, s.layoutMode, function (k) {
        set({ layoutMode: k as IHyperNavWizardState["layoutMode"] });
      })
    ),

    // ── Section 2: Hover Effect ──
    React.createElement("div", { className: styles.section },
      React.createElement("h4", { className: styles.sectionTitle }, "Hover Effect"),
      renderChipGroup(HOVER_OPTIONS, s.hoverEffect, function (k) {
        set({ hoverEffect: k as IHyperNavWizardState["hoverEffect"] });
      })
    ),

    // ── Section 3: Border Radius + Theme + Separator ──
    React.createElement("div", { className: styles.rowGroup },
      React.createElement("div", { className: styles.section },
        React.createElement("h4", { className: styles.sectionTitle }, "Border Radius"),
        renderChipGroup(RADIUS_OPTIONS, s.borderRadius, function (k) {
          set({ borderRadius: k as IHyperNavWizardState["borderRadius"] });
        })
      ),
      React.createElement("div", { className: styles.section },
        React.createElement("h4", { className: styles.sectionTitle }, "Theme"),
        renderChipGroup(THEME_OPTIONS, s.navTheme, function (k) {
          set({ navTheme: k as IHyperNavWizardState["navTheme"] });
        })
      ),
      React.createElement("div", { className: styles.section },
        React.createElement("h4", { className: styles.sectionTitle }, "Separator"),
        renderChipGroup(SEPARATOR_OPTIONS, s.separator, function (k) {
          set({ separator: k as IHyperNavWizardState["separator"] });
        })
      )
    ),

    // ── Section 4: Link Colors ──
    React.createElement("div", { className: styles.section },
      React.createElement("h4", { className: styles.sectionTitle }, "Link Colors"),
      React.createElement("div", { className: styles.colorGrid },
        renderColorInput("Default", s.linkDefaultColor, function (v) { set({ linkDefaultColor: v }); }),
        renderColorInput("Hover", s.linkHoverColor, function (v) { set({ linkHoverColor: v }); }),
        renderColorInput("Active", s.linkActiveColor, function (v) { set({ linkActiveColor: v }); }),
        renderColorInput("Visited", s.linkVisitedColor, function (v) { set({ linkVisitedColor: v }); })
      )
    ),

    // ── Section 5: Button Colors ──
    React.createElement("div", { className: styles.section },
      React.createElement("h4", { className: styles.sectionTitle }, "Button Colors"),
      React.createElement("div", { className: styles.colorGrid },
        renderColorInput("Btn Default BG", s.btnDefaultBg, function (v) { set({ btnDefaultBg: v }); }),
        renderColorInput("Btn Default Text", s.btnDefaultText, function (v) { set({ btnDefaultText: v }); }),
        renderColorInput("Btn Hover BG", s.btnHoverBg, function (v) { set({ btnHoverBg: v }); }),
        renderColorInput("Btn Hover Text", s.btnHoverText, function (v) { set({ btnHoverText: v }); }),
        renderColorInput("Btn Pressed BG", s.btnPressedBg, function (v) { set({ btnPressedBg: v }); }),
        renderColorInput("Btn Pressed Text", s.btnPressedText, function (v) { set({ btnPressedText: v }); })
      )
    ),

    // ── Section 6: Dropdown/Flyout Panel ──
    React.createElement("div", { className: styles.section },
      React.createElement("h4", { className: styles.sectionTitle }, "Dropdown / Flyout Panel"),
      React.createElement("div", { className: styles.colorGrid },
        renderColorInput("Panel Background", s.ddPanelBg, function (v) { set({ ddPanelBg: v }); }),
        renderColorInput("Panel Border", s.ddPanelBorder, function (v) { set({ ddPanelBorder: v }); })
      ),
      React.createElement("div", { className: styles.rowGroup, style: { marginTop: "8px" } },
        React.createElement("div", { className: styles.section },
          React.createElement("h4", { className: styles.sectionTitle }, "Shadow"),
          renderChipGroup(SHADOW_OPTIONS, s.ddPanelShadow, function (k) { set({ ddPanelShadow: k }); })
        ),
        React.createElement("div", { className: styles.section },
          React.createElement("h4", { className: styles.sectionTitle }, "Animation"),
          renderChipGroup(ANIMATION_OPTIONS, s.ddPanelAnimation, function (k) { set({ ddPanelAnimation: k }); })
        )
      ),
      React.createElement("div", { className: styles.sliderGroup },
        React.createElement("label", { className: styles.sliderLabel }, "Columns: " + s.ddPanelColumns),
        React.createElement("input", {
          type: "range", min: "1", max: "4", step: "1",
          value: s.ddPanelColumns,
          className: styles.slider,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { set({ ddPanelColumns: e.target.value }); },
        }),
        React.createElement("label", { className: styles.sliderLabel }, "Padding: " + s.ddPanelPadding + "px"),
        React.createElement("input", {
          type: "range", min: "0", max: "32", step: "4",
          value: String(s.ddPanelPadding),
          className: styles.slider,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { set({ ddPanelPadding: parseInt(e.target.value, 10) }); },
        }),
        React.createElement("label", { className: styles.sliderLabel }, "Max Height: " + s.ddPanelMaxHeight + "px"),
        React.createElement("input", {
          type: "range", min: "200", max: "800", step: "50",
          value: String(s.ddPanelMaxHeight),
          className: styles.slider,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { set({ ddPanelMaxHeight: parseInt(e.target.value, 10) }); },
        }),
        React.createElement("label", { className: styles.sliderLabel }, "Border Radius: " + s.ddPanelRadius + "px"),
        React.createElement("input", {
          type: "range", min: "0", max: "24", step: "2",
          value: String(s.ddPanelRadius),
          className: styles.slider,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { set({ ddPanelRadius: parseInt(e.target.value, 10) }); },
        })
      )
    )
  );
};

export default LayoutStyleStep;
