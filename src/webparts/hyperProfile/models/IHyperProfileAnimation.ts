/** Card animation types */
export type ProfileAnimation =
  | "none"
  | "shake"
  | "flip"
  | "bounce"
  | "pulse"
  | "glow"
  | "slideIn";

/** Header / background display styles */
export type ProfileHeaderStyle =
  | "solid"
  | "gradient"
  | "image"
  | "pattern"
  | "accent";

/** Header configuration */
export interface IHeaderConfig {
  style: ProfileHeaderStyle;
  primaryColor: string;
  secondaryColor?: string;
  imageUrl?: string;
  patternId?: string;
  height?: number;
}

/** Photo shape options */
export type PhotoShape =
  | "circle"
  | "rounded"
  | "square"
  | "hexagon"
  | "diamond"
  | "shield";

/** Template category for gallery grouping */
export type TemplateCategory = "classic" | "modern" | "creative";

/** Animation metadata for display */
export interface IAnimationMeta {
  id: ProfileAnimation;
  name: string;
  description: string;
}

/** All available animations with metadata */
export const ANIMATION_OPTIONS: IAnimationMeta[] = [
  { id: "none", name: "None", description: "No animation" },
  { id: "shake", name: "Shake", description: "Horizontal jitter effect" },
  { id: "flip", name: "Flip", description: "3D Y-axis rotation" },
  { id: "bounce", name: "Bounce", description: "Spring bounce up" },
  { id: "pulse", name: "Pulse", description: "Subtle scale heartbeat" },
  { id: "glow", name: "Glow", description: "Box-shadow intensity cycle" },
  { id: "slideIn", name: "Slide In", description: "Slide from left with fade" },
];

/** Photo shape metadata */
export interface IPhotoShapeMeta {
  id: PhotoShape;
  name: string;
  css: string;
}

/** All available photo shapes */
export const PHOTO_SHAPE_OPTIONS: IPhotoShapeMeta[] = [
  { id: "circle", name: "Circle", css: "border-radius: 50%" },
  { id: "rounded", name: "Rounded", css: "border-radius: 16px" },
  { id: "square", name: "Square", css: "border-radius: 0" },
  { id: "hexagon", name: "Hexagon", css: "clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" },
  { id: "diamond", name: "Diamond", css: "clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  { id: "shield", name: "Shield", css: "clip-path: polygon(50% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%, 0% 0%)" },
];
