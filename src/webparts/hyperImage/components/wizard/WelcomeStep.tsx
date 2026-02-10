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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDDBC\uFE0F"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Image")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "The most powerful image web part"),
          " for SharePoint.",
          React.createElement("br"),
          "22 shape masks, 10 filter presets, ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "13 hover effects"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 22 Shapes
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2B22"),
          React.createElement("div", { className: styles.splashCardTitle }, "22 Shape Masks"),
          React.createElement("div", { className: styles.splashCardDesc }, "Circle, hexagon, blob, star & 18 more clip-path shapes")
        ),
        // Card 2: Filters & Effects
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2600"),
          React.createElement("div", { className: styles.splashCardTitle }, "Filter & Effects"),
          React.createElement("div", { className: styles.splashCardDesc }, "10 presets plus custom sliders for grayscale, sepia, blur & more")
        ),
        // Card 3: Text & Captions
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2261"),
          React.createElement("div", { className: styles.splashCardTitle }, "Text & Captions"),
          React.createElement("div", { className: styles.splashCardDesc }, "Title, subtitle & body text as overlays or callout boxes below")
        ),
        // Card 4: Hover Animations
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2728"),
          React.createElement("div", { className: styles.splashCardTitle }, "Hover Animations"),
          React.createElement("div", { className: styles.splashCardDesc }, "13 interactive effects including zoom, tilt 3D & shine sweep")
        )
      ),

      // CTA button
      React.createElement("button", {
        className: styles.splashCta,
        onClick: props.onGetStarted,
        type: "button",
      }, "Get Started \u2192"),

      // Hint
      React.createElement("span", { className: styles.splashHint },
        "Transform any image into a stunning visual experience"
      )
    )
  );
};

export default WelcomeStep;
