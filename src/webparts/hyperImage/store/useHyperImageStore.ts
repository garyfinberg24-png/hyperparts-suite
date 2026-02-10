import { create } from "zustand";

export type EditorTab = "shape" | "filters" | "text" | "styling";

interface IHyperImageStoreState {
  isEditorOpen: boolean;
  isBrowserOpen: boolean;
  lightboxOpen: boolean;
  editorTab: EditorTab;

  openEditor: () => void;
  closeEditor: () => void;
  openBrowser: () => void;
  closeBrowser: () => void;
  openLightbox: () => void;
  closeLightbox: () => void;
  setEditorTab: (tab: EditorTab) => void;
}

export var useHyperImageStore = create<IHyperImageStoreState>(function (set) {
  return {
    isEditorOpen: false,
    isBrowserOpen: false,
    lightboxOpen: false,
    editorTab: "shape" as EditorTab,

    openEditor: function () { set({ isEditorOpen: true }); },
    closeEditor: function () { set({ isEditorOpen: false }); },
    openBrowser: function () { set({ isBrowserOpen: true }); },
    closeBrowser: function () { set({ isBrowserOpen: false }); },
    openLightbox: function () { set({ lightboxOpen: true }); },
    closeLightbox: function () { set({ lightboxOpen: false }); },
    setEditorTab: function (tab: EditorTab) { set({ editorTab: tab }); },
  };
});
