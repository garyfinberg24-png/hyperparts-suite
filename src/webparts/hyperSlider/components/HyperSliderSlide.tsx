// ─── HyperSlider Slide Renderer ────────────────────────────────────────────────
import * as React from "react";
import styles from "./HyperSliderSlide.module.scss";
import type {
  ISliderSlide,
  ISliderLayer,
  TransitionType,
  TransitionDirection,
  EasingType,
  ISliderGradient,
} from "../models";
import { EASING_CSS_MAP } from "../models";
import HyperSliderLayer from "./HyperSliderLayer";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface IHyperSliderSlideProps {
  slide: ISliderSlide;
  isActive: boolean;
  transitionType: TransitionType;
  transitionDirection: TransitionDirection;
  transitionDuration: number;
  transitionEasing: EasingType;
}

// ─── Gradient Builder ────────────────────────────────────────────────────────

function buildGradientCss(gradient: ISliderGradient): string {
  const stopStrings: string[] = [];
  gradient.stops.forEach(function (stop) {
    const r = parseInt(stop.color.substring(1, 3), 16) || 0;
    const g = parseInt(stop.color.substring(3, 5), 16) || 0;
    const b = parseInt(stop.color.substring(5, 7), 16) || 0;
    stopStrings.push(
      "rgba(" + r + "," + g + "," + b + "," + stop.opacity + ") " + stop.position + "%"
    );
  });

  if (gradient.type === "radial") {
    return "radial-gradient(circle, " + stopStrings.join(", ") + ")";
  }
  if (gradient.type === "conic") {
    return "conic-gradient(from " + (gradient.angle || "0deg") + ", " + stopStrings.join(", ") + ")";
  }

  // Default: linear
  return "linear-gradient(" + (gradient.angle || "180deg") + ", " + stopStrings.join(", ") + ")";
}

// ─── Transition Class Resolver ───────────────────────────────────────────────

function getTransitionClasses(
  isActive: boolean,
  transitionType: TransitionType,
  direction: TransitionDirection
): string[] {
  const classes: string[] = [];
  const s = styles as Record<string, string>;

  if (transitionType === "fade" || transitionType === "crossFade") {
    classes.push(s.transitionFade || "");
    if (isActive) {
      classes.push(s.fadeActive || "");
    } else {
      classes.push(s.fadeExit || "");
    }
  } else if (transitionType === "slideHorizontal") {
    classes.push(s.transitionSlideH || "");
    if (isActive) {
      classes.push(s.slideHActive || "");
    } else {
      if (direction === "forward") {
        classes.push(s.slideHExitForward || "");
      } else {
        classes.push(s.slideHExitReverse || "");
      }
    }
  } else if (transitionType === "slideVertical") {
    classes.push(s.transitionSlideV || "");
    if (isActive) {
      classes.push(s.slideVActive || "");
    } else {
      if (direction === "forward") {
        classes.push(s.slideVExitForward || "");
      } else {
        classes.push(s.slideVExitReverse || "");
      }
    }
  } else if (transitionType === "zoom") {
    classes.push(s.transitionZoom || "");
    if (isActive) {
      classes.push(s.zoomActive || "");
    } else {
      classes.push(s.zoomExit || "");
    }
  } else if (transitionType === "cube3D") {
    classes.push(s.transitionCube3D || "");
  } else if (transitionType === "flip3D") {
    classes.push(s.transitionFlip3D || "");
  }

  return classes.filter(function (c) { return c.length > 0; });
}

// ─── Component ───────────────────────────────────────────────────────────────

