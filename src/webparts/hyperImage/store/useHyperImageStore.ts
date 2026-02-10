import { create } from "zustand";
import type { ShapeMask } from "../models/IHyperImageShape";
import type { FilterPreset } from "../models/IHyperImageFilter";
import type { HoverEffect } from "../models/IHyperImageHover";
import type { ImageLayout } from "../models/IHyperImageLayout";

export type EditorTab = "shape" | "filters" | "text" | "styling";

interface IHyperImageStoreState {
  /* ── Modal state ── */
  isEditorOpen: boolean;
  isBrowserOpen: boolean;
  lightboxOpen: boolean;
  editorTab: EditorTab;

  /* ── Demo mode overrides ── */
  demoShape: ShapeMask | undefined;
  demoLayout: ImageLayout | undefined;
  demoFilter: FilterPreset | undefined;
  demoHover: HoverEffect | undefined;

  /* ── Modal actions ── */
  openEditor: () => void;
  closeEditor: () => void;
  openBrowser: () => void;
  closeBrowser: () => void;
  openLightbox: () => void;
  closeLightbox: () => void;
  setEditorTab: (tab: EditorTab) => void;

  /* ── Demo actions ── */
  setDemoShape: (shape: ShapeMask | undefined) => void;
  setDemoLayout: (layout: ImageLayout | undefined) => void;
  setDemoFilter: (filter: FilterPreset | undefined) => void;
  setDemoHover: (hover: HoverEffect | undefined) => void;
  resetDemo: () => void;
}

export var useHyperImageStore = create<IHyperImageStoreState>(function (set) {
  return {
    /* ── Modal state ── */
    isEditorOpen: false,
    isBrowserOpen: false,
    lightboxOpen: false,
    editorTab: "shape" as EditorTab,

    /* ── Demo mode overrides (undefined = use prop value) ── */
    demoShape: undefined,
    demoLayout: undefined,
    demoFilter: undefined,
    demoHover: undefined,

    /* ── Modal actions ── */
    openEditor: function () { set({ isEditorOpen: true }); },
    closeEditor: function () { set({ isEditorOpen: false }); },
    openBrowser: function () { set({ isBrowserOpen: true }); },
    closeBrowser: function () { set({ isBrowserOpen: false }); },
    openLightbox: function () { set({ lightboxOpen: true }); },
    closeLightbox: function () { set({ lightboxOpen: false }); },
    setEditorTab: function (tab: EditorTab) { set({ editorTab: tab }); },

    /* ── Demo actions ── */
    setDemoShape: function (shape: ShapeMask | undefined) { set({ demoShape: shape }); },
    setDemoLayout: function (layout: ImageLayout | undefined) { set({ demoLayout: layout }); },
    setDemoFilter: function (filter: FilterPreset | undefined) { set({ demoFilter: filter }); },
    setDemoHover: function (hover: HoverEffect | undefined) { set({ demoHover: hover }); },
    resetDemo: function () {
      set({
        demoShape: undefined,
        demoLayout: undefined,
        demoFilter: undefined,
        demoHover: undefined,
      });
    },
  };
});
