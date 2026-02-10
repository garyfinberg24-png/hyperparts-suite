import * as React from "react";
import type { IComplianceStatus } from "../../models";
import styles from "./ComplianceBadge.module.scss";

export interface IComplianceBadgeProps {
  status?: IComplianceStatus;
  /** Show icon only (for small cards) */
  compact?: boolean;
}

/** Determine days until expiration */
function getDaysUntilExpiry(expirationDate: string): number {
  var now = Date.now();
  var expiry = new Date(expirationDate).getTime();
  return Math.ceil((expiry - now) / 86400000);
}

/**
 * Small badge component showing retention label compliance status.
 *
 * 5 visual states:
 * - Unlabeled (gray)
 * - Retain (blue) — standard retention, not a record
 * - Record (green+lock) — marked as record
 * - Regulatory (red+lock) — regulatory record, locked
 * - Expiring (orange+hourglass) — retention expires within 30 days
 */
var ComplianceBadge: React.FC<IComplianceBadgeProps> = function (props) {
  var status = props.status;
  var compact = props.compact;

  // Determine state
  var icon: string;
  var label: string;
  var colorClass: string;

  if (!status || !status.labelId) {
    // Unlabeled
    icon = "\u2013"; // en dash
    label = "No Label";
    colorClass = styles.badgeUnlabeled;
  } else if (status.expirationDate && getDaysUntilExpiry(status.expirationDate) <= 30) {
    // Expiring soon
    var days = getDaysUntilExpiry(status.expirationDate);
    icon = "\u23F3"; // hourglass
    label = days <= 0 ? "Expired" : days + "d left";
    colorClass = styles.badgeExpiring;
  } else if (status.isLocked) {
    // Regulatory record (locked)
    icon = "\uD83D\uDD12"; // lock
    label = status.labelName || "Locked";
    colorClass = styles.badgeRegulatory;
  } else if (status.isRecord) {
    // Record (not locked)
    icon = "\uD83D\uDD10"; // closed lock with key
    label = status.labelName || "Record";
    colorClass = styles.badgeRecord;
  } else {
    // Standard retention
    icon = "\uD83C\uDFF7\uFE0F"; // label tag
    label = status.labelName || "Labeled";
    colorClass = styles.badgeRetain;
  }

  var badgeClass = compact
    ? colorClass + " " + styles.badgeCompact
    : colorClass + " " + styles.badge;

  return React.createElement("span", {
    className: badgeClass,
    role: "status",
    "aria-label": status && status.labelName
      ? "Retention label: " + status.labelName
      : "No retention label",
    title: status && status.labelName
      ? status.labelName + (status.expirationDate ? " (expires " + new Date(status.expirationDate).toLocaleDateString() + ")" : "")
      : "No retention label applied",
  },
    React.createElement("span", { className: styles.badgeIcon, "aria-hidden": "true" }, icon),
    !compact
      ? React.createElement("span", { className: styles.badgeLabel }, label)
      : undefined
  );
};

export default ComplianceBadge;
