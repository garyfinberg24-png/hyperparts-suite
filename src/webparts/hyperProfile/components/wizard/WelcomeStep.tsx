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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDC64"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Profile")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Showcase"),
          " user profiles with live presence.",
          React.createElement("br"),
          "7 templates, 9 quick actions & ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "completeness score"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 7 Templates
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
          React.createElement("div", { className: styles.splashCardTitle }, "7 Templates"),
          React.createElement("div", { className: styles.splashCardDesc }, "Executive, compact, hero, sidebar & more")
        ),
        // Card 2: Live Presence
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDFE2"),
          React.createElement("div", { className: styles.splashCardTitle }, "Live Presence"),
          React.createElement("div", { className: styles.splashCardDesc }, "8 status types with auto-refresh")
        ),
        // Card 3: 9 Quick Actions
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u26A1"),
          React.createElement("div", { className: styles.splashCardTitle }, "9 Quick Actions"),
          React.createElement("div", { className: styles.splashCardDesc }, "Email, chat, call, schedule & vCard")
        ),
        // Card 4: Completeness
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCCB"),
          React.createElement("div", { className: styles.splashCardTitle }, "Completeness"),
          React.createElement("div", { className: styles.splashCardDesc }, "Score with progress bar or star rating")
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
        "Profiles auto-populate from Entra ID"
      )
    )
  );
};

export default WelcomeStep;
