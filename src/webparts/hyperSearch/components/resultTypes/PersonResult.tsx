import * as React from "react";
import type { IHyperSearchResult } from "../../models";
import styles from "./ResultTypes.module.scss";

export interface IPersonResultProps {
  result: IHyperSearchResult;
}

const PersonResult: React.FC<IPersonResultProps> = function (props) {
  const result = props.result;
  const fields = result.fields || {};

  const jobTitle = (fields.JobTitle as string) || (fields.jobTitle as string) || "";
  const department = (fields.Department as string) || (fields.department as string) || "";

  const metaItems: React.ReactElement[] = [];
  if (jobTitle) {
    metaItems.push(
      React.createElement("span", { key: "job", className: styles.metaItem }, jobTitle)
    );
  }
  if (department) {
    metaItems.push(
      React.createElement("span", { key: "dept", className: styles.metaItem }, department)
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
      result.title || "Unknown Person"
    ),
  ];

  if (metaItems.length > 0) {
    bodyChildren.push(
      React.createElement("div", { key: "meta", className: styles.meta }, metaItems)
    );
  }

  // Quick actions
  const quickActions: React.ReactElement[] = [];
  if (result.authorEmail) {
    quickActions.push(
      React.createElement(
        "a",
        { key: "email", className: styles.quickAction, href: "mailto:" + result.authorEmail },
        "Email"
      )
    );
  }

  if (quickActions.length > 0) {
    bodyChildren.push(
      React.createElement("div", { key: "actions", className: styles.quickActions }, quickActions)
    );
  }

  return React.createElement(
    "div",
    { className: styles.resultTypeItem },
    React.createElement(
      "div",
      { className: styles.iconContainer + " " + styles.personIcon, "aria-hidden": "true" },
      "\uD83D\uDC64"
    ),
    React.createElement("div", { className: styles.body }, bodyChildren)
  );
};

export default PersonResult;
