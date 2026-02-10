import * as React from "react";
import type { IMetadataProfile, IMetadataField, IMetadataUploadState } from "../models";
import { METADATA_PROFILES, getMetadataProfile, getRequiredFieldCount, validateMetadataValues } from "../models";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";
import { formatFileSize } from "../utils/fileTypeUtils";
import styles from "./HyperExplorerMetadataUpload.module.scss";

export interface IHyperExplorerMetadataUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (profileKey: string, values: Record<string, string>) => void;
}

var HyperExplorerMetadataUpload: React.FC<IHyperExplorerMetadataUploadProps> = function (props) {
  var store = useHyperExplorerStore();
  var uploadState = store.metadataUploadState;

  var errorsState = React.useState<Record<string, string>>({});
  var errors = errorsState[0];
  var setErrors = errorsState[1];

  if (!props.isOpen) {
    return React.createElement(React.Fragment);
  }

  var currentStep = uploadState.step;
  var selectedProfileKey = uploadState.profileKey;
  var profile = selectedProfileKey ? getMetadataProfile(selectedProfileKey) : undefined;

  // Update state helper
  var updateState = function (partial: Partial<IMetadataUploadState>): void {
    var next: IMetadataUploadState = {
      step: partial.step !== undefined ? partial.step : uploadState.step,
      profileKey: partial.profileKey !== undefined ? partial.profileKey : uploadState.profileKey,
      fileName: partial.fileName !== undefined ? partial.fileName : uploadState.fileName,
      fileSize: partial.fileSize !== undefined ? partial.fileSize : uploadState.fileSize,
      values: partial.values !== undefined ? partial.values : uploadState.values,
    };
    store.setMetadataUploadState(next);
  };

  // Step navigation
  var goNext = function (): void {
    if (currentStep === 1) {
      if (!selectedProfileKey) return;
      updateState({ step: 2 });
    } else if (currentStep === 2) {
      // Simulate file selection
      updateState({
        step: 3,
        fileName: "Service_Agreement_Contoso.pdf",
        fileSize: 2516582,
      });
    } else if (currentStep === 3) {
      // Validate
      if (profile) {
        var validationErrors = validateMetadataValues(profile, uploadState.values);
        var errorKeys = Object.keys(validationErrors);
        if (errorKeys.length > 0) {
          setErrors(validationErrors);
          return;
        }
      }
      setErrors({});
      updateState({ step: 4 });
    } else if (currentStep === 4) {
      // Upload
      props.onUpload(selectedProfileKey, uploadState.values);
      store.resetMetadataUpload();
      props.onClose();
    }
  };

  var goBack = function (): void {
    if (currentStep > 1) {
      setErrors({});
      updateState({ step: currentStep - 1 });
    }
  };

  var handleClose = function (): void {
    store.resetMetadataUpload();
    setErrors({});
    props.onClose();
  };

  var handleProfileSelect = function (key: string): void {
    updateState({ profileKey: key, values: {} });
  };

  var handleFieldChange = function (fieldKey: string, value: string): void {
    var nextValues: Record<string, string> = {};
    Object.keys(uploadState.values).forEach(function (k) {
      nextValues[k] = uploadState.values[k];
    });
    nextValues[fieldKey] = value;
    updateState({ values: nextValues });
    // Clear error for this field
    if (errors[fieldKey]) {
      var nextErrors: Record<string, string> = {};
      Object.keys(errors).forEach(function (k) {
        if (k !== fieldKey) nextErrors[k] = errors[k];
      });
      setErrors(nextErrors);
    }
  };

  // ── Build step indicators ──
  var stepIndicators: React.ReactNode[] = [];
  var stepLabels = ["Select Profile", "Choose File", "Fill Metadata", "Review & Upload"];
  stepLabels.forEach(function (label, idx) {
    var stepNum = idx + 1;
    var stepClass = styles.mpStep;
    if (stepNum === currentStep) stepClass = stepClass + " " + styles.mpStepActive;
    else if (stepNum < currentStep) stepClass = stepClass + " " + styles.mpStepDone;
    stepIndicators.push(
      React.createElement("div", { key: "step-" + stepNum, className: stepClass },
        React.createElement("span", { className: styles.stepNum }, String(stepNum)),
        " " + label
      )
    );
  });

  // ── Build step content ──
  var stepContent: React.ReactNode;

  if (currentStep === 1) {
    // Profile selection grid
    var profileCards = METADATA_PROFILES.map(function (p: IMetadataProfile) {
      var cardClass = styles.mpProf;
      if (selectedProfileKey === p.key) cardClass = cardClass + " " + styles.mpProfSelected;
      var reqCount = getRequiredFieldCount(p);
      return React.createElement("div", {
        key: p.key,
        className: cardClass,
        onClick: function () { handleProfileSelect(p.key); },
        role: "button",
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleProfileSelect(p.key); }
        },
        "aria-pressed": selectedProfileKey === p.key ? "true" : "false",
      },
        React.createElement("div", { className: styles.profIcon }, p.icon),
        React.createElement("div", { className: styles.profName }, p.name),
        React.createElement("div", { className: styles.profDesc }, p.description),
        React.createElement("div", { className: styles.profFields }, reqCount + " required fields")
      );
    });

    stepContent = React.createElement("div", { key: "step1" },
      React.createElement("p", { className: styles.stepHint },
        "Select a metadata profile to define which fields are required when uploading this type of document."
      ),
      React.createElement("div", { className: styles.mpProfiles }, profileCards)
    );
  } else if (currentStep === 2) {
    // File selection (simulated drop zone)
    stepContent = React.createElement("div", { key: "step2" },
      React.createElement("div", { className: styles.dropZone },
        React.createElement("span", { className: styles.dropIcon }, "\uD83D\uDCE4"),
        React.createElement("div", { className: styles.dropText },
          "Drag file here or ",
          React.createElement("strong", {
            className: styles.browseLink,
            onClick: goNext,
            role: "button",
            tabIndex: 0,
          }, "click to browse")
        )
      )
    );
  } else if (currentStep === 3 && profile) {
    // Metadata form
    var formFields = profile.fields.map(function (field: IMetadataField) {
      var fieldClass = styles.mpField;
      if (errors[field.key]) fieldClass = fieldClass + " " + styles.mpFieldError;
      var inputElement: React.ReactNode;
      var currentValue = uploadState.values[field.key] || "";

      if (field.type === "select" && field.options) {
        var options = [React.createElement("option", { key: "empty", value: "" }, "-- Select --")];
        field.options.forEach(function (opt) {
          options.push(React.createElement("option", { key: opt, value: opt }, opt));
        });
        inputElement = React.createElement("select", {
          value: currentValue,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { handleFieldChange(field.key, e.target.value); },
        }, options);
      } else if (field.type === "date") {
        inputElement = React.createElement("input", {
          type: "date",
          value: currentValue,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(field.key, e.target.value); },
        });
      } else if (field.type === "textarea") {
        inputElement = React.createElement("textarea", {
          rows: 3,
          placeholder: field.placeholder || "",
          value: currentValue,
          onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>) { handleFieldChange(field.key, e.target.value); },
        });
      } else {
        inputElement = React.createElement("input", {
          type: "text",
          placeholder: field.placeholder || "",
          value: currentValue,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(field.key, e.target.value); },
        });
      }

      return React.createElement("div", { key: field.key, className: fieldClass },
        React.createElement("label", {},
          field.label,
          field.required ? React.createElement("span", { className: styles.required }, " *") : undefined
        ),
        inputElement,
        errors[field.key]
          ? React.createElement("span", { className: styles.errorMsg }, errors[field.key])
          : undefined,
        field.hint
          ? React.createElement("span", { className: styles.fieldHint }, field.hint)
          : undefined
      );
    });

    stepContent = React.createElement("div", { key: "step3" },
      React.createElement("div", { className: styles.filePreview },
        React.createElement("span", { className: styles.fpIcon }, "\uD83D\uDCDC"),
        React.createElement("div", {},
          React.createElement("div", { className: styles.fpName }, uploadState.fileName),
          React.createElement("div", { className: styles.fpSize }, formatFileSize(uploadState.fileSize) + " \u00B7 " + profile.name + " Profile")
        )
      ),
      React.createElement("div", { className: styles.mpForm }, formFields)
    );
  } else if (currentStep === 4 && profile) {
    // Review
    var reviewRows = profile.fields.map(function (field: IMetadataField) {
      var val = uploadState.values[field.key];
      return React.createElement("div", { key: field.key, className: styles.reviewRow },
        React.createElement("span", { className: styles.reviewLabel }, field.label),
        React.createElement("span", { className: styles.reviewValue },
          val || (field.required
            ? React.createElement("em", { className: styles.reviewEmpty }, "To be filled")
            : React.createElement("em", { className: styles.reviewOptional }, "Optional"))
        )
      );
    });

    stepContent = React.createElement("div", { key: "step4" },
      React.createElement("div", { className: styles.filePreview },
        React.createElement("span", { className: styles.fpIcon }, "\uD83D\uDCDC"),
        React.createElement("div", {},
          React.createElement("div", { className: styles.fpName }, uploadState.fileName),
          React.createElement("div", { className: styles.fpSize }, formatFileSize(uploadState.fileSize) + " \u00B7 " + profile.name + " Profile")
        )
      ),
      React.createElement("div", { className: styles.reviewTable },
        React.createElement("div", { className: styles.reviewHeader }, "Metadata Summary (" + profile.name + " Profile)"),
        reviewRows
      )
    );
  }

  // ── Modal ──
  return React.createElement("div", {
    className: styles.overlay,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Upload with Metadata Profile",
  },
    React.createElement("div", { className: styles.modal },
      // Header
      React.createElement("div", { className: styles.modalHeader },
        React.createElement("h2", {}, "\uD83D\uDCCB Upload with Metadata Profile"),
        React.createElement("button", {
          className: styles.closeButton,
          onClick: handleClose,
          "aria-label": "Close",
          type: "button",
        }, "\u2715")
      ),
      // Body
      React.createElement("div", { className: styles.modalBody },
        React.createElement("div", { className: styles.mpSteps }, stepIndicators),
        stepContent
      ),
      // Footer
      React.createElement("div", { className: styles.modalFooter },
        currentStep > 1
          ? React.createElement("button", {
              className: styles.btn,
              onClick: goBack,
              type: "button",
            }, "\u2190 Back")
          : undefined,
        React.createElement("button", {
          className: styles.btn,
          onClick: handleClose,
          type: "button",
        }, "Cancel"),
        React.createElement("button", {
          className: styles.btn + " " + styles.btnPrimary,
          onClick: goNext,
          type: "button",
        }, currentStep === 4 ? "Upload" : "Next \u2192")
      )
    )
  );
};

export default HyperExplorerMetadataUpload;
