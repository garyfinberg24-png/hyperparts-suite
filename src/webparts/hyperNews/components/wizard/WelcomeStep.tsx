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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDCF0"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "News")
        ),
        React.createElement("div", { className: styles.splashTagline },
          "A ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "multi-source"),
          " news aggregator",
          React.createElement("br"),
          "that far exceeds SharePoint's ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "built-in News"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 6 Content Sources
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCF0"),
          React.createElement("div", { className: styles.splashCardTitle }, "6 Content Sources"),
          React.createElement("div", { className: styles.splashCardDesc }, "SP News, lists, external URLs, RSS, manual & Graph")
        ),
        // Card 2: 12 Layouts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
          React.createElement("div", { className: styles.splashCardTitle }, "12 Layouts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Grid, magazine, newspaper, carousel & more")
        ),
        // Card 3: Rich Interactions
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2728"),
          React.createElement("div", { className: styles.splashCardTitle }, "Rich Interactions"),
          React.createElement("div", { className: styles.splashCardDesc }, "Reactions, bookmarks, read tracking & quick read")
        ),
        // Card 4: Smart Filtering
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
          React.createElement("div", { className: styles.splashCardTitle }, "Smart Filtering"),
          React.createElement("div", { className: styles.splashCardDesc }, "Category, author, date range & infinite scroll")
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
        "Set up your content sources, layout, and features in a few clicks"
      )
    )
  );
};

export default WelcomeStep;
