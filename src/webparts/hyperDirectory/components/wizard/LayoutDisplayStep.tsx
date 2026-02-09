import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IDirectoryWizardState } from "../../models/IHyperDirectoryWizardState";
import type { DirectoryLayoutMode, DirectoryCardStyle, DirectorySortDirection } from "../../models";
import styles from "./WizardSteps.module.scss";

// ── Layout cards ──
var LAYOUT_OPTIONS: Array<{ key: DirectoryLayoutMode; icon: string; name: string; desc: string }> = [
  { key: "grid", icon: "\u25A6", name: "Grid", desc: "Responsive columns" },
  { key: "list", icon: "\u2630", name: "List", desc: "Horizontal rows" },
  { key: "compact", icon: "\u25AB", name: "Compact", desc: "Minimal density" },
  { key: "card", icon: "\uD83D\uDCCB", name: "Card", desc: "Large detailed" },
  { key: "masonry", icon: "\uD83E\uDDF1", name: "Masonry", desc: "Pinterest-style" },
  { key: "rollerDex", icon: "\uD83C\uDFA0", name: "RollerDex 3D", desc: "3D carousel" },
  { key: "orgChart", icon: "\uD83C\uDFD7\uFE0F", name: "Org Chart", desc: "Hierarchy tree" },
];

var CARD_STYLE_OPTIONS: Array<{ key: DirectoryCardStyle; label: string }> = [
  { key: "standard", label: "Standard" },
  { key: "compact", label: "Compact" },
  { key: "detailed", label: "Detailed" },
];

var SORT_FIELD_OPTIONS: Array<{ key: string; label: string }> = [
  { key: "displayName", label: "Display Name" },
  { key: "surname", label: "Last Name" },
  { key: "department", label: "Department" },
  { key: "jobTitle", label: "Job Title" },
  { key: "officeLocation", label: "Office" },
];

var SORT_DIR_OPTIONS: Array<{ key: DirectorySortDirection; label: string }> = [
  { key: "asc", label: "A \u2192 Z" },
  { key: "desc", label: "Z \u2192 A" },
];

