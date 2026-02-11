import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperProfileUser, IHyperProfileManager } from "../models";

export interface IProfileDataResult {
  profile: IHyperProfileUser | undefined;
  manager: IHyperProfileManager | undefined;
  photoUrl: string | undefined;
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

const PROFILE_FIELDS = "id,displayName,givenName,surname,userPrincipalName,mail,jobTitle,department,officeLocation,city,mobilePhone,businessPhones,preferredLanguage,employeeId,companyName,aboutMe";
const MANAGER_FIELDS = "id,displayName,mail,jobTitle,userPrincipalName";

/** Hook to fetch user profile, photo, and manager from Microsoft Graph */
export function useProfileData(userId?: string, cacheTTL?: number): IProfileDataResult {
  const [profile, setProfile] = React.useState<IHyperProfileUser | undefined>(undefined);
  const [manager, setManager] = React.useState<IHyperProfileManager | undefined>(undefined);
  const [photoUrl, setPhotoUrl] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const refresh = React.useCallback(function () {
    setRefreshKey(function (k) { return k + 1; });
  }, []);

  React.useEffect(function () {
    let cancelled = false;
    const ttl = cacheTTL || 300;
    const cacheKeyBase = "hyperProfile_" + (userId || "me");

    async function fetchData(): Promise<void> {
      setLoading(true);
      setError(undefined);

      // Safety check: ensure PnPjs context is initialized
      let ctx;
      try {
        ctx = getContext();
      } catch {
        if (!cancelled) {
          setError(new Error("SharePoint context not available. Enable Demo Mode to preview with sample data."));
          setLoading(false);
        }
        return;
      }

      // Safety check: ensure Graph client factory is available
      if (!ctx || !ctx.msGraphClientFactory) {
        if (!cancelled) {
          setError(new Error("Microsoft Graph client not available. Enable Demo Mode to preview with sample data."));
          setLoading(false);
        }
        return;
      }

      try {

        // Check cache first (async)
        const cachedProfile = await hyperCache.get<IHyperProfileUser>(cacheKeyBase + "_profile");
        const cachedPhoto = await hyperCache.get<string>(cacheKeyBase + "_photo");
        const cachedManager = await hyperCache.get<IHyperProfileManager>(cacheKeyBase + "_manager");

        if (cachedProfile && cachedPhoto !== undefined && refreshKey === 0) {
          if (!cancelled) {
            setProfile(cachedProfile);
            setPhotoUrl(cachedPhoto || undefined);
            setManager(cachedManager || undefined);
            setLoading(false);
          }
          return;
        }

        // Fetch profile via MSGraphClientV3
        const client = await ctx.msGraphClientFactory.getClient("3");
        const endpoint = userId ? "/users/" + encodeURIComponent(userId) : "/me";
        const raw = await client.api(endpoint).select(PROFILE_FIELDS).get();
        const profileData: IHyperProfileUser = mapGraphUser(raw as Record<string, unknown>);

        if (cancelled) return;
        setProfile(profileData);
        await hyperCache.set(cacheKeyBase + "_profile", profileData, ttl);

        // Fetch photo
        try {
          const photoEndpoint = userId ? "/users/" + userId + "/photo/$value" : "/me/photo/$value";
          const { ResponseType } = await import(/* webpackChunkName: 'ms-graph-client' */ "@microsoft/microsoft-graph-client");
          const photoBlob: Blob = await client.api(photoEndpoint).responseType(ResponseType.BLOB).get();

          if (!cancelled) {
            const dataUrl = await blobToDataUrl(photoBlob);
            setPhotoUrl(dataUrl);
            profileData.profilePhotoUrl = dataUrl;
            await hyperCache.set(cacheKeyBase + "_photo", dataUrl, ttl);
          }
        } catch {
          // Photo not available
          if (!cancelled) {
            setPhotoUrl(undefined);
            await hyperCache.set(cacheKeyBase + "_photo", "", ttl);
          }
        }

        // Fetch manager
        try {
          const mgrEndpoint = userId ? "/users/" + userId + "/manager" : "/me/manager";
          const managerRaw = await client.api(mgrEndpoint).select(MANAGER_FIELDS).get();
          const mgr: IHyperProfileManager = {
            id: managerRaw.id,
            displayName: managerRaw.displayName,
            mail: managerRaw.mail,
            jobTitle: managerRaw.jobTitle,
            userPrincipalName: managerRaw.userPrincipalName,
          };
          if (!cancelled) {
            setManager(mgr);
            await hyperCache.set(cacheKeyBase + "_manager", mgr, ttl);
          }
        } catch {
          // No manager or permission error
          if (!cancelled) {
            setManager(undefined);
          }
        }

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    }

    fetchData().catch(function () { /* handled inside */ });

    return function () { cancelled = true; };
  }, [userId, cacheTTL, refreshKey]);

  return { profile: profile, manager: manager, photoUrl: photoUrl, loading: loading, error: error, refresh: refresh };
}

function mapGraphUser(raw: Record<string, unknown>): IHyperProfileUser {
  return {
    id: String(raw.id || ""),
    displayName: String(raw.displayName || ""),
    givenName: raw.givenName ? String(raw.givenName) : undefined,
    surname: raw.surname ? String(raw.surname) : undefined,
    userPrincipalName: String(raw.userPrincipalName || ""),
    mail: String(raw.mail || ""),
    jobTitle: raw.jobTitle ? String(raw.jobTitle) : undefined,
    department: raw.department ? String(raw.department) : undefined,
    officeLocation: raw.officeLocation ? String(raw.officeLocation) : undefined,
    city: raw.city ? String(raw.city) : undefined,
    mobilePhone: raw.mobilePhone ? String(raw.mobilePhone) : undefined,
    businessPhones: Array.isArray(raw.businessPhones) ? raw.businessPhones as string[] : undefined,
    preferredLanguage: raw.preferredLanguage ? String(raw.preferredLanguage) : undefined,
    employeeId: raw.employeeId ? String(raw.employeeId) : undefined,
    companyName: raw.companyName ? String(raw.companyName) : undefined,
    aboutMe: raw.aboutMe ? String(raw.aboutMe) : undefined,
  };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
