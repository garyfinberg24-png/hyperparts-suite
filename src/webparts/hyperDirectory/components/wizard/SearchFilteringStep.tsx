import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IDirectoryWizardState } from "../../models/IHyperDirectoryWizardState";
import type { DirectoryPaginationMode } from "../../models";
import styles from "./WizardSteps.module.scss";

// ── Toggle definitions ──
var TOGGLES: Array<{ key: string; icon: string; label: string; desc: string }> = [
  { key: "showSearch", icon: "\uD83D\uDD0D", label: "Search Bar", desc: "Weighted search across name, title, department, and more" },
  { key: "showAlphaIndex", icon: "\uD83D\uDD24", label: "A-Z Alphabetic Index", desc: "Quick jump to people by last name letter" },
  { key: "showFilters", icon: "\uD83D\uDCCB", label: "Filter Panel", desc: "Multi-select chips for department, location, title, company" },
];

var PAGINATION_OPTIONS: Array<{ key: DirectoryPaginationMode; icon: string; label: string; desc: string }> = [
  { key: "paged", icon: "\uD83D\uDCC4", label: "Paginated", desc: "Numbered pages" },
  { key: "infinite", icon: "\u267E\uFE0F", label: "Infinite Scroll", desc: "Auto-load on scroll" },
];

var SearchFilteringStep: React.FC<IWizardStepProps<IDirectoryWizardState>> = function (props) {
  var state = props.state.searchFiltering;

  function toggleField(key: string): void {
    var updated = Object.assign({}, state);
    (updated as unknown as Record<string, boolean>)[key] = !(state as unknown as Record<string, boolean>)[key];
    props.onChange({ searchFiltering: updated });
  }

  function setPaginationMode(mode: DirectoryPaginationMode): void {
    props.onChange({ searchFiltering: Object.assign({}, state, { paginationMode: mode }) });
  }

  function setPageSize(size: number): void {
    props.onChange({ searchFiltering: Object.assign({}, state, { pageSize: size }) });
  }

  // Enabled search features count
  var searchCount = 0;
  if (state.showSearch) searchCount++;
  if (state.showAlphaIndex) searchCount++;
  if (state.showFilters) searchCount++;

  return React.createElement("div", { className: styles.stepContainer },
    // ── Search & Filter toggles ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel },
        "Search & Filter Tools",
        searchCount > 0 ? " (" + searchCount + " enabled)" : ""
      ),
      TOGGLES.map(function (t) {
        var isOn = (state as unknown as Record<string, boolean>)[t.key];
        return React.createElement("label", {
          key: t.key,
          className: styles.toggleRow,
        },
          React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, t.icon),
          React.createElement("span", { className: styles.toggleInfo },
            React.createElement("span", { className: styles.toggleLabel }, t.label),
            React.createElement("span", { className: styles.toggleDesc }, t.desc)
          ),
          React.createElement("span", { className: styles.toggleSwitch },
            React.createElement("input", {
              type: "checkbox",
              className: styles.toggleInput,
              checked: isOn,
              onChange: function () { toggleField(t.key); },
              "aria-label": t.label,
            }),
            React.createElement("span", { className: styles.toggleTrack },
              React.createElement("span", { className: styles.toggleThumb })
            )
          )
        );
      })
    ),

    // ── Pagination Mode ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Pagination Mode"),
      React.createElement("div", {
        className: styles.optionGrid,
        role: "radiogroup",
        "aria-label": "Select pagination mode",
      },
        PAGINATION_OPTIONS.map(function (opt) {
          var isSelected = state.paginationMode === opt.key;
          return React.createElement("div", {
            key: opt.key,
            className: isSelected ? styles.optionChipSelected : styles.optionChip,
            role: "radio",
            "aria-checked": String(isSelected),
            tabIndex: 0,
            onClick: function () { setPaginationMode(opt.key); },
            onKeyDown: function (e: React.KeyboardEvent) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPaginationMode(opt.key);
              }
            },
          },
            React.createElement("span", undefined, opt.icon + " " + opt.label)
          );
        })
      )
    ),

    // ── Page Size ──
    React.createElement("div", { className: styles.sliderRow },
      React.createElement("span", { className: styles.sliderLabel }, "Page Size"),
      React.createElement("input", {
        type: "range",
        className: styles.sliderInput,
        min: 10,
        max: 100,
        step: 5,
        value: state.pageSize,
        "aria-label": "Results per page",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          setPageSize(parseInt(e.target.value, 10));
        },
      }),
      React.createElement("span", { className: styles.sliderValue }, String(state.pageSize))
    ),

    // ── Export ──
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Export"),
      React.createElement("label", { className: styles.toggleRow },
        React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, "\uD83D\uDCE5"),
        React.createElement("span", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel },
            "CSV Export",
            React.createElement("span", { className: styles.badgeNew }, "NEW")
          ),
          React.createElement("span", { className: styles.toggleDesc }, "Export filtered directory results to CSV file")
        ),
        React.createElement("span", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            className: styles.toggleInput,
            checked: state.enableExport,
            onChange: function () { toggleField("enableExport"); },
            "aria-label": "Enable CSV export",
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      ),
      state.enableExport
        ? React.createElement("div", { className: styles.hintBox },
            "An export button will appear in the toolbar. Exports filtered & sorted results with name, email, title, department, office, and phone."
          )
        : undefined
    )
  );
};

export default SearchFilteringStep;
