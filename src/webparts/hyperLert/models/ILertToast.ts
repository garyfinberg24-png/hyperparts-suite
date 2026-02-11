import type { LertSeverityV2, ToastPosition } from "./IHyperLertV2Enums";

/** A toast notification for in-page alerts */
export interface ILertToast {
  /** Unique toast ID */
  id: string;
  /** Alert ID that triggered this toast */
  alertId: string;
  /** Toast title */
  title: string;
  /** Toast message body */
  message: string;
  /** Severity determines styling */
  severity: LertSeverityV2;
  /** ISO timestamp of creation */
  timestamp: string;
  /** Auto-dismiss time in milliseconds (0 = never) */
  autoDismissMs: number;
  /** Screen position */
  position: ToastPosition;
  /** Available action buttons */
  actions: IToastAction[];
  /** Whether this toast is currently visible */
  isVisible: boolean;
}

/** Action button on a toast notification */
export interface IToastAction {
  /** Button label */
  label: string;
  /** Fluent icon name */
  icon: string;
  /** Action type to perform when clicked */
  actionType: "acknowledge" | "snooze" | "dismiss" | "viewDetail" | "resolve";
}

/** Toast system configuration */
export var DEFAULT_TOAST_CONFIG: IToastConfig = {
  maxVisible: 4,
  defaultPosition: "topRight",
  autoDismissMs: {
    critical: 0,
    high: 15000,
    medium: 10000,
    low: 7000,
    info: 5000,
  },
  stackSpacing: 8,
  animationDurationMs: 300,
};

/** Toast configuration interface */
export interface IToastConfig {
  /** Maximum number of visible toasts at once */
  maxVisible: number;
  /** Default toast position */
  defaultPosition: ToastPosition;
  /** Auto-dismiss time per severity level (0 = never auto-dismiss) */
  autoDismissMs: Record<LertSeverityV2, number>;
  /** Vertical spacing between stacked toasts in pixels */
  stackSpacing: number;
  /** Slide-in/out animation duration in milliseconds */
  animationDurationMs: number;
}

/** Get auto-dismiss duration for a severity level */
export function getAutoDismissMs(severity: LertSeverityV2): number {
  var ms = DEFAULT_TOAST_CONFIG.autoDismissMs[severity];
  return ms !== undefined ? ms : 5000;
}

/** Default toast actions by severity */
export function getDefaultToastActions(severity: LertSeverityV2): IToastAction[] {
  var actions: IToastAction[] = [
    { label: "View", icon: "View", actionType: "viewDetail" },
    { label: "Dismiss", icon: "Cancel", actionType: "dismiss" },
  ];
  if (severity === "critical" || severity === "high") {
    actions = [
      { label: "Acknowledge", icon: "CheckMark", actionType: "acknowledge" },
      { label: "View", icon: "View", actionType: "viewDetail" },
      { label: "Dismiss", icon: "Cancel", actionType: "dismiss" },
    ];
  }
  return actions;
}
