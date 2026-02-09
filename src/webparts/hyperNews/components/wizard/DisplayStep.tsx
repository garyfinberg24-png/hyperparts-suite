import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { INewsWizardState } from "../../models/IHyperNewsWizardState";
import type { IWizardDisplayOptions } from "../../models/IHyperNewsWizardState";
import styles from "./WizardSteps.module.scss";

// ============================================================
// DisplayStep — Page size, featured articles, metadata toggles
// ============================================================

interface IToggleDef {
  key: keyof IWizardDisplayOptions;
  label: string;
  desc: string;
  icon: string;
  isBoolean: true;
}

var DISPLAY_TOGGLES: IToggleDef[] = [
  { key: "showFeatured", label: "Featured Articles", desc: "Highlight top articles in a featured section", icon: "\u2B50", isBoolean: true },
  { key: "showImages", label: "Show Images", desc: "Display banner images on article cards", icon: "\uD83D\uDDBC\uFE0F", isBoolean: true },
  { key: "showDescription", label: "Show Description", desc: "Display article excerpts below titles", icon: "\uD83D\uDCDD", isBoolean: true },
  { key: "showAuthor", label: "Show Author", desc: "Display author name on cards", icon: "\uD83D\uDC64", isBoolean: true },
  { key: "showDate", label: "Show Date", desc: "Display publication date on cards", icon: "\uD83D\uDCC5", isBoolean: true },
  { key: "showReadTime", label: "Show Read Time", desc: "Display estimated read time", icon: "\u231A", isBoolean: true },
];

var DisplayStep: React.FC<IWizardStepProps<INewsWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;
  var display = state.displayOptions;

  var handleToggle = React.useCallback(function (key: keyof IWizardDisplayOptions): void {
    var updated = { pageSize: display.pageSize, showFeatured: display.showFeatured, maxFeatured: display.maxFeatured, showImages: display.showImages, showDescription: display.showDescription, showAuthor: display.showAuthor, showDate: display.showDate, showReadTime: display.showReadTime };
    (updated as unknown as Record<string, unknown>)[key] = !(display as unknown as Record<string, unknown>)[key];
    onChange({ displayOptions: updated });
  }, [onChange, display]);

  var handlePageSize = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 12;
    onChange({ displayOptions: { pageSize: val, showFeatured: display.showFeatured, maxFeatured: display.maxFeatured, showImages: display.showImages, showDescription: display.showDescription, showAuthor: display.showAuthor, showDate: display.showDate, showReadTime: display.showReadTime } });
  }, [onChange, display]);

  var handleMaxFeatured = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 3;
    onChange({ displayOptions: { pageSize: display.pageSize, showFeatured: display.showFeatured, maxFeatured: val, showImages: display.showImages, showDescription: display.showDescription, showAuthor: display.showAuthor, showDate: display.showDate, showReadTime: display.showReadTime } });
  }, [onChange, display]);

  var toggleElements: React.ReactElement[] = [];
  DISPLAY_TOGGLES.forEach(function (toggle) {
    var isChecked = !!(display as unknown as Record<string, unknown>)[toggle.key];

    toggleElements.push(
      React.createElement("label", { key: toggle.key, className: styles.toggleRow },
        React.createElement("span", { className: styles.toggleIcon, "aria-hidden": "true" }, toggle.icon),
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, toggle.label),
          React.createElement("span", { className: styles.toggleDesc }, toggle.desc)
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            className: styles.toggleInput,
            checked: isChecked,
            onChange: function () { handleToggle(toggle.key); },
            "aria-label": toggle.label,
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Page size slider
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Articles Per Page")
    ),
    React.createElement("div", { className: styles.sliderRow },
      React.createElement("span", { className: styles.sliderLabel }, "Page Size"),
      React.createElement("input", {
        type: "range",
        className: styles.sliderInput,
        min: 3,
        max: 50,
        value: display.pageSize,
        onChange: handlePageSize,
        "aria-label": "Page size",
      }),
      React.createElement("span", { className: styles.sliderValue }, String(display.pageSize))
    ),

    // Featured articles
    display.showFeatured
      ? React.createElement("div", { className: styles.sliderRow },
          React.createElement("span", { className: styles.sliderLabel }, "Max Featured"),
          React.createElement("input", {
            type: "range",
            className: styles.sliderInput,
            min: 1,
            max: 10,
            value: display.maxFeatured,
            onChange: handleMaxFeatured,
            "aria-label": "Maximum featured articles",
          }),
          React.createElement("span", { className: styles.sliderValue }, String(display.maxFeatured))
        )
      : undefined,

    // Metadata toggles
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Card Metadata"),
      React.createElement("div", { className: styles.stepSectionHint }, "Choose which information to display on article cards.")
    ),
    toggleElements
  );
};

export default DisplayStep;
