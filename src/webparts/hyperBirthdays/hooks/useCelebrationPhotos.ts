import { useState, useEffect } from "react";
import type { ICelebration } from "../models";
import { getContext } from "../../../common/services/HyperPnP";

/**
 * Batch fetch user photos from Microsoft Graph.
 * Returns a map of userId -> photo blob URL.
 */
export function useCelebrationPhotos(
  celebrations: ICelebration[],
  photoSize: number
): Record<string, string> {
  const [photoMap, setPhotoMap] = useState<Record<string, string>>({});

  useEffect(function () {
    if (celebrations.length === 0) return;

    let cancelled = false;
    const newMap: Record<string, string> = {};

    // Collect unique user IDs that need photos
    const userIds: string[] = [];
    celebrations.forEach(function (c) {
      if (c.userId && userIds.indexOf(c.userId) === -1) {
        userIds.push(c.userId);
      }
    });

    if (userIds.length === 0) return;

    const ctx = getContext();
    let completed = 0;

    ctx.msGraphClientFactory.getClient("3")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(function (client: any) {
        userIds.forEach(function (userId) {
          const size = photoSize || 48;
          const sizeStr = String(size) + "x" + String(size);

          client
            .api("/users/" + userId + "/photos/" + sizeStr + "/$value")
            .get()
            .then(function (blob: Blob) {
              if (!cancelled) {
                newMap[userId] = URL.createObjectURL(blob);
              }
              completed++;
              if (completed >= userIds.length && !cancelled) {
                setPhotoMap(function (prev) {
                  const merged: Record<string, string> = {};
                  Object.keys(prev).forEach(function (k) { merged[k] = prev[k]; });
                  Object.keys(newMap).forEach(function (k) { merged[k] = newMap[k]; });
                  return merged;
                });
              }
            })
            .catch(function () {
              completed++;
              if (completed >= userIds.length && !cancelled) {
                setPhotoMap(function (prev) {
                  const merged: Record<string, string> = {};
                  Object.keys(prev).forEach(function (k) { merged[k] = prev[k]; });
                  Object.keys(newMap).forEach(function (k) { merged[k] = newMap[k]; });
                  return merged;
                });
              }
            });
        });
      })
      .catch(function () {
        // Graph client unavailable — skip photos
      });

    return function () {
      cancelled = true;
      // Revoke blob URLs on cleanup
      Object.keys(newMap).forEach(function (key) {
        if (newMap[key]) {
          URL.revokeObjectURL(newMap[key]);
        }
      });
    };
  }, [celebrations.length, photoSize]); // eslint-disable-line react-hooks/exhaustive-deps

  return photoMap;
}
