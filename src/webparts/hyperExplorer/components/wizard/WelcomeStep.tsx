import * as React from "react";
import styles from "./WelcomeStep.module.scss";

export interface IWelcomeStepProps {
  onGetStarted: () => void;
}

var WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  return React.createElement("div", undefined,

    // ── DWx Brand Strip ──
    React.createElement("div", { className: styles.brandStrip },
      React.createElement("div", { className: styles.brandLeft },
        React.createElement("div", { className: styles.brandNameBlock },
          React.createElement("span", { className: styles.brandDwx },
            "DW",
            React.createElement("span", { className: styles.brandDwxAccent }, "x")
          ),
          React.createElement("span", { className: styles.brandSub }, "Digital Workplace Excellence")
        )
      ),
      React.createElement("span", { className: styles.brandBadge },
        React.createElement("span", { className: styles.brandBadgeStar, "aria-hidden": "true" }, "\u2B50"),
        " HyperParts Suite"
      )
    ),

    // ── Hero Banner ──
    React.createElement("div", { className: styles.splashHero },
      React.createElement("div", { className: styles.splashHeroBrand },
        React.createElement("div", { className: styles.splashLogoRow },
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDCC2"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Explorer")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Browse, preview, and manage files"),
          " all within one web part.",
          React.createElement("br"),
          "5 layouts, ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "lightbox gallery"),
          ", drag & drop upload."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 5 Layouts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFB2"),
          React.createElement("div", { className: styles.splashCardTitle }, "5 Layouts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Grid, masonry, list, filmstrip & tiles")
        ),
        // Card 2: Multi-Preview
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDC41\uFE0F"),
          React.createElement("div", { className: styles.splashCardTitle }, "Multi-Preview"),
          React.createElement("div", { className: styles.splashCardDesc }, "Tabbed or split-screen file preview")
        ),
        // Card 3: Lightbox Gallery
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDDBC\uFE0F"),
          React.createElement("div", { className: styles.splashCardTitle }, "Lightbox Gallery"),
          React.createElement("div", { className: styles.splashCardDesc }, "Full-screen zoom, pan & slideshow")
        ),
        // Card 4: Drag & Drop
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCE4"),
          React.createElement("div", { className: styles.splashCardTitle }, "Drag & Drop"),
          React.createElement("div", { className: styles.splashCardDesc }, "Upload files directly to SharePoint")
        )
      ),

      // CTA Button
      React.createElement("button", {
        className: styles.splashCta,
        onClick: props.onGetStarted,
        type: "button",
      }, "Get Started"),

      // Hint
      React.createElement("div", { className: styles.splashHint },
        "Connects to any SharePoint document library"
      )
    )
  );
};

export default WelcomeStep;
