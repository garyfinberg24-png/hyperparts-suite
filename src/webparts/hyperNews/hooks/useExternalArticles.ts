import { useState, useEffect } from "react";
import type { IHyperNewsArticle } from "../models";
import { calculateReadTime, parseArticles } from "../models";
import type { IExternalArticle } from "../models/IExternalArticle";

export interface UseExternalArticlesOptions {
  /** Serialized IExternalArticle[] JSON */
  articlesJson: string;
  /** Source label to tag on each article */
  sourceLabel: string;
}

export interface UseExternalArticlesResult {
  articles: IHyperNewsArticle[];
}

/**
 * Parse stored external/manual articles from JSON and map to IHyperNewsArticle.
 * These articles are stored inline in web part properties (no API call needed).
 */
export function useExternalArticles(options: UseExternalArticlesOptions): UseExternalArticlesResult {
  var _options = options;
  var [articles, setArticles] = useState<IHyperNewsArticle[]>([]);

  useEffect(function () {
    var parsed: IExternalArticle[] = parseArticles(_options.articlesJson);
    var mapped: IHyperNewsArticle[] = [];
    var now = Date.now();

    parsed.forEach(function (ext, idx) {
      // Check scheduling
      if (ext.publishDate) {
        var pubTime = new Date(ext.publishDate).getTime();
        if (pubTime > now) return; // Not yet published
      }
      if (ext.unpublishDate) {
        var unpubTime = new Date(ext.unpublishDate).getTime();
        if (unpubTime < now) return; // Already unpublished
      }

      mapped.push({
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

    setArticles(mapped);
  }, [_options.articlesJson, _options.sourceLabel]);

  return { articles: articles };
}
