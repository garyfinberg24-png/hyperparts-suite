import * as React from "react";
import styles from "./HyperRollupGroupHeader.module.scss";

export interface IHyperRollupGroupHeaderProps {
  groupKey: string;
  label: string;
  count: number;
  isExpanded: boolean;
  onToggle: (groupKey: string) => void;
}

const HyperRollupGroupHeaderInner: React.FC<IHyperRollupGroupHeaderProps> = (props) => {
  const { groupKey, label, count, isExpanded, onToggle } = props;

  const handleClick = React.useCallback(function (): void {
    onToggle(groupKey);
  }, [groupKey, onToggle]);

  return React.createElement(
    "button",
    {
      className: styles.groupHeader,
      onClick: handleClick,
      "aria-expanded": isExpanded,
      "aria-controls": "group-" + groupKey,
    },
    React.createElement(
      "i",
      {
        className: "ms-Icon ms-Icon--ChevronRight " + styles.chevron + (isExpanded ? " " + styles.expanded : ""),
        "aria-hidden": "true",
      }
    ),
    React.createElement("span", { className: styles.groupLabel }, label),
    React.createElement("span", { className: styles.groupCount }, "(" + String(count) + ")")
  );
};

export const HyperRollupGroupHeader = React.memo(HyperRollupGroupHeaderInner);
