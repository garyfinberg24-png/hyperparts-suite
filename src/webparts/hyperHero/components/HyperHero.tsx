import * as React from "react";
import { useRef, useMemo } from "react";
import type {
  IHyperHeroWebPartProps,
  IHyperHeroSlide,
  IHyperHeroCta,
  IHyperHeroGridLayout,
  IHyperHeroResponsiveLayouts,
} from "../models";
import {
  DEFAULT_SLIDE,
  DEFAULT_GRADIENT,
  DEFAULT_HERO_FIELD_MAPPING,
} from "../models";
import type { Breakpoint } from "../../../common/models";
import { useResponsive } from "../../../common/hooks";
import { HyperErrorBoundary } from "../../../common/components";
import { HyperHeroSlide } from "./HyperHeroSlide";
import { HyperHeroTransitionWrapper } from "./HyperHeroTransitionWrapper";
import { HyperHeroSkeleton } from "./HyperHeroSkeleton";
import { useHeroDynamicContent } from "../hooks/useHeroDynamicContent";
import { useSlideVisibility } from "../hooks/useSlideVisibility";
import { hyperAnalytics } from "../../../common/services/HyperAnalytics";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import { HERO_WIZARD_CONFIG, buildStateFromProps } from "./wizard/heroWizardConfig";
import type { IHeroWizardResult } from "./wizard/heroWizardConfig";
import { HyperHeroSlideEditor } from "./editor";
import { HyperHeroEditOverlay, HyperHeroEditToolbar } from "./editor";
import { HyperHeroSliderManager } from "./editor/HyperHeroSliderManager";
import type { IStoredSliderConfig } from "../utils/sliderStorage";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroComponentProps extends IHyperHeroWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onSlidesChange?: (slides: IHyperHeroSlide[]) => void;
  onSettingsChange?: (partial: Partial<IHyperHeroWebPartProps>) => void;
}

/** Layout presets for the manual wizard mode */
interface ILayoutPresetConfig {
  slideCount: number;
  templateAreas: string;
  columnTemplate: string;
  rowTemplate: string;
}

function getLayoutPresetConfig(preset: string, slideCount: number): ILayoutPresetConfig {
  if (preset === "split") {
    return {
      slideCount: 2,
      templateAreas: "'slide1 slide2'",
      columnTemplate: "1fr 1fr",
      rowTemplate: "400px",
    };
  }
  if (preset === "thirds") {
    return {
      slideCount: 3,
      templateAreas: "'slide1 slide2 slide3'",
      columnTemplate: "1fr 1fr 1fr",
      rowTemplate: "400px",
    };
  }
  if (preset === "heroSidebar") {
    return {
      slideCount: 2,
      templateAreas: "'slide1 slide1 slide2'",
      columnTemplate: "1fr 1fr 1fr",
      rowTemplate: "400px",
    };
  }
  if (preset === "grid2x2") {
    return {
      slideCount: 4,
      templateAreas: "'slide1 slide2' 'slide3 slide4'",
      columnTemplate: "1fr 1fr",
      rowTemplate: "200px 200px",
    };
  }
  // "single" or fallback
  return {
    slideCount: slideCount || 1,
    templateAreas: "'main'",
    columnTemplate: "1fr",
    rowTemplate: "400px",
  };
}

function generateSlidesForPreset(count: number, preset: string): IHyperHeroSlide[] {
  const config = getLayoutPresetConfig(preset, count);
  const finalCount = config.slideCount;
  const slides: IHyperHeroSlide[] = [];
  const colors = ["#0078d4", "#107c10", "#d83b01", "#5c2d91", "#008272", "#ca5010"];

  for (let i = 0; i < finalCount; i++) {
    const gridArea = preset === "single" ? "main" : "slide" + (i + 1);
    slides.push({
      id: "slide-" + Date.now() + "-" + i,
      gridArea: gridArea,
      heading: "Slide " + (i + 1),
      subheading: "Click edit to customize",
      background: { type: "solidColor", backgroundColor: colors[i % colors.length] },
      gradientOverlay: DEFAULT_GRADIENT,
      ctas: [],
      audienceTarget: { enabled: false, groups: [], matchAll: false },
      textAlign: "left",
      verticalAlign: "bottom",
      sortOrder: i,
      enabled: true,
    });
  }
  return slides;
}

