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

  const confirmState = React.useState(false);
  const showConfirm = confirmState[0];
  const setShowConfirm = confirmState[1];

  const handleEdit = React.useCallback(function (): void {
    onEdit(tileId);
  }, [tileId, onEdit]);

  const handleDeleteRequest = React.useCallback(function (): void {
    setShowConfirm(true);
  }, []);

  const handleDeleteConfirm = React.useCallback(function (): void {
    setShowConfirm(false);
    onDelete(tileId);
  }, [tileId, onDelete]);

  const handleDeleteCancel = React.useCallback(function (): void {
    setShowConfirm(false);
  }, []);

  if (showConfirm) {
    return React.createElement("div", {
      className: styles.overlay + " " + styles.overlayVisible,
      role: "alertdialog",
      "aria-label": "Confirm delete " + tileHeading,
    },
      React.createElement("div", { className: styles.confirmDialog },
        React.createElement("div", { className: styles.confirmIcon, "aria-hidden": "true" }, "\u26A0\uFE0F"),
        React.createElement("p", { className: styles.confirmText },
          "Delete \"" + tileHeading + "\"?"
        ),
        React.createElement("p", { className: styles.confirmHint }, "This action cannot be undone."),
        React.createElement("div", { className: styles.confirmButtons },
          React.createElement("button", {
            className: styles.confirmCancelBtn,
            onClick: handleDeleteCancel,
            type: "button",
          }, "Cancel"),
          React.createElement("button", {
            className: styles.confirmDeleteBtn,
            onClick: handleDeleteConfirm,
            type: "button",
          }, "Delete")
        )
      )
    );
  }

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
        "aria-label": "Edit " + tileHeading,
        type: "button",
      }, "\u270F\uFE0F Edit Tile"),
      React.createElement("button", {
        className: styles.deleteBtn,
        onClick: handleDeleteRequest,
        "aria-label": "Delete " + tileHeading,
        type: "button",
      }, "\uD83D\uDDD1\uFE0F Delete")
    ),
    // Tile label
    React.createElement("div", {
      className: styles.tileLabel,
    }, tileHeading)
  );
};

export const HyperHeroEditOverlay = React.memo(HyperHeroEditOverlayInner);

// ── Edit toolbar component ──
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
      type: "button",
    }, "+ Add Tile"),
    React.createElement("button", {
      className: styles.toolbarBtn,
      onClick: onRerunSetup,
      "aria-label": "Re-run setup wizard",
      type: "button",
    }, "\uD83E\uDDD9 Re-run Setup"),
    React.createElement("span", {
      className: styles.tileCountLabel,
    }, tileCount === 1
      ? "1 tile"
      : tileCount + " tiles"
    )
  );
};

export const HyperHeroEditToolbar = React.memo(HyperHeroEditToolbarInner);
