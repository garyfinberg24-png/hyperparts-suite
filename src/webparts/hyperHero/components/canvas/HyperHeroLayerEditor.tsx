import * as React from "react";
import { HyperModal } from "../../../../common/components/HyperModal";
import type { IHyperHeroLayer, IHyperHeroSlide, LayerType } from "../../models";
import { createDefaultLayer } from "../../models";
import { HyperHeroCanvasLayer } from "./HyperHeroCanvasLayer";
import styles from "./HyperHeroLayerEditor.module.scss";

export interface IHyperHeroLayerEditorProps {
  isOpen: boolean;
  slide: IHyperHeroSlide;
  onSave: (layers: IHyperHeroLayer[]) => void;
  onClose: () => void;
}

/** Layer type icons */
const LAYER_TYPE_ICONS: Record<LayerType, string> = {
  text: "T",
  image: "\uD83D\uDDBC\uFE0F",
  button: "\uD83D\uDD18",
  shape: "\u25FC",
  icon: "\u2B50",
};

/** Layer type options for the Add dropdown */
const LAYER_TYPE_OPTIONS: Array<{ type: LayerType; label: string }> = [
  { type: "text", label: "Text" },
  { type: "image", label: "Image" },
  { type: "button", label: "Button" },
  { type: "shape", label: "Shape" },
  { type: "icon", label: "Icon" },
];

/** Font families (web-safe) */
const FONT_FAMILIES = [
  "Segoe UI", "Arial", "Helvetica", "Georgia", "Times New Roman",
  "Verdana", "Trebuchet MS", "Courier New", "Impact", "Tahoma",
];

/** Font weight options */
const FONT_WEIGHTS = [
  { value: 300, label: "Light" },
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semibold" },
  { value: 700, label: "Bold" },
  { value: 800, label: "Extra Bold" },
];

/** CTA variant options */
const VARIANT_OPTIONS = [
  "primary", "secondary", "ghost", "pill", "outline",
  "gradient", "shadow", "minimal", "rounded", "block",
];

