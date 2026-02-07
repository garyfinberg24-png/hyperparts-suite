/** Microsoft Teams presence information */
export interface IHyperPresence {
  availability:
    | "Available"
    | "Busy"
    | "Away"
    | "BeRightBack"
    | "DoNotDisturb"
    | "Offline"
    | "PresenceUnknown"
    | "OutOfOffice";
  activity: string;
  statusMessage?: {
    message: {
      content: string;
      contentType: "text" | "html";
    };
    expiryDateTime?: {
      dateTime: string;
    };
  };
}

/** Configuration for displaying presence status */
export interface IHyperPresenceConfig {
  color: string;
  icon: string;
  label: string;
  shouldPulse: boolean;
}
