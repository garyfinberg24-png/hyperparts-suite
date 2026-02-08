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

const HyperHeroTileEditorInner: React.FC<IHyperHeroTileEditorProps> = function (props) {
  const { isOpen, tile, onSave, onClose } = props;

  const [activeTab, setActiveTab] = React.useState<TabId>("background");
  const [draft, setDraft] = React.useState<IHyperHeroTile | undefined>(tile);

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

  if (!draft) return null;

  const footer = React.createElement("button", {
    onClick: handleSave,
    style: {
      padding: "8px 16px",
      background: "#0078d4",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      fontWeight: 600,
      cursor: "pointer",
    },
  }, "Save");

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: "Edit Tile",
    size: "large",
    footer: footer,
  }, React.createElement("div", { className: styles.editorContainer },
    // Tab bar
    React.createElement("div", { className: styles.tabBar },
      ["background", "content", "ctas", "advanced"].map(function (tabId) {
        const isActive = activeTab === tabId;
        const label = tabId.charAt(0).toUpperCase() + tabId.substring(1);
        return React.createElement("button", {
          key: tabId,
          className: isActive
            ? styles.tab + " " + styles.tabActive
            : styles.tab,
          onClick: function (): void {
            setActiveTab(tabId as TabId);
          },
        }, label);
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

// Background tab
function renderBackgroundTab(
  draft: IHyperHeroTile,
  updateBackground: (field: string, value: unknown) => void
): React.ReactElement {
  const bg = draft.background;
  const currentType = bg.type;

  return React.createElement("div", { className: styles.fieldGroup },
    // Background type selector
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Background Type"),
      React.createElement("div", { className: styles.radioGroup },
        ["image", "solidColor", "video", "lottie"].map(function (type) {
          return React.createElement("label", {
            key: type,
            className: styles.radioLabel,
          },
            React.createElement("input", {
              type: "radio",
              name: "bgType",
              className: styles.radioInput,
              checked: currentType === type,
              onChange: function (): void {
                updateBackground("type", type);
              },
            }),
            type.charAt(0).toUpperCase() + type.substring(1)
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
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateBackground("imageUrl", e.target.value);
          },
        })
      ),
      bg.imageUrl && React.createElement("img", {
        src: bg.imageUrl,
        alt: "Preview",
        className: styles.previewThumbnail,
      })
    ),
    currentType === "solidColor" && React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Background Color"),
      React.createElement("div", { className: styles.colorRow },
        React.createElement("input", {
          type: "color",
          className: styles.colorInput,
          value: bg.backgroundColor || "#0078d4",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateBackground("backgroundColor", e.target.value);
          },
        }),
        React.createElement("input", {
          type: "text",
          className: styles.textInput,
          value: bg.backgroundColor || "#0078d4",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateBackground("backgroundColor", e.target.value);
          },
          style: { flex: 1 },
        })
      )
    ),
    currentType === "video" && React.createElement(React.Fragment, undefined,
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.fieldLabel }, "Video Source"),
        React.createElement("select", {
          className: styles.selectInput,
          value: bg.video?.source || "mp4",
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
            const newVideo = {
              source: e.target.value as VideoSource,
              url: bg.video?.url || "",
              autoplay: bg.video?.autoplay ?? true,
              loop: bg.video?.loop ?? true,
              muted: bg.video?.muted ?? true,
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
          value: bg.video?.url || "",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            const newVideo = {
              source: bg.video?.source || "mp4",
              url: e.target.value,
              autoplay: bg.video?.autoplay ?? true,
              loop: bg.video?.loop ?? true,
              muted: bg.video?.muted ?? true,
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
        value: bg.lottie?.url || "",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          const newLottie = {
            url: e.target.value,
            loop: bg.lottie?.loop ?? true,
            autoplay: bg.lottie?.autoplay ?? true,
            speed: bg.lottie?.speed ?? 1,
            renderer: bg.lottie?.renderer || "svg",
          };
          updateBackground("lottie", newLottie);
        },
      })
    )
  );
}

// Content tab
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
        onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>): void {
          setDraft(function (prev) {
            return prev ? { ...prev, description: e.target.value } : prev;
          });
        },
      })
    ),
    // Text align
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Text Align"),
      React.createElement("div", { className: styles.radioGroup },
        ["left", "center", "right"].map(function (align) {
          return React.createElement("label", {
            key: align,
            className: styles.radioLabel,
          },
            React.createElement("input", {
              type: "radio",
              name: "textAlign",
              className: styles.radioInput,
              checked: draft.textAlign === align,
              onChange: function (): void {
                setDraft(function (prev) {
                  return prev ? { ...prev, textAlign: align as "left" | "center" | "right" } : prev;
                });
              },
            }),
            align.charAt(0).toUpperCase() + align.substring(1)
          );
        })
      )
    ),
    // Vertical align
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Vertical Align"),
      React.createElement("div", { className: styles.radioGroup },
        ["top", "center", "bottom"].map(function (align) {
          return React.createElement("label", {
            key: align,
            className: styles.radioLabel,
          },
            React.createElement("input", {
              type: "radio",
              name: "verticalAlign",
              className: styles.radioInput,
              checked: draft.verticalAlign === align,
              onChange: function (): void {
                setDraft(function (prev) {
                  return prev ? { ...prev, verticalAlign: align as "top" | "center" | "bottom" } : prev;
                });
              },
            }),
            align.charAt(0).toUpperCase() + align.substring(1)
          );
        })
      )
    ),
    // Text color
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.fieldLabel }, "Text Color"),
      React.createElement("div", { className: styles.colorRow },
        React.createElement("input", {
          type: "color",
          className: styles.colorInput,
          value: draft.textColor || "#ffffff",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            setDraft(function (prev) {
              return prev ? { ...prev, textColor: e.target.value } : prev;
            });
          },
        }),
        React.createElement("input", {
          type: "text",
          className: styles.textInput,
          value: draft.textColor || "#ffffff",
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            setDraft(function (prev) {
              return prev ? { ...prev, textColor: e.target.value } : prev;
            });
          },
          style: { flex: 1 },
        })
      )
    )
  );
}

