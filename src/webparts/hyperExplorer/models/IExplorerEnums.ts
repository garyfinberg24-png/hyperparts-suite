/**
 * HyperExplorer enumeration types and option arrays
 */

/** Layout view modes */
export type ViewMode = "grid" | "masonry" | "list" | "filmstrip" | "tiles";

/** Sort field options */
export type SortMode = "name" | "modified" | "size" | "type" | "author";

/** Sort direction */
export type SortDirection = "asc" | "desc";

/** Preview display modes */
export type PreviewMode = "tab" | "split" | "lightbox";

/** File category classification */
export type FileCategory = "document" | "image" | "video" | "audio" | "archive" | "folder" | "other";

/** Upload status */
export type UploadStatus = "idle" | "uploading" | "success" | "error";

/** Video source type */
export type VideoSourceType = "mp4" | "youtube" | "vimeo" | "stream";

/** Dropdown option arrays for property pane */
export const VIEW_MODE_OPTIONS: { key: ViewMode; text: string }[] = [
  { key: "grid", text: "Grid" },
  { key: "masonry", text: "Masonry" },
  { key: "list", text: "List" },
  { key: "filmstrip", text: "Filmstrip" },
  { key: "tiles", text: "Tiles" },
];

export const SORT_MODE_OPTIONS: { key: SortMode; text: string }[] = [
  { key: "name", text: "Name" },
  { key: "modified", text: "Modified Date" },
  { key: "size", text: "File Size" },
  { key: "type", text: "File Type" },
  { key: "author", text: "Author" },
];

export const PREVIEW_MODE_OPTIONS: { key: PreviewMode; text: string }[] = [
  { key: "tab", text: "Tabbed" },
  { key: "split", text: "Split Screen" },
  { key: "lightbox", text: "Lightbox Only" },
];