const HyperHeroLayerEditorInner: React.FC<IHyperHeroLayerEditorProps> = function (props) {
  const { isOpen, slide, onSave, onClose } = props;

  // Working copy of layers
  const layersState = React.useState<IHyperHeroLayer[]>([]);
  const layers = layersState[0];
  const setLayers = layersState[1];

  const selectedIdState = React.useState<string | undefined>(undefined);
  const selectedLayerId = selectedIdState[0];
  const setSelectedLayerId = selectedIdState[1];

  const addDropdownState = React.useState(false);
  const showAddDropdown = addDropdownState[0];
  const setShowAddDropdown = addDropdownState[1];

  // Drag state refs
  // eslint-disable-next-line @rushstack/no-new-null
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef<boolean>(false);
  const dragLayerIdRef = React.useRef<string>("");
  const dragHandleRef = React.useRef<string>("move");
  const dragStartXRef = React.useRef<number>(0);
  const dragStartYRef = React.useRef<number>(0);
  const dragStartLayerXRef = React.useRef<number>(0);
  const dragStartLayerYRef = React.useRef<number>(0);
  const dragStartLayerWRef = React.useRef<number>(0);
  const dragStartLayerHRef = React.useRef<number>(0);

  // Reset layers when slide/isOpen changes
  React.useEffect(function () {
    if (isOpen) {
      setLayers(slide.layers ? slide.layers.map(function (l) { return { ...l }; }) : []);
      setSelectedLayerId(undefined);
      setShowAddDropdown(false);
    }
  }, [isOpen, slide]);

  // ── Layer CRUD ──

  const handleAddLayer = React.useCallback(function (type: LayerType): void {
    setLayers(function (prev) {
      const newLayer = createDefaultLayer(type, prev.length);
      return prev.concat([newLayer]);
    });
    setShowAddDropdown(false);
  }, []);

  const handleDeleteLayer = React.useCallback(function (): void {
    if (!selectedLayerId) return;
    const deleteId = selectedLayerId;
    setLayers(function (prev) {
      const result: IHyperHeroLayer[] = [];
      prev.forEach(function (l) {
        if (l.id !== deleteId) result.push(l);
      });
      return result;
    });
    setSelectedLayerId(undefined);
  }, [selectedLayerId]);

  const handleDuplicateLayer = React.useCallback(function (): void {
    if (!selectedLayerId) return;
    setLayers(function (prev) {
      let source: IHyperHeroLayer | undefined;
      prev.forEach(function (l) {
        if (l.id === selectedLayerId) source = l;
      });
      if (!source) return prev;
      const copy: IHyperHeroLayer = {
        ...source,
        id: "layer-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
        name: source.name + " Copy",
        x: Math.min(source.x + 5, 90),
        y: Math.min(source.y + 5, 90),
        zIndex: prev.length + 1,
      };
      return prev.concat([copy]);
    });
  }, [selectedLayerId]);

  const handleMoveUp = React.useCallback(function (): void {
    if (!selectedLayerId) return;
    setLayers(function (prev) {
      let idx = -1;
      prev.forEach(function (l, i) {
        if (l.id === selectedLayerId) idx = i;
      });
      if (idx <= 0) return prev;
      const arr = prev.map(function (l) { return { ...l }; });
      const temp = arr[idx];
      arr[idx] = arr[idx - 1];
      arr[idx - 1] = temp;
      // Update zIndex to match position
      arr.forEach(function (l, i) { l.zIndex = i + 1; });
      return arr;
    });
  }, [selectedLayerId]);

  const handleMoveDown = React.useCallback(function (): void {
    if (!selectedLayerId) return;
    setLayers(function (prev) {
      let idx = -1;
      prev.forEach(function (l, i) {
        if (l.id === selectedLayerId) idx = i;
      });
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const arr = prev.map(function (l) { return { ...l }; });
      const temp = arr[idx];
      arr[idx] = arr[idx + 1];
      arr[idx + 1] = temp;
      arr.forEach(function (l, i) { l.zIndex = i + 1; });
      return arr;
    });
  }, [selectedLayerId]);

  // ── Generic field updater ──

  const updateLayer = React.useCallback(function (layerId: string, field: string, value: unknown): void {
    setLayers(function (prev) {
      return prev.map(function (l) {
        if (l.id !== layerId) return l;
        const copy = { ...l };
        (copy as unknown as Record<string, unknown>)[field] = value;
        return copy;
      });
    });
  }, []);

  // ── Drag handling ──

  const handleDragStart = React.useCallback(function (
    e: React.MouseEvent,
    layerId: string,
    handle: string
  ): void {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    dragLayerIdRef.current = layerId;
    dragHandleRef.current = handle;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;

    // Find the layer's current position/size
    let found: IHyperHeroLayer | undefined;
    layers.forEach(function (l) {
      if (l.id === layerId) found = l;
    });
    if (found) {
      dragStartLayerXRef.current = found.x;
      dragStartLayerYRef.current = found.y;
      dragStartLayerWRef.current = found.width;
      dragStartLayerHRef.current = found.height;
    }

    setSelectedLayerId(layerId);
  }, [layers]);

  // Mouse move/up on document
  React.useEffect(function () {
    const handleMouseMove = function (e: MouseEvent): void {
      if (!isDraggingRef.current || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaXPercent = ((e.clientX - dragStartXRef.current) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStartYRef.current) / rect.height) * 100;
      const handle = dragHandleRef.current;
      const layerId = dragLayerIdRef.current;

      if (handle === "move") {
        const newX = Math.max(0, Math.min(95, dragStartLayerXRef.current + deltaXPercent));
        const newY = Math.max(0, Math.min(95, dragStartLayerYRef.current + deltaYPercent));
        // Snap to 1% grid
        const snapX = Math.round(newX);
        const snapY = Math.round(newY);
        setLayers(function (prev) {
          return prev.map(function (l) {
            if (l.id !== layerId) return l;
            return { ...l, x: snapX, y: snapY };
          });
        });
      } else if (handle === "resize-se") {
        const newW = Math.max(5, Math.min(100, dragStartLayerWRef.current + deltaXPercent));
        const newH = Math.max(5, Math.min(100, dragStartLayerHRef.current + deltaYPercent));
        setLayers(function (prev) {
          return prev.map(function (l) {
            if (l.id !== layerId) return l;
            return { ...l, width: Math.round(newW), height: Math.round(newH) };
          });
        });
      } else if (handle === "resize-ne") {
        const newW = Math.max(5, Math.min(100, dragStartLayerWRef.current + deltaXPercent));
        const newH = Math.max(5, Math.min(100, dragStartLayerHRef.current - deltaYPercent));
        const newY = Math.max(0, dragStartLayerYRef.current + deltaYPercent);
        setLayers(function (prev) {
          return prev.map(function (l) {
            if (l.id !== layerId) return l;
            return { ...l, width: Math.round(newW), height: Math.round(newH), y: Math.round(newY) };
          });
        });
      } else if (handle === "resize-sw") {
        const newW = Math.max(5, Math.min(100, dragStartLayerWRef.current - deltaXPercent));
        const newX = Math.max(0, dragStartLayerXRef.current + deltaXPercent);
        const newH = Math.max(5, Math.min(100, dragStartLayerHRef.current + deltaYPercent));
        setLayers(function (prev) {
          return prev.map(function (l) {
            if (l.id !== layerId) return l;
            return { ...l, width: Math.round(newW), height: Math.round(newH), x: Math.round(newX) };
          });
        });
      } else if (handle === "resize-nw") {
        const newW = Math.max(5, Math.min(100, dragStartLayerWRef.current - deltaXPercent));
        const newH = Math.max(5, Math.min(100, dragStartLayerHRef.current - deltaYPercent));
        const newX = Math.max(0, dragStartLayerXRef.current + deltaXPercent);
        const newY = Math.max(0, dragStartLayerYRef.current + deltaYPercent);
        setLayers(function (prev) {
          return prev.map(function (l) {
            if (l.id !== layerId) return l;
            return { ...l, width: Math.round(newW), height: Math.round(newH), x: Math.round(newX), y: Math.round(newY) };
          });
        });
      }
    };

    const handleMouseUp = function (): void {
      isDraggingRef.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return function () {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Save handler
  const handleSave = React.useCallback(function (): void {
    onSave(layers);
  }, [layers, onSave]);

  // eslint-disable-next-line @rushstack/no-new-null
  if (!isOpen) return null;

  // Find selected layer
  let selectedLayer: IHyperHeroLayer | undefined;
  layers.forEach(function (l) {
    if (l.id === selectedLayerId) selectedLayer = l;
  });

  // ── Build canvas background style ──
  const canvasBgStyle: React.CSSProperties = {};
  const bg = slide.background;
  if (bg.type === "solidColor" && bg.backgroundColor) {
    canvasBgStyle.backgroundColor = bg.backgroundColor;
  } else if (bg.type === "image" && bg.imageUrl) {
    canvasBgStyle.backgroundImage = "url(" + bg.imageUrl + ")";
    canvasBgStyle.backgroundSize = "cover";
    canvasBgStyle.backgroundPosition = "center";
  } else {
    canvasBgStyle.backgroundColor = "#0078d4";
  }

  // ── Footer ──
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
    }, "Save Layers")
  );

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: "Hero Designer — " + (slide.heading || "Untitled"),
    size: "xlarge",
    footer: footer,
  },
    React.createElement("div", { className: styles.editorLayout },
      // ═══ Left Panel: Layer List ═══
      renderLeftPanel(
        layers,
        selectedLayerId,
        showAddDropdown,
        setShowAddDropdown,
        handleAddLayer,
        setSelectedLayerId,
        updateLayer,
        handleMoveUp,
        handleMoveDown,
        handleDuplicateLayer,
        handleDeleteLayer
      ),

      // ═══ Center Panel: Canvas ═══
      React.createElement("div", { className: styles.centerPanel },
        React.createElement("div", {
          className: styles.canvasContainer,
          style: canvasBgStyle,
          ref: canvasRef,
          onClick: function (): void { setSelectedLayerId(undefined); },
        },
          layers.map(function (layer) {
            return React.createElement(HyperHeroCanvasLayer, {
              key: layer.id,
              layer: layer,
              isSelected: layer.id === selectedLayerId,
              isEditing: true,
              onSelect: setSelectedLayerId,
              onDragStart: handleDragStart,
            });
          })
        )
      ),

      // ═══ Right Panel: Properties ═══
      renderRightPanel(selectedLayer, updateLayer)
    )
  );
};

