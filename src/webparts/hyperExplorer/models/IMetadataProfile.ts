// ============================================================
// HyperExplorer — Metadata Profile Upload Models
// ============================================================

/** Field type for metadata profile form */
export type MetadataFieldType = "text" | "select" | "date" | "textarea" | "tags" | "number";

/** A single metadata field definition */
export interface IMetadataField {
  /** Unique key for the field */
  key: string;
  /** Display label */
  label: string;
  /** Input type */
  type: MetadataFieldType;
  /** Whether the field is required */
  required: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Dropdown options (for select type) */
  options?: string[];
  /** Help/hint text below the field */
  hint?: string;
}

/** A metadata profile definition */
export interface IMetadataProfile {
  /** Unique key (e.g., "contract", "invoice") */
  key: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Emoji icon */
  icon: string;
  /** Fields to capture */
  fields: IMetadataField[];
}

/** State of the metadata upload wizard */
export interface IMetadataUploadState {
  /** Current wizard step (1-4) */
  step: number;
  /** Selected profile key */
  profileKey: string;
  /** File name (once selected) */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
  /** Captured metadata values */
  values: Record<string, string>;
}

/** Default wizard state */
export var DEFAULT_METADATA_UPLOAD_STATE: IMetadataUploadState = {
  step: 1,
  profileKey: "",
  fileName: "",
  fileSize: 0,
  values: {},
};

// ── Built-in Metadata Profiles ──

var CONTRACT_PROFILE: IMetadataProfile = {
  key: "contract",
  name: "Contract",
  description: "Legal agreements, NDAs, SOWs",
  icon: "\uD83D\uDCDC",
  fields: [
    { key: "contractTitle", label: "Contract Title", type: "text", required: true, placeholder: "e.g., Service Agreement with Contoso" },
    { key: "contractType", label: "Contract Type", type: "select", required: true, options: ["NDA", "SOW", "MSA", "Amendment", "Addendum", "License Agreement"] },
    { key: "counterparty", label: "Counterparty", type: "text", required: true, placeholder: "e.g., Contoso Ltd." },
    { key: "effectiveDate", label: "Effective Date", type: "date", required: true },
    { key: "expirationDate", label: "Expiration Date", type: "date", required: true },
    { key: "contractValue", label: "Contract Value", type: "text", required: true, placeholder: "e.g., $50,000" },
    { key: "department", label: "Department", type: "select", required: true, options: ["Legal", "Finance", "HR", "IT", "Operations", "Sales", "Marketing"] },
    { key: "signingAuthority", label: "Signing Authority", type: "text", required: true, placeholder: "e.g., Jane Smith, VP Legal" },
    { key: "tags", label: "Tags", type: "tags", required: false, placeholder: "Press Enter to add" },
    { key: "notes", label: "Notes", type: "textarea", required: false, placeholder: "Any additional context..." },
  ],
};

