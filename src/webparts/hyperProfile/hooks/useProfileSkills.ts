import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IProfileSkill } from "../models/IHyperProfileSkill";

export interface IProfileSkillsResult {
  skills: IProfileSkill[];
  loading: boolean;
  error: Error | undefined;
}

/**
 * Hook to fetch user skills from a SharePoint list.
 * If no listName is provided, returns empty skills.
 * List schema: Title (skill name), Level (1-5), EndorsementCount (number),
 * EndorsedBy (multi-line text, semicolon-separated), Category (choice)
 */
export function useProfileSkills(
  userId: string | undefined,
  listName: string | undefined,
  enabled: boolean
): IProfileSkillsResult {
  const [skills, setSkills] = React.useState<IProfileSkill[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(function () {
    if (!enabled || !listName || !userId) {
      setSkills([]);
      return undefined;
    }

    let cancelled = false;
    const capturedListName = listName;
    const capturedUserId = userId;
    const cacheKey = "hyperProfile_skills_" + capturedUserId;

    async function fetchSkills(): Promise<void> {
      setLoading(true);

      try {
        const cached = await hyperCache.get<IProfileSkill[]>(cacheKey);
        if (cached && !cancelled) {
          setSkills(cached);
          setLoading(false);
          return;
        }

        const ctx = getContext();
        const siteUrl = ctx.pageContext.web.absoluteUrl;

        // Fetch from SP list via PnP-style REST
        const { SPFx, spfi } = await import(/* webpackChunkName: 'pnp-sp' */ "@pnp/sp");
        await import("@pnp/sp/webs");
        await import("@pnp/sp/lists");
        await import("@pnp/sp/items");

        const sp = spfi(siteUrl).using(SPFx(ctx));
        const items = await sp.web.lists.getByTitle(capturedListName).items
          .filter("UserId eq '" + userId + "'")
          .select("Title", "Level", "EndorsementCount", "EndorsedBy", "Category")
          .top(50)();

        if (cancelled) return;

        const mapped: IProfileSkill[] = [];
        items.forEach(function (item: Record<string, unknown>) {
          const endorsedByStr = item.EndorsedBy ? String(item.EndorsedBy) : "";
          const endorsedByArr = endorsedByStr ? endorsedByStr.split(";").map(function (s) { return s.trim(); }) : [];

          mapped.push({
            name: String(item.Title || ""),
            level: Number(item.Level) || 1,
            endorsementCount: Number(item.EndorsementCount) || 0,
            endorsedBy: endorsedByArr,
            category: item.Category ? String(item.Category) : "",
          });
        });

        if (!cancelled) {
          setSkills(mapped);
          await hyperCache.set(cacheKey, mapped, 300);
          setError(undefined);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setSkills([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSkills().catch(function () { /* handled inside */ });
    return function () { cancelled = true; };
  }, [userId, listName, enabled]);

  return { skills: skills, loading: loading, error: error };
}
