import * as React from "react";
import type { IHyperHeroSlide } from "../../models";
import styles from "./HyperHeroSlidesManager.module.scss";

export interface IHyperHeroSlidesManagerProps {
  isOpen: boolean;
  onClose: () => void;
  slides: IHyperHeroSlide[];
  onEditSlide: (slideId: string) => void;
  onSlidesChange: (slides: IHyperHeroSlide[]) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (slideId: string) => void;
  onDeleteSlide: (slideId: string) => void;
  onOpenSliderLibrary: () => void;
}

const HyperHeroSlidesManagerInner: React.FC<IHyperHeroSlidesManagerProps> = function (props) {
  var {
    isOpen, onClose, slides, onEditSlide, onSlidesChange,
    onAddSlide, onDuplicateSlide, onDeleteSlide, onOpenSliderLibrary,
  } = props;

  var deletingIdState = React.useState<string | undefined>(undefined);
  var deletingId = deletingIdState[0];
  var setDeletingId = deletingIdState[1];

  // Reset delete confirmation when panel reopens
  React.useEffect(function () {
    if (isOpen) setDeletingId(undefined);
  }, [isOpen]);

  if (!isOpen) return React.createElement(React.Fragment, undefined);

  // ── Slide mutation helpers ──

  var handleMoveUp = function (slideId: string): void {
    var idx = -1;
    slides.forEach(function (s, i) { if (s.id === slideId) idx = i; });
    if (idx <= 0) return;
    var updated = slides.slice();
    var temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    onSlidesChange(updated);
  };

  var handleMoveDown = function (slideId: string): void {
    var idx = -1;
    slides.forEach(function (s, i) { if (s.id === slideId) idx = i; });
    if (idx < 0 || idx >= slides.length - 1) return;
    var updated = slides.slice();
    var temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    onSlidesChange(updated);
  };

  var handleToggleLock = function (slideId: string): void {
    var updated: IHyperHeroSlide[] = [];
    slides.forEach(function (s) {
      if (s.id === slideId) {
        updated.push({ ...s, locked: !s.locked });
      } else {
        updated.push(s);
      }
    });
    onSlidesChange(updated);
  };

  var handleToggleEnabled = function (slideId: string): void {
    var updated: IHyperHeroSlide[] = [];
    slides.forEach(function (s) {
      if (s.id === slideId) {
        updated.push({ ...s, enabled: !s.enabled });
      } else {
        updated.push(s);
      }
    });
    onSlidesChange(updated);
  };

  var handleConfirmDelete = function (slideId: string): void {
    setDeletingId(undefined);
    onDeleteSlide(slideId);
  };

  // ── Build slide thumbnail style ──
  var getThumbnailStyle = function (slide: IHyperHeroSlide): React.CSSProperties {
    var bg = slide.background;
    if (bg.type === "image" && bg.imageUrl) {
      return { backgroundImage: "url(" + bg.imageUrl + ")" };
    }
    if (bg.type === "solidColor" && bg.backgroundColor) {
      return { backgroundColor: bg.backgroundColor };
    }
    return { backgroundColor: "#0078d4" };
  };

  // ── Render each slide row ──
  var renderSlideRow = function (slide: IHyperHeroSlide, idx: number): React.ReactElement {
    var isLocked = !!slide.locked;
    var isHidden = !slide.enabled;
    var isDeleting = deletingId === slide.id;

    var rowClass = isHidden
      ? styles.slideRowHidden
      : isLocked
        ? styles.slideRowLocked
        : styles.slideRow;

    return React.createElement("div", {
      key: slide.id,
      className: rowClass,
      role: "listitem",
    },
      // Position badge
      React.createElement("span", { className: styles.slidePosition, "aria-label": "Position " + (idx + 1) },
        String(idx + 1)
      ),

      // Thumbnail
      React.createElement("div", {
        className: styles.slideThumbnail,
        style: getThumbnailStyle(slide),
        "aria-hidden": "true",
      }),

      // Info (clickable to edit)
      React.createElement("div", {
        className: styles.slideInfo,
        onClick: function () {
          if (!isLocked) onEditSlide(slide.id);
        },
        role: isLocked ? undefined : "button",
        tabIndex: isLocked ? undefined : 0,
        onKeyDown: function (e: React.KeyboardEvent) {
          if (!isLocked && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onEditSlide(slide.id);
          }
        },
        "aria-label": isLocked ? slide.heading + " (locked)" : "Edit " + slide.heading,
      },
        React.createElement("span", { className: styles.slideName }, slide.heading || "Untitled"),
        React.createElement("div", { className: styles.slideStatus },
          isLocked ? React.createElement("span", { className: styles.statusIcon, title: "Locked", "aria-label": "Locked" }, "\uD83D\uDD12") : undefined,
          isHidden ? React.createElement("span", { className: styles.statusIcon, title: "Hidden", "aria-label": "Hidden" }, "\uD83D\uDE48") : undefined
        )
      ),

      // Actions
      isDeleting
        ? React.createElement("div", { className: styles.deleteConfirmRow },
            React.createElement("span", { className: styles.deleteConfirmLabel }, "Delete?"),
            React.createElement("button", {
              className: styles.deleteConfirmBtnDanger,
              onClick: function () { handleConfirmDelete(slide.id); },
              type: "button",
            }, "Yes"),
            React.createElement("button", {
              className: styles.deleteConfirmBtn,
              onClick: function () { setDeletingId(undefined); },
              type: "button",
            }, "No")
          )
        : React.createElement("div", { className: styles.slideActions },
            // Move Up
            React.createElement("button", {
              className: isLocked || idx === 0 ? styles.actionBtnDisabled : styles.actionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); if (!isLocked && idx > 0) handleMoveUp(slide.id); },
              type: "button",
              "aria-label": "Move up",
              disabled: isLocked || idx === 0,
            }, "\u2191"),
            // Move Down
            React.createElement("button", {
              className: isLocked || idx === slides.length - 1 ? styles.actionBtnDisabled : styles.actionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); if (!isLocked && idx < slides.length - 1) handleMoveDown(slide.id); },
              type: "button",
              "aria-label": "Move down",
              disabled: isLocked || idx === slides.length - 1,
            }, "\u2193"),
            // Lock / Unlock
            React.createElement("button", {
              className: styles.actionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); handleToggleLock(slide.id); },
              type: "button",
              "aria-label": isLocked ? "Unlock slide" : "Lock slide",
            }, isLocked ? "\uD83D\uDD13" : "\uD83D\uDD12"),
            // Show / Hide
            React.createElement("button", {
              className: styles.actionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); handleToggleEnabled(slide.id); },
              type: "button",
              "aria-label": isHidden ? "Show slide" : "Hide slide",
            }, isHidden ? "\uD83D\uDC41\uFE0F" : "\uD83D\uDE48"),
            // Duplicate
            React.createElement("button", {
              className: isLocked ? styles.actionBtnDisabled : styles.actionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); if (!isLocked) onDuplicateSlide(slide.id); },
              type: "button",
              "aria-label": "Duplicate slide",
              disabled: isLocked,
            }, "\uD83D\uDCCB"),
            // Delete
            React.createElement("button", {
              className: isLocked ? styles.actionBtnDisabled : styles.actionBtnDanger,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); if (!isLocked) setDeletingId(slide.id); },
              type: "button",
              "aria-label": "Delete slide",
              disabled: isLocked,
            }, "\uD83D\uDDD1\uFE0F")
          )
    );
  };

  return React.createElement("div", {
    className: styles.slidesPanel,
    role: "region",
    "aria-label": "Slides Manager",
  },
    // Header
    React.createElement("div", { className: styles.panelHeader },
      React.createElement("h3", { className: styles.panelTitle }, "Slides Manager"),
      React.createElement("div", { className: styles.panelHeaderActions },
        React.createElement("button", {
          className: styles.panelBtnPrimary,
          onClick: onAddSlide,
          type: "button",
          "aria-label": "Add new slide",
        }, "+ Add"),
        React.createElement("button", {
          className: styles.panelBtn,
          onClick: onOpenSliderLibrary,
          type: "button",
          "aria-label": "Open slider library",
        }, "\uD83D\uDDC2\uFE0F Library"),
        React.createElement("button", {
          className: styles.closeBtn,
          onClick: onClose,
          type: "button",
          "aria-label": "Close slides manager",
        }, "\u00D7")
      )
    ),

    // Slide list
    React.createElement("div", { className: styles.slideList, role: "list", "aria-label": "Slides" },
      slides.map(renderSlideRow)
    ),

    // Footer
    React.createElement("div", { className: styles.panelFooter },
      React.createElement("span", { className: styles.footerLabel },
        slides.length === 1 ? "1 slide" : slides.length + " slides"
      )
    )
  );
};

export const HyperHeroSlidesManager = React.memo(HyperHeroSlidesManagerInner);
