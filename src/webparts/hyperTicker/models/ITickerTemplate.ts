// HyperTicker V2 — Template Presets
// 10 pre-built ticker templates for different business scenarios

import type { TickerDisplayMode, TickerSeverity } from "./IHyperTickerEnums";
import type { TickerMessageType } from "./ITickerMessageType";
import type { ITickerItem } from "./ITickerItem";
import { generateTickerItemId } from "./ITickerItem";

export type TickerTemplateId =
  | "companyNews"
  | "itServiceDesk"
  | "hrAnnouncements"
  | "emergencyAlerts"
  | "eventCountdown"
  | "stockTicker"
  | "socialFeed"
  | "projectStatus"
  | "compliance"
  | "multiSource";

export const ALL_TEMPLATE_IDS: TickerTemplateId[] = [
  "companyNews", "itServiceDesk", "hrAnnouncements", "emergencyAlerts",
  "eventCountdown", "stockTicker", "socialFeed", "projectStatus",
  "compliance", "multiSource",
];

/** Template configuration */
export interface ITickerTemplate {
  id: TickerTemplateId;
  name: string;
  description: string;
  icon: string;
  barBackground: string;
  accentColor: string;
  textColor: string;
  defaultMode: TickerDisplayMode;
  defaultItems: ITickerItem[];
}

/** Helper to create a template ticker item */
function makeItem(
  title: string,
  iconName: string,
  severity: TickerSeverity,
  messageType: TickerMessageType,
  url: string,
  category: string
): ITickerItem {
  return {
    id: generateTickerItemId(),
    title: title,
    url: url,
    iconName: iconName,
    severity: severity,
    dataSource: "manual",
    expiresAt: "",
    audienceGroups: [],
    isActive: true,
    sortOrder: 0,
    messageType: messageType,
    description: "",
    startsAt: "",
    recurPattern: "none",
    category: category,
    templateId: "",
    acknowledged: false,
    dismissed: false,
  };
}

