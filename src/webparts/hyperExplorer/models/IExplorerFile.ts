import type { FileCategory } from "./IExplorerEnums";

/** Represents a file or folder item in the explorer */
export interface IExplorerFile {
  /** Unique composite key */
  id: string;
  /** Display name */
  name: string;
  /** Server-relative URL */
  serverRelativeUrl: string;
  /** File extension (lowercase, no dot) */
  fileType: string;
  /** Classified category */
  fileCategory: FileCategory;
  /** File size in bytes (0 for folders) */
  size: number;
  /** Author display name */
  author: string;
  /** Author email */
  authorEmail?: string;
  /** Last editor display name */
  editor?: string;
  /** Last editor email */
  editorEmail?: string;
  /** Created date ISO string */
  created: string;
  /** Modified date ISO string */
  modified: string;
  /** Version label e.g. "1.0" */
  version?: string;
  /** Thumbnail URL from SP */
  thumbnailUrl?: string;
  /** Parent folder server-relative path */
  parentFolder: string;
  /** Whether this item is a folder */
  isFolder: boolean;
  /** Content type name */
  contentType?: string;
  /** SharePoint unique ID */
  uniqueId?: string;
  /** Metadata tags */
  tags?: string[];
  /** Description */
  description?: string;
  /** Computed flags */
  isImage: boolean;
  isVideo: boolean;
  isPreviewable: boolean;
}

/** Default empty file object */
export const DEFAULT_EXPLORER_FILE: IExplorerFile = {
  id: "",
  name: "",
  serverRelativeUrl: "",
  fileType: "",
  fileCategory: "other",
  size: 0,
  author: "",
  authorEmail: undefined,
  editor: undefined,
  editorEmail: undefined,
  created: "",
  modified: "",
  version: undefined,
  thumbnailUrl: undefined,
  parentFolder: "",
  isFolder: false,
  contentType: undefined,
  uniqueId: undefined,
  tags: undefined,
  description: undefined,
  isImage: false,
  isVideo: false,
  isPreviewable: false,
};
