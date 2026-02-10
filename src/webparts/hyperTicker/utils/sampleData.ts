import type { ITickerItem } from "../models";
import { generateTickerItemId } from "../models";
import type { TickerSeverity } from "../models";
import type { TickerMessageType } from "../models/ITickerMessageType";

/** Demo preset identifiers */
export type DemoTickerPresetId = "companyNews" | "itAlerts" | "hrUpdates" | "emergencyDrill" | "mixedFeed";

export interface IDemoTickerPreset {
  id: DemoTickerPresetId;
  label: string;
  description: string;
  icon: string;
}

/** Available demo presets */
export const DEMO_TICKER_PRESETS: IDemoTickerPreset[] = [
  { id: "companyNews", label: "Company News", description: "8 sample news items", icon: "\uD83D\uDCF0" },
  { id: "itAlerts", label: "IT Service Desk", description: "8 sample IT alerts", icon: "\uD83D\uDDA5\uFE0F" },
  { id: "hrUpdates", label: "HR Updates", description: "8 sample HR updates", icon: "\uD83D\uDC65" },
  { id: "emergencyDrill", label: "Emergency Drill", description: "6 sample emergency items", icon: "\uD83D\uDEA8" },
  { id: "mixedFeed", label: "Mixed Feed", description: "10 mixed items from all sources", icon: "\uD83C\uDF10" },
];

/** Helper to create a sample ticker item */
function makeItem(
  title: string,
  iconName: string,
  severity: TickerSeverity,
  messageType: TickerMessageType,
  category: string,
  opts?: {
    url?: string;
    description?: string;
  }
): ITickerItem {
  return {
    id: generateTickerItemId(),
    title: title,
    url: opts && opts.url ? opts.url : "",
    iconName: iconName,
    severity: severity,
    dataSource: "manual",
    expiresAt: "",
    audienceGroups: [],
    isActive: true,
    sortOrder: 0,
    messageType: messageType,
    description: opts && opts.description ? opts.description : "",
    startsAt: "",
    recurPattern: "none",
    category: category,
    templateId: "",
    acknowledged: false,
    dismissed: false,
  };
}

function getCompanyNews(): ITickerItem[] {
  return [
    makeItem("Q4 Earnings Report: Revenue up 12% year-over-year", "Money", "normal", "news", "Finance", { description: "Strong performance across all business segments" }),
    makeItem("New CEO Message: Strategic priorities for 2026", "People", "normal", "news", "Leadership", { description: "Focusing on innovation, sustainability, and employee development" }),
    makeItem("Customer satisfaction score reaches all-time high of 94%", "Like", "normal", "kpi", "Operations"),
    makeItem("Annual company retreat scheduled for April 15-18", "Calendar", "normal", "event", "Culture"),
    makeItem("New partnership with Contoso Ltd. announced", "Handshake", "normal", "news", "Business"),
    makeItem("Employee referral bonus increased to $5,000", "GiftCard", "normal", "notification", "HR"),
    makeItem("Company wins 'Best Workplace 2026' award", "Trophy", "normal", "news", "Recognition"),
    makeItem("Quarterly town hall recording now available on the intranet", "Video", "normal", "notification", "Communications"),
  ];
}

function getItAlerts(): ITickerItem[] {
  return [
    makeItem("Scheduled maintenance: Exchange Online, Sat 2am-6am EST", "Settings", "warning", "alert", "Maintenance", { description: "Email and calendar services will be unavailable during this window" }),
    makeItem("VPN connectivity issue resolved \u2014 all regions operational", "PlugConnected", "normal", "notification", "Network"),
    makeItem("New MFA policy: Phishing-resistant auth required by March 1st", "Lock", "warning", "alert", "Security", { description: "Enroll your hardware security key before the deadline" }),
    makeItem("System status: All services operational \u2014 99.97% uptime", "CheckMark", "normal", "kpi", "Status"),
    makeItem("Windows 11 rollout: Phase 2 begins next week", "WindowsLogo", "normal", "notification", "Deployment"),
    makeItem("CRITICAL: Phishing campaign detected \u2014 do not click suspicious links", "ShieldAlert", "critical", "alert", "Security", { description: "Report suspicious emails to security@company.com immediately" }),
    makeItem("New self-service password reset portal available", "PasswordField", "normal", "notification", "Tools"),
    makeItem("Printer network outage in Building C \u2014 ETA fix: 2pm", "Print", "warning", "alert", "Facilities"),
  ];
}

