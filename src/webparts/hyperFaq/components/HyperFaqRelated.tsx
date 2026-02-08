import * as React from "react";
import type { IFaqItem } from "../models";
import { getRelatedFaqs } from "../utils/faqUtils";
import styles from "./HyperFaqRelated.module.scss";

export interface IHyperFaqRelatedProps {
  item: IFaqItem;
  allItems: IFaqItem[];
  onNavigate: (itemId: number) => void;
  relatedLabel: string;
}

const MAX_RELATED = 3;

const HyperFaqRelated: React.FC<IHyperFaqRelatedProps> = function (props) {
  const related = React.useMemo(function () {
    return getRelatedFaqs(props.item, props.allItems, MAX_RELATED);
  }, [props.item, props.allItems]);

  if (related.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const listItems: React.ReactNode[] = [];
  related.forEach(function (relItem) {
    listItems.push(
      React.createElement(
        "li",
        { key: relItem.id, className: styles.relatedItem },
        React.createElement(
          "button",
          {
            className: styles.relatedLink,
            onClick: function (): void { props.onNavigate(relItem.id); },
            type: "button",
          },
          React.createElement("i", {
            className: "ms-Icon ms-Icon--Forward",
            "aria-hidden": "true",
          }),
          relItem.question
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.relatedContainer },
    React.createElement("div", { className: styles.relatedLabel }, props.relatedLabel),
    React.createElement("ul", { className: styles.relatedList }, listItems)
  );
};

export default HyperFaqRelated;
