import * as React from "react";
import type { IHyperNavLink } from "../models";
import styles from "./HyperNavPinnedSection.module.scss";

export interface IHyperNavPinnedSectionProps {
  links: IHyperNavLink[];
  pinnedLinkIds: string[];
  onLinkClick: (link: IHyperNavLink) => void;
}

export const HyperNavPinnedSection: React.FC<IHyperNavPinnedSectionProps> = function (props) {
  const pinnedLinks = React.useMemo(function () {
    const idSet: Record<string, boolean> = {};
    props.pinnedLinkIds.forEach(function (id) { idSet[id] = true; });

    const result: IHyperNavLink[] = [];
    function walk(items: IHyperNavLink[]): void {
      items.forEach(function (link) {
        if (idSet[link.id]) {
          result.push(link);
        }
        if (link.children && link.children.length > 0) {
          walk(link.children);
        }
      });
    }
    walk(props.links);
    return result;
  }, [props.links, props.pinnedLinkIds]);

  if (pinnedLinks.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  return React.createElement(
    "div",
    { className: styles.pinnedSection },
    React.createElement(
      "div",
      { className: styles.pinnedHeader },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--Pinned",
        "aria-hidden": "true",
      }),
      "Pinned"
    ),
    React.createElement(
      "div",
      { className: styles.pinnedLinks },
      pinnedLinks.map(function (link) {
        return React.createElement(
          "a",
          {
            key: link.id,
            className: styles.pinnedChip,
            href: link.url || "#",
            target: link.openInNewTab ? "_blank" : undefined,
            rel: link.openInNewTab ? "noopener noreferrer" : undefined,
            onClick: function (e: React.MouseEvent) {
              props.onLinkClick(link);
              if (!link.url) {
                e.preventDefault();
              }
            },
          },
          link.title
        );
      })
    )
  );
};
