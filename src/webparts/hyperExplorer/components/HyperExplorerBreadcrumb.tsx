import * as React from "react";
import type { IExplorerBreadcrumb } from "../models";
import styles from "./HyperExplorerBreadcrumb.module.scss";

export interface IHyperExplorerBreadcrumbProps {
  breadcrumbs: IExplorerBreadcrumb[];
  onNavigate: (path: string) => void;
}

var HyperExplorerBreadcrumb: React.FC<IHyperExplorerBreadcrumbProps> = function (props) {
  var crumbs = props.breadcrumbs;
  if (!crumbs || crumbs.length === 0) return React.createElement("div");

  var elements: React.ReactNode[] = [];

  crumbs.forEach(function (crumb, index) {
    var isLast = index === crumbs.length - 1;

    // Separator (skip before first)
    if (index > 0) {
      elements.push(
        React.createElement("span", {
          key: "sep-" + index,
          className: styles.separator,
          "aria-hidden": "true",
        }, "/")
      );
    }

    if (isLast) {
      // Current folder — not clickable
      elements.push(
        React.createElement("span", {
          key: "crumb-" + index,
          className: styles.breadcrumbItem + " " + styles.breadcrumbItemCurrent,
          "aria-current": "location",
        },
          crumb.isRoot
            ? React.createElement("span", { className: styles.rootIcon, "aria-hidden": "true" }, "\uD83D\uDCC1")
            : undefined,
          crumb.isRoot ? " " + crumb.name : crumb.name
        )
      );
    } else {
      // Navigable crumb
      elements.push(
        React.createElement("button", {
          key: "crumb-" + index,
          className: styles.breadcrumbItem,
          onClick: function () { props.onNavigate(crumb.path); },
          type: "button",
        },
          crumb.isRoot
            ? React.createElement("span", { className: styles.rootIcon, "aria-hidden": "true" }, "\uD83D\uDCC1")
            : undefined,
          crumb.isRoot ? " " + crumb.name : crumb.name
        )
      );
    }
  });

  return React.createElement("nav", {
    className: styles.breadcrumb,
    "aria-label": "Folder breadcrumb",
  }, elements);
};

export default HyperExplorerBreadcrumb;