var INVOICE_PROFILE: IMetadataProfile = {
  key: "invoice",
  name: "Invoice / PO",
  description: "Invoices, purchase orders, receipts",
  icon: "\uD83D\uDCB0",
  fields: [
    { key: "invoiceNumber", label: "Invoice Number", type: "text", required: true, placeholder: "e.g., INV-2026-0042" },
    { key: "vendorName", label: "Vendor Name", type: "text", required: true, placeholder: "e.g., Acme Corp" },
    { key: "invoiceDate", label: "Invoice Date", type: "date", required: true },
    { key: "dueDate", label: "Due Date", type: "date", required: true },
    { key: "amount", label: "Amount", type: "text", required: true, placeholder: "e.g., $12,500.00" },
    { key: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"] },
    { key: "costCenter", label: "Cost Center", type: "text", required: false, placeholder: "e.g., CC-4500" },
    { key: "poReference", label: "PO Reference", type: "text", required: false, placeholder: "e.g., PO-2026-0099" },
  ],
};

var POLICY_PROFILE: IMetadataProfile = {
  key: "policy",
  name: "Policy Document",
  description: "HR policies, SOPs, guidelines",
  icon: "\uD83D\uDCDC",
  fields: [
    { key: "policyTitle", label: "Policy Title", type: "text", required: true, placeholder: "e.g., Remote Work Policy" },
    { key: "policyNumber", label: "Policy Number", type: "text", required: true, placeholder: "e.g., POL-HR-042" },
    { key: "effectiveDate", label: "Effective Date", type: "date", required: true },
    { key: "reviewDate", label: "Review Date", type: "date", required: true },
    { key: "ownerDepartment", label: "Owner Department", type: "select", required: true, options: ["HR", "Legal", "IT", "Finance", "Operations", "Compliance"] },
    { key: "approvalStatus", label: "Approval Status", type: "select", required: false, options: ["Draft", "Under Review", "Approved", "Superseded"] },
  ],
};

var CREATIVE_PROFILE: IMetadataProfile = {
  key: "creative",
  name: "Creative Asset",
  description: "Logos, banners, brand materials",
  icon: "\uD83C\uDFA8",
  fields: [
    { key: "assetName", label: "Asset Name", type: "text", required: true, placeholder: "e.g., Q4 Campaign Banner" },
    { key: "campaign", label: "Campaign", type: "text", required: true, placeholder: "e.g., Holiday 2026" },
    { key: "usageRights", label: "Usage Rights", type: "select", required: true, options: ["Internal Only", "External Approved", "Licensed (Limited)", "Public Domain"] },
    { key: "expirationDate", label: "Expiration Date", type: "date", required: false },
    { key: "brand", label: "Brand", type: "select", required: false, options: ["Corporate", "Sub-brand A", "Sub-brand B", "Partner Co-brand"] },
  ],
};

var REPORT_PROFILE: IMetadataProfile = {
  key: "report",
  name: "Report",
  description: "Financial, sales, analytics reports",
  icon: "\uD83D\uDCCA",
  fields: [
    { key: "reportTitle", label: "Report Title", type: "text", required: true, placeholder: "e.g., Monthly Sales Report" },
    { key: "reportType", label: "Report Type", type: "select", required: true, options: ["Financial", "Sales", "HR", "Operations", "Compliance", "Board"] },
    { key: "period", label: "Period", type: "select", required: true, options: ["Monthly", "Quarterly", "Annual", "Ad-hoc"] },
    { key: "periodDate", label: "Period Date", type: "date", required: true },
    { key: "department", label: "Department", type: "select", required: true, options: ["Finance", "Sales", "HR", "IT", "Operations", "Marketing"] },
    { key: "confidentiality", label: "Confidentiality", type: "select", required: true, options: ["Public", "Internal", "Confidential", "Restricted"] },
  ],
};

var GENERAL_PROFILE: IMetadataProfile = {
  key: "general",
  name: "General Document",
  description: "No specific profile required",
  icon: "\uD83D\uDCC4",
  fields: [
    { key: "documentTitle", label: "Document Title", type: "text", required: true, placeholder: "e.g., Meeting Notes" },
    { key: "category", label: "Category", type: "select", required: true, options: ["General", "Meeting Notes", "Presentation", "Spreadsheet", "Other"] },
    { key: "department", label: "Department", type: "select", required: false, options: ["Finance", "Sales", "HR", "IT", "Operations", "Marketing", "Legal"] },
  ],
};

/** All built-in metadata profiles */
export var METADATA_PROFILES: IMetadataProfile[] = [
  CONTRACT_PROFILE,
  INVOICE_PROFILE,
  POLICY_PROFILE,
  CREATIVE_PROFILE,
  REPORT_PROFILE,
  GENERAL_PROFILE,
];

/** Get a profile by key */
export function getMetadataProfile(key: string): IMetadataProfile | undefined {
  var result: IMetadataProfile | undefined;
  METADATA_PROFILES.forEach(function (p) {
    if (p.key === key) result = p;
  });
  return result;
}

/** Count required fields for a profile */
export function getRequiredFieldCount(profile: IMetadataProfile): number {
  var count = 0;
  profile.fields.forEach(function (f) {
    if (f.required) count++;
  });
  return count;
}

/** Validate metadata values against a profile */
export function validateMetadataValues(
  profile: IMetadataProfile,
  values: Record<string, string>
): Record<string, string> {
  var errors: Record<string, string> = {};
  profile.fields.forEach(function (f) {
    if (f.required && (!values[f.key] || values[f.key].length === 0)) {
      errors[f.key] = f.label + " is required";
    }
  });
  return errors;
}
