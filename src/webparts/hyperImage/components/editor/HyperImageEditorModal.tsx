import * as React from "react";
import { HyperModal } from "../../../../common/components";
import { useHyperImageStore } from "../../store/useHyperImageStore";
import type { EditorTab } from "../../store/useHyperImageStore";
import type { ShapeMask } from "../../models/IHyperImageShape";
import type { FilterPreset, IFilterConfig } from "../../models/IHyperImageFilter";
import type { HoverEffect } from "../../models/IHyperImageHover";
import type { ITextOverlay } from "../../models/IHyperImageText";
import type { IBorderConfig } from "../../models/IHyperImageBorder";
import type { ShadowPreset } from "../../models/IHyperImageBorder";
import type { EntranceAnimation } from "../../models/IHyperImageAnimation";
import { DEFAULT_FILTER_CONFIG, DEFAULT_TEXT_OVERLAY, DEFAULT_BORDER_CONFIG, FILTER_PRESETS } from "../../models";
import ShapePanel from "./ShapePanel";
import FiltersPanel from "./FiltersPanel";
import TextPanel from "./TextPanel";
import StylingPanel from "./StylingPanel";
import EditorPreview from "./EditorPreview";
import styles from "./HyperImageEditorModal.module.scss";

export interface IHyperImageEditorModalProps {
  imageUrl: string;
  shape: ShapeMask;
  customClipPath: string;
  filterPreset: FilterPreset;
  filterConfigJson: string;
  hoverEffect: HoverEffect;
  textOverlayJson: string;
  borderConfigJson: string;
  shadowPreset: ShadowPreset;
  entranceAnimation: EntranceAnimation;
  objectFit: string;
  aspectRatio: string;
  onApply: (changes: IEditorChanges) => void;
}

export interface IEditorChanges {
  shape: ShapeMask;
  customClipPath: string;
  filterPreset: FilterPreset;
  filterConfigJson: string;
  hoverEffect: HoverEffect;
  textOverlayJson: string;
  borderConfigJson: string;
  shadowPreset: ShadowPreset;
  entranceAnimation: EntranceAnimation;
}

/** Parse JSON safely */
function parseJson<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try { return JSON.parse(json) as T; } catch { return fallback; }
}

var TAB_DEFS: Array<{ id: EditorTab; label: string; icon: string }> = [
  { id: "shape", label: "Shape", icon: "\u2B22" },      // hexagon char
  { id: "filters", label: "Filters", icon: "\u2600" },   // sun char
  { id: "text", label: "Text", icon: "\u2261" },         // triple bar
  { id: "styling", label: "Styling", icon: "\u2726" },   // star char
];

