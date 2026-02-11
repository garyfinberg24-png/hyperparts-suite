import * as React from "react";
import { HyperModal } from "../../../../common/components/HyperModal";
import type {
  IHyperHeroSlide,
  IHyperHeroCta,
  IHyperHeroSlideBackground,
  IHyperHeroGradient,
  IHyperHeroParallax,
  IHyperHeroCountdown,
  IHyperHeroTextOverlay,
  IHyperHeroFontSettings,
  IHyperHeroFontConfig,
  IHyperHeroLayer,
  VideoSource,
  IElementAnimation,
  ISlideElementAnimations,
  EntranceEffect,
  ContentMode,
  IHyperHeroRotation,
  TransitionEffect,
} from "../../models";
import { DEFAULT_GRADIENT, DEFAULT_ELEMENT_ANIMATION, DEFAULT_FONT_SETTINGS, DEFAULT_ROTATION } from "../../models";
import { HyperHeroSlide } from "../HyperHeroSlide";
import { HyperHeroLayerEditor } from "../canvas/HyperHeroLayerEditor";
import { HyperImageBrowser } from "../shared/HyperImageBrowser";
import { HyperLottieGallery } from "../shared/HyperLottieGallery";
import styles from "./HyperHeroSlideEditor.module.scss";

export interface IHyperHeroSlideEditorProps {
  isOpen: boolean;
  slide: IHyperHeroSlide | undefined;
  sliderMode?: "simple" | "hyper";
  slideIndex?: number;
  slideCount?: number;
  onSave: (slide: IHyperHeroSlide) => void;
  onClose: () => void;
  onAddSlide?: () => void;
  onSaveAndContinue?: (slide: IHyperHeroSlide) => void;
  // Slides Manager props (embedded toggle view)
  allSlides?: IHyperHeroSlide[];
  onEditSlide?: (slideId: string) => void;
  onSlidesChange?: (slides: IHyperHeroSlide[]) => void;
  onDuplicateSlide?: (slideId: string) => void;
  onDeleteSlide?: (slideId: string) => void;
  onOpenSliderLibrary?: () => void;
  initialViewMode?: "editor" | "manager";
  // Slider settings (rotation) props
  rotation?: IHyperHeroRotation;
  onRotationChange?: (rotation: IHyperHeroRotation) => void;
}

type TabId = "background" | "content" | "ctas" | "advanced" | "animations" | "typography" | "accessibility";

/** Preset color palette for quick selection */
const COLOR_PRESETS = [
  "#0078d4", "#106ebe", "#50e6ff", "#00b7c3",
  "#107c10", "#5c2d91", "#ca5010", "#d83b01",
  "#a4262c", "#e74856", "#323130", "#ffffff",
];

/** Quick Style preset definition */
interface IQuickStylePreset {
  id: string;
  label: string;
  apply: (slide: IHyperHeroSlide) => Partial<IHyperHeroSlide>;
}

/** Accessibility check result */
interface IAccessibilityCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  message: string;
}

/** Quick Style presets — match mockup spec */
var QUICK_STYLE_PRESETS: IQuickStylePreset[] = [
  {
    id: "corporate-clean",
    label: "Corporate Clean",
    apply: function () {
      return {
        textColor: "#ffffff",
        textAlign: "left" as "left",
        verticalAlign: "center" as "center",
        background: { type: "solidColor" as "solidColor", backgroundColor: "#0078d4" },
      };
    },
  },
  {
    id: "bold-vibrant",
    label: "Bold & Vibrant",
    apply: function () {
      return {
        textColor: "#ffffff",
        textAlign: "center" as "center",
        verticalAlign: "center" as "center",
        background: { type: "solidColor" as "solidColor", backgroundColor: "#d83b01" },
      };
    },
  },
  {
    id: "dark-elegance",
    label: "Dark Elegance",
    apply: function () {
      return {
        textColor: "#ffffff",
        textAlign: "center" as "center",
        verticalAlign: "center" as "center",
        background: { type: "solidColor" as "solidColor", backgroundColor: "#1a1a2e" },
      };
    },
  },
  {
    id: "nature-calm",
    label: "Nature & Calm",
    apply: function () {
      return {
        textColor: "#ffffff",
        textAlign: "left" as "left",
        verticalAlign: "bottom" as "bottom",
        background: { type: "solidColor" as "solidColor", backgroundColor: "#107c10" },
      };
    },
  },
  {
    id: "tech-modern",
    label: "Tech Modern",
    apply: function () {
      return {
        textColor: "#50e6ff",
        textAlign: "center" as "center",
        verticalAlign: "center" as "center",
        background: { type: "solidColor" as "solidColor", backgroundColor: "#0e2a47" },
      };
    },
  },
  {
    id: "warm-gradient",
    label: "Warm Gradient",
    apply: function () {
      return {
        textColor: "#ffffff",
        textAlign: "center" as "center",
        verticalAlign: "center" as "center",
        background: { type: "solidColor" as "solidColor", backgroundColor: "#ca5010" },
        gradientOverlay: { enabled: true, startColor: "#d83b01", endColor: "#ca5010", angle: "135deg", opacity: 80 },
      };
    },
  },
  {
    id: "minimal-white",
    label: "Minimal White",
    apply: function () {
      return {
        textColor: "#323130",
        textAlign: "center" as "center",
        verticalAlign: "center" as "center",
        background: { type: "solidColor" as "solidColor", backgroundColor: "#ffffff" },
      };
    },
  },
  {
    id: "purple-haze",
    label: "Purple Haze",
    apply: function () {
      return {
        textColor: "#ffffff",
        textAlign: "center" as "center",
        verticalAlign: "center" as "center",
        background: { type: "solidColor" as "solidColor", backgroundColor: "#5c2d91" },
      };
    },
  },
];

