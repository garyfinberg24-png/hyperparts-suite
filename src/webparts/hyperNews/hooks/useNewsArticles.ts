import { useState, useEffect, useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperNewsArticle, INewsSource } from "../models";
import { calculateReadTime } from "../models";

export interface UseNewsArticlesOptions {
  sources: INewsSource[];
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
  const { sources, pageSize, cacheTTL = 300000 } = options;

  const [articles, setArticles] = useState<IHyperNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const loadMore = useCallback((): void => {
    setPage((prev) => prev + 1);
  }, []);

  const refresh = useCallback((): void => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchArticles = async (): Promise<void> => {
      // Default to current site when no sources configured
      const effectiveSources: INewsSource[] =
        sources.length === 0
          ? [{ id: "default", type: "currentSite", libraryName: "Site Pages" }]
          : sources;

      const cacheKey = "newsArticles:" + JSON.stringify(effectiveSources) + ":" + String(page);

      try {
        // Try cache first (skip on manual refresh)
        if (refreshKey === 0) {
          const cached = await hyperCache.get<IHyperNewsArticle[]>(cacheKey);
          if (cached && !cancelled) {
            setArticles((prev) => (page === 1 ? cached : prev.concat(cached)));
            setHasMore(cached.length >= pageSize);
            setLoading(false);
            return;
          }
        }

        const sp = getSP();
        const allItems: IHyperNewsArticle[] = [];

        // Fetch from each source in parallel
        const fetchPromises: Array<Promise<void>> = [];

        effectiveSources.forEach((source) => {
          const p = (async (): Promise<void> => {
            const libraryName = source.libraryName || "Site Pages";

            const items = await sp.web.lists
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
              .top(pageSize * page)();

            (items as IHyperNewsArticle[]).forEach((item) => {
              allItems.push({
                ...item,
                readTime: calculateReadTime(item.Description),
              });
            });
          })();

          fetchPromises.push(p);
        });

        await Promise.all(fetchPromises);

        // Sort by FirstPublishedDate descending across all sources
        allItems.sort((a, b) => {
          const dateA = new Date(a.FirstPublishedDate || a.Created).getTime();
          const dateB = new Date(b.FirstPublishedDate || b.Created).getTime();
          return dateB - dateA;
        });

        // Paginate client-side
        const start = (page - 1) * pageSize;
        const pageItems = allItems.slice(start, start + pageSize);

        await hyperCache.set(cacheKey, pageItems, cacheTTL);

        if (!cancelled) {
          setArticles((prev) => (page === 1 ? pageItems : prev.concat(pageItems)));
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
    fetchArticles().catch(() => {
      /* errors handled above */
    });

    return () => {
      cancelled = true;
    };
  }, [sources, pageSize, page, cacheTTL, refreshKey]);

  return { articles, loading, error, hasMore, loadMore, refresh };
}
