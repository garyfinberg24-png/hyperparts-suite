import type { IHyperRollupQuery, IHyperRollupQueryRule, IHyperRollupQueryGroup } from "../models";

/**
 * Converts a query rule to a KQL fragment.
 * Used when querying via SharePoint Search API.
 */
function ruleToKql(rule: IHyperRollupQueryRule): string {
  const field = rule.field;
  const value = rule.value;

  switch (rule.operator) {
    case "eq":
      return field + ":\"" + value + "\"";
    case "ne":
      return "-" + field + ":\"" + value + "\"";
    case "contains":
      return field + ":*" + value + "*";
    case "beginsWith":
      return field + ":" + value + "*";
    case "gt":
      return field + ">" + value;
    case "lt":
      return field + "<" + value;
    case "ge":
      return field + ">=" + value;
    case "le":
      return field + "<=" + value;
    default:
      return field + ":\"" + value + "\"";
  }
}

/**
 * Converts a query group to a KQL fragment joined by its conjunction.
 */
function groupToKql(group: IHyperRollupQueryGroup): string {
  if (group.rules.length === 0) return "";

  const parts: string[] = [];
  group.rules.forEach(function (rule) {
    if (rule.field && rule.value) {
      parts.push(ruleToKql(rule));
    }
  });

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return "(" + parts.join(" " + group.conjunction + " ") + ")";
}

/**
 * Converts a full query definition to a KQL string.
 * Returns empty string if query has no rules.
 */
export function buildKqlFromQuery(query: IHyperRollupQuery): string {
  if (!query || !query.groups || query.groups.length === 0) return "";

  const parts: string[] = [];
  query.groups.forEach(function (group) {
    const kql = groupToKql(group);
    if (kql) {
      parts.push(kql);
    }
  });

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return parts.join(" " + query.conjunction + " ");
}

/**
 * Converts a query rule to an OData filter fragment.
 * Used when querying via direct list REST API.
 */
function ruleToOData(rule: IHyperRollupQueryRule): string {
  const field = rule.field;
  const value = rule.value;

  switch (rule.operator) {
    case "eq":
      return field + " eq '" + value + "'";
    case "ne":
      return field + " ne '" + value + "'";
    case "gt":
      return field + " gt '" + value + "'";
    case "lt":
      return field + " lt '" + value + "'";
    case "ge":
      return field + " ge '" + value + "'";
    case "le":
      return field + " le '" + value + "'";
    case "contains":
      return "substringof('" + value + "'," + field + ")";
    case "beginsWith":
      return "startswith(" + field + ",'" + value + "')";
    default:
      return field + " eq '" + value + "'";
  }
}

/**
 * Converts a full query definition to an OData $filter string.
 */
export function buildODataFromQuery(query: IHyperRollupQuery): string {
  if (!query || !query.groups || query.groups.length === 0) return "";

  const groupParts: string[] = [];

  query.groups.forEach(function (group) {
    if (group.rules.length === 0) return;

    const ruleParts: string[] = [];
    group.rules.forEach(function (rule) {
      if (rule.field && rule.value) {
        ruleParts.push(ruleToOData(rule));
      }
    });

    if (ruleParts.length > 0) {
      const conj = group.conjunction === "OR" ? " or " : " and ";
      if (ruleParts.length === 1) {
        groupParts.push(ruleParts[0]);
      } else {
        groupParts.push("(" + ruleParts.join(conj) + ")");
      }
    }
  });

  if (groupParts.length === 0) return "";
  const topConj = query.conjunction === "OR" ? " or " : " and ";
  return groupParts.join(topConj);
}