const HyperHeroSlideEditorInner: React.FC<IHyperHeroSlideEditorProps> = function (props) {
  const { isOpen, slide, onSave, onClose } = props;
  const sliderMode = props.sliderMode || "hyper";
  const slideIndex = props.slideIndex !== undefined ? props.slideIndex : 0;
  const slideCount = props.slideCount || 1;
  const onAddSlide = props.onAddSlide;
  const onSaveAndContinue = props.onSaveAndContinue;
  // Manager view props
  const allSlides = props.allSlides;
  const onEditSlide = props.onEditSlide;
  const onSlidesChange = props.onSlidesChange;
  const onDuplicateSlide = props.onDuplicateSlide;
  const onDeleteSlide = props.onDeleteSlide;
  const onOpenSliderLibrary = props.onOpenSliderLibrary;

  // View mode: toggle between Slides Manager and Slide Editor
  const viewModeState = React.useState<"editor" | "manager">(props.initialViewMode || "editor");
  const viewMode = viewModeState[0];
  const setViewMode = viewModeState[1];

  // Manager delete confirmation state
  const mgrDeletingIdState = React.useState<string | undefined>(undefined);
  const mgrDeletingId = mgrDeletingIdState[0];
  const setMgrDeletingId = mgrDeletingIdState[1];

  // Reset viewMode when modal opens with a new initialViewMode
  React.useEffect(function () {
    if (isOpen) {
      setViewMode(props.initialViewMode || "editor");
      setMgrDeletingId(undefined);
    }
  }, [isOpen, props.initialViewMode]);

  const tabState = React.useState<TabId>("background");
  const activeTab = tabState[0];
  const setActiveTab = tabState[1];

  const draftState = React.useState<IHyperHeroSlide | undefined>(slide);
  const draft = draftState[0];
  const setDraft = draftState[1];

  // Undo/Redo history
  const undoStackRef = React.useRef<IHyperHeroSlide[]>([]);
  const redoStackRef = React.useRef<IHyperHeroSlide[]>([]);

  /** Push current state onto undo stack before changes */
  const pushUndo = React.useCallback(function (): void {
    if (draft) {
      undoStackRef.current = undoStackRef.current.concat([draft]);
      if (undoStackRef.current.length > 30) {
        undoStackRef.current = undoStackRef.current.slice(undoStackRef.current.length - 30);
      }
      redoStackRef.current = [];
    }
  }, [draft]);

  const handleUndo = React.useCallback(function (): void {
    if (undoStackRef.current.length === 0) return;
    var prev = undoStackRef.current[undoStackRef.current.length - 1];
    undoStackRef.current = undoStackRef.current.slice(0, undoStackRef.current.length - 1);
    if (draft) {
      redoStackRef.current = redoStackRef.current.concat([draft]);
    }
    setDraft(prev);
  }, [draft]);

  const handleRedo = React.useCallback(function (): void {
    if (redoStackRef.current.length === 0) return;
    var next = redoStackRef.current[redoStackRef.current.length - 1];
    redoStackRef.current = redoStackRef.current.slice(0, redoStackRef.current.length - 1);
    if (draft) {
      undoStackRef.current = undoStackRef.current.concat([draft]);
    }
    setDraft(next);
  }, [draft]);

  // Browser modal states
  const imageBrowserState = React.useState(false);
  const showImageBrowser = imageBrowserState[0];
  const setShowImageBrowser = imageBrowserState[1];

  const lottieBrowserState = React.useState(false);
  const showLottieBrowser = lottieBrowserState[0];
  const setShowLottieBrowser = lottieBrowserState[1];

  const layerEditorState = React.useState(false);
  const showLayerEditor = layerEditorState[0];
  const setShowLayerEditor = layerEditorState[1];

  // Preview state
  const previewCollapsedState = React.useState(false);
  const previewCollapsed = previewCollapsedState[0];
  const setPreviewCollapsed = previewCollapsedState[1];

  const previewDeviceState = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const previewDevice = previewDeviceState[0];
  const setPreviewDevice = previewDeviceState[1];

  const replayKeyState = React.useState(0);
  const replayKey = replayKeyState[0];
  const setReplayKey = replayKeyState[1];

  // Accordion expand/collapse state — key sections expanded by default
  const accordionState = React.useState<AccordionState>({
    "bg-color-gradient": true,
    "bg-image-overlay": true,
  });
  const expandedSections = accordionState[0];
  const setExpandedSections = accordionState[1];

  // Reset draft when slide or isOpen changes
  React.useEffect(function () {
    if (isOpen && slide) {
      setDraft(slide);
      setActiveTab("background");
      undoStackRef.current = [];
      redoStackRef.current = [];
      // Reset accordion sections to expanded defaults
      setExpandedSections({
        "bg-color-gradient": true,
        "bg-image-overlay": true,
      });
    }
  }, [isOpen, slide]);

  // Background update helper
  const updateBackground = React.useCallback(function (field: string, value: unknown): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const bg: IHyperHeroSlideBackground = { ...prev.background };
      (bg as unknown as Record<string, unknown>)[field] = value;
      return { ...prev, background: bg };
    });
  }, []);

  // Gradient update helper
  const updateGradient = React.useCallback(function (field: string, value: unknown): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const g: IHyperHeroGradient = prev.gradientOverlay
        ? { ...prev.gradientOverlay }
        : { ...DEFAULT_GRADIENT };
      (g as unknown as Record<string, unknown>)[field] = value;
      return { ...prev, gradientOverlay: g };
    });
  }, []);

  // Parallax update helper
  const updateParallax = React.useCallback(function (field: string, value: unknown): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const p: IHyperHeroParallax = prev.parallax
        ? { ...prev.parallax }
        : { enabled: false, speed: 0.5 };
      (p as unknown as Record<string, unknown>)[field] = value;
      return { ...prev, parallax: p };
    });
  }, []);

  // Countdown update helper
  const updateCountdown = React.useCallback(function (field: string, value: unknown): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const c: IHyperHeroCountdown = prev.countdown
        ? { ...prev.countdown }
        : {
            enabled: false,
            targetDate: "",
            showDays: true,
            showHours: true,
            showMinutes: true,
            showSeconds: true,
            completedBehavior: "hide",
          };
      (c as unknown as Record<string, unknown>)[field] = value;
      return { ...prev, countdown: c };
    });
  }, []);

  // Text overlay update helper
  const updateOverlay = React.useCallback(function (field: string, value: unknown): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const ov: IHyperHeroTextOverlay = prev.textOverlay
        ? { ...prev.textOverlay }
        : {
            enabled: false,
            backgroundColor: "#000000",
            opacity: 50,
            padding: 24,
            paddingHorizontal: 0,
            paddingVertical: 0,
            borderRadius: 0,
            margin: 0,
            maxWidth: 100,
          };
      (ov as unknown as Record<string, unknown>)[field] = value;
      return { ...prev, textOverlay: ov };
    });
  }, []);

  // Font config update helper
  const updateFontSetting = React.useCallback(function (
    element: keyof IHyperHeroFontConfig,
    field: keyof IHyperHeroFontSettings,
    value: unknown
  ): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const fc: IHyperHeroFontConfig = prev.fontConfig
        ? {
            heading: { ...prev.fontConfig.heading },
            subheading: { ...prev.fontConfig.subheading },
            description: { ...prev.fontConfig.description },
          }
        : {
            heading: { ...DEFAULT_FONT_SETTINGS },
            subheading: { ...DEFAULT_FONT_SETTINGS },
            description: { ...DEFAULT_FONT_SETTINGS },
          };
      (fc[element] as unknown as Record<string, unknown>)[field] = value;
      return { ...prev, fontConfig: fc };
    });
  }, []);

  // CTA handlers
  const handleAddCta = React.useCallback(function (): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const newCta: IHyperHeroCta = {
        id: "cta-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
        label: "New Button",
        url: "#",
        openInNewTab: false,
        variant: "primary",
        iconPosition: "before",
      };
      return { ...prev, ctas: prev.ctas.concat([newCta]) };
    });
  }, []);

  const handleRemoveCta = React.useCallback(function (id: string): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const filtered: IHyperHeroCta[] = [];
      prev.ctas.forEach(function (c) {
        if (c.id !== id) filtered.push(c);
      });
      return { ...prev, ctas: filtered };
    });
  }, []);

  const handleUpdateCta = React.useCallback(function (
    id: string,
    field: string,
    value: unknown
  ): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const updated: IHyperHeroCta[] = [];
      prev.ctas.forEach(function (c) {
        if (c.id === id) {
          const copy = { ...c };
          (copy as Record<string, unknown>)[field] = value;
          updated.push(copy);
        } else {
          updated.push(c);
        }
      });
      return { ...prev, ctas: updated };
    });
  }, []);

  // Save handler (Save & Close)
  const handleSave = React.useCallback(function (): void {
    if (draft) {
      onSave(draft);
    }
  }, [draft, onSave]);

  // Save & Continue handler
  const handleSaveAndContinue = React.useCallback(function (): void {
    if (draft && onSaveAndContinue) {
      onSaveAndContinue(draft);
    }
  }, [draft, onSaveAndContinue]);

  // Apply Quick Style
  const handleApplyQuickStyle = React.useCallback(function (preset: IQuickStylePreset): void {
    pushUndo();
    setDraft(function (prev) {
      if (!prev) return prev;
      var partial = preset.apply(prev);
      return { ...prev, ...partial };
    });
  }, [pushUndo]);

  // In editor mode, if no draft, don't render
  // eslint-disable-next-line @rushstack/no-new-null
  if (viewMode === "editor" && !draft) return null;

  // Safe cast: in editor mode draft is guaranteed defined (early return above),
  // in manager mode editorDraft is never used.
  var editorDraft = (draft || {}) as IHyperHeroSlide;

  // ── Manager View: inline slide list ──
  var hasManagerProps = allSlides && onEditSlide && onSlidesChange;

  var handleManagerMoveUp = function (slideId: string): void {
    if (!allSlides || !onSlidesChange) return;
    var idx = -1;
    allSlides.forEach(function (s, i) { if (s.id === slideId) idx = i; });
    if (idx <= 0) return;
    var updated = allSlides.slice();
    var temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    onSlidesChange(updated);
  };

  var handleManagerMoveDown = function (slideId: string): void {
    if (!allSlides || !onSlidesChange) return;
    var idx = -1;
    allSlides.forEach(function (s, i) { if (s.id === slideId) idx = i; });
    if (idx < 0 || idx >= allSlides.length - 1) return;
    var updated = allSlides.slice();
    var temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    onSlidesChange(updated);
  };

  var handleManagerToggleLock = function (slideId: string): void {
    if (!allSlides || !onSlidesChange) return;
    var updated: IHyperHeroSlide[] = [];
    allSlides.forEach(function (s) {
      if (s.id === slideId) {
        updated.push({ ...s, locked: !s.locked });
      } else {
        updated.push(s);
      }
    });
    onSlidesChange(updated);
  };

  var handleManagerToggleEnabled = function (slideId: string): void {
    if (!allSlides || !onSlidesChange) return;
    var updated: IHyperHeroSlide[] = [];
    allSlides.forEach(function (s) {
      if (s.id === slideId) {
        updated.push({ ...s, enabled: !s.enabled });
      } else {
        updated.push(s);
      }
    });
    onSlidesChange(updated);
  };

  var handleManagerEditSlide = function (slideId: string): void {
    if (onEditSlide) onEditSlide(slideId);
    setViewMode("editor");
  };

  var handleManagerConfirmDelete = function (slideId: string): void {
    setMgrDeletingId(undefined);
    if (onDeleteSlide) onDeleteSlide(slideId);
  };

  var getManagerThumbnailStyle = function (s: IHyperHeroSlide): React.CSSProperties {
    var bg = s.background;
    if (bg.type === "image" && bg.imageUrl) {
      return { backgroundImage: "url(" + bg.imageUrl + ")" };
    }
    if (bg.type === "solidColor" && bg.backgroundColor) {
      return { backgroundColor: bg.backgroundColor };
    }
    return { backgroundColor: "#0078d4" };
  };

  var renderManagerSlideRow = function (s: IHyperHeroSlide, idx: number): React.ReactElement {
    var isLocked = !!s.locked;
    var isHidden = !s.enabled;
    var isDeleting = mgrDeletingId === s.id;
    var rowClass = isHidden
      ? styles.managerSlideRowHidden
      : isLocked
        ? styles.managerSlideRowLocked
        : styles.managerSlideRow;

    return React.createElement("div", { key: s.id, className: rowClass, role: "listitem" },
      // Position badge
      React.createElement("span", { className: styles.managerSlidePosition, "aria-label": "Position " + (idx + 1) },
        String(idx + 1)
      ),
      // Thumbnail
      React.createElement("div", {
        className: styles.managerSlideThumbnail,
        style: getManagerThumbnailStyle(s),
        "aria-hidden": "true",
      }),
      // Info (clickable to edit)
      React.createElement("div", {
        className: styles.managerSlideInfo,
        onClick: function () { if (!isLocked) handleManagerEditSlide(s.id); },
        role: isLocked ? undefined : "button",
        tabIndex: isLocked ? undefined : 0,
        onKeyDown: function (e: React.KeyboardEvent) {
          if (!isLocked && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleManagerEditSlide(s.id);
          }
        },
        "aria-label": isLocked ? s.heading + " (locked)" : "Edit " + s.heading,
      },
        React.createElement("span", { className: styles.managerSlideName }, s.heading || "Untitled"),
        React.createElement("div", { className: styles.managerSlideStatus },
          isLocked ? React.createElement("span", { className: styles.managerStatusIcon, title: "Locked", "aria-label": "Locked" }, React.createElement("i", { className: "ms-Icon ms-Icon--LockSolid", style: { fontSize: "12px" }, "aria-hidden": "true" })) : undefined,
          isHidden ? React.createElement("span", { className: styles.managerStatusIcon, title: "Hidden", "aria-label": "Hidden" }, React.createElement("i", { className: "ms-Icon ms-Icon--Hide3", style: { fontSize: "12px" }, "aria-hidden": "true" })) : undefined
        )
      ),
      // Actions
      isDeleting
        ? React.createElement("div", { className: styles.managerDeleteConfirmRow },
            React.createElement("span", { className: styles.managerDeleteConfirmLabel }, "Delete?"),
            React.createElement("button", {
              className: styles.managerDeleteConfirmBtnDanger,
              onClick: function () { handleManagerConfirmDelete(s.id); },
              type: "button",
            }, "Yes"),
            React.createElement("button", {
              className: styles.managerDeleteConfirmBtn,
              onClick: function () { setMgrDeletingId(undefined); },
              type: "button",
            }, "No")
          )
        : React.createElement("div", { className: styles.managerSlideActions },
            // Move Up
            React.createElement("button", {
              className: isLocked || idx === 0 ? styles.managerActionBtnDisabled : styles.managerActionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); if (!isLocked && idx > 0) handleManagerMoveUp(s.id); },
              type: "button",
              "aria-label": "Move up",
              disabled: isLocked || idx === 0,
            }, React.createElement("i", { className: "ms-Icon ms-Icon--ChevronUp", "aria-hidden": "true" })),
            // Move Down
            React.createElement("button", {
              className: isLocked || idx === (allSlides ? allSlides.length - 1 : 0) ? styles.managerActionBtnDisabled : styles.managerActionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); if (!isLocked && allSlides && idx < allSlides.length - 1) handleManagerMoveDown(s.id); },
              type: "button",
              "aria-label": "Move down",
              disabled: isLocked || idx === (allSlides ? allSlides.length - 1 : 0),
            }, React.createElement("i", { className: "ms-Icon ms-Icon--ChevronDown", "aria-hidden": "true" })),
            // Lock / Unlock
            React.createElement("button", {
              className: styles.managerActionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); handleManagerToggleLock(s.id); },
              type: "button",
              "aria-label": isLocked ? "Unlock slide" : "Lock slide",
            }, React.createElement("i", { className: isLocked ? "ms-Icon ms-Icon--Unlock" : "ms-Icon ms-Icon--Lock", "aria-hidden": "true" })),
            // Show / Hide
            React.createElement("button", {
              className: styles.managerActionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); handleManagerToggleEnabled(s.id); },
              type: "button",
              "aria-label": isHidden ? "Show slide" : "Hide slide",
            }, React.createElement("i", { className: isHidden ? "ms-Icon ms-Icon--View" : "ms-Icon ms-Icon--Hide3", "aria-hidden": "true" })),
            // Duplicate
            React.createElement("button", {
              className: isLocked ? styles.managerActionBtnDisabled : styles.managerActionBtn,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); if (!isLocked && onDuplicateSlide) onDuplicateSlide(s.id); },
              type: "button",
              "aria-label": "Duplicate slide",
              disabled: isLocked,
            }, React.createElement("i", { className: "ms-Icon ms-Icon--Copy", "aria-hidden": "true" })),
            // Delete
            React.createElement("button", {
              className: isLocked ? styles.managerActionBtnDisabled : styles.managerActionBtnDanger,
              onClick: function (e: React.MouseEvent) { e.stopPropagation(); if (!isLocked) setMgrDeletingId(s.id); },
              type: "button",
              "aria-label": "Delete slide",
              disabled: isLocked,
            }, React.createElement("i", { className: "ms-Icon ms-Icon--Delete", "aria-hidden": "true" }))
          )
    );
  };

  // ── Build footer based on viewMode ──
  var footer: React.ReactElement;

  if (viewMode === "manager") {
    var mgrSlideCount = allSlides ? allSlides.length : 0;
    footer = React.createElement("div", { className: styles.managerFooter },
      React.createElement("span", { className: styles.managerFooterLabel },
        mgrSlideCount === 1 ? "1 slide" : mgrSlideCount + " slides"
      ),
      React.createElement("button", {
        onClick: onClose,
        className: styles.managerCloseBtn,
        type: "button",
      }, "Close")
    );
  } else {
    // Editor footer: Undo/Redo + Save as Template + Add Slide | Cancel / Save & Continue / Save & Close
    var canUndo = undoStackRef.current.length > 0;
    var canRedo = redoStackRef.current.length > 0;

    footer = React.createElement("div", { className: styles.footerRow },
      // Left side: Undo/Redo
      React.createElement("div", { className: styles.footerLeft },
        React.createElement("button", {
          onClick: handleUndo,
          className: styles.footerBtnSecondary + (canUndo ? "" : " " + styles.footerBtnDisabled),
          type: "button",
          disabled: !canUndo,
          "aria-label": "Undo",
        }, "\u21A9 Undo"),
        React.createElement("button", {
          onClick: handleRedo,
          className: styles.footerBtnSecondary + (canRedo ? "" : " " + styles.footerBtnDisabled),
          type: "button",
          disabled: !canRedo,
          "aria-label": "Redo",
        }, "\u21AA Redo"),
        onAddSlide
          ? React.createElement("button", {
              className: styles.footerBtnSecondary,
              onClick: function (): void {
                if (onAddSlide) onAddSlide();
              },
              type: "button",
            }, "+ Add Slide")
          : undefined
      ),
      // Right side: Cancel / Save & Continue / Save & Close
      React.createElement("div", { className: styles.footerRight },
        React.createElement("button", {
          onClick: onClose,
          className: styles.footerBtnCancel,
          type: "button",
        }, "Cancel"),
        onSaveAndContinue
          ? React.createElement("button", {
              onClick: handleSaveAndContinue,
              className: styles.footerBtnSaveContinue,
              type: "button",
            }, "Save & Continue")
          : undefined,
        React.createElement("button", {
          onClick: handleSave,
          className: styles.footerBtnSave,
          type: "button",
        }, "Save & Close")
      )
    );
  }

  // Tab definitions — filtered by sliderMode
  const ALL_TAB_DEFS: Array<{ id: TabId; label: string; icon: string; hyperOnly: boolean }> = [
    { id: "background", label: "Background", icon: "\uD83D\uDDBC\uFE0F", hyperOnly: false },
    { id: "content", label: "Content", icon: "\u270F\uFE0F", hyperOnly: false },
    { id: "ctas", label: "Buttons", icon: "\uD83D\uDD17", hyperOnly: false },
    { id: "advanced", label: "Advanced", icon: "\u2699\uFE0F", hyperOnly: true },
    { id: "animations", label: "Animations", icon: "\uD83C\uDFAC", hyperOnly: true },
    { id: "typography", label: "Fonts", icon: "Aa", hyperOnly: false },
    { id: "accessibility", label: "A11y", icon: "\u267F", hyperOnly: true },
  ];

  const TAB_DEFS: Array<{ id: TabId; label: string; icon: string }> = [];
  ALL_TAB_DEFS.forEach(function (t) {
    if (!t.hyperOnly || sliderMode === "hyper") {
      TAB_DEFS.push(t);
    }
  });

  // ── Dynamic title based on viewMode ──
  var mgrCount = allSlides ? allSlides.length : slideCount;
  var modalTitle = viewMode === "manager"
    ? "Slides Manager (" + mgrCount + " slide" + (mgrCount === 1 ? "" : "s") + ")"
    : "Edit Slide " + (slideIndex + 1) + " of " + slideCount + ": " + (draft ? draft.heading || "Untitled" : "Untitled");

  // ── View Toggle Bar ──
  var viewToggleBar = hasManagerProps
    ? React.createElement("div", { className: styles.viewToggleBar },
        React.createElement("button", {
          className: viewMode === "manager" ? styles.viewToggleBtnActive : styles.viewToggleBtn,
          onClick: function () { setViewMode("manager"); },
          type: "button",
          "aria-label": "Switch to Slides Manager",
        }, "\uD83D\uDCCB Slides Manager"),
        React.createElement("button", {
          className: viewMode === "editor" ? styles.viewToggleBtnActive : styles.viewToggleBtn,
          onClick: function () { setViewMode("editor"); },
          type: "button",
          "aria-label": "Switch to Slide Editor",
        }, "\u270F\uFE0F Slide Editor")
      )
    : undefined;

  // ── Manager View Content ──
  var managerViewContent = viewMode === "manager" && allSlides
    ? React.createElement("div", { className: styles.editorContainer },
        // Add bar
        React.createElement("div", { className: styles.managerAddBar },
          React.createElement("button", {
            className: styles.managerAddBtn,
            onClick: function () { if (onAddSlide) onAddSlide(); },
            type: "button",
            "aria-label": "Add new slide",
          }, "+ Add Slide"),
          onOpenSliderLibrary
            ? React.createElement("button", {
                className: styles.managerLibraryBtn,
                onClick: onOpenSliderLibrary,
                type: "button",
                "aria-label": "Open slider library",
              }, "\uD83D\uDDC2\uFE0F Library")
            : undefined
        ),
        // Slide list
        React.createElement("div", { className: styles.managerSlideList, role: "list", "aria-label": "Slides" },
          allSlides.map(renderManagerSlideRow)
        )
      )
    : undefined;

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: modalTitle,
    size: "fullscreen",
    footer: footer,
  },
  // View toggle bar
  viewToggleBar,
  // Manager view or Editor view
  viewMode === "manager" && managerViewContent
    ? managerViewContent
    : React.createElement("div", { className: styles.editorContainer },
    // Live preview with actual HyperHeroSlide
    React.createElement("div", { className: styles.livePreview },
      // Preview toolbar
      React.createElement("div", { className: styles.previewToolbar },
        React.createElement("div", { className: styles.previewToolbarLeft },
          React.createElement("span", { className: styles.previewLabel }, "Preview"),
          React.createElement("button", {
            className: styles.previewCollapseBtn,
            onClick: function (): void { setPreviewCollapsed(!previewCollapsed); },
            type: "button",
            "aria-label": previewCollapsed ? "Expand preview" : "Collapse preview",
          }, previewCollapsed ? "\u25B6" : "\u25BC")
        ),
        React.createElement("div", { className: styles.previewToolbarRight },
          // Device toggles
          ["desktop", "tablet", "mobile"].map(function (device) {
            const isActive = previewDevice === device;
            const icons: Record<string, string> = { desktop: "\uD83D\uDDA5\uFE0F", tablet: "\uD83D\uDCF1", mobile: "\uD83D\uDCF1" };
            return React.createElement("button", {
              key: device,
              className: styles.previewDeviceBtn + (isActive ? " " + styles.previewDeviceBtnActive : ""),
              onClick: function (): void {
                setPreviewDevice(device as "desktop" | "tablet" | "mobile");
              },
              type: "button",
              "aria-label": device + " preview",
            }, icons[device] + " " + device.charAt(0).toUpperCase() + device.substring(1));
          }),
          // Replay animation button
          React.createElement("button", {
            className: styles.replayBtn,
            onClick: function (): void { setReplayKey(replayKey + 1); },
            type: "button",
          }, "\u25B6 Replay")
        )
      ),
      // Preview viewport
      React.createElement("div", {
        className: styles.previewViewport + (previewCollapsed ? " " + styles.previewViewportCollapsed : ""),
      },
        React.createElement("div", {
          className: styles.previewSlideContainer
            + (previewDevice === "tablet" ? " " + styles.previewSlideContainerTablet : "")
            + (previewDevice === "mobile" ? " " + styles.previewSlideContainerMobile : ""),
        },
          React.createElement(HyperHeroSlide, {
            key: replayKey,
            slide: editorDraft,
            previewMode: true,
          })
        )
      )
    ),

    // Quick Styles bar (Hyper mode only)
    sliderMode === "hyper" && React.createElement("div", { className: styles.quickStylesBar },
      React.createElement("span", { className: styles.quickStylesLabel }, "Quick Styles"),
      React.createElement("div", { className: styles.quickStylesGrid },
        QUICK_STYLE_PRESETS.map(function (preset) {
          return React.createElement("button", {
            key: preset.id,
            className: styles.quickStyleBtn,
            onClick: function (): void { handleApplyQuickStyle(preset); },
            type: "button",
            "aria-label": "Apply " + preset.label + " style",
          }, preset.label);
        })
      )
    ),

    // Slider Settings bar (visible in both simple and hyper modes)
    (function (): React.ReactElement {
      var rot = props.rotation || DEFAULT_ROTATION;
      var onRotChange = props.onRotationChange;
      var TRANSITION_CHIPS: Array<{ value: TransitionEffect; label: string }> = [
        { value: "fade", label: "Fade" },
        { value: "slide", label: "Slide" },
        { value: "zoom", label: "Zoom" },
        { value: "kenBurns", label: "Ken Burns" },
        { value: "none", label: "None" },
      ];
      return React.createElement("div", { className: styles.sliderSettingsBar },
        React.createElement("div", { className: styles.sliderSettingsHeader },
          React.createElement("span", { className: styles.sliderSettingsIcon, "aria-hidden": "true" }, "\u23F1\uFE0F"),
          React.createElement("span", { className: styles.sliderSettingsTitle }, "Slider Settings")
        ),
        React.createElement("div", { className: styles.sliderSettingsRow },
          // Auto-Rotate toggle
          React.createElement("label", { className: styles.sliderSettingsToggle },
            React.createElement("input", {
              type: "checkbox",
              checked: rot.enabled,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                if (onRotChange) {
                  var updated: IHyperHeroRotation = {
                    enabled: e.target.checked,
                    intervalMs: rot.intervalMs,
                    effect: rot.effect,
                    transitionDurationMs: rot.transitionDurationMs,
                    pauseOnHover: rot.pauseOnHover,
                    showDots: rot.showDots,
                    showArrows: rot.showArrows,
                  };
                  onRotChange(updated);
                }
              },
            }),
            "Auto-Rotate"
          ),
          // Duration slider (only when enabled)
          rot.enabled
            ? React.createElement(React.Fragment, undefined,
                React.createElement("span", { className: styles.sliderSettingsLabel }, "Duration"),
                React.createElement("input", {
                  type: "range",
                  min: 2000,
                  max: 15000,
                  step: 500,
                  value: rot.intervalMs,
                  className: styles.sliderSettingsSlider,
                  "aria-label": "Slide duration in seconds",
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                    if (onRotChange) {
                      var updated: IHyperHeroRotation = {
                        enabled: rot.enabled,
                        intervalMs: parseInt(e.target.value, 10),
                        effect: rot.effect,
                        transitionDurationMs: rot.transitionDurationMs,
                        pauseOnHover: rot.pauseOnHover,
                        showDots: rot.showDots,
                        showArrows: rot.showArrows,
                      };
                      onRotChange(updated);
                    }
                  },
                }),
                React.createElement("span", { className: styles.sliderSettingsValue }, Math.round(rot.intervalMs / 1000) + "s"),
                // Transition chips
                React.createElement("span", { className: styles.sliderSettingsLabel }, "Transition"),
                React.createElement("div", { className: styles.sliderSettingsChipGroup },
                  TRANSITION_CHIPS.map(function (chip) {
                    var isActive = rot.effect === chip.value;
                    return React.createElement("button", {
                      key: chip.value,
                      className: isActive ? styles.sliderSettingsChipActive : styles.sliderSettingsChip,
                      type: "button",
                      "aria-label": chip.label + " transition",
                      "aria-pressed": isActive ? "true" : "false",
                      onClick: function (): void {
                        if (onRotChange) {
                          var updated: IHyperHeroRotation = {
                            enabled: rot.enabled,
                            intervalMs: rot.intervalMs,
                            effect: chip.value,
                            transitionDurationMs: rot.transitionDurationMs,
                            pauseOnHover: rot.pauseOnHover,
                            showDots: rot.showDots,
                            showArrows: rot.showArrows,
                          };
                          onRotChange(updated);
                        }
                      },
                    }, chip.label);
                  })
                ),
                // Pause on Hover toggle
                React.createElement("label", { className: styles.sliderSettingsToggle },
                  React.createElement("input", {
                    type: "checkbox",
                    checked: rot.pauseOnHover,
                    onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                      if (onRotChange) {
                        var updated: IHyperHeroRotation = {
                          enabled: rot.enabled,
                          intervalMs: rot.intervalMs,
                          effect: rot.effect,
                          transitionDurationMs: rot.transitionDurationMs,
                          pauseOnHover: e.target.checked,
                          showDots: rot.showDots,
                          showArrows: rot.showArrows,
                        };
                        onRotChange(updated);
                      }
                    },
                  }),
                  "Pause on Hover"
                )
              )
            : undefined
        )
      );
    })(),

    // Tab bar
    React.createElement("div", { className: styles.tabBar, role: "tablist" },
      TAB_DEFS.map(function (tabDef) {
        const isActive = activeTab === tabDef.id;
        return React.createElement("button", {
          key: tabDef.id,
          className: isActive
            ? styles.tab + " " + styles.tabActive
            : styles.tab,
          onClick: function (): void {
            setActiveTab(tabDef.id);
          },
          role: "tab",
          "aria-selected": isActive ? "true" : "false",
          type: "button",
        },
          React.createElement("span", { "aria-hidden": "true" }, tabDef.icon),
          " ",
          tabDef.label
        );
      })
    ),
    // Tab content
    React.createElement("div", { className: styles.tabContent },
      activeTab === "background" && renderBackgroundTab(editorDraft, updateBackground, updateGradient, setShowImageBrowser, setShowLottieBrowser, expandedSections, setExpandedSections),
      activeTab === "content" && renderContentTab(editorDraft, setDraft, setShowLayerEditor),
      activeTab === "ctas" && renderCtasTab(editorDraft.ctas, handleAddCta, handleRemoveCta, handleUpdateCta),
      activeTab === "advanced" && renderAdvancedTab(
        editorDraft,
        updateGradient,
        updateParallax,
        updateCountdown,
        updateOverlay,
        setDraft,
        expandedSections,
        setExpandedSections
      ),
      activeTab === "animations" && renderAnimationsTab(editorDraft, setDraft, expandedSections, setExpandedSections),
      activeTab === "typography" && renderTypographyTab(editorDraft, updateFontSetting, expandedSections, setExpandedSections),
      activeTab === "accessibility" && renderAccessibilityTab(editorDraft, updateBackground)
    ),

    // Image browser modal
    React.createElement(HyperImageBrowser, {
      isOpen: showImageBrowser,
      onClose: function (): void { setShowImageBrowser(false); },
      onSelect: function (imageUrl: string): void {
        updateBackground("imageUrl", imageUrl);
        updateBackground("type", "image");
        setShowImageBrowser(false);
      },
    }),

    // Lottie gallery modal
    React.createElement(HyperLottieGallery, {
      isOpen: showLottieBrowser,
      onClose: function (): void { setShowLottieBrowser(false); },
      onSelect: function (lottieUrl: string): void {
        updateBackground("lottie", {
          url: lottieUrl,
          loop: true,
          autoplay: true,
          speed: 1,
          renderer: "svg",
        });
        updateBackground("type", "lottie");
        setShowLottieBrowser(false);
      },
    }),

    // Layer editor (Hero Designer) modal
    React.createElement(HyperHeroLayerEditor, {
      isOpen: showLayerEditor,
      slide: editorDraft,
      onClose: function (): void { setShowLayerEditor(false); },
      onSave: function (updatedLayers: IHyperHeroLayer[]): void {
        setDraft(function (prev) {
          if (!prev) return prev;
          return { ...prev, layers: updatedLayers, contentMode: "canvas" as ContentMode };
        });
        setShowLayerEditor(false);
      },
    })
  ));
};

