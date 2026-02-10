import * as React from "react";
import type { ITickerItem } from "../models";
import HyperTickerItem from "./HyperTickerItem";
import HyperTickerKeyboardNav from "./HyperTickerKeyboardNav";
import styles from "./HyperTickerStacked.module.scss";

export interface IHyperTickerStackedProps {
  items: ITickerItem[];
  severityClassName: string;
  enableDismiss?: boolean;
  onDismiss?: (itemId: string) => void;
  enableCopy?: boolean;
  onItemClick?: (item: ITickerItem) => void;
}

const HyperTickerStacked: React.FC<IHyperTickerStackedProps> = function (props) {
  const { items, severityClassName, enableDismiss, onDismiss, enableCopy, onItemClick } = props;
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  if (items.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const handleActivate = React.useCallback(function (index: number): void {
    if (onItemClick && items[index]) {
      onItemClick(items[index]);
    }
  }, [onItemClick, items]);

  const cardElements: React.ReactNode[] = [];
  items.forEach(function (item, index) {
    const severityCardClass = (styles as Record<string, string>)[
      "stackedCard" + item.severity.charAt(0).toUpperCase() + item.severity.slice(1)
    ] || "";
    const isActive = index === activeIndex;

    cardElements.push(
      React.createElement(
        "div",
        {
          key: item.id || String(index),
          id: "ticker-item-" + String(index),
          className: styles.stackedCard + " " + severityCardClass + (isActive ? " " + styles.stackedCardActive : ""),
          role: "option",
          "aria-selected": isActive,
        },
        React.createElement(HyperTickerItem, {
          item: item,
          severityClassName: severityClassName,
          onClick: onItemClick,
          enableDismiss: enableDismiss,
          onDismiss: onDismiss,
          enableCopy: enableCopy,
        })
      )
    );
  });

  return React.createElement(
    HyperTickerKeyboardNav,
    {
      itemCount: items.length,
      activeIndex: activeIndex,
      onActiveIndexChange: setActiveIndex,
      onItemActivate: handleActivate,
      role: "listbox",
      ariaLabel: "Ticker items",
      className: styles.stackedContainer,
    },
    cardElements
  );
};

export default HyperTickerStacked;
