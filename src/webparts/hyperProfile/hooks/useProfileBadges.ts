import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IProfileBadge, BadgeType } from "../models/IHyperProfileBadge";

export interface IProfileBadgesResult {
  badges: IProfileBadge[];
  loading: boolean;
  error: Error | undefined;
}

/**
 * Hook to fetch user badges/recognition from a SharePoint list.
 * If no listName is provided, returns empty badges.
 * List schema: Title (badge name), Icon (emoji), Color (#hex), Description,
 * AwardedDate (text), AwardedBy (text), BadgeType (choice), UserId (text)
 */
export function useProfileBadges(
  userId: string | undefined,
  listName: string | undefined,
  enabled: boolean
): IProfileBadgesResult {
  const [badges, setBadges] = React.useState<IProfileBadge[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(function () {
    if (!enabled || !listName || !userId) {
      setBadges([]);
      return undefined;
    }

    let cancelled = false;
    const capturedListName = listName;
    const capturedUserId = userId;
    const cacheKey = "hyperProfile_badges_" + capturedUserId;

    async function fetchBadges(): Promise<void> {
      setLoading(true);

      try {
        const cached = await hyperCache.get<IProfileBadge[]>(cacheKey);
        if (cached && !cancelled) {
          setBadges(cached);
          setLoading(false);
          return;
        }

        const ctx = getContext();
        const siteUrl = ctx.pageContext.web.absoluteUrl;

        const { SPFx, spfi } = await import(/* webpackChunkName: 'pnp-sp' */ "@pnp/sp");
        await import("@pnp/sp/webs");
        await import("@pnp/sp/lists");
        await import("@pnp/sp/items");

        const sp = spfi(siteUrl).using(SPFx(ctx));
        const items = await sp.web.lists.getByTitle(capturedListName).items
          .filter("UserId eq '" + capturedUserId + "'")
          .select("Id", "Title", "Icon", "Color", "Description", "AwardedDate", "AwardedBy", "BadgeType")
          .orderBy("AwardedDate", false)
          .top(20)();

        if (cancelled) return;

        const mapped: IProfileBadge[] = [];
        items.forEach(function (item: Record<string, unknown>) {
          mapped.push({
            id: String(item.Id || "badge-" + mapped.length),
            name: String(item.Title || ""),
            icon: String(item.Icon || "\u2B50"),
            color: String(item.Color || "#0078d4"),
            description: item.Description ? String(item.Description) : "",
            awardedDate: item.AwardedDate ? String(item.AwardedDate) : undefined,
            awardedBy: item.AwardedBy ? String(item.AwardedBy) : undefined,
            type: (item.BadgeType ? String(item.BadgeType) : "achievement") as BadgeType,
          });
        });

        if (!cancelled) {
          setBadges(mapped);
          await hyperCache.set(cacheKey, mapped, 300);
          setError(undefined);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setBadges([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBadges().catch(function () { /* handled inside */ });
    return function () { cancelled = true; };
  }, [userId, listName, enabled]);

  return { badges: badges, loading: loading, error: error };
}
