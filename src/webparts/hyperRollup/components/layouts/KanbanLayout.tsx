import * as React from "react";
import type { IHyperRollupItem, IHyperRollupGroup } from "../../models";
import { HyperRollupItemCard } from "../HyperRollupItemCard";
import styles from "./KanbanLayout.module.scss";

export interface IKanbanLayoutProps {
  groups: IHyperRollupGroup[];
  selectedItemId: string | undefined;
  onSelectItem: (itemId: string) => void;
  onPreviewItem?: (itemId: string) => void;
}

const KanbanLayoutInner: React.FC<IKanbanLayoutProps> = (props) => {
  const { groups, selectedItemId, onSelectItem, onPreviewItem } = props;

  if (groups.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const laneElements: React.ReactElement[] = [];

  groups.forEach(function (group) {
    const cardElements: React.ReactElement[] = [];

    group.items.forEach(function (item: IHyperRollupItem) {
      cardElements.push(
        React.createElement(HyperRollupItemCard, {
          key: item.id,
          item: item,
          isSelected: selectedItemId === item.id,
          onSelect: onSelectItem,
          onPreview: onPreviewItem,
        })
      );
    });

    laneElements.push(
      React.createElement(
        "div",
        { key: group.key, className: styles.kanbanLane },
        React.createElement(
          "div",
          { className: styles.laneHeader },
          React.createElement("span", { className: styles.laneTitle }, group.label),
          React.createElement("span", { className: styles.laneCount }, String(group.count))
        ),
        React.createElement(
          "div",
          { className: styles.laneBody },
          cardElements
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.kanbanBoard, role: "region", "aria-label": "Kanban board" },
    laneElements
  );
};

export const KanbanLayout = React.memo(KanbanLayoutInner);
