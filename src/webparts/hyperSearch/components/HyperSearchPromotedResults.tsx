import * as React from "react";
import type { IPromotedResult } from "../models";
import styles from "./HyperSearchPromotedResults.module.scss";

export interface IHyperSearchPromotedResultsProps {
  promotedResults: IPromotedResult[];
}

const HyperSearchPromotedResults: React.FC<IHyperSearchPromotedResultsProps> = function (props) {
  if (props.promotedResults.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const items: React.ReactElement[] = [];
  props.promotedResults.forEach(function (pr) {
    const bodyChildren: React.ReactElement[] = [
      React.createElement(
        "a",
        {
          key: "title",
          className: styles.promotedTitle,
          href: pr.url,
          target: pr.openInNewTab ? "_blank" : "_self",
          rel: pr.openInNewTab ? "noopener noreferrer" : undefined,
        },
        pr.title
      ),
    ];

    if (pr.description) {
      bodyChildren.push(
        React.createElement("div", { key: "desc", className: styles.promotedDescription }, pr.description)
      );
    }

    items.push(
      React.createElement(
        "div",
        { key: pr.id, className: styles.promotedItem },
        React.createElement("span", { className: styles.promotedIcon, "aria-hidden": "true" }, "\u2B50"),
        React.createElement("div", { className: styles.promotedBody }, bodyChildren)
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.promotedSection },
    React.createElement("div", { className: styles.promotedLabel }, "Promoted"),
    items
  );
};

export default HyperSearchPromotedResults;
