/** Column data types */
export type ColumnType = "text" | "number" | "date" | "person" | "choice" | "url" | "boolean";

/** Formatting condition operators */
export type FormattingCondition =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "contains"
  | "isEmpty"
  | "isNotEmpty";

/** Formatting style types */
export type FormattingStyle =
  | "backgroundColor"
  | "textColor"
  | "icon"
  | "progressBar"
  | "badge";

/** A single column formatting rule */
export interface IColumnFormattingRule {
  id: string;
  condition: FormattingCondition;
  value?: string;
  style: FormattingStyle;
  /** Color hex for bg/text, icon name for icon, field name for progressBar */
  styleValue: string;
}

/** Column configuration for the rollup view */
export interface IHyperRollupColumn {
  /** Unique column ID */
  id: string;
  /** Internal field name from SharePoint */
  fieldName: string;
  /** Display label in column header */
  displayName: string;
  /** Data type for rendering and formatting */
  type: ColumnType;
  /** Whether this column is visible */
  visible: boolean;
  /** Whether users can sort by this column */
  sortable: boolean;
  /** Fixed pixel width for table view (undefined = auto) */
  width?: number;
  /** Conditional formatting rules applied in order */
  formattingRules?: IColumnFormattingRule[];
}

/** Default columns for a typical document library rollup */
export const DEFAULT_COLUMNS: IHyperRollupColumn[] = [
  { id: "col-title", fieldName: "title", displayName: "Title", type: "text", visible: true, sortable: true },
  { id: "col-author", fieldName: "author", displayName: "Author", type: "person", visible: true, sortable: true },
  { id: "col-modified", fieldName: "modified", displayName: "Modified", type: "date", visible: true, sortable: true },
  { id: "col-filetype", fieldName: "fileType", displayName: "Type", type: "text", visible: true, sortable: true },
  { id: "col-source", fieldName: "sourceListName", displayName: "Source", type: "text", visible: true, sortable: true },
];

/**
 * Parse columns from JSON string stored in web part properties.
 * Returns default columns if parsing fails.
 */
export function parseColumns(json: string | undefined): IHyperRollupColumn[] {
  if (!json) return DEFAULT_COLUMNS;
  try {
    const parsed = JSON.parse(json) as IHyperRollupColumn[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_COLUMNS;
  } catch {
    return DEFAULT_COLUMNS;
  }
}

/** Result of evaluating a formatting rule against a cell value */
export interface IFormattingResult {
  backgroundColor?: string;
  textColor?: string;
  iconName?: string;
  progressPercent?: number;
  badgeText?: string;
  badgeColor?: string;
}
