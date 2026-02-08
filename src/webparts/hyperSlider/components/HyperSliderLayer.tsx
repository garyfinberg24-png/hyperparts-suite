// ─── HyperSlider Layer Renderer ────────────────────────────────────────────────
import * as React from "react";
import styles from "./HyperSliderLayer.module.scss";
import type {
  ISliderLayer,
  BreakpointKey,
  LayerAnimationState,
} from "../models";
import { useLayerAnimations } from "../hooks/useLayerAnimations";
import { useHyperSliderStore } from "../store/useHyperSliderStore";
import {
  getEntranceClass,
  getExitClass,
  getLoopClass,
  getHoverClass,
  buildAnimationStyle,
} from "../utils/animationUtils";
import {
  resolveLayerPosition,
  resolveLayerSize,
  isLayerVisibleAtBreakpoint,
} from "../utils/responsiveUtils";
import {
  getLayerPositionStyle,
  getLayerSizeStyle,
} from "../utils/layerUtils";
import TextLayer from "./layers/TextLayer";
import ImageLayer from "./layers/ImageLayer";
import VideoLayer from "./layers/VideoLayer";
import ButtonLayer from "./layers/ButtonLayer";
import ShapeLayer from "./layers/ShapeLayer";
import IconLayer from "./layers/IconLayer";
import LottieLayer from "./layers/LottieLayer";
import GroupLayer from "./layers/GroupLayer";

// ─── Props ───────────────────────────────────────────────────────────────────

export interface IHyperSliderLayerProps {
  layer: ISliderLayer;
  isCurrentSlide: boolean;
}

// ─── Styles module cast for dynamic class access ─────────────────────────────

const stylesMap = styles as Record<string, string>;

// ─── Animation Class Resolver ────────────────────────────────────────────────

function resolveAnimationClasses(
  layer: ISliderLayer,
  animationState: LayerAnimationState
): string[] {
  const classes: string[] = [];

  if (animationState === "entering") {
    const entranceClassName = getEntranceClass(layer.animation.entrance.type);
    if (entranceClassName) {
      const resolved = stylesMap[entranceClassName];
      if (resolved) {
        classes.push(resolved);
      }
    }
  } else if (animationState === "exiting") {
    const exitClassName = getExitClass(layer.animation.exit.type);
    if (exitClassName) {
      const resolved = stylesMap[exitClassName];
      if (resolved) {
        classes.push(resolved);
      }
    }
  } else if (animationState === "visible") {
    // Apply loop animation when visible
    const loopClassName = getLoopClass(layer.animation.loop.type);
    if (loopClassName) {
      const resolved = stylesMap[loopClassName];
      if (resolved) {
        classes.push(resolved);
      }
    }
  }

  // Always apply hover effect class when visible or entering
  if (animationState === "visible" || animationState === "entering") {
    const hoverClassName = getHoverClass(layer.animation.hover.type);
    if (hoverClassName) {
      const resolved = stylesMap[hoverClassName];
      if (resolved) {
        classes.push(resolved);
      }
    }
  }

  return classes;
}

// ─── Animation Style Resolver ────────────────────────────────────────────────

function resolveAnimationStyle(
  layer: ISliderLayer,
  animationState: LayerAnimationState
): React.CSSProperties {
  if (animationState === "entering") {
    return buildAnimationStyle(
      layer.animation.entrance.delay,
      layer.animation.entrance.duration,
      layer.animation.entrance.easing
    );
  }

  if (animationState === "exiting") {
    return buildAnimationStyle(
      layer.animation.exit.delay,
      layer.animation.exit.duration,
      layer.animation.exit.easing
    );
  }

  if (animationState === "visible" && layer.animation.loop.type !== "none") {
    return {
      animationDuration: layer.animation.loop.duration + "ms",
      animationDelay: layer.animation.loop.delay + "ms",
    };
  }

  return {};
}

// ─── Layer Content Renderer ──────────────────────────────────────────────────

