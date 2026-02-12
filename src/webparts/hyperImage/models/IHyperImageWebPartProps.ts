/* ── Web Part Properties ── */

import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { ShapeMask } from "./IHyperImageShape";
import type { FilterPreset } from "./IHyperImageFilter";
import type { HoverEffect } from "./IHyperImageHover";
import type { ShadowPreset } from "./IHyperImageBorder";
import type { EntranceAnimation } from "./IHyperImageAnimation";
import type { ImageLayout } from "./IHyperImageLayout";

export interface IHyperImageWebPartProps extends IBaseHyperWebPartProps {

  /* ── Wizard ── */
  wizardCompleted: boolean;

  /* ── Sample Data ── */
  useSampleData: boolean;

  /* ── Demo Mode ── */
  enableDemoMode: boolean;

  /* ── Image Source ── */
  imageUrl: string;
  altText: string;
  isDecorative: boolean;

  /* ── Multi-Image / Layout ── */
  imageLayout: ImageLayout;
  /** JSON-serialized IImageLayoutConfig */
  layoutConfigJson: string;
  /** JSON-serialized IHyperImageItem[] (additional images for multi-image layouts) */
  additionalImagesJson: string;

  /* ── Shape ── */
  shape: ShapeMask;
  customClipPath: string;

  /* ── Filter ── */
  filterPreset: FilterPreset;
  /** JSON-serialized IFilterConfig (custom slider values) */
  filterConfigJson: string;

  /* ── Hover ── */
  hoverEffect: HoverEffect;

  /* ── Flip Back (only when hoverEffect === "flip") ── */
  flipBackTitle: string;
  flipBackText: string;
  flipBackBgColor: string;

  /* ── Text / Caption ── */
  /** JSON-serialized ITextOverlay (placement: overlay or below) */
  textOverlayJson: string;

  /* ── Border & Shadow ── */
  /** JSON-serialized IBorderConfig */
  borderConfigJson: string;
  shadowPreset: ShadowPreset;

  /* ── Sizing ── */
  aspectRatio: string;
  objectFit: string;
  maxWidth: number;
  maxHeight: number;

  /* ── Action ── */
  linkUrl: string;
  linkTarget: string;
  openLightbox: boolean;

  /* ── Animation ── */
  entranceAnimation: EntranceAnimation;

  /* ── Performance ── */
  lazyLoad: boolean;
  progressiveLoad: boolean;

  /* ── Debug / Advanced ── */
  debugMode: boolean;
  customCss: string;
}