// ════════════════════════════════════════════════════════════════
// LEFT PANEL
// ════════════════════════════════════════════════════════════════

function renderLeftPanel(
  layers: IHyperHeroLayer[],
  selectedLayerId: string | undefined,
  showAddDropdown: boolean,
  setShowAddDropdown: (v: boolean) => void,
  handleAddLayer: (type: LayerType) => void,
  setSelectedLayerId: (id: string | undefined) => void,
  updateLayer: (id: string, field: string, value: unknown) => void,
  handleMoveUp: () => void,
  handleMoveDown: () => void,
  handleDuplicateLayer: () => void,
  handleDeleteLayer: () => void
): React.ReactElement {
  return React.createElement("div", { className: styles.leftPanel },
    React.createElement("div", { className: styles.leftPanelTitle }, "Layers"),

    // Add layer button + dropdown
    React.createElement("div", { className: styles.addLayerWrapper },
      React.createElement("button", {
        className: styles.addLayerBtn,
        onClick: function (): void { setShowAddDropdown(!showAddDropdown); },
        type: "button",
      }, "+ Add Layer"),
      showAddDropdown && React.createElement("div", { className: styles.addLayerDropdown },
        LAYER_TYPE_OPTIONS.map(function (opt) {
          return React.createElement("button", {
            key: opt.type,
            className: styles.addLayerOption,
            onClick: function (): void { handleAddLayer(opt.type); },
            type: "button",
          },
            React.createElement("span", undefined, LAYER_TYPE_ICONS[opt.type]),
            React.createElement("span", undefined, opt.label)
          );
        })
      )
    ),

    // Layer list
    React.createElement("div", { className: styles.layerList },
      layers.map(function (layer) {
        const isSelected = layer.id === selectedLayerId;
        const itemClasses = [styles.layerItem];
        if (isSelected) itemClasses.push(styles.layerItemSelected);
        if (!layer.visible) itemClasses.push(styles.layerItemHidden);

        return React.createElement("div", {
          key: layer.id,
          className: itemClasses.join(" "),
          onClick: function (): void { setSelectedLayerId(layer.id); },
        },
          // Type icon
          React.createElement("span", { className: styles.layerItemIcon }, LAYER_TYPE_ICONS[layer.type] || "?"),
          // Name
          React.createElement("span", { className: styles.layerItemName }, layer.name),
          // Actions
          React.createElement("div", { className: styles.layerItemActions },
            // Visibility toggle
            React.createElement("button", {
              className: styles.layerItemBtn,
              onClick: function (e: React.MouseEvent): void {
                e.stopPropagation();
                updateLayer(layer.id, "visible", !layer.visible);
              },
              type: "button",
              title: layer.visible ? "Hide" : "Show",
            }, layer.visible ? "\uD83D\uDC41" : "\uD83D\uDEAB"),
            // Lock toggle
            React.createElement("button", {
              className: styles.layerItemBtn,
              onClick: function (e: React.MouseEvent): void {
                e.stopPropagation();
                updateLayer(layer.id, "locked", !layer.locked);
              },
              type: "button",
              title: layer.locked ? "Unlock" : "Lock",
            }, layer.locked ? "\uD83D\uDD12" : "\uD83D\uDD13")
          )
        );
      })
    ),

    // Bottom action buttons
    React.createElement("div", { className: styles.layerActions },
      React.createElement("button", {
        className: styles.layerActionBtn,
        onClick: handleMoveUp,
        disabled: !selectedLayerId,
        type: "button",
      }, "\u2191 Up"),
      React.createElement("button", {
        className: styles.layerActionBtn,
        onClick: handleMoveDown,
        disabled: !selectedLayerId,
        type: "button",
      }, "\u2193 Down"),
      React.createElement("button", {
        className: styles.layerActionBtn,
        onClick: handleDuplicateLayer,
        disabled: !selectedLayerId,
        type: "button",
      }, "Dup"),
      React.createElement("button", {
        className: styles.layerActionBtn + " " + styles.layerActionBtnDanger,
        onClick: handleDeleteLayer,
        disabled: !selectedLayerId,
        type: "button",
      }, "Del")
    )
  );
}

