import type { EscalationTier } from "./IHyperLertV2Enums";

/** A single step in an escalation policy */
export interface IEscalationStep {
  /** Escalation tier */
  tier: EscalationTier;
  /** Wait time in minutes before escalating to this tier */
  waitMinutes: number;
  /** Email addresses to notify at this tier */
  recipients: string[];
  /** Whether to send a Teams notification */
  notifyTeams: boolean;
}

/** An escalation policy with ordered steps */
export interface IEscalationPolicy {
  /** Unique policy ID */
  id: string;
  /** Display name */
  name: string;
  /** Description of this policy */
  description: string;
  /** Whether this policy is enabled */
  enabled: boolean;
  /** Ordered escalation steps */
  steps: IEscalationStep[];
}

/** Default 3-tier escalation policy */
export var DEFAULT_ESCALATION_POLICY: IEscalationPolicy = {
  id: "esc-default",
  name: "Default Escalation",
  description: "3-tier escalation: Primary (5m) \u2192 Secondary (15m) \u2192 Manager (30m)",
  enabled: false,
  steps: [
    { tier: "primary", waitMinutes: 5, recipients: [], notifyTeams: true },
    { tier: "secondary", waitMinutes: 15, recipients: [], notifyTeams: true },
    { tier: "manager", waitMinutes: 30, recipients: [], notifyTeams: true },
  ],
};

/** Parse an escalation policy from JSON string */
export function parseEscalationPolicy(json: string | undefined): IEscalationPolicy {
  if (!json) return DEFAULT_ESCALATION_POLICY;
  try {
    var parsed = JSON.parse(json) as IEscalationPolicy;
    if (parsed && parsed.id && Array.isArray(parsed.steps)) return parsed;
    return DEFAULT_ESCALATION_POLICY;
  } catch {
    return DEFAULT_ESCALATION_POLICY;
  }
}

/** Stringify an escalation policy to JSON for property storage */
export function stringifyEscalationPolicy(policy: IEscalationPolicy): string {
  return JSON.stringify(policy);
}