function generateLayoutsForPreset(preset: string, slideCount: number, heroHeight?: number): IHyperHeroResponsiveLayouts {
  const config = getLayoutPresetConfig(preset, slideCount);
  const baseHeight = heroHeight || 400;
  const rowTemplate = config.rowTemplate.replace(/400/g, String(baseHeight));

  const base: IHyperHeroGridLayout = {
    columns: 1,
    rows: 1,
    gap: 8,
    templateAreas: config.templateAreas,
    columnTemplate: config.columnTemplate,
    rowTemplate: rowTemplate,
    height: baseHeight,
  };

  // Mobile always stacks to single column
  const mobileHeight = Math.round(baseHeight / 2);
  const mobileAreas: string[] = [];
  for (let i = 0; i < config.slideCount; i++) {
    const area = preset === "single" ? "main" : "slide" + (i + 1);
    mobileAreas.push("'" + area + "'");
  }
  const mobile: IHyperHeroGridLayout = {
    columns: 1,
    rows: config.slideCount,
    gap: 8,
    templateAreas: mobileAreas.join(" "),
    columnTemplate: "1fr",
    rowTemplate: Array(config.slideCount).fill(mobileHeight + "px").join(" "),
    height: mobileHeight * config.slideCount,
  };

  const tabletHeight = Math.round(baseHeight * 0.875);
  const widescreenHeight = Math.round(baseHeight * 1.125);

  return {
    mobile: mobile,
    tablet: { ...base, height: tabletHeight, rowTemplate: rowTemplate.split(String(baseHeight)).join(String(tabletHeight)) },
    desktop: base,
    widescreen: { ...base, height: widescreenHeight, rowTemplate: rowTemplate.split(String(baseHeight)).join(String(widescreenHeight)) },
  };
}

