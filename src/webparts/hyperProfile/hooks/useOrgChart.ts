import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IProfileOrgNode } from "../models/IHyperProfileOrgNode";

export interface IOrgChartResult {
  orgTree: IProfileOrgNode | undefined;
  loading: boolean;
  error: Error | undefined;
}

const ORG_FIELDS = "id,displayName,jobTitle,mail,userPrincipalName";

/**
 * Hook to build an org tree (manager + direct reports) from Microsoft Graph.
 * Fetches current user's manager and direct reports, one level deep.
 */
export function useOrgChart(
  userId: string | undefined,
  enabled: boolean
): IOrgChartResult {
  const [orgTree, setOrgTree] = React.useState<IProfileOrgNode | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(function () {
    if (!enabled || !userId) {
      setOrgTree(undefined);
      return undefined;
    }

    let cancelled = false;
    const capturedUserId = userId;
    const cacheKey = "hyperProfile_org_" + capturedUserId;

    async function fetchOrg(): Promise<void> {
      setLoading(true);

      try {
        const cached = await hyperCache.get<IProfileOrgNode>(cacheKey);
        if (cached && !cancelled) {
          setOrgTree(cached);
          setLoading(false);
          return;
        }

        const ctx = getContext();
        const client = await ctx.msGraphClientFactory.getClient("3");

        // Fetch current user
        const endpoint = "/users/" + encodeURIComponent(capturedUserId);
        const userRaw = await client.api(endpoint).select(ORG_FIELDS).get();

        const currentNode: IProfileOrgNode = {
          id: String(userRaw.id || ""),
          displayName: String(userRaw.displayName || ""),
          jobTitle: userRaw.jobTitle ? String(userRaw.jobTitle) : undefined,
          mail: userRaw.mail ? String(userRaw.mail) : undefined,
          isCurrentUser: true,
          directReports: [],
        };

        // Fetch direct reports
        try {
          const reportsRaw = await client.api(endpoint + "/directReports")
            .select(ORG_FIELDS).top(20).get();
          const reportsList = reportsRaw.value || [];
          reportsList.forEach(function (rep: Record<string, unknown>) {
            currentNode.directReports.push({
              id: String(rep.id || ""),
              displayName: String(rep.displayName || ""),
              jobTitle: rep.jobTitle ? String(rep.jobTitle) : undefined,
              mail: rep.mail ? String(rep.mail) : undefined,
              isCurrentUser: false,
              directReports: [],
            });
          });
        } catch {
          // No direct reports or insufficient permissions
        }

        // Fetch manager and build tree
        try {
          const mgrRaw = await client.api(endpoint + "/manager").select(ORG_FIELDS).get();
          const managerNode: IProfileOrgNode = {
            id: String(mgrRaw.id || ""),
            displayName: String(mgrRaw.displayName || ""),
            jobTitle: mgrRaw.jobTitle ? String(mgrRaw.jobTitle) : undefined,
            mail: mgrRaw.mail ? String(mgrRaw.mail) : undefined,
            isCurrentUser: false,
            directReports: [currentNode],
            manager: undefined,
          };
          currentNode.manager = managerNode;

          if (!cancelled) {
            setOrgTree(managerNode);
            await hyperCache.set(cacheKey, managerNode, 600);
          }
        } catch {
          // No manager — current user is root
          if (!cancelled) {
            setOrgTree(currentNode);
            await hyperCache.set(cacheKey, currentNode, 600);
          }
        }

        if (!cancelled) {
          setError(undefined);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrg().catch(function () { /* handled inside */ });
    return function () { cancelled = true; };
  }, [userId, enabled]);

  return { orgTree: orgTree, loading: loading, error: error };
}
