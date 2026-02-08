import * as React from "react";
import * as strings from "HyperSliderWebPartStrings";
import styles from "./HyperSliderEditOverlay.module.scss";

export interface IHyperSliderEditOverlayProps {
  slideCount: number;
  layerCount: number;
}

const HyperSliderEditOverlay: React.FC<IHyperSliderEditOverlayProps> = function (props) {
  return React.createElement(
    "div",
    { className: styles.editOverlay },
    React.createElement("i", {
      className: "ms-Icon ms-Icon--Slideshow " + styles.editIcon,
    }),
    React.createElement(
      "div",
      { className: styles.editTitle },
      strings.EditOverlayTitle
    ),
    React.createElement(
      "div",
      { className: styles.editDescription },
      strings.EditOverlayDescription
    ),
    React.createElement(
      "div",
      { className: styles.editStats },
      String(props.slideCount) + " slides, " + String(props.layerCount) + " layers"
    )
  );
};

export default HyperSliderEditOverlay;
