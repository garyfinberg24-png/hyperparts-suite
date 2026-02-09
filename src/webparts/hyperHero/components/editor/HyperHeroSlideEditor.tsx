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
} from "../../models";
import { DEFAULT_GRADIENT, DEFAULT_ELEMENT_ANIMATION, DEFAULT_FONT_SETTINGS } from "../../models";
import { HyperHeroSlide } from "../HyperHeroSlide";
import { HyperHeroLayerEditor } from "../canvas/HyperHeroLayerEditor";
import { HyperImageBrowser } from "../shared/HyperImageBrowser";
import { HyperLottieGallery } from "../shared/HyperLottieGallery";
import styles from "./HyperHeroSlideEditor.module.scss";

export interface IHyperHeroSlideEditorProps {
  isOpen: boolean;
  slide: IHyperHeroSlide | undefined;
  onSave: (slide: IHyperHeroSlide) => void;
  onClose: () => void;
}

type TabId = "background" | "content" | "ctas" | "advanced" | "animations" | "typography";

/** Preset color palette for quick selection */
const COLOR_PRESETS = [
  "#0078d4", "#106ebe", "#50e6ff", "#00b7c3",
  "#107c10", "#5c2d91", "#ca5010", "#d83b01",
  "#a4262c", "#e74856", "#323130", "#ffffff",
];

const HyperHeroSlideEditorInner: React.FC<IHyperHeroSlideEditorProps> = function (props) {
  const { isOpen, slide, onSave, onClose } = props;

  const tabState = React.useState<TabId>("background");
  const activeTab = tabState[0];
  const setActiveTab = tabState[1];

  const draftState = React.useState<IHyperHeroSlide | undefined>(slide);
  const draft = draftState[0];
  const setDraft = draftState[1];

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

  // Accordion expand/collapse state — all sections default to collapsed
  const accordionState = React.useState<AccordionState>({});
  const expandedSections = accordionState[0];
  const setExpandedSections = accordionState[1];

  // Reset draft when slide or isOpen changes
  React.useEffect(function () {
    if (isOpen && slide) {
      setDraft(slide);
      setActiveTab("background");
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

  // Save handler
  const handleSave = React.useCallback(function (): void {
    if (draft) {
      onSave(draft);
    }
  }, [draft, onSave]);

  // eslint-disable-next-line @rushstack/no-new-null
  if (!draft) return null;

  const footer = React.createElement("div", { className: styles.footerRow },
    React.createElement("button", {
      onClick: onClose,
      className: styles.footerBtnCancel,
      type: "button",
    }, "Cancel"),
    React.createElement("button", {
      onClick: handleSave,
      className: styles.footerBtnSave,
      type: "button",
    }, "Save Changes")
  );

  // Tab definitions with labels
  const TAB_DEFS: Array<{ id: TabId; label: string; icon: string }> = [
    { id: "background", label: "Background", icon: "\uD83D\uDDBC\uFE0F" },
    { id: "content", label: "Content", icon: "\u270F\uFE0F" },
    { id: "ctas", label: "Buttons", icon: "\uD83D\uDD17" },
    { id: "advanced", label: "Advanced", icon: "\u2699\uFE0F" },
    { id: "animations", label: "Animations", icon: "\uD83C\uDFAC" },
    { id: "typography", label: "Fonts", icon: "Aa" },
  ];

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: "Edit Slide: " + (draft.heading || "Untitled"),
    size: "xlarge",
    footer: footer,
  }, React.createElement("div", { className: styles.editorContainer },
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
            slide: draft,
            previewMode: true,
          })
        )
      )
    ),

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
      activeTab === "background" && renderBackgroundTab(draft, updateBackground, setShowImageBrowser, setShowLottieBrowser),
      activeTab === "content" && renderContentTab(draft, setDraft, setShowLayerEditor),
      activeTab === "ctas" && renderCtasTab(draft.ctas, handleAddCta, handleRemoveCta, handleUpdateCta),
      activeTab === "advanced" && renderAdvancedTab(
        draft,
        updateGradient,
        updateParallax,
        updateCountdown,
        updateOverlay,
        setDraft,
        expandedSections,
        setExpandedSections
      ),
      activeTab === "animations" && renderAnimationsTab(draft, setDraft, expandedSections, setExpandedSections),
      activeTab === "typography" && renderTypographyTab(draft, updateFontSetting, expandedSections, setExpandedSections)
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
      slide: draft,
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

