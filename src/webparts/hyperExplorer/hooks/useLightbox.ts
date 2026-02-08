import * as React from "react";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";

export function useLightbox(): void {
  const lightboxOpen = useHyperExplorerStore(function (s) { return s.lightboxOpen; });
  const nextLightboxImage = useHyperExplorerStore(function (s) { return s.nextLightboxImage; });
  const prevLightboxImage = useHyperExplorerStore(function (s) { return s.prevLightboxImage; });
  const closeLightbox = useHyperExplorerStore(function (s) { return s.closeLightbox; });
  const lightboxZoom = useHyperExplorerStore(function (s) { return s.lightboxZoom; });
  const setLightboxZoom = useHyperExplorerStore(function (s) { return s.setLightboxZoom; });

  React.useEffect(function () {
    if (!lightboxOpen) return;

    const handleKeyDown = function (e: KeyboardEvent): void {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          nextLightboxImage();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevLightboxImage();
          break;
        case "Escape":
          e.preventDefault();
          closeLightbox();
          break;
        case "+":
        case "=":
          e.preventDefault();
          setLightboxZoom(lightboxZoom + 0.25);
          break;
        case "-":
          e.preventDefault();
          setLightboxZoom(lightboxZoom - 0.25);
          break;
        case "0":
          e.preventDefault();
          setLightboxZoom(1);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return function (): void {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, lightboxZoom, nextLightboxImage, prevLightboxImage, closeLightbox, setLightboxZoom]);
}
