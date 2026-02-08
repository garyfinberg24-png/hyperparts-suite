import * as React from "react";
import type { IHyperSearchResult } from "../../models";
import styles from "./ResultTypes.module.scss";

export interface ISiteResultProps {
  result: IHyperSearchResult;
}

const SiteResult: React.FC<ISiteResultProps> = function (props) {
  const result = props.result;

  const bodyChildren: React.ReactElement[] = [
    React.createElement(
      "a",
      {
        key: "title",
        className: styles.title,
        href: result.url,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      result.title || "Site"
    ),
  ];

  if (result.description) {
    bodyChildren.push(
      React.createElement("div", { key: "desc", className: styles.summary }, result.description)
    );
  }

  const metaItems: React.ReactElement[] = [];
  if (result.url) {
    metaItems.push(
      React.createElement("span", { key: "url", className: styles.metaItem }, result.url)
    );
  }
  if (metaItems.length > 0) {
    bodyChildren.push(
      React.createElement("div", { key: "meta", className: styles.meta }, metaItems)
    );
  }

  return React.createElement(
    "div",
    { className: styles.resultTypeItem },
    React.createElement(
      "div",
      { className: styles.iconContainer + " " + styles.siteIcon, "aria-hidden": "true" },
      "\uD83C\uDFE2"
    ),
    React.createElement("div", { className: styles.body }, bodyChildren)
  );
};

export default SiteResult;
