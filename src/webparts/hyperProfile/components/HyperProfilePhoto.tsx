import * as React from "react";
import type { IHyperPresence } from "../models";
import type { PresencePosition, PhotoSize } from "../models";
import HyperProfilePresenceBadge from "./HyperProfilePresenceBadge";
import styles from "./HyperProfilePhoto.module.scss";

export interface IHyperProfilePhotoProps {
  displayName: string;
  photoUrl?: string;
  photoSize: PhotoSize;
  presence?: IHyperPresence;
  showPresence: boolean;
  presencePosition: PresencePosition;
}

const SIZE_CLASS_MAP: Record<string, Record<string, string>> = {
  photo: { small: styles.photoSmall, medium: styles.photoMedium, large: styles.photoLarge },
  placeholder: { small: styles.placeholderSmall, medium: styles.placeholderMedium, large: styles.placeholderLarge },
};

const HyperProfilePhoto: React.FC<IHyperProfilePhotoProps> = function (props) {
  const sizeClass = SIZE_CLASS_MAP.photo[props.photoSize] || styles.photoMedium;
  const placeholderSizeClass = SIZE_CLASS_MAP.placeholder[props.photoSize] || styles.placeholderMedium;

  const imageEl = props.photoUrl
    ? React.createElement("img", {
        src: props.photoUrl,
        alt: "Profile photo of " + props.displayName,
        className: styles.photo + " " + sizeClass,
      })
    : React.createElement(
        "div",
        {
          className: styles.placeholder + " " + placeholderSizeClass,
          role: "img",
          "aria-label": props.displayName + " profile placeholder",
        },
        props.displayName.charAt(0)
      );

  const children: React.ReactNode[] = [imageEl];

  if (props.showPresence && props.presencePosition === "onPhoto") {
    children.push(
      React.createElement("div", { key: "presence", className: styles.presenceOverlay },
        React.createElement(HyperProfilePresenceBadge, { presence: props.presence })
      )
    );
  }

  return React.createElement("div", { className: styles.photoContainer }, children);
};

export default HyperProfilePhoto;
