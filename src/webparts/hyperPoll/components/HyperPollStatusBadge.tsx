import * as React from "react";
import type { PollStatus } from "../models";

const STATUS_STYLES: Record<PollStatus, { backgroundColor: string; color: string; label: string }> = {
  draft: { backgroundColor: "#edebe9", color: "#605e5c", label: "Draft" },
  active: { backgroundColor: "#dff6dd", color: "#107c10", label: "Active" },
  closed: { backgroundColor: "#fed9cc", color: "#d83b01", label: "Closed" },
  archived: { backgroundColor: "#e8e8e8", color: "#8a8886", label: "Archived" },
};

export interface IHyperPollStatusBadgeProps {
  status: PollStatus;
}

const HyperPollStatusBadge: React.FC<IHyperPollStatusBadgeProps> = function (props) {
  const config = STATUS_STYLES[props.status] || STATUS_STYLES.draft;

  return React.createElement(
    "span",
    {
      role: "status",
      "aria-label": "Poll status: " + config.label,
      style: {
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: config.backgroundColor,
        color: config.color,
      },
    },
    config.label
  );
};

export default HyperPollStatusBadge;