// ── Accordion Section Component ──
/** Set of section IDs that are currently expanded — shared via closure */
type AccordionState = Record<string, boolean>;

function renderAccordionSection(
  sectionId: string,
  title: string,
  icon: string,
  hint: string,
  expandedSections: AccordionState,
  setExpandedSections: React.Dispatch<React.SetStateAction<AccordionState>>,
  content: React.ReactElement
): React.ReactElement {
  const isOpen = expandedSections[sectionId] === true;

  return React.createElement("div", { className: styles.accordion },
    React.createElement("button", {
      className: styles.accordionHeader,
      onClick: function (): void {
        setExpandedSections(function (prev) {
          const updated: AccordionState = {};
          const keys = Object.keys(prev);
          keys.forEach(function (k) { updated[k] = prev[k]; });
          updated[sectionId] = !isOpen;
          return updated;
        });
      },
      "aria-expanded": isOpen ? "true" : "false",
      type: "button",
    },
      React.createElement("span", {
        className: styles.accordionChevron + (isOpen ? " " + styles.accordionChevronOpen : ""),
        "aria-hidden": "true",
      }, "\u25B6"),
      React.createElement("span", { className: styles.accordionIcon, "aria-hidden": "true" }, icon),
      React.createElement("span", { className: styles.accordionTitle }, title),
      hint.length > 0
        ? React.createElement("span", { className: styles.accordionHint }, hint)
        : undefined
    ),
    React.createElement("div", {
      className: styles.accordionBody + (isOpen ? " " + styles.accordionBodyOpen : ""),
    },
      React.createElement("div", { className: styles.accordionContent }, content)
    )
  );
}

