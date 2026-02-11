/* ── Shapes ── */
export { ShapeMask, SHAPE_REGISTRY, SHAPE_OPTIONS, getShapeClipPath } from "./IHyperImageShape";
export type { IShapeDefinition } from "./IHyperImageShape";

/* ── Filters ── */
export {
  FilterPreset,
  DEFAULT_FILTER_CONFIG,
  FILTER_PRESETS,
  FILTER_PRESET_OPTIONS,
  buildFilterString,
} from "./IHyperImageFilter";
export type { IFilterConfig } from "./IHyperImageFilter";

/* ── Hover ── */
export { HoverEffect, HOVER_EFFECT_OPTIONS } from "./IHyperImageHover";

/* ── Text / Caption ── */
export {
  TextPosition,
  TextEntrance,
  TextPlacement,
  DEFAULT_TEXT_OVERLAY,
  TEXT_POSITION_OPTIONS,
  TEXT_ENTRANCE_OPTIONS,
  TEXT_PLACEMENT_OPTIONS,
  FONT_FAMILY_OPTIONS,
  TEXT_ALIGN_OPTIONS,
} from "./IHyperImageText";
export type { ITextOverlay } from "./IHyperImageText";

/* ── Border ── */
export {
  ShadowPreset,
  SHADOW_PRESETS,
  SHADOW_PRESET_OPTIONS,
  BORDER_STYLE_OPTIONS,
  DEFAULT_BORDER_CONFIG,
  BorderStylePreset,
  BORDER_STYLE_PRESETS,
  BORDER_STYLE_PRESET_OPTIONS,
} from "./IHyperImageBorder";
export type { IBorderConfig, IBorderPresetConfig } from "./IHyperImageBorder";

/* ── Animation ── */
export { EntranceAnimation, ENTRANCE_ANIMATION_OPTIONS } from "./IHyperImageAnimation";

/* ── Layout ── */
export {
  ImageLayout,
  DEFAULT_LAYOUT_CONFIG,
  IMAGE_LAYOUT_OPTIONS,
  DEFAULT_IMAGE_ITEM,
} from "./IHyperImageLayout";
export type { IImageLayoutConfig, IHyperImageItem } from "./IHyperImageLayout";

/* ── Preset Layouts ── */
export { PRESET_LAYOUTS } from "./IHyperImagePresetLayout";
export type { IPresetLayout } from "./IHyperImagePresetLayout";

/* ── Web Part Props ── */
export type { IHyperImageWebPartProps } from "./IHyperImageWebPartProps";
