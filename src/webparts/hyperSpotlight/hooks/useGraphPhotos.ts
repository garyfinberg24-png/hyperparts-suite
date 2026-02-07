import { useState, useEffect, useCallback } from "react";
import { ResponseType } from "@microsoft/microsoft-graph-client";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { ImageQuality } from "../models";

const MAX_CONCURRENT = 5;

/**
 * Map ImageQuality to the Graph photo size path segment.
 */
function getPhotoSize(quality: ImageQuality): string {
  switch (quality) {
    case "low":
      return "48x48";
    case "high":
      return "240x240";
    default:
      return "96x96";
  }
}

export interface UseGraphPhotosResult {
  /** Map of userId -> base64 data URI */
  photoMap: Record<string, string>;
  loading: boolean;
  refresh: () => void;
}

/**
 * Fetch profile photos for a list of user IDs.
 * Uses MSGraphClient for blob responses with concurrency control.
 * Photos are cached individually via hyperCache.
 */
export function useGraphPhotos(
  userIds: string[],
  quality: ImageQuality,
  enabled: boolean,
  cacheTTL?: number
): UseGraphPhotosResult {
  const ttl = cacheTTL !== undefined ? cacheTTL : 3600000; // 1 hour

  const refreshState = useState(0);
  const refreshKey = refreshState[0];
  const setRefreshKey = refreshState[1];

  const mapState = useState<Record<string, string>>({});
  const photoMap = mapState[0];
  const setPhotoMap = mapState[1];

  const loadingState = useState(false);
  const loading = loadingState[0];
  const setLoading = loadingState[1];

  const refresh = useCallback(function () {
    setRefreshKey(function (prev) { return prev + 1; });
  }, []);

  // Stable dep key
  const idsKey = userIds ? userIds.join(",") : "";

  useEffect(function () {
    let cancelled = false;

    if (!enabled || !userIds || userIds.length === 0) {
      setPhotoMap({});
      return;
    }

    const fetchPhotos = function (): Promise<void> {
      return (async function (): Promise<void> {
        const result: Record<string, string> = {};
        const uncachedIds: string[] = [];

        // Check cache first for each user
        for (let idx = 0; idx < userIds.length; idx++) {
          const uid = userIds[idx];
          const cached = await hyperCache.get<string>("spotlight:photo:" + uid);
          if (cached) {
            result[uid] = cached;
          } else {
            uncachedIds.push(uid);
          }
        }

        if (!cancelled && uncachedIds.length === 0) {
          setPhotoMap(result);
          setLoading(false);
          return;
        }

        // Use MSGraphClient for blob responses
        const client = await getContext().msGraphClientFactory.getClient("3");
        const size = getPhotoSize(quality);

        // Chunk uncached IDs for concurrency control
        const chunks: string[][] = [];
        for (let i = 0; i < uncachedIds.length; i += MAX_CONCURRENT) {
          chunks.push(uncachedIds.slice(i, i + MAX_CONCURRENT));
        }

        for (let c = 0; c < chunks.length; c++) {
          if (cancelled) break;

          const promises = chunks[c].map(function (userId) {
            return (async function (uid: string): Promise<void> {
              try {
                const blob: Blob = await client
                  .api("/users/" + uid + "/photos/" + size + "/$value")
                  .responseType(ResponseType.BLOB)
                  .get();

                if (blob) {
                  const dataUrl = await blobToDataUrl(blob);
                  result[uid] = dataUrl;
                  if (ttl > 0) {
                    await hyperCache.set("spotlight:photo:" + uid, dataUrl, ttl);
                  }
                }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (e) {
                // User has no photo — silently skip
              }
            })(userId);
          });

          await Promise.all(promises);
        }

        if (!cancelled) {
          setPhotoMap(result);
          setLoading(false);
        }
      })();
    };

    setLoading(true);
    fetchPhotos().catch(function () { /* handled above */ });

    return function () { cancelled = true; };
  }, [idsKey, quality, enabled, refreshKey, ttl]);

  return { photoMap: photoMap, loading: loading, refresh: refresh };
}

/* ── Helper ── */

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onloadend = function () {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("Failed to read photo blob"));
      }
    };
    reader.onerror = function () {
      reject(reader.error);
    };
    reader.readAsDataURL(blob);
  });
}
