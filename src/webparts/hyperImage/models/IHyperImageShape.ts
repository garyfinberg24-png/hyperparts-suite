/* ── Shape Masks ── */

/** 22 CSS clip-path shape masks for images */
export enum ShapeMask {
  Rectangle = "rectangle",
  RoundedRect = "roundedRect",
  Circle = "circle",
  Oval = "oval",
  Square = "square",
  Triangle = "triangle",
  Pentagon = "pentagon",
  Hexagon = "hexagon",
  Octagon = "octagon",
  Diamond = "diamond",
  Star = "star",
  Cross = "cross",
  Arrow = "arrow",
  Blob1 = "blob1",
  Blob2 = "blob2",
  Blob3 = "blob3",
  Pebble = "pebble",
  Teardrop = "teardrop",
  Leaf = "leaf",
  Heart = "heart",
  Shield = "shield",
  Custom = "custom",
}

export interface IShapeDefinition {
  id: ShapeMask;
  label: string;
  clipPath: string;
}

/** All 22 shapes with their CSS clip-path values */
export const SHAPE_REGISTRY: IShapeDefinition[] = [
  { id: ShapeMask.Rectangle, label: "Rectangle", clipPath: "none" },
  { id: ShapeMask.RoundedRect, label: "Rounded Rectangle", clipPath: "inset(0 round 12px)" },
  { id: ShapeMask.Circle, label: "Circle", clipPath: "circle(50%)" },
  { id: ShapeMask.Oval, label: "Oval", clipPath: "ellipse(50% 40%)" },
  { id: ShapeMask.Square, label: "Square", clipPath: "inset(10%)" },
  { id: ShapeMask.Triangle, label: "Triangle", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { id: ShapeMask.Pentagon, label: "Pentagon", clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" },
  { id: ShapeMask.Hexagon, label: "Hexagon", clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" },
  { id: ShapeMask.Octagon, label: "Octagon", clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" },
  { id: ShapeMask.Diamond, label: "Diamond", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  { id: ShapeMask.Star, label: "Star", clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" },
  { id: ShapeMask.Cross, label: "Cross", clipPath: "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)" },
  { id: ShapeMask.Arrow, label: "Arrow", clipPath: "polygon(40% 0%, 100% 50%, 40% 100%, 40% 70%, 0% 70%, 0% 30%, 40% 30%)" },
  { id: ShapeMask.Blob1, label: "Blob 1", clipPath: "polygon(45% 2%, 78% 8%, 95% 35%, 88% 68%, 70% 92%, 38% 98%, 12% 82%, 2% 50%, 8% 22%)" },
  { id: ShapeMask.Blob2, label: "Blob 2", clipPath: "polygon(50% 5%, 80% 10%, 98% 40%, 90% 75%, 60% 95%, 25% 90%, 5% 60%, 10% 25%)" },
  { id: ShapeMask.Blob3, label: "Blob 3", clipPath: "polygon(40% 0%, 75% 5%, 95% 30%, 100% 60%, 85% 90%, 55% 100%, 20% 92%, 0% 65%, 5% 30%)" },
  { id: ShapeMask.Pebble, label: "Pebble", clipPath: "ellipse(48% 42% at 52% 50%)" },
  { id: ShapeMask.Teardrop, label: "Teardrop", clipPath: "polygon(50% 0%, 80% 35%, 80% 70%, 50% 100%, 20% 70%, 20% 35%)" },
  { id: ShapeMask.Leaf, label: "Leaf", clipPath: "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)" },
  { id: ShapeMask.Heart, label: "Heart", clipPath: "polygon(50% 15%, 65% 0%, 85% 0%, 100% 15%, 100% 40%, 50% 100%, 0% 40%, 0% 15%, 15% 0%, 35% 0%)" },
  { id: ShapeMask.Shield, label: "Shield", clipPath: "polygon(50% 0%, 100% 15%, 95% 65%, 50% 100%, 5% 65%, 0% 15%)" },
  { id: ShapeMask.Custom, label: "Custom", clipPath: "none" },
];

/** Get the CSS clip-path for a shape */
export function getShapeClipPath(shape: ShapeMask, customPath?: string): string {
  if (shape === ShapeMask.Custom && customPath) {
    return customPath;
  }
  var match: IShapeDefinition | undefined;
  SHAPE_REGISTRY.forEach(function (s) {
    if (s.id === shape) {
      match = s;
    }
  });
  return match ? match.clipPath : "none";
}

/** Property pane dropdown options */
export var SHAPE_OPTIONS = SHAPE_REGISTRY.map(function (s) {
  return { key: s.id, text: s.label };
});
