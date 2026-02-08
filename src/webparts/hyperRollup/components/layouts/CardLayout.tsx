import * as React from "react";
import { useRef } from "react";
import type { IHyperRollupItem, IHyperRollupGroup } from "../../models";
import { useResponsive } from "../../../../common/hooks";
import { HyperRollupItemCard } from "../HyperRollupItemCard";
import { HyperRollupGroupHeader } from "../HyperRollupGroupHeader";
import styles from "./CardLayout.module.scss";

export interface ICardLayoutProps {
  groups: IHyperRollupGroup[];
  isGrouped: boolean;
  selectedItemId: string | undefined;
  expandedGroups: string[];
  cardColumns: number;
  onSelectItem: (itemId: string) => void;
  onPreviewItem?: (itemId: string) => void;
  onToggleGroup: (groupKey: string) => void;
}

const CardLayoutInner: React.FC<ICardLayoutProps> = (props) => {
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  const responsiveColumns =
    breakpoint === "mobile" ? 1 : breakpoint === "tablet" ? 2 : props.cardColumns;

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: "repeat(" + String(responsiveColumns) + ", 1fr)",
  };

  function renderCards(items: IHyperRollupItem[]): React.ReactElement {
    return React.createElement(
      "div",
      { className: styles.cardGrid, style: gridStyle },
      items.map(function (item) {
        return React.createElement(HyperRollupItemCard, {
          key: item.id,
          item: item,
          isSelected: props.selectedItemId === item.id,
          onSelect: props.onSelectItem,
          onPreview: props.onPreviewItem,
        });
      })
    );
  }

  if (!props.isGrouped) {
    // Flat card grid
    const allItems: IHyperRollupItem[] = [];
    props.groups.forEach(function (g) {
      g.items.forEach(function (item) { allItems.push(item); });
    });

    return React.createElement(
      "div",
      { ref: containerRef, className: styles.cardLayoutContainer },
      renderCards(allItems)
    );
  }

  // Grouped layout
  const groupElements: React.ReactElement[] = [];

  props.groups.forEach(function (group) {
    const isExpanded = props.expandedGroups.indexOf(group.key) !== -1;

    groupElements.push(
      React.createElement(
        "div",
        { key: group.key, className: styles.groupSection },
        React.createElement(HyperRollupGroupHeader, {
          groupKey: group.key,
          label: group.label,
          count: group.count,
          isExpanded: isExpanded,
          onToggle: props.onToggleGroup,
        }),
        isExpanded
          ? React.createElement(
              "div",
              { id: "group-" + group.key, role: "group" },
              renderCards(group.items)
            )
          : undefined
      )
    );
  });

  return React.createElement(
    "div",
    { ref: containerRef, className: styles.cardLayoutContainer },
    groupElements
  );
};

export const CardLayout = React.memo(CardLayoutInner);