var HyperImageEditorModal: React.FC<IHyperImageEditorModalProps> = function (props) {
  var isOpen = useHyperImageStore(function (s) { return s.isEditorOpen; });
  var closeEditor = useHyperImageStore(function (s) { return s.closeEditor; });
  var editorTab = useHyperImageStore(function (s) { return s.editorTab; });
  var setEditorTab = useHyperImageStore(function (s) { return s.setEditorTab; });

  // ── Local temp state ──
  var _shape = React.useState(props.shape);
  var shape = _shape[0]; var setShape = _shape[1];

  var _customClip = React.useState(props.customClipPath);
  var customClipPath = _customClip[0]; var setCustomClipPath = _customClip[1];

  var _filterPreset = React.useState(props.filterPreset);
  var filterPreset = _filterPreset[0]; var setFilterPreset = _filterPreset[1];

  var _filterConfig = React.useState(function () {
    if (props.filterPreset && props.filterPreset !== "none" && FILTER_PRESETS[props.filterPreset]) {
      return FILTER_PRESETS[props.filterPreset] as IFilterConfig;
    }
    return parseJson<IFilterConfig>(props.filterConfigJson, DEFAULT_FILTER_CONFIG);
  });
  var filterConfig = _filterConfig[0]; var setFilterConfig = _filterConfig[1];

  var _hoverEffect = React.useState(props.hoverEffect);
  var hoverEffect = _hoverEffect[0]; var setHoverEffect = _hoverEffect[1];

  var _textOverlay = React.useState(function () {
    return parseJson<ITextOverlay>(props.textOverlayJson, DEFAULT_TEXT_OVERLAY);
  });
  var textOverlay = _textOverlay[0]; var setTextOverlay = _textOverlay[1];

  var _borderConfig = React.useState(function () {
    return parseJson<IBorderConfig>(props.borderConfigJson, DEFAULT_BORDER_CONFIG);
  });
  var borderConfig = _borderConfig[0]; var setBorderConfig = _borderConfig[1];

  var _shadowPreset = React.useState(props.shadowPreset);
  var shadowPreset = _shadowPreset[0]; var setShadowPreset = _shadowPreset[1];

  var _entranceAnim = React.useState(props.entranceAnimation);
  var entranceAnimation = _entranceAnim[0]; var setEntranceAnimation = _entranceAnim[1];

  var _replayKey = React.useState(0);
  var replayKey = _replayKey[0];

  // Reset local state when modal opens
  React.useEffect(function () {
    if (isOpen) {
      setShape(props.shape);
      setCustomClipPath(props.customClipPath);
      setFilterPreset(props.filterPreset);
      if (props.filterPreset && props.filterPreset !== "none" && FILTER_PRESETS[props.filterPreset]) {
        setFilterConfig(FILTER_PRESETS[props.filterPreset] as IFilterConfig);
      } else {
        setFilterConfig(parseJson<IFilterConfig>(props.filterConfigJson, DEFAULT_FILTER_CONFIG));
      }
      setHoverEffect(props.hoverEffect);
      setTextOverlay(parseJson<ITextOverlay>(props.textOverlayJson, DEFAULT_TEXT_OVERLAY));
      setBorderConfig(parseJson<IBorderConfig>(props.borderConfigJson, DEFAULT_BORDER_CONFIG));
      setShadowPreset(props.shadowPreset);
      setEntranceAnimation(props.entranceAnimation);
    }
  }, [isOpen]);

  /** Apply changes and close */
  function handleApply(): void {
    props.onApply({
      shape: shape,
      customClipPath: customClipPath,
      filterPreset: filterPreset,
      filterConfigJson: JSON.stringify(filterConfig),
      hoverEffect: hoverEffect,
      textOverlayJson: JSON.stringify(textOverlay),
      borderConfigJson: JSON.stringify(borderConfig),
      shadowPreset: shadowPreset,
      entranceAnimation: entranceAnimation,
    });
    closeEditor();
  }

  // ── Sidebar tabs ──
  var tabElements = TAB_DEFS.map(function (tab) {
    var isActive = editorTab === tab.id;
    var tabClass = styles.editorTab + (isActive ? " " + styles.editorTabActive : "");
    return React.createElement("button", {
      key: tab.id,
      className: tabClass,
      onClick: function () { setEditorTab(tab.id); },
      type: "button",
    },
      React.createElement("span", { className: styles.editorTabIcon }, tab.icon),
      tab.label
    );
  });

  // ── Active panel ──
  var activePanel: React.ReactElement;
  if (editorTab === "shape") {
    activePanel = React.createElement(ShapePanel, {
      currentShape: shape,
      customClipPath: customClipPath,
      onShapeChange: setShape,
      onCustomPathChange: setCustomClipPath,
    });
  } else if (editorTab === "filters") {
    activePanel = React.createElement(FiltersPanel, {
      currentPreset: filterPreset,
      customConfig: filterConfig,
      onPresetChange: function (p) {
        setFilterPreset(p);
        if (p !== "none" && FILTER_PRESETS[p]) {
          setFilterConfig(FILTER_PRESETS[p] as IFilterConfig);
        }
      },
      onCustomConfigChange: setFilterConfig,
    });
  } else if (editorTab === "text") {
    activePanel = React.createElement(TextPanel, {
      config: textOverlay,
      onChange: setTextOverlay,
    });
  } else {
    activePanel = React.createElement(StylingPanel, {
      borderConfig: borderConfig,
      shadowPreset: shadowPreset,
      hoverEffect: hoverEffect,
      entranceAnimation: entranceAnimation,
      onBorderChange: setBorderConfig,
      onShadowChange: setShadowPreset,
      onHoverChange: setHoverEffect,
      onEntranceChange: setEntranceAnimation,
    });
  }

  // ── Footer ──
  var footer = React.createElement("div", { className: styles.editorFooter },
    React.createElement("button", {
      className: styles.editorBtn,
      onClick: function () { closeEditor(); },
      type: "button",
    }, "Cancel"),
    React.createElement("button", {
      className: styles.editorBtn + " " + styles.editorBtnPrimary,
      onClick: handleApply,
      type: "button",
    }, "Apply")
  );

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: function () { closeEditor(); },
    title: "HyperImage Visual Editor",
    size: "xlarge",
    footer: footer,
  },
    React.createElement("div", { className: styles.editorLayout },
      // Sidebar
      React.createElement("div", { className: styles.editorSidebar }, tabElements),
      // Preview
      React.createElement(EditorPreview, {
        imageUrl: props.imageUrl,
        shape: shape,
        customClipPath: customClipPath,
        filterConfig: filterConfig,
        borderConfig: borderConfig,
        shadowPreset: shadowPreset,
        objectFit: props.objectFit,
        aspectRatio: props.aspectRatio,
        replayKey: replayKey,
      }),
      // Properties
      React.createElement("div", { className: styles.editorProperties }, activePanel)
    )
  );
};

export default HyperImageEditorModal;
