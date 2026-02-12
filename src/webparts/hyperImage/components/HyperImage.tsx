import * as React from "react";
import type { IHyperImageWebPartProps } from "../models";
import {
  DEFAULT_FILTER_CONFIG,
  DEFAULT_TEXT_OVERLAY,
  DEFAULT_BORDER_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
  FILTER_PRESETS,
  BORDER_STYLE_PRESETS,
  ImageLayout,
  TextPlacement,
} from "../models";
import type { ShapeMask } from "../models/IHyperImageShape";
import type { FilterPreset } from "../models/IHyperImageFilter";
import type { HoverEffect } from "../models/IHyperImageHover";
import type { IFilterConfig, ITextOverlay, IBorderConfig, IImageLayoutConfig, IHyperImageItem } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperEditOverlay } from "../../../common/components";
import { HyperModal } from "../../../common/components";
import { useHyperImageStyles } from "../hooks/useHyperImageStyles";
import { useViewportTrigger } from "../hooks/useViewportTrigger";
import { useHyperImageStore } from "../store/useHyperImageStore";
import { getSampleImageUrl, getSampleAdditionalImages } from "../utils/sampleImage";
import HyperImageTextOverlay from "./HyperImageTextOverlay";
import HyperImageDemoBar from "./HyperImageDemoBar";
import { HyperImageEditorModal } from "./editor";
import type { IEditorChanges } from "./editor";
import { HyperImageBrowser } from "../../../common/components/imageBrowser/HyperImageBrowser";
import type { IHyperImageBrowserProps } from "../../../common/components/imageBrowser/HyperImageBrowser";
import HyperImageLayoutGallery from "./HyperImageLayoutGallery";
import type { IPresetLayout } from "../models/IHyperImagePresetLayout";
import WelcomeStep from "./wizard/WelcomeStep";
import styles from "./HyperImage.module.scss";

export interface IHyperImageComponentProps extends IHyperImageWebPartProps {
  instanceId: string;
  /** Whether the web part is in edit mode (displayMode === 2) */
  isEditMode?: boolean;
  /** Whether the wizard should open automatically on init */
  showWizardOnInit?: boolean;
  /** Callback when the wizard applies — receives partial web part props */
  onWizardApply?: (result: Partial<IHyperImageWebPartProps>) => void;
  /** Callback when user selects an image from the browser */
  onImageSelect?: (imageUrl: string) => void;
  /** Callback when user selects a preset layout from the gallery */
  onLayoutSelect?: (preset: IPresetLayout) => void;
  onConfigure?: () => void;
}

/** Safely parse a JSON string with a fallback default */
function parseJson<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/** Capitalize first letter */
function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.substring(1);
}

