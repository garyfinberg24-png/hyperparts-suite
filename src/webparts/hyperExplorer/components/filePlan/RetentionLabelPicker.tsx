import * as React from "react";
import { HyperModal } from "../../../../common/components/HyperModal";
import type { IRetentionLabel, IFilePlanDescriptor } from "../../models";
import { formatRetentionDuration, formatRetentionAction, formatRetentionBehavior } from "../../models";
import styles from "./RetentionLabelPicker.module.scss";

export interface IRetentionLabelPickerProps {
  isOpen: boolean;
  labels: IRetentionLabel[];
  fileName: string;
  loading: boolean;
  onApply: (labelId: string, descriptors: IFilePlanDescriptor) => void;
  onClose: () => void;
}

var DESCRIPTOR_FIELDS: Array<{ key: string; label: string; placeholder: string }> = [
  { key: "functionOrActivity", label: "Function/Activity", placeholder: "e.g. Accounting" },
  { key: "referenceId", label: "Reference ID", placeholder: "e.g. FIN-2024-001" },
  { key: "department", label: "Department", placeholder: "e.g. Finance" },
  { key: "category", label: "Category", placeholder: "e.g. Tax Records" },
  { key: "subCategory", label: "Sub-Category", placeholder: "e.g. Annual Returns" },
  { key: "authorityType", label: "Authority Type", placeholder: "e.g. Federal" },
  { key: "provision", label: "Provision", placeholder: "e.g. SOX 802" },
  { key: "citation", label: "Citation", placeholder: "e.g. 18 U.S.C. 1519" },
];

var RetentionLabelPicker: React.FC<IRetentionLabelPickerProps> = function (props) {
  // Selected label
  var selectedLabelIdState = React.useState<string>("");
  var selectedLabelId = selectedLabelIdState[0];
  var setSelectedLabelId = selectedLabelIdState[1];

  // Descriptors
  var descriptorsState = React.useState<IFilePlanDescriptor>({});
  var descriptors = descriptorsState[0];
  var setDescriptors = descriptorsState[1];

  // Show descriptors toggle
  var showDescriptorsState = React.useState<boolean>(false);
  var showDescriptors = showDescriptorsState[0];
  var setShowDescriptors = showDescriptorsState[1];

  // Reset when opening
  React.useEffect(function () {
    if (props.isOpen) {
      setSelectedLabelId("");
      setDescriptors({});
      setShowDescriptors(false);
    }
  }, [props.isOpen]);

  // Find selected label details
  var selectedLabel: IRetentionLabel | undefined;
  if (selectedLabelId) {
    var matches = props.labels.filter(function (l) { return l.id === selectedLabelId; });
    if (matches.length > 0) {
      selectedLabel = matches[0];
    }
  }

  var handleLabelChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>): void {
    setSelectedLabelId((e.target as HTMLSelectElement).value);
  }, []);

  var handleDescriptorChange = React.useCallback(function (key: string, value: string): void {
    setDescriptors(function (prev: IFilePlanDescriptor): IFilePlanDescriptor {
      var updated: Record<string, string | undefined> = {};
      // Copy existing
      DESCRIPTOR_FIELDS.forEach(function (f) {
        var k = f.key;
        updated[k] = (prev as unknown as Record<string, string | undefined>)[k];
      });
      updated[key] = value || undefined;
      return updated as unknown as IFilePlanDescriptor;
    });
  }, []);

  var handleApply = React.useCallback(function (): void {
    if (selectedLabelId) {
      props.onApply(selectedLabelId, descriptors);
    }
  }, [selectedLabelId, descriptors, props.onApply]);

  // Build label dropdown options
  var labelOptions: React.ReactElement[] = [
    React.createElement("option", { key: "none", value: "" }, "Select a retention label..."),
  ];
  props.labels.forEach(function (label) {
    labelOptions.push(
      React.createElement("option", { key: label.id, value: label.id },
        label.displayName + " (" + formatRetentionDuration(label.retentionDuration) + ")"
      )
    );
  });

  // Footer buttons
  var footer = React.createElement("div", { className: styles.footerRow },
    React.createElement("button", {
      className: styles.cancelButton,
      onClick: props.onClose,
      type: "button",
    }, "Cancel"),
    React.createElement("button", {
      className: styles.applyButton,
      onClick: handleApply,
      disabled: !selectedLabelId,
      type: "button",
    }, "Apply Label")
  );

  // Body
  var bodyChildren: React.ReactNode[] = [];

  if (props.loading) {
    bodyChildren.push(
      React.createElement("div", { key: "loading", className: styles.loadingState },
        "Loading retention labels..."
      )
    );
  } else {
    // Label selection
    bodyChildren.push(
      React.createElement("div", { key: "label-section", className: styles.labelSection },
        React.createElement("span", { className: styles.sectionLabel }, "Retention Label"),
        React.createElement("span", { className: styles.sectionHint },
          "Select a retention label to apply to \"" + props.fileName + "\"."
        ),
        React.createElement("select", {
          className: styles.labelSelect,
          value: selectedLabelId,
          onChange: handleLabelChange,
          "aria-label": "Select retention label",
        }, labelOptions)
      )
    );

    // Selected label info card
    if (selectedLabel) {
      bodyChildren.push(
        React.createElement("div", { key: "label-info", className: styles.labelInfo },
          React.createElement("span", { className: styles.labelInfoName }, selectedLabel.displayName),
          React.createElement("span", { className: styles.labelInfoBadge + " " + styles.badgeBlue },
            formatRetentionDuration(selectedLabel.retentionDuration)
          ),
          React.createElement("span", { className: styles.labelInfoBadge + " " + styles.badgeOrange },
            formatRetentionAction(selectedLabel.actionAfterRetentionPeriod)
          ),
          React.createElement("span", { className: styles.labelInfoBadge + " " + styles.badgeGreen },
            formatRetentionBehavior(selectedLabel.behaviorDuringRetentionPeriod)
          )
        )
      );
    }

    // Descriptors (collapsible)
    bodyChildren.push(
      React.createElement("div", { key: "descriptors-section", className: styles.descriptorsSection },
        React.createElement("button", {
          className: styles.descriptorsToggle,
          onClick: function () { setShowDescriptors(!showDescriptors); },
          type: "button",
          "aria-expanded": showDescriptors ? "true" : "false",
        },
          React.createElement("span", { "aria-hidden": "true" }, showDescriptors ? "\u25BC" : "\u25B6"),
          "File Plan Descriptors (optional)"
        ),
        showDescriptors
          ? React.createElement("div", { className: styles.descriptorsGrid },
              DESCRIPTOR_FIELDS.map(function (field) {
                return React.createElement("div", { key: field.key, className: styles.fieldGroup },
                  React.createElement("label", { className: styles.fieldLabel }, field.label),
                  React.createElement("input", {
                    className: styles.fieldInput,
                    type: "text",
                    value: (descriptors as unknown as Record<string, string | undefined>)[field.key] || "",
                    onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
                      handleDescriptorChange(field.key, (e.target as HTMLInputElement).value);
                    },
                    placeholder: field.placeholder,
                    "aria-label": field.label,
                  })
                );
              })
            )
          : undefined
      )
    );
  }

  return React.createElement(HyperModal, {
    isOpen: props.isOpen,
    onClose: props.onClose,
    title: "Apply Retention Label",
    size: "medium",
    footer: footer,
  },
    React.createElement("div", { className: styles.pickerBody }, bodyChildren)
  );
};

export default RetentionLabelPicker;
