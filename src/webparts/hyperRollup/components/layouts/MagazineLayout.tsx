import * as React from "react";
import type { IHyperRollupItem } from "../../models";
import type { IMagazineLayoutProps } from "./ILayoutProps";
import { flattenGroups } from "./ILayoutProps";
import { HyperRollupItemCard } from "../HyperRollupItemCard";
import styles from "./MagazineLayout.module.scss";

const MagazineLayoutInner: React.FC<IMagazineLayoutProps> = function (props) {
  var allItems = flattenGroups(props.groups);

  if (allItems.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  var heroItem: IHyperRollupItem = allItems[0];
  var remainingItems: IHyperRollupItem[] = allItems.slice(1);
  var isHeroSelected = props.selectedItemId === heroItem.id;

  var modifiedDate = heroItem.modified
    ? new Date(heroItem.modified).toLocaleDateString()
    : "";

  // Hero section (large featured item)
  var heroElement = React.createElement(
    "div",
    {
      className: styles.magazineHero + (isHeroSelected ? " " + styles.heroSelected : ""),
      onClick: function () { props.onSelectItem(heroItem.id); },
      role: "button",
      tabIndex: 0,
      "aria-selected": isHeroSelected,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          props.onSelectItem(heroItem.id);
        }
      },
    },
    // Hero thumbnail area
    React.createElement(
      "div",
      { className: styles.heroThumb },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--Page",
        "aria-hidden": "true",
        style: { fontSize: "48px" },
      })
    ),
    // Hero content
    React.createElement(
      "div",
      { className: styles.heroContent },
      React.createElement(
        "span",
        { className: styles.heroLabel },
        "FEATURED"
      ),
      React.createElement("h2", { className: styles.heroTitle }, heroItem.title),
      heroItem.description
        ? React.createElement(
            "p",
            { className: styles.heroDesc },
            heroItem.description.length > 300
              ? heroItem.description.substring(0, 300) + "..."
              : heroItem.description
          )
        : undefined,
      React.createElement(
        "div",
        { className: styles.heroMeta },
        heroItem.author
          ? React.createElement("span", undefined, heroItem.author)
          : undefined,
        modifiedDate
          ? React.createElement("span", undefined, modifiedDate)
          : undefined,
        React.createElement("span", undefined, heroItem.sourceListName || heroItem.sourceSiteName),
        heroItem.fileType
          ? React.createElement("span", { className: styles.heroBadge }, heroItem.fileType.toUpperCase())
          : undefined
      )
    )
  );

  // Remaining items as smaller cards in a grid
  var gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + String(props.cardColumns || 3) + ", 1fr)",
  };

  var gridElement: React.ReactElement | undefined = undefined;
  if (remainingItems.length > 0) {
    gridElement = React.createElement(
      "div",
      { className: styles.magazineGrid, style: gridStyle },
      remainingItems.map(function (item) {
        return React.createElement(HyperRollupItemCard, {
          key: item.id,
          item: item,
          isSelected: props.selectedItemId === item.id,
          onSelect: props.onSelectItem,
          onPreview: props.onPreviewItem,
          newBadgeDays: props.newBadgeDays,
        });
      })
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.magazineContainer,
      role: "feed",
      "aria-label": "Magazine view",
    },
    heroElement,
    gridElement
  );
};

export const MagazineLayout = React.memo(MagazineLayoutInner);
