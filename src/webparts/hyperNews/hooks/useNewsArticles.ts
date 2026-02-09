import { useState, useEffect, useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperNewsArticle } from "../models";
import { calculateReadTime, parseSources, parseArticles } from "../models";
import type { ISpNewsSource, ISpListSource } from "../models/IHyperNewsSource";

export interface UseNewsArticlesOptions {
  /** Serialized INewsSource[] JSON */
  sourcesJson: string;
  /** Serialized IExternalArticle[] for external links */
  externalArticlesJson: string;
  /** Serialized IExternalArticle[] for manual articles */
  manualArticlesJson: string;
  pageSize: number;
  cacheTTL?: number;
}

export interface UseNewsArticlesResult {
  articles: IHyperNewsArticle[];
  loading: boolean;
  error: Error | undefined;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useNewsArticles(options: UseNewsArticlesOptions): UseNewsArticlesResult {
  var sourcesJson = options.sourcesJson;
  var externalJson = options.externalArticlesJson;
  var manualJson = options.manualArticlesJson;
  var pageSize = options.pageSize;
  var cacheTTL = options.cacheTTL || 300000;

  var [articles, setArticles] = useState<IHyperNewsArticle[]>([]);
  var [loading, setLoading] = useState<boolean>(true);
  var [error, setError] = useState<Error | undefined>(undefined);
  var [page, setPage] = useState<number>(1);
  var [hasMore, setHasMore] = useState<boolean>(true);
  var [refreshKey, setRefreshKey] = useState<number>(0);

  var loadMore = useCallback(function (): void {
    setPage(function (prev) { return prev + 1; });
  }, []);

  var refresh = useCallback(function (): void {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    setRefreshKey(function (prev) { return prev + 1; });
  }, []);

  useEffect(function () {
    var cancelled = false;

    var fetchArticles = async function (): Promise<void> {
      var sources = parseSources(sourcesJson);

      // Default to current site SP News when no sources configured
      if (sources.length === 0) {
        sources = [{
          id: "default",
          type: "spNews",
          mode: "currentSite",
          siteUrls: [],
          hubSiteId: "",
          libraryName: "Site Pages",
          enabled: true,
        } as ISpNewsSource];
      }

      var cacheKey = "newsArticlesV2:" + sourcesJson + ":" + String(page);

      try {
        // Try cache first (skip on manual refresh)
        if (refreshKey === 0) {
          var cached = await hyperCache.get<IHyperNewsArticle[]>(cacheKey);
          if (cached && !cancelled) {
            var cachedItems = cached;
            setArticles(function (prev) { return page === 1 ? cachedItems : prev.concat(cachedItems); });
            setHasMore(cached.length >= pageSize);
            setLoading(false);
            return;
          }
        }

        var allItems: IHyperNewsArticle[] = [];
        var fetchPromises: Array<Promise<void>> = [];

        // Dispatch API-based sources
        sources.forEach(function (source) {
          if (!source.enabled) return;

          if (source.type === "spNews") {
            fetchPromises.push(
              fetchSpNewsArticles(source as ISpNewsSource, pageSize * page)
                .then(function (items) {
                  items.forEach(function (item) { allItems.push(item); });
                })
            );
          } else if (source.type === "spList") {
            fetchPromises.push(
              fetchSpListArticles(source as ISpListSource, pageSize * page)
                .then(function (items) {
                  items.forEach(function (item) { allItems.push(item); });
                })
            );
          }
          // rssFeed and graphRecommended are handled by their own hooks
          // and merged at the component level
        });

        // Merge external link articles (stored inline, no API)
        var extArticles = parseArticles(externalJson);
        var now = Date.now();
        extArticles.forEach(function (ext, idx) {
          if (ext.publishDate && new Date(ext.publishDate).getTime() > now) return;
          if (ext.unpublishDate && new Date(ext.unpublishDate).getTime() < now) return;
          allItems.push({
            Id: 50000 + idx,
            Title: ext.title || ext.url,
            Created: ext.publishedDate || ext.scrapedAt || new Date().toISOString(),
            Modified: ext.scrapedAt || new Date().toISOString(),
            Author: ext.author ? { Id: 0, Title: ext.author } : undefined,
            BannerImageUrl: ext.imageUrl,
            Description: ext.description,
            FirstPublishedDate: ext.publishedDate || ext.scrapedAt,
            FileRef: ext.ctaUrl || ext.url,
            FileLeafRef: ext.url,
            Categories: ext.category ? [ext.category] : [],
            readTime: calculateReadTime(ext.description),
          });
        });

        // Merge manual articles (stored inline, no API)
        var manArticles = parseArticles(manualJson);
        manArticles.forEach(function (manual, idx) {
          if (manual.publishDate && new Date(manual.publishDate).getTime() > now) return;
          if (manual.unpublishDate && new Date(manual.unpublishDate).getTime() < now) return;
          allItems.push({
            Id: 55000 + idx,
            Title: manual.title,
            Created: manual.publishedDate || new Date().toISOString(),
            Modified: manual.scrapedAt || new Date().toISOString(),
            Author: manual.author ? { Id: 0, Title: manual.author } : undefined,
            BannerImageUrl: manual.imageUrl,
            Description: manual.description,
            FirstPublishedDate: manual.publishedDate,
            FileRef: manual.ctaUrl || manual.url,
            Categories: manual.category ? [manual.category] : [],
            readTime: calculateReadTime(manual.description),
          });
        });

        await Promise.all(fetchPromises);

        // Sort by date descending across all sources
        allItems.sort(function (a, b) {
          var dateA = new Date(a.FirstPublishedDate || a.Created).getTime();
          var dateB = new Date(b.FirstPublishedDate || b.Created).getTime();
          return dateB - dateA;
        });

        // Paginate client-side
        var start = (page - 1) * pageSize;
        var pageItems = allItems.slice(start, start + pageSize);

        await hyperCache.set(cacheKey, pageItems, cacheTTL);

        if (!cancelled) {
          setArticles(function (prev) { return page === 1 ? pageItems : prev.concat(pageItems); });
          setHasMore(pageItems.length >= pageSize);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    setLoading(true);
    setError(undefined);
    fetchArticles().catch(function () {
      /* errors handled above */
    });

    return function () {
      cancelled = true;
    };
  }, [sourcesJson, externalJson, manualJson, pageSize, page, cacheTTL, refreshKey]);

  return { articles: articles, loading: loading, error: error, hasMore: hasMore, loadMore: loadMore, refresh: refresh };
}

// ── Per-source-type inline fetch helpers ──

async function fetchSpNewsArticles(
  source: ISpNewsSource,
  topN: number
): Promise<IHyperNewsArticle[]> {
  var sp = getSP();
  var libraryName = source.libraryName || "Site Pages";
  var results: IHyperNewsArticle[] = [];

  var items = await sp.web.lists
    .getByTitle(libraryName)
    .items.select(
      "Id",
      "Title",
      "Description",
      "BannerImageUrl",
      "FirstPublishedDate",
      "Created",
      "Modified",
      "FileRef",
      "PromotedState",
      "Author/Id",
      "Author/Title",
      "Author/EMail",
      "Editor/Id",
      "Editor/Title"
    )
    .expand("Author", "Editor")
    .filter("PromotedState eq 2")
    .orderBy("FirstPublishedDate", false)
    .top(topN)();

  (items as IHyperNewsArticle[]).forEach(function (item) {
    results.push({
      ...item,
      readTime: calculateReadTime(item.Description),
    });
  });

  return results;
}

async function fetchSpListArticles(
  source: ISpListSource,
  topN: number
): Promise<IHyperNewsArticle[]> {
  var sp = getSP();
  var mapping = source.columnMapping;
  var selectFields: string[] = ["Id"];

  if (mapping.titleField) selectFields.push(mapping.titleField);
  if (mapping.bodyField) selectFields.push(mapping.bodyField);
  if (mapping.imageField) selectFields.push(mapping.imageField);
  if (mapping.dateField) selectFields.push(mapping.dateField);
  if (mapping.authorField) selectFields.push(mapping.authorField);
  if (mapping.categoryField) selectFields.push(mapping.categoryField);
  if (mapping.linkField) selectFields.push(mapping.linkField);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var items: any[] = await sp.web.lists
    .getByTitle(source.listName)
    .items.select.apply(
      sp.web.lists.getByTitle(source.listName).items,
      selectFields
    )
    .top(topN)();

  var results: IHyperNewsArticle[] = [];
  items.forEach(function (item: Record<string, unknown>, idx: number) {
    results.push({
      Id: Number(item.Id) || (10000 + idx),
      Title: String(item[mapping.titleField] || ""),
      Created: String(item[mapping.dateField] || ""),
      Modified: String(item[mapping.dateField] || ""),
      Author: item[mapping.authorField]
        ? { Id: 0, Title: String(item[mapping.authorField]) }
        : undefined,
      BannerImageUrl: String(item[mapping.imageField] || ""),
      Description: String(item[mapping.bodyField] || ""),
      FirstPublishedDate: String(item[mapping.dateField] || ""),
      FileRef: String(item[mapping.linkField] || ""),
      Categories: item[mapping.categoryField]
        ? [String(item[mapping.categoryField])]
        : [],
      readTime: calculateReadTime(String(item[mapping.bodyField] || "")),
    });
  });

  return results;
}
