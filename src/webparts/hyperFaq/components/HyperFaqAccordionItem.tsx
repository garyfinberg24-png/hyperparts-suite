import * as React from "react";
import type { IFaqItem, FaqAccordionStyle } from "../models";
import { sanitizeHtml } from "../utils/faqUtils";
import styles from "./HyperFaqAccordionItem.module.scss";

export interface IHyperFaqAccordionItemProps {
  item: IFaqItem;
  isExpanded: boolean;
  onToggle: () => void;
  accordionStyle: FaqAccordionStyle;
  showViewCount: boolean;
  onFirstExpand?: (item: IFaqItem) => void;
}

function getStyleClass(accordionStyle: FaqAccordionStyle): string {
  const map: Record<FaqAccordionStyle, string> = {
    clean: styles.styleClean,
    boxed: styles.styleBoxed,
    bordered: styles.styleBordered,
    minimal: styles.styleMinimal,
  };
  return map[accordionStyle] || styles.styleClean;
}

const HyperFaqAccordionItem: React.FC<IHyperFaqAccordionItemProps> = function (props) {
  const expandedOnceRef = React.useRef<boolean>(false);

  // Track first expansion for view count
  React.useEffect(function () {
    if (props.isExpanded && !expandedOnceRef.current) {
      expandedOnceRef.current = true;
      if (props.onFirstExpand) {
        props.onFirstExpand(props.item);
      }
    }
  }, [props.isExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  const chevronClass = props.isExpanded
    ? styles.chevron + " " + styles.chevronExpanded
    : styles.chevron;

  const bodyClass = props.isExpanded
    ? styles.accordionBody + " " + styles.accordionBodyExpanded
    : styles.accordionBody;

  const styleClass = getStyleClass(props.accordionStyle);
  const itemClass = styles.accordionItem + " " + styleClass;

  const sanitizedAnswer = sanitizeHtml(props.item.answer);

  // Deep link anchor ID
  const itemElementId = "faq-item-" + String(props.item.id);

  return React.createElement(
    "div",
    { className: itemClass, id: itemElementId },
    React.createElement(
      "button",
      {
        className: styles.accordionHeader,
        onClick: props.onToggle,
        "aria-expanded": props.isExpanded,
        "aria-controls": "faq-body-" + String(props.item.id),
        type: "button",
      },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--ChevronRight " + chevronClass,
        "aria-hidden": "true",
      }),
      React.createElement("span", { className: styles.questionText }, props.item.question),
      props.showViewCount && props.item.viewCount > 0
        ? React.createElement(
            "span",
            { className: styles.viewCount },
            String(props.item.viewCount) + " views"
          )
        : undefined
    ),
    React.createElement(
      "div",
      {
        className: bodyClass,
        id: "faq-body-" + String(props.item.id),
        role: "region",
        "aria-labelledby": itemElementId,
      },
      React.createElement("div", {
        className: styles.answerContent,
        dangerouslySetInnerHTML: { __html: sanitizedAnswer },
      }),
      props.children
    )
  );
};

export default HyperFaqAccordionItem;
