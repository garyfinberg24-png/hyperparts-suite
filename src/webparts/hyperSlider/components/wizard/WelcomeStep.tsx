import * as React from "react";
import styles from "./WelcomeStep.module.scss";

export interface IWelcomeStepProps {
  onGetStarted: () => void;
}

const WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83C\uDFAC"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Slider")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Slider Revolution"),
          "-class presentations.",
          React.createElement("br"),
          "Layer-based composition with ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "48 animations"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 8 Layer Types
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFB2"),
          React.createElement("div", { className: styles.splashCardTitle }, "8 Layer Types"),
          React.createElement("div", { className: styles.splashCardDesc }, "Text, image, video, button, shape & more")
        ),
        // Card 2: 48 Animations
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2728"),
          React.createElement("div", { className: styles.splashCardTitle }, "48 Animations"),
          React.createElement("div", { className: styles.splashCardDesc }, "Entrance, exit, loop & hover effects")
        ),
        // Card 3: 4 Modes
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD04"),
          React.createElement("div", { className: styles.splashCardTitle }, "4 Modes"),
          React.createElement("div", { className: styles.splashCardDesc }, "Slider, carousel, hero & before/after")
        ),
        // Card 4: Particles
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDF05"),
          React.createElement("div", { className: styles.splashCardTitle }, "Particles"),
          React.createElement("div", { className: styles.splashCardDesc }, "Snow, particles & parallax overlays")
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
        "Build cinematic presentations in minutes"
      )
    )
  );
};

export default WelcomeStep;
