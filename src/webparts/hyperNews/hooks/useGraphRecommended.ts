import { useState, useEffect } from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperNewsArticle } from "../models";
import type { IGraphRecommendedSource } from "../models/IHyperNewsSource";

export interface UseGraphRecommendedOptions {
  source: IGraphRecommendedSource | undefined;
}

export interface UseGraphRecommendedResult {
  articles: IHyperNewsArticle[];
  loading: boolean;
  error: Error | undefined;
}

/** Graph insight resource shape */
interface IInsightResource {
  id?: string;
  resourceVisualization?: {
    title?: string;
    previewImageUrl?: string;
    type?: string;
    containerDisplayName?: string;
  };
  resourceReference?: {
    webUrl?: string;
    id?: string;
    type?: string;
  };
  lastUsed?: {
    lastAccessedDateTime?: string;
    lastModifiedDateTime?: string;
  };
}

/**
 * Fetch recommended/trending content from Microsoft Graph insights API.
 * Uses MSGraphClientV3 for auth'd calls.
 * Filters for news-like content (pages, documents).
 */
export function useGraphRecommended(options: UseGraphRecommendedOptions): UseGraphRecommendedResult {
  var source = options.source;

  var [articles, setArticles] = useState<IHyperNewsArticle[]>([]);
  var [loading, setLoading] = useState<boolean>(false);
  var [error, setError] = useState<Error | undefined>(undefined);

  useEffect(function () {
    if (!source || !source.enabled) {
      setArticles([]);
      setLoading(false);
      return;
    }

    var cancelled = { value: false };
    var insightType = source.insightType || "trending";
    var maxItems = source.maxItems || 10;
    var cacheKey = "graphRecommended:" + insightType + ":" + String(maxItems);

    setLoading(true);
    setError(undefined);

    fetchGraphInsights(insightType, maxItems, cacheKey)
      .then(function (result) {
        if (!cancelled.value) {
          setArticles(result);
          setLoading(false);
        }
      })
      .catch(function (err) {
        if (!cancelled.value) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return function () {
      cancelled.value = true;
    };
  }, [source]);

  return { articles: articles, loading: loading, error: error };
}

/**
 * Fetch insights from Graph API via MSGraphClientV3.
 */
async function fetchGraphInsights(
  insightType: string,
  maxItems: number,
  cacheKey: string
): Promise<IHyperNewsArticle[]> {
  // Try cache first (5 min TTL)
  var cached = await hyperCache.get<IHyperNewsArticle[]>(cacheKey);
  if (cached) return cached;

  var ctx = getContext();
  var graphClient = await ctx.msGraphClientFactory.getClient("3");

  // Build the API path
  var apiPath = "/me/insights/" + insightType;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var response: any = await graphClient
    .api(apiPath)
    .top(maxItems * 2) // Fetch extra to allow filtering
    .get();

  var insights: IInsightResource[] = (response && response.value) ? response.value : [];
  var result: IHyperNewsArticle[] = [];

  insights.forEach(function (insight, idx) {
    if (result.length >= maxItems) return;

    var vis = insight.resourceVisualization;
    var ref = insight.resourceReference;

    // Filter for web/page content (skip non-web resources)
    if (vis && vis.type) {
      var resourceType = vis.type.toLowerCase();
      if (resourceType.indexOf("web") === -1 &&
          resourceType.indexOf("page") === -1 &&
          resourceType.indexOf("news") === -1 &&
          resourceType.indexOf("document") === -1) {
        return;
      }
    }

    var title = (vis && vis.title) ? vis.title : "Untitled";
    var imageUrl = (vis && vis.previewImageUrl) ? vis.previewImageUrl : "";
    var webUrl = (ref && ref.webUrl) ? ref.webUrl : "";
    var containerName = (vis && vis.containerDisplayName) ? vis.containerDisplayName : "";
    var dateStr = "";
    if (insight.lastUsed) {
      dateStr = insight.lastUsed.lastModifiedDateTime || insight.lastUsed.lastAccessedDateTime || "";
    }

    result.push({
      Id: 70000 + idx,
      Title: title,
      Created: dateStr || new Date().toISOString(),
      Modified: dateStr || new Date().toISOString(),
      BannerImageUrl: imageUrl,
      Description: containerName ? "From " + containerName : "",
      FirstPublishedDate: dateStr || undefined,
      FileRef: webUrl,
      FileLeafRef: webUrl,
      Categories: [],
      readTime: 1,
    });
  });

  await hyperCache.set(cacheKey, result, 300000);

  return result;
}