// ── Background Tab ──
function renderBackgroundTab(
  draft: IHyperHeroSlide,
  updateBackground: (field: string, value: unknown) => void,
  openImageBrowser: (show: boolean) => void,
  openLottieBrowser: (show: boolean) => void
): React.ReactElement {
  const bg = draft.background;
  const currentType = bg.type;

  // Type selector as styled cards instead of radio buttons
  const typeOptions = [
    { type: "image", label: "Image", icon: "\uD83D\uDDBC\uFE0F" },
    { type: "solidColor", label: "Color", icon: "\uD83C\uDFA8" },
    { type: "video", label: "Video", icon: "\uD83D\uDCF9" },
    { type: "lottie", label: "Lottie", icon: "\u2728" },
  ];

  return React.createElement("div", { className: styles.fieldGroup },
    // Background type selector
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
            },
            type: "button",
          },
            React.createElement("span", { "aria-hidden": "true" }, opt.icon),
            React.createElement("span", undefined, opt.label)
          );
        })
      )
    ),
    // Conditional fields
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
    currentType === "solidColor" && renderColorPicker(
      "Background Color",
      bg.backgroundColor || "",
      "#0078d4",
      function (color: string): void {
        updateBackground("backgroundColor", color);
      }
    ),
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
    )
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
    // Heading
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
    // Subheading
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
    ),
    // Description
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Description"),
      React.createElement("textarea", {
        className: styles.textArea,
        rows: 4,
        value: draft.description || "",
        placeholder: "Optional longer description...",
        onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>): void {
          setDraft(function (prev) {
            return prev ? { ...prev, description: e.target.value } : prev;
          });
        },
      })
    ),
    // Text align
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Text Alignment"),
      React.createElement("div", { className: styles.typeSelector },
        [
          { value: "left", label: "Left", icon: "\u2590" },
          { value: "center", label: "Center", icon: "\u2501" },
          { value: "right", label: "Right", icon: "\u258C" },
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
    // Vertical align
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
      ctas.map(function (cta) {
        return React.createElement("div", { key: cta.id, className: styles.ctaItem },
          React.createElement("div", { className: styles.ctaItemHeader },
            React.createElement("span", { className: styles.ctaItemTitle }, cta.label || "Button"),
            React.createElement("button", {
              className: styles.ctaRemoveBtn,
              onClick: function (): void {
                onRemove(cta.id);
              },
              type: "button",
            }, "Remove")
          ),
          React.createElement("div", { className: styles.ctaFields },
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
              React.createElement("div", { className: styles.typeSelector },
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
                  return React.createElement("button", {
                    key: opt.value,
                    className: styles.typeCard + (cta.variant === opt.value ? " " + styles.typeCardSelected : ""),
                    onClick: function (): void {
                      onUpdate(cta.id, "variant", opt.value);
                    },
                    type: "button",
                  },
                    React.createElement("span", undefined, opt.label)
                  );
                })
              )
            ),
            React.createElement("div", undefined,
              React.createElement("label", { className: styles.radioLabel },
                React.createElement("input", {
                  type: "checkbox",
                  checked: cta.openInNewTab,
                  onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                    onUpdate(cta.id, "openInNewTab", e.target.checked);
                  },
                }),
                " Open in new tab"
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

  // ── Effects Section ──
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
    gradientEnabled && React.createElement("div", { className: styles.subFields },
      React.createElement("label", { className: styles.fieldLabel }, "Gradient Angle"),
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
      )
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

  // ── Scheduling Section ──
  const schedulingContent = React.createElement("div", { className: styles.fieldGroup },
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
      }),
      React.createElement("p", { className: styles.fieldHint }, "Leave blank to publish immediately")
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
      }),
      React.createElement("p", { className: styles.fieldHint }, "Leave blank to never expire")
    )
  );

  // Build status hints for accordion headers
  const effectsHint: string[] = [];
  if (gradientEnabled) effectsHint.push("Gradient");
  if (parallaxEnabled) effectsHint.push("Parallax");
  if (countdownEnabled) effectsHint.push("Countdown");

  return React.createElement("div", { className: styles.fieldGroup },
    renderAccordionSection("adv-effects", "Effects", "\u2728", effectsHint.length > 0 ? effectsHint.join(", ") : "Off", expandedSections, setExpandedSections, effectsContent),
    renderAccordionSection("adv-overlay", "Text Overlay", "\u25A3", overlayEnabled ? "On" : "Off", expandedSections, setExpandedSections, overlayContent),
    renderAccordionSection("adv-scheduling", "Scheduling", "\uD83D\uDCC5", (draft.publishDate || draft.unpublishDate) ? "Configured" : "No dates set", expandedSections, setExpandedSections, schedulingContent)
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

function renderElementAnimConfig(
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
    React.createElement("label", { className: styles.fieldLabel }, label + " Animation"),
    // Effect dropdown
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
    ),
    // Only show delay/duration if effect is not "none"
    effect !== "none"
      ? React.createElement(React.Fragment, undefined,
          // Delay
          React.createElement("label", { className: styles.fieldLabel, style: { marginTop: "8px" } }, "Delay"),
          React.createElement("div", { className: styles.sliderRow },
            React.createElement("input", {
              type: "range",
              className: styles.sliderInput,
              min: "0",
              max: "2000",
              step: "100",
              value: delayMs,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                updateElementAnimation(setDraft, element, "delayMs", parseInt(e.target.value, 10));
              },
            }),
            React.createElement("span", { className: styles.sliderValue }, delayMs + "ms")
          ),
          // Duration
          React.createElement("label", { className: styles.fieldLabel, style: { marginTop: "4px" } }, "Duration"),
          React.createElement("div", { className: styles.sliderRow },
            React.createElement("input", {
              type: "range",
              className: styles.sliderInput,
              min: "200",
              max: "2000",
              step: "100",
              value: durationMs,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                updateElementAnimation(setDraft, element, "durationMs", parseInt(e.target.value, 10));
              },
            }),
            React.createElement("span", { className: styles.sliderValue }, durationMs + "ms")
          )
        )
      : undefined
  );
}