const HyperSliderSlide: React.FC<IHyperSliderSlideProps> = function (props) {
  const { slide, isActive, transitionType, transitionDirection, transitionDuration, transitionEasing } = props;

  // ─── CSS custom properties for transition timing ───
  const easingValue = EASING_CSS_MAP[transitionEasing] || EASING_CSS_MAP.ease;
  const customProperties: Record<string, string> = {
    "--slide-transition-duration": transitionDuration + "ms",
    "--slide-transition-easing": easingValue,
  };

  // ─── Ken Burns custom properties ───
  if (slide.kenBurns && slide.kenBurns.enabled) {
    customProperties["--kb-start-scale"] = String(slide.kenBurns.startScale);
    customProperties["--kb-end-scale"] = String(slide.kenBurns.endScale);
    customProperties["--kb-start-x"] = slide.kenBurns.startX + "%";
    customProperties["--kb-start-y"] = slide.kenBurns.startY + "%";
    customProperties["--kb-end-x"] = slide.kenBurns.endX + "%";
    customProperties["--kb-end-y"] = slide.kenBurns.endY + "%";
  }

  // ─── Build slide classes ───
  const slideClasses: string[] = [styles.slide];
  if (isActive) {
    slideClasses.push(styles.slideActive);
  } else {
    slideClasses.push(styles.slideInactive);
  }

  // Add transition classes
  const transitionClasses = getTransitionClasses(isActive, transitionType, transitionDirection);
  transitionClasses.forEach(function (cls) {
    slideClasses.push(cls);
  });

  // ─── Build background element ───
  const backgroundChildren: React.ReactNode[] = [];
  const bg = slide.background;

  if (bg.type === "image" && bg.imageUrl) {
    // Ken Burns classes
    const imgClasses: string[] = [styles.backgroundImage];
    if (slide.kenBurns && slide.kenBurns.enabled && isActive) {
      imgClasses.push(styles.kenBurns);
    }

    const imgStyle: React.CSSProperties = {
      objectPosition: bg.focalPoint
        ? bg.focalPoint.x + "% " + bg.focalPoint.y + "%"
        : "50% 50%",
    };

    if (slide.kenBurns && slide.kenBurns.enabled) {
      imgStyle.animationDuration = (slide.duration || 5000) + "ms";
    }

    backgroundChildren.push(
      React.createElement("img", {
        key: "bg-img",
        className: imgClasses.join(" "),
        src: bg.imageUrl,
        alt: bg.imageAlt || "",
        style: imgStyle,
        loading: "lazy",
        draggable: false,
      })
    );
  } else if (bg.type === "video" && bg.video) {
    const videoProps: Record<string, unknown> = {
      key: "bg-video",
      className: styles.backgroundImage,
      style: { objectFit: "cover" as React.CSSProperties["objectFit"] },
      autoPlay: bg.video.autoplay !== false,
      loop: bg.video.loop !== false,
      muted: bg.video.muted !== false,
      playsInline: true,
    };

    if (bg.video.posterUrl) {
      videoProps.poster = bg.video.posterUrl;
    }

    if (bg.video.source === "mp4") {
      backgroundChildren.push(
        React.createElement("video", videoProps,
          React.createElement("source", { src: bg.video.url, type: "video/mp4" })
        )
      );
    } else if (bg.video.source === "youtube" || bg.video.source === "vimeo") {
      // Embed via iframe
      let embedUrl = bg.video.url;
      if (bg.video.source === "youtube") {
        // Convert youtube URL to embed
        const videoId = extractYouTubeId(bg.video.url);
        if (videoId) {
          embedUrl = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&mute=1&loop=1&controls=0&playlist=" + videoId;
        }
      } else if (bg.video.source === "vimeo") {
        const vimeoId = extractVimeoId(bg.video.url);
        if (vimeoId) {
          embedUrl = "https://player.vimeo.com/video/" + vimeoId + "?autoplay=1&muted=1&loop=1&background=1";
        }
      }

      backgroundChildren.push(
        React.createElement("iframe", {
          key: "bg-video-iframe",
          className: styles.backgroundImage,
          src: embedUrl,
          style: { border: "none", objectFit: "cover" as React.CSSProperties["objectFit"] },
          allow: "autoplay; fullscreen; picture-in-picture",
          "aria-hidden": "true",
        })
      );
    }
  } else if (bg.type === "gradient" && bg.gradient) {
    const gradientCss = buildGradientCss(bg.gradient);
    backgroundChildren.push(
      React.createElement("div", {
        key: "bg-gradient",
        className: styles.backgroundImage,
        style: { background: gradientCss },
        "aria-hidden": "true",
      })
    );
  } else if (bg.type === "solidColor") {
    backgroundChildren.push(
      React.createElement("div", {
        key: "bg-solid",
        className: styles.backgroundImage,
        style: { backgroundColor: bg.backgroundColor || "#0078d4" },
        "aria-hidden": "true",
      })
    );
  }

  // ─── Gradient overlay ───
  if (bg.overlay && bg.overlay.stops && bg.overlay.stops.length > 0) {
    const overlayCss = buildGradientCss(bg.overlay);
    backgroundChildren.push(
      React.createElement("div", {
        key: "bg-overlay",
        className: styles.gradientOverlay,
        style: { background: overlayCss },
        "aria-hidden": "true",
      })
    );
  }

  // ─── Layers container ───
  const sortedLayers = React.useMemo(function (): ISliderLayer[] {
    if (!slide.layers || slide.layers.length === 0) {
      return [];
    }

    // Sort layers by zIndex ascending
    const copy = slide.layers.slice();
    copy.sort(function (a, b) { return a.zIndex - b.zIndex; });
    return copy;
  }, [slide.layers]);

  const layerElements: React.ReactNode[] = [];
  sortedLayers.forEach(function (layer) {
    layerElements.push(
      React.createElement(HyperSliderLayer, {
        key: layer.id,
        layer: layer,
        isCurrentSlide: isActive,
      })
    );
  });

  // ─── Render ───
  return React.createElement(
    "div",
    {
      className: slideClasses.join(" "),
      style: customProperties as React.CSSProperties,
      role: "group",
      "aria-roledescription": "slide",
      "aria-label": slide.title || "Slide",
      "aria-hidden": !isActive,
    },
    // Background
    React.createElement(
      "div",
      {
        className: styles.background,
        "aria-hidden": "true",
      },
      backgroundChildren
    ),
    // Layers
    layerElements.length > 0
      ? React.createElement(
          "div",
          { className: styles.layersContainer },
          layerElements
        )
      : undefined
  );
};

// ─── Video ID Extractors ─────────────────────────────────────────────────────

function extractYouTubeId(url: string): string {
  // Match patterns: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (let i = 0; i < patterns.length; i++) {
    const match = url.match(patterns[i]);
    if (match && match[1]) {
      return match[1];
    }
  }

  return "";
}

function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match && match[1]) {
    return match[1];
  }
  return "";
}

export default React.memo(HyperSliderSlide);
