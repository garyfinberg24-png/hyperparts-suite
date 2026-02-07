import type { IHyperSpotlightEmployee } from "../models";

/**
 * Replace tokens in a message template with employee data.
 * Supported: {firstName}, {lastName}, {displayName}, {jobTitle}, {department}, {years}, {date}
 */
export function replaceTokens(message: string, employee: IHyperSpotlightEmployee): string {
  if (!message) return "";

  const nameParts = employee.displayName.split(" ");

  const replacements: Record<string, string> = {
    "{firstName}": employee.givenName || nameParts[0] || "",
    "{lastName}": employee.surname || nameParts[nameParts.length - 1] || "",
    "{displayName}": employee.displayName,
    "{jobTitle}": employee.jobTitle || "",
    "{department}": employee.department || "",
    "{years}": employee.yearsOfService !== undefined ? String(employee.yearsOfService) : "0",
    "{date}": new Date().toLocaleDateString(),
  };

  let result = message;
  Object.keys(replacements).forEach(function (token) {
    // Case-insensitive replace without dynamic regex
    const lowerToken = token.toLowerCase();
    const value = replacements[token];
    let idx = result.toLowerCase().indexOf(lowerToken);
    while (idx !== -1) {
      result = result.substring(0, idx) + value + result.substring(idx + token.length);
      idx = result.toLowerCase().indexOf(lowerToken, idx + value.length);
    }
  });

  return result;
}

/**
 * Check if a message string contains any {token} placeholders.
 */
export function hasTokens(message: string): boolean {
  return /\{[^}]+\}/g.test(message);
}

/**
 * Extract all token names from a message string (without braces).
 */
export function extractTokens(message: string): string[] {
  const matches = message.match(/\{[^}]+\}/g);
  if (!matches) return [];
  return matches.map(function (m) {
    return m.replace(/[{}]/g, "");
  });
}
