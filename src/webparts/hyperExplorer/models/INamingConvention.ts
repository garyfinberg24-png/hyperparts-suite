// ============================================================
// HyperExplorer — File Plan Naming & Numbering Convention
// ============================================================

/** Token types that can appear in a naming pattern */
export type NamingToken = "department" | "year" | "sequence" | "description" | "category";

/** Separator character between tokens */
export type NamingSeparator = "-" | "_" | "." | " ";

/** Year format in the naming convention */
export type YearFormat = "4" | "2";

/** A naming convention configuration */
export interface INamingConvention {
  /** Pattern template key */
  pattern: NamingPattern;
  /** Separator between tokens */
  separator: NamingSeparator;
  /** Department code (e.g., "FIN", "HR") */
  departmentCode: string;
  /** Year format: 4-digit or 2-digit */
  yearFormat: YearFormat;
  /** Number of digits in sequence number */
  sequenceDigits: number;
  /** Next sequence number */
  nextNumber: number;
  /** Whether to auto-rename files on upload */
  autoRename: boolean;
}

/** Pre-defined naming patterns */
export type NamingPattern =
  | "dept-year-seq-desc"
  | "cat-dept-seq"
  | "year-dept-seq-desc"
  | "dept-cat-year-seq"
  | "custom";

/** Pattern option for display in dropdown */
export interface INamingPatternOption {
  key: NamingPattern;
  label: string;
  template: string;
}

/** Available department codes */
export var DEPARTMENT_CODES: string[] = [
  "FIN", "HR", "MKT", "LEG", "IT", "OPS", "EXE",
];

/** Available naming patterns */
export var NAMING_PATTERNS: INamingPatternOption[] = [
  { key: "dept-year-seq-desc", label: "{Department}-{Year}-{Sequence}-{Description}", template: "{dept}{sep}{year}{sep}{seq}{sep}{desc}" },
  { key: "cat-dept-seq", label: "{Category}-{Department}-{Sequence}", template: "{cat}{sep}{dept}{sep}{seq}" },
  { key: "year-dept-seq-desc", label: "{Year}-{Department}-{Sequence}-{Description}", template: "{year}{sep}{dept}{sep}{seq}{sep}{desc}" },
  { key: "dept-cat-year-seq", label: "{Department}-{Category}-{Year}-{Sequence}", template: "{dept}{sep}{cat}{sep}{year}{sep}{seq}" },
  { key: "custom", label: "Custom Pattern...", template: "{custom}" },
];

/** Default naming convention values */
export var DEFAULT_NAMING_CONVENTION: INamingConvention = {
  pattern: "dept-year-seq-desc",
  separator: "-",
  departmentCode: "FIN",
  yearFormat: "4",
  sequenceDigits: 4,
  nextNumber: 1,
  autoRename: true,
};

/** Pad a number with leading zeros */
function padNumber(num: number, digits: number): string {
  var s = String(num);
  while (s.length < digits) {
    s = "0" + s;
  }
  return s;
}

/** Get the current year string based on format */
function getYearString(format: YearFormat): string {
  var year = new Date().getFullYear();
  return format === "4" ? String(year) : String(year).substring(2);
}

/** Generate a preview file name from a naming convention */
export function generatePreviewName(
  convention: INamingConvention,
  description: string,
  extension: string,
  sequenceOffset: number
): string {
  var dept = convention.departmentCode;
  var year = getYearString(convention.yearFormat);
  var seq = padNumber(convention.nextNumber + sequenceOffset, convention.sequenceDigits);
  var sep = convention.separator;

  switch (convention.pattern) {
    case "dept-year-seq-desc":
      return dept + sep + year + sep + seq + sep + description + "." + extension;
    case "cat-dept-seq":
      return "DOC" + sep + dept + sep + seq + "." + extension;
    case "year-dept-seq-desc":
      return year + sep + dept + sep + seq + sep + description + "." + extension;
    case "dept-cat-year-seq":
      return dept + sep + "DOC" + sep + year + sep + seq + "." + extension;
    default:
      return dept + sep + year + sep + seq + sep + description + "." + extension;
  }
}

/** Generate the sequence prefix (without description) for preview */
export function generateSequencePrefix(
  convention: INamingConvention,
  sequenceOffset: number
): string {
  var dept = convention.departmentCode;
  var year = getYearString(convention.yearFormat);
  var seq = padNumber(convention.nextNumber + sequenceOffset, convention.sequenceDigits);
  var sep = convention.separator;

  return dept + sep + year + sep + seq;
}
