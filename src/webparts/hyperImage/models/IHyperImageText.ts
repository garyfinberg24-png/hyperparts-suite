/* ── Text / Caption Config ── */

/** 9 positions for overlay text */
export enum TextPosition {
  TopLeft = "topLeft",
  TopCenter = "topCenter",
  TopRight = "topRight",
  CenterLeft = "centerLeft",
  Center = "center",
  CenterRight = "centerRight",
  BottomLeft = "bottomLeft",
  BottomCenter = "bottomCenter",
  BottomRight = "bottomRight",
}

/** Entrance animation for text */
export enum TextEntrance {
  None = "none",
  Fade = "fade",
  SlideUp = "slideUp",
  SlideLeft = "slideLeft",
  Typewriter = "typewriter",
}

/** Where the text content appears: over the image or below it */
export enum TextPlacement {
  Overlay = "overlay",
  Below = "below",
}

/** Full text overlay / caption configuration */
export interface ITextOverlay {
  enabled: boolean;
  placement: TextPlacement;
  title: string;
  subtitle: string;
  bodyText: string;
  /** Position is only used when placement is "overlay" */
  position: TextPosition;
  fontFamily: string;
  titleFontSize: number;
  subtitleFontSize: number;
  bodyFontSize: number;
  fontWeight: string;
  color: string;
  textShadow: boolean;
  bgColor: string;
  bgOpacity: number;
  entrance: TextEntrance;
  /** Text alignment for caption/overlay */
  textAlign: "left" | "center" | "right";
}

/** Default text config */
export var DEFAULT_TEXT_OVERLAY: ITextOverlay = {
  enabled: false,
  placement: TextPlacement.Below,
  title: "",
  subtitle: "",
  bodyText: "",
  position: TextPosition.BottomCenter,
  fontFamily: "inherit",
  titleFontSize: 24,
  subtitleFontSize: 16,
  bodyFontSize: 14,
  fontWeight: "600",
  color: "#333333",
  textShadow: false,
  bgColor: "#ffffff",
  bgOpacity: 100,
  entrance: TextEntrance.None,
  textAlign: "left",
};

/** Property pane dropdown: text position */
export var TEXT_POSITION_OPTIONS = [
  { key: TextPosition.TopLeft, text: "Top Left" },
  { key: TextPosition.TopCenter, text: "Top Center" },
  { key: TextPosition.TopRight, text: "Top Right" },
  { key: TextPosition.CenterLeft, text: "Center Left" },
  { key: TextPosition.Center, text: "Center" },
  { key: TextPosition.CenterRight, text: "Center Right" },
  { key: TextPosition.BottomLeft, text: "Bottom Left" },
  { key: TextPosition.BottomCenter, text: "Bottom Center" },
  { key: TextPosition.BottomRight, text: "Bottom Right" },
];

/** Property pane dropdown: text entrance */
export var TEXT_ENTRANCE_OPTIONS = [
  { key: TextEntrance.None, text: "None" },
  { key: TextEntrance.Fade, text: "Fade In" },
  { key: TextEntrance.SlideUp, text: "Slide Up" },
  { key: TextEntrance.SlideLeft, text: "Slide Left" },
  { key: TextEntrance.Typewriter, text: "Typewriter" },
];

/** Property pane dropdown: text placement */
export var TEXT_PLACEMENT_OPTIONS = [
  { key: TextPlacement.Below, text: "Below Image (Caption)" },
  { key: TextPlacement.Overlay, text: "Over Image (Overlay)" },
];

/** Property pane dropdown: text alignment */
export var TEXT_ALIGN_OPTIONS = [
  { key: "left", text: "Left" },
  { key: "center", text: "Center" },
  { key: "right", text: "Right" },
];

/** Web-safe font options for property pane */
export var FONT_FAMILY_OPTIONS = [
  { key: "inherit", text: "Theme Default" },
  { key: "'Segoe UI', sans-serif", text: "Segoe UI" },
  { key: "Arial, sans-serif", text: "Arial" },
  { key: "'Helvetica Neue', Helvetica, sans-serif", text: "Helvetica" },
  { key: "Georgia, serif", text: "Georgia" },
  { key: "'Times New Roman', serif", text: "Times New Roman" },
  { key: "'Trebuchet MS', sans-serif", text: "Trebuchet MS" },
  { key: "Verdana, sans-serif", text: "Verdana" },
  { key: "'Courier New', monospace", text: "Courier New" },
  { key: "'Lucida Console', monospace", text: "Lucida Console" },
  { key: "Impact, sans-serif", text: "Impact" },
  { key: "'Palatino Linotype', serif", text: "Palatino" },
  { key: "'Book Antiqua', serif", text: "Book Antiqua" },
  { key: "Tahoma, sans-serif", text: "Tahoma" },
  { key: "'Century Gothic', sans-serif", text: "Century Gothic" },
];