// CTAs tab
function renderCtasTab(
  ctas: IHyperHeroCta[],
  onAdd: () => void,
  onRemove: (id: string) => void,
  onUpdate: (id: string, field: string, value: unknown) => void
): React.ReactElement {
  return React.createElement("div", { className: styles.fieldGroup },
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
            }, "Remove")
          ),
          React.createElement("div", { className: styles.ctaFields },
            React.createElement("div", undefined,
              React.createElement("label", { className: styles.fieldLabel }, "Label"),
              React.createElement("input", {
                type: "text",
                className: styles.textInput,
                value: cta.label,
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
                onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
                  onUpdate(cta.id, "url", e.target.value);
                },
              })
            ),
            React.createElement("div", undefined,
              React.createElement("label", { className: styles.fieldLabel }, "Variant"),
              React.createElement("select", {
                className: styles.selectInput,
                value: cta.variant,
                onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
                  onUpdate(cta.id, "variant", e.target.value);
                },
              },
                ["primary", "secondary", "ghost"].map(function (v) {
                  return React.createElement("option", { key: v, value: v }, v.charAt(0).toUpperCase() + v.substring(1));
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
                "Open in new tab"
              )
            )
          )
        );
      })
    ),
    React.createElement("button", {
      className: styles.addCtaBtn,
      onClick: onAdd,
    }, "+ Add Button")
  );
}

// Advanced tab
function renderAdvancedTab(
  draft: IHyperHeroTile,
  updateGradient: (field: string, value: unknown) => void,
  updateParallax: (field: string, value: unknown) => void,
  updateCountdown: (field: string, value: unknown) => void,
  setDraft: React.Dispatch<React.SetStateAction<IHyperHeroTile | undefined>>
): React.ReactElement {
  const gradientEnabled = draft.gradientOverlay?.enabled ?? false;
  const parallaxEnabled = draft.parallax?.enabled ?? false;
  const countdownEnabled = draft.countdown?.enabled ?? false;

  return React.createElement("div", { className: styles.fieldGroup },
    // Gradient toggle
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleLabel }, "Gradient Overlay"),
      React.createElement("button", {
        className: gradientEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          updateGradient("enabled", !gradientEnabled);
        },
        "aria-label": gradientEnabled ? "Disable gradient" : "Enable gradient",
      })
    ),
    gradientEnabled && React.createElement("div", { style: { marginLeft: "20px" } },
      React.createElement("label", { className: styles.fieldLabel }, "Gradient Angle (deg)"),
      React.createElement("input", {
        type: "number",
        className: styles.textInput,
        value: parseInt((draft.gradientOverlay?.angle || "180deg").replace("deg", ""), 10),
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateGradient("angle", e.target.value + "deg");
        },
      })
    ),
    // Parallax toggle
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleLabel }, "Parallax Scrolling"),
      React.createElement("button", {
        className: parallaxEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          updateParallax("enabled", !parallaxEnabled);
        },
        "aria-label": parallaxEnabled ? "Disable parallax" : "Enable parallax",
      })
    ),
    parallaxEnabled && React.createElement("div", { style: { marginLeft: "20px" } },
      React.createElement("label", { className: styles.fieldLabel }, "Parallax Speed"),
      React.createElement("div", { className: styles.sliderRow },
        React.createElement("input", {
          type: "range",
          className: styles.sliderInput,
          min: 0.1,
          max: 1.0,
          step: 0.1,
          value: draft.parallax?.speed ?? 0.5,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateParallax("speed", parseFloat(e.target.value));
          },
        }),
        React.createElement("span", { className: styles.sliderValue }, (draft.parallax?.speed ?? 0.5).toFixed(1))
      )
    ),
    // Countdown toggle
    React.createElement("div", { className: styles.toggleRow },
      React.createElement("span", { className: styles.toggleLabel }, "Countdown Timer"),
      React.createElement("button", {
        className: countdownEnabled
          ? styles.toggleSwitch + " " + styles.toggleSwitchOn
          : styles.toggleSwitch,
        onClick: function (): void {
          updateCountdown("enabled", !countdownEnabled);
        },
        "aria-label": countdownEnabled ? "Disable countdown" : "Enable countdown",
      })
    ),
    countdownEnabled && React.createElement("div", { style: { marginLeft: "20px" } },
      React.createElement("label", { className: styles.fieldLabel }, "Target Date"),
      React.createElement("input", {
        type: "date",
        className: styles.textInput,
        value: draft.countdown?.targetDate || "",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateCountdown("targetDate", e.target.value);
        },
      }),
      React.createElement("label", { className: styles.fieldLabel, style: { marginTop: "8px" } }, "Label"),
      React.createElement("input", {
        type: "text",
        className: styles.textInput,
        value: draft.countdown?.label || "",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateCountdown("label", e.target.value);
        },
      })
    ),
    // Publish dates
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
