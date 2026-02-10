import * as React from "react";
import type { IWizardStepProps } from "../../../../../common/components/wizard/IHyperWizard";
import type { IFilePlanWizardState } from "../../../models";
import styles from "./WizardSteps.module.scss";

/**
 * Step 1: Scope & Coverage
 * Define which files/folders the file plan applies to.
 */
export var ScopeStep: React.FC<IWizardStepProps<IFilePlanWizardState>> = function (props) {
  var scope = props.state.scope;

  var handleScopeChange = React.useCallback(function (applyToAll: boolean): void {
    props.onChange({
      scope: {
        applyToAllFiles: applyToAll,
        includeFolders: scope.includeFolders,
        fileTypeFilter: scope.fileTypeFilter,
      },
    });
  }, [props.onChange, scope.includeFolders, scope.fileTypeFilter]);

  var handleFoldersChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    var val = (e.target as HTMLInputElement).value;
    var folders = val.length > 0
      ? val.split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; })
      : [];
    props.onChange({
      scope: {
        applyToAllFiles: scope.applyToAllFiles,
        includeFolders: folders,
        fileTypeFilter: scope.fileTypeFilter,
      },
    });
  }, [props.onChange, scope.applyToAllFiles, scope.fileTypeFilter]);

  var handleTypesChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>): void {
    var val = (e.target as HTMLInputElement).value;
    var types = val.length > 0
      ? val.split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(function (s) { return s.length > 0; })
      : [];
    props.onChange({
      scope: {
        applyToAllFiles: scope.applyToAllFiles,
        includeFolders: scope.includeFolders,
        fileTypeFilter: types,
      },
    });
  }, [props.onChange, scope.applyToAllFiles, scope.includeFolders]);

  return React.createElement("div", { className: styles.stepContainer },
    // Scope selection
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "File Plan Scope"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose whether to apply the file plan to the entire library or specific locations."
      ),

      // All files radio
      React.createElement("div", {
        className: scope.applyToAllFiles ? styles.radioCardSelected : styles.radioCard,
        role: "radio",
        "aria-checked": String(scope.applyToAllFiles),
        tabIndex: 0,
        onClick: function () { handleScopeChange(true); },
        onKeyDown: function (e: React.KeyboardEvent) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleScopeChange(true);
          }
        },
      },
        React.createElement("span", { className: styles.radioIcon, "aria-hidden": "true" }, "\uD83D\uDCC1"),
        React.createElement("span", { className: styles.radioInfo },
          React.createElement("span", { className: styles.radioLabel }, "Apply to All Files"),
          React.createElement("span", { className: styles.radioDesc },
            "The file plan covers every file in the document library, regardless of folder or type."
          )
        )
      ),

      // Specific folders radio
      React.createElement("div", {
        className: !scope.applyToAllFiles ? styles.radioCardSelected : styles.radioCard,
        role: "radio",
        "aria-checked": String(!scope.applyToAllFiles),
        tabIndex: 0,
        onClick: function () { handleScopeChange(false); },
        onKeyDown: function (e: React.KeyboardEvent) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleScopeChange(false);
          }
        },
      },
        React.createElement("span", { className: styles.radioIcon, "aria-hidden": "true" }, "\uD83D\uDCC2"),
        React.createElement("span", { className: styles.radioInfo },
          React.createElement("span", { className: styles.radioLabel }, "Specific Folders & File Types"),
          React.createElement("span", { className: styles.radioDesc },
            "Only apply the file plan to selected folders or file types."
          )
        )
      )
    ),

    // Conditional folder/type inputs
    !scope.applyToAllFiles
      ? React.createElement("div", { className: styles.stepSection },
          React.createElement("div", { className: styles.inputGroup },
            React.createElement("label", { className: styles.inputLabel }, "Include Folders"),
            React.createElement("input", {
              className: styles.textInput,
              type: "text",
              value: scope.includeFolders.join(", "),
              onChange: handleFoldersChange,
              placeholder: "e.g. Finance, Legal, HR/Contracts",
              "aria-label": "Include folders",
            }),
            React.createElement("span", { className: styles.textInputHint },
              "Comma-separated folder paths relative to the library root"
            )
          ),
          React.createElement("div", { className: styles.inputGroup },
            React.createElement("label", { className: styles.inputLabel }, "File Type Filter"),
            React.createElement("input", {
              className: styles.textInput,
              type: "text",
              value: scope.fileTypeFilter.join(", "),
              onChange: handleTypesChange,
              placeholder: "e.g. pdf, docx, xlsx",
              "aria-label": "File type filter",
            }),
            React.createElement("span", { className: styles.textInputHint },
              "Comma-separated file extensions (leave empty for all types)"
            )
          )
        )
      : undefined,

    // Info hint
    React.createElement("div", { className: styles.hintBox },
      "The file plan scope determines which files show compliance badges and can have retention labels applied. " +
      "You can always apply labels manually to files outside the scope."
    )
  );
};
