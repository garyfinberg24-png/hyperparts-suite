import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./TypewriterEffect.module.scss");

export interface ITypewriterEffectProps {
  text: string;
  speed?: number;
  showCursor?: boolean;
}

const DEFAULT_SPEED = 50;

const TypewriterEffect: React.FC<ITypewriterEffectProps> = function (props) {
  const { text, speed, showCursor } = props;
  const typingSpeed = speed !== undefined ? speed : DEFAULT_SPEED;
  const cursorVisible = showCursor !== undefined ? showCursor : true;

  const [displayedLength, setDisplayedLength] = React.useState<number>(0);

  React.useEffect(function () {
    // Reset when text changes
    setDisplayedLength(0);

    if (!text || text.length === 0) {
      return;
    }

    const intervalId = setInterval(function () {
      setDisplayedLength(function (prev) {
        const next = prev + 1;
        if (next >= text.length) {
          clearInterval(intervalId);
          return text.length;
        }
        return next;
      });
    }, typingSpeed);

    return function () {
      clearInterval(intervalId);
    };
  }, [text, typingSpeed]);

  const displayedText = text.substring(0, displayedLength);

  const childElements: React.ReactNode[] = [displayedText];

  if (cursorVisible) {
    childElements.push(
      React.createElement("span", {
        key: "cursor",
        className: styles.cursor,
        "aria-hidden": "true",
      })
    );
  }

  return React.createElement(
    "span",
    {
      className: styles.typewriter,
      "aria-label": text,
      role: "text",
    },
    childElements
  );
};

export default TypewriterEffect;
