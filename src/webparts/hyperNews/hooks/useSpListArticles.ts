import { useState, useEffect, useCallback } from "react";
import { getSP } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperNewsArticle } from "../models";
import { calculateReadTime } from "../models";
import type { ISpListSource } from "../models/IHyperNewsSource";

export interface UseSpListArticlesOptions {
  source: ISpListSource | undefined;
  pageSize: number;
}

export interface UseSpListArticlesResult {
  articles: IHyperNewsArticle[];
  loading: boolean;
  error: Error | undefined;
}

/**
 * Fetch articles from a structured SharePoint list using column mapping.
 * Maps custom column names → IHyperNewsArticle fields.
 */
export function useSpListArticles(options: UseSpListArticlesOptions): UseSpListArticlesResult {
  const { source, pageSize } = options;

  const [articles, setArticles] = useState<IHyperNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchArticles = useCallback(async function (
    src: ISpListSource,
    cancelled: { value: boolean }
  ): Promise<void> {
    const cacheKey = "spListArticles:" + src.siteUrl + ":" + src.listName;

    try {
      // Try cache first
      var cached = await hyperCache.get<IHyperNewsArticle[]>(cacheKey);
      if (cached && !cancelled.value) {
        setArticles(cached);
        setLoading(false);
        return;
      }

      var sp = getSP();
      var mapping = src.columnMapping;

      // Build select fields from mapping
      var selectFields: string[] = ["Id"];
      if (mapping.titleField) selectFields.push(mapping.titleField);
      if (mapping.bodyField) selectFields.push(mapping.bodyField);
      if (mapping.imageField) selectFields.push(mapping.imageField);
      if (mapping.dateField) selectFields.push(mapping.dateField);
      if (mapping.authorField) selectFields.push(mapping.authorField);
      if (mapping.categoryField) selectFields.push(mapping.categoryField);
      if (mapping.linkField) selectFields.push(mapping.linkField);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      var items: any[];

      if (src.siteUrl) {
        // Cross-site query — use sp.web on the remote site
        // PnP v4 approach: use the site URL directly
        var remoteSp = getSP();
        items = await remoteSp.web.lists
          .getByTitle(src.listName)
          .items.select.apply(
            remoteSp.web.lists.getByTitle(src.listName).items,
            selectFields
          )
          .top(pageSize)();
      } else {
        items = await sp.web.lists
          .getByTitle(src.listName)
          .items.select.apply(
            sp.web.lists.getByTitle(src.listName).items,
            selectFields
          )
          .top(pageSize)();
      }

      var mapped: IHyperNewsArticle[] = [];
      items.forEach(function (item: Record<string, unknown>, idx: number) {
        var title = String(item[mapping.titleField] || "");
        var body = String(item[mapping.bodyField] || "");
        var imageUrl = String(item[mapping.imageField] || "");
        var dateStr = String(item[mapping.dateField] || "");
        var authorStr = String(item[mapping.authorField] || "");
        var categoryStr = String(item[mapping.categoryField] || "");
        var linkUrl = String(item[mapping.linkField] || "");

        mapped.push({
          Id: Number(item.Id) || (10000 + idx),
          Title: title,
          Created: dateStr,
          Modified: dateStr,
          Author: authorStr ? { Id: 0, Title: authorStr } : undefined,
          BannerImageUrl: imageUrl,
          Description: body,
          FirstPublishedDate: dateStr,
          FileRef: linkUrl,
          Categories: categoryStr ? [categoryStr] : [],
          readTime: calculateReadTime(body),
        });
      });

      await hyperCache.set(cacheKey, mapped, 300000);

      if (!cancelled.value) {
        setArticles(mapped);
        setLoading(false);
      }
    } catch (err) {
      if (!cancelled.value) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    }
  }, [pageSize]);

  useEffect(function () {
    if (!source || !source.enabled || !source.listName) {
      setArticles([]);
      setLoading(false);
      return;
    }

    var cancelled = { value: false };
    setLoading(true);
    setError(undefined);
    fetchArticles(source, cancelled).catch(function () {
      /* errors handled above */
    });

    return function () {
      cancelled.value = true;
    };
  }, [source, fetchArticles]);

  return { articles: articles, loading: loading, error: error };
}
