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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDC65"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Directory")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Find anyone"),
          " in your organization instantly.",
          React.createElement("br"),
          "7 layouts including ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "RollerDex 3D"),
          " & org chart."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 7 Layouts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFB2"),
          React.createElement("div", { className: styles.splashCardTitle }, "7 Layouts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Grid, list, masonry, org chart & 3D RollerDex")
        ),
        // Card 2: Live Presence
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDFE2"),
          React.createElement("div", { className: styles.splashCardTitle }, "Live Presence"),
          React.createElement("div", { className: styles.splashCardDesc }, "Real-time status from Microsoft Graph")
        ),
        // Card 3: Smart Search
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD0D"),
          React.createElement("div", { className: styles.splashCardTitle }, "Smart Search"),
          React.createElement("div", { className: styles.splashCardDesc }, "Weighted search + A-Z alphabetic index")
        ),
        // Card 4: Quick Actions
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCDE"),
          React.createElement("div", { className: styles.splashCardTitle }, "Quick Actions"),
          React.createElement("div", { className: styles.splashCardDesc }, "Email, chat, call & schedule in one click")
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
        "Auto-populated from Entra ID"
      )
    )
  );
};

export default WelcomeStep;
