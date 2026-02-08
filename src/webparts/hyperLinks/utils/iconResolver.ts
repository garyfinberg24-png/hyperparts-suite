import type { IHyperLinkIcon, HyperLinksIconSize } from "../models";

export interface IResolvedIcon {
  type: "fluent" | "emoji" | "custom";
  className?: string;
  content?: string;
  src?: string;
  sizeClass: string;
}

const ICON_SIZE_MAP: Record<HyperLinksIconSize, string> = {
  small: "iconSmall",
  medium: "iconMedium",
  large: "iconLarge",
};

/** Resolve an IHyperLinkIcon into a renderable format */
export function resolveIcon(
  icon: IHyperLinkIcon | undefined,
  size: HyperLinksIconSize
): IResolvedIcon | undefined {
  if (!icon || !icon.value) return undefined;

  const sizeClass = ICON_SIZE_MAP[size] || "iconMedium";

  if (icon.type === "fluent") {
    return {
      type: "fluent",
      className: "ms-Icon ms-Icon--" + icon.value,
      sizeClass: sizeClass,
    };
  }

  if (icon.type === "emoji") {
    return {
      type: "emoji",
      content: icon.value,
      sizeClass: sizeClass,
    };
  }

  if (icon.type === "custom") {
    return {
      type: "custom",
      src: icon.value,
      sizeClass: sizeClass,
    };
  }

  return undefined;
}
