/* ── Image Layouts ── */

/**
 * Layout modes for HyperImage.
 * - Single: one image (default)
 * - Row: horizontal row of images (e.g. 2, 3, or 4 in a row)
 * - Grid: N x M grid (e.g. 2x2, 3x3)
 * - Collage: mixed sizes (1 large + 2 small)
 * - Filmstrip: horizontal scroll strip
 */
export enum ImageLayout {
  Single = "single",
  Row = "row",
  Grid = "grid",
  Collage = "collage",
  Filmstrip = "filmstrip",
}

/** Configuration for multi-image layouts */
export interface IImageLayoutConfig {
  columns: number;
  rows: number;
  gap: number;
  equalHeight: boolean;
}

/** Default layout config */
export var DEFAULT_LAYOUT_CONFIG: IImageLayoutConfig = {
  columns: 3,
  rows: 1,
  gap: 12,
  equalHeight: true,
};

/** Property pane dropdown options */
export var IMAGE_LAYOUT_OPTIONS = [
  { key: ImageLayout.Single, text: "Single Image" },
  { key: ImageLayout.Row, text: "Row (Side by Side)" },
  { key: ImageLayout.Grid, text: "Grid (Rows & Columns)" },
  { key: ImageLayout.Collage, text: "Collage (Mixed Sizes)" },
  { key: ImageLayout.Filmstrip, text: "Filmstrip (Horizontal Scroll)" },
];

/** A single image item in a multi-image layout */
export interface IHyperImageItem {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
  linkTarget: string;
  /** Per-image caption title */
  title: string;
  /** Per-image caption subtitle */
  subtitle: string;
}

/** Default image item */
export var DEFAULT_IMAGE_ITEM: IHyperImageItem = {
  id: "",
  imageUrl: "",
  altText: "",
  linkUrl: "",
  linkTarget: "_self",
  title: "",
  subtitle: "",
};