/** All 10 template presets */
export const TICKER_TEMPLATES: Record<TickerTemplateId, ITickerTemplate> = {
  companyNews: {
    id: "companyNews",
    name: "Company News",
    description: "General company updates, announcements, and press releases",
    icon: "\uD83D\uDCF0",
    barBackground: "#0f1b2d",
    accentColor: "#2196F3",
    textColor: "#e8f0fe",
    defaultMode: "scroll",
    defaultItems: [
      makeItem("Q4 Earnings Report: Revenue up 12% year-over-year", "Money", "normal", "news", "", "Finance"),
      makeItem("New CEO Message: Strategic priorities for 2026", "People", "normal", "news", "", "Leadership"),
      makeItem("Office closure: President's Day, Feb 17th", "Calendar", "warning", "notification", "", "HR"),
      makeItem("Customer satisfaction score reaches all-time high of 94%", "Like", "normal", "kpi", "", "Operations"),
    ],
  },
  itServiceDesk: {
    id: "itServiceDesk",
    name: "IT Service Desk",
    description: "System alerts, outage notifications, and maintenance windows",
    icon: "\uD83D\uDDA5\uFE0F",
    barBackground: "#1a1a2e",
    accentColor: "#FF9800",
    textColor: "#fff3e0",
    defaultMode: "scroll",
    defaultItems: [
      makeItem("Scheduled maintenance: Exchange Online, Sat 2am-6am EST", "Settings", "warning", "alert", "", "Maintenance"),
      makeItem("VPN connectivity issue resolved \u2014 all regions operational", "PlugConnected", "normal", "notification", "", "Network"),
      makeItem("New MFA policy: Phishing-resistant auth required by March 1st", "Lock", "warning", "alert", "", "Security"),
      makeItem("System status: All services operational", "CheckMark", "normal", "kpi", "", "Status"),
    ],
  },
  hrAnnouncements: {
    id: "hrAnnouncements",
    name: "HR Announcements",
    description: "Employee benefits, policies, and HR updates",
    icon: "\uD83D\uDC65",
    barBackground: "#1b0a2e",
    accentColor: "#9C27B0",
    textColor: "#f3e5f5",
    defaultMode: "fade",
    defaultItems: [
      makeItem("Open enrollment for 2026 benefits begins March 1st", "Heart", "normal", "notification", "", "Benefits"),
      makeItem("Welcome aboard! 15 new team members joined this month", "AddFriend", "normal", "news", "", "Onboarding"),
      makeItem("Updated PTO policy: Unlimited sick days now available", "Hospital", "normal", "notification", "", "Policy"),
      makeItem("Employee appreciation week: Feb 24\u201328 \u2014 see events calendar", "PartyLeader", "normal", "event", "", "Culture"),
    ],
  },
  emergencyAlerts: {
    id: "emergencyAlerts",
    name: "Emergency Alerts",
    description: "Critical alerts, safety notices, and emergency communications",
    icon: "\uD83D\uDEA8",
    barBackground: "#2d0a0a",
    accentColor: "#F44336",
    textColor: "#ffebee",
    defaultMode: "breaking",
    defaultItems: [
      makeItem("EMERGENCY: Building evacuation in progress \u2014 use stairwells, do NOT use elevators", "Warning", "critical", "emergency", "", "Safety"),
      makeItem("Severe weather alert: Tornado warning until 4:00 PM \u2014 shelter in place", "Frigid", "critical", "emergency", "", "Weather"),
      makeItem("Cybersecurity incident: Do NOT click links in emails from unknown senders", "ShieldAlert", "critical", "alert", "", "Security"),
    ],
  },
  eventCountdown: {
    id: "eventCountdown",
    name: "Event Countdown",
    description: "Upcoming events, conferences, and important dates",
    icon: "\uD83D\uDCC5",
    barBackground: "#0a2d1a",
    accentColor: "#4CAF50",
    textColor: "#e8f5e9",
    defaultMode: "split",
    defaultItems: [
      makeItem("Annual Town Hall: March 15th at 2:00 PM \u2014 Register now", "Group", "normal", "event", "", "Town Hall"),
      makeItem("Innovation Hackathon: Submit your ideas by Feb 28th", "Lightbulb", "normal", "event", "", "Innovation"),
      makeItem("Quarterly Business Review: March 5th, all-hands required", "BarChart4", "warning", "event", "", "Review"),
      makeItem("Charity Fun Run: April 10th \u2014 Sign up in the lobby", "Running", "normal", "event", "", "Social"),
    ],
  },
  stockTicker: {
    id: "stockTicker",
    name: "Stock Ticker",
    description: "Financial data, stock prices, and market indicators",
    icon: "\uD83D\uDCC8",
    barBackground: "#0a0a0a",
    accentColor: "#00BCD4",
    textColor: "#e0f7fa",
    defaultMode: "scroll",
    defaultItems: [
      makeItem("MSFT \u25B2 $478.32 (+1.2%)", "Market", "normal", "kpi", "", "Stocks"),
      makeItem("AAPL \u25BC $198.44 (-0.8%)", "Market", "warning", "kpi", "", "Stocks"),
      makeItem("S&P 500 \u25B2 5,892.15 (+0.6%)", "LineChart", "normal", "kpi", "", "Index"),
      makeItem("Company Stock (ACME) \u25B2 $124.78 (+2.1%)", "Money", "normal", "kpi", "", "Company"),
      makeItem("BTC \u25B2 $97,245 (+3.4%)", "AllCurrency", "normal", "kpi", "", "Crypto"),
    ],
  },
  socialFeed: {
    id: "socialFeed",
    name: "Social Feed",
    description: "Social media highlights, employee shoutouts, and Yammer posts",
    icon: "\uD83D\uDCAC",
    barBackground: "linear-gradient(90deg, #1a237e, #4a148c)",
    accentColor: "#2196F3",
    textColor: "#e8eaf6",
    defaultMode: "stacked",
    defaultItems: [
      makeItem("\uD83C\uDFC6 Shoutout to Sarah M. for closing the Enterprise deal!", "Like", "normal", "notification", "", "Recognition"),
      makeItem("\uD83C\uDF89 Team Alpha wins Hackathon 2026 with AI-powered scheduling tool", "Trophy", "normal", "news", "", "Achievement"),
      makeItem("\uD83D\uDCF8 Photo contest winners announced \u2014 check the gallery", "Camera", "normal", "notification", "", "Social"),
      makeItem("\uD83C\uDF1F New Yammer community: #SustainabilityAtWork \u2014 Join now!", "People", "normal", "notification", "", "Community"),
    ],
  },
  projectStatus: {
    id: "projectStatus",
    name: "Project Status",
    description: "Project milestones, sprint updates, and delivery status",
    icon: "\uD83D\uDCCA",
    barBackground: "#0a1a2d",
    accentColor: "#00BCD4",
    textColor: "#e0f2f1",
    defaultMode: "stacked",
    defaultItems: [
      makeItem("Project Phoenix: Sprint 14 complete \u2014 12/12 stories delivered", "TaskSolid", "normal", "kpi", "", "Delivery"),
      makeItem("Client Portal v3.0 deployed to production successfully", "Rocket", "normal", "news", "", "Release"),
      makeItem("API migration: 78% complete \u2014 ETA March 20th", "Processing", "warning", "kpi", "", "Migration"),
      makeItem("Code freeze for Q1 release begins Feb 25th", "Lock", "warning", "alert", "", "Release"),
    ],
  },
  compliance: {
    id: "compliance",
    name: "Compliance",
    description: "Regulatory updates, training reminders, and compliance deadlines",
    icon: "\uD83D\uDCDC",
    barBackground: "#2d1a0a",
    accentColor: "#FF9800",
    textColor: "#fff3e0",
    defaultMode: "fade",
    defaultItems: [
      makeItem("MANDATORY: Annual cybersecurity training due by Feb 28th", "Education", "warning", "alert", "", "Training"),
      makeItem("GDPR data review: Department submissions due March 15th", "ProtectedDocument", "warning", "notification", "", "Privacy"),
      makeItem("SOC 2 Type II audit scheduled for March 10-14th", "Shield", "normal", "notification", "", "Audit"),
      makeItem("Updated travel expense policy effective March 1st", "Airplane", "normal", "news", "", "Policy"),
    ],
  },
  multiSource: {
    id: "multiSource",
    name: "Multi-Source Mix",
    description: "A blend of news, alerts, and KPIs from multiple departments",
    icon: "\uD83C\uDF10",
    barBackground: "linear-gradient(90deg, #0f1b2d, #1a1a2e, #0a2d1a)",
    accentColor: "#4fc3f7",
    textColor: "#e1f5fe",
    defaultMode: "scroll",
    defaultItems: [
      makeItem("IT: All systems green \u2014 99.97% uptime this month", "CheckMark", "normal", "kpi", "", "IT"),
      makeItem("HR: Benefits enrollment closes in 5 days", "Clock", "warning", "alert", "", "HR"),
      makeItem("Sales: New partnership with Contoso Ltd. announced", "Handshake", "normal", "news", "", "Sales"),
      makeItem("Facilities: Parking garage level 3 closed for repairs", "Car", "warning", "notification", "", "Facilities"),
      makeItem("Finance: Q1 budget submissions due March 1st", "Money", "normal", "notification", "", "Finance"),
    ],
  },
};

export function getTickerTemplate(id: TickerTemplateId): ITickerTemplate | undefined {
  return TICKER_TEMPLATES[id];
}

export function getTickerTemplateDisplayName(id: TickerTemplateId): string {
  const template = TICKER_TEMPLATES[id];
  return template ? template.name : id;
}
