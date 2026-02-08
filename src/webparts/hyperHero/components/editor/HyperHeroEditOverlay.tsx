import * as React from "react";
import styles from "./HyperHeroEditOverlay.module.scss";

export interface IHyperHeroEditOverlayProps {
  tileId: string;
  tileHeading: string;
  tileIndex: number;
  onEdit: (tileId: string) => void;
  onDelete: (tileId: string) => void;
}

const HyperHeroEditOverlayInner: React.FC<IHyperHeroEditOverlayProps> = function (props) {
  const { tileId, tileHeading, tileIndex, onEdit, onDelete } = props;

  const handleEdit = React.useCallback(function (): void {
    onEdit(tileId);
  }, [tileId, onEdit]);

  const handleDelete = React.useCallback(function (): void {
    onDelete(tileId);
  }, [tileId, onDelete]);

  const handleKeyDown = React.useCallback(function (
    e: React.KeyboardEvent<HTMLButtonElement>,
    action: () => void
  ): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  }, []);

  return React.createElement("div", {
    className: styles.overlay,
    role: "group",
    "aria-label": "Tile edit controls for " + tileHeading,
  },
    // Sort badge
    React.createElement("div", {
      className: styles.sortBadge,
      "aria-label": "Position " + (tileIndex + 1),
    }, String(tileIndex + 1)),
    // Center buttons
    React.createElement("div", { className: styles.overlayButtons },
      React.createElement("button", {
        className: styles.editBtn,
        onClick: handleEdit,
        onKeyDown: function (e: React.KeyboardEvent<HTMLButtonElement>): void {
          handleKeyDown(e, handleEdit);
        },
        "aria-label": "Edit " + tileHeading,
      }, "Edit Tile"),
      React.createElement("button", {
        className: styles.deleteBtn,
        onClick: handleDelete,
        onKeyDown: function (e: React.KeyboardEvent<HTMLButtonElement>): void {
          handleKeyDown(e, handleDelete);
        },
        "aria-label": "Delete " + tileHeading,
      }, "Delete")
    ),
    // Tile label
    React.createElement("div", {
      className: styles.tileLabel,
      "aria-label": "Tile heading",
    }, tileHeading)
  );
};

export const HyperHeroEditOverlay = React.memo(HyperHeroEditOverlayInner);

// Edit toolbar component
export interface IHyperHeroEditToolbarProps {
  onAddTile: () => void;
  onRerunSetup: () => void;
  tileCount: number;
}

const HyperHeroEditToolbarInner: React.FC<IHyperHeroEditToolbarProps> = function (props) {
  const { onAddTile, onRerunSetup, tileCount } = props;

  return React.createElement("div", { className: styles.editToolbar },
    React.createElement("button", {
      className: styles.toolbarBtnPrimary,
      onClick: onAddTile,
      "aria-label": "Add new tile",
    }, "+ Add Tile"),
    React.createElement("button", {
      className: styles.toolbarBtn,
      onClick: onRerunSetup,
      "aria-label": "Re-run setup wizard",
    }, "Re-run Setup"),
    React.createElement("span", {
      style: {
        marginLeft: "auto",
        fontSize: "13px",
        color: "#605e5c",
      },
    }, tileCount === 1
      ? "1 tile"
      : tileCount + " tiles"
    )
  );
};

export const HyperHeroEditToolbar = React.memo(HyperHeroEditToolbarInner);
