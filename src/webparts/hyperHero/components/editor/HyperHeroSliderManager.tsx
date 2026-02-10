import * as React from "react";
import type { IHyperHeroSlide, IHyperHeroResponsiveLayouts, IHyperHeroRotation } from "../../models";
import type { IStoredSliderConfig } from "../../utils/sliderStorage";
import {
  getStoredSliders,
  saveSlider,
  deleteSlider,
  renameSlider,
  duplicateSlider,
  exportSliderToJson,
  importSliderFromJson,
  buildSliderConfig,
} from "../../utils/sliderStorage";
import { HyperModal } from "../../../../common/components/HyperModal";
import styles from "./HyperHeroSliderManager.module.scss";

export interface IHyperHeroSliderManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (config: IStoredSliderConfig) => void;
  currentSlides: IHyperHeroSlide[];
  currentLayouts: IHyperHeroResponsiveLayouts;
  currentSettings: {
    heroHeight?: number;
    borderRadius?: number;
    fullBleed?: boolean;
    rotation?: IHyperHeroRotation;
    sliderMode?: string;
  };
}

const HyperHeroSliderManagerInner: React.FC<IHyperHeroSliderManagerProps> = function (props) {
  var { isOpen, onClose, onLoad, currentSlides, currentLayouts, currentSettings } = props;

  // Local state for config list + inline editing
  var configsState = React.useState<IStoredSliderConfig[]>([]);
  var configs = configsState[0];
  var setConfigs = configsState[1];

  var renamingIdState = React.useState<string | undefined>(undefined);
  var renamingId = renamingIdState[0];
  var setRenamingId = renamingIdState[1];

  var renameValueState = React.useState("");
  var renameValue = renameValueState[0];
  var setRenameValue = renameValueState[1];

  var deletingIdState = React.useState<string | undefined>(undefined);
  var deletingId = deletingIdState[0];
  var setDeletingId = deletingIdState[1];

  // Refresh configs from storage when modal opens
  React.useEffect(function () {
    if (isOpen) {
      setConfigs(getStoredSliders());
      setRenamingId(undefined);
      setDeletingId(undefined);
    }
  }, [isOpen]);

  // ── Handlers ──

  var handleSaveCurrent = React.useCallback(function () {
    var name = "Slider " + new Date().toISOString().substring(0, 10) + " " + new Date().toISOString().substring(11, 16);
    var config = buildSliderConfig(name, currentSlides, currentLayouts, currentSettings);
    saveSlider(config);
    setConfigs(getStoredSliders());
  }, [currentSlides, currentLayouts, currentSettings]);

  var handleImport = React.useCallback(function () {
    importSliderFromJson().then(function (config) {
      if (config) {
        saveSlider(config);
        setConfigs(getStoredSliders());
      }
    }).catch(function () { /* ignore */ });
  }, []);

  var handleLoad = React.useCallback(function (config: IStoredSliderConfig) {
    onLoad(config);
    onClose();
  }, [onLoad, onClose]);

  var handleDelete = React.useCallback(function (id: string) {
    deleteSlider(id);
    setConfigs(getStoredSliders());
    setDeletingId(undefined);
  }, []);

  var handleDuplicate = React.useCallback(function (id: string) {
    duplicateSlider(id);
    setConfigs(getStoredSliders());
  }, []);

  var handleExport = React.useCallback(function (config: IStoredSliderConfig) {
    exportSliderToJson(config);
  }, []);

  var handleStartRename = React.useCallback(function (config: IStoredSliderConfig) {
    setRenamingId(config.id);
    setRenameValue(config.name);
  }, []);

  var handleFinishRename = React.useCallback(function () {
    if (renamingId && renameValue.length > 0) {
      renameSlider(renamingId, renameValue);
      setConfigs(getStoredSliders());
    }
    setRenamingId(undefined);
  }, [renamingId, renameValue]);

  var handleRenameKeyDown = React.useCallback(function (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleFinishRename();
    } else if (e.key === "Escape") {
      setRenamingId(undefined);
    }
  }, [handleFinishRename]);

  // ── Render ──

  var renderCard = function (config: IStoredSliderConfig): React.ReactElement {
    var dateStr = config.savedAt ? config.savedAt.substring(0, 10) : "Unknown";
    var isDeleting = deletingId === config.id;
    var isRenaming = renamingId === config.id;

    return React.createElement("div", { key: config.id, className: styles.sliderCard },
      // Thumbnail
      React.createElement("div", { className: styles.cardThumbnail },
        React.createElement("span", { className: styles.cardThumbnailText },
          config.slideCount + " slide" + (config.slideCount === 1 ? "" : "s")
        )
      ),
      // Body
      React.createElement("div", { className: styles.cardBody },
        isRenaming
          ? React.createElement("input", {
              className: styles.cardNameInput,
              value: renameValue,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { setRenameValue(e.target.value); },
              onBlur: handleFinishRename,
              onKeyDown: handleRenameKeyDown,
              autoFocus: true,
              "aria-label": "Rename slider",
            })
          : React.createElement("span", { className: styles.cardName, title: config.name }, config.name),
        React.createElement("span", { className: styles.cardMeta }, dateStr)
      ),
      // Actions
      React.createElement("div", { className: styles.cardActions },
        isDeleting
          ? React.createElement("div", { className: styles.confirmRow },
              React.createElement("span", { className: styles.confirmLabel }, "Delete?"),
              React.createElement("button", {
                className: styles.cardActionBtnDanger,
                onClick: function () { handleDelete(config.id); },
                type: "button",
              }, "Yes"),
              React.createElement("button", {
                className: styles.cardActionBtn,
                onClick: function () { setDeletingId(undefined); },
                type: "button",
              }, "No")
            )
          : React.createElement(React.Fragment, undefined,
              React.createElement("button", {
                className: styles.cardActionBtnLoad,
                onClick: function () { handleLoad(config); },
                type: "button",
                "aria-label": "Load " + config.name,
              }, "Load"),
              React.createElement("button", {
                className: styles.cardActionBtn,
                onClick: function () { handleStartRename(config); },
                type: "button",
                "aria-label": "Rename " + config.name,
              }, "Rename"),
              React.createElement("button", {
                className: styles.cardActionBtn,
                onClick: function () { handleDuplicate(config.id); },
                type: "button",
                "aria-label": "Duplicate " + config.name,
              }, "Copy"),
              React.createElement("button", {
                className: styles.cardActionBtn,
                onClick: function () { handleExport(config); },
                type: "button",
                "aria-label": "Export " + config.name + " as JSON",
              }, "Export"),
              React.createElement("button", {
                className: styles.cardActionBtnDanger,
                onClick: function () { setDeletingId(config.id); },
                type: "button",
                "aria-label": "Delete " + config.name,
              }, "Delete")
            )
      )
    );
  };

  var body: React.ReactElement;
  if (configs.length === 0) {
    body = React.createElement("div", { className: styles.emptyState },
      React.createElement("div", { className: styles.emptyIcon, "aria-hidden": "true" }, "\uD83D\uDDC2\uFE0F"),
      React.createElement("p", { className: styles.emptyTitle }, "No saved sliders yet"),
      React.createElement("p", { className: styles.emptyHint }, "Save your current slider configuration to reuse it on other pages."),
      React.createElement("button", {
        className: styles.toolbarBtnPrimary,
        onClick: handleSaveCurrent,
        type: "button",
      }, "+ Save Current Slider")
    );
  } else {
    body = React.createElement(React.Fragment, undefined,
      React.createElement("div", { className: styles.managerToolbar },
        React.createElement("button", {
          className: styles.toolbarBtnPrimary,
          onClick: handleSaveCurrent,
          type: "button",
          "aria-label": "Save current slider to library",
        }, "+ Save Current"),
        React.createElement("button", {
          className: styles.toolbarBtn,
          onClick: handleImport,
          type: "button",
          "aria-label": "Import slider from JSON file",
        }, "Import JSON")
      ),
      React.createElement("div", { className: styles.sliderGrid },
        configs.map(renderCard)
      )
    );
  }

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: "Slider Library",
    size: "large",
  }, body);
};

export const HyperHeroSliderManager = React.memo(HyperHeroSliderManagerInner);
