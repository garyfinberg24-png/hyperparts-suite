import * as React from "react";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroEditOverlayProps {
  tileId: string;
  onEdit?: (tileId: string) => void;
}

const HyperHeroEditOverlayInner: React.FC<IHyperHeroEditOverlayProps> = (props) => {
  const { tileId, onEdit } = props;

  const handleClick = React.useCallback((): void => {
    if (onEdit) {
      onEdit(tileId);
    }
  }, [tileId, onEdit]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (onEdit) {
          onEdit(tileId);
        }
      }
    },
    [tileId, onEdit]
  );

  return React.createElement(
    "div",
    {
      className: styles.editOverlay,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      role: "button",
      tabIndex: 0,
      "aria-label": "Edit this tile",
    },
    React.createElement(
      "span",
      { className: styles.editButton },
      "Edit Tile"
    )
  );
};

export const HyperHeroEditOverlay = React.memo(HyperHeroEditOverlayInner);