// ── Animations Tab ──
function renderAnimationsTab(
  draft: IHyperHeroSlide,
  setDraft: React.Dispatch<React.SetStateAction<IHyperHeroSlide | undefined>>,
  expandedSections: AccordionState,
  setExpandedSections: React.Dispatch<React.SetStateAction<AccordionState>>
): React.ReactElement {
  const anims = draft.elementAnimations;

  const getEffectLabel = function (el: keyof ISlideElementAnimations): string {
    const a = anims ? anims[el] : undefined;
    if (!a || a.effect === "none") return "None";
    return a.effect;
  };

  return React.createElement("div", { className: styles.fieldGroup },
    React.createElement("p", { className: styles.fieldHint },
      "Configure entrance animations for each content element. Elements animate when the slide first appears on screen."
    ),
    renderAccordionSection("anim-heading", "Heading", "H", getEffectLabel("heading"), expandedSections, setExpandedSections,
      renderElementAnimConfig(draft, setDraft, "heading", "Heading")
    ),
    renderAccordionSection("anim-subheading", "Subheading", "S", getEffectLabel("subheading"), expandedSections, setExpandedSections,
      renderElementAnimConfig(draft, setDraft, "subheading", "Subheading")
    ),
    renderAccordionSection("anim-description", "Description", "D", getEffectLabel("description"), expandedSections, setExpandedSections,
      renderElementAnimConfig(draft, setDraft, "description", "Description")
    ),
    renderAccordionSection("anim-ctas", "Buttons (CTAs)", "\uD83D\uDD17", getEffectLabel("ctas"), expandedSections, setExpandedSections,
      renderElementAnimConfig(draft, setDraft, "ctas", "Buttons (CTAs)")
    )
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

function renderFontSection(
  label: string,
  elementKey: keyof IHyperHeroFontConfig,
  fs: IHyperHeroFontSettings,
  updateFontSetting: (element: keyof IHyperHeroFontConfig, field: keyof IHyperHeroFontSettings, value: unknown) => void
): React.ReactElement {
  return React.createElement("div", { className: styles.fieldGroup },
    React.createElement("label", { className: styles.fieldLabel, style: { fontWeight: 700, fontSize: "14px" } }, label),
    // Font Family
    React.createElement("label", { className: styles.fieldLabel }, "Font Family"),
    React.createElement("select", {
      className: styles.selectInput,
      value: fs.fontFamily || "Segoe UI",
      style: { fontFamily: "\"" + (fs.fontFamily || "Segoe UI") + "\", sans-serif" },
      onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
        updateFontSetting(elementKey, "fontFamily", e.target.value);
      },
    },
      FONT_FAMILIES.map(function (f) {
        return React.createElement("option", {
          key: f,
          value: f,
          style: { fontFamily: "\"" + f + "\", sans-serif" },
        }, f);
      })
    ),
    // Font Size
    React.createElement("label", { className: styles.fieldLabel }, "Font Size"),
    React.createElement("div", { className: styles.sliderRow },
      React.createElement("input", {
        type: "range",
        className: styles.sliderInput,
        min: "0",
        max: "80",
        value: fs.fontSize || 0,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateFontSetting(elementKey, "fontSize", parseInt(e.target.value, 10));
        },
      }),
      React.createElement("span", { className: styles.sliderValue },
        (fs.fontSize || 0) === 0 ? "Default" : fs.fontSize + "px"
      )
    ),
    // Font Weight
    React.createElement("label", { className: styles.fieldLabel }, "Weight"),
    React.createElement("select", {
      className: styles.selectInput,
      value: fs.fontWeight || 0,
      onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
        updateFontSetting(elementKey, "fontWeight", parseInt(e.target.value, 10));
      },
    },
      React.createElement("option", { value: 0 }, "Default"),
      FONT_WEIGHTS.map(function (w) {
        return React.createElement("option", { key: w.value, value: w.value }, w.label);
      })
    ),
    // Color
    renderColorPicker(
      "Color",
      fs.color || "",
      "#ffffff",
      function (color: string): void {
        updateFontSetting(elementKey, "color", color);
      }
    ),
    // Letter Spacing
    React.createElement("label", { className: styles.fieldLabel }, "Letter Spacing"),
    React.createElement("div", { className: styles.sliderRow },
      React.createElement("input", {
        type: "range",
        className: styles.sliderInput,
        min: "-2",
        max: "10",
        step: "0.5",
        value: fs.letterSpacing || 0,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateFontSetting(elementKey, "letterSpacing", parseFloat(e.target.value));
        },
      }),
      React.createElement("span", { className: styles.sliderValue }, (fs.letterSpacing || 0) + "px")
    ),
    // Line Height
    React.createElement("label", { className: styles.fieldLabel }, "Line Height"),
    React.createElement("div", { className: styles.sliderRow },
      React.createElement("input", {
        type: "range",
        className: styles.sliderInput,
        min: "0",
        max: "2.5",
        step: "0.1",
        value: fs.lineHeight || 0,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateFontSetting(elementKey, "lineHeight", parseFloat(e.target.value));
        },
      }),
      React.createElement("span", { className: styles.sliderValue },
        (fs.lineHeight || 0) === 0 ? "Default" : (fs.lineHeight || 0).toFixed(1)
      )
    ),
    // Text Transform
    React.createElement("label", { className: styles.fieldLabel }, "Text Transform"),
    React.createElement("div", { className: styles.typeSelector },
      TEXT_TRANSFORMS.map(function (opt) {
        const isSelected = (fs.textTransform || "none") === opt.value;
        return React.createElement("button", {
          key: opt.value,
          className: styles.typeCard + (isSelected ? " " + styles.typeCardSelected : ""),
          onClick: function (): void {
            updateFontSetting(elementKey, "textTransform", opt.value);
          },
          type: "button",
        },
          React.createElement("span", undefined, opt.label)
        );
      })
    ),
    // Text Shadow
    React.createElement("label", { className: styles.fieldLabel }, "Text Shadow"),
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
  );
}

