import { useState, useEffect } from "react";
import { getGraph } from "../services/HyperPnP";
import { hyperCache } from "../services/HyperCache";
import type { IGraphUser } from "../models";

export interface UseGraphUserResult {
  user: IGraphUser | undefined;
  loading: boolean;
  error: Error | undefined;
}

export const useGraphUser = (userId?: string): UseGraphUserResult => {
  const [user, setUser] = useState<IGraphUser | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async (): Promise<void> => {
      const cacheKey = `graphUser:${userId ?? "me"}`;
      try {
        const cached = await hyperCache.get<IGraphUser>(cacheKey);
        if (cached) {
          if (!cancelled) {
            setUser(cached);
            setLoading(false);
          }
          return;
        }

        const graph = getGraph();
        const endpoint = userId ? graph.users.getById(userId) : graph.me;
        const profile = await endpoint();

        const graphUser: IGraphUser = {
          id: profile.id ?? "",
          displayName: profile.displayName ?? "",
          mail: profile.mail ?? "",
          jobTitle: profile.jobTitle ?? undefined,
          department: profile.department ?? undefined,
          officeLocation: profile.officeLocation ?? undefined,
          userPrincipalName: profile.userPrincipalName ?? "",
        };

        await hyperCache.set(cacheKey, graphUser, 10 * 60 * 1000);

        if (!cancelled) {
          setUser(graphUser);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    fetchUser().catch(() => { /* handled above */ });

    return () => { cancelled = true; };
  }, [userId]);

  return { user, loading, error };
};