function renderLayerContent(layer: ISliderLayer, isCurrentSlide: boolean): React.ReactNode {
  if (layer.type === "text" && layer.textConfig) {
    return React.createElement(TextLayer, { config: layer.textConfig });
  }

  if (layer.type === "image" && layer.imageConfig) {
    return React.createElement(ImageLayer, { config: layer.imageConfig });
  }

  if (layer.type === "video" && layer.videoConfig) {
    return React.createElement(VideoLayer, {
      config: layer.videoConfig,
    });
  }

  if (layer.type === "button" && layer.buttonConfig) {
    return React.createElement(ButtonLayer, { config: layer.buttonConfig });
  }

  if (layer.type === "shape" && layer.shapeConfig) {
    return React.createElement(ShapeLayer, { config: layer.shapeConfig });
  }

  if (layer.type === "icon" && layer.iconConfig) {
    return React.createElement(IconLayer, { config: layer.iconConfig });
  }

  if (layer.type === "lottie" && layer.lottieConfig) {
    return React.createElement(LottieLayer, {
      config: layer.lottieConfig,
    });
  }

  if (layer.type === "group" && layer.groupConfig) {
    return React.createElement(GroupLayer, {
      config: layer.groupConfig,
      isCurrentSlide: isCurrentSlide,
    });
  }

  return undefined;
}

// ─── Component ───────────────────────────────────────────────────────────────

const HyperSliderLayer: React.FC<IHyperSliderLayerProps> = function (props) {
  const { layer, isCurrentSlide } = props;

  // ─── Animation state ───
  const animResult = useLayerAnimations({
    layer: layer,
    isCurrentSlide: isCurrentSlide,
  });

  const animationState = animResult.animationState;
  const shouldRender = animResult.shouldRender;

  // ─── Responsive breakpoint from store ───
  const breakpoint = useHyperSliderStore(function (state) { return state.breakpoint; });

  // ─── Visibility check ───
  const isVisible = isLayerVisibleAtBreakpoint(layer, breakpoint as BreakpointKey);

  // ─── Early exit ───
  if (!shouldRender || !isVisible) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // ─── Resolve responsive position & size ───
  const resolvedPosition = resolveLayerPosition(
    layer.position,
    layer.responsive.overrides,
    breakpoint as BreakpointKey
  );
  const resolvedSize = resolveLayerSize(
    layer.size,
    layer.responsive.overrides,
    breakpoint as BreakpointKey
  );

  // ─── Build CSS ───
  const positionStyle = getLayerPositionStyle(
    resolvedPosition.x,
    resolvedPosition.y,
    resolvedPosition.xUnit,
    resolvedPosition.yUnit
  );
  const sizeStyle = getLayerSizeStyle(
    resolvedSize.width,
    resolvedSize.height,
    resolvedSize.widthUnit,
    resolvedSize.heightUnit
  );
  const animationStyle = resolveAnimationStyle(layer, animationState);

  // ─── Build class list ───
  const layerClasses: string[] = [styles.layer];
  const animClasses = resolveAnimationClasses(layer, animationState);
  animClasses.forEach(function (cls) {
    layerClasses.push(cls);
  });

  // ─── Combine inline styles ───
  const combinedStyle: React.CSSProperties = {};
  const posKeys = Object.keys(positionStyle);
  posKeys.forEach(function (k) { (combinedStyle as Record<string, unknown>)[k] = (positionStyle as Record<string, unknown>)[k]; });
  const sizeKeys = Object.keys(sizeStyle);
  sizeKeys.forEach(function (k) { (combinedStyle as Record<string, unknown>)[k] = (sizeStyle as Record<string, unknown>)[k]; });
  const animKeys = Object.keys(animationStyle);
  animKeys.forEach(function (k) { (combinedStyle as Record<string, unknown>)[k] = (animationStyle as Record<string, unknown>)[k]; });
  combinedStyle.zIndex = layer.zIndex;

  // ─── Render layer content ───
  const content = renderLayerContent(layer, isCurrentSlide);

  return React.createElement(
    "div",
    {
      className: layerClasses.join(" "),
      style: combinedStyle,
      "data-layer-id": layer.id,
      "data-layer-type": layer.type,
    },
    content
  );
};

export default React.memo(HyperSliderLayer);
