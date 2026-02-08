/** A manually promoted / best-bet result */
export interface IPromotedResult {
  /** Unique identifier */
  id: string;
  /** Keywords that trigger this promoted result */
  keywords: string[];
  /** Title to display */
  title: string;
  /** Optional description */
  description?: string;
  /** URL to navigate to */
  url: string;
  /** Fabric icon name */
  iconName?: string;
  /** Whether to open link in a new tab */
  openInNewTab?: boolean;
}

/** Parse promoted results from JSON string */
export function parsePromotedResults(json: string): IPromotedResult[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed as IPromotedResult[] : [];
  } catch {
    return [];
  }
}

/** Stringify promoted results to JSON */
export function stringifyPromotedResults(results: IPromotedResult[]): string {
  return JSON.stringify(results, undefined, 2);
}
