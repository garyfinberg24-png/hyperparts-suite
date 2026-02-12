import * as React from "react";
import styles from "./HyperEditOverlay.module.scss";

// ── Props ──────────────────────────────────────────────────────────────────────

export interface IHyperEditOverlayProps {
  /** Display name shown in the pill (e.g. "HyperNav") */
  wpName: string;
  /** Callback when "Setup Wizard" is clicked */
  onWizardClick: () => void;
  /** Callback when "Edit Properties" is clicked */
  onEditClick: () => void;
  /** Custom label for the edit button. Defaults to "Edit Properties" */
  editLabel?: string;
  /** Whether the overlay is visible (typically props.isEditMode) */
  isVisible: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────────

var HyperEditOverlayInner: React.FC<IHyperEditOverlayProps> = function (props) {
  var wpName = props.wpName;
  var onWizardClick = props.onWizardClick;
  var onEditClick = props.onEditClick;
  var editLabel = props.editLabel || "Edit Properties";
  var isVisible = props.isVisible;
  var children = props.children;

  if (!isVisible) {
    return React.createElement(React.Fragment, undefined, children);
  }

  return React.createElement("div", { className: styles.overlayContainer },
    // Dimmed content behind overlay
    React.createElement("div", { className: styles.contentDimmed }, children),

    // Frosted glass pill
    React.createElement("div", {
      className: styles.glassPill,
      role: "toolbar",
      "aria-label": "Edit mode controls for " + wpName,
    },
      React.createElement("span", { className: styles.wpName }, wpName),
      React.createElement("span", { className: styles.divider }),
      React.createElement("button", {
        className: styles.btnWizard,
        onClick: onWizardClick,
        type: "button",
        "aria-label": "Open setup wizard for " + wpName,
      },
        React.createElement("span", { className: styles.btnIcon, "aria-hidden": "true" }, "\u2699\uFE0F"),
        "Setup Wizard"
      ),
      React.createElement("button", {
        className: styles.btnEdit,
        onClick: onEditClick,
        type: "button",
        "aria-label": editLabel + " for " + wpName,
      },
        React.createElement("span", { className: styles.btnIcon, "aria-hidden": "true" }, "\u270F\uFE0F"),
        editLabel
      )
    )
  );
};

export var HyperEditOverlay = React.memo(HyperEditOverlayInner);
