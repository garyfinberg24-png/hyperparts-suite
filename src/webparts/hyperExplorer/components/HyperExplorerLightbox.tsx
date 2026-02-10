import * as React from "react";
import type { IExplorerFile } from "../models";
import { useLightbox } from "../hooks/useLightbox";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";
import styles from "./HyperExplorerLightbox.module.scss";

export interface IHyperExplorerLightboxProps {
  siteUrl: string;
}

/** Build direct URL for image */
function buildImageUrl(siteUrl: string, serverRelativeUrl: string): string {
  if (serverRelativeUrl.indexOf("http") === 0) return serverRelativeUrl;
  var origin = "";
  try {
    var parsed = new URL(siteUrl);
    origin = parsed.origin;
  } catch (_e) {
    origin = siteUrl;
  }
  return origin + serverRelativeUrl;
}

var HyperExplorerLightbox: React.FC<IHyperExplorerLightboxProps> = function (props) {
  // Hook for keyboard navigation (Arrow/Escape/+/-/0)
  useLightbox();

  // Store selectors
  var lightboxOpen = useHyperExplorerStore(function (s) { return s.lightboxOpen; });
  var lightboxImages = useHyperExplorerStore(function (s) { return s.lightboxImages; });
  var lightboxIndex = useHyperExplorerStore(function (s) { return s.lightboxIndex; });
  var lightboxZoom = useHyperExplorerStore(function (s) { return s.lightboxZoom; });
  var lightboxPanX = useHyperExplorerStore(function (s) { return s.lightboxPanX; });
  var lightboxPanY = useHyperExplorerStore(function (s) { return s.lightboxPanY; });
  var closeLightbox = useHyperExplorerStore(function (s) { return s.closeLightbox; });
  var setLightboxIndex = useHyperExplorerStore(function (s) { return s.setLightboxIndex; });
  var nextLightboxImage = useHyperExplorerStore(function (s) { return s.nextLightboxImage; });
  var prevLightboxImage = useHyperExplorerStore(function (s) { return s.prevLightboxImage; });
  var setLightboxZoom = useHyperExplorerStore(function (s) { return s.setLightboxZoom; });
  var setLightboxPan = useHyperExplorerStore(function (s) { return s.setLightboxPan; });

  // Slideshow state
  var slideshowState = React.useState<boolean>(false);
  var slideshowActive = slideshowState[0];
  var setSlideshowActive = slideshowState[1];

  // Slideshow timer
  var slideshowRef = React.useRef<number>(0);

  React.useEffect(function () {
    if (slideshowActive && lightboxOpen) {
      slideshowRef.current = window.setInterval(function () {
        nextLightboxImage();
      }, 3000);
      return function () {
        if (slideshowRef.current) {
          window.clearInterval(slideshowRef.current);
        }
      };
    }
    return undefined;
  }, [slideshowActive, lightboxOpen, nextLightboxImage]);

  // Stop slideshow when reaching end
  React.useEffect(function () {
    if (slideshowActive && lightboxIndex >= lightboxImages.length - 1) {
      setSlideshowActive(false);
    }
  }, [lightboxIndex, lightboxImages.length, slideshowActive]);

  // Pan via mouse drag
  var isDraggingRef = React.useRef<boolean>(false);
  var lastMouseRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  var handleMouseDown = React.useCallback(function (e: React.MouseEvent): void {
    if (lightboxZoom > 1) {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  }, [lightboxZoom]);

  var handleMouseMove = React.useCallback(function (e: React.MouseEvent): void {
    if (isDraggingRef.current) {
      var dx = e.clientX - lastMouseRef.current.x;
      var dy = e.clientY - lastMouseRef.current.y;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      setLightboxPan(lightboxPanX + dx, lightboxPanY + dy);
    }
  }, [lightboxPanX, lightboxPanY, setLightboxPan]);

  var handleMouseUp = React.useCallback(function (): void {
    isDraggingRef.current = false;
  }, []);

  // Zoom via wheel
  var handleWheel = React.useCallback(function (e: React.WheelEvent): void {
    e.preventDefault();
    var delta = e.deltaY > 0 ? -0.15 : 0.15;
    setLightboxZoom(lightboxZoom + delta);
  }, [lightboxZoom, setLightboxZoom]);

  // Focus trap ref
  // eslint-disable-next-line @rushstack/no-new-null
  var overlayRef = React.useRef<HTMLDivElement>(null);

  // Focus the overlay on mount
  React.useEffect(function () {
    if (lightboxOpen && overlayRef.current) {
      overlayRef.current.focus();
    }
  }, [lightboxOpen]);

  if (!lightboxOpen || lightboxImages.length === 0) {
    return React.createElement(React.Fragment);
  }

  var currentFile: IExplorerFile = lightboxImages[lightboxIndex] || lightboxImages[0];
  var imgUrl = currentFile.thumbnailUrl || buildImageUrl(props.siteUrl, currentFile.serverRelativeUrl);

  var imageTransform = "translate(" + lightboxPanX + "px, " + lightboxPanY + "px) scale(" + lightboxZoom + ")";

  // Toolbar children
  var toolbarChildren: React.ReactNode[] = [];

  // Title
  toolbarChildren.push(
    React.createElement("span", { key: "title", className: styles.lightboxTitle }, currentFile.name)
  );

  // Counter + slideshow indicator
  var middleItems: React.ReactNode[] = [];
  middleItems.push(
    React.createElement("span", { key: "counter", className: styles.lightboxCounter },
      (lightboxIndex + 1) + " / " + lightboxImages.length
    )
  );
  if (slideshowActive) {
    middleItems.push(
      React.createElement("span", { key: "slideshow", className: styles.slideshowIndicator }, "Slideshow")
    );
  }
  toolbarChildren.push(
    React.createElement("div", { key: "middle", style: { display: "flex", alignItems: "center", gap: "8px" } }, middleItems)
  );

  // Action buttons
  var actionButtons: React.ReactNode[] = [];

  // Slideshow toggle
  actionButtons.push(
    React.createElement("button", {
      key: "slideshow",
      className: styles.lightboxButton,
      onClick: function () { setSlideshowActive(!slideshowActive); },
      "aria-label": slideshowActive ? "Stop slideshow" : "Start slideshow",
      title: slideshowActive ? "Stop slideshow" : "Start slideshow",
      type: "button",
    }, slideshowActive ? "\u23F8" : "\u25B6")
  );

  // Zoom out
  actionButtons.push(
    React.createElement("button", {
      key: "zoom-out",
      className: styles.lightboxButton,
      onClick: function () { setLightboxZoom(lightboxZoom - 0.25); },
      disabled: lightboxZoom <= 0.5,
      "aria-label": "Zoom out",
      title: "Zoom out",
      type: "button",
    }, "\u2796")
  );

  // Reset zoom
  actionButtons.push(
    React.createElement("button", {
      key: "zoom-reset",
      className: styles.lightboxButton,
      onClick: function () { setLightboxZoom(1); setLightboxPan(0, 0); },
      "aria-label": "Reset zoom",
      title: "Reset zoom (0)",
      type: "button",
    }, "1:1")
  );

  // Zoom in
  actionButtons.push(
    React.createElement("button", {
      key: "zoom-in",
      className: styles.lightboxButton,
      onClick: function () { setLightboxZoom(lightboxZoom + 0.25); },
      disabled: lightboxZoom >= 5,
      "aria-label": "Zoom in",
      title: "Zoom in",
      type: "button",
    }, "\u2795")
  );

  // Close
  actionButtons.push(
    React.createElement("button", {
      key: "close",
      className: styles.lightboxButton + " " + styles.lightboxCloseButton,
      onClick: closeLightbox,
      "aria-label": "Close lightbox",
      title: "Close (Escape)",
      type: "button",
    }, "\u2715")
  );

  toolbarChildren.push(
    React.createElement("div", { key: "actions", className: styles.lightboxActions }, actionButtons)
  );

  // Thumbnail strip
  var thumbnails = lightboxImages.map(function (img: IExplorerFile, idx: number) {
    var thumbUrl = img.thumbnailUrl || buildImageUrl(props.siteUrl, img.serverRelativeUrl);
    var thumbClass = styles.lightboxThumbnail;
    if (idx === lightboxIndex) {
      thumbClass = thumbClass + " " + styles.lightboxThumbnailActive;
    }
    return React.createElement("img", {
      key: img.id,
      className: thumbClass,
      src: thumbUrl,
      alt: img.name,
      onClick: function () { setLightboxIndex(idx); },
      role: "button",
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setLightboxIndex(idx);
        }
      },
    });
  });

  return React.createElement("div", {
    ref: overlayRef,
    className: styles.lightboxOverlay,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Image lightbox - " + currentFile.name,
    tabIndex: -1,
    onMouseUp: handleMouseUp,
  },
    // Toolbar
    React.createElement("div", { className: styles.lightboxToolbar }, toolbarChildren),

    // Content area with image
    React.createElement("div", {
      className: styles.lightboxContent,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onWheel: handleWheel,
    },
      // Previous arrow
      React.createElement("button", {
        className: styles.lightboxNavPrev,
        onClick: function (e: React.MouseEvent) { e.stopPropagation(); prevLightboxImage(); },
        disabled: lightboxIndex <= 0,
        "aria-label": "Previous image",
        type: "button",
      }, "\u276E"),

      // Image
      React.createElement("img", {
        className: styles.lightboxImage,
        src: imgUrl,
        alt: currentFile.name,
        style: { transform: imageTransform },
        draggable: false,
      }),

      // Next arrow
      React.createElement("button", {
        className: styles.lightboxNavNext,
        onClick: function (e: React.MouseEvent) { e.stopPropagation(); nextLightboxImage(); },
        disabled: lightboxIndex >= lightboxImages.length - 1,
        "aria-label": "Next image",
        type: "button",
      }, "\u276F"),

      // Zoom indicator
      lightboxZoom !== 1
        ? React.createElement("div", { className: styles.lightboxZoomIndicator },
            Math.round(lightboxZoom * 100) + "%"
          )
        : undefined
    ),

    // Thumbnail strip
    lightboxImages.length > 1
      ? React.createElement("div", {
          className: styles.lightboxThumbnailStrip,
          role: "tablist",
          "aria-label": "Image thumbnails",
        }, thumbnails)
      : undefined
  );
};

export default HyperExplorerLightbox;