// ════════════════════════════════════════════════════════════════
// RIGHT PANEL
// ════════════════════════════════════════════════════════════════

function renderRightPanel(
  layer: IHyperHeroLayer | undefined,
  updateLayer: (id: string, field: string, value: unknown) => void
): React.ReactElement {
  if (!layer) {
    return React.createElement("div", { className: styles.rightPanel },
      React.createElement("div", { className: styles.rightPanelTitle }, "Properties"),
      React.createElement("div", { className: styles.emptyProperties },
        "Select a layer to edit its properties"
      )
    );
  }

  return React.createElement("div", { className: styles.rightPanel },
    React.createElement("div", { className: styles.rightPanelTitle }, layer.name),
    React.createElement("div", { className: styles.propertyGroup },
      // ── Common properties ──
      // Name
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.propertyLabel }, "Name"),
        React.createElement("input", {
          className: styles.propertyInput,
          type: "text",
          value: layer.name,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateLayer(layer.id, "name", e.target.value);
          },
        })
      ),
      // Position X
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.propertyLabel }, "X Position (%)"),
        React.createElement("div", { className: styles.propertySliderRow },
          React.createElement("input", {
            className: styles.propertySlider,
            type: "range",
            min: "0",
            max: "95",
            value: layer.x,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateLayer(layer.id, "x", parseInt(e.target.value, 10));
            },
          }),
          React.createElement("span", { className: styles.propertySliderValue }, layer.x + "%")
        )
      ),
      // Position Y
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.propertyLabel }, "Y Position (%)"),
        React.createElement("div", { className: styles.propertySliderRow },
          React.createElement("input", {
            className: styles.propertySlider,
            type: "range",
            min: "0",
            max: "95",
            value: layer.y,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateLayer(layer.id, "y", parseInt(e.target.value, 10));
            },
          }),
          React.createElement("span", { className: styles.propertySliderValue }, layer.y + "%")
        )
      ),
      // Width
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.propertyLabel }, "Width (%)"),
        React.createElement("div", { className: styles.propertySliderRow },
          React.createElement("input", {
            className: styles.propertySlider,
            type: "range",
            min: "1",
            max: "100",
            value: layer.width,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateLayer(layer.id, "width", parseInt(e.target.value, 10));
            },
          }),
          React.createElement("span", { className: styles.propertySliderValue }, layer.width + "%")
        )
      ),
      // Height
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.propertyLabel }, "Height (%, 0=auto)"),
        React.createElement("div", { className: styles.propertySliderRow },
          React.createElement("input", {
            className: styles.propertySlider,
            type: "range",
            min: "0",
            max: "100",
            value: layer.height,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateLayer(layer.id, "height", parseInt(e.target.value, 10));
            },
          }),
          React.createElement("span", { className: styles.propertySliderValue },
            layer.height === 0 ? "Auto" : layer.height + "%"
          )
        )
      ),
      // Rotation
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.propertyLabel }, "Rotation"),
        React.createElement("div", { className: styles.propertySliderRow },
          React.createElement("input", {
            className: styles.propertySlider,
            type: "range",
            min: "0",
            max: "360",
            value: layer.rotation,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateLayer(layer.id, "rotation", parseInt(e.target.value, 10));
            },
          }),
          React.createElement("span", { className: styles.propertySliderValue }, layer.rotation + "\u00B0")
        )
      ),
      // Opacity
      React.createElement("div", undefined,
        React.createElement("label", { className: styles.propertyLabel }, "Opacity"),
        React.createElement("div", { className: styles.propertySliderRow },
          React.createElement("input", {
            className: styles.propertySlider,
            type: "range",
            min: "0",
            max: "100",
            value: layer.opacity,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateLayer(layer.id, "opacity", parseInt(e.target.value, 10));
            },
          }),
          React.createElement("span", { className: styles.propertySliderValue }, layer.opacity + "%")
        )
      ),

      // ── Divider + type-specific properties ──
      React.createElement("div", { className: styles.sectionDivider }),
      renderTypeProperties(layer, updateLayer)
    )
  );
}

