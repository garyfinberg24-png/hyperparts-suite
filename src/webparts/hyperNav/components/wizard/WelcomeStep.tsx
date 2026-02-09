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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDE80"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Nav")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Navigate"),
          " smarter, not harder.",
          React.createElement("br"),
          "8 layouts with ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "audience targeting"),
          " & link health."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 8 Layouts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCCC"),
          React.createElement("div", { className: styles.splashCardTitle }, "8 Layouts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Tiles, mega menu, sidebar, icon grid & more")
        ),
        // Card 2: Audience Filter
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD12"),
          React.createElement("div", { className: styles.splashCardTitle }, "Audience Filter"),
          React.createElement("div", { className: styles.splashCardDesc }, "Show links based on AD group membership")
        ),
        // Card 3: Pinned Links
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCCD"),
          React.createElement("div", { className: styles.splashCardTitle }, "Pinned Links"),
          React.createElement("div", { className: styles.splashCardDesc }, "Users pin their favorites for quick access")
        ),
        // Card 4: Link Health
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDFE2"),
          React.createElement("div", { className: styles.splashCardTitle }, "Link Health"),
          React.createElement("div", { className: styles.splashCardDesc }, "Auto-check for broken links in edit mode")
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
        "Build your navigation in a few clicks"
      )
    )
  );
};

export default WelcomeStep;