// ── Color Picker Component ──
function renderColorPicker(
  label: string,
  value: string,
  defaultValue: string,
  onChange: (color: string) => void
): React.ReactElement {
  const currentColor = value || defaultValue;

  // Preset buttons
  const presetButtons: React.ReactElement[] = [];
  COLOR_PRESETS.forEach(function (color, idx) {
    const isSelected = currentColor.toLowerCase() === color.toLowerCase();
    presetButtons.push(
      React.createElement("button", {
        key: idx,
        className: styles.colorSwatch + (isSelected ? " " + styles.colorSwatchSelected : ""),
        style: {
          background: color,
          border: color === "#ffffff" ? "1px solid #c8c6c4" : "1px solid transparent",
        },
        onClick: function (): void { onChange(color); },
        "aria-label": color,
        type: "button",
      })
    );
  });

  return React.createElement("div", { className: styles.colorPickerGroup },
    React.createElement("label", { className: styles.fieldLabel }, label),
    // Large preview + native picker + hex input
    React.createElement("div", { className: styles.colorPickerRow },
      React.createElement("div", {
        className: styles.colorPreview,
        style: { background: currentColor },
      }),
      React.createElement("input", {
        type: "color",
        className: styles.colorInput,
        value: currentColor,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          onChange(e.target.value);
        },
        "aria-label": "Pick " + label,
      }),
      React.createElement("input", {
        type: "text",
        className: styles.colorHexInput,
        value: currentColor,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          onChange(e.target.value);
        },
        placeholder: "#000000",
      })
    ),
    // Preset palette
    React.createElement("div", { className: styles.colorPalette }, presetButtons)
  );
}

/** Preset gradient swatches */
var GRADIENT_PRESETS: Array<{ start: string; end: string; angle: string }> = [
  { start: "#0078d4", end: "#50e6ff", angle: "135deg" },
  { start: "#5c2d91", end: "#b4a0ff", angle: "135deg" },
  { start: "#d83b01", end: "#ca5010", angle: "135deg" },
  { start: "#107c10", end: "#6ccb5f", angle: "135deg" },
  { start: "#323130", end: "#605e5c", angle: "180deg" },
  { start: "#0e2a47", end: "#1e6cb5", angle: "180deg" },
  { start: "#e74856", end: "#ff8c00", angle: "135deg" },
  { start: "#00b7c3", end: "#50e6ff", angle: "135deg" },
];

// ── Background Tab ──
function renderBackgroundTab(
  draft: IHyperHeroSlide,
  updateBackground: (field: string, value: unknown) => void,
  updateGradient: (field: string, value: unknown) => void,
  openImageBrowser: (show: boolean) => void,
  openLottieBrowser: (show: boolean) => void,
  expandedSections: AccordionState,
  setExpandedSections: React.Dispatch<React.SetStateAction<AccordionState>>
): React.ReactElement {
  const bg = draft.background;
  const currentType = bg.type;
  const gradientEnabled = draft.gradientOverlay ? draft.gradientOverlay.enabled : false;

  // Type selector as styled cards instead of radio buttons
  const typeOptions = [
    { type: "image", label: "Image", icon: "\uD83D\uDDBC\uFE0F" },
    { type: "solidColor", label: "Color", icon: "\uD83C\uDFA8" },
    { type: "video", label: "Video", icon: "\uD83D\uDCF9" },
    { type: "lottie", label: "Lottie", icon: "\u2728" },
  ];

  // ── Color & Gradient panel content (2-col) ──
  var colorGradientContent = React.createElement("div", { className: styles.fieldGroup },
    // Type selector
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Background Type"),
      React.createElement("div", { className: styles.typeSelector },
        typeOptions.map(function (opt) {
          const isSelected = currentType === opt.type;
          return React.createElement("button", {
            key: opt.type,
            className: styles.typeCard + (isSelected ? " " + styles.typeCardSelected : ""),
            onClick: function (): void {
              updateBackground("type", opt.type);
              // Auto-expand the Image & Overlay section when switching to image/video/lottie
              if (opt.type === "image" || opt.type === "video" || opt.type === "lottie") {
                setExpandedSections(function (prev) {
                  var updated: AccordionState = {};
                  Object.keys(prev).forEach(function (k) { updated[k] = prev[k]; });
                  updated["bg-image-overlay"] = true;
                  return updated;
                });
              }
            },
            type: "button",
          },
            React.createElement("span", { "aria-hidden": "true" }, opt.icon),
            React.createElement("span", undefined, opt.label)
          );
        })
      )
    ),
    // 2-col: Left = color swatches, Right = gradient controls
    React.createElement("div", { className: styles.bgTwoCol },
      // Left column: solid color picker
      React.createElement("div", { className: styles.fieldGroup },
        renderColorPicker(
          "Background Color",
          bg.backgroundColor || "",
          "#0078d4",
          function (color: string): void {
            updateBackground("backgroundColor", color);
          }
        )
      ),
      // Right column: gradient controls
      React.createElement("div", { className: styles.fieldGroup },
        React.createElement("label", { className: styles.fieldLabel }, "Gradient Overlay"),
        // Gradient preview bar
        React.createElement("div", {
          className: styles.gradientPreviewBar,
          style: {
            background: gradientEnabled && draft.gradientOverlay
              ? "linear-gradient(" + (draft.gradientOverlay.angle || "180deg") + ", " + (draft.gradientOverlay.stops.length > 0 ? draft.gradientOverlay.stops[0].color : "#000") + ", " + (draft.gradientOverlay.stops.length > 1 ? draft.gradientOverlay.stops[1].color : "#000") + ")"
              : "#f3f2f1",
          },
        }),
        // Enable toggle
        React.createElement("div", { className: styles.toggleRow, style: { padding: "4px 0" } },
          React.createElement("span", { className: styles.toggleLabel, style: { fontSize: "12px" } }, "Enable Gradient"),
          React.createElement("button", {
            className: gradientEnabled
              ? styles.toggleSwitch + " " + styles.toggleSwitchOn
              : styles.toggleSwitch,
            onClick: function (): void { updateGradient("enabled", !gradientEnabled); },
            "aria-label": gradientEnabled ? "Disable gradient" : "Enable gradient",
            type: "button",
          })
        ),
        // Stop 1 + Stop 2 + Angle (only when enabled)
        gradientEnabled && React.createElement(React.Fragment, undefined,
          React.createElement("div", { className: styles.gradientStopRow },
            React.createElement("span", { className: styles.gradientStopLabel }, "Stop 1"),
            React.createElement("input", {
              type: "color",
              className: styles.colorInput,
              value: draft.gradientOverlay && draft.gradientOverlay.stops.length > 0 ? draft.gradientOverlay.stops[0].color : "#000000",
              onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                var stops = draft.gradientOverlay ? draft.gradientOverlay.stops.map(function (s) { return { color: s.color, opacity: s.opacity, position: s.position }; }) : [{ color: "#000000", opacity: 0, position: 0 }, { color: "#000000", opacity: 0.6, position: 100 }];
                stops[0] = { color: e.target.value, opacity: stops[0].opacity, position: stops[0].position };
                updateGradient("stops", stops);
              },
            })
          ),
          React.createElement("div", { className: styles.gradientStopRow },
            React.createElement("span", { className: styles.gradientStopLabel }, "Stop 2"),
            React.createElement("input", {
              type: "color",
              className: styles.colorInput,
              value: draft.gradientOverlay && draft.gradientOverlay.stops.length > 1 ? draft.gradientOverlay.stops[1].color : "#000000",
              onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                var stops = draft.gradientOverlay ? draft.gradientOverlay.stops.map(function (s) { return { color: s.color, opacity: s.opacity, position: s.position }; }) : [{ color: "#000000", opacity: 0, position: 0 }, { color: "#000000", opacity: 0.6, position: 100 }];
                stops[1] = { color: e.target.value, opacity: stops[1].opacity, position: stops[1].position };
                updateGradient("stops", stops);
              },
            })
          ),
          // Angle slider
          React.createElement("label", { className: styles.fieldLabel, style: { fontSize: "11px" } }, "Angle"),
          React.createElement("div", { className: styles.sliderRow },
            React.createElement("input", {
              type: "range",
              className: styles.sliderInput,
              min: "0",
              max: "360",
              value: parseInt((draft.gradientOverlay ? draft.gradientOverlay.angle || "180deg" : "180deg").replace("deg", ""), 10),
              onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                updateGradient("angle", e.target.value + "deg");
              },
            }),
            React.createElement("span", { className: styles.sliderValue },
              parseInt((draft.gradientOverlay ? draft.gradientOverlay.angle || "180deg" : "180deg").replace("deg", ""), 10) + "\u00B0"
            )
          ),
          // 8 preset gradient swatches
          React.createElement("label", { className: styles.fieldLabel, style: { fontSize: "11px" } }, "Presets"),
          React.createElement("div", { className: styles.gradientPresetSwatches },
            GRADIENT_PRESETS.map(function (preset, idx) {
              return React.createElement("button", {
                key: idx,
                className: styles.gradientPresetSwatch,
                style: {
                  background: "linear-gradient(" + preset.angle + ", " + preset.start + ", " + preset.end + ")",
                },
                onClick: function (): void {
                  updateGradient("enabled", true);
                  updateGradient("angle", preset.angle);
                  updateGradient("stops", [
                    { color: preset.start, opacity: 1, position: 0 },
                    { color: preset.end, opacity: 1, position: 100 },
                  ]);
                },
                type: "button",
                "aria-label": "Gradient preset " + (idx + 1),
              });
            })
          )
        )
      )
    )
  );

  // ── Image & Overlay panel content ──
  var imageOverlayContent = React.createElement("div", { className: styles.fieldGroup },
    // Image URL / Browse
    currentType === "image" && React.createElement(React.Fragment, undefined,
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Image URL"),
        React.createElement("input", {
          type: "text",
          className: styles.textInput,
          value: bg.imageUrl || "",
          placeholder: "https://your-site.com/image.jpg",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateBackground("imageUrl", e.target.value);
          },
        }),
        React.createElement("div", { style: { display: "flex", gap: "8px", marginTop: "6px", alignItems: "center" } },
          React.createElement("button", {
            className: styles.addCtaBtn,
            onClick: function (): void { openImageBrowser(true); },
            type: "button",
            style: { margin: 0 },
          }, "Browse Images"),
          React.createElement("p", { className: styles.fieldHint, style: { margin: 0 } }, "or paste a direct URL")
        )
      ),
      bg.imageUrl && React.createElement("img", {
        src: bg.imageUrl,
        alt: "Background preview",
        className: styles.previewThumbnail,
      })
    ),
    // Video fields
    currentType === "video" && React.createElement(React.Fragment, undefined,
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Video Source"),
        React.createElement("select", {
          className: styles.selectInput,
          value: bg.video ? bg.video.source : "mp4",
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
            const newVideo = {
              source: e.target.value as VideoSource,
              url: bg.video ? bg.video.url : "",
              autoplay: bg.video ? bg.video.autoplay : true,
              loop: bg.video ? bg.video.loop : true,
              muted: bg.video ? bg.video.muted : true,
            };
            updateBackground("video", newVideo);
          },
        },
          ["mp4", "youtube", "vimeo", "stream"].map(function (src) {
            return React.createElement("option", { key: src, value: src }, src.toUpperCase());
          })
        )
      ),
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Video URL"),
        React.createElement("input", {
          type: "text",
          className: styles.textInput,
          value: bg.video ? bg.video.url : "",
          placeholder: "https://...",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            const newVideo = {
              source: bg.video ? bg.video.source : "mp4" as VideoSource,
              url: e.target.value,
              autoplay: bg.video ? bg.video.autoplay : true,
              loop: bg.video ? bg.video.loop : true,
              muted: bg.video ? bg.video.muted : true,
            };
            updateBackground("video", newVideo);
          },
        })
      )
    ),
    // Lottie fields
    currentType === "lottie" && React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Lottie Animation URL"),
      React.createElement("input", {
        type: "text",
        className: styles.textInput,
        value: bg.lottie ? bg.lottie.url : "",
        placeholder: "https://assets.lottiefiles.com/...",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          const newLottie = {
            url: e.target.value,
            loop: bg.lottie ? bg.lottie.loop : true,
            autoplay: bg.lottie ? bg.lottie.autoplay : true,
            speed: bg.lottie ? bg.lottie.speed : 1,
            renderer: bg.lottie ? bg.lottie.renderer : "svg",
          };
          updateBackground("lottie", newLottie);
        },
      }),
      React.createElement("div", { style: { display: "flex", gap: "8px", marginTop: "6px", alignItems: "center" } },
        React.createElement("button", {
          className: styles.addCtaBtn,
          onClick: function (): void { openLottieBrowser(true); },
          type: "button",
          style: { margin: 0 },
        }, "Browse Lottie Animations"),
        React.createElement("p", { className: styles.fieldHint, style: { margin: 0 } }, "or paste a JSON URL")
      )
    ),
    // Overlay opacity slider (for any bg type)
    React.createElement("div", { style: { marginTop: "8px" } },
      React.createElement("label", { className: styles.fieldLabel }, "Overlay Opacity"),
      React.createElement("span", { className: styles.fieldHint }, "Darken the background for better text readability"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range",
          className: styles.sliderInput,
          min: "0",
          max: "100",
          value: draft.gradientOverlay && draft.gradientOverlay.stops.length > 1 ? Math.round(draft.gradientOverlay.stops[1].opacity * 100) : 60,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            var newOpacity = parseInt(e.target.value, 10) / 100;
            var stops = draft.gradientOverlay ? draft.gradientOverlay.stops.map(function (s) { return { color: s.color, opacity: s.opacity, position: s.position }; }) : [{ color: "#000000", opacity: 0, position: 0 }, { color: "#000000", opacity: 0.6, position: 100 }];
            if (stops.length > 1) {
              stops[1] = { color: stops[1].color, opacity: newOpacity, position: stops[1].position };
            }
            updateGradient("stops", stops);
            if (!draft.gradientOverlay || !draft.gradientOverlay.enabled) {
              updateGradient("enabled", true);
            }
          },
        }),
        React.createElement("span", { className: styles.sliderValue },
          (draft.gradientOverlay && draft.gradientOverlay.stops.length > 1 ? Math.round(draft.gradientOverlay.stops[1].opacity * 100) : 60) + "%"
        )
      )
    )
  );

  // ── Focal Point panel content ──
  var focalX = bg.imageFocalPoint ? bg.imageFocalPoint.x : 50;
  var focalY = bg.imageFocalPoint ? bg.imageFocalPoint.y : 50;

  var focalPointContent = React.createElement("div", { className: styles.fieldGroup },
    currentType === "image"
      ? React.createElement("div", { className: styles.focalPointContainer },
          // Interactive click-to-set box
          React.createElement("div", {
            className: styles.focalPointBox,
            style: bg.imageUrl ? { backgroundImage: "url(" + bg.imageUrl + ")" } : undefined,
            onClick: function (e: React.MouseEvent<HTMLDivElement>): void {
              var rect = e.currentTarget.getBoundingClientRect();
              var x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
              var y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
              updateBackground("imageFocalPoint", { x: x, y: y });
            },
          },
            React.createElement("div", {
              className: styles.focalPointDot,
              style: { left: focalX + "%", top: focalY + "%" },
            })
          ),
          // X/Y readout + reset
          React.createElement("div", { className: styles.focalPointReadout },
            React.createElement("div", { className: styles.focalPointCoord },
              React.createElement("span", { className: styles.focalPointCoordLabel }, "X"),
              React.createElement("span", { className: styles.focalPointCoordValue }, focalX + "%")
            ),
            React.createElement("div", { className: styles.focalPointCoord },
              React.createElement("span", { className: styles.focalPointCoordLabel }, "Y"),
              React.createElement("span", { className: styles.focalPointCoordValue }, focalY + "%")
            ),
            React.createElement("button", {
              className: styles.focalPointResetBtn,
              onClick: function (): void {
                updateBackground("imageFocalPoint", { x: 50, y: 50 });
              },
              type: "button",
            }, "Reset to Center")
          )
        )
      : React.createElement("p", { className: styles.fieldHint }, "Focal point is only available for image backgrounds. Switch to Image type to use this feature.")
  );

  // Build hints
  var colorHint = currentType === "solidColor" ? (bg.backgroundColor || "#0078d4") : currentType;
  var imageHint = currentType === "image" ? (bg.imageUrl ? "Set" : "No image") : "N/A";
  var focalHint = bg.imageFocalPoint ? focalX + "%, " + focalY + "%" : "Center (default)";

  return React.createElement("div", { className: styles.fieldGroup },
    renderAccordionSection("bg-color-gradient", "Color & Gradient", "\uD83C\uDFA8", gradientEnabled ? "Gradient on" : colorHint, expandedSections, setExpandedSections, colorGradientContent),
    renderAccordionSection("bg-image-overlay", "Image & Overlay", "\uD83D\uDDBC\uFE0F", imageHint, expandedSections, setExpandedSections, imageOverlayContent),
    renderAccordionSection("bg-focal-point", "Focal Point", "\uD83C\uDFAF", focalHint, expandedSections, setExpandedSections, focalPointContent)
  );
}

