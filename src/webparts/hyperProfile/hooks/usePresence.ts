import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperPresence } from "../models";

export interface IPresenceResult {
  presence: IHyperPresence | undefined;
  loading: boolean;
  error: Error | undefined;
}

/** Hook to fetch and auto-refresh user presence from Microsoft Graph */
export function usePresence(
  userId: string | undefined,
  enabled: boolean,
  refreshIntervalSeconds: number
): IPresenceResult {
  const [presence, setPresence] = React.useState<IHyperPresence | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  const fetchPresence = React.useCallback(async function (): Promise<void> {
    if (!userId || !enabled) return;

    const cacheKey = "hyperProfile_presence_" + userId;
    const cached = await hyperCache.get<IHyperPresence>(cacheKey);
    if (cached) {
      setPresence(cached);
      return;
    }

    try {
      setLoading(true);
      let ctx;
      try {
        ctx = getContext();
      } catch {
        // Context not available -- silently skip presence fetch
        setLoading(false);
        return;
      }
      if (!ctx || !ctx.msGraphClientFactory) {
        setLoading(false);
        return;
      }
      const client = await ctx.msGraphClientFactory.getClient("3");
      const raw = await client.api("/users/" + userId + "/presence").get();

      const p: IHyperPresence = {
        availability: raw.availability,
        activity: raw.activity,
        statusMessage: raw.statusMessage,
      };

      setPresence(p);
      await hyperCache.set(cacheKey, p, 15); // 15 second cache for presence
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId, enabled]);

  // Initial fetch
  React.useEffect(function () {
    if (!userId || !enabled) {
      setPresence(undefined);
      return undefined;
    }

    fetchPresence().catch(function () { /* handled inside */ });

    // Auto-refresh
    const interval = (refreshIntervalSeconds || 30) * 1000;
    const timer = window.setInterval(function () {
      // Invalidate cache so next fetch is fresh
      hyperCache.set("hyperProfile_presence_" + userId, undefined, 0).catch(function () { /* noop */ });
      fetchPresence().catch(function () { /* handled inside */ });
    }, interval);

    return function () { clearInterval(timer); };
  }, [userId, enabled, refreshIntervalSeconds, fetchPresence]);

  return { presence: presence, loading: loading, error: error };
}
