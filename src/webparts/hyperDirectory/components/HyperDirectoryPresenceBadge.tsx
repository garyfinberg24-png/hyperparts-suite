import * as React from "react";
import type { IDirectoryPresence } from "../models";
import styles from "./HyperDirectoryPresenceBadge.module.scss";

export interface IHyperDirectoryPresenceBadgeProps {
  presence?: IDirectoryPresence;
  onPhoto?: boolean;
}

const AVAILABILITY_MAP: Record<string, string> = {
  Available: styles.available,
  AvailableIdle: styles.available,
  Busy: styles.busy,
  BusyIdle: styles.busy,
  DoNotDisturb: styles.doNotDisturb,
  Away: styles.away,
  BeRightBack: styles.beRightBack,
  Offline: styles.offline,
  PresenceUnknown: styles.unknown,
};

const HyperDirectoryPresenceBadge: React.FC<IHyperDirectoryPresenceBadgeProps> = function (props) {
  const { presence, onPhoto } = props;

  if (!presence) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const availabilityClass = AVAILABILITY_MAP[presence.availability] || styles.unknown;
  const className = styles.presenceBadge + " " + availabilityClass +
    (onPhoto ? " " + styles.presenceOnPhoto : "");

  return React.createElement("span", {
    className: className,
    role: "img",
    "aria-label": presence.availability || "Unknown",
    title: presence.availability || "Unknown",
  });
};

export default React.memo(HyperDirectoryPresenceBadge);