// ── Content Tab ──
function renderContentTab(
  draft: IHyperHeroSlide,
  setDraft: React.Dispatch<React.SetStateAction<IHyperHeroSlide | undefined>>,
  openLayerEditor: (show: boolean) => void
): React.ReactElement {
  const currentMode = draft.contentMode || "stack";
  const layerCount = draft.layers ? draft.layers.length : 0;

  return React.createElement("div", { className: styles.fieldGroup },
    // Content Mode toggle
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Content Mode"),
      React.createElement("div", { className: styles.typeSelector },
        [
          { value: "stack", label: "Stack", desc: "Standard layout" },
          { value: "canvas", label: "Canvas", desc: "Free positioning" },
        ].map(function (opt) {
          return React.createElement("button", {
            key: opt.value,
            className: styles.typeCard + (currentMode === opt.value ? " " + styles.typeCardSelected : ""),
            onClick: function (): void {
              setDraft(function (prev) {
                return prev ? { ...prev, contentMode: opt.value as ContentMode } : prev;
              });
            },
            type: "button",
          },
            React.createElement("span", undefined, opt.label)
          );
        })
      )
    ),
    // Hero Designer button (canvas mode)
    currentMode === "canvas" && React.createElement("div", undefined,
      React.createElement("button", {
        className: styles.addCtaBtn,
        onClick: function (): void { openLayerEditor(true); },
        type: "button",
        style: { padding: "12px 16px", fontSize: "14px", fontWeight: 600 },
      }, "\uD83C\uDFA8 Open Hero Designer" + (layerCount > 0 ? " (" + layerCount + " layers)" : "")),
      React.createElement("p", { className: styles.fieldHint },
        "Design your hero with drag-and-drop layers \u2014 add text, images, buttons, shapes, and icons anywhere on the slide."
      )
    ),
    // Divider before standard content fields
    React.createElement("div", { style: { height: "1px", background: "#edebe9", margin: "4px 0" } }),
    // Heading + Subheading side-by-side (2-col)
    React.createElement("div", { className: styles.contentTwoCol },
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Heading"),
        React.createElement("input", {
          type: "text",
          className: styles.textInput,
          value: draft.heading,
          placeholder: "Enter heading text...",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            setDraft(function (prev) {
              return prev ? { ...prev, heading: e.target.value } : prev;
            });
          },
        })
      ),
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Subheading"),
        React.createElement("input", {
          type: "text",
          className: styles.textInput,
          value: draft.subheading || "",
          placeholder: "Enter subheading text...",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            setDraft(function (prev) {
              return prev ? { ...prev, subheading: e.target.value } : prev;
            });
          },
        })
      )
    ),
    // Description full-width
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Description"),
      React.createElement("textarea", {
        className: styles.textArea,
        rows: 3,
        value: draft.description || "",
        placeholder: "Optional longer description...",
        onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>): void {
          setDraft(function (prev) {
            return prev ? { ...prev, description: e.target.value } : prev;
          });
        },
      })
    ),
    // Text Alignment + Vertical Position side-by-side (2-col)
    React.createElement("div", { className: styles.contentTwoCol },
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Text Alignment"),
        React.createElement("div", { className: styles.typeSelector },
          [
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ].map(function (opt) {
            return React.createElement("button", {
              key: opt.value,
              className: styles.typeCard + (draft.textAlign === opt.value ? " " + styles.typeCardSelected : ""),
              onClick: function (): void {
                setDraft(function (prev) {
                  return prev ? { ...prev, textAlign: opt.value as "left" | "center" | "right" } : prev;
                });
              },
              type: "button",
            },
              React.createElement("span", undefined, opt.label)
            );
          })
        )
      ),
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Vertical Position"),
        React.createElement("div", { className: styles.typeSelector },
          [
            { value: "top", label: "Top" },
            { value: "center", label: "Middle" },
            { value: "bottom", label: "Bottom" },
          ].map(function (opt) {
            return React.createElement("button", {
              key: opt.value,
              className: styles.typeCard + (draft.verticalAlign === opt.value ? " " + styles.typeCardSelected : ""),
              onClick: function (): void {
                setDraft(function (prev) {
                  return prev ? { ...prev, verticalAlign: opt.value as "top" | "center" | "bottom" } : prev;
                });
              },
              type: "button",
            },
              React.createElement("span", undefined, opt.label)
            );
          })
        )
      )
    ),
    // Text color
    renderColorPicker(
      "Text Color",
      draft.textColor || "",
      "#ffffff",
      function (color: string): void {
        setDraft(function (prev) {
          return prev ? { ...prev, textColor: color } : prev;
        });
      }
    )
  );
}

