import * as React from "react";
import { useRef, useMemo } from "react";
import type {
  IHyperHeroWebPartProps,
  IHyperHeroTile,
  IHyperHeroCta,
  IHyperHeroGridLayout,
  IHyperHeroResponsiveLayouts,
} from "../models";
import {
  DEFAULT_TILE,
  DEFAULT_GRADIENT,
  DEFAULT_HERO_FIELD_MAPPING,
} from "../models";
import type { Breakpoint } from "../../../common/models";
import { useResponsive } from "../../../common/hooks";
import { HyperErrorBoundary } from "../../../common/components";
import { HyperHeroTile } from "./HyperHeroTile";
import { HyperHeroTransitionWrapper } from "./HyperHeroTransitionWrapper";
import { HyperHeroSkeleton } from "./HyperHeroSkeleton";
import { useHeroDynamicContent } from "../hooks/useHeroDynamicContent";
import { useTileVisibility } from "../hooks/useTileVisibility";
import { hyperAnalytics } from "../../../common/services/HyperAnalytics";
import HyperHeroSetupWizard from "./wizard/HyperHeroSetupWizard";
import type { IWizardResult } from "./wizard/HyperHeroSetupWizard";
import { HyperHeroTileEditor } from "./editor";
import { HyperHeroEditOverlay, HyperHeroEditToolbar } from "./editor";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroComponentProps extends IHyperHeroWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  onTilesChange?: (tiles: IHyperHeroTile[]) => void;
  onSettingsChange?: (partial: Partial<IHyperHeroWebPartProps>) => void;
}

/** Layout presets for the manual wizard mode */
interface ILayoutPresetConfig {
  tileCount: number;
  templateAreas: string;
  columnTemplate: string;
  rowTemplate: string;
}

function getLayoutPresetConfig(preset: string, tileCount: number): ILayoutPresetConfig {
  if (preset === "split") {
    return {
      tileCount: 2,
      templateAreas: "'tile1 tile2'",
      columnTemplate: "1fr 1fr",
      rowTemplate: "400px",
    };
  }
  if (preset === "thirds") {
    return {
      tileCount: 3,
      templateAreas: "'tile1 tile2 tile3'",
      columnTemplate: "1fr 1fr 1fr",
      rowTemplate: "400px",
    };
  }
  if (preset === "heroSidebar") {
    return {
      tileCount: 2,
      templateAreas: "'tile1 tile1 tile2'",
      columnTemplate: "1fr 1fr 1fr",
      rowTemplate: "400px",
    };
  }
  if (preset === "grid2x2") {
    return {
      tileCount: 4,
      templateAreas: "'tile1 tile2' 'tile3 tile4'",
      columnTemplate: "1fr 1fr",
      rowTemplate: "200px 200px",
    };
  }
  // "single" or fallback
  return {
    tileCount: tileCount || 1,
    templateAreas: "'main'",
    columnTemplate: "1fr",
    rowTemplate: "400px",
  };
}

function generateTilesForPreset(count: number, preset: string): IHyperHeroTile[] {
  const config = getLayoutPresetConfig(preset, count);
  const finalCount = config.tileCount;
  const tiles: IHyperHeroTile[] = [];
  const colors = ["#0078d4", "#107c10", "#d83b01", "#5c2d91", "#008272", "#ca5010"];

  for (let i = 0; i < finalCount; i++) {
    const gridArea = preset === "single" ? "main" : "tile" + (i + 1);
    tiles.push({
      id: "tile-" + Date.now() + "-" + i,
      gridArea: gridArea,
      heading: "Tile " + (i + 1),
      subheading: "Click edit to customize",
      background: { type: "solidColor", backgroundColor: colors[i % colors.length] },
      gradientOverlay: DEFAULT_GRADIENT,
      ctas: [],
      audienceTarget: { enabled: false, groups: [], matchAll: false },
      textAlign: "left",
      verticalAlign: "bottom",
      sortOrder: i,
      enabled: true,
    });
  }
  return tiles;
}

function generateLayoutsForPreset(preset: string, tileCount: number): IHyperHeroResponsiveLayouts {
  const config = getLayoutPresetConfig(preset, tileCount);
  const base: IHyperHeroGridLayout = {
    columns: 1,
    rows: 1,
    gap: 8,
    templateAreas: config.templateAreas,
    columnTemplate: config.columnTemplate,
    rowTemplate: config.rowTemplate,
    height: 400,
  };

  // Mobile always stacks to single column
  const mobileAreas: string[] = [];
  for (let i = 0; i < config.tileCount; i++) {
    const area = preset === "single" ? "main" : "tile" + (i + 1);
    mobileAreas.push("'" + area + "'");
  }
  const mobile: IHyperHeroGridLayout = {
    columns: 1,
    rows: config.tileCount,
    gap: 8,
    templateAreas: mobileAreas.join(" "),
    columnTemplate: "1fr",
    rowTemplate: Array(config.tileCount).fill("200px").join(" "),
    height: 200 * config.tileCount,
  };

  return {
    mobile: mobile,
    tablet: { ...base, height: 350, rowTemplate: config.rowTemplate.replace(/400/g, "350") },
    desktop: base,
    widescreen: { ...base, height: 450, rowTemplate: config.rowTemplate.replace(/400/g, "450") },
  };
}