// ════════════════════════════════════════════════════════════════
// TYPE-SPECIFIC PROPERTIES
// ════════════════════════════════════════════════════════════════

function renderTypeProperties(
  layer: IHyperHeroLayer,
  updateLayer: (id: string, field: string, value: unknown) => void
): React.ReactElement {
  if (layer.type === "text") {
    return renderTextProperties(layer, updateLayer);
  }
  if (layer.type === "image") {
    return renderImageProperties(layer, updateLayer);
  }
  if (layer.type === "button") {
    return renderButtonProperties(layer, updateLayer);
  }
  if (layer.type === "shape") {
    return renderShapeProperties(layer, updateLayer);
  }
  if (layer.type === "icon") {
    return renderIconProperties(layer, updateLayer);
  }
  return React.createElement("div");
}

function renderTextProperties(
  layer: IHyperHeroLayer,
  updateLayer: (id: string, field: string, value: unknown) => void
): React.ReactElement {
  const fc = layer.fontConfig;
  return React.createElement(React.Fragment, undefined,
    // Text content
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Text Content"),
      React.createElement("textarea", {
        className: styles.propertyTextArea,
        value: layer.textContent || "",
        onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>): void {
          updateLayer(layer.id, "textContent", e.target.value);
        },
      })
    ),
    // Font family
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Font"),
      React.createElement("select", {
        className: styles.propertySelect,
        value: fc ? fc.fontFamily : "Segoe UI",
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
          const current = layer.fontConfig || {
            fontFamily: "Segoe UI", fontSize: 0, fontWeight: 0,
            color: "", letterSpacing: 0, lineHeight: 0,
            textTransform: "none", textShadow: "none",
          };
          updateLayer(layer.id, "fontConfig", { ...current, fontFamily: e.target.value });
        },
      },
        FONT_FAMILIES.map(function (f) {
          return React.createElement("option", { key: f, value: f }, f);
        })
      )
    ),
    // Font size
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Size"),
      React.createElement("div", { className: styles.propertySliderRow },
        React.createElement("input", {
          className: styles.propertySlider,
          type: "range",
          min: "12",
          max: "80",
          value: fc ? fc.fontSize || 28 : 28,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            const current = layer.fontConfig || {
              fontFamily: "Segoe UI", fontSize: 28, fontWeight: 0,
              color: "", letterSpacing: 0, lineHeight: 0,
              textTransform: "none", textShadow: "none",
            };
            updateLayer(layer.id, "fontConfig", { ...current, fontSize: parseInt(e.target.value, 10) });
          },
        }),
        React.createElement("span", { className: styles.propertySliderValue },
          (fc ? fc.fontSize || 28 : 28) + "px"
        )
      )
    ),
    // Font weight
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Weight"),
      React.createElement("select", {
        className: styles.propertySelect,
        value: fc ? fc.fontWeight || 400 : 400,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
          const current = layer.fontConfig || {
            fontFamily: "Segoe UI", fontSize: 28, fontWeight: 400,
            color: "", letterSpacing: 0, lineHeight: 0,
            textTransform: "none", textShadow: "none",
          };
          updateLayer(layer.id, "fontConfig", { ...current, fontWeight: parseInt(e.target.value, 10) });
        },
      },
        FONT_WEIGHTS.map(function (w) {
          return React.createElement("option", { key: w.value, value: w.value }, w.label);
        })
      )
    ),
    // Color
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Color"),
      React.createElement("input", {
        className: styles.propertyInput,
        type: "text",
        value: fc ? fc.color || "#ffffff" : "#ffffff",
        placeholder: "#ffffff",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          const current = layer.fontConfig || {
            fontFamily: "Segoe UI", fontSize: 28, fontWeight: 400,
            color: "#ffffff", letterSpacing: 0, lineHeight: 0,
            textTransform: "none", textShadow: "none",
          };
          updateLayer(layer.id, "fontConfig", { ...current, color: e.target.value });
        },
      })
    )
  );
}

