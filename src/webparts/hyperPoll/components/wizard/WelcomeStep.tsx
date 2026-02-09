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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDCCA"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Poll")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Engage"),
          " your audience with instant polls.",
          React.createElement("br"),
          "6 question types, ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "live charts"),
          " & NPS."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 6 Question Types
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2713\uFE0F"),
          React.createElement("div", { className: styles.splashCardTitle }, "6 Question Types"),
          React.createElement("div", { className: styles.splashCardDesc }, "Choice, rating, NPS, ranking & open text")
        ),
        // Card 2: Live Charts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCC8"),
          React.createElement("div", { className: styles.splashCardTitle }, "Live Charts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Bar, pie & donut \u2014 pure CSS/SVG")
        ),
        // Card 3: Templates
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCE6"),
          React.createElement("div", { className: styles.splashCardTitle }, "Templates"),
          React.createElement("div", { className: styles.splashCardDesc }, "NPS Survey, Event Feedback & Quick Pulse")
        ),
        // Card 4: Export
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCBE"),
          React.createElement("div", { className: styles.splashCardTitle }, "Export"),
          React.createElement("div", { className: styles.splashCardDesc }, "CSV & JSON export with full results")
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
        "Create your first poll in seconds"
      )
    )
  );
};

export default WelcomeStep;