function getHrUpdates(): ITickerItem[] {
  return [
    makeItem("Open enrollment for 2026 benefits begins March 1st", "Heart", "normal", "notification", "Benefits", { description: "Review your options in the benefits portal before enrollment closes" }),
    makeItem("Welcome aboard! 15 new team members joined this month", "AddFriend", "normal", "news", "Onboarding"),
    makeItem("Updated PTO policy: Unlimited sick days now available", "Hospital", "normal", "notification", "Policy"),
    makeItem("Employee appreciation week: Feb 24\u201328 \u2014 see events calendar", "PartyLeader", "normal", "event", "Culture"),
    makeItem("MANDATORY: Annual compliance training due by Feb 28th", "Education", "warning", "alert", "Training", { description: "Complete the online course in the learning portal" }),
    makeItem("Parental leave policy expanded to 16 weeks", "Family", "normal", "news", "Benefits"),
    makeItem("Performance review cycle opens March 10th", "BarChart4", "normal", "notification", "Performance"),
    makeItem("Mental health resources: Free counseling sessions available", "HeartBroken", "normal", "notification", "Wellness"),
  ];
}

function getEmergencyDrill(): ITickerItem[] {
  return [
    makeItem("EMERGENCY: Building evacuation in progress \u2014 use stairwells only", "Warning", "critical", "emergency", "Safety", { description: "Do NOT use elevators. Proceed to designated assembly points." }),
    makeItem("Severe weather alert: Tornado warning until 4:00 PM \u2014 shelter in place", "Frigid", "critical", "emergency", "Weather", { description: "Move to interior rooms on the lowest floor. Stay away from windows." }),
    makeItem("Cybersecurity incident: Disconnect from network immediately", "ShieldAlert", "critical", "emergency", "Security", { description: "Unplug ethernet cables and disable WiFi until further notice." }),
    makeItem("Active situation on campus \u2014 remain in locked rooms", "Lock", "critical", "emergency", "Safety", { description: "Do not open doors. Wait for official all-clear announcement." }),
    makeItem("Gas leak detected in Building B \u2014 evacuate immediately", "Warning", "critical", "emergency", "Safety", { description: "Exit through the north entrance. Fire department en route." }),
    makeItem("Power outage affecting all floors \u2014 emergency lights active", "Flashlight", "warning", "alert", "Facilities", { description: "Generators powering critical systems. ETA for full power: 2 hours." }),
  ];
}

function getMixedFeed(): ITickerItem[] {
  return [
    makeItem("IT: All systems green \u2014 99.97% uptime this month", "CheckMark", "normal", "kpi", "IT"),
    makeItem("HR: Benefits enrollment closes in 5 days", "Clock", "warning", "alert", "HR"),
    makeItem("Sales: New partnership with Contoso Ltd. announced", "Handshake", "normal", "news", "Sales"),
    makeItem("Facilities: Parking garage level 3 closed for repairs", "Car", "warning", "notification", "Facilities"),
    makeItem("Finance: Q1 budget submissions due March 1st", "Money", "normal", "notification", "Finance"),
    makeItem("Engineering: API migration 78% complete \u2014 ETA March 20th", "Processing", "normal", "kpi", "Engineering"),
    makeItem("Security: Annual phishing simulation begins next week", "ShieldAlert", "warning", "alert", "Security"),
    makeItem("Events: Annual town hall March 15th at 2:00 PM", "Group", "normal", "event", "Events"),
    makeItem("Marketing: Brand refresh guidelines published", "Color", "normal", "news", "Marketing"),
    makeItem("Legal: Updated NDA template available in DocCenter", "Document", "normal", "notification", "Legal"),
  ];
}

/**
 * Get sample ticker data for a given demo preset.
 * Returns realistic business content for demo mode.
 */
export function getSampleTickerData(presetId: DemoTickerPresetId): ITickerItem[] {
  if (presetId === "companyNews") return getCompanyNews();
  if (presetId === "itAlerts") return getItAlerts();
  if (presetId === "hrUpdates") return getHrUpdates();
  if (presetId === "emergencyDrill") return getEmergencyDrill();
  if (presetId === "mixedFeed") return getMixedFeed();
  return getCompanyNews();
}
