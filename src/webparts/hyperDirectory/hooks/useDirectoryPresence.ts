import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IDirectoryPresence } from "../models";

export interface IDirectoryPresenceResult {
  presenceMap: Record<string, IDirectoryPresence>;
  loading: boolean;
}

/**
 * Batch presence fetcher for visible directory users.
 * Uses the /communications/getPresencesByUserId Graph API for efficiency.
 */
export function useDirectoryPresence(
  userIds: string[],
  enabled: boolean,
  refreshIntervalSeconds: number
): IDirectoryPresenceResult {
  const [presenceMap, setPresenceMap] = React.useState<Record<string, IDirectoryPresence>>({});
  const [loading, setLoading] = React.useState(false);

  // Stabilize user IDs
  const idsKey = userIds.join(",");

  const fetchPresences = React.useCallback(async function (): Promise<void> {
    if (!enabled || userIds.length === 0) return;

    setLoading(true);
    const result: Record<string, IDirectoryPresence> = {};

    try {
      // Check cache first
      const cacheKey = "directory:presence:" + idsKey;
      const cached = await hyperCache.get<Record<string, IDirectoryPresence>>(cacheKey);
      if (cached) {
        setPresenceMap(cached);
        setLoading(false);
        return;
      }

      const ctx = getContext();
      const client = await ctx.msGraphClientFactory.getClient("3");

      // Graph supports up to 650 IDs per batch presence request
      const batchSize = 650;
      const chunks: string[][] = [];
      for (let i = 0; i < userIds.length; i += batchSize) {
        chunks.push(userIds.slice(i, i + batchSize));
      }

      for (let c = 0; c < chunks.length; c++) {
        try {
          const response = await client
            .api("/communications/getPresencesByUserId")
            .post({ ids: chunks[c] });

          if (response && response.value) {
            response.value.forEach(function (p: Record<string, unknown>) {
              const uid = String(p.id || "");
              if (uid) {
                result[uid] = {
                  availability: String(p.availability || "Offline"),
                  activity: String(p.activity || "Offline"),
                };
              }
            });
          }
        } catch {
          // Presence API may fail for some users — continue
        }
      }

      setPresenceMap(result);
      // Short cache for presence data (15 seconds)
      await hyperCache.set(cacheKey, result, 15000);
    } catch {
      // Presence fetch failed entirely — leave empty
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, enabled]);

  // Initial fetch + auto-refresh
  React.useEffect(function () {
    if (!enabled || userIds.length === 0) return undefined;

    fetchPresences().catch(function () { /* handled inside */ });

    const interval = (refreshIntervalSeconds || 30) * 1000;
    const timer = window.setInterval(function () {
      // Invalidate cache before refresh
      hyperCache.set("directory:presence:" + idsKey, undefined, 0).catch(function () { /* noop */ });
      fetchPresences().catch(function () { /* handled inside */ });
    }, interval);

    return function () { clearInterval(timer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, enabled, refreshIntervalSeconds, fetchPresences]);

  return { presenceMap: presenceMap, loading: loading };
}
