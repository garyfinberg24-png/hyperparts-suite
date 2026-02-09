import * as React from "react";
import styles from "./HyperHeroEditOverlay.module.scss";

export interface IHyperHeroEditOverlayProps {
  slideId: string;
  slideHeading: string;
  slideIndex: number;
  slideCount: number;
  onEdit: (slideId: string) => void;
  onDelete: (slideId: string) => void;
  onDuplicate?: (slideId: string) => void;
  onMoveUp?: (slideId: string) => void;
  onMoveDown?: (slideId: string) => void;
}

const HyperHeroEditOverlayInner: React.FC<IHyperHeroEditOverlayProps> = function (props) {
  const { slideId, slideHeading, slideIndex, slideCount, onEdit, onDelete, onDuplicate, onMoveUp, onMoveDown } = props;

  const confirmState = React.useState(false);
  const showConfirm = confirmState[0];
  const setShowConfirm = confirmState[1];

  const handleEdit = React.useCallback(function (): void {
    onEdit(slideId);
  }, [slideId, onEdit]);

  const handleDuplicate = React.useCallback(function (): void {
    if (onDuplicate) onDuplicate(slideId);
  }, [slideId, onDuplicate]);

  const handleMoveUp = React.useCallback(function (): void {
    if (onMoveUp) onMoveUp(slideId);
  }, [slideId, onMoveUp]);

  const handleMoveDown = React.useCallback(function (): void {
    if (onMoveDown) onMoveDown(slideId);
  }, [slideId, onMoveDown]);

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
      onMoveUp && slideIndex > 0
        ? React.createElement("button", {
            className: styles.duplicateBtn,
            onClick: handleMoveUp,
            "aria-label": "Move " + slideHeading + " up",
            type: "button",
          }, "\u2191")
        : undefined,
      onMoveDown && slideIndex < slideCount - 1
        ? React.createElement("button", {
            className: styles.duplicateBtn,
            onClick: handleMoveDown,
            "aria-label": "Move " + slideHeading + " down",
            type: "button",
          }, "\u2193")
        : undefined,
      React.createElement("button", {
        className: styles.editBtn,
        onClick: handleEdit,
        "aria-label": "Edit " + slideHeading,
        type: "button",
      }, "\u270F\uFE0F Edit"),
      onDuplicate
        ? React.createElement("button", {
            className: styles.duplicateBtn,
            onClick: handleDuplicate,
            "aria-label": "Duplicate " + slideHeading,
            type: "button",
          }, "\uD83D\uDCCB Duplicate")
        : undefined,
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
  onDuplicateSlide?: () => void;
  onRerunSetup: () => void;
  onExportConfig?: () => void;
  onImportConfig?: () => void;
  onSaveAs?: () => void;
  onPreviewTransitions?: () => void;
  slideCount: number;
}

const HyperHeroEditToolbarInner: React.FC<IHyperHeroEditToolbarProps> = function (props) {
  const { onAddSlide, onDuplicateSlide, onRerunSetup, onExportConfig, onImportConfig, onSaveAs, onPreviewTransitions, slideCount } = props;

  return React.createElement("div", { className: styles.editToolbar },
    React.createElement("button", {
      className: styles.toolbarBtnPrimary,
      onClick: onAddSlide,
      "aria-label": "Add new slide",
      type: "button",
    }, "+ Add Slide"),
    onDuplicateSlide
      ? React.createElement("button", {
          className: styles.toolbarBtn,
          onClick: onDuplicateSlide,
          "aria-label": "Duplicate last slide",
          type: "button",
        }, "\uD83D\uDCCB Duplicate")
      : undefined,
    // Preview Transitions
    onPreviewTransitions
      ? React.createElement("button", {
          className: styles.toolbarBtn,
          onClick: onPreviewTransitions,
          "aria-label": "Preview slide transitions",
          type: "button",
        }, "\u25B6 Preview")
      : undefined,
    // Save As (named config)
    onSaveAs
      ? React.createElement("button", {
          className: styles.toolbarBtn,
          onClick: onSaveAs,
          "aria-label": "Save configuration as",
          type: "button",
        }, "\uD83D\uDCBE Save As")
      : undefined,
    React.createElement("button", {
      className: styles.toolbarBtn,
      onClick: onRerunSetup,
      "aria-label": "Re-run setup wizard",
      type: "button",
    }, "\uD83E\uDDD9 Re-run Setup"),
    // Configuration Manager buttons
    onExportConfig
      ? React.createElement("button", {
          className: styles.toolbarBtn,
          onClick: onExportConfig,
          "aria-label": "Export configuration",
          type: "button",
        }, "\uD83D\uDCE4 Export")
      : undefined,
    onImportConfig
      ? React.createElement("button", {
          className: styles.toolbarBtn,
          onClick: onImportConfig,
          "aria-label": "Import configuration",
          type: "button",
        }, "\uD83D\uDCE5 Import")
      : undefined,
    // My Sliders
    React.createElement("button", {
      className: styles.toolbarBtn,
      onClick: function (): void { /* placeholder — My Sliders gallery */ },
      "aria-label": "My saved slider configurations",
      type: "button",
    }, "\uD83D\uDDC2\uFE0F My Sliders"),
    // Shortcuts
    React.createElement("button", {
      className: styles.toolbarBtn,
      onClick: function (): void { /* placeholder — keyboard shortcuts modal */ },
      "aria-label": "Keyboard shortcuts",
      type: "button",
    }, "\u2328\uFE0F Shortcuts"),
    React.createElement("span", {
      className: styles.slideCountLabel,
    }, slideCount === 1
      ? "1 slide"
      : slideCount + " slides"
    )
  );
};

export const HyperHeroEditToolbar = React.memo(HyperHeroEditToolbarInner);
