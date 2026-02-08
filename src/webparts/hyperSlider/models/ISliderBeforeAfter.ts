// ─── Before/After Comparison Configuration ────────────────────────────────────
import type { BeforeAfterOrientation } from "./IHyperSliderEnums";

/** Before/After image comparison configuration */
export interface ISliderBeforeAfter {
  enabled: boolean;
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel: string;
  afterLabel: string;
  orientation: BeforeAfterOrientation;
  initialPosition: number;
  handleSize: number;
  handleColor: string;
  showLabels: boolean;
}

export const DEFAULT_BEFORE_AFTER: ISliderBeforeAfter = {
  enabled: false,
  beforeImageUrl: "",
  afterImageUrl: "",
  beforeLabel: "Before",
  afterLabel: "After",
  orientation: "horizontal",
  initialPosition: 50,
  handleSize: 40,
  handleColor: "#ffffff",
  showLabels: true,
};
