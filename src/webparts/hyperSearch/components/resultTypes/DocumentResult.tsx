import * as React from "react";
import type { IHyperSearchResult } from "../../models";
import styles from "./ResultTypes.module.scss";

export interface IDocumentResultProps {
  result: IHyperSearchResult;
  showPath: boolean;
}

/** Strips HTML tags for display */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

const DocumentResult: React.FC<IDocumentResultProps> = function (props) {
  const result = props.result;
  const summary = result.hitHighlightedSummary
    ? stripHtml(result.hitHighlightedSummary)
    : result.description || "";

  const metaItems: React.ReactElement[] = [];

  if (result.fileType) {
    metaItems.push(
      React.createElement("span", { key: "type", className: styles.fileTypeBadge }, result.fileType)
    );
  }
  if (result.author) {
    metaItems.push(
      React.createElement("span", { key: "author", className: styles.metaItem }, result.author)
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
      result.title || "Untitled Document"
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

  return React.createElement(
    "div",
    { className: styles.resultTypeItem },
    React.createElement(
      "div",
      { className: styles.iconContainer + " " + styles.docIcon, "aria-hidden": "true" },
      "\uD83D\uDCC4"
    ),
    React.createElement("div", { className: styles.body }, bodyChildren)
  );
};

export default DocumentResult;
