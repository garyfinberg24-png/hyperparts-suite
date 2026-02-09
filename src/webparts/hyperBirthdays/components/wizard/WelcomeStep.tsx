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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83C\uDF82"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Birthdays")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Celebrate"),
          " every milestone.",
          React.createElement("br"),
          "Birthdays, anniversaries & ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "8 celebration types"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 8 Types
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDF89"),
          React.createElement("div", { className: styles.splashCardTitle }, "8 Types"),
          React.createElement("div", { className: styles.splashCardDesc }, "Birthday, anniversary, new hire & more")
        ),
        // Card 2: Month Calendar
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCC5"),
          React.createElement("div", { className: styles.splashCardTitle }, "Month Calendar"),
          React.createElement("div", { className: styles.splashCardDesc }, "7x6 grid with emoji dots")
        ),
        // Card 3: Milestones
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFC6"),
          React.createElement("div", { className: styles.splashCardTitle }, "Milestones"),
          React.createElement("div", { className: styles.splashCardDesc }, "7 badges for years-of-service")
        ),
        // Card 4: Animations
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDF86"),
          React.createElement("div", { className: styles.splashCardTitle }, "Animations"),
          React.createElement("div", { className: styles.splashCardDesc }, "Confetti, balloons & sparkle effects")
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
        "Auto-populated from Entra ID dates"
      )
    )
  );
};

export default WelcomeStep;
