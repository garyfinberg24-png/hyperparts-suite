import * as React from "react";
import { useRef, useMemo } from "react";
import type { IHyperHeroWebPartProps, IHyperHeroTile, IHyperHeroCta, IHyperHeroGridLayout } from "../models";
import type { Breakpoint } from "../../../common/models";
import { useResponsive } from "../../../common/hooks";
import { HyperErrorBoundary } from "../../../common/components";
import { HyperHeroTile } from "./HyperHeroTile";
import { HyperHeroTransitionWrapper } from "./HyperHeroTransitionWrapper";
import { HyperHeroSkeleton } from "./HyperHeroSkeleton";
import { useHeroDynamicContent } from "../hooks/useHeroDynamicContent";
import { useTileVisibility } from "../hooks/useTileVisibility";
import { hyperAnalytics } from "../../../common/services/HyperAnalytics";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroComponentProps extends IHyperHeroWebPartProps {
  instanceId: string;
}

const HyperHeroInner: React.FC<IHyperHeroComponentProps> = (props) => {
  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = useRef<HTMLDivElement>(null);
  const breakpoint: Breakpoint = useResponsive(containerRef as React.RefObject<HTMLElement>);

  const { tiles, layouts, rotation, contentBinding, borderRadius, fullBleed, title, instanceId } = props;

  // Select layout for current breakpoint
  const layout: IHyperHeroGridLayout = layouts[breakpoint] ?? layouts.desktop;

  // Dynamic content binding — fetch tiles from SharePoint list when enabled
  const { dynamicTiles, loading: dynamicLoading } = useHeroDynamicContent(contentBinding);

  // Merge static + dynamic tiles: dynamic tiles come after static ones
  const allTiles = useMemo((): IHyperHeroTile[] => {
    const staticTiles = tiles ?? [];
    if (contentBinding && contentBinding.enabled && dynamicTiles.length > 0) {
      return staticTiles.concat(dynamicTiles);
    }
    return staticTiles;
  }, [tiles, contentBinding, dynamicTiles]);

  // Apply scheduling filter (publish/unpublish dates)
  const scheduledTiles = useTileVisibility(allTiles);

  // CTA click tracking
  const handleCtaClick = React.useCallback(
    (cta: IHyperHeroCta): void => {
      hyperAnalytics.trackInteraction(instanceId, "ctaClick", cta.label);
    },
    [instanceId]
  );

  // Show skeleton while dynamic content is loading
  if (contentBinding && contentBinding.enabled && dynamicLoading) {
    return React.createElement(
      "div",
      { ref: containerRef, className: styles.heroContainer },
      React.createElement(HyperHeroSkeleton, { height: layout.height })
    );
  }

  // No tiles configured or all filtered out
  if (scheduledTiles.length === 0) {
    return React.createElement(
      "div",
      { ref: containerRef, className: styles.heroContainer },
      React.createElement(HyperHeroSkeleton, { height: layout.height })
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

  const gridContent = useRotation
    ? React.createElement(HyperHeroTransitionWrapper, {
        tiles: scheduledTiles,
        rotation: rotation,
        gridStyle: gridStyle,
        onCtaClick: handleCtaClick,
      })
    : React.createElement(
        "div",
        { className: styles.heroGrid, style: gridStyle, role: "region", "aria-label": title ?? "Hero banner" },
        scheduledTiles.map((tile) =>
          React.createElement(HyperHeroTile, {
            key: tile.id,
            tile: tile,
            onCtaClick: handleCtaClick,
          })
        )
      );

  return React.createElement(
    "div",
    { ref: containerRef, className: containerClasses },
    title
      ? React.createElement("h2", { className: styles.heroTitle }, title)
      : undefined,
    gridContent
  );
};

const HyperHero: React.FC<IHyperHeroComponentProps> = (props) => {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperHeroInner, props)
  );
};

export default HyperHero;
