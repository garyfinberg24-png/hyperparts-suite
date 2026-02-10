import * as React from "react";

export interface IHyperTickerCopyButtonProps {
  text: string;
}

const HyperTickerCopyButton: React.FC<IHyperTickerCopyButtonProps> = function (props) {
  const [copied, setCopied] = React.useState<boolean>(false);
  const timerRef = React.useRef<number>(0);

  React.useEffect(function () {
    return function () {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClick = React.useCallback(function (e: React.MouseEvent): void {
    e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(props.text).then(function () {
        setCopied(true);
        timerRef.current = window.setTimeout(function () {
          setCopied(false);
          timerRef.current = 0;
        }, 1500);
      }).catch(function () {
        // Fallback: create temporary textarea
        fallbackCopy(props.text);
        setCopied(true);
        timerRef.current = window.setTimeout(function () {
          setCopied(false);
          timerRef.current = 0;
        }, 1500);
      });
    } else {
      fallbackCopy(props.text);
      setCopied(true);
      timerRef.current = window.setTimeout(function () {
        setCopied(false);
        timerRef.current = 0;
      }, 1500);
    }
  }, [props.text]);

  return React.createElement("button", {
    type: "button",
    onClick: handleClick,
    "aria-label": copied ? "Copied!" : "Copy to clipboard",
    title: copied ? "Copied!" : "Copy",
    style: {
      background: "none",
      border: "none",
      color: "inherit",
      cursor: "pointer",
      padding: "2px 4px",
      fontSize: 12,
      opacity: copied ? 1 : 0.6,
      lineHeight: 1,
      flexShrink: 0,
    },
  }, copied ? "\u2713" : "\uD83D\uDCCB");
};

function fallbackCopy(text: string): void {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } catch (copyErr) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // silent
  }
  document.body.removeChild(textarea);
}

export default HyperTickerCopyButton;
