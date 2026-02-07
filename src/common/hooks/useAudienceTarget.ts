import { useState, useEffect } from "react";
import { hyperPermissions } from "../services/HyperPermissions";
import type { IAudienceTarget } from "../models";

export interface UseAudienceTargetResult {
  isVisible: boolean;
  loading: boolean;
}

export const useAudienceTarget = (config: IAudienceTarget): UseAudienceTargetResult => {
  const [isVisible, setIsVisible] = useState<boolean>(!config.enabled);
  const [loading, setLoading] = useState<boolean>(config.enabled);

  useEffect(() => {
    if (!config.enabled || config.groups.length === 0) {
      setIsVisible(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const checkAudience = async (): Promise<void> => {
      try {
        if (config.matchAll) {
          const results = await Promise.all(
            config.groups.map(g => hyperPermissions.isUserInGroup(g))
          );
          if (!cancelled) setIsVisible(results.every(r => r));
        } else {
          const result = await hyperPermissions.isUserInAnyGroup(config.groups);
          if (!cancelled) setIsVisible(result);
        }
      } catch {
        if (!cancelled) setIsVisible(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAudience().catch(() => { /* handled above */ });

    return () => { cancelled = true; };
  }, [config.enabled, config.groups, config.matchAll]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isVisible, loading };
};
