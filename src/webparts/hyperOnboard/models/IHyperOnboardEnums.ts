// ============================================================
// HyperOnboard — Enum types and display helpers
// ============================================================

export type OnboardLayoutMode = "dashboard" | "timeline" | "checklist" | "cards";
export type OnboardPhase = "preboarding" | "week1" | "month1" | "month3" | "month6";
export type OnboardTaskType = "action" | "learning" | "meeting" | "survey" | "document";
export type OnboardTaskPriority = "critical" | "high" | "normal" | "low";
export type OnboardTrackTemplate = "general" | "engineering" | "sales" | "hr" | "remote";

export var ALL_LAYOUT_MODES: OnboardLayoutMode[] = ["dashboard", "timeline", "checklist", "cards"];
export var ALL_PHASES: OnboardPhase[] = ["preboarding", "week1", "month1", "month3", "month6"];
export var ALL_TASK_TYPES: OnboardTaskType[] = ["action", "learning", "meeting", "survey", "document"];
export var ALL_TRACK_TEMPLATES: OnboardTrackTemplate[] = ["general", "engineering", "sales", "hr", "remote"];

export interface ITaskTypeConfig {
  type: OnboardTaskType;
  icon: string;
  label: string;
  color: string;
}

export var TASK_TYPE_ICONS: ITaskTypeConfig[] = [
  { type: "action", icon: "\u2705", label: "Action", color: "#0078d4" },
  { type: "learning", icon: "\uD83D\uDCDA", label: "Learning", color: "#107c10" },
  { type: "meeting", icon: "\uD83D\uDC65", label: "Meeting", color: "#8764b8" },
  { type: "survey", icon: "\uD83D\uDCCB", label: "Survey", color: "#e3008c" },
  { type: "document", icon: "\uD83D\uDCC4", label: "Document", color: "#ca5010" },
];

export interface IPriorityConfig {
  priority: OnboardTaskPriority;
  label: string;
  color: string;
  weight: number;
}

export var PRIORITY_CONFIGS: IPriorityConfig[] = [
  { priority: "critical", label: "Critical", color: "#d13438", weight: 4 },
  { priority: "high", label: "High", color: "#ca5010", weight: 3 },
  { priority: "normal", label: "Normal", color: "#0078d4", weight: 2 },
  { priority: "low", label: "Low", color: "#6b6b6b", weight: 1 },
];

export function getLayoutDisplayName(mode: OnboardLayoutMode): string {
  var LABELS: Record<string, string> = {
    dashboard: "Dashboard",
    timeline: "Timeline",
    checklist: "Checklist",
    cards: "Cards",
  };
  return LABELS[mode] || mode;
}

export function getPhaseDisplayName(phase: OnboardPhase): string {
  var LABELS: Record<string, string> = {
    preboarding: "Preboarding",
    week1: "Week 1",
    month1: "Month 1",
    month3: "Month 3",
    month6: "Month 6",
  };
  return LABELS[phase] || phase;
}

export function getTaskTypeIcon(type: OnboardTaskType): string {
  var found: ITaskTypeConfig | undefined;
  TASK_TYPE_ICONS.forEach(function (cfg) {
    if (cfg.type === type) {
      found = cfg;
    }
  });
  return found ? found.icon : "";
}

export function getTrackDisplayName(template: OnboardTrackTemplate): string {
  var LABELS: Record<string, string> = {
    general: "General",
    engineering: "Engineering",
    sales: "Sales",
    hr: "Human Resources",
    remote: "Remote",
  };
  return LABELS[template] || template;
}
