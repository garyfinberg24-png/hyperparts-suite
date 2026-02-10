/** Represents a single activity/event on a file */
export interface IFileActivityEntry {
  /** Unique activity ID */
  id: string;
  /** Type of action */
  actionType: FileActivityAction;
  /** Display name of the user who performed the action */
  actorDisplayName: string;
  /** Actor email */
  actorEmail?: string;
  /** Actor photo URL */
  actorPhotoUrl?: string;
  /** ISO timestamp of the activity */
  timestamp: string;
  /** File name the activity relates to */
  fileName: string;
  /** Server-relative URL of the file */
  fileUrl: string;
  /** Optional description/comment */
  description?: string;
  /** Version label after action (e.g. "2.0") */
  versionLabel?: string;
}

/** Activity action types */
export type FileActivityAction =
  | "created"
  | "modified"
  | "deleted"
  | "renamed"
  | "moved"
  | "shared"
  | "checkedOut"
  | "checkedIn"
  | "commented"
  | "restored"
  | "downloaded";

/** Activity action display config */
export interface IFileActivityActionConfig {
  label: string;
  icon: string;
  color: string;
}

/** Map of action types to display config */
export const FILE_ACTIVITY_CONFIG: Record<FileActivityAction, IFileActivityActionConfig> = {
  created: { label: "Created", icon: "\u2795", color: "#107c10" },
  modified: { label: "Modified", icon: "\u270F\uFE0F", color: "#0078d4" },
  deleted: { label: "Deleted", icon: "\uD83D\uDDD1\uFE0F", color: "#c62828" },
  renamed: { label: "Renamed", icon: "\uD83C\uDFF7\uFE0F", color: "#8764b8" },
  moved: { label: "Moved", icon: "\uD83D\uDCC2", color: "#986f0b" },
  shared: { label: "Shared", icon: "\uD83D\uDCE4", color: "#038387" },
  checkedOut: { label: "Checked Out", icon: "\uD83D\uDD12", color: "#d83b01" },
  checkedIn: { label: "Checked In", icon: "\uD83D\uDD13", color: "#107c10" },
  commented: { label: "Commented", icon: "\uD83D\uDCAC", color: "#605e5c" },
  restored: { label: "Restored", icon: "\u267B\uFE0F", color: "#498205" },
  downloaded: { label: "Downloaded", icon: "\u2B07\uFE0F", color: "#004578" },
};
