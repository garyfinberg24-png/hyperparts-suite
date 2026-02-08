/** Available template tokens for alert notifications */
export const TOKEN_LIST: string[] = [
  "{{ruleName}}",
  "{{severity}}",
  "{{fieldName}}",
  "{{fieldValue}}",
  "{{threshold}}",
  "{{itemTitle}}",
  "{{listName}}",
  "{{siteUrl}}",
  "{{timestamp}}",
  "{{matchCount}}",
];

/** Token values map */
export interface INotificationTokens {
  ruleName: string;
  severity: string;
  fieldName: string;
  fieldValue: string;
  threshold: string;
  itemTitle: string;
  listName: string;
  siteUrl: string;
  timestamp: string;
  matchCount: string;
}

/** Default notification tokens (empty) */
export const DEFAULT_TOKENS: INotificationTokens = {
  ruleName: "",
  severity: "",
  fieldName: "",
  fieldValue: "",
  threshold: "",
  itemTitle: "",
  listName: "",
  siteUrl: "",
  timestamp: "",
  matchCount: "0",
};

/** Default HTML email template */
export const DEFAULT_EMAIL_TEMPLATE: string = [
  "<!DOCTYPE html>",
  "<html><head><meta charset=\"utf-8\"></head>",
  "<body style=\"font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px;\">",
  "<div style=\"max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;\">",
  "<div style=\"background: #0078d4; color: white; padding: 16px 24px;\">",
  "<h2 style=\"margin: 0;\">HyperLert Alert: {{ruleName}}</h2>",
  "</div>",
  "<div style=\"padding: 24px;\">",
  "<table style=\"width: 100%; border-collapse: collapse;\">",
  "<tr><td style=\"padding: 8px 0; font-weight: 600;\">Severity:</td><td style=\"padding: 8px 0;\">{{severity}}</td></tr>",
  "<tr><td style=\"padding: 8px 0; font-weight: 600;\">Field:</td><td style=\"padding: 8px 0;\">{{fieldName}}</td></tr>",
  "<tr><td style=\"padding: 8px 0; font-weight: 600;\">Value:</td><td style=\"padding: 8px 0;\">{{fieldValue}}</td></tr>",
  "<tr><td style=\"padding: 8px 0; font-weight: 600;\">Threshold:</td><td style=\"padding: 8px 0;\">{{threshold}}</td></tr>",
  "<tr><td style=\"padding: 8px 0; font-weight: 600;\">Items Matched:</td><td style=\"padding: 8px 0;\">{{matchCount}}</td></tr>",
  "<tr><td style=\"padding: 8px 0; font-weight: 600;\">Item:</td><td style=\"padding: 8px 0;\">{{itemTitle}}</td></tr>",
  "<tr><td style=\"padding: 8px 0; font-weight: 600;\">Source:</td><td style=\"padding: 8px 0;\">{{listName}}</td></tr>",
  "<tr><td style=\"padding: 8px 0; font-weight: 600;\">Time:</td><td style=\"padding: 8px 0;\">{{timestamp}}</td></tr>",
  "</table>",
  "</div>",
  "<div style=\"background: #f4f4f4; padding: 12px 24px; font-size: 12px; color: #666;\">",
  "Sent by HyperLert &mdash; HyperParts Suite",
  "</div>",
  "</div>",
  "</body></html>",
].join("\n");

/**
 * Replace {{token}} placeholders in a template with actual values.
 */
export function replaceTokens(template: string, tokens: INotificationTokens): string {
  let result = template;
  result = result.split("{{ruleName}}").join(tokens.ruleName);
  result = result.split("{{severity}}").join(tokens.severity);
  result = result.split("{{fieldName}}").join(tokens.fieldName);
  result = result.split("{{fieldValue}}").join(tokens.fieldValue);
  result = result.split("{{threshold}}").join(tokens.threshold);
  result = result.split("{{itemTitle}}").join(tokens.itemTitle);
  result = result.split("{{listName}}").join(tokens.listName);
  result = result.split("{{siteUrl}}").join(tokens.siteUrl);
  result = result.split("{{timestamp}}").join(tokens.timestamp);
  result = result.split("{{matchCount}}").join(tokens.matchCount);
  return result;
}

/**
 * Build a full HTML email body from a template and tokens.
 * If template is empty, uses DEFAULT_EMAIL_TEMPLATE.
 */
export function buildEmailHtml(template: string, tokens: INotificationTokens): string {
  const tpl = template || DEFAULT_EMAIL_TEMPLATE;
  return replaceTokens(tpl, tokens);
}

/**
 * Build a plain-text Teams message from tokens.
 */
export function buildTeamsMessage(tokens: INotificationTokens): string {
  const parts: string[] = [];
  parts.push("**HyperLert Alert: " + tokens.ruleName + "**");
  parts.push("");
  parts.push("- **Severity:** " + tokens.severity);
  if (tokens.fieldName) {
    parts.push("- **Field:** " + tokens.fieldName + " = " + tokens.fieldValue);
  }
  if (tokens.threshold) {
    parts.push("- **Threshold:** " + tokens.threshold);
  }
  parts.push("- **Items Matched:** " + tokens.matchCount);
  if (tokens.itemTitle) {
    parts.push("- **Item:** " + tokens.itemTitle);
  }
  if (tokens.listName) {
    parts.push("- **Source:** " + tokens.listName);
  }
  parts.push("- **Time:** " + tokens.timestamp);
  return parts.join("\n");
}

/**
 * Build sample tokens for email preview with placeholder values.
 */
export function buildSampleTokens(): INotificationTokens {
  return {
    ruleName: "Sample Alert Rule",
    severity: "warning",
    fieldName: "Budget",
    fieldValue: "150000",
    threshold: "100000",
    itemTitle: "Project Alpha",
    listName: "Projects",
    siteUrl: "https://contoso.sharepoint.com/sites/demo",
    timestamp: new Date().toISOString(),
    matchCount: "3",
  };
}
