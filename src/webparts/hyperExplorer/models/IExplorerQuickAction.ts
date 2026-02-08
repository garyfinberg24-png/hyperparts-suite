/** Quick action menu item */
export interface IExplorerQuickAction {
  /** Unique ID */
  id: string;
  /** Display label */
  label: string;
  /** Fluent UI icon name */
  icon: string;
  /** Action type */
  action: "share" | "copyLink" | "download" | "rename" | "move" | "delete" | "properties" | "compare";
  /** Required permission level (undefined = no check) */
  requiresPermission?: "edit" | "delete";
}

/** Default quick actions list */
export const DEFAULT_QUICK_ACTIONS: IExplorerQuickAction[] = [
  { id: "share", label: "Share", icon: "Share", action: "share" },
  { id: "copyLink", label: "Copy Link", icon: "Link", action: "copyLink" },
  { id: "download", label: "Download", icon: "Download", action: "download" },
  { id: "rename", label: "Rename", icon: "Rename", action: "rename", requiresPermission: "edit" },
  { id: "delete", label: "Delete", icon: "Delete", action: "delete", requiresPermission: "delete" },
  { id: "properties", label: "Properties", icon: "Info", action: "properties" },
  { id: "compare", label: "Compare", icon: "BranchCompare", action: "compare" },
];
