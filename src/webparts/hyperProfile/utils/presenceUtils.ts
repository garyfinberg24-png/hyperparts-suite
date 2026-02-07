import type { IHyperPresence, IHyperPresenceConfig } from "../models";

/** Get presence configuration (color, label, etc.) based on availability */
export function getPresenceConfig(presence: IHyperPresence | undefined): IHyperPresenceConfig {
  if (!presence) {
    return { color: "#A19F9D", icon: "PresenceUnknown", label: "Unknown", shouldPulse: false };
  }

  switch (presence.availability) {
    case "Available":
      return { color: "#92C353", icon: "SkypeCheck", label: "Available", shouldPulse: false };
    case "Busy":
      return { color: "#C4314B", icon: "SkypeMinus", label: "Busy", shouldPulse: true };
    case "Away":
      return { color: "#FFAA44", icon: "SkypeClock", label: "Away", shouldPulse: false };
    case "BeRightBack":
      return { color: "#FFAA44", icon: "SkypeClock", label: "Be Right Back", shouldPulse: false };
    case "DoNotDisturb":
      return { color: "#C4314B", icon: "SkypeMinus", label: "Do Not Disturb", shouldPulse: false };
    case "OutOfOffice":
      return { color: "#B4009E", icon: "Airplane", label: "Out of Office", shouldPulse: false };
    case "Offline":
      return { color: "#605E5C", icon: "SkypeCircleMinus", label: "Offline", shouldPulse: false };
    case "PresenceUnknown":
    default:
      return { color: "#A19F9D", icon: "PresenceUnknown", label: "Unknown", shouldPulse: false };
  }
}

/** Get status message text from presence */
export function getStatusMessage(presence: IHyperPresence | undefined): string | undefined {
  if (!presence || !presence.statusMessage) {
    return undefined;
  }
  const msg = presence.statusMessage.message;
  return msg ? msg.content : undefined;
}

/** Check if status message has expiry */
export function hasExpiryTime(presence: IHyperPresence | undefined): boolean {
  if (!presence || !presence.statusMessage || !presence.statusMessage.expiryDateTime) {
    return false;
  }
  return !!presence.statusMessage.expiryDateTime.dateTime;
}

/** Get formatted expiry time */
export function getExpiryTime(presence: IHyperPresence | undefined): string | undefined {
  if (!presence || !presence.statusMessage || !presence.statusMessage.expiryDateTime) {
    return undefined;
  }
  const dt = presence.statusMessage.expiryDateTime.dateTime;
  if (!dt) return undefined;

  const expiryDate = new Date(dt);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 0) return "Expired";
  if (diffMins < 60) return "Expires in " + diffMins + " min";
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return "Expires in " + diffHours + " hr";
  const diffDays = Math.floor(diffHours / 24);
  return "Expires in " + diffDays + " day" + (diffDays > 1 ? "s" : "");
}
