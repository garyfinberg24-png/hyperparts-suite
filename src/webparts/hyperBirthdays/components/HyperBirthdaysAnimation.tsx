import * as React from "react";
import type { AnimationType } from "../models";
import styles from "./HyperBirthdaysAnimation.module.scss";

export interface IHyperBirthdaysAnimationProps {
  animationType: AnimationType;
  enabled: boolean;
}

const AUTO_DISMISS_MS = 3500;

const HyperBirthdaysAnimation: React.FC<IHyperBirthdaysAnimationProps> = function (props) {
  const [visible, setVisible] = React.useState<boolean>(true);
  const timerRef = React.useRef<number>(0);

  React.useEffect(function () {
    if (!props.enabled || props.animationType === "none") {
      setVisible(false);
      return;
    }

    setVisible(true);
    timerRef.current = window.setTimeout(function () {
      setVisible(false);
    }, AUTO_DISMISS_MS);

    return function () {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, [props.enabled, props.animationType]);

  if (!visible || !props.enabled || props.animationType === "none") {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  let content: React.ReactNode;

  if (props.animationType === "confetti") {
    const pieces: React.ReactNode[] = [];
    for (let i = 1; i <= 10; i++) {
      const cls = (styles as Record<string, string>)["confetti" + String(i)] || "";
      pieces.push(
        React.createElement("div", {
          key: "c" + String(i),
          className: styles.confetti + " " + cls,
        })
      );
    }
    content = pieces;
  } else if (props.animationType === "balloons") {
    const balloons: React.ReactNode[] = [];
    const balloonEmojis = ["\uD83C\uDF88", "\uD83C\uDF88", "\uD83C\uDF88", "\uD83C\uDF88", "\uD83C\uDF88"];
    for (let i = 1; i <= 5; i++) {
      const cls = (styles as Record<string, string>)["balloon" + String(i)] || "";
      balloons.push(
        React.createElement("div", {
          key: "b" + String(i),
          className: styles.balloon + " " + cls,
        }, balloonEmojis[i - 1])
      );
    }
    content = balloons;
  } else if (props.animationType === "sparkle") {
    const sparkles: React.ReactNode[] = [];
    for (let i = 1; i <= 6; i++) {
      const cls = (styles as Record<string, string>)["sparkle" + String(i)] || "";
      sparkles.push(
        React.createElement("div", {
          key: "s" + String(i),
          className: styles.sparkle + " " + cls,
        }, "\u2728")
      );
    }
    content = sparkles;
  }

  return React.createElement(
    "div",
    { className: styles.animationOverlay, "aria-hidden": "true" },
    content
  );
};

export default HyperBirthdaysAnimation;