function renderTypographyTab(
  draft: IHyperHeroSlide,
  updateFontSetting: (element: keyof IHyperHeroFontConfig, field: keyof IHyperHeroFontSettings, value: unknown) => void,
  expandedSections: AccordionState,
  setExpandedSections: React.Dispatch<React.SetStateAction<AccordionState>>
): React.ReactElement {
  const fc = draft.fontConfig;
  const headingFs = fc ? fc.heading : DEFAULT_FONT_SETTINGS;
  const subFs = fc ? fc.subheading : DEFAULT_FONT_SETTINGS;
  const descFs = fc ? fc.description : DEFAULT_FONT_SETTINGS;

  const getFontHint = function (fs: IHyperHeroFontSettings): string {
    const parts: string[] = [];
    if (fs.fontFamily && fs.fontFamily !== "Segoe UI") parts.push(fs.fontFamily);
    if (fs.fontSize > 0) parts.push(fs.fontSize + "px");
    if (fs.fontWeight > 0) parts.push(String(fs.fontWeight));
    return parts.length > 0 ? parts.join(", ") : "Default";
  };

  return React.createElement("div", { className: styles.fieldGroup },
    React.createElement("p", { className: styles.fieldHint },
      "Customize fonts for each text element. Leave at \"Default\" to use the standard styles."
    ),
    renderAccordionSection("font-heading", "Heading", "H", getFontHint(headingFs), expandedSections, setExpandedSections,
      renderFontSection("Heading", "heading", headingFs, updateFontSetting)
    ),
    renderAccordionSection("font-subheading", "Subheading", "S", getFontHint(subFs), expandedSections, setExpandedSections,
      renderFontSection("Subheading", "subheading", subFs, updateFontSetting)
    ),
    renderAccordionSection("font-description", "Description", "D", getFontHint(descFs), expandedSections, setExpandedSections,
      renderFontSection("Description", "description", descFs, updateFontSetting)
    )
  );
}

export const HyperHeroSlideEditor = React.memo(HyperHeroSlideEditorInner);