const HyperHeroInner: React.FC<IHyperHeroComponentProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint: Breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  const {
    slides, layouts, rotation, contentBinding, borderRadius, fullBleed,
    title, instanceId, isEditMode, onSlidesChange, onSettingsChange,
    wizardCompleted,
  } = props;

  // ── Edit state ──
  const [showWizard, setShowWizard] = React.useState(false);
  const [editingSlideId, setEditingSlideId] = React.useState<string | undefined>(undefined);
  const [showSliderManager, setShowSliderManager] = React.useState(false);
  const [editorInitialView, setEditorInitialView] = React.useState<"editor" | "manager">("editor");

  // Auto-open wizard on first use in edit mode
  React.useEffect(function () {
    if (isEditMode && !wizardCompleted && slides && slides.length === 1) {
      const firstSlide = slides[0];
      if (firstSlide && firstSlide.id === "default-1") {
        setShowWizard(true);
      }
    }
  }, [isEditMode, wizardCompleted, slides]);

  // ── Wizard callbacks ──
  const handleWizardClose = React.useCallback(function () {
    setShowWizard(false);
  }, []);

  const handleWizardApply = React.useCallback(function (result: IHeroWizardResult) {
    if (!onSettingsChange || !onSlidesChange) return;

    // Build general settings partial from wizard
    const generalPartial: Partial<IHyperHeroWebPartProps> = {
      wizardCompleted: true,
      sliderMode: result.sliderMode || "hyper",
      aspectRatio: result.aspectRatio || "16:9",
    };

    if (result.generalSettings) {
      const gs = result.generalSettings;
      generalPartial.title = gs.title;
      generalPartial.heroHeight = gs.heroHeight;
      generalPartial.borderRadius = gs.borderRadius;
      generalPartial.fullBleed = gs.fullBleed;
      generalPartial.rotation = {
        enabled: gs.rotationEnabled,
        intervalMs: gs.rotationInterval,
        effect: gs.rotationEffect,
        transitionDurationMs: 500,
        pauseOnHover: gs.pauseOnHover,
        showDots: gs.showDots,
        showArrows: gs.showArrows,
      };
    }

    if (result.mode === "list" && result.listName) {
      // SP List mode: enable content binding
      onSettingsChange({
        ...generalPartial,
        contentBinding: {
          enabled: true,
          listName: result.listName,
          fieldMapping: result.fieldMapping || DEFAULT_HERO_FIELD_MAPPING,
          ascending: true,
          maxItems: 10,
          cacheTTL: 300000,
        },
      });
    } else if (result.mode === "manual") {
      // Manual mode: generate slides + layouts (use template slides if provided)
      const preset = result.layoutPreset || "single";
      const count = result.slideCount || 1;
      const height = result.generalSettings ? result.generalSettings.heroHeight : 400;
      const newSlides = result.templateSlides || generateSlidesForPreset(count, preset);
      const newLayouts = generateLayoutsForPreset(preset, count, height);

      onSlidesChange(newSlides);
      onSettingsChange({
        ...generalPartial,
        layouts: newLayouts,
      });
    }

    setShowWizard(false);
  }, [onSettingsChange, onSlidesChange]);

  // ── Slide editor callbacks ──
  const editingSlide = useMemo(function (): IHyperHeroSlide | undefined {
    if (!editingSlideId || !slides) return undefined;
    let found: IHyperHeroSlide | undefined = undefined;
    slides.forEach(function (t) {
      if (t.id === editingSlideId) found = t;
    });
    return found;
  }, [editingSlideId, slides]);

  const handleEditSlide = React.useCallback(function (slideId: string) {
    setEditorInitialView("editor");
    setEditingSlideId(slideId);
  }, []);

  const handleEditorClose = React.useCallback(function () {
    setEditingSlideId(undefined);
  }, []);

  const handleEditorSave = React.useCallback(function (updatedSlide: IHyperHeroSlide) {
    if (!onSlidesChange || !slides) return;
    const updated: IHyperHeroSlide[] = [];
    slides.forEach(function (t) {
      if (t.id === updatedSlide.id) {
        updated.push(updatedSlide);
      } else {
        updated.push(t);
      }
    });
    onSlidesChange(updated);
    setEditingSlideId(undefined);
  }, [slides, onSlidesChange]);

  const handleDeleteSlide = React.useCallback(function (slideId: string) {
    if (!onSlidesChange || !slides) return;
    const remaining = slides.filter(function (t) { return t.id !== slideId; });
    if (remaining.length === 0) {
      // Don't allow deleting the last slide — reset to default
      onSlidesChange([DEFAULT_SLIDE]);
    } else {
      onSlidesChange(remaining);
    }
  }, [slides, onSlidesChange]);

  const handleAddSlide = React.useCallback(function () {
    if (!onSlidesChange || !slides) return;
    const newSlide: IHyperHeroSlide = {
      id: "slide-" + Date.now(),
      gridArea: "main",
      heading: "New Slide",
      subheading: "Click edit to customize",
      background: { type: "solidColor", backgroundColor: "#0078d4" },
      gradientOverlay: DEFAULT_GRADIENT,
      ctas: [],
      audienceTarget: { enabled: false, groups: [], matchAll: false },
      textAlign: "left",
      verticalAlign: "bottom",
      sortOrder: slides.length,
      enabled: true,
    };
    onSlidesChange(slides.concat([newSlide]));
    setEditingSlideId(newSlide.id);
  }, [slides, onSlidesChange]);

  const handleDuplicateSlide = React.useCallback(function (slideId?: string) {
    if (!onSlidesChange || !slides || slides.length === 0) return;
    // Find the slide to duplicate (specific id or last slide)
    var source: IHyperHeroSlide | undefined = undefined;
    if (slideId) {
      slides.forEach(function (s) { if (s.id === slideId) source = s; });
    }
    if (!source) {
      source = slides[slides.length - 1];
    }
    if (!source) return;
    var cloned: IHyperHeroSlide = {
      ...source,
      id: "slide-" + Date.now(),
      heading: (source.heading || "Slide") + " (copy)",
      sortOrder: slides.length,
    };
    onSlidesChange(slides.concat([cloned]));
    setEditingSlideId(cloned.id);
  }, [slides, onSlidesChange]);

  // Save & Continue: save current slide, advance to next
  const handleEditorSaveAndContinue = React.useCallback(function (updatedSlide: IHyperHeroSlide) {
    if (!onSlidesChange || !slides) return;
    var updated: IHyperHeroSlide[] = [];
    var currentIdx = 0;
    slides.forEach(function (t, i) {
      if (t.id === updatedSlide.id) {
        updated.push(updatedSlide);
        currentIdx = i;
      } else {
        updated.push(t);
      }
    });
    onSlidesChange(updated);
    // Advance to next slide if possible
    if (currentIdx < slides.length - 1) {
      setEditingSlideId(slides[currentIdx + 1].id);
    }
  }, [slides, onSlidesChange]);

  const handleRerunSetup = React.useCallback(function () {
    if (onSettingsChange) {
      onSettingsChange({ wizardCompleted: false });
    }
    setShowWizard(true);
  }, [onSettingsChange]);

  // ── Slides Manager (opens editor in manager view) + Slider Manager ──
  const handleOpenSlidesManager = React.useCallback(function () {
    setEditorInitialView("manager");
    // Open editor modal — use first slide as fallback
    if (slides && slides.length > 0) {
      setEditingSlideId(slides[0].id);
    }
  }, [slides]);

  const handleOpenSliderManager = React.useCallback(function () {
    setShowSliderManager(true);
  }, []);

  const handleCloseSliderManager = React.useCallback(function () {
    setShowSliderManager(false);
  }, []);

  const handleLoadSliderConfig = React.useCallback(function (config: IStoredSliderConfig) {
    if (!onSlidesChange || !onSettingsChange) return;
    if (config.slides) {
      onSlidesChange(config.slides);
    }
    var partial: Partial<IHyperHeroWebPartProps> = {};
    if (config.layouts) partial.layouts = config.layouts;
    if (config.heroHeight !== undefined) partial.heroHeight = config.heroHeight;
    if (config.borderRadius !== undefined) partial.borderRadius = config.borderRadius;
    if (config.fullBleed !== undefined) partial.fullBleed = config.fullBleed;
    if (config.rotation) partial.rotation = config.rotation;
    onSettingsChange(partial);
  }, [onSlidesChange, onSettingsChange]);

  // Select layout for current breakpoint
  const layout: IHyperHeroGridLayout = layouts[breakpoint] || layouts.desktop;

  // Dynamic content binding — fetch slides from SharePoint list when enabled
  const dynamicResult = useHeroDynamicContent(contentBinding);
  const dynamicSlides = dynamicResult.dynamicSlides;
  const dynamicLoading = dynamicResult.loading;

  // Merge static + dynamic slides: dynamic slides come after static ones
  const allSlides = useMemo(function (): IHyperHeroSlide[] {
    const staticSlides = slides || [];
    if (contentBinding && contentBinding.enabled && dynamicSlides.length > 0) {
      return staticSlides.concat(dynamicSlides);
    }
    return staticSlides;
  }, [slides, contentBinding, dynamicSlides]);

  // Apply scheduling filter (publish/unpublish dates)
  const scheduledSlides = useSlideVisibility(allSlides);

  // CTA click tracking
  const handleCtaClick = React.useCallback(function (cta: IHyperHeroCta): void {
    hyperAnalytics.trackInteraction(instanceId, "ctaClick", cta.label);
  }, [instanceId]);

  // ── Edit mode modals (rendered regardless of loading state) ──
  const editModals: React.ReactElement[] = [];

  if (isEditMode) {
    // Setup Wizard modal (shared HyperWizard with hero config)
    editModals.push(
      React.createElement(HyperWizard, {
        key: "wizard",
        config: HERO_WIZARD_CONFIG,
        isOpen: showWizard,
        onClose: handleWizardClose,
        onApply: handleWizardApply,
        initialStateOverride: buildStateFromProps(props),
      })
    );

    // Compute editing slide index
    var editingSlideIndex = 0;
    if (editingSlideId && slides) {
      slides.forEach(function (s, i) {
        if (s.id === editingSlideId) editingSlideIndex = i;
      });
    }

    // Slide Editor modal (with embedded Slides Manager toggle)
    editModals.push(
      React.createElement(HyperHeroSlideEditor, {
        key: "editor",
        isOpen: editingSlideId !== undefined,
        slide: editingSlide,
        sliderMode: props.sliderMode || "hyper",
        slideIndex: editingSlideIndex,
        slideCount: slides ? slides.length : 0,
        onSave: handleEditorSave,
        onClose: handleEditorClose,
        onAddSlide: handleAddSlide,
        onSaveAndContinue: handleEditorSaveAndContinue,
        // Slides Manager props (embedded toggle view)
        initialViewMode: editorInitialView,
        allSlides: slides || [],
        onEditSlide: function (slideId: string) {
          setEditorInitialView("editor");
          setEditingSlideId(slideId);
        },
        onSlidesChange: onSlidesChange || function () { /* no-op */ },
        onDuplicateSlide: handleDuplicateSlide,
        onDeleteSlide: handleDeleteSlide,
        onOpenSliderLibrary: handleOpenSliderManager,
      })
    );

    // Slider Library modal
    editModals.push(
      React.createElement(HyperHeroSliderManager, {
        key: "slider-manager",
        isOpen: showSliderManager,
        onClose: handleCloseSliderManager,
        onLoad: handleLoadSliderConfig,
        currentSlides: slides || [],
        currentLayouts: layouts,
        currentSettings: {
          heroHeight: props.heroHeight,
          borderRadius: borderRadius,
          fullBleed: fullBleed,
          rotation: rotation,
          sliderMode: props.sliderMode,
        },
      })
    );
  }

  // Show skeleton while dynamic content is loading
  if (contentBinding && contentBinding.enabled && dynamicLoading) {
    return React.createElement(
      "div",
      { ref: containerRef, className: styles.heroContainer },
      React.createElement(HyperHeroSkeleton, { height: layout.height }),
      editModals
    );
  }

  // No slides configured or all filtered out
  if (scheduledSlides.length === 0) {
    return React.createElement(
      "div",
      { ref: containerRef, className: styles.heroContainer },
      React.createElement(HyperHeroSkeleton, { height: layout.height }),
      editModals
    );
  }

  // Grid inline styles from layout config
  const gridStyle: React.CSSProperties = {
    gridTemplateAreas: layout.templateAreas,
    gridTemplateColumns: layout.columnTemplate,
    gridTemplateRows: layout.rowTemplate,
    gap: layout.gap + "px",
    minHeight: layout.height + "px",
    borderRadius: borderRadius > 0 ? borderRadius + "px" : undefined,
  };

  const containerClasses = [
    styles.heroContainer,
    fullBleed ? styles.heroFullBleed : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Use transition wrapper when rotation is enabled and there are multiple slides
  const useRotation = rotation && rotation.enabled && scheduledSlides.length > 1;

  // Build slide elements — wrap with edit overlay in edit mode
  const buildSlideElements = function (): React.ReactElement[] {
    return scheduledSlides.map(function (slide, idx) {
      const slideEl = React.createElement(HyperHeroSlide, {
        key: slide.id,
        slide: slide,
        onCtaClick: handleCtaClick,
      });

      if (isEditMode) {
        return React.createElement(
          "div",
          { key: slide.id, style: { position: "relative", gridArea: slide.gridArea } },
          slideEl,
          React.createElement(HyperHeroEditOverlay, {
            slideId: slide.id,
            slideHeading: slide.heading || "Untitled",
            slideIndex: idx,
            slideCount: scheduledSlides.length,
            onEdit: handleEditSlide,
            onDelete: handleDeleteSlide,
          })
        );
      }

      return slideEl;
    });
  };

  const gridContent = useRotation && !isEditMode
    ? React.createElement(HyperHeroTransitionWrapper, {
        slides: scheduledSlides,
        rotation: rotation,
        gridStyle: gridStyle,
        onCtaClick: handleCtaClick,
      })
    : React.createElement(
        "div",
        { className: styles.heroGrid, style: gridStyle, role: "region", "aria-label": title || "Hero banner" },
        buildSlideElements()
      );

  return React.createElement(
    "div",
    { ref: containerRef, className: containerClasses },
    // Title
    title
      ? React.createElement("h2", { className: styles.heroTitle }, title)
      : undefined,
    // Grid content
    gridContent,
    // Edit action buttons — centered on the hero (edit mode only)
    isEditMode
      ? React.createElement(HyperHeroEditToolbar, {
          onOpenWizard: handleRerunSetup,
          onEditSlider: handleOpenSlidesManager,
          slideCount: scheduledSlides.length,
        })
      : undefined,
    // Edit mode modals
    editModals
  );
};

const HyperHero: React.FC<IHyperHeroComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperHeroInner, props)
  );
};

export default HyperHero;
