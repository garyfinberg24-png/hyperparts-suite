// HyperTicker V2 — Message Type system
// Each ticker item can have a message type that determines its icon, color, and badge

export type TickerMessageType = "news" | "alert" | "notification" | "emergency" | "event" | "kpi";

export const ALL_MESSAGE_TYPES: TickerMessageType[] = [
  "news", "alert", "notification", "emergency", "event", "kpi",
];

/** Configuration for a single message type */
export interface ITickerMessageTypeConfig {
  type: TickerMessageType;
  label: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

/** Full config map for all message types */
export const MESSAGE_TYPE_CONFIGS: Record<TickerMessageType, ITickerMessageTypeConfig> = {
  news: {
    type: "news",
    label: "News",
    iconName: "News",
    color: "#0078d4",
    badgeBg: "#deecf9",
    badgeText: "#004578",
  },
  alert: {
    type: "alert",
    label: "Alert",
    iconName: "Warning",
    color: "#ffaa44",
    badgeBg: "#fff4ce",
    badgeText: "#8a6914",
  },
  notification: {
    type: "notification",
    label: "Notification",
    iconName: "Ringer",
    color: "#8764b8",
    badgeBg: "#f0e6ff",
    badgeText: "#5c2d91",
  },
  emergency: {
    type: "emergency",
    label: "Emergency",
    iconName: "ShieldAlert",
    color: "#d13438",
    badgeBg: "#fde7e9",
    badgeText: "#a80000",
  },
  event: {
    type: "event",
    label: "Event",
    iconName: "Event",
    color: "#107c10",
    badgeBg: "#dff6dd",
    badgeText: "#0b6a0b",
  },
  kpi: {
    type: "kpi",
    label: "KPI",
    iconName: "LineChart",
    color: "#00bcd4",
    badgeBg: "#e0f7fa",
    badgeText: "#006064",
  },
};

export function getMessageTypeConfig(type: TickerMessageType): ITickerMessageTypeConfig {
  return MESSAGE_TYPE_CONFIGS[type] || MESSAGE_TYPE_CONFIGS.news;
}

export function getMessageTypeDisplayName(type: TickerMessageType): string {
  const config = MESSAGE_TYPE_CONFIGS[type];
  return config ? config.label : "News";
}
