// ─── HyperSlider Main Orchestrator ─────────────────────────────────────────────
import * as React from "react";
import * as strings from "HyperSliderWebPartStrings";
import styles from "./HyperSlider.module.scss";
import type {
  IHyperSliderWebPartProps,
  ISliderSlide,
  ISliderNavigation,
  ISliderParticle,
  ISliderBeforeAfter,
  BreakpointKey,
} from "../models";
import {
  DEFAULT_AUTOPLAY,
  DEFAULT_TRANSITION_CONFIG,
} from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { useResponsive } from "../../../common/hooks";
import { useSliderEngine } from "../hooks/useSliderEngine";
import { useSliderNavigation } from "../hooks/useSliderNavigation";
import { useSliderPreload } from "../hooks/useSliderPreload";
import { useSliderParticles } from "../hooks/useSliderParticles";
import { useSliderDynamicContent } from "../hooks/useSliderDynamicContent";
import { useHyperSliderStore } from "../store/useHyperSliderStore";
import {
  parseSlides,
  parseNavigation,
  parseParticle,
  parseBeforeAfter,
} from "../utils/sliderUtils";
import { get3DPerspectiveStyle, is3DTransition } from "../utils/transitionUtils";
import HyperSliderSlide from "./HyperSliderSlide";
import SliderArrows from "./navigation/SliderArrows";
import SliderBullets from "./navigation/SliderBullets";
import SliderProgress from "./navigation/SliderProgress";
import SliderCount from "./navigation/SliderCount";
import SliderThumbnails from "./navigation/SliderThumbnails";
import ParticleOverlay from "./effects/ParticleOverlay";
import SnowOverlay from "./effects/SnowOverlay";
import BeforeAfterSlider from "./effects/BeforeAfterSlider";
import HyperSliderEditOverlay from "./HyperSliderEditOverlay";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface IHyperSliderComponentProps extends IHyperSliderWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onSlidesChange?: (json: string) => void;
  onNavigationChange?: (json: string) => void;
}

// ─── Merge style helper (replaces Object.assign for ES5) ─────────────────────

function mergeStyles(a: React.CSSProperties, b: React.CSSProperties): React.CSSProperties {
  const result: React.CSSProperties = {};
  const keysA = Object.keys(a);
  keysA.forEach(function (k) { (result as Record<string, unknown>)[k] = (a as Record<string, unknown>)[k]; });
  const keysB = Object.keys(b);
  keysB.forEach(function (k) { (result as Record<string, unknown>)[k] = (b as Record<string, unknown>)[k]; });
  return result;
}

// ─── Count total layers across slides ────────────────────────────────────────

function countTotalLayers(allSlides: ISliderSlide[]): number {
  let total = 0;
  allSlides.forEach(function (slide) {
    total += slide.layers.length;
  });
  return total;
}

// ─── Height Calculation ──────────────────────────────────────────────────────

function computeSliderHeight(
  props: IHyperSliderComponentProps,
  breakpoint: BreakpointKey
): React.CSSProperties {
  const { heightMode, fixedHeight, aspectRatio, customRatioWidth, customRatioHeight, mobileHeight, tabletHeight } = props;

  // Responsive height overrides
  if (breakpoint === "mobile" && mobileHeight && mobileHeight > 0) {
    return { height: mobileHeight + "px" };
  }
  if (breakpoint === "tablet" && tabletHeight && tabletHeight > 0) {
    return { height: tabletHeight + "px" };
  }

  if (heightMode === "fullscreen") {
    return { height: "100vh" };
  }

  if (heightMode === "ratio") {
    let ratioW = 16;
    let ratioH = 9;

    if (aspectRatio === "4:3") { ratioW = 4; ratioH = 3; }
    else if (aspectRatio === "21:9") { ratioW = 21; ratioH = 9; }
    else if (aspectRatio === "1:1") { ratioW = 1; ratioH = 1; }
    else if (aspectRatio === "custom" && customRatioWidth && customRatioHeight) {
      ratioW = customRatioWidth;
      ratioH = customRatioHeight;
    }

    return {
      width: "100%",
      paddingBottom: String((ratioH / ratioW) * 100) + "%",
      height: "0",
      position: "relative" as React.CSSProperties["position"],
    };
  }

  if (heightMode === "auto") {
    return { minHeight: "200px" };
  }

  // Default: fixed
  return { height: (fixedHeight || 500) + "px" };
}

