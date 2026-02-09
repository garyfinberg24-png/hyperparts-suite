import * as React from "react";
import { HyperModal } from "../../../../common/components/HyperModal";
import type {
  IHyperHeroTile,
  IHyperHeroCta,
  IHyperHeroTileBackground,
  IHyperHeroGradient,
  IHyperHeroParallax,
  IHyperHeroCountdown,
  VideoSource,
} from "../../models";
import { DEFAULT_GRADIENT } from "../../models";
import styles from "./HyperHeroTileEditor.module.scss";

export interface IHyperHeroTileEditorProps {
  isOpen: boolean;
  tile: IHyperHeroTile | undefined;
  onSave: (tile: IHyperHeroTile) => void;
  onClose: () => void;
}

type TabId = "background" | "content" | "ctas" | "advanced";

/** Preset color palette for quick selection */
const COLOR_PRESETS = [
  "#0078d4", "#106ebe", "#50e6ff", "#00b7c3",
  "#107c10", "#5c2d91", "#ca5010", "#d83b01",
  "#a4262c", "#e74856", "#323130", "#ffffff",
];

const HyperHeroTileEditorInner: React.FC<IHyperHeroTileEditorProps> = function (props) {
  const { isOpen, tile, onSave, onClose } = props;

  const tabState = React.useState<TabId>("background");
  const activeTab = tabState[0];
  const setActiveTab = tabState[1];

  const draftState = React.useState<IHyperHeroTile | undefined>(tile);
  const draft = draftState[0];
  const setDraft = draftState[1];

  // Reset draft when tile or isOpen changes
  React.useEffect(function () {
    if (isOpen && tile) {
      setDraft(tile);
      setActiveTab("background");
    }
  }, [isOpen, tile]);

  // Background update helper
  const updateBackground = React.useCallback(function (field: string, value: unknown): void {
    setDraft(function (prev) {
      if (!prev) return prev;
      const bg: IHyperHeroTileBackground = { ...prev.background };
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
  ];

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: "Edit Tile: " + (draft.heading || "Untitled"),
    size: "large",
    footer: footer,
  }, React.createElement("div", { className: styles.editorContainer },
    // Live preview swatch
    React.createElement("div", { className: styles.livePreview },
      React.createElement("div", {
        className: styles.livePreviewTile,
        style: {
          background: draft.background.type === "solidColor"
            ? draft.background.backgroundColor || "#0078d4"
            : draft.background.type === "image" && draft.background.imageUrl
              ? "url(" + draft.background.imageUrl + ") center/cover"
              : "#0078d4",
        },
      },
        React.createElement("div", {
          className: styles.livePreviewContent,
          style: { color: draft.textColor || "#ffffff" },
        },
          draft.heading && React.createElement("div", { className: styles.livePreviewHeading }, draft.heading),
          draft.subheading && React.createElement("div", { className: styles.livePreviewSub }, draft.subheading)
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
      activeTab === "background" && renderBackgroundTab(draft, updateBackground),
      activeTab === "content" && renderContentTab(draft, setDraft),
      activeTab === "ctas" && renderCtasTab(draft.ctas, handleAddCta, handleRemoveCta, handleUpdateCta),
      activeTab === "advanced" && renderAdvancedTab(
        draft,
        updateGradient,
        updateParallax,
        updateCountdown,
        setDraft
      )
    )
  ));
};

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
  draft: IHyperHeroTile,
  updateBackground: (field: string, value: unknown) => void
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
        React.createElement("p", { className: styles.fieldHint }, "Paste a direct URL to an image file (JPG, PNG, WebP)")
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
      React.createElement("p", { className: styles.fieldHint }, "Paste a Lottie JSON URL from lottiefiles.com or similar")
    )
  );
}

// ── Content Tab ──
function renderContentTab(
  draft: IHyperHeroTile,
  setDraft: React.Dispatch<React.SetStateAction<IHyperHeroTile | undefined>>
): React.ReactElement {
  return React.createElement("div", { className: styles.fieldGroup },
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
              React.createElement("select", {
                className: styles.selectInput,
                value: cta.variant,
                onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
                  onUpdate(cta.id, "variant", e.target.value);
                },
              },
                React.createElement("option", { value: "primary" }, "Primary (solid)"),
                React.createElement("option", { value: "secondary" }, "Secondary (outline)"),
                React.createElement("option", { value: "ghost" }, "Ghost (text only)")
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

// ── Advanced Tab ──
function renderAdvancedTab(
  draft: IHyperHeroTile,
  updateGradient: (field: string, value: unknown) => void,
  updateParallax: (field: string, value: unknown) => void,
  updateCountdown: (field: string, value: unknown) => void,
  setDraft: React.Dispatch<React.SetStateAction<IHyperHeroTile | undefined>>
): React.ReactElement {
  const gradientEnabled = draft.gradientOverlay ? draft.gradientOverlay.enabled : false;
  const parallaxEnabled = draft.parallax ? draft.parallax.enabled : false;
  const countdownEnabled = draft.countdown ? draft.countdown.enabled : false;

  return React.createElement("div", { className: styles.fieldGroup },
    // Gradient toggle
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Gradient Overlay"),
        React.createElement("span", { className: styles.toggleHint }, "Add a color gradient over the background")
      ),
      React.createElement("button", {
        className: gradientEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          updateGradient("enabled", !gradientEnabled);
        },
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
    // Parallax toggle
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Parallax Scrolling"),
        React.createElement("span", { className: styles.toggleHint }, "Background image moves slower on scroll")
      ),
      React.createElement("button", {
        className: parallaxEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          updateParallax("enabled", !parallaxEnabled);
        },
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
    // Countdown toggle
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("div", undefined,
        React.createElement("span", { className: styles.toggleLabel }, "Countdown Timer"),
        React.createElement("span", { className: styles.toggleHint }, "Show a countdown to a target date")
      ),
      React.createElement("button", {
        className: countdownEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          updateCountdown("enabled", !countdownEnabled);
        },
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
    // Scheduling section
    React.createElement("div", { className: styles.sectionDivider }),
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Publish Date"),
      React.createElement("input", {
        type: "date",
        className: styles.textInput,
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
        type: "date",
        className: styles.textInput,
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
}

export const HyperHeroTileEditor = React.memo(HyperHeroTileEditorInner);