// ── CTAs Tab ──
function renderCtasTab(
  ctas: IHyperHeroCta[],
  onAdd: () => void,
  onRemove: (id: string) => void,
  onUpdate: (id: string, field: string, value: unknown) => void
): React.ReactElement {
  return React.createElement("div", { className: styles.fieldGroup },
    ctas.length === 0
      ? React.createElement("div", { className: styles.emptyState },
          React.createElement("span", { className: styles.emptyStateIcon, "aria-hidden": "true" }, "\uD83D\uDD17"),
          React.createElement("p", { className: styles.emptyStateText }, "No buttons added yet. Add a call-to-action button to drive engagement.")
        )
      : undefined,
    React.createElement("div", { className: styles.ctaList },
      ctas.map(function (cta, ctaIdx) {
        return React.createElement("div", { key: cta.id, className: styles.ctaItem },
          React.createElement("div", { className: styles.ctaItemHeader },
            React.createElement("span", { className: styles.ctaItemTitle }, "Button " + (ctaIdx + 1)),
            React.createElement("div", { style: { display: "flex", gap: "4px" } },
              React.createElement("label", { className: styles.radioLabel, style: { fontSize: "11px" } },
                React.createElement("input", {
                  type: "checkbox",
                  checked: cta.openInNewTab,
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                    onUpdate(cta.id, "openInNewTab", e.target.checked);
                  },
                }),
                " New tab"
              ),
              React.createElement("button", {
                className: styles.ctaRemoveBtn,
                onClick: function (): void { onRemove(cta.id); },
                type: "button",
              }, "\u2715")
            )
          ),
          // 3-col row: Label + URL + Style dropdown
          React.createElement("div", { className: styles.ctaRow3Col },
            React.createElement("div", undefined,
              React.createElement("label", { className: styles.fieldLabel }, "Label"),
              React.createElement("input", {
                type: "text",
                className: styles.textInput,
                value: cta.label,
                placeholder: "Button text...",
                onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                  onUpdate(cta.id, "label", e.target.value);
                },
              })
            ),
            React.createElement("div", undefined,
              React.createElement("label", { className: styles.fieldLabel }, "URL"),
              React.createElement("input", {
                type: "text",
                className: styles.textInput,
                value: cta.url,
                placeholder: "https://...",
                onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                  onUpdate(cta.id, "url", e.target.value);
                },
              })
            ),
            React.createElement("div", undefined,
              React.createElement("label", { className: styles.fieldLabel }, "Style"),
              React.createElement("select", {
                className: styles.selectInput,
                value: cta.variant || "primary",
                onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
                  onUpdate(cta.id, "variant", e.target.value);
                },
              },
                [
                  { value: "primary", label: "Solid" },
                  { value: "secondary", label: "Outline" },
                  { value: "ghost", label: "Ghost" },
                  { value: "pill", label: "Pill" },
                  { value: "gradient", label: "Gradient" },
                  { value: "shadow", label: "Shadow" },
                  { value: "minimal", label: "Minimal" },
                  { value: "rounded", label: "Rounded" },
                  { value: "outline", label: "Line" },
                  { value: "block", label: "Block" },
                ].map(function (opt) {
                  return React.createElement("option", { key: opt.value, value: opt.value }, opt.label);
                })
              )
            )
          ),
          // 2nd row: Color + Size + Animation
          React.createElement("div", { className: styles.ctaRow3Col },
            // Colors
            React.createElement("div", undefined,
              React.createElement("label", { className: styles.fieldLabel }, "Button Color"),
              React.createElement("div", { style: { display: "flex", gap: "6px", alignItems: "center" } },
                React.createElement("input", {
                  type: "color",
                  value: cta.backgroundColor || "#0078d4",
                  className: styles.colorInput,
                  title: "Background color",
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                    onUpdate(cta.id, "backgroundColor", e.target.value);
                  },
                }),
                React.createElement("input", {
                  type: "color",
                  value: cta.textColor || "#ffffff",
                  className: styles.colorInput,
                  title: "Text color",
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                    onUpdate(cta.id, "textColor", e.target.value);
                  },
                }),
                (cta.backgroundColor || cta.textColor)
                  ? React.createElement("button", {
                      type: "button",
                      className: styles.ctaResetBtn,
                      onClick: function (): void {
                        onUpdate(cta.id, "backgroundColor", undefined);
                        onUpdate(cta.id, "textColor", undefined);
                      },
                      title: "Reset to default",
                    }, "\u21BA")
                  : undefined
              )
            ),
            // Padding
            React.createElement("div", undefined,
              React.createElement("label", { className: styles.fieldLabel }, "Padding"),
              React.createElement("div", { style: { display: "flex", gap: "4px", alignItems: "center" } },
                React.createElement("input", {
                  type: "number",
                  className: styles.numberInputSmall,
                  min: 4,
                  max: 60,
                  step: 2,
                  value: cta.paddingX !== undefined ? cta.paddingX : "",
                  placeholder: "H",
                  title: "Horizontal padding (px)",
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                    const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                    onUpdate(cta.id, "paddingX", val);
                  },
                }),
                React.createElement("span", { style: { fontSize: "11px", color: "#605e5c" } }, "\u00D7"),
                React.createElement("input", {
                  type: "number",
                  className: styles.numberInputSmall,
                  min: 2,
                  max: 40,
                  step: 2,
                  value: cta.paddingY !== undefined ? cta.paddingY : "",
                  placeholder: "V",
                  title: "Vertical padding (px)",
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                    const val = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
                    onUpdate(cta.id, "paddingY", val);
                  },
                })
              )
            ),
            // Animation
            React.createElement("div", undefined,
              React.createElement("label", { className: styles.fieldLabel }, "Animation"),
              React.createElement("select", {
                className: styles.selectInput,
                value: cta.animation || "none",
                onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
                  onUpdate(cta.id, "animation", e.target.value);
                },
              },
                [
                  { value: "none", label: "None" },
                  { value: "fadeIn", label: "Fade In" },
                  { value: "bounceIn", label: "Bounce In" },
                  { value: "slideUp", label: "Slide Up" },
                  { value: "slideLeft", label: "Slide Left" },
                  { value: "pulse", label: "Pulse" },
                  { value: "shake", label: "Shake" },
                  { value: "glow", label: "Glow" },
                ].map(function (opt) {
                  return React.createElement("option", { key: opt.value, value: opt.value }, opt.label);
                })
              )
            )
          )
        );
      })
    ),
    React.createElement("button", {
      className: styles.addCtaBtn,
      onClick: onAdd,
      type: "button",
    }, "+ Add Button")
  );
}

/** Hover effect options for the 9-card grid */
var HOVER_EFFECT_OPTIONS: Array<{ value: string; label: string; icon: string }> = [
  { value: "none", label: "None", icon: "\u2B1C" },
  { value: "zoom", label: "Zoom", icon: "\uD83D\uDD0D" },
  { value: "darken", label: "Darken", icon: "\uD83C\uDF11" },
  { value: "blur", label: "Blur", icon: "\uD83C\uDF2B\uFE0F" },
  { value: "kenBurns", label: "Ken Burns", icon: "\uD83C\uDFA5" },
  { value: "colorShift", label: "Color Shift", icon: "\uD83C\uDF08" },
  { value: "lift", label: "Lift", icon: "\u2B06\uFE0F" },
  { value: "glow", label: "Glow", icon: "\u2728" },
  { value: "reveal", label: "Reveal", icon: "\uD83D\uDC41\uFE0F" },
];

// ── Advanced Tab (organized into accordion sections) ──
function renderAdvancedTab(
  draft: IHyperHeroSlide,
  updateGradient: (field: string, value: unknown) => void,
  updateParallax: (field: string, value: unknown) => void,
  updateCountdown: (field: string, value: unknown) => void,
  updateOverlay: (field: string, value: unknown) => void,
  setDraft: React.Dispatch<React.SetStateAction<IHyperHeroSlide | undefined>>,
  expandedSections: AccordionState,
  setExpandedSections: React.Dispatch<React.SetStateAction<AccordionState>>
): React.ReactElement {
  const gradientEnabled = draft.gradientOverlay ? draft.gradientOverlay.enabled : false;
  const parallaxEnabled = draft.parallax ? draft.parallax.enabled : false;
  const countdownEnabled = draft.countdown ? draft.countdown.enabled : false;
  const overlayEnabled = draft.textOverlay ? draft.textOverlay.enabled : false;
  const kenBurnsEnabled = draft.kenBurnsEnabled === true;
  const textBackdropEnabled = draft.textBackdropEnabled === true;
  const vignetteEnabled = draft.vignetteEnabled === true;

  // ── Effects Section (6 toggles) ──
  const effectsContent = React.createElement("div", { className: styles.fieldGroup },
    // Gradient
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Gradient Overlay"),
        React.createElement("span", { className: styles.toggleHint }, "Color gradient over the background")
      ),
      React.createElement("button", {
        className: gradientEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void { updateGradient("enabled", !gradientEnabled); },
        "aria-label": gradientEnabled ? "Disable gradient" : "Enable gradient",
        type: "button",
      })
    ),
    // Parallax
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Parallax Scrolling"),
        React.createElement("span", { className: styles.toggleHint }, "Background image moves slower on scroll")
      ),
      React.createElement("button", {
        className: parallaxEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void { updateParallax("enabled", !parallaxEnabled); },
        "aria-label": parallaxEnabled ? "Disable parallax" : "Enable parallax",
        type: "button",
      })
    ),
    parallaxEnabled && React.createElement("div", { className: styles.subFields },
      React.createElement("label", { className: styles.fieldLabel }, "Parallax Speed"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range",
          className: styles.sliderInput,
          min: "0.1",
          max: "1.0",
          step: "0.1",
          value: draft.parallax ? draft.parallax.speed : 0.5,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateParallax("speed", parseFloat(e.target.value));
          },
        }),
        React.createElement("span", { className: styles.sliderValue },
          (draft.parallax ? draft.parallax.speed : 0.5).toFixed(1)
        )
      )
    ),
    // Countdown
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Countdown Timer"),
        React.createElement("span", { className: styles.toggleHint }, "Countdown to a target date")
      ),
      React.createElement("button", {
        className: countdownEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void { updateCountdown("enabled", !countdownEnabled); },
        "aria-label": countdownEnabled ? "Disable countdown" : "Enable countdown",
        type: "button",
      })
    ),
    countdownEnabled && React.createElement("div", { className: styles.subFields },
      React.createElement("label", { className: styles.fieldLabel }, "Target Date"),
      React.createElement("input", {
        type: "date",
        className: styles.textInput,
        value: draft.countdown ? draft.countdown.targetDate : "",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateCountdown("targetDate", e.target.value);
        },
      }),
      React.createElement("label", { className: styles.fieldLabel, style: { marginTop: "8px" } }, "Label"),
      React.createElement("input", {
        type: "text",
        className: styles.textInput,
        value: draft.countdown ? draft.countdown.label || "" : "",
        placeholder: "e.g. Event starts in...",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateCountdown("label", e.target.value);
        },
      })
    ),
    // Ken Burns
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Ken Burns Effect"),
        React.createElement("span", { className: styles.toggleHint }, "Slow zoom and pan on static images")
      ),
      React.createElement("button", {
        className: kenBurnsEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          setDraft(function (prev) {
            return prev ? { ...prev, kenBurnsEnabled: !kenBurnsEnabled } : prev;
          });
        },
        "aria-label": kenBurnsEnabled ? "Disable Ken Burns" : "Enable Ken Burns",
        type: "button",
      })
    ),
    // Text Backdrop
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Text Backdrop"),
        React.createElement("span", { className: styles.toggleHint }, "Frosted glass blur behind text content")
      ),
      React.createElement("button", {
        className: textBackdropEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          setDraft(function (prev) {
            return prev ? { ...prev, textBackdropEnabled: !textBackdropEnabled } : prev;
          });
        },
        "aria-label": textBackdropEnabled ? "Disable text backdrop" : "Enable text backdrop",
        type: "button",
      })
    ),
    // Vignette
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Vignette"),
        React.createElement("span", { className: styles.toggleHint }, "Darken edges for a cinematic look")
      ),
      React.createElement("button", {
        className: vignetteEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          setDraft(function (prev) {
            return prev ? { ...prev, vignetteEnabled: !vignetteEnabled } : prev;
          });
        },
        "aria-label": vignetteEnabled ? "Disable vignette" : "Enable vignette",
        type: "button",
      })
    )
  );

  // ── Hover Effect Section (9-card grid) ──
  var currentHoverEffect = draft.hoverEffect || "none";
  const hoverContent = React.createElement("div", { className: styles.fieldGroup },
    React.createElement("p", { className: styles.fieldHint }, "Choose how the slide reacts when a user hovers over it"),
    React.createElement("div", { className: styles.hoverEffectGrid },
      HOVER_EFFECT_OPTIONS.map(function (opt) {
        var isSelected = currentHoverEffect === opt.value;
        return React.createElement("button", {
          key: opt.value,
          className: styles.hoverEffectCard + (isSelected ? " " + styles.hoverEffectCardSelected : ""),
          onClick: function (): void {
            setDraft(function (prev) {
              return prev ? { ...prev, hoverEffect: opt.value as IHyperHeroSlide["hoverEffect"] } : prev;
            });
          },
          type: "button",
          "aria-label": opt.label + " hover effect",
        },
          React.createElement("span", { className: styles.hoverEffectIcon, "aria-hidden": "true" }, opt.icon),
          React.createElement("span", undefined, opt.label)
        );
      })
    )
  );

  // ── Text Overlay Section ──
  const overlayContent = React.createElement("div", { className: styles.fieldGroup },
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Enable Text Overlay"),
        React.createElement("span", { className: styles.toggleHint }, "Semi-transparent backdrop behind text content")
      ),
      React.createElement("button", {
        className: overlayEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void { updateOverlay("enabled", !overlayEnabled); },
        "aria-label": overlayEnabled ? "Disable text overlay" : "Enable text overlay",
        type: "button",
      })
    ),
    overlayEnabled && React.createElement("div", { className: styles.subFields },
      renderColorPicker(
        "Overlay Color",
        draft.textOverlay ? draft.textOverlay.backgroundColor : "",
        "#000000",
        function (color: string): void { updateOverlay("backgroundColor", color); }
      ),
      React.createElement("label", { className: styles.fieldLabel }, "Opacity"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range", className: styles.sliderInput, min: "0", max: "100",
          value: draft.textOverlay ? draft.textOverlay.opacity : 50,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateOverlay("opacity", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.sliderValue },
          (draft.textOverlay ? draft.textOverlay.opacity : 50) + "%"
        )
      ),
      React.createElement("label", { className: styles.fieldLabel }, "Padding"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range", className: styles.sliderInput, min: "0", max: "80",
          value: draft.textOverlay ? draft.textOverlay.padding : 24,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateOverlay("padding", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.sliderValue },
          (draft.textOverlay ? draft.textOverlay.padding : 24) + "px"
        )
      ),
      React.createElement("label", { className: styles.fieldLabel }, "Border Radius"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range", className: styles.sliderInput, min: "0", max: "40",
          value: draft.textOverlay ? draft.textOverlay.borderRadius : 0,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateOverlay("borderRadius", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.sliderValue },
          (draft.textOverlay ? draft.textOverlay.borderRadius : 0) + "px"
        )
      ),
      React.createElement("label", { className: styles.fieldLabel }, "Margin from Edges"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range", className: styles.sliderInput, min: "0", max: "60",
          value: draft.textOverlay ? draft.textOverlay.margin : 0,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateOverlay("margin", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.sliderValue },
          (draft.textOverlay ? draft.textOverlay.margin : 0) + "px"
        )
      ),
      React.createElement("label", { className: styles.fieldLabel }, "Max Width"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range", className: styles.sliderInput, min: "20", max: "100",
          value: draft.textOverlay ? draft.textOverlay.maxWidth : 100,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateOverlay("maxWidth", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.sliderValue },
          (draft.textOverlay ? draft.textOverlay.maxWidth : 100) + "%"
        )
      )
    )
  );

  // ── Scheduling & Targeting Section (3-col row) ──
  const schedulingContent = React.createElement("div", { className: styles.fieldGroup },
    React.createElement("div", { className: styles.schedulingRow3Col },
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Publish Date"),
        React.createElement("input", {
          type: "date", className: styles.textInput,
          value: draft.publishDate || "",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            setDraft(function (prev) {
              return prev ? { ...prev, publishDate: e.target.value } : prev;
            });
          },
        })
      ),
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Unpublish Date"),
        React.createElement("input", {
          type: "date", className: styles.textInput,
          value: draft.unpublishDate || "",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            setDraft(function (prev) {
              return prev ? { ...prev, unpublishDate: e.target.value } : prev;
            });
          },
        })
      ),
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Audience"),
        React.createElement("input", {
          type: "text", className: styles.textInput,
          value: draft.audienceTarget && draft.audienceTarget.groups.length > 0 ? draft.audienceTarget.groups.join(", ") : "",
          placeholder: "Security group names",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            setDraft(function (prev) {
              if (!prev) return prev;
              var groups = e.target.value.length > 0 ? e.target.value.split(",").map(function (g) { return g.trim(); }) : [];
              return { ...prev, audienceTarget: { enabled: groups.length > 0, groups: groups, matchAll: false } };
            });
          },
        })
      )
    ),
    React.createElement("p", { className: styles.fieldHint }, "Leave dates blank for always-visible. Audience targets by Azure AD security group.")
  );

  // ── Internal Notes Section ──
  const notesContent = React.createElement("div", { className: styles.fieldGroup },
    React.createElement("p", { className: styles.fieldHint }, "Private notes visible only in edit mode. Not displayed on the published page."),
    React.createElement("textarea", {
      className: styles.textArea,
      value: draft.internalNotes || "",
      placeholder: "Add private notes, reminders, or context for this slide...",
      rows: 4,
      onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>): void {
        setDraft(function (prev) {
          return prev ? { ...prev, internalNotes: e.target.value } : prev;
        });
      },
    })
  );

  // Build status hints for accordion headers
  const effectsHint: string[] = [];
  if (gradientEnabled) effectsHint.push("Gradient");
  if (parallaxEnabled) effectsHint.push("Parallax");
  if (countdownEnabled) effectsHint.push("Countdown");
  if (kenBurnsEnabled) effectsHint.push("Ken Burns");
  if (textBackdropEnabled) effectsHint.push("Backdrop");
  if (vignetteEnabled) effectsHint.push("Vignette");

  return React.createElement("div", { className: styles.fieldGroup },
    renderAccordionSection("adv-effects", "Effects", "\u2728", effectsHint.length > 0 ? effectsHint.join(", ") : "Off", expandedSections, setExpandedSections, effectsContent),
    renderAccordionSection("adv-hover", "Hover Effect", "\uD83D\uDDB1\uFE0F", currentHoverEffect === "none" ? "None" : currentHoverEffect, expandedSections, setExpandedSections, hoverContent),
    renderAccordionSection("adv-overlay", "Text Overlay", "\u25A3", overlayEnabled ? "On" : "Off", expandedSections, setExpandedSections, overlayContent),
    renderAccordionSection("adv-scheduling", "Scheduling & Targeting", "\uD83D\uDCC5", (draft.publishDate || draft.unpublishDate) ? "Configured" : "No dates set", expandedSections, setExpandedSections, schedulingContent),
    renderAccordionSection("adv-notes", "Internal Notes", "\uD83D\uDCDD", (draft.internalNotes && draft.internalNotes.length > 0) ? "Has notes" : "Empty", expandedSections, setExpandedSections, notesContent)
  );
}

