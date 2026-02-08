import type { DeliveryChannel } from "./IHyperLertEnums";

/** A notification action for an alert rule */
export interface IAlertAction {
  /** Delivery channel */
  channel: DeliveryChannel;
  /** Whether this action is enabled */
  enabled: boolean;
  /** Email recipients (comma-separated) */
  recipients: string;
  /** Email subject line */
  subject: string;
  /** Email body template (HTML with {{token}} placeholders) */
  bodyTemplate: string;
  /** Teams recipients (comma-separated emails) */
  teamsRecipients: string;
  /** In-page banner message */
  bannerMessage: string;
  /** Banner auto-dismiss duration in seconds (0 = until manually dismissed) */
  bannerDuration: number;
}

/** Default email action */
export const DEFAULT_EMAIL_ACTION: IAlertAction = {
  channel: "email",
  enabled: true,
  recipients: "",
  subject: "Alert: {{ruleName}} — {{severity}}",
  bodyTemplate: "",
  teamsRecipients: "",
  bannerMessage: "",
  bannerDuration: 0,
};

/** Default Teams action */
export const DEFAULT_TEAMS_ACTION: IAlertAction = {
  channel: "teams",
  enabled: false,
  recipients: "",
  subject: "",
  bodyTemplate: "",
  teamsRecipients: "",
  bannerMessage: "",
  bannerDuration: 0,
};

/** Default banner action */
export const DEFAULT_BANNER_ACTION: IAlertAction = {
  channel: "banner",
  enabled: true,
  recipients: "",
  subject: "",
  bodyTemplate: "",
  teamsRecipients: "",
  bannerMessage: "{{ruleName}}: {{matchCount}} item(s) matched",
  bannerDuration: 30,
};

/** Parse actions from JSON string */
export function parseActions(json: string | undefined): IAlertAction[] {
  if (!json) return [DEFAULT_EMAIL_ACTION, DEFAULT_TEAMS_ACTION, DEFAULT_BANNER_ACTION];
  try {
    const parsed = JSON.parse(json) as IAlertAction[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [DEFAULT_EMAIL_ACTION, DEFAULT_TEAMS_ACTION, DEFAULT_BANNER_ACTION];
  } catch {
    return [DEFAULT_EMAIL_ACTION, DEFAULT_TEAMS_ACTION, DEFAULT_BANNER_ACTION];
  }
}

/** Stringify actions to JSON for storage */
export function stringifyActions(actions: IAlertAction[]): string {
  return JSON.stringify(actions);
}