const HyperHeroInner: React.FC<IHyperHeroComponentProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint: Breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  const {
    tiles, layouts, rotation, contentBinding, borderRadius, fullBleed,
    title, instanceId, isEditMode, onTilesChange, onSettingsChange,
    wizardCompleted,
  } = props;

  // ── Edit state ──
  const [showWizard, setShowWizard] = React.useState(false);
  const [editingTileId, setEditingTileId] = React.useState<string | undefined>(undefined);

  // Auto-open wizard on first use in edit mode
  React.useEffect(function () {
    if (isEditMode && !wizardCompleted && tiles && tiles.length === 1) {
      const firstTile = tiles[0];
      if (firstTile && firstTile.id === "default-1") {
        setShowWizard(true);
      }
    }
  }, [isEditMode, wizardCompleted, tiles]);

  // ── Wizard callbacks ──
  const handleWizardClose = React.useCallback(function () {
    setShowWizard(false);
  }, []);

  const handleWizardApply = React.useCallback(function (result: IWizardResult) {
    if (!onSettingsChange || !onTilesChange) return;

    if (result.mode === "list" && result.listName) {
      // SP List mode: enable content binding
      onSettingsChange({
        wizardCompleted: true,
        contentBinding: {
          enabled: true,
          listName: result.listName,
          fieldMapping: result.fieldMapping || DEFAULT_HERO_FIELD_MAPPING,
          ascending: true,
          maxItems: 10,
          cacheTTL: 300000,
        },
      });
    } else if (result.mode === "manual") {
      // Manual mode: generate tiles + layouts
      const preset = result.layoutPreset || "single";
      const count = result.tileCount || 1;
      const newTiles = generateTilesForPreset(count, preset);
      const newLayouts = generateLayoutsForPreset(preset, count);

      onTilesChange(newTiles);
      onSettingsChange({
        wizardCompleted: true,
        layouts: newLayouts,
      });
    }

    setShowWizard(false);
  }, [onSettingsChange, onTilesChange]);

  // ── Tile editor callbacks ──
  const editingTile = useMemo(function (): IHyperHeroTile | undefined {
    if (!editingTileId || !tiles) return undefined;
    let found: IHyperHeroTile | undefined = undefined;
    tiles.forEach(function (t) {
      if (t.id === editingTileId) found = t;
    });
    return found;
  }, [editingTileId, tiles]);

  const handleEditTile = React.useCallback(function (tileId: string) {
    setEditingTileId(tileId);
  }, []);

  const handleEditorClose = React.useCallback(function () {
    setEditingTileId(undefined);
  }, []);

  const handleEditorSave = React.useCallback(function (updatedTile: IHyperHeroTile) {
    if (!onTilesChange || !tiles) return;
    const updated: IHyperHeroTile[] = [];
    tiles.forEach(function (t) {
      if (t.id === updatedTile.id) {
        updated.push(updatedTile);
      } else {
        updated.push(t);
      }
    });
    onTilesChange(updated);
    setEditingTileId(undefined);
  }, [tiles, onTilesChange]);

  const handleDeleteTile = React.useCallback(function (tileId: string) {
    if (!onTilesChange || !tiles) return;
    const remaining = tiles.filter(function (t) { return t.id !== tileId; });
    if (remaining.length === 0) {
      // Don't allow deleting the last tile — reset to default
      onTilesChange([DEFAULT_TILE]);
    } else {
      onTilesChange(remaining);
    }
  }, [tiles, onTilesChange]);

  const handleAddTile = React.useCallback(function () {
    if (!onTilesChange || !tiles) return;
    const newTile: IHyperHeroTile = {
      id: "tile-" + Date.now(),
      gridArea: "main",
      heading: "New Tile",
      subheading: "Click edit to customize",
      background: { type: "solidColor", backgroundColor: "#0078d4" },
      gradientOverlay: DEFAULT_GRADIENT,
      ctas: [],
      audienceTarget: { enabled: false, groups: [], matchAll: false },
      textAlign: "left",
      verticalAlign: "bottom",
      sortOrder: tiles.length,
      enabled: true,
    };
    onTilesChange(tiles.concat([newTile]));
    setEditingTileId(newTile.id);
  }, [tiles, onTilesChange]);

  const handleRerunSetup = React.useCallback(function () {
    if (onSettingsChange) {
      onSettingsChange({ wizardCompleted: false });
    }
    setShowWizard(true);
  }, [onSettingsChange]);

  // Select layout for current breakpoint
  const layout: IHyperHeroGridLayout = layouts[breakpoint] || layouts.desktop;

  // Dynamic content binding — fetch tiles from SharePoint list when enabled
  const dynamicResult = useHeroDynamicContent(contentBinding);
  const dynamicTiles = dynamicResult.dynamicTiles;
  const dynamicLoading = dynamicResult.loading;

  // Merge static + dynamic tiles: dynamic tiles come after static ones
  const allTiles = useMemo(function (): IHyperHeroTile[] {
    const staticTiles = tiles || [];
    if (contentBinding && contentBinding.enabled && dynamicTiles.length > 0) {
      return staticTiles.concat(dynamicTiles);
    }
    return staticTiles;
  }, [tiles, contentBinding, dynamicTiles]);

  // Apply scheduling filter (publish/unpublish dates)
  const scheduledTiles = useTileVisibility(allTiles);

  // CTA click tracking
  const handleCtaClick = React.useCallback(function (cta: IHyperHeroCta): void {
    hyperAnalytics.trackInteraction(instanceId, "ctaClick", cta.label);
  }, [instanceId]);

  // ── Edit mode modals (rendered regardless of loading state) ──
  const editModals: React.ReactElement[] = [];

  if (isEditMode) {
    // Setup Wizard modal
    editModals.push(
      React.createElement(HyperHeroSetupWizard, {
        key: "wizard",
        isOpen: showWizard,
        onClose: handleWizardClose,
        onApply: handleWizardApply,
      })
    );

    // Tile Editor modal
    editModals.push(
      React.createElement(HyperHeroTileEditor, {
        key: "editor",
        isOpen: editingTileId !== undefined,
        tile: editingTile,
        onSave: handleEditorSave,
        onClose: handleEditorClose,
      })
    );
  }

  // Show skeleton while dynamic content is loading
  if (contentBinding && contentBinding.enabled && dynamicLoading) {
    return React.createElement(
      "div",
      { ref: containerRef, className: styles.heroContainer },
      React.createElement(HyperHeroSkeleton, { height: layout.height }),
      editModals
    );
  }

  // No tiles configured or all filtered out
  if (scheduledTiles.length === 0) {
    return React.createElement(
      "div",
      { ref: containerRef, className: styles.heroContainer },
      React.createElement(HyperHeroSkeleton, { height: layout.height }),
      editModals
    );
  }

  // Grid inline styles from layout config
  const gridStyle: React.CSSProperties = {
    gridTemplateAreas: layout.templateAreas,
    gridTemplateColumns: layout.columnTemplate,
    gridTemplateRows: layout.rowTemplate,
    gap: layout.gap + "px",
    minHeight: layout.height + "px",
    borderRadius: borderRadius > 0 ? borderRadius + "px" : undefined,
  };

  const containerClasses = [
    styles.heroContainer,
    fullBleed ? styles.heroFullBleed : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Use transition wrapper when rotation is enabled and there are multiple tiles
  const useRotation = rotation && rotation.enabled && scheduledTiles.length > 1;

  // Build tile elements — wrap with edit overlay in edit mode
  const buildTileElements = function (): React.ReactElement[] {
    return scheduledTiles.map(function (tile, idx) {
      const tileEl = React.createElement(HyperHeroTile, {
        key: tile.id,
        tile: tile,
        onCtaClick: handleCtaClick,
      });

      if (isEditMode) {
        return React.createElement(
          "div",
          { key: tile.id, style: { position: "relative", gridArea: tile.gridArea } },
          tileEl,
          React.createElement(HyperHeroEditOverlay, {
            tileId: tile.id,
            tileHeading: tile.heading || "Untitled",
            tileIndex: idx,
            onEdit: handleEditTile,
            onDelete: handleDeleteTile,
          })
        );
      }

      return tileEl;
    });
  };

  const gridContent = useRotation && !isEditMode
    ? React.createElement(HyperHeroTransitionWrapper, {
        tiles: scheduledTiles,
        rotation: rotation,
        gridStyle: gridStyle,
        onCtaClick: handleCtaClick,
      })
    : React.createElement(
        "div",
        { className: styles.heroGrid, style: gridStyle, role: "region", "aria-label": title || "Hero banner" },
        buildTileElements()
      );

  return React.createElement(
    "div",
    { ref: containerRef, className: containerClasses },
    // Edit toolbar (edit mode only)
    isEditMode
      ? React.createElement(HyperHeroEditToolbar, {
          onAddTile: handleAddTile,
          onRerunSetup: handleRerunSetup,
          tileCount: scheduledTiles.length,
        })
      : undefined,
    // Title
    title
      ? React.createElement("h2", { className: styles.heroTitle }, title)
      : undefined,
    // Grid content
    gridContent,
    // Edit mode modals
    editModals
  );
};

const HyperHero: React.FC<IHyperHeroComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperHeroInner, props)
  );
};

export default HyperHero;