var LayoutDisplayStep: React.FC<IWizardStepProps<IDirectoryWizardState>> = function (props) {
  var state = props.state.layoutDisplay;

  function setField(field: string, value: string | number): void {
    var updated = Object.assign({}, state);
    (updated as unknown as Record<string, string | number>)[field] = value;
    props.onChange({ layoutDisplay: updated });
  }

  // Whether to show columns slider
  var showGridCols = state.layoutMode === "grid" || state.layoutMode === "card";
  var showMasonryCols = state.layoutMode === "masonry";
  var showRollerDex = state.layoutMode === "rollerDex";

  return React.createElement("div", { className: styles.stepContainer },
    // ── Layout Mode ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Layout Mode"),
      React.createElement("div", {
        className: styles.layoutGrid,
        role: "radiogroup",
        "aria-label": "Select layout mode",
      },
        LAYOUT_OPTIONS.map(function (opt) {
          var isSelected = state.layoutMode === opt.key;
          return React.createElement("div", {
            key: opt.key,
            className: isSelected ? styles.layoutCardSelected : styles.layoutCard,
            role: "radio",
            "aria-checked": String(isSelected),
            tabIndex: 0,
            onClick: function () { setField("layoutMode", opt.key); },
            onKeyDown: function (e: React.KeyboardEvent) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setField("layoutMode", opt.key);
              }
            },
          },
            React.createElement("span", { className: styles.layoutCardIcon, "aria-hidden": "true" }, opt.icon),
            React.createElement("span", { className: styles.layoutCardName }, opt.name),
            React.createElement("span", { className: styles.layoutCardDesc }, opt.desc)
          );
        })
      )
    ),

    // ── Card Style ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Card Style"),
      React.createElement("div", {
        className: styles.optionGrid,
        role: "radiogroup",
        "aria-label": "Select card style",
      },
        CARD_STYLE_OPTIONS.map(function (opt) {
          var isSelected = state.cardStyle === opt.key;
          return React.createElement("div", {
            key: opt.key,
            className: isSelected ? styles.optionChipSelected : styles.optionChip,
            role: "radio",
            "aria-checked": String(isSelected),
            tabIndex: 0,
            onClick: function () { setField("cardStyle", opt.key); },
            onKeyDown: function (e: React.KeyboardEvent) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setField("cardStyle", opt.key);
              }
            },
          }, opt.label);
        })
      )
    ),

    // ── Sort ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Default Sort"),
      React.createElement("div", { className: styles.optionGrid },
        SORT_FIELD_OPTIONS.map(function (opt) {
          var isSelected = state.sortField === opt.key;
          return React.createElement("div", {
            key: opt.key,
            className: isSelected ? styles.optionChipSelected : styles.optionChip,
            role: "radio",
            "aria-checked": String(isSelected),
            tabIndex: 0,
            onClick: function () { setField("sortField", opt.key); },
            onKeyDown: function (e: React.KeyboardEvent) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setField("sortField", opt.key);
              }
            },
          }, opt.label);
        }),
        SORT_DIR_OPTIONS.map(function (opt) {
          var isSelected = state.sortDirection === opt.key;
          return React.createElement("div", {
            key: opt.key,
            className: isSelected ? styles.optionChipSelected : styles.optionChip,
            role: "radio",
            "aria-checked": String(isSelected),
            tabIndex: 0,
            onClick: function () { setField("sortDirection", opt.key); },
            onKeyDown: function (e: React.KeyboardEvent) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setField("sortDirection", opt.key);
              }
            },
          }, opt.label);
        })
      )
    ),

    // ── Grid Columns ──
    showGridCols
      ? React.createElement("div", { className: styles.sliderRow },
          React.createElement("span", { className: styles.sliderLabel }, "Grid Columns"),
          React.createElement("input", {
            type: "range",
            className: styles.sliderInput,
            min: 1,
            max: 6,
            step: 1,
            value: state.gridColumns,
            "aria-label": "Grid columns",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              setField("gridColumns", parseInt(e.target.value, 10));
            },
          }),
          React.createElement("span", { className: styles.sliderValue }, String(state.gridColumns))
        )
      : undefined,

    // ── Masonry Columns ──
    showMasonryCols
      ? React.createElement("div", { className: styles.sliderRow },
          React.createElement("span", { className: styles.sliderLabel }, "Masonry Columns"),
          React.createElement("input", {
            type: "range",
            className: styles.sliderInput,
            min: 2,
            max: 5,
            step: 1,
            value: state.masonryColumns,
            "aria-label": "Masonry columns",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              setField("masonryColumns", parseInt(e.target.value, 10));
            },
          }),
          React.createElement("span", { className: styles.sliderValue }, String(state.masonryColumns))
        )
      : undefined,

    // ── RollerDex Settings ──
    showRollerDex
      ? React.createElement("div", { className: styles.stepSection },
          React.createElement("div", { className: styles.stepSectionLabel }, "RollerDex Settings"),
          React.createElement("div", { className: styles.sliderRow },
            React.createElement("span", { className: styles.sliderLabel }, "Rotation Speed"),
            React.createElement("input", {
              type: "range",
              className: styles.sliderInput,
              min: 1,
              max: 15,
              step: 1,
              value: state.rollerDexSpeed,
              "aria-label": "Rotation speed in seconds",
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                setField("rollerDexSpeed", parseInt(e.target.value, 10));
              },
            }),
            React.createElement("span", { className: styles.sliderValue }, state.rollerDexSpeed + "s")
          ),
          React.createElement("div", { className: styles.sliderRow },
            React.createElement("span", { className: styles.sliderLabel }, "Visible Cards"),
            React.createElement("input", {
              type: "range",
              className: styles.sliderInput,
              min: 3,
              max: 9,
              step: 2,
              value: state.rollerDexVisibleCards,
              "aria-label": "Visible cards count",
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                setField("rollerDexVisibleCards", parseInt(e.target.value, 10));
              },
            }),
            React.createElement("span", { className: styles.sliderValue }, String(state.rollerDexVisibleCards))
          )
        )
      : undefined
  );
};

export default LayoutDisplayStep;
