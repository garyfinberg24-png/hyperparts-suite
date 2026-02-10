import * as React from "react";
import { HyperModal } from "../../../../common/components/HyperModal";
import type { IRetentionLabel, IComplianceStatus } from "../../models";
import { formatRetentionDuration } from "../../models";
import styles from "./FilePlanDashboard.module.scss";

export interface IFilePlanDashboardProps {
  isOpen: boolean;
  labels: IRetentionLabel[];
  complianceStatuses: Record<string, IComplianceStatus>;
  totalFiles: number;
  onOpenWizard: () => void;
  onClose: () => void;
}

var FilePlanDashboard: React.FC<IFilePlanDashboardProps> = function (props) {
  // Compute statistics
  var statuses = props.complianceStatuses;
  var statusKeys = Object.keys(statuses);
  var labeledCount = 0;
  var labelCounts: Record<string, number> = {};

  statusKeys.forEach(function (key) {
    var status = statuses[key];
    if (status.labelId) {
      labeledCount = labeledCount + 1;
      if (!labelCounts[status.labelId]) {
        labelCounts[status.labelId] = 0;
      }
      labelCounts[status.labelId] = labelCounts[status.labelId] + 1;
    }
  });

  var unlabeledCount = props.totalFiles - labeledCount;
  var coveragePercent = props.totalFiles > 0
    ? Math.round((labeledCount / props.totalFiles) * 100)
    : 0;

  // Build recent actions from compliance statuses (most recently applied)
  var recentActions: Array<{ fileName: string; labelName: string; date: string }> = [];
  statusKeys.forEach(function (key) {
    var status = statuses[key];
    if (status.labelId && status.appliedDate) {
      recentActions.push({
        fileName: key,
        labelName: status.labelName || "Unknown",
        date: status.appliedDate,
      });
    }
  });
  // Sort by date descending
  recentActions.sort(function (a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  // Take top 5
  recentActions = recentActions.slice(0, 5);

  // Body
  var bodyChildren: React.ReactNode[] = [];

  // Summary cards
  bodyChildren.push(
    React.createElement("div", { key: "summary", className: styles.summaryGrid },
      // Labeled
      React.createElement("div", { className: styles.summaryCard + " " + styles.summaryCardLabeled },
        React.createElement("span", { className: styles.summaryValue + " " + styles.summaryValueGreen },
          String(labeledCount)
        ),
        React.createElement("span", { className: styles.summaryLabel }, "Labeled")
      ),
      // Unlabeled
      React.createElement("div", { className: styles.summaryCard + " " + styles.summaryCardUnlabeled },
        React.createElement("span", { className: styles.summaryValue + " " + styles.summaryValueOrange },
          String(unlabeledCount)
        ),
        React.createElement("span", { className: styles.summaryLabel }, "Unlabeled")
      ),
      // Coverage
      React.createElement("div", { className: styles.summaryCard + " " + styles.summaryCardCoverage },
        React.createElement("span", { className: styles.summaryValue + " " + styles.summaryValueBlue },
          coveragePercent + "%"
        ),
        React.createElement("span", { className: styles.summaryLabel }, "Coverage")
      )
    )
  );

  // Per-label breakdown
  if (props.labels.length > 0) {
    var labelRows = props.labels.map(function (label) {
      var count = labelCounts[label.id] || 0;

      return React.createElement("div", { key: label.id, className: styles.labelRow },
        React.createElement("div", { className: styles.labelRowInfo },
          React.createElement("span", { className: styles.labelRowIcon, "aria-hidden": "true" },
            "\uD83C\uDFF7\uFE0F"
          ),
          React.createElement("span", { className: styles.labelRowName }, label.displayName),
          React.createElement("span", { className: styles.labelRowDuration },
            formatRetentionDuration(label.retentionDuration)
          )
        ),
        React.createElement("span", { className: styles.labelRowCount },
          count + " file" + (count !== 1 ? "s" : "")
        )
      );
    });

    bodyChildren.push(
      React.createElement("div", { key: "breakdown", className: styles.breakdownSection },
        React.createElement("div", { className: styles.sectionTitle }, "Labels in Use"),
        labelRows
      )
    );
  }

  // Recent actions
  if (recentActions.length > 0) {
    var actionElements = recentActions.map(function (action, idx) {
      var dateStr = new Date(action.date).toLocaleDateString();
      return React.createElement("div", { key: "action-" + idx, className: styles.actionItem },
        React.createElement("span", { className: styles.actionTime }, dateStr),
        React.createElement("span", { className: styles.actionText },
          "\"" + action.labelName + "\" applied to " + action.fileName
        )
      );
    });

    bodyChildren.push(
      React.createElement("div", { key: "actions", className: styles.actionsSection },
        React.createElement("div", { className: styles.sectionTitle }, "Recent Activity"),
        actionElements
      )
    );
  } else {
    bodyChildren.push(
      React.createElement("div", { key: "empty", className: styles.emptyState },
        React.createElement("span", { className: styles.emptyIcon }, "\uD83D\uDCCB"),
        React.createElement("span", { className: styles.emptyText },
          "No retention labels have been applied yet."
        )
      )
    );
  }

  // Open Wizard button
  bodyChildren.push(
    React.createElement("button", {
      key: "wizard-btn",
      className: styles.wizardButton,
      onClick: props.onOpenWizard,
      type: "button",
    }, "\u2699\uFE0F Configure File Plan")
  );

  return React.createElement(HyperModal, {
    isOpen: props.isOpen,
    onClose: props.onClose,
    title: "File Plan Dashboard",
    size: "large",
  },
    React.createElement("div", { className: styles.dashboardBody }, bodyChildren)
  );
};

export default FilePlanDashboard;
