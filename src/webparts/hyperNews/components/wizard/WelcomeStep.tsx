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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDCF0"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "News")
        ),
        React.createElement("div", { className: styles.splashTagline },
          "News that ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "engages"),
          ", not just informs.",
          React.createElement("br"),
          "12 layouts, reactions & ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "infinite scroll"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 12 Layouts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCC4"),
          React.createElement("div", { className: styles.splashCardTitle }, "12 Layouts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Grid, magazine, timeline, carousel & more")
        ),
        // Card 2: Emoji Reactions
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDE4C"),
          React.createElement("div", { className: styles.splashCardTitle }, "Emoji Reactions"),
          React.createElement("div", { className: styles.splashCardDesc }, "5 reaction types for reader engagement")
        ),
        // Card 3: Smart Filters
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
          React.createElement("div", { className: styles.splashCardTitle }, "Smart Filters"),
          React.createElement("div", { className: styles.splashCardDesc }, "Category, author, date & search")
        ),
        // Card 4: Infinite Scroll
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u267E"),
          React.createElement("div", { className: styles.splashCardTitle }, "Infinite Scroll"),
          React.createElement("div", { className: styles.splashCardDesc }, "Smooth lazy-loading for large feeds")
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
        "Connect to your news source in a few clicks"
      )
    )
  );
};

export default WelcomeStep;
