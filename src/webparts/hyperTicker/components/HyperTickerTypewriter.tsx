import * as React from "react";
import type { ITickerItem } from "../models";
import { useHyperTickerStore } from "../store/useHyperTickerStore";
import styles from "./HyperTickerTypewriter.module.scss";

export interface IHyperTickerTypewriterProps {
  items: ITickerItem[];
  speed: number;
  severityClassName: string;
}

const HyperTickerTypewriter: React.FC<IHyperTickerTypewriterProps> = function (props) {
  const { items, speed } = props;
  const currentItemIndex = useHyperTickerStore(function (s) { return s.currentItemIndex; });
  const nextItem = useHyperTickerStore(function (s) { return s.nextItem; });

  const charIndexRef = React.useRef<number>(0);
  const rafIdRef = React.useRef<number>(0);
  const lastTimeRef = React.useRef<number>(0);
  const pauseTimerRef = React.useRef<number>(0);
  const [displayText, setDisplayText] = React.useState<string>("");
  const [isTyping, setIsTyping] = React.useState<boolean>(true);

  // Characters per second: speed 1 = 8cps, speed 10 = 80cps
  const charsPerSecond = speed * 8;
  const msPerChar = 1000 / charsPerSecond;

  // Pause between items: slower = longer pause
  const pauseMs = (11 - speed) * 500;

  const safeIndex = items.length > 0 ? currentItemIndex % items.length : 0;
  const currentItem = items.length > 0 ? items[safeIndex] : undefined;
  const fullText = currentItem ? currentItem.title : "";

  // Typewriter animation loop — MUST be called unconditionally (React hooks rules)
  React.useEffect(function () {
    if (items.length === 0 || !fullText) return;

    charIndexRef.current = 0;
    setDisplayText("");
    setIsTyping(true);

    function animateFrame(timestamp: number): void {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= msPerChar) {
        lastTimeRef.current = timestamp;
        charIndexRef.current = charIndexRef.current + 1;

        if (charIndexRef.current <= fullText.length) {
          setDisplayText(fullText.substring(0, charIndexRef.current));
          rafIdRef.current = requestAnimationFrame(animateFrame);
        } else {
          // Typing complete — pause then advance
          setIsTyping(false);
          pauseTimerRef.current = window.setTimeout(function () {
            nextItem(items.length);
          }, pauseMs);
        }
      } else {
        rafIdRef.current = requestAnimationFrame(animateFrame);
      }
    }

    lastTimeRef.current = 0;
    rafIdRef.current = requestAnimationFrame(animateFrame);

    return function () {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = 0;
      }
    };
  }, [safeIndex, fullText, msPerChar, pauseMs, items.length, nextItem]);

  // Early return AFTER all hooks have been called
  if (items.length === 0 || !currentItem) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const iconClassName = "ms-Icon ms-Icon--" + currentItem.iconName;

  const cursorStyle: React.CSSProperties = {
    animationName: isTyping ? "none" : "cursorBlink",
    animationDuration: "0.7s",
    animationIterationCount: "infinite",
  };

  return React.createElement(
    "div",
    {
      className: styles.typewriterContainer,
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
      "aria-label": currentItem.title,
    },
    React.createElement("i", {
      className: iconClassName + " " + styles.typewriterIcon,
      "aria-hidden": "true",
      style: { fontSize: 14 },
    }),
    React.createElement(
      "span",
      { className: styles.typewriterText },
      displayText
    ),
    React.createElement("span", {
      className: styles.typewriterCursor,
      style: cursorStyle,
      "aria-hidden": "true",
    })
  );
};

export default HyperTickerTypewriter;
