import * as React from "react";

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

// ── Component (SIMPLIFIED — always passes through children, no overlay) ───────

var HyperEditOverlayInner: React.FC<IHyperEditOverlayProps> = function (props) {
  return React.createElement(React.Fragment, undefined, props.children);
};

export var HyperEditOverlay = React.memo(HyperEditOverlayInner);
