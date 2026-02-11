import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IExplorerWizardState } from "../../models/IHyperExplorerWizardState";
import type { ViewMode, SortMode, SortDirection } from "../../models/IExplorerEnums";
import styles from "./WizardSteps.module.scss";

// ── View mode chip options ──
var VIEW_MODE_CHIPS: Array<{ key: ViewMode; label: string }> = [
  { key: "grid", label: "Grid" },
  { key: "masonry", label: "Masonry" },
  { key: "list", label: "List" },
  { key: "filmstrip", label: "Filmstrip" },
  { key: "tiles", label: "Tiles" },
];

// ── Sort field dropdown options ──
var SORT_FIELD_OPTIONS: Array<{ key: SortMode; label: string }> = [
  { key: "name", label: "Name" },
  { key: "modified", label: "Modified" },
  { key: "size", label: "Size" },
  { key: "type", label: "Type" },
  { key: "author", label: "Author" },
];

// ── Toggle row helper ──
function toggleRow(
  label: string,
  hint: string | undefined,
  checked: boolean,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
): React.ReactElement {
  return React.createElement("div", { className: styles.fieldRow },
    React.createElement("div", {},
      React.createElement("div", { className: styles.fieldLabel }, label),
      hint ? React.createElement("div", { className: styles.fieldHint }, hint) : undefined
    ),
    React.createElement("input", {
      type: "checkbox",
      className: styles.toggleSwitch,
      checked: checked,
      onChange: onChange,
    })
  );
}

var LayoutDisplayStep: React.FC<IWizardStepProps<IExplorerWizardState>> = function (props) {
  var state = props.state.layoutDisplay;

  function updateField<K extends keyof typeof state>(
    field: K,
    value: (typeof state)[K]
  ): void {
    var updated: Record<string, unknown> = {};
    var keys = Object.keys(state);
    keys.forEach(function (k) {
      (updated as Record<string, unknown>)[k] = (state as unknown as Record<string, unknown>)[k];
    });
    updated[field as string] = value;
    props.onChange({ layoutDisplay: updated as unknown as typeof state });
  }

  return React.createElement("div", { className: styles.stepContainer },

    // ── View Mode ──
    React.createElement("div", {},
      React.createElement("div", { className: styles.sectionTitle }, "View Mode"),
      React.createElement("div", { className: styles.chipGroup },
        VIEW_MODE_CHIPS.map(function (opt) {
          var isSelected = state.viewMode === opt.key;
          return React.createElement("div", {
            key: opt.key,
            className: isSelected ? styles.chipActive : styles.chip,
            role: "radio",
            "aria-checked": String(isSelected),
            tabIndex: 0,
            onClick: function () { updateField("viewMode", opt.key); },
            onKeyDown: function (e: React.KeyboardEvent) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                updateField("viewMode", opt.key);
              }
            },
          }, opt.label);
        })
      )
    ),

    // ── Sort By ──
    React.createElement("div", { className: styles.fieldRow },
      React.createElement("div", { className: styles.fieldLabel }, "Sort By"),
      React.createElement("select", {
        className: styles.fieldSelect,
        value: state.sortMode,
        "aria-label": "Sort by field",
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          updateField("sortMode", e.target.value as SortMode);
        },
      },
        SORT_FIELD_OPTIONS.map(function (opt) {
          return React.createElement("option", { key: opt.key, value: opt.key }, opt.label);
        })
      )
    ),

    // ── Sort Direction ──
    React.createElement("div", { className: styles.fieldRow },
      React.createElement("div", { className: styles.fieldLabel }, "Sort Direction"),
      React.createElement("div", { className: styles.chipGroup },
        React.createElement("div", {
          className: state.sortDirection === "asc" ? styles.chipActive : styles.chip,
          role: "radio",
          "aria-checked": String(state.sortDirection === "asc"),
          tabIndex: 0,
          onClick: function () { updateField("sortDirection", "asc" as SortDirection); },
          onKeyDown: function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              updateField("sortDirection", "asc" as SortDirection);
            }
          },
        }, "Ascending"),
        React.createElement("div", {
          className: state.sortDirection === "desc" ? styles.chipActive : styles.chip,
          role: "radio",
          "aria-checked": String(state.sortDirection === "desc"),
          tabIndex: 0,
          onClick: function () { updateField("sortDirection", "desc" as SortDirection); },
          onKeyDown: function (e: React.KeyboardEvent) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              updateField("sortDirection", "desc" as SortDirection);
            }
          },
        }, "Descending")
      )
    ),

    // ── Items Per Page ──
    React.createElement("div", { className: styles.fieldRow },
      React.createElement("div", {},
        React.createElement("div", { className: styles.fieldLabel }, "Items Per Page"),
        React.createElement("div", { className: styles.fieldHint }, String(state.itemsPerPage) + " items")
      ),
      React.createElement("input", {
        type: "range",
        className: styles.fieldSlider,
        min: 10,
        max: 100,
        step: 10,
        value: state.itemsPerPage,
        "aria-label": "Items per page",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          updateField("itemsPerPage", parseInt(e.target.value, 10));
        },
      })
    ),

    // ── Show Folders ──
    toggleRow(
      "Show Folders",
      "Display folder items alongside files",
      state.showFolders,
      function () { updateField("showFolders", !state.showFolders); }
    )
  );
};

export default LayoutDisplayStep;
