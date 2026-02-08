import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import { MAX_PHOTO_CONCURRENCY } from "../models";

export interface IDirectoryPhotosResult {
  photoMap: Record<string, string>;
  loading: boolean;
  refresh: () => void;
}

/** Batch photo fetcher for directory users. Fetches photos in chunks with per-user caching. */
export function useDirectoryPhotos(
  userIds: string[],
  photoSize: string,
  enabled: boolean,
  cacheTTLMinutes: number
): IDirectoryPhotosResult {
  const [photoMap, setPhotoMap] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const refresh = React.useCallback(function () {
    setRefreshKey(function (k) { return k + 1; });
  }, []);

  // Stabilize user IDs to prevent unnecessary refetches
  const idsKey = userIds.join(",");

  React.useEffect(function () {
    let cancelled = false;
    if (!enabled || userIds.length === 0) return undefined;

    const ttl = cacheTTLMinutes * 60 * 1000;
    const size = photoSize === "small" ? "48x48" : photoSize === "large" ? "240x240" : "120x120";

    async function fetchPhotos(): Promise<void> {
      setLoading(true);
      const result: Record<string, string> = {};
      const uncachedIds: string[] = [];

      // Check cache first for each user
      for (let idx = 0; idx < userIds.length; idx++) {
        const uid = userIds[idx];
        const cached = await hyperCache.get<string>("directory:photo:" + uid);
        if (cached) {
          result[uid] = cached;
        } else {
          uncachedIds.push(uid);
        }
      }

      if (uncachedIds.length === 0 || cancelled) {
        if (!cancelled) {
          setPhotoMap(result);
          setLoading(false);
        }
        return;
      }

      try {
        const ctx = getContext();
        const client = await ctx.msGraphClientFactory.getClient("3");
        const { ResponseType } = await import(
          /* webpackChunkName: 'ms-graph-client' */ "@microsoft/microsoft-graph-client"
        );

        // Chunk IDs for concurrency control
        const chunks: string[][] = [];
        for (let i = 0; i < uncachedIds.length; i += MAX_PHOTO_CONCURRENCY) {
          chunks.push(uncachedIds.slice(i, i + MAX_PHOTO_CONCURRENCY));
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

                if (blob && !cancelled) {
                  const dataUrl = await blobToDataUrl(blob);
                  result[uid] = dataUrl;
                  if (ttl > 0) {
                    await hyperCache.set("directory:photo:" + uid, dataUrl, ttl);
                  }
                }
              } catch {
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
      } catch {
        if (!cancelled) {
          setPhotoMap(result);
          setLoading(false);
        }
      }
    }

    fetchPhotos().catch(function () { /* handled inside */ });

    return function () { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, photoSize, enabled, cacheTTLMinutes, refreshKey]);

  return { photoMap: photoMap, loading: loading, refresh: refresh };
}

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
    reader.onerror = function () { reject(reader.error); };
    reader.readAsDataURL(blob);
  });
}
