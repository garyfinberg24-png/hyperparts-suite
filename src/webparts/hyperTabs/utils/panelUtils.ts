import type { IHyperTabPanel } from "../models";
import { DEFAULT_PANEL } from "../models";

/** Parse JSON-stringified panels array, returning empty array on failure */
export function parsePanels(panelsJson: string): IHyperTabPanel[] {
  try {
    const parsed = JSON.parse(panelsJson);
    return Array.isArray(parsed) ? parsed as IHyperTabPanel[] : [];
  } catch {
    return [];
  }
}

/** Stringify panels array to JSON */
export function stringifyPanels(panels: IHyperTabPanel[]): string {
  return JSON.stringify(panels);
}

/** Generate a unique panel ID */
export function generatePanelId(): string {
  return "panel-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Create a new panel with defaults */
export function createPanel(title: string, sortOrder: number): IHyperTabPanel {
  return {
    ...DEFAULT_PANEL,
    id: generatePanelId(),
    title: title,
    sortOrder: sortOrder,
  };
}

/** Reorder a panel from one index to another */
export function reorderPanel(
  panels: IHyperTabPanel[],
  fromIndex: number,
  toIndex: number
): IHyperTabPanel[] {
  if (fromIndex < 0 || fromIndex >= panels.length) return panels;
  if (toIndex < 0 || toIndex >= panels.length) return panels;
  if (fromIndex === toIndex) return panels;

  const reordered: IHyperTabPanel[] = [];
  panels.forEach(function (p) { reordered.push({ ...p }); });

  const moved = reordered.splice(fromIndex, 1)[0];
  reordered.splice(toIndex, 0, moved);

  reordered.forEach(function (panel, idx) {
    panel.sortOrder = idx;
  });

  return reordered;
}

/** Add a panel to the end of the array */
export function addPanel(
  panels: IHyperTabPanel[],
  newPanel: IHyperTabPanel
): IHyperTabPanel[] {
  const updated: IHyperTabPanel[] = [];
  panels.forEach(function (p) { updated.push(p); });
  updated.push(newPanel);
  updated.forEach(function (panel, idx) {
    panel.sortOrder = idx;
  });
  return updated;
}

/** Remove a panel by ID */
export function removePanel(
  panels: IHyperTabPanel[],
  panelId: string
): IHyperTabPanel[] {
  const filtered = panels.filter(function (p) { return p.id !== panelId; });
  filtered.forEach(function (panel, idx) {
    panel.sortOrder = idx;
  });
  return filtered;
}
