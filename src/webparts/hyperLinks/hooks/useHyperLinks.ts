import * as React from "react";
import type { IHyperLink, IHyperLinkGroup } from "../models";
import { parseLinks, parseGroups } from "../utils/linkParser";

export interface IGroupedLinks {
  groupName: string;
  links: IHyperLink[];
}

export interface IUseHyperLinksResult {
  links: IHyperLink[];
  groupedLinks: IGroupedLinks[];
}

/** Parse links JSON, filter disabled, sort by group + sortOrder */
export function useHyperLinks(
  linksJson: string,
  groupsJson: string,
  enableGrouping: boolean
): IUseHyperLinksResult {
  const links = React.useMemo(function () {
    const parsed = parseLinks(linksJson);
    return parsed
      .filter(function (link) { return link.enabled !== false; })
      .sort(function (a, b) { return a.sortOrder - b.sortOrder; });
  }, [linksJson]);

  const groups = React.useMemo(function () {
    return parseGroups(groupsJson);
  }, [groupsJson]);

  const groupedLinks = React.useMemo(function (): IGroupedLinks[] {
    if (!enableGrouping) return [];

    const grouped: Record<string, IHyperLink[]> = {};
    const ungrouped: IHyperLink[] = [];

    links.forEach(function (link) {
      if (link.groupName) {
        if (!grouped[link.groupName]) {
          grouped[link.groupName] = [];
        }
        grouped[link.groupName].push(link);
      } else {
        ungrouped.push(link);
      }
    });

    const result: IGroupedLinks[] = [];

    // Add groups in config order first
    groups.forEach(function (g: IHyperLinkGroup) {
      if (grouped[g.name] && grouped[g.name].length > 0) {
        result.push({ groupName: g.name, links: grouped[g.name] });
        delete grouped[g.name];
      }
    });

    // Add remaining grouped links not in config
    Object.keys(grouped).forEach(function (name) {
      if (grouped[name].length > 0) {
        result.push({ groupName: name, links: grouped[name] });
      }
    });

    // Add ungrouped at beginning
    if (ungrouped.length > 0) {
      result.unshift({ groupName: "", links: ungrouped });
    }

    return result;
  }, [links, groups, enableGrouping]);

  return { links: links, groupedLinks: groupedLinks };
}
