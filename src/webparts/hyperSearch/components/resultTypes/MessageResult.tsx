import * as React from "react";
import type { IHyperSearchResult } from "../../models";
import styles from "./ResultTypes.module.scss";

export interface IMessageResultProps {
  result: IHyperSearchResult;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

const MessageResult: React.FC<IMessageResultProps> = function (props) {
  const result = props.result;
  const summary = result.hitHighlightedSummary
    ? stripHtml(result.hitHighlightedSummary)
    : result.description || "";

  const sourceLabel = result.source === "teams" ? "Teams" : "Email";

  const metaItems: React.ReactElement[] = [
    React.createElement(
      "span",
      { key: "source", className: styles.fileTypeBadge },
      sourceLabel
    ),
  ];

  if (result.author) {
    metaItems.push(
      React.createElement("span", { key: "sender", className: styles.metaItem }, result.author)
    );
  }
  if (result.modified) {
    metaItems.push(
      React.createElement(
        "span",
        { key: "date", className: styles.metaItem },
        new Date(result.modified).toLocaleDateString()
      )
    );
  }

  const bodyChildren: React.ReactElement[] = [];

  if (result.url) {
    bodyChildren.push(
      React.createElement(
        "a",
        {
          key: "title",
          className: styles.title,
          href: result.url,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        result.title || "Message"
      )
    );
  } else {
    bodyChildren.push(
      React.createElement("span", { key: "title", className: styles.title }, result.title || "Message")
    );
  }

  if (summary) {
    bodyChildren.push(
      React.createElement("div", { key: "summary", className: styles.summary }, summary)
    );
  }

  bodyChildren.push(
    React.createElement("div", { key: "meta", className: styles.meta }, metaItems)
  );

  return React.createElement(
    "div",
    { className: styles.resultTypeItem },
    React.createElement(
      "div",
      { className: styles.iconContainer + " " + styles.messageIcon, "aria-hidden": "true" },
      "\uD83D\uDCE7"
    ),
    React.createElement("div", { className: styles.body }, bodyChildren)
  );
};

export default MessageResult;
