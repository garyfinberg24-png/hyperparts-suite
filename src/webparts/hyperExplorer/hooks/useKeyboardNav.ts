import * as React from "react";
import type { IExplorerFile, PreviewMode } from "../models";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";

export interface IUseKeyboardNavOptions {
  /** Is lightbox currently open */
  enableLightbox: boolean;
  /** Preview mode setting */
  previewMode: PreviewMode;
  /** Callback to focus the search input */
  onFocusSearch?: () => void;
  /** Callback when file is activated (Enter) */
  onFileActivate?: (file: IExplorerFile) => void;
}

/**
 * Global keyboard navigation for HyperExplorer:
 * - j/k: Move focus to next/prev file
 * - Space: Toggle selection of focused file
 * - Enter: Open/preview focused file
 * - /: Focus search input
 * - Ctrl+A: Select all
 * - Delete: (placeholder) future delete support
 */
export function useKeyboardNav(options: IUseKeyboardNavOptions): void {
  var filteredFiles = useHyperExplorerStore(function (s) { return s.filteredFiles; });
  var selectedFileIds = useHyperExplorerStore(function (s) { return s.selectedFileIds; });
  var toggleFileSelection = useHyperExplorerStore(function (s) { return s.toggleFileSelection; });
  var selectAll = useHyperExplorerStore(function (s) { return s.selectAll; });
  var clearSelection = useHyperExplorerStore(function (s) { return s.clearSelection; });
  var lightboxOpen = useHyperExplorerStore(function (s) { return s.lightboxOpen; });
  var openLightbox = useHyperExplorerStore(function (s) { return s.openLightbox; });
  var setPreviewFile = useHyperExplorerStore(function (s) { return s.setPreviewFile; });

  // Track focused file index
  var focusIndexRef = React.useRef<number>(-1);

  React.useEffect(function () {
    // Don't handle keys when lightbox is open (lightbox has its own handler)
    if (lightboxOpen) return undefined;

    var handleKeyDown = function (e: KeyboardEvent): void {
      // Ignore if user is typing in an input/textarea
      var target = e.target as HTMLElement;
      var tagName = target.tagName ? target.tagName.toUpperCase() : "";
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
        // Allow "/" to blur and focus search
        if (e.key === "/" && tagName === "INPUT") {
          return; // Let the input handle it
        }
        return;
      }

      switch (e.key) {
        case "j":
        case "ArrowDown": {
          // Move focus down
          e.preventDefault();
          if (filteredFiles.length === 0) return;
          var nextIdx = focusIndexRef.current + 1;
          if (nextIdx >= filteredFiles.length) {
            nextIdx = filteredFiles.length - 1;
          }
          focusIndexRef.current = nextIdx;
          // Visually focus the file card via data attribute
          scrollToFocusedFile(nextIdx);
          break;
        }

        case "k":
        case "ArrowUp": {
          // Move focus up
          e.preventDefault();
          if (filteredFiles.length === 0) return;
          var prevIdx = focusIndexRef.current - 1;
          if (prevIdx < 0) prevIdx = 0;
          focusIndexRef.current = prevIdx;
          scrollToFocusedFile(prevIdx);
          break;
        }

        case " ": {
          // Toggle selection of focused file
          e.preventDefault();
          if (focusIndexRef.current >= 0 && focusIndexRef.current < filteredFiles.length) {
            toggleFileSelection(filteredFiles[focusIndexRef.current].id);
          }
          break;
        }

        case "Enter": {
          // Activate focused file
          e.preventDefault();
          if (focusIndexRef.current >= 0 && focusIndexRef.current < filteredFiles.length) {
            var file = filteredFiles[focusIndexRef.current];
            if (file.isImage && options.enableLightbox) {
              var imageFiles = filteredFiles.filter(function (f) { return f.isImage; });
              var imgIdx = 0;
              imageFiles.forEach(function (f, i) {
                if (f.id === file.id) imgIdx = i;
              });
              openLightbox(imageFiles, imgIdx);
            } else if (options.onFileActivate) {
              options.onFileActivate(file);
            } else {
              setPreviewFile(file);
            }
          }
          break;
        }

        case "/": {
          // Focus search
          e.preventDefault();
          if (options.onFocusSearch) {
            options.onFocusSearch();
          }
          break;
        }

        case "a": {
          // Ctrl+A / Cmd+A — select all
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (selectedFileIds.length === filteredFiles.length) {
              clearSelection();
            } else {
              selectAll();
            }
          }
          break;
        }

        case "Escape": {
          // Clear selection
          if (selectedFileIds.length > 0) {
            e.preventDefault();
            clearSelection();
          }
          break;
        }

        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    lightboxOpen, filteredFiles, selectedFileIds,
    toggleFileSelection, selectAll, clearSelection,
    openLightbox, setPreviewFile, options,
  ]);

  // Reset focus index when file list changes
  React.useEffect(function () {
    focusIndexRef.current = -1;
  }, [filteredFiles]);
}

/** Scroll a file card into view based on index */
function scrollToFocusedFile(index: number): void {
  // File cards have data-file-index attribute
  var cards = document.querySelectorAll("[data-file-index]");
  if (index >= 0 && index < cards.length) {
    var card = cards[index] as HTMLElement;
    if (card) {
      card.focus();
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
}
