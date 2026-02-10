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
          React.createElement("span", { className: styles.splashTaglineStrong }, "15 layouts"),
          " with ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "color engine"),
          " & ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "demo mode"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 15 Layouts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCCC"),
          React.createElement("div", { className: styles.splashCardTitle }, "15 Layouts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Topbar, mega menu, sidebar, FAB, command palette & more")
        ),
        // Card 2: Color Engine
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
          React.createElement("div", { className: styles.splashCardTitle }, "Color Engine"),
          React.createElement("div", { className: styles.splashCardDesc }, "Full link + button state colors with dropdown panel config")
        ),
        // Card 3: Template Gallery
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDE80"),
          React.createElement("div", { className: styles.splashCardTitle }, "12 Templates"),
          React.createElement("div", { className: styles.splashCardDesc }, "Pre-built configs for corporate, department, portal & more")
        ),
        // Card 4: Demo Mode
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD27"),
          React.createElement("div", { className: styles.splashCardTitle }, "Demo Mode"),
          React.createElement("div", { className: styles.splashCardDesc }, "Live control bar to showcase every feature in real time")
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
