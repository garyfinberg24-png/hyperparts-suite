import * as React from "react";
import type { ILinksLayoutProps } from "./index";
import type { IHyperLink } from "../../models";
import styles from "./CardLayout.module.scss";

interface ICardItemProps {
  link: IHyperLink;
  showIcon: boolean;
  showDescription: boolean;
  showThumbnail: boolean;
  onLinkClick: (link: IHyperLink) => void;
  textColor?: string;
  iconColor?: string;
}

const CardItem: React.FC<ICardItemProps> = function (props) {
  const link = props.link;
  const children: React.ReactNode[] = [];

  // Thumbnail image
  if (props.showThumbnail && link.thumbnailUrl) {
    children.push(
      React.createElement("div", { key: "thumb", className: styles.cardThumbnail },
        React.createElement("img", {
          src: link.thumbnailUrl,
          alt: "",
          className: styles.cardImage,
        })
      )
    );
  }

  // Card body
  const bodyChildren: React.ReactNode[] = [];

  // Icon + title row
  const titleRow: React.ReactNode[] = [];
  if (props.showIcon && link.icon && link.icon.type === "fluent") {
    var cardIconColor = (link.icon.color) ? link.icon.color : props.iconColor;
    titleRow.push(
      React.createElement("i", {
        key: "icon",
        className: styles.cardIcon + " ms-Icon ms-Icon--" + link.icon.value,
        "aria-hidden": "true",
        style: cardIconColor ? { color: cardIconColor } : undefined,
      })
    );
  }
  titleRow.push(
    React.createElement("span", { key: "title", className: styles.cardTitle }, link.title)
  );
  bodyChildren.push(
    React.createElement("div", { key: "title-row", className: styles.cardTitleRow }, titleRow)
  );

  // Description
  if (props.showDescription && link.description) {
    bodyChildren.push(
      React.createElement("p", { key: "desc", className: styles.cardDescription }, link.description)
    );
  }

  // URL domain as metadata
  if (link.url) {
    let domain = "";
    try {
      domain = new URL(link.url).hostname;
    } catch {
      domain = link.url;
    }
    bodyChildren.push(
      React.createElement("span", { key: "meta", className: styles.cardMeta }, domain)
    );
  }

  children.push(
    React.createElement("div", { key: "body", className: styles.cardBody }, bodyChildren)
  );

  return React.createElement(
    "a",
    {
      className: styles.card,
      href: link.url || "#",
      target: link.openInNewTab ? "_blank" : undefined,
      rel: link.openInNewTab ? "noopener noreferrer" : undefined,
      style: props.textColor ? { color: props.textColor } as React.CSSProperties : undefined,
      role: "listitem",
      onClick: function (e: React.MouseEvent) {
        props.onLinkClick(link);
        if (!link.url) e.preventDefault();
      },
    },
    children
  );
};

export const CardLayout: React.FC<ILinksLayoutProps> = function (props) {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + props.gridColumns + ", 1fr)",
  };

  return React.createElement(
    "div",
    { className: styles.cardGrid, style: gridStyle, role: "list" },
    props.links.map(function (link) {
      return React.createElement(CardItem, {
        key: link.id,
        link: link,
        showIcon: props.showIcons,
        showDescription: props.showDescriptions,
        showThumbnail: props.showThumbnails,
        onLinkClick: props.onLinkClick,
        textColor: props.textColor,
        iconColor: props.iconColor,
      });
    })
  );
};
