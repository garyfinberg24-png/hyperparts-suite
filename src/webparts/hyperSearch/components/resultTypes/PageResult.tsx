import * as React from "react";
import type { IHyperSearchResult } from "../../models";
import styles from "./ResultTypes.module.scss";

export interface IPageResultProps {
  result: IHyperSearchResult;
  showPath: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

const PageResult: React.FC<IPageResultProps> = function (props) {
  const result = props.result;
  const summary = result.hitHighlightedSummary
    ? stripHtml(result.hitHighlightedSummary)
    : result.description || "";

  const metaItems: React.ReactElement[] = [];
  if (result.siteName) {
    metaItems.push(
      React.createElement("span", { key: "site", className: styles.metaItem }, result.siteName)
    );
  }
  if (result.modified) {
    metaItems.push(
      React.createElement(
        "span",
        { key: "modified", className: styles.metaItem },
        new Date(result.modified).toLocaleDateString()
      )
    );
  }

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
      result.title || "Untitled Page"
    ),
  ];

  if (summary) {
    bodyChildren.push(
      React.createElement("div", { key: "summary", className: styles.summary }, summary)
    );
  }

  if (metaItems.length > 0) {
    bodyChildren.push(
      React.createElement("div", { key: "meta", className: styles.meta }, metaItems)
    );
  }

  if (props.showPath && result.path) {
    bodyChildren.push(
      React.createElement("div", { key: "path", className: styles.path }, result.path)
    );
  }

  const itemChildren: React.ReactElement[] = [
    React.createElement(
      "div",
      { key: "icon", className: styles.iconContainer + " " + styles.pageIcon, "aria-hidden": "true" },
      "\uD83C\uDF10"
    ),
  ];

  // Thumbnail if available
  if (result.thumbnailUrl) {
    itemChildren.push(
      React.createElement("img", {
        key: "thumb",
        className: styles.thumbnail,
        src: result.thumbnailUrl,
        alt: "",
        loading: "lazy",
      })
    );
  }

  itemChildren.push(
    React.createElement("div", { key: "body", className: styles.body }, bodyChildren)
  );

  return React.createElement("div", { className: styles.resultTypeItem }, itemChildren);
};

export default PageResult;
