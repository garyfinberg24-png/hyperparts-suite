import * as React from "react";
import type { IWizardStepProps } from "../../../../../common/components/wizard/IHyperWizard";
import type { IFilePlanWizardState, IFilePlanDescriptor } from "../../../models";
import styles from "./WizardSteps.module.scss";

/** Descriptor field definition for rendering */
interface IDescriptorFieldDef {
  key: string;
  label: string;
  placeholder: string;
  icon: string;
}

var DESCRIPTOR_FIELDS: IDescriptorFieldDef[] = [
  { key: "functionOrActivity", label: "Function / Activity", placeholder: "e.g. Finance, Human Resources, Legal", icon: "\uD83C\uDFAF" },
  { key: "referenceId", label: "Reference ID", placeholder: "e.g. FP-2025-001", icon: "\uD83D\uDD22" },
  { key: "department", label: "Department", placeholder: "e.g. Accounting, Legal Affairs, IT", icon: "\uD83C\uDFE2" },
  { key: "category", label: "Category", placeholder: "e.g. Financial Reports, Contracts, Policies", icon: "\uD83D\uDCC2" },
  { key: "subCategory", label: "Sub-category", placeholder: "e.g. Quarterly, Annual, Employment", icon: "\uD83D\uDCC4" },
  { key: "authorityType", label: "Authority Type", placeholder: "e.g. Regulatory, Organizational, Legal", icon: "\u2696\uFE0F" },
  { key: "provision", label: "Provision", placeholder: "e.g. SOX Section 802, GDPR Art. 17", icon: "\uD83D\uDCDC" },
  { key: "citation", label: "Citation", placeholder: "e.g. 17 CFR 210, EU 2016/679", icon: "\uD83D\uDD17" },
];

/**
 * Step 3: File Plan Descriptors
 * Define default metadata for records management. All fields optional.
 */
export var DescriptorsStep: React.FC<IWizardStepProps<IFilePlanWizardState>> = function (props) {
  var descriptors = props.state.descriptors;

  var handleFieldChange = React.useCallback(function (key: string, value: string): void {
    var updated: IFilePlanDescriptor = {};
    // Copy existing fields
    if (descriptors.functionOrActivity) updated.functionOrActivity = descriptors.functionOrActivity;
    if (descriptors.referenceId) updated.referenceId = descriptors.referenceId;
    if (descriptors.department) updated.department = descriptors.department;
    if (descriptors.category) updated.category = descriptors.category;
    if (descriptors.subCategory) updated.subCategory = descriptors.subCategory;
    if (descriptors.authorityType) updated.authorityType = descriptors.authorityType;
    if (descriptors.provision) updated.provision = descriptors.provision;
    if (descriptors.citation) updated.citation = descriptors.citation;
    // Set new value
    (updated as unknown as Record<string, string | undefined>)[key] = value || undefined;
    props.onChange({ descriptors: updated });
  }, [props.onChange, descriptors]);

  // Build descriptor field inputs in 2-column grid
  var fieldElements = DESCRIPTOR_FIELDS.map(function (field) {
    var currentValue = (descriptors as unknown as Record<string, string | undefined>)[field.key] || "";

    return React.createElement("div", {
      key: field.key,
      className: styles.inputGroup,
    },
      React.createElement("label", { className: styles.inputLabel },
        React.createElement("span", { "aria-hidden": "true" }, field.icon + " "),
        field.label
      ),
      React.createElement("input", {
        className: styles.textInput,
        type: "text",
        value: currentValue,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          handleFieldChange(field.key, (e.target as HTMLInputElement).value);
        },
        placeholder: field.placeholder,
        "aria-label": field.label,
      })
    );
  });

  // Count filled fields
  var filledCount = 0;
  DESCRIPTOR_FIELDS.forEach(function (field) {
    var val = (descriptors as unknown as Record<string, string | undefined>)[field.key];
    if (val && val.length > 0) filledCount++;
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel },
        "Default File Plan Descriptors",
        filledCount > 0
          ? React.createElement("span", {
              style: {
                marginLeft: "8px",
                fontSize: "11px",
                fontWeight: "600",
                color: "#137333",
                background: "#e6f4ea",
                padding: "2px 8px",
                borderRadius: "10px",
              },
            }, filledCount + " / " + DESCRIPTOR_FIELDS.length)
          : undefined
      ),
      React.createElement("div", { className: styles.stepSectionHint },
        "These default values will be pre-filled when applying retention labels. Users can override them per file."
      )
    ),

    // 2-column grid of inputs
    React.createElement("div", { className: styles.descriptorGrid }, fieldElements),

    // Hint
    React.createElement("div", { className: styles.hintBox },
      "File plan descriptors are part of the MS Purview Records Management framework. " +
      "They provide additional context for compliance audits and help categorize records beyond just the retention label. " +
      "All fields are optional \u2014 configure only what applies to your organization."
    )
  );
};
