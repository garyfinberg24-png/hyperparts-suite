import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IFaqWizardState } from "./faqWizardConfig";
import type { IFaqTemplate } from "./faqWizardConfig";
import { FAQ_TEMPLATES } from "./faqWizardConfig";
import type { FaqSortMode } from "../../models/IHyperFaqEnums";
import { ALL_SORT_MODES, getSortModeDisplayName } from "../../models/IHyperFaqEnums";
import styles from "./WizardSteps.module.scss";

// ============================================================
// AppearanceStep — Visual appearance configuration
// Sort mode dropdown, template color swatches, preview hints
// ============================================================

var AppearanceStep: React.FC<IWizardStepProps<IFaqWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  // Sort mode handler
  var handleSortModeChange = React.useCallback(function (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    onChange({ sortMode: e.target.value as FaqSortMode });
  }, [onChange]);

  // Find current template
  var currentTemplate: IFaqTemplate | undefined;
  FAQ_TEMPLATES.forEach(function (t) {
    if (t.id === state.selectedTemplate) {
      currentTemplate = t;
    }
  });

  // Build sort mode dropdown options
  var sortOptions: React.ReactElement[] = [];
  ALL_SORT_MODES.forEach(function (mode) {
    sortOptions.push(
      React.createElement("option", { key: mode, value: mode }, getSortModeDisplayName(mode))
    );
  });

  // Build color swatches from current template
  var swatchElements: React.ReactElement[] = [];
  if (currentTemplate) {
    var swatchDefs = [
      { label: "Primary", color: currentTemplate.primaryColor },
      { label: "Secondary", color: currentTemplate.secondaryColor },
      { label: "Accent", color: currentTemplate.accentColor },
    ];
    swatchDefs.forEach(function (swatch) {
      var swatchStyle: React.CSSProperties = {
        backgroundColor: swatch.color,
        width: "32px",
        height: "32px",
        borderRadius: "6px",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        display: "inline-block",
      };
      swatchElements.push(
        React.createElement("div", {
          key: swatch.label,
          className: styles.colorSwatchItem,
        },
          React.createElement("div", { style: swatchStyle, "aria-hidden": "true" }),
          React.createElement("span", { className: styles.colorSwatchLabel }, swatch.label),
          React.createElement("span", { className: styles.colorSwatchValue }, swatch.color)
        )
      );
    });
  }

  return React.createElement("div", { className: styles.stepContainer },
    // Sort mode section
    React.createElement("div", { className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "Default Sort Order"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose how FAQ items are sorted by default."
      ),
      React.createElement("div", { className: styles.selectRow },
        React.createElement("select", {
          className: styles.select,
          value: state.sortMode,
          onChange: handleSortModeChange,
          "aria-label": "Default sort mode",
        }, sortOptions)
      )
    ),

    // Template colors section
    currentTemplate
      ? React.createElement("div", { className: styles.section },
          React.createElement("div", { className: styles.sectionTitle },
            "Template Colors: " + currentTemplate.name
          ),
          React.createElement("div", { className: styles.stepSectionHint },
            "These colors are derived from your selected template. Customize them further in the property pane after setup."
          ),
          React.createElement("div", { className: styles.colorSwatchRow }, swatchElements)
        )
      : undefined,

    // Preview hints section
    React.createElement("div", { className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "Configuration Summary"),
      React.createElement("div", { className: styles.previewHints },
        React.createElement("div", { className: styles.previewHintItem },
          React.createElement("span", { className: styles.previewHintLabel }, "Layout:"),
          React.createElement("span", { className: styles.previewHintValue }, state.layout)
        ),
        React.createElement("div", { className: styles.previewHintItem },
          React.createElement("span", { className: styles.previewHintLabel }, "Style:"),
          React.createElement("span", { className: styles.previewHintValue }, state.accordionStyle)
        ),
        React.createElement("div", { className: styles.previewHintItem },
          React.createElement("span", { className: styles.previewHintLabel }, "Data:"),
          React.createElement("span", { className: styles.previewHintValue },
            state.dataSource === "sample" ? "Sample Data" : state.listName
          )
        ),
        React.createElement("div", { className: styles.previewHintItem },
          React.createElement("span", { className: styles.previewHintLabel }, "Sort:"),
          React.createElement("span", { className: styles.previewHintValue },
            getSortModeDisplayName(state.sortMode)
          )
        )
      )
    ),

    // Hint
    React.createElement("div", { className: styles.stepSectionHint },
      "You can fine-tune all appearance settings in the property pane after the wizard completes."
    )
  );
};

export default AppearanceStep;
