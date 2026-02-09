import * as React from "react";
import styles from "./HyperHeroEditOverlay.module.scss";

export interface IHyperHeroEditOverlayProps {
  slideId: string;
  slideHeading: string;
  slideIndex: number;
  onEdit: (slideId: string) => void;
  onDelete: (slideId: string) => void;
}

const HyperHeroEditOverlayInner: React.FC<IHyperHeroEditOverlayProps> = function (props) {
  const { slideId, slideHeading, slideIndex, onEdit, onDelete } = props;

  const confirmState = React.useState(false);
  const showConfirm = confirmState[0];
  const setShowConfirm = confirmState[1];

  const handleEdit = React.useCallback(function (): void {
    onEdit(slideId);
  }, [slideId, onEdit]);

  const handleDeleteRequest = React.useCallback(function (): void {
    setShowConfirm(true);
  }, []);

  const handleDeleteConfirm = React.useCallback(function (): void {
    setShowConfirm(false);
    onDelete(slideId);
  }, [slideId, onDelete]);

  const handleDeleteCancel = React.useCallback(function (): void {
    setShowConfirm(false);
  }, []);

  if (showConfirm) {
    return React.createElement("div", {
      className: styles.overlay + " " + styles.overlayVisible,
      role: "alertdialog",
      "aria-label": "Confirm delete " + slideHeading,
    },
      React.createElement("div", { className: styles.confirmDialog },
        React.createElement("div", { className: styles.confirmIcon, "aria-hidden": "true" }, "\u26A0\uFE0F"),
        React.createElement("p", { className: styles.confirmText },
          "Delete \"" + slideHeading + "\"?"
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
    "aria-label": "Slide edit controls for " + slideHeading,
  },
    // Sort badge
    React.createElement("div", {
      className: styles.sortBadge,
      "aria-label": "Position " + (slideIndex + 1),
    }, String(slideIndex + 1)),
    // Center buttons
    React.createElement("div", { className: styles.overlayButtons },
      React.createElement("button", {
        className: styles.editBtn,
        onClick: handleEdit,
        "aria-label": "Edit " + slideHeading,
        type: "button",
      }, "\u270F\uFE0F Edit Slide"),
      React.createElement("button", {
        className: styles.deleteBtn,
        onClick: handleDeleteRequest,
        "aria-label": "Delete " + slideHeading,
        type: "button",
      }, "\uD83D\uDDD1\uFE0F Delete")
    ),
    // Slide label
    React.createElement("div", {
      className: styles.slideLabel,
    }, slideHeading)
  );
};

export const HyperHeroEditOverlay = React.memo(HyperHeroEditOverlayInner);

// ── Edit toolbar component ──
export interface IHyperHeroEditToolbarProps {
  onAddSlide: () => void;
  onRerunSetup: () => void;
  slideCount: number;
}

const HyperHeroEditToolbarInner: React.FC<IHyperHeroEditToolbarProps> = function (props) {
  const { onAddSlide, onRerunSetup, slideCount } = props;

  return React.createElement("div", { className: styles.editToolbar },
    React.createElement("button", {
      className: styles.toolbarBtnPrimary,
      onClick: onAddSlide,
      "aria-label": "Add new slide",
      type: "button",
    }, "+ Add Slide"),
    React.createElement("button", {
      className: styles.toolbarBtn,
      onClick: onRerunSetup,
      "aria-label": "Re-run setup wizard",
      type: "button",
    }, "\uD83E\uDDD9 Re-run Setup"),
    React.createElement("span", {
      className: styles.slideCountLabel,
    }, slideCount === 1
      ? "1 slide"
      : slideCount + " slides"
    )
  );
};

export const HyperHeroEditToolbar = React.memo(HyperHeroEditToolbarInner);
