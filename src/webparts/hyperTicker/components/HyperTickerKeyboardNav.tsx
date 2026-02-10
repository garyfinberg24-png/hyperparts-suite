import * as React from "react";

export interface IHyperTickerKeyboardNavProps {
  itemCount: number;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onItemActivate?: (index: number) => void;
  role?: string;
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Keyboard navigation wrapper for ticker modes that show individual items.
 * Handles Tab, Arrow keys, Home, End, Enter, Space, and Escape.
 */
const HyperTickerKeyboardNav: React.FC<IHyperTickerKeyboardNavProps> = function (props) {
  const {
    itemCount,
    activeIndex,
    onActiveIndexChange,
    onItemActivate,
    role,
    ariaLabel,
    className,
    children,
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(
    // eslint-disable-next-line @rushstack/no-new-null
    null
  );

  const handleKeyDown = React.useCallback(function (e: React.KeyboardEvent): void {
    if (itemCount === 0) return;

    let handled = true;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      const next = (activeIndex + 1) % itemCount;
      onActiveIndexChange(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      const prev = (activeIndex - 1 + itemCount) % itemCount;
      onActiveIndexChange(prev);
    } else if (e.key === "Home") {
      onActiveIndexChange(0);
    } else if (e.key === "End") {
      onActiveIndexChange(itemCount - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      if (onItemActivate) {
        onItemActivate(activeIndex);
      }
    } else if (e.key === "Escape") {
      // Blur the container to exit keyboard navigation
      if (containerRef.current) {
        containerRef.current.blur();
      }
    } else {
      handled = false;
    }

    if (handled) {
      e.preventDefault();
    }
  }, [itemCount, activeIndex, onActiveIndexChange, onItemActivate]);

  return React.createElement("div", {
    ref: containerRef,
    className: className,
    role: role || "listbox",
    "aria-label": ariaLabel || "Ticker items",
    "aria-activedescendant": itemCount > 0 ? "ticker-item-" + String(activeIndex) : undefined,
    tabIndex: 0,
    onKeyDown: handleKeyDown,
  }, children);
};

export default HyperTickerKeyboardNav;
