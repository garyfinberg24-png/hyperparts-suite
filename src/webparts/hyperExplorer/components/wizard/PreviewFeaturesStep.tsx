import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IExplorerWizardState } from "../../models/IHyperExplorerWizardState";
import type { PreviewMode } from "../../models/IExplorerEnums";
import styles from "./WizardSteps.module.scss";

// ── Preview mode chip options ──
var PREVIEW_MODE_CHIPS: Array<{ key: PreviewMode; label: string }> = [
  { key: "tab", label: "Tabbed" },
  { key: "split", label: "Split Screen" },
  { key: "lightbox", label: "Lightbox Only" },
];

// ── Toggle row helper ──
function toggleRow(
  label: string,
  hint: string | undefined,
  checked: boolean,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
): React.ReactElement {
  return React.createElement("div", { className: styles.fieldRow },
    React.createElement("div", {},
      React.createElement("div", { className: styles.fieldLabel }, label),
      hint ? React.createElement("div", { className: styles.fieldHint }, hint) : undefined
    ),
    React.createElement("input", {
      type: "checkbox",
      className: styles.toggleSwitch,
      checked: checked,
      onChange: onChange,
    })
  );
}

var PreviewFeaturesStep: React.FC<IWizardStepProps<IExplorerWizardState>> = function (props) {
  var state = props.state.previewFeatures;

  function updateField<K extends keyof typeof state>(
    field: K,
    value: (typeof state)[K]
  ): void {
    var updated: Record<string, unknown> = {};
    var keys = Object.keys(state);
    keys.forEach(function (k) {
      (updated as Record<string, unknown>)[k] = (state as unknown as Record<string, unknown>)[k];
    });
    updated[field as string] = value;
    props.onChange({ previewFeatures: updated as unknown as typeof state });
  }

  return React.createElement("div", { className: styles.stepContainer },

    // ── Enable Preview ──
    toggleRow(
      "Enable Preview",
      "Show file previews inline or in a panel",
      state.enablePreview,
      function () { updateField("enablePreview", !state.enablePreview); }
    ),

    // ── Preview Mode (only if enablePreview is true) ──
    state.enablePreview
      ? React.createElement("div", {},
          React.createElement("div", { className: styles.sectionTitle }, "Preview Mode"),
          React.createElement("div", { className: styles.chipGroup },
            PREVIEW_MODE_CHIPS.map(function (opt) {
              var isSelected = state.previewMode === opt.key;
              return React.createElement("div", {
                key: opt.key,
                className: isSelected ? styles.chipActive : styles.chip,
                role: "radio",
                "aria-checked": String(isSelected),
                tabIndex: 0,
                onClick: function () { updateField("previewMode", opt.key); },
                onKeyDown: function (e: React.KeyboardEvent) {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    updateField("previewMode", opt.key);
                  }
                },
              }, opt.label);
            })
          )
        )
      : undefined,

    // ── Enable Lightbox ──
    toggleRow(
      "Enable Lightbox",
      "Fullscreen image and document viewer with zoom",
      state.enableLightbox,
      function () { updateField("enableLightbox", !state.enableLightbox); }
    ),

    // ── Enable Video Playlist ──
    toggleRow(
      "Enable Video Playlist",
      "Group video files into playable playlists",
      state.enableVideoPlaylist,
      function () { updateField("enableVideoPlaylist", !state.enableVideoPlaylist); }
    ),

    // ── Show Thumbnails ──
    toggleRow(
      "Show Thumbnails",
      "Display file thumbnail previews in cards",
      state.showThumbnails,
      function () { updateField("showThumbnails", !state.showThumbnails); }
    ),

    // ── Thumbnail Size ──
    React.createElement("div", { className: styles.fieldRow },
      React.createElement("div", {},
        React.createElement("div", { className: styles.fieldLabel }, "Thumbnail Size"),
        React.createElement("div", { className: styles.fieldHint }, String(state.thumbnailSize) + "px")
      ),
      React.createElement("input", {
        type: "range",
        className: styles.fieldSlider,
        min: 100,
        max: 400,
        step: 50,
        value: state.thumbnailSize,
        "aria-label": "Thumbnail size in pixels",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
          updateField("thumbnailSize", parseInt(e.target.value, 10));
        },
      })
    ),

    // ── Enable Upload ──
    toggleRow(
      "Enable Upload",
      "Allow drag-and-drop file uploading",
      state.enableUpload,
      function () { updateField("enableUpload", !state.enableUpload); }
    ),

    // ── Enable Quick Actions ──
    toggleRow(
      "Enable Quick Actions",
      "Show context menu actions on files",
      state.enableQuickActions,
      function () { updateField("enableQuickActions", !state.enableQuickActions); }
    )
  );
};

export default PreviewFeaturesStep;
