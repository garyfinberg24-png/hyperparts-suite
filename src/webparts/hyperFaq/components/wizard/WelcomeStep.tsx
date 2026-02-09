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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\u2754"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "FAQ")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Answer"),
          " questions before they're asked.",
          React.createElement("br"),
          "Searchable accordion with ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "voting & deep links"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: Weighted Search
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
          React.createElement("div", { className: styles.splashCardTitle }, "Weighted Search"),
          React.createElement("div", { className: styles.splashCardDesc }, "Fuzzy matching across questions & tags")
        ),
        // Card 2: 4 Styles
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
          React.createElement("div", { className: styles.splashCardTitle }, "4 Styles"),
          React.createElement("div", { className: styles.splashCardDesc }, "Classic, bordered, card & minimal")
        ),
        // Card 3: Voting
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDC4D"),
          React.createElement("div", { className: styles.splashCardTitle }, "Voting"),
          React.createElement("div", { className: styles.splashCardDesc }, "Thumbs up/down to surface best answers")
        ),
        // Card 4: Ask Guru
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCAC"),
          React.createElement("div", { className: styles.splashCardTitle }, "Ask Guru"),
          React.createElement("div", { className: styles.splashCardDesc }, "Submit questions to a review queue")
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
        "Build your knowledge base in minutes"
      )
    )
  );
};

export default WelcomeStep;
