/* ── Predefined Layout Gallery ── */

export interface IPresetLayout {
  id: string;
  label: string;
  description: string;
  layout: string; // ImageLayout enum value
  columns: number;
  rows: number;
  gap: number;
  imageCount: number;
  /** Thumbnail icon/emoji for the gallery card */
  icon: string;
}

export var PRESET_LAYOUTS: IPresetLayout[] = [
  {
    id: "singleHero",
    label: "Single Hero",
    description: "One large full-width image",
    layout: "single",
    columns: 1,
    rows: 1,
    gap: 0,
    imageCount: 1,
    icon: "\u25A0",
  },
  {
    id: "rowOf2",
    label: "Side by Side",
    description: "Two images in a row",
    layout: "row",
    columns: 2,
    rows: 1,
    gap: 12,
    imageCount: 2,
    icon: "\u25A0\u25A0",
  },
  {
    id: "rowOf3",
    label: "Row of Three",
    description: "Three images with title/subtitle/text",
    layout: "row",
    columns: 3,
    rows: 1,
    gap: 12,
    imageCount: 3,
    icon: "\u25A0\u25A0\u25A0",
  },
  {
    id: "grid2x2",
    label: "2x2 Grid",
    description: "Four images in a 2x2 block",
    layout: "grid",
    columns: 2,
    rows: 2,
    gap: 12,
    imageCount: 4,
    icon: "\u25A0\u25A0\n\u25A0\u25A0",
  },
  {
    id: "grid3x2",
    label: "3x2 Grid",
    description: "Six images in a 3-column layout",
    layout: "grid",
    columns: 3,
    rows: 2,
    gap: 12,
    imageCount: 6,
    icon: "\u25A0\u25A0\u25A0\n\u25A0\u25A0\u25A0",
  },
  {
    id: "collageHero",
    label: "Collage",
    description: "1 large + 2 smaller images",
    layout: "collage",
    columns: 2,
    rows: 2,
    gap: 8,
    imageCount: 3,
    icon: "\u25A0\u25A1\n\u25A0\u25A1",
  },
  {
    id: "filmstrip",
    label: "Filmstrip",
    description: "Horizontal scrolling strip",
    layout: "filmstrip",
    columns: 4,
    rows: 1,
    gap: 12,
    imageCount: 5,
    icon: "\u25C0\u25A0\u25A0\u25A0\u25B6",
  },
];
