import * as React from "react";
import type { LinkHealthStatus } from "../store/useHyperNavStore";

export interface INavLinkHealthResult {
  /** Map of linkId → health status */
  healthMap: Record<string, LinkHealthStatus>;
  /** Whether health check is in progress */
  checking: boolean;
}

/**
 * Link health monitoring (edit mode only).
 * Uses HEAD requests for same-origin; no-cors for cross-origin.
 * Caches results per session to avoid repeated checks.
 */
export function useNavLinkHealth(
  links: Array<{ id: string; url: string }>,
  enabled: boolean,
  isEditMode: boolean
): INavLinkHealthResult {
  const [healthMap, setHealthMap] = React.useState<Record<string, LinkHealthStatus>>({});
  const [checking, setChecking] = React.useState(false);

  React.useEffect(function () {
    if (!enabled || !isEditMode || links.length === 0) {
      return;
    }

    let cancelled = false;
    setChecking(true);

    const linksToCheck = links.filter(function (l) { return !!l.url; });

    Promise.all(
      linksToCheck.map(function (link) {
        return checkLinkHealth(link.url).then(function (status) {
          return { id: link.id, status: status };
        });
      })
    ).then(function (results) {
      if (cancelled) return;
      const map: Record<string, LinkHealthStatus> = {};
      results.forEach(function (r) {
        map[r.id] = r.status;
      });
      setHealthMap(map);
      setChecking(false);
    }).catch(function () {
      if (cancelled) return;
      setChecking(false);
    });

    return function () { cancelled = true; };
  }, [links, enabled, isEditMode]);

  return { healthMap: healthMap, checking: checking };
}

function checkLinkHealth(url: string): Promise<LinkHealthStatus> {
  try {
    const parsed = new URL(url);
    const isSameOrigin = parsed.origin === window.location.origin;

    if (isSameOrigin) {
      return fetch(url, { method: "HEAD" })
        .then(function (response) {
          return response.ok ? "healthy" as LinkHealthStatus : "broken" as LinkHealthStatus;
        })
        .catch(function () {
          return "broken" as LinkHealthStatus;
        });
    }

    // Cross-origin: use no-cors (opaque response = reachable)
    return fetch(url, { method: "HEAD", mode: "no-cors" })
      .then(function () {
        return "healthy" as LinkHealthStatus;
      })
      .catch(function () {
        return "broken" as LinkHealthStatus;
      });
  } catch {
    return Promise.resolve("broken" as LinkHealthStatus);
  }
}