function renderImageProperties(
  layer: IHyperHeroLayer,
  updateLayer: (id: string, field: string, value: unknown) => void
): React.ReactElement {
  return React.createElement(React.Fragment, undefined,
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Image URL"),
      React.createElement("input", {
        className: styles.propertyInput,
        type: "text",
        value: layer.imageUrl || "",
        placeholder: "https://...",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateLayer(layer.id, "imageUrl", e.target.value);
        },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Fit"),
      React.createElement("select", {
        className: styles.propertySelect,
        value: layer.imageFit || "cover",
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
          updateLayer(layer.id, "imageFit", e.target.value);
        },
      },
        React.createElement("option", { value: "cover" }, "Cover"),
        React.createElement("option", { value: "contain" }, "Contain"),
        React.createElement("option", { value: "fill" }, "Fill")
      )
    )
  );
}

function renderButtonProperties(
  layer: IHyperHeroLayer,
  updateLayer: (id: string, field: string, value: unknown) => void
): React.ReactElement {
  return React.createElement(React.Fragment, undefined,
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Label"),
      React.createElement("input", {
        className: styles.propertyInput,
        type: "text",
        value: layer.buttonLabel || "",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateLayer(layer.id, "buttonLabel", e.target.value);
        },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "URL"),
      React.createElement("input", {
        className: styles.propertyInput,
        type: "text",
        value: layer.buttonUrl || "",
        placeholder: "https://...",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateLayer(layer.id, "buttonUrl", e.target.value);
        },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Style"),
      React.createElement("select", {
        className: styles.propertySelect,
        value: layer.buttonVariant || "primary",
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
          updateLayer(layer.id, "buttonVariant", e.target.value);
        },
      },
        VARIANT_OPTIONS.map(function (v) {
          return React.createElement("option", { key: v, value: v },
            v.charAt(0).toUpperCase() + v.substring(1)
          );
        })
      )
    ),
    React.createElement("label", { className: styles.propertyCheckbox },
      React.createElement("input", {
        type: "checkbox",
        checked: layer.buttonOpenInNewTab || false,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateLayer(layer.id, "buttonOpenInNewTab", e.target.checked);
        },
      }),
      "Open in new tab"
    )
  );
}

