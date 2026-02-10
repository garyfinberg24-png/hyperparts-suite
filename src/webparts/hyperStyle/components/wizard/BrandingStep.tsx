import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IStyleWizardState } from "../../models/IHyperStyleWizardState";
import type { IconLibrary, HeadingScale } from "../../models";
import styles from "./WizardSteps.module.scss";

var FONTS: string[] = ["Inter", "Segoe UI", "Poppins", "Roboto", "Open Sans", "Montserrat", "Playfair Display", "Source Code Pro", "Raleway", "Nunito"];

var HEADING_SCALES: Array<{ value: HeadingScale; label: string }> = [
  { value: "1.125", label: "1.125 Minor Second" },
  { value: "1.200", label: "1.200 Minor Third" },
  { value: "1.250", label: "1.250 Major Third" },
  { value: "1.333", label: "1.333 Perfect Fourth" },
];

var ICON_LIBRARIES: Array<{ value: IconLibrary; label: string }> = [
  { value: "fluent", label: "Fluent UI Icons" },
  { value: "fontawesome", label: "Font Awesome 6" },
  { value: "material", label: "Material Icons" },
  { value: "none", label: "None" },
];

var COLOR_FIELDS: Array<{ key: string; label: string }> = [
  { key: "primaryColor", label: "Primary" },
  { key: "secondaryColor", label: "Secondary" },
  { key: "accentColor", label: "Accent" },
  { key: "successColor", label: "Success" },
  { key: "warningColor", label: "Warning" },
  { key: "dangerColor", label: "Danger" },
];

var BrandingStep: React.FC<IWizardStepProps<IStyleWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleTextChange = React.useCallback(function (key: string, value: string): void {
    var update: Partial<IStyleWizardState> = {};
    (update as Record<string, string>)[key] = value;
    onChange(update);
  }, [onChange]);

  var handleColorChange = React.useCallback(function (key: string, value: string): void {
    var update: Partial<IStyleWizardState> = {};
    (update as Record<string, string>)[key] = value;
    onChange(update);
  }, [onChange]);

  var handleFontSizeChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    onChange({ baseFontSize: parseInt(e.target.value, 10) || 14 });
  }, [onChange]);

  // Font select options
  var fontOptions: React.ReactElement[] = [];
  FONTS.forEach(function (f) {
    fontOptions.push(React.createElement("option", { key: f, value: f }, f));
  });

  // Color rows
  var colorRows: React.ReactElement[] = [];
  COLOR_FIELDS.forEach(function (cf) {
    var val = (state as unknown as Record<string, string>)[cf.key] || "#000000";
    colorRows.push(
      React.createElement("div", { key: cf.key, className: styles.colorRow },
        React.createElement("span", { className: styles.colorLabel }, cf.label),
        React.createElement("input", {
          type: "color",
          className: styles.colorSwatch,
          value: val,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleColorChange(cf.key, e.target.value); },
        }),
        React.createElement("input", {
          type: "text",
          className: styles.colorHex,
          value: val,
          maxLength: 7,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleColorChange(cf.key, e.target.value); },
        })
      )
    );
  });

  // Heading scale chips
  var scaleChips: React.ReactElement[] = [];
  HEADING_SCALES.forEach(function (hs) {
    scaleChips.push(
      React.createElement("button", {
        key: hs.value,
        className: state.headingScale === hs.value ? styles.chipActive : styles.chip,
        onClick: function () { onChange({ headingScale: hs.value }); },
        type: "button",
      }, hs.label)
    );
  });

  // Icon library radios
  var iconRadios: React.ReactElement[] = [];
  ICON_LIBRARIES.forEach(function (lib) {
    iconRadios.push(
      React.createElement("div", {
        key: lib.value,
        className: state.iconLibrary === lib.value ? styles.radioItemActive : styles.radioItem,
        onClick: function () { onChange({ iconLibrary: lib.value }); },
        role: "radio",
        "aria-checked": String(state.iconLibrary === lib.value),
        tabIndex: 0,
      },
        React.createElement("span", { className: state.iconLibrary === lib.value ? styles.radioDotActive : styles.radioDot }),
        React.createElement("span", { className: styles.radioText }, lib.label)
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    // Brand Identity
    React.createElement("div", { className: styles.formSection },
      React.createElement("div", { className: styles.formSectionTitle }, "Brand Identity"),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Logo URL"),
        React.createElement("input", {
          className: styles.formInput, type: "text",
          placeholder: "https://contoso.sharepoint.com/sites/branding/logo.svg",
          value: state.logoUrl,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleTextChange("logoUrl", e.target.value); },
        })
      ),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Brand Title"),
        React.createElement("input", {
          className: styles.formInput, type: "text",
          value: state.brandTitle,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleTextChange("brandTitle", e.target.value); },
        })
      ),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Tagline"),
        React.createElement("input", {
          className: styles.formInput, type: "text",
          placeholder: "Optional tagline",
          value: state.tagline,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleTextChange("tagline", e.target.value); },
        })
      )
    ),

    // Colors
    React.createElement("div", { className: styles.formSection },
      React.createElement("div", { className: styles.formSectionTitle }, "Colors"),
      colorRows
    ),

    // Typography
    React.createElement("div", { className: styles.formSection },
      React.createElement("div", { className: styles.formSectionTitle }, "Typography"),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Primary Font"),
        React.createElement("select", {
          className: styles.formInput,
          value: state.primaryFont,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { handleTextChange("primaryFont", e.target.value); },
        }, fontOptions)
      ),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Secondary Font"),
        React.createElement("select", {
          className: styles.formInput,
          value: state.secondaryFont,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { handleTextChange("secondaryFont", e.target.value); },
        }, fontOptions)
      ),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Base Font Size"),
        React.createElement("div", { className: styles.sliderRow },
          React.createElement("input", {
            type: "range", className: styles.sliderInput,
            min: 12, max: 20, value: state.baseFontSize,
            onChange: handleFontSizeChange,
          }),
          React.createElement("span", { className: styles.sliderValue }, state.baseFontSize + "px")
        )
      ),
      React.createElement("div", { className: styles.formGroup },
        React.createElement("label", { className: styles.formLabel }, "Heading Scale"),
        React.createElement("div", { className: styles.chipGroup }, scaleChips)
      )
    ),

    // Icon Library
    React.createElement("div", { className: styles.formSection },
      React.createElement("div", { className: styles.formSectionTitle }, "Icon Library"),
      React.createElement("div", { className: styles.radioGroup }, iconRadios)
    )
  );
};

export default BrandingStep;
