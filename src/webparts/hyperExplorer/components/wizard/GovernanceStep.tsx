import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IExplorerWizardState } from "../../models/IHyperExplorerWizardState";

/**
 * Wizard Step 4: Governance & Compliance
 * Enables/disables Naming Convention, Metadata Profiles, and File Plan features.
 */
var GovernanceStep: React.FC<IWizardStepProps<IExplorerWizardState>> = function (props) {
  var gov = props.state.governance;

  var updateField = function (field: string, value: boolean): void {
    var next = {
      enableNamingConvention: gov.enableNamingConvention,
      enableMetadataProfiles: gov.enableMetadataProfiles,
      enableFilePlan: gov.enableFilePlan,
    };
    (next as Record<string, unknown>)[field] = value;
    props.onChange({ governance: next });
  };

  var sectionStyle: React.CSSProperties = {
    border: "1px solid #edebe9",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    background: "#faf9f8",
    transition: "border-color 0.2s",
  };

  var sectionActiveStyle: React.CSSProperties = {
    border: "1px solid #0078d4",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    background: "#f0f6ff",
    transition: "border-color 0.2s",
  };

  var titleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  };

  var iconStyle: React.CSSProperties = {
    fontSize: "24px",
    lineHeight: "1",
    flexShrink: 0,
  };

  var labelStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: 600,
    color: "#323130",
    flex: "1",
  };

  var descStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#605e5c",
    margin: "0",
    lineHeight: "1.5",
  };

  var toggleStyle: React.CSSProperties = {
    cursor: "pointer",
    accentColor: "#0078d4",
    width: "18px",
    height: "18px",
  };

  return React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: "4px" } },
    React.createElement("p", { style: { fontSize: "13px", color: "#605e5c", marginBottom: "12px" } },
      "Configure governance features for document management. You can configure each feature in detail after setup."
    ),

    // Naming Convention
    React.createElement("div", { style: gov.enableNamingConvention ? sectionActiveStyle : sectionStyle },
      React.createElement("div", { style: titleStyle },
        React.createElement("span", { style: iconStyle, "aria-hidden": "true" }, "\u2699\uFE0F"),
        React.createElement("span", { style: labelStyle }, "Naming Convention"),
        React.createElement("input", {
          type: "checkbox",
          checked: gov.enableNamingConvention,
          onChange: function () { updateField("enableNamingConvention", !gov.enableNamingConvention); },
          style: toggleStyle,
          "aria-label": "Enable naming convention",
        })
      ),
      React.createElement("p", { style: descStyle },
        "Enforce file naming standards with configurable patterns (Department-Year-Sequence-Description), " +
        "auto-rename on upload, department codes, and sequence numbering."
      )
    ),

    // Metadata Profiles
    React.createElement("div", { style: gov.enableMetadataProfiles ? sectionActiveStyle : sectionStyle },
      React.createElement("div", { style: titleStyle },
        React.createElement("span", { style: iconStyle, "aria-hidden": "true" }, "\uD83D\uDCCB"),
        React.createElement("span", { style: labelStyle }, "Metadata Profiles"),
        React.createElement("input", {
          type: "checkbox",
          checked: gov.enableMetadataProfiles,
          onChange: function () { updateField("enableMetadataProfiles", !gov.enableMetadataProfiles); },
          style: toggleStyle,
          "aria-label": "Enable metadata profiles",
        })
      ),
      React.createElement("p", { style: descStyle },
        "Upload files with pre-configured metadata templates. Define required fields, " +
        "departments, document categories, and classification levels for consistent metadata."
      )
    ),

    // File Plan
    React.createElement("div", { style: gov.enableFilePlan ? sectionActiveStyle : sectionStyle },
      React.createElement("div", { style: titleStyle },
        React.createElement("span", { style: iconStyle, "aria-hidden": "true" }, "\uD83D\uDDC2\uFE0F"),
        React.createElement("span", { style: labelStyle }, "File Plan & Compliance"),
        React.createElement("input", {
          type: "checkbox",
          checked: gov.enableFilePlan,
          onChange: function () { updateField("enableFilePlan", !gov.enableFilePlan); },
          style: toggleStyle,
          "aria-label": "Enable file plan",
        })
      ),
      React.createElement("p", { style: descStyle },
        "Microsoft Purview retention labels, compliance badges, records management, " +
        "and retention policy dashboard for regulatory compliance."
      )
    ),

    // Info note
    React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        background: "#f0f6ff",
        borderRadius: "6px",
        fontSize: "12px",
        color: "#0078d4",
        marginTop: "4px",
      },
    },
      React.createElement("span", {}, "\u2139\uFE0F"),
      "Each feature can be configured in detail after the wizard completes via the toolbar buttons."
    )
  );
};

export default GovernanceStep;
