/** Comparison operators for query rules */
export type QueryOperator =
  | "eq"
  | "ne"
  | "gt"
  | "lt"
  | "ge"
  | "le"
  | "contains"
  | "beginsWith";

/** A single query rule: field + operator + value */
export interface IHyperRollupQueryRule {
  id: string;
  field: string;
  operator: QueryOperator;
  value: string;
}

/** A group of rules joined by AND or OR */
export interface IHyperRollupQueryGroup {
  id: string;
  conjunction: "AND" | "OR";
  rules: IHyperRollupQueryRule[];
}

/** Top-level query: groups joined by conjunction */
export interface IHyperRollupQuery {
  conjunction: "AND" | "OR";
  groups: IHyperRollupQueryGroup[];
}

/** Empty query (no filters) */
export const DEFAULT_QUERY: IHyperRollupQuery = {
  conjunction: "AND",
  groups: [],
};

/**
 * Parse query from JSON string stored in web part properties.
 * Returns default empty query if parsing fails.
 */
export function parseQuery(json: string | undefined): IHyperRollupQuery {
  if (!json) return DEFAULT_QUERY;
  try {
    return JSON.parse(json) as IHyperRollupQuery;
  } catch {
    return DEFAULT_QUERY;
  }
}
