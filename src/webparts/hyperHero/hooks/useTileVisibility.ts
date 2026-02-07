import { useMemo } from "react";
import type { IHyperHeroTile } from "../models";

/**
 * Hook that filters tiles based on scheduling (publish/unpublish dates).
 * Audience targeting is handled per-tile at render time via useAudienceTarget
 * in the tile component. This hook handles date-based scheduling only.
 */
export function useTileVisibility(tiles: IHyperHeroTile[]): IHyperHeroTile[] {
  return useMemo(() => {
    const now = Date.now();
    return tiles.filter((tile) => {
      // Must be enabled
      if (!tile.enabled) return false;

      // Check publish date — hide if in the future
      if (tile.publishDate) {
        const publishTime = new Date(tile.publishDate).getTime();
        if (!isNaN(publishTime) && publishTime > now) return false;
      }

      // Check unpublish date — hide if in the past
      if (tile.unpublishDate) {
        const unpublishTime = new Date(tile.unpublishDate).getTime();
        if (!isNaN(unpublishTime) && unpublishTime < now) return false;
      }

      return true;
    });
  }, [tiles]);
}
