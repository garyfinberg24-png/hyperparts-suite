// ============================================================
// HyperExplorer — File Plan & MS Purview Retention Models
// ============================================================

/** Retention label from MS Purview (Graph API: GET /security/labels/retentionLabels) */
export interface IRetentionLabel {
  id: string;
  displayName: string;
  descriptionForAdmins: string;
  descriptionForUsers: string;
  isInUse: boolean;
  /** Retention duration in days (0 = indefinite) */
  retentionDuration: number;
  actionAfterRetentionPeriod: RetentionAction;
  behaviorDuringRetentionPeriod: RetentionBehavior;
  defaultRecordBehavior: RecordBehavior;
}

/** What happens after the retention period expires */
export type RetentionAction = "none" | "delete" | "startDispositionReview";

/** How content is treated during retention */
export type RetentionBehavior = "retain" | "retainAsRecord" | "retainAsRegulatoryRecord";

/** Whether records start locked or unlocked */
export type RecordBehavior = "startLocked" | "startUnlocked";

/** File plan descriptor metadata (MS Purview records management) */
export interface IFilePlanDescriptor {
  functionOrActivity?: string;
  referenceId?: string;
  department?: string;
  category?: string;
  subCategory?: string;
  authorityType?: string;
  provision?: string;
  citation?: string;
}

/** Auto-classification rule — applies a label when conditions match */
export interface IFilePlanRule {
  id: string;
  name: string;
  /** Which retention label to apply */
  labelId: string;
  conditions: IFilePlanCondition[];
  enabled: boolean;
}

/** Single condition within an auto-classification rule */
export interface IFilePlanCondition {
  field: FilePlanConditionField;
  operator: FilePlanConditionOperator;
  value: string;
}

export type FilePlanConditionField =
  | "fileType"
  | "contentType"
  | "fileName"
  | "folderPath"
  | "createdBy"
  | "size";

export type FilePlanConditionOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan";

/** Compliance status for a file (applied retention label + descriptors) */
export interface IComplianceStatus {
  fileId: string;
  labelId?: string;
  labelName?: string;
  appliedDate?: string;
  appliedBy?: string;
  /** ISO timestamp when retention expires (undefined if indefinite) */
  expirationDate?: string;
  isRecord: boolean;
  isLocked: boolean;
  descriptors?: IFilePlanDescriptor;
}

/** Batch label assignment operation */
export interface IRetentionLabelAssignment {
  fileId: string;
  labelId: string;
  descriptors?: IFilePlanDescriptor;
}

// ── Wizard State ──

export interface IFilePlanWizardScope {
  applyToAllFiles: boolean;
  /** Folder relative paths to include (empty = root) */
  includeFolders: string[];
  /** File extensions to include (empty = all) */
  fileTypeFilter: string[];
}

export interface IFilePlanWizardLabels {
  /** Which labels to make available */
  selectedLabelIds: string[];
  /** Auto-apply this label on upload */
  defaultLabelId?: string;
  /** Block uploads without a label */
  requireLabel: boolean;
}

export interface IFilePlanWizardState {
  scope: IFilePlanWizardScope;
  labels: IFilePlanWizardLabels;
  descriptors: IFilePlanDescriptor;
  rules: IFilePlanRule[];
}

/** Default wizard state */
export var DEFAULT_FILE_PLAN_WIZARD_STATE: IFilePlanWizardState = {
  scope: {
    applyToAllFiles: true,
    includeFolders: [],
    fileTypeFilter: [],
  },
  labels: {
    selectedLabelIds: [],
    defaultLabelId: undefined,
    requireLabel: false,
  },
  descriptors: {},
  rules: [],
};

/** Human-readable label for retention duration */
export function formatRetentionDuration(days: number): string {
  if (days === 0) return "Indefinite";
  if (days < 30) return days + " days";
  if (days < 365) return Math.round(days / 30) + " months";
  var years = Math.round(days / 365);
  return years + (years === 1 ? " year" : " years");
}

/** Human-readable label for retention action */
export function formatRetentionAction(action: RetentionAction): string {
  if (action === "none") return "No action";
  if (action === "delete") return "Delete automatically";
  if (action === "startDispositionReview") return "Start disposition review";
  return action;
}

/** Human-readable label for retention behavior */
export function formatRetentionBehavior(behavior: RetentionBehavior): string {
  if (behavior === "retain") return "Retain";
  if (behavior === "retainAsRecord") return "Retain as record";
  if (behavior === "retainAsRegulatoryRecord") return "Retain as regulatory record";
  return behavior;
}
