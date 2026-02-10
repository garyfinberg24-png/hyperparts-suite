import * as React from "react";
import type { ITextOverlay } from "../models/IHyperImageText";
import { TextPlacement } from "../models/IHyperImageText";
import styles from "./HyperImage.module.scss";

export interface IHyperImageTextOverlayProps {
  config: ITextOverlay;
}

/**
 * Renders title, subtitle, and body text either as an overlay on the image
 * or as a caption callout box below the image.
 */
var HyperImageTextOverlay: React.FC<IHyperImageTextOverlayProps> = function (props) {
  var c = props.config;
  if (!c.enabled) return React.createElement(React.Fragment);

  var hasTitle = c.title.length > 0;
  var hasSubtitle = c.subtitle.length > 0;
  var hasBody = c.bodyText.length > 0;

  if (!hasTitle && !hasSubtitle && !hasBody) return React.createElement(React.Fragment);

  var isOverlay = c.placement === TextPlacement.Overlay;

  // Build inline styles for text
  var textStyle: React.CSSProperties = {
    fontFamily: c.fontFamily !== "inherit" ? c.fontFamily : undefined,
    fontWeight: c.fontWeight as React.CSSProperties["fontWeight"],
    color: c.color,
    textShadow: c.textShadow ? "0 1px 3px rgba(0,0,0,0.6)" : undefined,
  };

  // Background for overlay mode
  var bgStyle: React.CSSProperties | undefined;
  if (isOverlay && c.bgOpacity > 0) {
    var r = parseInt(c.bgColor.substring(1, 3), 16) || 0;
    var g = parseInt(c.bgColor.substring(3, 5), 16) || 0;
    var b = parseInt(c.bgColor.substring(5, 7), 16) || 0;
    bgStyle = {
      backgroundColor: "rgba(" + r + "," + g + "," + b + "," + (c.bgOpacity / 100) + ")",
      padding: "12px 16px",
      borderRadius: "4px",
    };
  }

  // Caption below-image mode: callout box styling
  var captionStyle: React.CSSProperties | undefined;
  if (!isOverlay) {
    var cr = parseInt(c.bgColor.substring(1, 3), 16) || 255;
    var cg = parseInt(c.bgColor.substring(3, 5), 16) || 255;
    var cb = parseInt(c.bgColor.substring(5, 7), 16) || 255;
    captionStyle = {
      backgroundColor: "rgba(" + cr + "," + cg + "," + cb + "," + (c.bgOpacity / 100) + ")",
      padding: "16px 20px",
      borderRadius: "0 0 8px 8px",
    };
  }

  // Position class for overlay mode
  var positionClass = isOverlay
    ? (styles as Record<string, string>)["textPos" + c.position.charAt(0).toUpperCase() + c.position.substring(1)] || ""
    : "";

  // Entrance animation class
  var entranceClass = c.entrance !== "none"
    ? (styles as Record<string, string>)["textEntrance" + c.entrance.charAt(0).toUpperCase() + c.entrance.substring(1)] || ""
    : "";

  var containerClass = isOverlay
    ? styles.textOverlay + " " + positionClass + " " + entranceClass
    : styles.textCaption + " " + entranceClass;

  var children: React.ReactElement[] = [];

  if (hasTitle) {
    children.push(React.createElement("h3", {
      key: "title",
      className: styles.textTitle,
      style: { fontSize: c.titleFontSize + "px", fontFamily: textStyle.fontFamily, fontWeight: textStyle.fontWeight, color: textStyle.color, textShadow: textStyle.textShadow },
    }, c.title));
  }

  if (hasSubtitle) {
    children.push(React.createElement("h4", {
      key: "subtitle",
      className: styles.textSubtitle,
      style: { fontSize: c.subtitleFontSize + "px", fontFamily: textStyle.fontFamily, color: textStyle.color, textShadow: textStyle.textShadow },
    }, c.subtitle));
  }

  if (hasBody) {
    children.push(React.createElement("p", {
      key: "body",
      className: styles.textBody,
      style: { fontSize: c.bodyFontSize + "px", fontFamily: textStyle.fontFamily, color: textStyle.color, textShadow: textStyle.textShadow },
    }, c.bodyText));
  }

  return React.createElement(
    "div",
    {
      className: containerClass,
      style: isOverlay ? bgStyle : captionStyle,
    },
    children
  );
};

export default HyperImageTextOverlay;
