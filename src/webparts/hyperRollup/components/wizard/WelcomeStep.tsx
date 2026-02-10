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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDCDA"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Rollup")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Aggregate"),
          " content across sites & lists.",
          React.createElement("br"),
          "11 layouts from cards to calendars, powered by ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "Handlebars templates"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: Cross-Site
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDF10"),
          React.createElement("div", { className: styles.splashCardTitle }, "Cross-Site"),
          React.createElement("div", { className: styles.splashCardDesc }, "Pull from any site collection in your tenant")
        ),
        // Card 2: 11 Layouts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCCA"),
          React.createElement("div", { className: styles.splashCardTitle }, "11 Layouts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Cards, table, Kanban, calendar, timeline & more")
        ),
        // Card 3: Templates
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD27"),
          React.createElement("div", { className: styles.splashCardTitle }, "Templates"),
          React.createElement("div", { className: styles.splashCardDesc }, "10 Handlebars templates, 5 helpers")
        ),
        // Card 4: Filters & Facets
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD0E"),
          React.createElement("div", { className: styles.splashCardTitle }, "Filters & Facets"),
          React.createElement("div", { className: styles.splashCardDesc }, "Dynamic refiners with aggregation")
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
        "Connect your first data source in minutes"
      )
    )
  );
};

export default WelcomeStep;
