import * as React from "react";
import type { IExplorerFile } from "../models";
import { getFileIcon } from "../utils/fileTypeUtils";
import styles from "./HyperExplorerRecentFiles.module.scss";

export interface IHyperExplorerRecentFilesProps {
  /** Max items to display */
  maxItems: number;
  /** Recent files data (passed from parent — Graph API or sample) */
  recentFiles: IExplorerFile[];
  /** Loading state */
  loading: boolean;
  /** Callback when file is clicked */
  onFileClick: (file: IExplorerFile) => void;
  /** Callback to refresh */
  onRefresh: () => void;
}

/** File type emoji mapping */
var FILE_EMOJI_MAP: Record<string, string> = {
  WordDocument: "\uD83D\uDCC4",
  ExcelDocument: "\uD83D\uDCCA",
  PowerPointDocument: "\uD83C\uDFA8",
  PDF: "\uD83D\uDCC4",
  FileImage: "\uD83D\uDDBC\uFE0F",
  MSNVideos: "\uD83C\uDFA5",
  MusicInCollection: "\uD83C\uDFB5",
  ZipFolder: "\uD83D\uDCE6",
  Page: "\uD83D\uDCC4",
};

/** Get emoji for file type */
function getFileEmoji(fileType: string): string {
  var iconName = getFileIcon(fileType);
  return FILE_EMOJI_MAP[iconName] || "\uD83D\uDCC4";
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
  if (diffMins < 60) return diffMins + "m ago";
  if (diffHours < 24) return diffHours + "h ago";
  if (diffDays < 7) return diffDays + "d ago";
  return new Date(isoDate).toLocaleDateString();
}

var HyperExplorerRecentFiles: React.FC<IHyperExplorerRecentFilesProps> = function (props) {
  var children: React.ReactNode[] = [];

  // Header
  children.push(
    React.createElement("div", { key: "header", className: styles.recentHeader },
      React.createElement("span", { className: styles.recentTitle }, "Recent Files"),
      React.createElement("button", {
        className: styles.recentRefreshButton,
        onClick: props.onRefresh,
        "aria-label": "Refresh recent files",
        title: "Refresh",
        type: "button",
      }, "\uD83D\uDD04")
    )
  );

  // Body
  if (props.loading) {
    children.push(
      React.createElement("div", { key: "loading", className: styles.recentLoading }, "Loading recent files...")
    );
  } else if (props.recentFiles.length === 0) {
    children.push(
      React.createElement("div", { key: "empty", className: styles.recentEmpty }, "No recent files")
    );
  } else {
    var items = props.recentFiles.slice(0, props.maxItems);
    var listItems = items.map(function (file) {
      return React.createElement("li", { key: file.id },
        React.createElement("button", {
          className: styles.recentItem,
          onClick: function () { props.onFileClick(file); },
          type: "button",
        },
          React.createElement("span", {
            className: styles.recentItemIcon,
            "aria-hidden": "true",
          }, getFileEmoji(file.fileType)),
          React.createElement("div", { className: styles.recentItemMeta },
            React.createElement("span", { className: styles.recentItemName }, file.name),
            React.createElement("span", { className: styles.recentItemDate }, formatRelativeTime(file.modified))
          )
        )
      );
    });

    children.push(
      React.createElement("ul", {
        key: "list",
        className: styles.recentList,
        role: "list",
        "aria-label": "Recent files",
      }, listItems)
    );
  }

  return React.createElement("div", {
    className: styles.recentFiles,
    role: "region",
    "aria-label": "Recent files",
  }, children);
};

export default HyperExplorerRecentFiles;