var HyperImageInner: React.FC<IHyperImageComponentProps> = function (props) {
  // ── Wizard state ──
  var wizardOpenState = React.useState(false);
  var wizardOpen = wizardOpenState[0];
  var setWizardOpen = wizardOpenState[1];

  React.useEffect(function () {
    if (props.isEditMode && props.showWizardOnInit && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  var handleWizardApply = React.useCallback(function (result: Partial<IHyperImageWebPartProps>): void {
    setWizardOpen(false);
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
  }, [props.onWizardApply, setWizardOpen]);

  var handleWizardClose = React.useCallback(function (): void {
    setWizardOpen(false);
  }, [setWizardOpen]);

  // ── Flip effect state ──
  var flipState = React.useState(false);
  var isFlipped = flipState[0];
  var setIsFlipped = flipState[1];

  // ── Parse JSON props ──
  var textOverlay = parseJson<ITextOverlay>(props.textOverlayJson, DEFAULT_TEXT_OVERLAY);
  var borderConfig = parseJson<IBorderConfig>(props.borderConfigJson, DEFAULT_BORDER_CONFIG);
  var layoutConfig = parseJson<IImageLayoutConfig>(props.layoutConfigJson, DEFAULT_LAYOUT_CONFIG);
  var additionalImages = parseJson<IHyperImageItem[]>(props.additionalImagesJson, []);

  // ── Demo mode overrides from store ──
  var demoShape = useHyperImageStore(function (s) { return s.demoShape; });
  var demoLayout = useHyperImageStore(function (s) { return s.demoLayout; });
  var demoFilter = useHyperImageStore(function (s) { return s.demoFilter; });
  var demoHover = useHyperImageStore(function (s) { return s.demoHover; });
  var demoBorderPreset = useHyperImageStore(function (s) { return s.demoBorderPreset; });

  // Apply demo overrides (undefined means "use prop value")
  var effectiveShape: ShapeMask = props.enableDemoMode && demoShape !== undefined ? demoShape : props.shape;
  var effectiveLayout: ImageLayout = props.enableDemoMode && demoLayout !== undefined ? demoLayout : props.imageLayout;
  var effectiveFilterPreset: FilterPreset = props.enableDemoMode && demoFilter !== undefined ? demoFilter : props.filterPreset;
  var effectiveHover: HoverEffect = props.enableDemoMode && demoHover !== undefined ? demoHover : props.hoverEffect;

  // Apply demo border preset override
  if (props.enableDemoMode && demoBorderPreset !== undefined && BORDER_STYLE_PRESETS[demoBorderPreset]) {
    var presetConfig = BORDER_STYLE_PRESETS[demoBorderPreset];
    borderConfig = {
      width: presetConfig.width,
      color: presetConfig.color,
      style: presetConfig.style,
      radius: presetConfig.radius,
      padding: presetConfig.padding,
      paddingBottom: presetConfig.paddingBottom,
    };
  }

  // When demo mode changes layout to multi, provide sample additional images
  var effectiveAdditional = additionalImages;
  if (props.enableDemoMode && demoLayout !== undefined && demoLayout !== ImageLayout.Single && effectiveAdditional.length === 0) {
    effectiveAdditional = getSampleAdditionalImages();
  }

  // Filter config: if preset is set, use preset values; otherwise use custom JSON
  var filterConfig: IFilterConfig;
  if (effectiveFilterPreset && effectiveFilterPreset !== "none" && FILTER_PRESETS[effectiveFilterPreset]) {
    filterConfig = FILTER_PRESETS[effectiveFilterPreset] as IFilterConfig;
  } else {
    filterConfig = parseJson<IFilterConfig>(props.filterConfigJson, DEFAULT_FILTER_CONFIG);
  }

  // ── Determine image URL ──
  var imageUrl = props.useSampleData ? getSampleImageUrl() : props.imageUrl;

  // ── Store state ──
  var openLightbox = useHyperImageStore(function (s) { return s.openLightbox; });

  // ── Viewport trigger for entrance animation ──
  var viewport = useViewportTrigger();
  var isVisible = viewport.isVisible;
  var containerRef = viewport.ref;

  // ── Effective shadow preset (demo border preset may override) ──
  var effectiveShadowPreset = props.shadowPreset;
  var demoBorderShadow: string | undefined;
  if (props.enableDemoMode && demoBorderPreset !== undefined && BORDER_STYLE_PRESETS[demoBorderPreset]) {
    var presetShadow = BORDER_STYLE_PRESETS[demoBorderPreset].shadow;
    if (presetShadow) {
      demoBorderShadow = presetShadow;
    }
  }

  // ── Computed styles ──
  var computedStyles = useHyperImageStyles({
    shape: effectiveShape,
    customClipPath: props.customClipPath,
    filterConfig: filterConfig,
    borderConfig: borderConfig,
    shadowPreset: effectiveShadowPreset,
    objectFit: props.objectFit,
    maxWidth: props.maxWidth,
    maxHeight: props.maxHeight,
    aspectRatio: props.aspectRatio,
  });

  // Override figure style with demo border preset shadow and paddingBottom
  if (props.enableDemoMode && demoBorderPreset !== undefined && BORDER_STYLE_PRESETS[demoBorderPreset]) {
    if (demoBorderShadow) {
      computedStyles = {
        containerStyle: computedStyles.containerStyle,
        imageStyle: computedStyles.imageStyle,
        figureStyle: (function (): React.CSSProperties {
          var result: React.CSSProperties = {};
          var keys = Object.keys(computedStyles.figureStyle);
          keys.forEach(function (k) {
            (result as Record<string, unknown>)[k] = (computedStyles.figureStyle as Record<string, unknown>)[k];
          });
          result.boxShadow = demoBorderShadow;
          return result;
        })(),
      };
    }
    if (borderConfig.paddingBottom !== undefined && borderConfig.paddingBottom > 0) {
      computedStyles = {
        containerStyle: computedStyles.containerStyle,
        imageStyle: computedStyles.imageStyle,
        figureStyle: (function (): React.CSSProperties {
          var result: React.CSSProperties = {};
          var keys = Object.keys(computedStyles.figureStyle);
          keys.forEach(function (k) {
            (result as Record<string, unknown>)[k] = (computedStyles.figureStyle as Record<string, unknown>)[k];
          });
          result.paddingBottom = borderConfig.paddingBottom + "px";
          return result;
        })(),
      };
    }
  }

  // ── Empty state: no image configured ──
  if (!imageUrl) {
    return React.createElement(HyperEmptyState, {
      title: "No Image Configured",
      description: "Open the property pane to add an image or enable sample data.",
    });
  }

  // ── Flip mode check ──
  var isFlipMode = effectiveHover === "flip";

  // ── Hover effect class (skip for flip — handled separately) ──
  var hoverClass = "";
  if (effectiveHover && effectiveHover !== "none" && !isFlipMode) {
    hoverClass = (styles as Record<string, string>)["hover" + capitalize(effectiveHover)] || "";
  }

  // ── Entrance animation class ──
  var entranceClass = "";
  if (props.entranceAnimation && props.entranceAnimation !== "none") {
    if (isVisible) {
      entranceClass = (styles as Record<string, string>)["entrance" + capitalize(props.entranceAnimation)] || "";
    } else {
      entranceClass = styles.entranceHidden;
    }
  }

  // ── Alt text ──
  var alt = props.isDecorative ? "" : (props.altText || "Image");
  var ariaHidden = props.isDecorative ? "true" : undefined;

  // ── Build image element ──
  var imgElement = React.createElement("img", {
    className: styles.hyperImageImg,
    src: imageUrl,
    alt: alt,
    "aria-hidden": ariaHidden,
    loading: props.lazyLoad ? "lazy" : undefined,
    style: computedStyles.imageStyle,
  });

  // ── Build figure with optional text overlay ──
  var figureChildren: React.ReactNode[] = [imgElement];

  // Text overlay (on image)
  if (textOverlay.enabled && textOverlay.placement === TextPlacement.Overlay) {
    figureChildren.push(
      React.createElement(HyperImageTextOverlay, { key: "overlay", config: textOverlay })
    );
  }

  var figureElement = React.createElement(
    "figure",
    {
      className: styles.hyperImageFigure + " " + hoverClass,
      style: computedStyles.figureStyle,
    },
    figureChildren
  );

  // ── Wrap in flip container, link, or lightbox button ──
  var wrappedFigure: React.ReactNode;
  if (isFlipMode) {
    // Flip effect: click toggles front/back
    var flipBackBg = props.flipBackBgColor || "#f3f2f1";
    var flipInnerClass = styles.flipInner + (isFlipped ? " " + styles.flipInnerFlipped : "");
    wrappedFigure = React.createElement("div", {
      className: styles.flipContainer,
      onClick: function () { setIsFlipped(!isFlipped); },
      onKeyDown: function (e: React.KeyboardEvent): void {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      },
      role: "button",
      tabIndex: 0,
      "aria-label": isFlipped ? "Click to show image" : "Click to show details",
    },
      React.createElement("div", { className: flipInnerClass },
        // Front face: the image figure
        React.createElement("div", { className: styles.flipFront }, figureElement),
        // Back face: title + text
        React.createElement("div", {
          className: styles.flipBack,
          style: { backgroundColor: flipBackBg },
        },
          props.flipBackTitle ? React.createElement("h3", { className: styles.flipBackTitle }, props.flipBackTitle) : undefined,
          props.flipBackText ? React.createElement("p", { className: styles.flipBackText }, props.flipBackText) : undefined
        )
      )
    );
  } else if (props.openLightbox) {
    wrappedFigure = React.createElement("button", {
      className: styles.imageLinkButton,
      onClick: function () { openLightbox(); },
      "aria-label": "Open image in lightbox",
      type: "button",
    }, figureElement);
  } else if (props.linkUrl) {
    wrappedFigure = React.createElement("a", {
      className: styles.imageLink,
      href: props.linkUrl,
      target: props.linkTarget,
      rel: props.linkTarget === "_blank" ? "noopener noreferrer" : undefined,
    }, figureElement);
  } else {
    wrappedFigure = figureElement;
  }

  // ── Build container children ──
  var containerChildren: React.ReactNode[] = [];

  // Demo bar (rendered above the image when demo mode is on)
  if (props.enableDemoMode) {
    containerChildren.push(
      React.createElement(HyperImageDemoBar, { key: "demobar" })
    );
  }

  // Sample data banner
  if (props.useSampleData && !props.enableDemoMode) {
    containerChildren.push(React.createElement("div", {
      key: "banner",
      className: styles.sampleBanner,
    }, "Sample Image \u2014 Turn off \"Use Sample Image\" in the property pane and add your own image."));
  }

  containerChildren.push(wrappedFigure);

  // Text caption (below image) — callout box
  if (textOverlay.enabled && textOverlay.placement === TextPlacement.Below) {
    containerChildren.push(
      React.createElement(HyperImageTextOverlay, { key: "caption", config: textOverlay })
    );
  }

  // Wizard modal (rendered alongside main content, not as early return)
  if (wizardOpen) {
    containerChildren.push(
      React.createElement(WelcomeStep, {
        key: "wizard",
        isOpen: wizardOpen,
        onClose: handleWizardClose,
        onApply: handleWizardApply,
        currentProps: props.wizardCompleted ? props : undefined,
      })
    );
  }

  // ── Multi-image layout support ──
  var isMulti = effectiveLayout && effectiveLayout !== ImageLayout.Single && effectiveAdditional.length > 0;

  var mainContent: React.ReactElement;

  if (isMulti) {
    mainContent = _renderMultiImageLayout(
      props, effectiveLayout, imageUrl, alt, effectiveAdditional, layoutConfig,
      computedStyles, hoverClass, entranceClass, containerRef, containerChildren
    );
  } else {
    // ── Single image container ──
    mainContent = React.createElement(
      "div",
      {
        ref: containerRef,
        className: styles.hyperImageContainer + " " + entranceClass,
        style: computedStyles.containerStyle,
        role: "region",
        "aria-label": "HyperImage",
      },
      containerChildren
    );
  }

  return React.createElement(HyperEditOverlay, {
    wpName: "HyperImage",
    isVisible: !!props.isEditMode,
    onWizardClick: function () { setWizardOpen(true); },
    onEditClick: function () { if (props.onConfigure) props.onConfigure(); },
  }, mainContent);
};

/** Render multi-image layouts (row, grid, collage, filmstrip) */
function _renderMultiImageLayout(
  props: IHyperImageComponentProps,
  layout: ImageLayout,
  primaryUrl: string,
  primaryAlt: string,
  images: IHyperImageItem[],
  config: IImageLayoutConfig,
  _computedStyles: ReturnType<typeof useHyperImageStyles>,
  _hoverClass: string,
  entranceClass: string,
  containerRef: React.RefObject<HTMLDivElement>,
  headerChildren: React.ReactNode[],
): React.ReactElement {
  // Build array of all images: primary + additional
  var allImages: Array<{ url: string; alt: string; title: string; subtitle: string }> = [
    { url: primaryUrl, alt: primaryAlt, title: "", subtitle: "" },
  ];
  images.forEach(function (img) {
    allImages.push({ url: img.imageUrl, alt: img.altText || "", title: img.title || "", subtitle: img.subtitle || "" });
  });

  var gap = config.gap || 12;

  // Layout-specific class and style
  var layoutClass = "";
  var layoutStyle: React.CSSProperties = {};

  if (layout === ImageLayout.Row) {
    layoutClass = styles.layoutRow;
    layoutStyle = { gap: gap + "px" };
  } else if (layout === ImageLayout.Grid) {
    layoutClass = styles.layoutGrid;
    layoutStyle = {
      gridTemplateColumns: "repeat(" + config.columns + ", 1fr)",
      gridTemplateRows: "repeat(" + config.rows + ", 1fr)",
      gap: gap + "px",
    };
  } else if (layout === ImageLayout.Collage) {
    layoutClass = styles.layoutCollage;
    layoutStyle = { gap: gap + "px" };
  } else if (layout === ImageLayout.Filmstrip) {
    layoutClass = styles.layoutFilmstrip;
    layoutStyle = { gap: gap + "px" };
  }

  var itemElements = allImages.map(function (img, idx) {
    var isCollageMain = layout === ImageLayout.Collage && idx === 0;
    var itemClass = styles.layoutItem + (isCollageMain ? " " + styles.layoutCollageMain : "");
    var itemStyle: React.CSSProperties = {};

    if (layout === ImageLayout.Row) {
      itemStyle = { flex: "1 1 " + (100 / config.columns) + "%", maxWidth: (100 / config.columns) + "%" };
    } else if (layout === ImageLayout.Filmstrip) {
      itemStyle = { width: (100 / config.columns) + "%", minWidth: "200px" };
    }

    var children: React.ReactNode[] = [
      React.createElement("img", {
        key: "img",
        className: styles.layoutItemImg,
        src: img.url,
        alt: img.alt,
        loading: props.lazyLoad ? "lazy" : undefined,
      }),
    ];

    // Per-image caption
    if (img.title || img.subtitle) {
      children.push(React.createElement("div", {
        key: "cap",
        className: styles.textCaption,
        style: { padding: "8px 12px" },
      },
        img.title ? React.createElement("h4", { className: styles.textTitle, style: { fontSize: "14px", margin: "0 0 2px 0" } }, img.title) : undefined,
        img.subtitle ? React.createElement("p", { className: styles.textSubtitle, style: { fontSize: "12px", margin: 0 } }, img.subtitle) : undefined,
      ));
    }

    return React.createElement("div", {
      key: "item-" + idx,
      className: itemClass,
      style: itemStyle,
    }, children);
  });

  return React.createElement(
    "div",
    {
      ref: containerRef,
      className: styles.hyperImageContainer + " " + entranceClass,
      role: "region",
      "aria-label": "HyperImage Gallery",
    },
    // Demo bar + sample banner (from headerChildren)
    headerChildren,
    React.createElement("div", {
      className: layoutClass,
      style: layoutStyle,
    }, itemElements)
  );
}

// ── Lightbox + Editor + Browser + Layout Gallery modals (rendered as siblings) ──
var HyperImageWithLightbox: React.FC<IHyperImageComponentProps> = function (props) {
  var lightboxOpen = useHyperImageStore(function (s) { return s.lightboxOpen; });
  var closeLightbox = useHyperImageStore(function (s) { return s.closeLightbox; });
  var isBrowserOpen = useHyperImageStore(function (s) { return s.isBrowserOpen; });
  var closeBrowser = useHyperImageStore(function (s) { return s.closeBrowser; });
  var isLayoutGalleryOpen = useHyperImageStore(function (s) { return s.isLayoutGalleryOpen; });
  var closeLayoutGallery = useHyperImageStore(function (s) { return s.closeLayoutGallery; });
  var imageUrl = props.useSampleData ? getSampleImageUrl() : props.imageUrl;

  /** Called when the visual editor "Apply" button is clicked */
  function handleEditorApply(_changes: IEditorChanges): void {
    // In a full integration the web part class would update its properties.
    // For now the editor stores changes locally; a future enhancement
    // will use a callback prop to persist changes back to the property bag.
  }

  /** Called when user selects an image from the SP browser */
  function handleBrowserSelect(selectedUrl: string): void {
    closeBrowser();
    if (props.onImageSelect) {
      props.onImageSelect(selectedUrl);
    }
  }

  /** Called when user selects a preset layout from the gallery */
  function handleLayoutSelect(preset: IPresetLayout): void {
    closeLayoutGallery();
    if (props.onLayoutSelect) {
      props.onLayoutSelect(preset);
    }
  }

  return React.createElement(
    React.Fragment,
    undefined,
    React.createElement(HyperImageInner, props),
    // Lightbox
    React.createElement(HyperModal, {
      isOpen: lightboxOpen,
      onClose: function () { closeLightbox(); },
      title: props.altText || "Image Preview",
      size: "fullscreen",
    },
      React.createElement("div", { className: styles.lightboxContent },
        React.createElement("img", {
          className: styles.lightboxImg,
          src: imageUrl,
          alt: props.altText || "Full size image",
        })
      )
    ),
    // Visual Editor
    React.createElement(HyperImageEditorModal, {
      imageUrl: imageUrl,
      shape: props.shape,
      customClipPath: props.customClipPath,
      filterPreset: props.filterPreset,
      filterConfigJson: props.filterConfigJson,
      hoverEffect: props.hoverEffect,
      textOverlayJson: props.textOverlayJson,
      borderConfigJson: props.borderConfigJson,
      shadowPreset: props.shadowPreset,
      entranceAnimation: props.entranceAnimation,
      objectFit: props.objectFit,
      aspectRatio: props.aspectRatio,
      onApply: handleEditorApply,
    }),
    // SharePoint Image Browser (right-docked panel)
    React.createElement(HyperImageBrowser, {
      isOpen: isBrowserOpen,
      onClose: function () { closeBrowser(); },
      onSelect: handleBrowserSelect,
      size: "large",
    } as IHyperImageBrowserProps),
    // Layout Gallery modal
    React.createElement(HyperImageLayoutGallery, {
      isOpen: isLayoutGalleryOpen,
      onClose: function () { closeLayoutGallery(); },
      onSelectLayout: handleLayoutSelect,
      currentLayout: props.imageLayout,
    })
  );
};

/** Root component with error boundary */
var HyperImage: React.FC<IHyperImageComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperImageWithLightbox, props)
  );
};

export default HyperImage;
