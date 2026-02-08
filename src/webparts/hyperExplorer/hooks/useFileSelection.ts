import * as React from "react";
import { useHyperExplorerStore } from "../store/useHyperExplorerStore";
import type { IExplorerFile } from "../models";

export interface IUseFileSelectionResult {
  isSelected: (id: string) => boolean;
  handleSelect: (id: string, event: React.MouseEvent) => void;
  selectedCount: number;
}

export function useFileSelection(): IUseFileSelectionResult {
  const selectedFileIds = useHyperExplorerStore(function (s) { return s.selectedFileIds; });
  const filteredFiles = useHyperExplorerStore(function (s) { return s.filteredFiles; });
  const toggleFileSelection = useHyperExplorerStore(function (s) { return s.toggleFileSelection; });
  const clearSelection = useHyperExplorerStore(function (s) { return s.clearSelection; });

  const lastSelectedRef = React.useRef<string>("");

  const isSelected = React.useCallback(function (id: string): boolean {
    return selectedFileIds.indexOf(id) !== -1;
  }, [selectedFileIds]);

  const handleSelect = React.useCallback(function (id: string, event: React.MouseEvent): void {
    if (event.shiftKey && lastSelectedRef.current) {
      // Range selection
      let startIdx = -1;
      let endIdx = -1;
      filteredFiles.forEach(function (f: IExplorerFile, i: number): void {
        if (f.id === lastSelectedRef.current) startIdx = i;
        if (f.id === id) endIdx = i;
      });

      if (startIdx !== -1 && endIdx !== -1) {
        const from = Math.min(startIdx, endIdx);
        const to = Math.max(startIdx, endIdx);
        clearSelection();
        let i: number;
        for (i = from; i <= to; i++) {
          toggleFileSelection(filteredFiles[i].id);
        }
      }
    } else {
      toggleFileSelection(id);
    }

    lastSelectedRef.current = id;
  }, [filteredFiles, toggleFileSelection, clearSelection]);

  return {
    isSelected: isSelected,
    handleSelect: handleSelect,
    selectedCount: selectedFileIds.length,
  };
}
