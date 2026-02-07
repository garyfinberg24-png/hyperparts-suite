/** All available layout types for HyperNews */
export type LayoutType =
  | "cardGrid"
  | "list"
  | "magazine"
  | "newspaper"
  | "timeline"
  | "carousel"
  | "heroGrid"
  | "compact"
  | "filmstrip"
  | "mosaic"
  | "sideBySide"
  | "tiles";

/** Per-layout display configuration */
export interface ILayoutConfig {
  type: LayoutType;
  columns?: number;
  showImages?: boolean;
  showDescription?: boolean;
  showReadTime?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  compactMode?: boolean;
}

export const DEFAULT_LAYOUT_CONFIG: ILayoutConfig = {
  type: "cardGrid",
  columns: 3,
  showImages: true,
  showDescription: true,
  showReadTime: true,
  showAuthor: true,
  showDate: true,
  compactMode: false,
};

/** Human-readable layout labels for property pane dropdown */
export const LAYOUT_OPTIONS: Array<{ key: LayoutType; text: string }> = [
  { key: "cardGrid", text: "Card Grid" },
  { key: "list", text: "List" },
  { key: "magazine", text: "Magazine" },
  { key: "newspaper", text: "Newspaper" },
  { key: "timeline", text: "Timeline" },
  { key: "carousel", text: "Carousel" },
  { key: "heroGrid", text: "Hero Grid" },
  { key: "compact", text: "Compact" },
  { key: "filmstrip", text: "Filmstrip" },
  { key: "mosaic", text: "Mosaic" },
  { key: "sideBySide", text: "Side-by-Side" },
  { key: "tiles", text: "Tiles" },
];