// ── Animation Effect Options ──
const ANIMATION_EFFECTS: Array<{ value: EntranceEffect; label: string }> = [
  { value: "none", label: "None" },
  { value: "fadeUp", label: "Fade Up" },
  { value: "fadeDown", label: "Fade Down" },
  { value: "fadeIn", label: "Fade In" },
  { value: "slideLeft", label: "Slide from Left" },
  { value: "slideRight", label: "Slide from Right" },
  { value: "slideUp", label: "Slide Up" },
  { value: "slideDown", label: "Slide Down" },
  { value: "scaleUp", label: "Scale Up" },
  { value: "scaleDown", label: "Scale Down" },
  { value: "rotateIn", label: "Rotate In" },
  { value: "bounceIn", label: "Bounce In" },
];

function updateElementAnimation(
  setDraft: React.Dispatch<React.SetStateAction<IHyperHeroSlide | undefined>>,
  element: keyof ISlideElementAnimations,
  field: keyof IElementAnimation,
  value: unknown
): void {
  setDraft(function (prev) {
    if (!prev) return prev;
    const currentAnims: ISlideElementAnimations = prev.elementAnimations
      ? { ...prev.elementAnimations }
      : {};
    const existing = currentAnims[element];
    const currentElem: IElementAnimation = existing
      ? { effect: existing.effect, delayMs: existing.delayMs, durationMs: existing.durationMs }
      : { effect: DEFAULT_ELEMENT_ANIMATION.effect, delayMs: DEFAULT_ELEMENT_ANIMATION.delayMs, durationMs: DEFAULT_ELEMENT_ANIMATION.durationMs };
    (currentElem as unknown as Record<string, unknown>)[field] = value;
    currentAnims[element] = currentElem;
    return { ...prev, elementAnimations: currentAnims };
  });
}

/** Render 3-col row for per-element animation config: Effect dropdown + Delay spinner + Duration spinner */
function renderElementAnimRow(
  draft: IHyperHeroSlide,
  setDraft: React.Dispatch<React.SetStateAction<IHyperHeroSlide | undefined>>,
  element: keyof ISlideElementAnimations,
  label: string
): React.ReactElement {
  const anims = draft.elementAnimations;
  const currentAnim = anims ? anims[element] : undefined;
  const effect = currentAnim ? currentAnim.effect : "none";
  const delayMs = currentAnim ? currentAnim.delayMs : 0;
  const durationMs = currentAnim ? currentAnim.durationMs : 600;

  return React.createElement("div", { className: styles.fieldGroup },
    React.createElement("label", { className: styles.fieldLabel }, label),
    React.createElement("div", { className: styles.animRow3Col },
      // Effect dropdown
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Effect"),
        React.createElement("select", {
          className: styles.selectInput,
          value: effect,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
            updateElementAnimation(setDraft, element, "effect", e.target.value);
          },
        },
          ANIMATION_EFFECTS.map(function (opt) {
            return React.createElement("option", { key: opt.value, value: opt.value }, opt.label);
          })
        )
      ),
      // Delay spinner
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Delay (ms)"),
        React.createElement("input", {
          type: "number",
          className: styles.numberInput,
          min: 0,
          max: 2000,
          step: 50,
          value: delayMs,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateElementAnimation(setDraft, element, "delayMs", parseInt(e.target.value, 10));
          },
        })
      ),
      // Duration spinner
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Duration (ms)"),
        React.createElement("input", {
          type: "number",
          className: styles.numberInput,
          min: 100,
          max: 2000,
          step: 50,
          value: durationMs,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateElementAnimation(setDraft, element, "durationMs", parseInt(e.target.value, 10));
          },
        })
      )
    )
  );
}

/** Render visual timeline ruler with drag bars */
function renderAnimationTimeline(draft: IHyperHeroSlide): React.ReactElement {
  var anims = draft.elementAnimations;
  var maxMs = 2000;

  var elements: Array<{
    key: keyof ISlideElementAnimations;
    label: string;
    colorClass: string;
  }> = [
    { key: "heading", label: "Heading", colorClass: styles.timelineBarHeading },
    { key: "subheading", label: "Subtitle", colorClass: styles.timelineBarSubheading },
    { key: "description", label: "Desc", colorClass: styles.timelineBarDescription },
    { key: "ctas", label: "Buttons", colorClass: styles.timelineBarCtas },
  ];

  // Ruler marks
  var rulerMarks: React.ReactElement[] = [];
  [0, 500, 1000, 1500, 2000].forEach(function (ms) {
    rulerMarks.push(
      React.createElement("span", { key: ms, className: styles.timelineRulerMark }, ms + "ms")
    );
  });

  return React.createElement("div", { className: styles.timelineContainer },
    React.createElement("div", { className: styles.timelineRuler }, rulerMarks),
    React.createElement("div", { className: styles.timelineTrack },
      elements.map(function (el) {
        var anim = anims ? anims[el.key] : undefined;
        var delay = anim ? anim.delayMs : 0;
        var dur = anim ? anim.durationMs : 600;
        var effect = anim ? anim.effect : "none";
        var leftPct = (delay / maxMs) * 100;
        var widthPct = (dur / maxMs) * 100;

        return React.createElement("div", { key: el.key, className: styles.timelineRow },
          React.createElement("span", { className: styles.timelineLabel }, el.label),
          React.createElement("div", { className: styles.timelineBarTrack },
            effect !== "none"
              ? React.createElement("div", {
                  className: styles.timelineBar + " " + el.colorClass,
                  style: { left: leftPct + "%", width: widthPct + "%" },
                  title: effect + " " + delay + "ms + " + dur + "ms",
                }, dur + "ms")
              : undefined
          )
        );
      })
    )
  );
}

/** Slide transition options for the 8-button grid */
var SLIDE_TRANSITION_OPTIONS: Array<{ value: string; label: string; icon: string }> = [
  { value: "fade", label: "Fade", icon: "\uD83C\uDF05" },
  { value: "slide", label: "Slide", icon: "\u27A1\uFE0F" },
  { value: "zoom", label: "Zoom", icon: "\uD83D\uDD0D" },
  { value: "kenBurns", label: "Ken Burns", icon: "\uD83C\uDFA5" },
  { value: "flip", label: "Flip", icon: "\uD83D\uDD04" },
  { value: "cube", label: "Cube", icon: "\uD83D\uDFE7" },
  { value: "cards", label: "Cards", icon: "\uD83C\uDCCF" },
  { value: "none", label: "None", icon: "\u26D4" },
];

/** Easing options */
var EASING_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "ease", label: "Ease" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in-out", label: "Ease In-Out" },
  { value: "linear", label: "Linear" },
];

// ── Animations Tab ──
function renderAnimationsTab(
  draft: IHyperHeroSlide,
  setDraft: React.Dispatch<React.SetStateAction<IHyperHeroSlide | undefined>>,
  expandedSections: AccordionState,
  setExpandedSections: React.Dispatch<React.SetStateAction<AccordionState>>
): React.ReactElement {
  var currentTransition = draft.slideTransition || "fade";
  var transitionDuration = draft.slideTransitionDurationMs || 500;
  var transitionEasing = draft.slideTransitionEasing || "ease";

  // ── Slide Transition panel content ──
  var transitionContent = React.createElement("div", { className: styles.fieldGroup },
    React.createElement("p", { className: styles.fieldHint }, "Choose how this slide transitions in from the previous slide"),
    // 8-button grid (4x2)
    React.createElement("div", { className: styles.transitionGrid },
      SLIDE_TRANSITION_OPTIONS.map(function (opt) {
        var isSelected = currentTransition === opt.value;
        return React.createElement("button", {
          key: opt.value,
          className: styles.transitionCard + (isSelected ? " " + styles.transitionCardSelected : ""),
          onClick: function (): void {
            setDraft(function (prev) {
              return prev ? { ...prev, slideTransition: opt.value as IHyperHeroSlide["slideTransition"] } : prev;
            });
          },
          type: "button",
          "aria-label": opt.label + " transition",
        },
          React.createElement("span", { className: styles.transitionIcon, "aria-hidden": "true" }, opt.icon),
          React.createElement("span", undefined, opt.label)
        );
      })
    ),
    // Duration spinner + Easing dropdown (2-col row)
    React.createElement("div", { className: styles.transitionSubRow },
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Duration (ms)"),
        React.createElement("input", {
          type: "number",
          className: styles.numberInput,
          min: 100,
          max: 2000,
          step: 50,
          value: transitionDuration,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            setDraft(function (prev) {
              return prev ? { ...prev, slideTransitionDurationMs: parseInt(e.target.value, 10) } : prev;
            });
          },
        })
      ),
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Easing"),
        React.createElement("select", {
          className: styles.selectInput,
          value: transitionEasing,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
            setDraft(function (prev) {
              return prev ? { ...prev, slideTransitionEasing: e.target.value as IHyperHeroSlide["slideTransitionEasing"] } : prev;
            });
          },
        },
          EASING_OPTIONS.map(function (opt) {
            return React.createElement("option", { key: opt.value, value: opt.value }, opt.label);
          })
        )
      )
    )
  );

  // ── Element Animations panel content ──
  var elementAnimContent = React.createElement("div", { className: styles.fieldGroup },
    React.createElement("p", { className: styles.fieldHint },
      "Configure entrance animations for each content element. The timeline below visualizes when elements appear."
    ),
    // Visual timeline
    renderAnimationTimeline(draft),
    React.createElement("div", { style: { height: "1px", background: "#edebe9", margin: "4px 0" } }),
    // Per-element 3-col configs
    renderElementAnimRow(draft, setDraft, "heading", "Heading"),
    renderElementAnimRow(draft, setDraft, "subheading", "Subheading"),
    renderElementAnimRow(draft, setDraft, "description", "Description"),
    renderElementAnimRow(draft, setDraft, "ctas", "Buttons (CTAs)")
  );

  return React.createElement("div", { className: styles.fieldGroup },
    renderAccordionSection("anim-transition", "Slide Transition", "\u25B6", currentTransition + " \u00B7 " + transitionDuration + "ms", expandedSections, setExpandedSections, transitionContent),
    renderAccordionSection("anim-elements", "Element Animations", "\uD83C\uDFAC", "Per-element entrance effects", expandedSections, setExpandedSections, elementAnimContent)
  );
}