// ─── Inner Component ─────────────────────────────────────────────────────────

const HyperSliderInner: React.FC<IHyperSliderComponentProps> = function (props) {
  const {
    isEditMode,
    mode,
    fullBleed,
    borderRadius,
    transition: transitionConfig,
    autoplay: autoplayConfig,
    contentBinding,
    lazyLoad,
    preloadCount,
    enableSnow,
  } = props;

  // ─── Parse JSON props ───
  const staticSlides = React.useMemo(function (): ISliderSlide[] {
    return parseSlides(props.slides);
  }, [props.slides]);

  const navigation = React.useMemo(function (): ISliderNavigation {
    return parseNavigation(props.navigation);
  }, [props.navigation]);

  const particleConfig = React.useMemo(function (): ISliderParticle {
    return parseParticle(props.particle);
  }, [props.particle]);

  const beforeAfterConfig = React.useMemo(function (): ISliderBeforeAfter {
    return parseBeforeAfter(props.beforeAfter);
  }, [props.beforeAfter]);

  // ─── Container ref + responsive ───
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = React.useRef<HTMLDivElement>(null);
  const breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  // Sync breakpoint to store
  const setBreakpoint = useHyperSliderStore(function (state) { return state.setBreakpoint; });
  const setSlideCount = useHyperSliderStore(function (state) { return state.setSlideCount; });
  const currentSlideIndex = useHyperSliderStore(function (state) { return state.currentSlideIndex; });
  const transitionDirection = useHyperSliderStore(function (state) { return state.transitionDirection; });

  React.useEffect(function () {
    setBreakpoint(breakpoint as BreakpointKey);
  }, [breakpoint, setBreakpoint]);

  // ─── Dynamic content ───
  const resolvedTransition = transitionConfig || DEFAULT_TRANSITION_CONFIG;
  const resolvedAutoplay = autoplayConfig || DEFAULT_AUTOPLAY;
  const resolvedContentBinding = contentBinding || { enabled: false, listName: "", fieldMapping: { headingField: "Title", descriptionField: "", imageUrlField: "", linkUrlField: "", publishDateField: "", unpublishDateField: "", sortOrderField: "" }, filter: "", orderBy: "", ascending: true, maxItems: 10, cacheTTL: 300000 };

  const dynamicContentResult = useSliderDynamicContent({
    contentBinding: resolvedContentBinding,
    staticSlides: staticSlides,
  });

  const slides = dynamicContentResult.slides;
  const isLoading = dynamicContentResult.loading;

  // Filter enabled slides
  const enabledSlides = React.useMemo(function (): ISliderSlide[] {
    return slides.filter(function (slide) { return slide.enabled !== false; });
  }, [slides]);

  // Sync slide count to store
  React.useEffect(function () {
    setSlideCount(enabledSlides.length);
  }, [enabledSlides.length, setSlideCount]);

  // ─── Hooks ───
  const engineResult = useSliderEngine({
    slides: enabledSlides,
    autoplay: resolvedAutoplay,
    transition: resolvedTransition,
  });

  const navResult = useSliderNavigation({
    slideCount: enabledSlides.length,
    swipe: navigation.swipe,
    keyboard: navigation.keyboard,
  });

  useSliderPreload({
    slides: enabledSlides,
    preloadCount: preloadCount || 2,
    enabled: lazyLoad !== false,
  });

  const particlesResult = useSliderParticles({
    config: particleConfig,
  });

  // ─── Loading state ───
  if (isLoading) {
    return React.createElement(HyperSkeleton, {
      count: 1,
      height: props.fixedHeight || 500,
    });
  }

  // ─── Empty state ───
  if (enabledSlides.length === 0 && mode !== "beforeAfter") {
    return React.createElement(HyperEmptyState, {
      iconName: "Slideshow",
      title: strings.NoSlidesTitle,
      description: strings.NoSlidesDescription,
    });
  }

  // ─── Height styles ───
  const heightStyle = computeSliderHeight(props, breakpoint as BreakpointKey);

  // ─── Container classes ───
  const containerClasses: string[] = [styles.hyperSlider];
  if (fullBleed) {
    containerClasses.push(styles.fullBleed);
  }

  // ─── Inline styles ───
  const containerStyle: React.CSSProperties = {};
  if (borderRadius && borderRadius > 0) {
    containerStyle.borderRadius = borderRadius + "px";
    containerStyle.overflow = "hidden";
  }

  // ─── Edit overlay element ───
  const editOverlay = isEditMode
    ? React.createElement(HyperSliderEditOverlay, {
        slideCount: enabledSlides.length,
        layerCount: countTotalLayers(enabledSlides),
      })
    : undefined;

  // ─── Before/After mode ───
  if (mode === "beforeAfter" && beforeAfterConfig.enabled) {
    return React.createElement(
      "div",
      {
        ref: containerRef,
        className: containerClasses.join(" "),
        style: mergeStyles(containerStyle, heightStyle),
        role: "region",
        "aria-label": strings.DragToCompareLabel,
      },
      React.createElement(BeforeAfterSlider, {
        config: beforeAfterConfig,
      }),
      editOverlay
    );
  }

  // ─── Hero mode: only first slide, no navigation ───
  if (mode === "hero") {
    const heroSlide = enabledSlides.length > 0 ? enabledSlides[0] : undefined;
    const heroHeightMode = props.heightMode || "fixed";

    return React.createElement(
      "div",
      {
        ref: containerRef,
        className: containerClasses.join(" "),
        style: mergeStyles(containerStyle, heightStyle),
        role: "region",
        "aria-label": props.title || strings.SliderCarouselLabel,
      },
      // Particle overlay
      particleConfig.enabled ? React.createElement(ParticleOverlay, {
        particles: particlesResult.particles,
        direction: particleConfig.direction,
        shape: particleConfig.shape,
      }) : undefined,
      // Snow overlay
      enableSnow ? React.createElement(SnowOverlay, undefined) : undefined,
      // Viewport with single slide
      heroSlide ? React.createElement(
        "div",
        {
          className: styles.slidesViewport,
          style: heroHeightMode === "ratio" ? { position: "absolute" as React.CSSProperties["position"], top: 0, left: 0, right: 0, bottom: 0 } : heightStyle,
        },
        React.createElement(HyperSliderSlide, {
          slide: heroSlide,
          isActive: true,
          transitionType: resolvedTransition.type,
          transitionDirection: "forward",
          transitionDuration: resolvedTransition.duration,
          transitionEasing: resolvedTransition.easing,
        })
      ) : undefined,
      // Edit overlay
      editOverlay
    );
  }

  // ─── Carousel mode ───
  if (mode === "carousel") {
    const carouselSlideElements: React.ReactNode[] = [];
    enabledSlides.forEach(function (slide, index) {
      carouselSlideElements.push(
        React.createElement(
          "div",
          {
            key: slide.id,
            className: styles.carouselSlide,
          },
          React.createElement(HyperSliderSlide, {
            slide: slide,
            isActive: index === currentSlideIndex,
            transitionType: "none",
            transitionDirection: "forward",
            transitionDuration: 0,
            transitionEasing: "ease",
          })
        )
      );
    });

    const carouselContainerProps: Record<string, unknown> = {
      ref: containerRef,
      className: containerClasses.join(" "),
      style: mergeStyles(containerStyle, heightStyle),
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": props.title || strings.SliderCarouselLabel,
      tabIndex: 0,
      onMouseEnter: engineResult.containerProps.onMouseEnter,
      onMouseLeave: engineResult.containerProps.onMouseLeave,
      onFocus: engineResult.containerProps.onFocus,
      onBlur: engineResult.containerProps.onBlur,
      onTouchStart: navResult.touchHandlers.onTouchStart,
      onTouchMove: navResult.touchHandlers.onTouchMove,
      onTouchEnd: navResult.touchHandlers.onTouchEnd,
      onMouseDown: navResult.touchHandlers.onMouseDown,
    };

    return React.createElement(
      "div",
      carouselContainerProps,
      // Particle overlay
      particleConfig.enabled ? React.createElement(ParticleOverlay, {
        particles: particlesResult.particles,
        direction: particleConfig.direction,
        shape: particleConfig.shape,
      }) : undefined,
      // Snow overlay
      enableSnow ? React.createElement(SnowOverlay, undefined) : undefined,
      // Carousel viewport
      React.createElement(
        "div",
        {
          ref: navResult.navContainerRef,
          className: styles.carouselViewport,
          style: heightStyle,
        },
        carouselSlideElements
      ),
      // Navigation: arrows
      navigation.arrows.enabled ? React.createElement(SliderArrows, {
        config: navigation.arrows,
        slideCount: enabledSlides.length,
      }) : undefined,
      // Navigation: bullets
      navigation.bullets.enabled ? React.createElement(SliderBullets, {
        config: navigation.bullets,
        slideCount: enabledSlides.length,
      }) : undefined,
      // Edit overlay
      editOverlay
    );
  }

  // ─── Standard slider mode (default) ───
  const is3D = is3DTransition(resolvedTransition.type);
  const perspectiveStyle = is3D ? get3DPerspectiveStyle(resolvedTransition.type) : {};

  // Build slide elements
  const slideElements: React.ReactNode[] = [];
  enabledSlides.forEach(function (slide, index) {
    slideElements.push(
      React.createElement(HyperSliderSlide, {
        key: slide.id,
        slide: slide,
        isActive: index === currentSlideIndex,
        transitionType: slide.transition ? slide.transition.type : resolvedTransition.type,
        transitionDirection: transitionDirection,
        transitionDuration: slide.transition ? slide.transition.duration : resolvedTransition.duration,
        transitionEasing: slide.transition ? slide.transition.easing : resolvedTransition.easing,
      })
    );
  });

  // Viewport inner style
  const viewportBaseStyle = props.heightMode === "ratio"
    ? { position: "absolute" as React.CSSProperties["position"], top: 0, left: 0, right: 0, bottom: 0 }
    : heightStyle;
  const viewportStyle = mergeStyles(perspectiveStyle, viewportBaseStyle);

  const sliderContainerProps: Record<string, unknown> = {
    ref: containerRef,
    className: containerClasses.join(" "),
    style: mergeStyles(containerStyle, heightStyle),
    role: "region",
    "aria-roledescription": "carousel",
    "aria-label": props.title || strings.SliderCarouselLabel,
    tabIndex: 0,
    onMouseEnter: engineResult.containerProps.onMouseEnter,
    onMouseLeave: engineResult.containerProps.onMouseLeave,
    onFocus: engineResult.containerProps.onFocus,
    onBlur: engineResult.containerProps.onBlur,
    onTouchStart: navResult.touchHandlers.onTouchStart,
    onTouchMove: navResult.touchHandlers.onTouchMove,
    onTouchEnd: navResult.touchHandlers.onTouchEnd,
    onMouseDown: navResult.touchHandlers.onMouseDown,
  };

  return React.createElement(
    "div",
    sliderContainerProps,
    // Particle overlay
    particleConfig.enabled ? React.createElement(ParticleOverlay, {
      particles: particlesResult.particles,
      direction: particleConfig.direction,
      shape: particleConfig.shape,
    }) : undefined,
    // Snow overlay
    enableSnow ? React.createElement(SnowOverlay, undefined) : undefined,
    // Slides viewport
    React.createElement(
      "div",
      {
        ref: navResult.navContainerRef,
        className: styles.slidesViewport,
        style: viewportStyle,
      },
      slideElements
    ),
    // Navigation: arrows
    navigation.arrows.enabled && enabledSlides.length > 1
      ? React.createElement(SliderArrows, {
        config: navigation.arrows,
        slideCount: enabledSlides.length,
      })
      : undefined,
    // Navigation: bullets
    navigation.bullets.enabled && enabledSlides.length > 1
      ? React.createElement(SliderBullets, {
        config: navigation.bullets,
        slideCount: enabledSlides.length,
      })
      : undefined,
    // Navigation: thumbnails
    navigation.thumbnails.enabled && enabledSlides.length > 1
      ? React.createElement(SliderThumbnails, {
        config: navigation.thumbnails,
        slides: enabledSlides,
      })
      : undefined,
    // Navigation: progress bar
    navigation.progress.enabled && enabledSlides.length > 1
      ? React.createElement(SliderProgress, {
        config: navigation.progress,
        slideDuration: resolvedAutoplay.interval,
      })
      : undefined,
    // Navigation: slide count
    navigation.slideCount.enabled && enabledSlides.length > 1
      ? React.createElement(SliderCount, {
        config: navigation.slideCount,
        slideCount: enabledSlides.length,
      })
      : undefined,
    // Edit overlay
    editOverlay
  );
};

// ─── Wrapped with ErrorBoundary ──────────────────────────────────────────────

const HyperSlider: React.FC<IHyperSliderComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperSliderInner, props)
  );
};

export default HyperSlider;
