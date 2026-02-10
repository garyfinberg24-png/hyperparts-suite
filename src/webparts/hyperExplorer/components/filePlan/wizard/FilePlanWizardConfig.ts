import type { IHyperWizardConfig, IWizardSummaryRow } from "../../../../../common/components/wizard/IHyperWizard";
import type { IFilePlanWizardState } from "../../../models";
import { DEFAULT_FILE_PLAN_WIZARD_STATE } from "../../../models";
import type { IHyperExplorerWebPartProps } from "../../../models/IHyperExplorerWebPartProps";
import { ScopeStep } from "./ScopeStep";
import { LabelsStep } from "./LabelsStep";
import { DescriptorsStep } from "./DescriptorsStep";
import { RulesStep } from "./RulesStep";

// ============================================================
// File Plan Wizard Configuration
// ============================================================

export var filePlanWizardConfig: IHyperWizardConfig<IFilePlanWizardState, Partial<IHyperExplorerWebPartProps>> = {
  title: "File Plan Setup Wizard",

  welcome: {
    productName: "File Plan",
    tagline: "Intelligent records management powered by MS Purview Data Lifecycle Management",
    features: [
      {
        icon: "\uD83C\uDFF7\uFE0F",
        title: "Retention Labels",
        description: "Apply MS Purview retention labels to manage how long content is kept and what happens when it expires.",
      },
      {
        icon: "\uD83D\uDCCB",
        title: "File Plan Descriptors",
        description: "Attach compliance metadata like department, authority type, and legal citations to your records.",
      },
      {
        icon: "\u2699\uFE0F",
        title: "Auto-Classification",
        description: "Define rules to automatically apply retention labels based on file type, folder, or content type.",
      },
      {
        icon: "\uD83D\uDEE1\uFE0F",
        title: "Compliance Dashboard",
        description: "Monitor labeling coverage, identify unlabeled files, and track compliance status at a glance.",
      },
    ],
  },

  steps: [
    {
      id: "scope",
      label: "Scope & Coverage",
      shortLabel: "Scope",
      helpText: "Define which files and folders the file plan applies to.",
      component: ScopeStep,
      validate: function (state: IFilePlanWizardState): boolean {
        // Must either apply to all or have at least one folder/type selected
        if (state.scope.applyToAllFiles) return true;
        return state.scope.includeFolders.length > 0 || state.scope.fileTypeFilter.length > 0;
      },
    },
    {
      id: "labels",
      label: "Retention Labels",
      shortLabel: "Labels",
      helpText: "Select which MS Purview retention labels to enable for this library.",
      component: LabelsStep,
      validate: function (state: IFilePlanWizardState): boolean {
        return state.labels.selectedLabelIds.length > 0;
      },
    },
    {
      id: "descriptors",
      label: "File Plan Descriptors",
      shortLabel: "Descriptors",
      helpText: "Define default file plan metadata for records management. All fields are optional.",
      component: DescriptorsStep,
      // Always valid — all fields optional
    },
    {
      id: "rules",
      label: "Auto-Classification Rules",
      shortLabel: "Rules",
      helpText: "Define rules to automatically apply retention labels based on file properties.",
      component: RulesStep,
      validate: function (state: IFilePlanWizardState): boolean {
        // Valid if no rules, or all rules have name + label
        var valid = true;
        state.rules.forEach(function (rule) {
          if (!rule.name || !rule.labelId) {
            valid = false;
          }
        });
        return valid;
      },
    },
  ],

  initialState: DEFAULT_FILE_PLAN_WIZARD_STATE,

  buildResult: function (state: IFilePlanWizardState): Partial<IHyperExplorerWebPartProps> {
    return {
      enableFilePlan: true,
      filePlanConfig: JSON.stringify({
        scope: state.scope,
        labels: state.labels,
        descriptors: state.descriptors,
        rules: state.rules,
      }),
      showComplianceBadges: true,
      requireRetentionLabel: state.labels.requireLabel,
    };
  },

  buildSummary: function (state: IFilePlanWizardState): IWizardSummaryRow[] {
    var rows: IWizardSummaryRow[] = [];

    // Scope
    rows.push({
      label: "Scope",
      value: state.scope.applyToAllFiles ? "All files" : "Custom scope",
      type: "badge",
    });

    if (!state.scope.applyToAllFiles && state.scope.includeFolders.length > 0) {
      rows.push({
        label: "Folders",
        value: state.scope.includeFolders.join(", "),
        type: "mono",
      });
    }

    if (state.scope.fileTypeFilter.length > 0) {
      rows.push({
        label: "File Types",
        value: state.scope.fileTypeFilter.join(", "),
        type: "mono",
      });
    }

    // Labels
    rows.push({
      label: "Retention Labels",
      value: state.labels.selectedLabelIds.length + " selected",
      type: "badge",
    });

    if (state.labels.defaultLabelId) {
      rows.push({
        label: "Default Label",
        value: state.labels.defaultLabelId,
        type: "text",
      });
    }

    rows.push({
      label: "Require Label",
      value: state.labels.requireLabel ? "Yes" : "No",
      type: state.labels.requireLabel ? "badgeGreen" : "text",
    });

    // Descriptors
    var descriptorCount = 0;
    var desc = state.descriptors;
    if (desc.functionOrActivity) descriptorCount++;
    if (desc.department) descriptorCount++;
    if (desc.category) descriptorCount++;
    if (desc.referenceId) descriptorCount++;
    if (desc.subCategory) descriptorCount++;
    if (desc.authorityType) descriptorCount++;
    if (desc.provision) descriptorCount++;
    if (desc.citation) descriptorCount++;

    rows.push({
      label: "File Plan Descriptors",
      value: descriptorCount > 0 ? descriptorCount + " configured" : "None",
      type: descriptorCount > 0 ? "badgeGreen" : "text",
    });

    // Rules
    rows.push({
      label: "Auto-Classification Rules",
      value: state.rules.length > 0 ? state.rules.length + " rules" : "None",
      type: state.rules.length > 0 ? "badgeGreen" : "text",
    });

    return rows;
  },

  summaryFootnote: "You can reconfigure the file plan at any time from the property pane or the File Plan dashboard.",
};