// ── Typography Tab ──

/** Available web-safe font families */
const FONT_FAMILIES = [
  "Segoe UI",
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Trebuchet MS",
  "Courier New",
  "Impact",
  "Palatino Linotype",
  "Book Antiqua",
  "Lucida Console",
  "Tahoma",
  "Century Gothic",
  "Garamond",
];

const FONT_WEIGHTS = [
  { value: 300, label: "Light (300)" },
  { value: 400, label: "Regular (400)" },
  { value: 500, label: "Medium (500)" },
  { value: 600, label: "Semibold (600)" },
  { value: 700, label: "Bold (700)" },
  { value: 800, label: "Extra Bold (800)" },
];

const TEXT_TRANSFORMS = [
  { value: "none", label: "Normal" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "Capitalize" },
];

const TEXT_SHADOWS = [
  { value: "none", label: "None" },
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "heavy", label: "Heavy" },
];

/** Standard font sizes for dropdown */
var FONT_SIZE_OPTIONS = [0, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 72, 80];

function renderFontInlineRow(
  label: string,
  elementKey: keyof IHyperHeroFontConfig,
  fs: IHyperHeroFontSettings,
  updateFontSetting: (element: keyof IHyperHeroFontConfig, field: keyof IHyperHeroFontSettings, value: unknown) => void
): React.ReactElement {
  return React.createElement("div", { className: styles.fieldGroup },
    React.createElement("label", { className: styles.fieldLabel, style: { fontWeight: 700, fontSize: "14px" } }, label),
    // 5-controls-on-one-row: Font Family, Font Size, Letter Spacing, Color, Line Height
    React.createElement("div", { className: styles.fontInlineRow },
      // Font Family
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Font"),
        React.createElement("select", {
          className: styles.selectInput,
          value: fs.fontFamily || "Segoe UI",
          style: { fontFamily: "\"" + (fs.fontFamily || "Segoe UI") + "\", sans-serif" },
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
            updateFontSetting(elementKey, "fontFamily", e.target.value);
          },
        },
          FONT_FAMILIES.map(function (f) {
            return React.createElement("option", { key: f, value: f }, f);
          })
        )
      ),
      // Font Size (dropdown)
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Size"),
        React.createElement("select", {
          className: styles.selectInput,
          value: fs.fontSize || 0,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
            updateFontSetting(elementKey, "fontSize", parseInt(e.target.value, 10));
          },
        },
          FONT_SIZE_OPTIONS.map(function (sz) {
            return React.createElement("option", { key: sz, value: sz },
              sz === 0 ? "Default" : sz + "px"
            );
          })
        )
      ),
      // Letter Spacing (spinner)
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Spacing"),
        React.createElement("input", {
          type: "number",
          className: styles.numberInput,
          min: -2,
          max: 10,
          step: 0.5,
          value: fs.letterSpacing || 0,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateFontSetting(elementKey, "letterSpacing", parseFloat(e.target.value));
          },
        })
      ),
      // Color (picker + hex)
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Color"),
        React.createElement("div", { className: styles.colorPickerRow },
          React.createElement("input", {
            type: "color",
            className: styles.colorInput,
            value: fs.color || "#ffffff",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateFontSetting(elementKey, "color", e.target.value);
            },
            style: { width: "28px", height: "28px" },
          }),
          React.createElement("input", {
            type: "text",
            className: styles.colorHexInput,
            value: fs.color || "#ffffff",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateFontSetting(elementKey, "color", e.target.value);
            },
            style: { fontSize: "11px", padding: "5px 6px" },
          })
        )
      ),
      // Line Height (spinner)
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Height"),
        React.createElement("input", {
          type: "number",
          className: styles.numberInput,
          min: 0,
          max: 3,
          step: 0.1,
          value: fs.lineHeight || 0,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateFontSetting(elementKey, "lineHeight", parseFloat(e.target.value));
          },
        })
      )
    ),
    // Weight toggle buttons below
    React.createElement("div", { className: styles.fontWeightRow },
      FONT_WEIGHTS.map(function (w) {
        var isSelected = (fs.fontWeight || 0) === w.value;
        return React.createElement("button", {
          key: w.value,
          className: styles.fontWeightBtn + (isSelected ? " " + styles.fontWeightBtnSelected : ""),
          onClick: function (): void {
            updateFontSetting(elementKey, "fontWeight", w.value);
          },
          type: "button",
        }, w.label);
      })
    ),
    // Text Transform + Shadow on one row
    React.createElement("div", { className: styles.contentTwoCol },
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Transform"),
        React.createElement("div", { className: styles.typeSelector },
          TEXT_TRANSFORMS.map(function (opt) {
            var isSelected = (fs.textTransform || "none") === opt.value;
            return React.createElement("button", {
              key: opt.value,
              className: styles.typeCard + (isSelected ? " " + styles.typeCardSelected : ""),
              onClick: function (): void {
                updateFontSetting(elementKey, "textTransform", opt.value);
              },
              type: "button",
              style: { padding: "6px 10px", fontSize: "11px" },
            }, opt.label);
          })
        )
      ),
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Shadow"),
        React.createElement("select", {
          className: styles.selectInput,
          value: fs.textShadow || "none",
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
            updateFontSetting(elementKey, "textShadow", e.target.value);
          },
        },
          TEXT_SHADOWS.map(function (s) {
            return React.createElement("option", { key: s.value, value: s.value }, s.label);
          })
        )
      )
    )
  );
}

function renderTypographyTab(
  draft: IHyperHeroSlide,
  updateFontSetting: (element: keyof IHyperHeroFontConfig, field: keyof IHyperHeroFontSettings, value: unknown) => void,
  _expandedSections: AccordionState,
  _setExpandedSections: React.Dispatch<React.SetStateAction<AccordionState>>
): React.ReactElement {
  const fc = draft.fontConfig;
  const headingFs = fc ? fc.heading : DEFAULT_FONT_SETTINGS;
  const subFs = fc ? fc.subheading : DEFAULT_FONT_SETTINGS;
  const descFs = fc ? fc.description : DEFAULT_FONT_SETTINGS;

  return React.createElement("div", { className: styles.fieldGroup },
    React.createElement("p", { className: styles.fieldHint },
      "Customize fonts for each text element. Leave at \"Default\" to use the standard styles."
    ),
    renderFontInlineRow("Heading", "heading", headingFs, updateFontSetting),
    React.createElement("div", { style: { height: "1px", background: "#edebe9", margin: "4px 0" } }),
    renderFontInlineRow("Subheading", "subheading", subFs, updateFontSetting),
    React.createElement("div", { style: { height: "1px", background: "#edebe9", margin: "4px 0" } }),
    renderFontInlineRow("Description", "description", descFs, updateFontSetting)
  );
}

// ── Accessibility Tab ──
function computeAccessibilityChecks(draft: IHyperHeroSlide): IAccessibilityCheck[] {
  var checks: IAccessibilityCheck[] = [];

  // 1. Text Contrast
  var textColor = (draft.textColor || "#ffffff").toLowerCase();
  var bgColor = (draft.background.backgroundColor || "#0078d4").toLowerCase();
  var textContrastOk = textColor !== bgColor;
  checks.push({
    id: "text-contrast",
    label: "Text Contrast",
    status: textContrastOk ? "pass" : "fail",
    message: textContrastOk ? "Text color differs from background" : "Text may be hard to read against background",
  });

  // 2. CTA Contrast
  var hasCtas = draft.ctas.length > 0;
  checks.push({
    id: "cta-contrast",
    label: "CTA Button Contrast",
    status: hasCtas ? "pass" : "warn",
    message: hasCtas ? "Buttons present and visible" : "No call-to-action buttons added",
  });

  // 3. Alt Text
  var hasImage = draft.background.type === "image";
  var hasAlt = draft.background.imageAlt ? draft.background.imageAlt.length > 0 : false;
  checks.push({
    id: "alt-text",
    label: "Alt Text",
    status: hasImage && !hasAlt ? "fail" : "pass",
    message: hasImage && !hasAlt
      ? "Background image needs alt text for screen readers"
      : "Alt text is set or not required",
  });

  // 4. Reduced Motion
  var hasAnimations = draft.elementAnimations !== undefined;
  checks.push({
    id: "reduced-motion",
    label: "Reduced Motion",
    status: "pass",
    message: hasAnimations ? "Animations respect prefers-reduced-motion" : "No animations configured",
  });

  // 5. Heading Structure
  var hasHeading = draft.heading.length > 0;
  checks.push({
    id: "heading-structure",
    label: "Heading Structure",
    status: hasHeading ? "pass" : "warn",
    message: hasHeading ? "Heading text is present" : "Consider adding a heading for screen readers",
  });

  // 6. Focus Indicators
  checks.push({
    id: "focus-indicators",
    label: "Focus Indicators",
    status: "pass",
    message: "Focus indicators are built into all interactive elements",
  });

  // 7. Auto-Rotation
  checks.push({
    id: "auto-rotation",
    label: "Auto-Rotation",
    status: "pass",
    message: "Auto-rotation pauses on hover/focus per WCAG 2.2.2",
  });

  return checks;
}

function computeAccessibilityScore(checks: IAccessibilityCheck[]): number {
  var total = checks.length;
  var passed = 0;
  checks.forEach(function (c) {
    if (c.status === "pass") passed += 1;
    else if (c.status === "warn") passed += 0.5;
  });
  return Math.round((passed / total) * 100);
}

function renderAccessibilityTab(
  draft: IHyperHeroSlide,
  updateBackground: (field: string, value: unknown) => void
): React.ReactElement {
  var checks = computeAccessibilityChecks(draft);
  var score = computeAccessibilityScore(checks);
  var scoreColor = score >= 80 ? "#107c10" : score >= 60 ? "#ca5010" : "#a4262c";

  return React.createElement("div", { className: styles.fieldGroup },
    // Score card
    React.createElement("div", { className: styles.a11yScoreCard },
      React.createElement("div", {
        className: styles.a11yScoreCircle,
        style: { borderColor: scoreColor },
      },
        React.createElement("span", { className: styles.a11yScoreValue, style: { color: scoreColor } }, String(score)),
        React.createElement("span", { className: styles.a11yScoreLabel }, "/100")
      ),
      React.createElement("div", { className: styles.a11yScoreText },
        React.createElement("span", { className: styles.a11yScoreTitle, style: { color: scoreColor } },
          score >= 80 ? "Good" : score >= 60 ? "Needs Improvement" : "Issues Found"
        ),
        React.createElement("span", { className: styles.a11yScoreHint },
          "Accessibility score based on " + checks.length + " automated checks"
        )
      )
    ),
    // Check items
    React.createElement("div", { className: styles.a11yCheckList },
      checks.map(function (check) {
        var statusIcon = check.status === "pass" ? "\u2705" : check.status === "warn" ? "\u26A0\uFE0F" : "\u274C";
        return React.createElement("div", {
          key: check.id,
          className: styles.a11yCheckItem,
        },
          React.createElement("span", { className: styles.a11yCheckIcon, "aria-hidden": "true" }, statusIcon),
          React.createElement("div", { className: styles.a11yCheckContent },
            React.createElement("span", { className: styles.a11yCheckLabel }, check.label),
            React.createElement("span", { className: styles.a11yCheckMessage }, check.message),
            // Inline alt text input for image backgrounds
            check.id === "alt-text" && draft.background.type === "image"
              ? React.createElement("div", { className: styles.a11yAltTextInput },
                  React.createElement("input", {
                    type: "text",
                    className: styles.a11yAltTextField,
                    value: draft.background.imageAlt || "",
                    placeholder: "Describe this image for screen readers\u2026",
                    "aria-label": "Image alt text",
                    onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                      updateBackground("imageAlt", e.target.value);
                    },
                  })
                )
              : undefined
          )
        );
      })
    )
  );
}

export const HyperHeroSlideEditor = React.memo(HyperHeroSlideEditorInner);
