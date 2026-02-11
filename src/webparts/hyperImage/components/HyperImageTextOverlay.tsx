import * as React from "react";
import type { ITextOverlay } from "../models/IHyperImageText";
import { TextPlacement } from "../models/IHyperImageText";
import styles from "./HyperImage.module.scss";

export interface IHyperImageTextOverlayProps {
  config: ITextOverlay;
}

/**
 * Renders title, subtitle, and body text either as an overlay on the image
 * or as a structured caption callout box below the image.
 *
 * When placement is "below", the callout has a left accent border and
 * distinct styling for title (h3, large+bold), subtitle (h4, lighter),
 * and body (p, standard).
 */
var HyperImageTextOverlay: React.FC<IHyperImageTextOverlayProps> = function (props) {
  var c = props.config;
  if (!c.enabled) return React.createElement(React.Fragment);

  var hasTitle = c.title.length > 0;
  var hasSubtitle = c.subtitle.length > 0;
  var hasBody = c.bodyText.length > 0;

  if (!hasTitle && !hasSubtitle && !hasBody) return React.createElement(React.Fragment);

  var isOverlay = c.placement === TextPlacement.Overlay;

  // Text alignment — default to "left" if not set
  var textAlign: React.CSSProperties["textAlign"] = (c.textAlign || "left") as React.CSSProperties["textAlign"];

  // Build inline styles for text
  var textStyle: React.CSSProperties = {
    fontFamily: c.fontFamily !== "inherit" ? c.fontFamily : undefined,
    fontWeight: c.fontWeight as React.CSSProperties["fontWeight"],
    color: c.color,
    textShadow: c.textShadow ? "0 1px 3px rgba(0,0,0,0.6)" : undefined,
  };

  // Helper: parse hex color to rgba
  function hexToRgba(hex: string, opacity: number, fallbackR: number, fallbackG: number, fallbackB: number): string {
    var rVal = parseInt(hex.substring(1, 3), 16);
    var gVal = parseInt(hex.substring(3, 5), 16);
    var bVal = parseInt(hex.substring(5, 7), 16);
    if (isNaN(rVal)) rVal = fallbackR;
    if (isNaN(gVal)) gVal = fallbackG;
    if (isNaN(bVal)) bVal = fallbackB;
    return "rgba(" + rVal + "," + gVal + "," + bVal + "," + (opacity / 100) + ")";
  }

  // ── Overlay mode ──
  if (isOverlay) {
    var bgStyle: React.CSSProperties | undefined;
    if (c.bgOpacity > 0) {
      bgStyle = {
        backgroundColor: hexToRgba(c.bgColor, c.bgOpacity, 0, 0, 0),
        padding: "12px 16px",
        borderRadius: "4px",
        textAlign: textAlign,
      };
    } else {
      bgStyle = {
        textAlign: textAlign,
      };
    }

    // Position class for overlay mode
    var positionClass = (styles as Record<string, string>)["textPos" + c.position.charAt(0).toUpperCase() + c.position.substring(1)] || "";

    // Entrance animation class
    var entranceClass = c.entrance !== "none"
      ? (styles as Record<string, string>)["textEntrance" + c.entrance.charAt(0).toUpperCase() + c.entrance.substring(1)] || ""
      : "";

    var overlayClass = styles.textOverlay + " " + positionClass + " " + entranceClass;

    var overlayChildren: React.ReactElement[] = [];

    if (hasTitle) {
      overlayChildren.push(React.createElement("h3", {
        key: "title",
        className: styles.textTitle,
        style: { fontSize: c.titleFontSize + "px", fontFamily: textStyle.fontFamily, fontWeight: textStyle.fontWeight, color: textStyle.color, textShadow: textStyle.textShadow },
      }, c.title));
    }

    if (hasSubtitle) {
      overlayChildren.push(React.createElement("h4", {
        key: "subtitle",
        className: styles.textSubtitle,
        style: { fontSize: c.subtitleFontSize + "px", fontFamily: textStyle.fontFamily, color: textStyle.color, textShadow: textStyle.textShadow },
      }, c.subtitle));
    }

    if (hasBody) {
      overlayChildren.push(React.createElement("p", {
        key: "body",
        className: styles.textBody,
        style: { fontSize: c.bodyFontSize + "px", fontFamily: textStyle.fontFamily, color: textStyle.color, textShadow: textStyle.textShadow },
      }, c.bodyText));
    }

    return React.createElement(
      "div",
      {
        className: overlayClass,
        style: bgStyle,
      },
      overlayChildren
    );
  }

  // ── Below mode: structured callout with left accent border ──
  var captionBg = hexToRgba(c.bgColor, c.bgOpacity, 255, 255, 255);

  var captionEntranceClass = c.entrance !== "none"
    ? (styles as Record<string, string>)["textEntrance" + c.entrance.charAt(0).toUpperCase() + c.entrance.substring(1)] || ""
    : "";

  var captionContainerClass = styles.textCaptionBelow + " " + captionEntranceClass;

  var captionStyle: React.CSSProperties = {
    backgroundColor: captionBg,
    textAlign: textAlign,
  };

  var captionChildren: React.ReactElement[] = [];

  if (hasTitle) {
    captionChildren.push(React.createElement("h3", {
      key: "title",
      className: styles.textCaptionBelowTitle,
      style: {
        fontSize: c.titleFontSize + "px",
        fontFamily: textStyle.fontFamily,
        color: textStyle.color,
        textShadow: textStyle.textShadow,
      },
    }, c.title));
  }

  if (hasSubtitle) {
    captionChildren.push(React.createElement("h4", {
      key: "subtitle",
      className: styles.textCaptionBelowSubtitle,
      style: {
        fontSize: c.subtitleFontSize + "px",
        fontFamily: textStyle.fontFamily,
        color: textStyle.color,
        textShadow: textStyle.textShadow,
      },
    }, c.subtitle));
  }

  if (hasBody) {
    captionChildren.push(React.createElement("p", {
      key: "body",
      className: styles.textCaptionBelowBody,
      style: {
        fontSize: c.bodyFontSize + "px",
        fontFamily: textStyle.fontFamily,
        color: textStyle.color,
        textShadow: textStyle.textShadow,
      },
    }, c.bodyText));
  }

  return React.createElement(
    "div",
    {
      className: captionContainerClass,
      style: captionStyle,
    },
    captionChildren
  );
};

export default HyperImageTextOverlay;