function renderShapeProperties(
  layer: IHyperHeroLayer,
  updateLayer: (id: string, field: string, value: unknown) => void
): React.ReactElement {
  return React.createElement(React.Fragment, undefined,
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Shape"),
      React.createElement("select", {
        className: styles.propertySelect,
        value: layer.shapeType || "rectangle",
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>): void {
          updateLayer(layer.id, "shapeType", e.target.value);
        },
      },
        React.createElement("option", { value: "rectangle" }, "Rectangle"),
        React.createElement("option", { value: "circle" }, "Circle"),
        React.createElement("option", { value: "line" }, "Line"),
        React.createElement("option", { value: "triangle" }, "Triangle")
      )
    ),
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Color"),
      React.createElement("input", {
        className: styles.propertyInput,
        type: "text",
        value: layer.shapeColor || "#0078d4",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateLayer(layer.id, "shapeColor", e.target.value);
        },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Border Width"),
      React.createElement("div", { className: styles.propertySliderRow },
        React.createElement("input", {
          className: styles.propertySlider,
          type: "range",
          min: "0",
          max: "10",
          value: layer.shapeBorderWidth || 0,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateLayer(layer.id, "shapeBorderWidth", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.propertySliderValue },
          (layer.shapeBorderWidth || 0) + "px"
        )
      )
    ),
    (layer.shapeBorderWidth || 0) > 0
      ? React.createElement("div", undefined,
          React.createElement("label", { className: styles.propertyLabel }, "Border Color"),
          React.createElement("input", {
            className: styles.propertyInput,
            type: "text",
            value: layer.shapeBorderColor || "#000000",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
              updateLayer(layer.id, "shapeBorderColor", e.target.value);
            },
          })
        )
      : undefined
  );
}

function renderIconProperties(
  layer: IHyperHeroLayer,
  updateLayer: (id: string, field: string, value: unknown) => void
): React.ReactElement {
  return React.createElement(React.Fragment, undefined,
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Emoji"),
      React.createElement("input", {
        className: styles.propertyInput,
        type: "text",
        value: layer.iconEmoji || "",
        onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
          updateLayer(layer.id, "iconEmoji", e.target.value);
        },
      })
    ),
    React.createElement("div", undefined,
      React.createElement("label", { className: styles.propertyLabel }, "Size"),
      React.createElement("div", { className: styles.propertySliderRow },
        React.createElement("input", {
          className: styles.propertySlider,
          type: "range",
          min: "16",
          max: "96",
          value: layer.iconSize || 48,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>): void {
            updateLayer(layer.id, "iconSize", parseInt(e.target.value, 10));
          },
        }),
        React.createElement("span", { className: styles.propertySliderValue },
          (layer.iconSize || 48) + "px"
        )
      )
    )
  );
}

export const HyperHeroLayerEditor = React.memo(HyperHeroLayerEditorInner);
