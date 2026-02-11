import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IExplorerWizardState } from "../../models/IHyperExplorerWizardState";
import styles from "./WizardSteps.module.scss";

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

var AdvancedStep: React.FC<IWizardStepProps<IExplorerWizardState>> = function (props) {
  var state = props.state.advanced;

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
    props.onChange({ advanced: updated as unknown as typeof state });
  }

  return React.createElement("div", { className: styles.stepContainer },

    // ── Section: Navigation ──
    React.createElement("div", { className: styles.sectionTitle }, "Navigation"),

    // ── Folder Tree ──
    toggleRow(
      "Folder Tree",
      "Show collapsible folder tree sidebar",
      state.enableFolderTree,
      function () { updateField("enableFolderTree", !state.enableFolderTree); }
    ),

    // ── Breadcrumbs ──
    toggleRow(
      "Breadcrumbs",
      "Show folder path breadcrumb navigation",
      state.enableBreadcrumbs,
      function () { updateField("enableBreadcrumbs", !state.enableBreadcrumbs); }
    ),

    // ── Section: Features ──
    React.createElement("div", { className: styles.sectionTitle }, "Features"),

    // ── Compare View ──
    toggleRow(
      "Compare View",
      "Side-by-side file comparison tool",
      state.enableCompare,
      function () { updateField("enableCompare", !state.enableCompare); }
    ),

    // ── Watermark ──
    toggleRow(
      "Watermark",
      "Apply diagonal text watermark over previews",
      state.enableWatermark,
      function () { updateField("enableWatermark", !state.enableWatermark); }
    ),

    // ── Recent Files ──
    toggleRow(
      "Recent Files",
      "Show recently accessed files panel",
      state.enableRecentFiles,
      function () { updateField("enableRecentFiles", !state.enableRecentFiles); }
    ),

    // ── File Plan ──
    toggleRow(
      "File Plan",
      "Enable retention labels and compliance features",
      state.enableFilePlan,
      function () { updateField("enableFilePlan", !state.enableFilePlan); }
    ),

    // ── Section: Data ──
    React.createElement("div", { className: styles.sectionTitle }, "Data"),

    // ── Sample Data ──
    toggleRow(
      "Sample Data",
      "Use sample files to demo the web part",
      state.useSampleData,
      function () { updateField("useSampleData", !state.useSampleData); }
    ),

    // ── Enable Cache ──
    toggleRow(
      "Enable Cache",
      "Cache API responses to improve performance",
      state.cacheEnabled,
      function () { updateField("cacheEnabled", !state.cacheEnabled); }
    ),

    // ── Cache Duration (only if cacheEnabled) ──
    state.cacheEnabled
      ? React.createElement("div", { className: styles.fieldRow },
          React.createElement("div", {},
            React.createElement("div", { className: styles.fieldLabel }, "Cache Duration"),
            React.createElement("div", { className: styles.fieldHint }, String(state.cacheDuration) + " seconds")
          ),
          React.createElement("input", {
            type: "range",
            className: styles.fieldSlider,
            min: 0,
            max: 600,
            step: 30,
            value: state.cacheDuration,
            "aria-label": "Cache duration in seconds",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              updateField("cacheDuration", parseInt(e.target.value, 10));
            },
          })
        )
      : undefined
  );
};

export default AdvancedStep;
