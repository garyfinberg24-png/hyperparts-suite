import * as React from "react";
import type { ISliderLayer, LayerAnimationState } from "../models";

export interface IUseLayerAnimationsOptions {
  layer: ISliderLayer;
  isCurrentSlide: boolean;
}

export interface IUseLayerAnimationsResult {
  animationState: LayerAnimationState;
  shouldRender: boolean;
}

export function useLayerAnimations(options: IUseLayerAnimationsOptions): IUseLayerAnimationsResult {
  const { layer, isCurrentSlide } = options;

  const [animationState, setAnimationState] = React.useState<LayerAnimationState>("hidden");
  // eslint-disable-next-line @rushstack/no-new-null
  const delayTimeoutRef = React.useRef<number>(0);
  // eslint-disable-next-line @rushstack/no-new-null
  const durationTimeoutRef = React.useRef<number>(0);

  React.useEffect(function () {
    // Clear any pending timeouts
    if (delayTimeoutRef.current) {
      window.clearTimeout(delayTimeoutRef.current);
    }
    if (durationTimeoutRef.current) {
      window.clearTimeout(durationTimeoutRef.current);
    }

    if (isCurrentSlide) {
      // Slide is becoming active
      setAnimationState("idle");

      // Wait for entrance delay
      delayTimeoutRef.current = window.setTimeout(function () {
        setAnimationState("entering");

        // Wait for entrance duration
        durationTimeoutRef.current = window.setTimeout(function () {
          setAnimationState("visible");
        }, layer.animation.entrance.duration);
      }, layer.animation.entrance.delay);
    } else {
      // Slide is becoming inactive
      if (animationState === "visible" || animationState === "entering") {
        setAnimationState("exiting");

        // Wait for exit duration
        durationTimeoutRef.current = window.setTimeout(function () {
          setAnimationState("hidden");
        }, layer.animation.exit.duration);
      } else {
        setAnimationState("hidden");
      }
    }

    return function () {
      if (delayTimeoutRef.current) {
        window.clearTimeout(delayTimeoutRef.current);
      }
      if (durationTimeoutRef.current) {
        window.clearTimeout(durationTimeoutRef.current);
      }
    };
  }, [isCurrentSlide, layer.animation.entrance.delay, layer.animation.entrance.duration, layer.animation.exit.duration]);

  const shouldRender = animationState !== "hidden";

  return {
    animationState,
    shouldRender
  };
}
