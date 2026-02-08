import type { AlertSeverity, AlertStatus } from "../models";

/**
 * Format an ISO timestamp for history display.
 * Returns a human-readable relative or absolute string.
 */
export function formatHistoryTimestamp(isoString: string): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return diffMinutes + "m ago";
    if (diffHours < 24) return diffHours + "h ago";
    if (diffDays < 7) return diffDays + "d ago";

    // Fall back to locale date string
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoString;
  }
}

/**
 * Get the CSS color for a severity level.
 */
export function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case "info": return "#0078d4";
    case "warning": return "#ffaa44";
    case "critical": return "#d13438";
    case "success": return "#107c10";
    default: return "#605e5c";
  }
}

/**
 * Get the Fluent UI icon name for a severity level.
 */
export function getSeverityIcon(severity: AlertSeverity): string {
  switch (severity) {
    case "info": return "Info";
    case "warning": return "Warning";
    case "critical": return "ErrorBadge";
    case "success": return "CompletedSolid";
    default: return "StatusCircleQuestionMark";
  }
}

/**
 * Get a human-readable label for an alert status.
 */
export function getStatusLabel(status: AlertStatus | string): string {
  switch (status) {
    case "active": return "Active";
    case "snoozed": return "Snoozed";
    case "acknowledged": return "Acknowledged";
    case "expired": return "Expired";
    case "disabled": return "Disabled";
    default: return String(status);
  }
}

/**
 * Get the CSS color for a status.
 */
export function getStatusColor(status: AlertStatus | string): string {
  switch (status) {
    case "active": return "#107c10";
    case "snoozed": return "#ffaa44";
    case "acknowledged": return "#8a8886";
    case "expired": return "#c8c6c4";
    case "disabled": return "#a19f9d";
    default: return "#605e5c";
  }
}

/**
 * Check if a rule is currently snoozed based on snoozedUntil timestamp.
 */
export function isSnoozed(snoozedUntil: string): boolean {
  if (!snoozedUntil) return false;
  try {
    const until = new Date(snoozedUntil);
    return until.getTime() > Date.now();
  } catch {
    return false;
  }
}

/**
 * Check if a rule is within its active hours window.
 * Returns true if active hours are not configured (always active) or if current time is within range.
 */
export function isWithinActiveHours(activeHoursStart: string, activeHoursEnd: string): boolean {
  if (!activeHoursStart || !activeHoursEnd) return true;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startParts = activeHoursStart.split(":");
  const endParts = activeHoursEnd.split(":");
  if (startParts.length < 2 || endParts.length < 2) return true;

  const startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
  const endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);

  if (isNaN(startMinutes) || isNaN(endMinutes)) return true;

  // Handle overnight ranges (e.g., 22:00 to 06:00)
  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
  return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
}

/**
 * Check if a rule is within cooldown based on last triggered time.
 */
export function isWithinCooldown(lastTriggered: string, cooldownMinutes: number): boolean {
  if (!lastTriggered || cooldownMinutes <= 0) return false;
  try {
    const lastTime = new Date(lastTriggered).getTime();
    const cooldownMs = cooldownMinutes * 60000;
    return Date.now() - lastTime < cooldownMs;
  } catch {
    return false;
  }
}
