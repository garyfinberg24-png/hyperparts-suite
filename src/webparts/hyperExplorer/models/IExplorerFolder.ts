/** Represents a folder in the tree navigation */
export interface IExplorerFolder {
  /** Server-relative path */
  path: string;
  /** Folder display name */
  name: string;
  /** Number of child items */
  itemCount: number;
  /** Parent folder path */
  parent?: string;
  /** Depth level in tree (0 = root) */
  level: number;
  /** Whether folder is expanded in tree */
  isExpanded: boolean;
}

/** Breadcrumb segment for folder navigation */
export interface IExplorerBreadcrumb {
  /** Server-relative path */
  path: string;
  /** Display name */
  name: string;
  /** Whether this is the root segment */
  isRoot: boolean;
}
