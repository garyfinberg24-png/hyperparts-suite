import * as React from "react";
import type { ISliderBeforeAfter } from "../models";

export interface IUseBeforeAfterOptions {
  config: ISliderBeforeAfter;
  containerRef: React.RefObject<HTMLDivElement>;
}

export interface IUseBeforeAfterResult {
  position: number;
  isDragging: boolean;
  handleRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
}

export function useBeforeAfter(options: IUseBeforeAfterOptions): IUseBeforeAfterResult {
  const { config, containerRef } = options;

  const [position, setPosition] = React.useState<number>(config.initialPosition);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  // eslint-disable-next-line @rushstack/no-new-null
  const handleRef = React.useRef<HTMLDivElement>(null);

  const updatePosition = React.useCallback(function (clientX: number): void {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = (relativeX / rect.width) * 100;

    // Clamp between 0 and 100
    const clampedPosition = Math.max(0, Math.min(100, percentage));
    setPosition(clampedPosition);
  }, [containerRef]);

  const handleMouseDown = React.useCallback(function (e: React.MouseEvent): void {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);

    const handleMouseMove = function (moveEvent: MouseEvent): void {
      updatePosition(moveEvent.clientX);
    };

    const handleMouseUp = function (): void {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [updatePosition]);

  const handleTouchStart = React.useCallback(function (e: React.TouchEvent): void {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    updatePosition(touch.clientX);

    const handleTouchMove = function (moveEvent: TouchEvent): void {
      const moveTouch = moveEvent.touches[0];
      updatePosition(moveTouch.clientX);
    };

    const handleTouchEnd = function (): void {
      setIsDragging(false);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  }, [updatePosition]);

  // Container click handler for quick positioning
  React.useEffect(function () {
    if (!config.enabled || !containerRef.current) {
      return;
    }

    const container = containerRef.current;

    const handleContainerClick = function (e: MouseEvent): void {
      // Only handle direct clicks on container, not on handle
      if (handleRef.current && handleRef.current.contains(e.target as Node)) {
        return;
      }
      updatePosition(e.clientX);
    };

    container.addEventListener("click", handleContainerClick);

    return function () {
      container.removeEventListener("click", handleContainerClick);
    };
  }, [config.enabled, containerRef, updatePosition]);

  return {
    position,
    isDragging,
    handleRef,
    handleMouseDown,
    handleTouchStart
  };
}
