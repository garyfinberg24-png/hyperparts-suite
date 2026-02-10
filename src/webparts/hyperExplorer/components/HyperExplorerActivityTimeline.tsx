import * as React from "react";
import type { IFileActivityEntry } from "../models";
import { FILE_ACTIVITY_CONFIG } from "../models";
import { useFileActivity } from "../hooks/useFileActivity";
import styles from "./HyperExplorerActivityTimeline.module.scss";

export interface IHyperExplorerActivityTimelineProps {
  /** File ID to show activity for */
  fileId: string | undefined;
  /** File name for display */
  fileName: string;
  /** Max entries */
  maxEntries: number;
  /** Close callback */
  onClose: () => void;
}

/** Format relative time */
function formatRelativeTime(isoDate: string): string {
  var now = Date.now();
  var date = new Date(isoDate).getTime();
  var diffMs = now - date;
  var diffMins = Math.floor(diffMs / 60000);
  var diffHours = Math.floor(diffMins / 60);
  var diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return diffMins + " min ago";
  if (diffHours < 24) return diffHours + " hour" + (diffHours !== 1 ? "s" : "") + " ago";
  if (diffDays < 7) return diffDays + " day" + (diffDays !== 1 ? "s" : "") + " ago";
  return new Date(isoDate).toLocaleDateString() + " " + new Date(isoDate).toLocaleTimeString();
}

var HyperExplorerActivityTimeline: React.FC<IHyperExplorerActivityTimelineProps> = function (props) {
  var result = useFileActivity({
    fileId: props.fileId,
    enabled: !!props.fileId,
    maxEntries: props.maxEntries,
  });

  var children: React.ReactNode[] = [];

  // Header
  children.push(
    React.createElement("div", { key: "header", className: styles.timelineHeader },
      React.createElement("span", { className: styles.timelineTitle },
        "Activity" + (props.fileName ? " \u2014 " + props.fileName : "")
      ),
      React.createElement("button", {
        className: styles.timelineCloseButton,
        onClick: props.onClose,
        "aria-label": "Close activity timeline",
        type: "button",
      }, "\u2715")
    )
  );

  // Content
  if (result.loading) {
    children.push(
      React.createElement("div", { key: "loading", className: styles.timelineLoading }, "Loading activity...")
    );
  } else if (result.activities.length === 0) {
    children.push(
      React.createElement("div", { key: "empty", className: styles.timelineEmpty },
        props.fileId ? "No activity recorded for this file." : "Select a file to view its activity history."
      )
    );
  } else {
    var items = result.activities.map(function (activity: IFileActivityEntry) {
      var config = FILE_ACTIVITY_CONFIG[activity.actionType];

      var contentChildren: React.ReactNode[] = [];

      // Action text
      var actionParts: React.ReactNode[] = [];
      actionParts.push(
        React.createElement("span", { key: "actor", className: styles.timelineActor }, activity.actorDisplayName)
      );
      actionParts.push(" ");
      actionParts.push(
        React.createElement("span", { key: "type", className: styles.timelineActionType }, config.label.toLowerCase())
      );
      actionParts.push(" this file");

      if (activity.versionLabel) {
        actionParts.push(
          React.createElement("span", { key: "ver", className: styles.timelineVersion }, "v" + activity.versionLabel)
        );
      }

      contentChildren.push(
        React.createElement("div", { key: "action", className: styles.timelineAction }, actionParts)
      );

      // Description
      if (activity.description) {
        contentChildren.push(
          React.createElement("div", { key: "desc", className: styles.timelineDescription },
            "\"" + activity.description + "\""
          )
        );
      }

      // Timestamp
      contentChildren.push(
        React.createElement("div", { key: "time", className: styles.timelineTimestamp },
          formatRelativeTime(activity.timestamp)
        )
      );

      return React.createElement("div", {
        key: activity.id,
        className: styles.timelineItem,
      },
        // Dot with action icon
        React.createElement("div", {
          className: styles.timelineDot,
          style: { borderColor: config.color },
          "aria-hidden": "true",
        }, config.icon),

        // Content
        React.createElement("div", { className: styles.timelineContent }, contentChildren)
      );
    });

    children.push(
      React.createElement("div", {
        key: "list",
        className: styles.timelineList,
        role: "feed",
        "aria-label": "File activity timeline",
      }, items)
    );
  }

  return React.createElement("div", {
    className: styles.timelinePanel,
    role: "region",
    "aria-label": "File activity timeline",
  }, children);
};

export default HyperExplorerActivityTimeline;
