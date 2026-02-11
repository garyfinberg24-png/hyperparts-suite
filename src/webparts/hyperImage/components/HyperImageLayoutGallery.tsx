import * as React from "react";
import { HyperModal } from "../../../common/components";
import { PRESET_LAYOUTS } from "../models/IHyperImagePresetLayout";
import type { IPresetLayout } from "../models/IHyperImagePresetLayout";
import styles from "./HyperImage.module.scss";

export interface IHyperImageLayoutGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLayout: (preset: IPresetLayout) => void;
  /** Current layout value for selected-state highlight */
  currentLayout?: string;
}

var HyperImageLayoutGallery: React.FC<IHyperImageLayoutGalleryProps> = function (props) {
  if (!props.isOpen) {
    return React.createElement(React.Fragment);
  }

  var cards = PRESET_LAYOUTS.map(function (preset) {
    var isSelected = props.currentLayout !== undefined && props.currentLayout === preset.layout;
    var cardClass = styles.layoutGalleryCard + (isSelected ? " " + styles.layoutGalleryCardSelected : "");

    return React.createElement("div", {
      key: preset.id,
      className: cardClass,
      onClick: function (): void { props.onSelectLayout(preset); },
      onKeyDown: function (e: React.KeyboardEvent): void {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.onSelectLayout(preset);
        }
      },
      role: "button",
      tabIndex: 0,
      "aria-label": preset.label + " layout: " + preset.description,
      "aria-pressed": isSelected ? "true" : "false",
    },
      React.createElement("span", { className: styles.layoutGalleryIcon, "aria-hidden": "true" }, preset.icon),
      React.createElement("span", { className: styles.layoutGalleryLabel }, preset.label),
      React.createElement("span", { className: styles.layoutGalleryDesc }, preset.description),
      React.createElement("span", { className: styles.layoutGalleryBadge }, preset.imageCount + (preset.imageCount === 1 ? " image" : " images"))
    );
  });

  return React.createElement(HyperModal, {
    isOpen: props.isOpen,
    onClose: props.onClose,
    title: "Choose a Layout",
    size: "large",
  },
    React.createElement("div", {
      className: styles.layoutGallery,
      role: "grid",
      "aria-label": "Predefined layout options",
    }, cards)
  );
};

export default HyperImageLayoutGallery;
