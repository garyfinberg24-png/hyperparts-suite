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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83C\uDF1F"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Spotlight")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Celebrate"),
          " your people.",
          React.createElement("br"),
          "9 layouts, 7 celebration categories & ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "Get to Know Me"),
          " sections."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 9 Layouts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
          React.createElement("div", { className: styles.splashCardTitle }, "9 Layouts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Grid, banner, timeline, wall of fame & more")
        ),
        // Card 2: Get to Know Me
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDC64"),
          React.createElement("div", { className: styles.splashCardTitle }, "Get to Know Me"),
          React.createElement("div", { className: styles.splashCardDesc }, "Hobbies, skills, quotes & expandable cards")
        ),
        // Card 3: 7 Categories
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDF89"),
          React.createElement("div", { className: styles.splashCardTitle }, "7 Categories"),
          React.createElement("div", { className: styles.splashCardDesc }, "New hire, promotion, birthday & more")
        ),
        // Card 4: Runtime Controls
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD00"),
          React.createElement("div", { className: styles.splashCardTitle }, "Runtime Controls"),
          React.createElement("div", { className: styles.splashCardDesc }, "View switcher & department filter toolbar")
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
        "Set up your spotlight in a few clicks"
      )
    )
  );
};

export default WelcomeStep;
