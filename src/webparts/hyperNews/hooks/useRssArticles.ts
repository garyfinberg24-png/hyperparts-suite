import { useState, useEffect, useRef } from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { SPHttpClient } from "@microsoft/sp-http";
import { hyperCache } from "../../../common/services/HyperCache";
import type { IHyperNewsArticle } from "../models";
import { calculateReadTime } from "../models";
import type { IRssFeedSource } from "../models/IHyperNewsSource";

export interface UseRssArticlesOptions {
  source: IRssFeedSource | undefined;
}

export interface UseRssArticlesResult {
  articles: IHyperNewsArticle[];
  loading: boolean;
  error: Error | undefined;
}

/**
 * Fetch and parse RSS/Atom feed articles.
 * Uses SP REST proxy to avoid CORS issues.
 * Polls at configured interval with hyperCache TTL.
 */
export function useRssArticles(options: UseRssArticlesOptions): UseRssArticlesResult {
  var source = options.source;

  var [articles, setArticles] = useState<IHyperNewsArticle[]>([]);
  var [loading, setLoading] = useState<boolean>(false);
  var [error, setError] = useState<Error | undefined>(undefined);
  // eslint-disable-next-line @rushstack/no-new-null
  var timerRef = useRef<number>(0);

  useEffect(function () {
    if (!source || !source.enabled || !source.feedUrl) {
      setArticles([]);
      setLoading(false);
      return;
    }

    var cancelled = { value: false };
    var feedUrl = source.feedUrl;
    var maxItems = source.maxItems || 20;
    var pollingMs = (source.pollingIntervalMinutes || 60) * 60 * 1000;
    var cacheKey = "rssArticles:" + feedUrl;

    var fetchFeed = function (): void {
      setLoading(true);
      setError(undefined);

      fetchRssFeed(feedUrl, maxItems, cacheKey, pollingMs)
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
    };

    fetchFeed();

    // Set up polling
    if (pollingMs > 0) {
      timerRef.current = window.setInterval(fetchFeed, pollingMs);
    }

    return function () {
      cancelled.value = true;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = 0;
      }
    };
  }, [source]);

  return { articles: articles, loading: loading, error: error };
}

/**
 * Fetch RSS feed via SP WebProxy and parse XML.
 */
async function fetchRssFeed(
  feedUrl: string,
  maxItems: number,
  cacheKey: string,
  cacheTTL: number
): Promise<IHyperNewsArticle[]> {
  // Try cache first
  var cached = await hyperCache.get<IHyperNewsArticle[]>(cacheKey);
  if (cached) return cached;

  var ctx = getContext();
  var proxyUrl = ctx.pageContext.web.absoluteUrl + "/_api/SP.WebProxy/invoke";

  var body = JSON.stringify({
    requestInfo: {
      __metadata: { type: "SP.WebRequestInfo" },
      Url: feedUrl,
      Method: "GET",
      Headers: {
        results: [
          {
            __metadata: { type: "SP.KeyValue" },
            Key: "Accept",
            Value: "application/rss+xml, application/atom+xml, application/xml, text/xml",
            ValueType: "Edm.String",
          },
        ],
      },
    },
  });

  var response = await ctx.spHttpClient.post(
    proxyUrl,
    SPHttpClient.configurations.v1,
    {
      body: body,
      headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch RSS feed: " + String(response.status));
  }

  var json = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var proxyResult = json as Record<string, any>;
  var statusCode = proxyResult.d ? proxyResult.d.Invoke.StatusCode : 0;

  if (statusCode !== 200) {
    throw new Error("RSS proxy returned status " + String(statusCode));
  }

  var xmlString = proxyResult.d.Invoke.Body || "";
  var parsed = parseRssXml(xmlString, maxItems);

  await hyperCache.set(cacheKey, parsed, cacheTTL);

  return parsed;
}

/**
 * Parse RSS/Atom XML string into IHyperNewsArticle array.
 */
function parseRssXml(xmlString: string, maxItems: number): IHyperNewsArticle[] {
  var result: IHyperNewsArticle[] = [];

  try {
    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlString, "text/xml");

    // Try RSS 2.0 <item> elements first
    var rssItems = doc.querySelectorAll("item");
    if (rssItems.length === 0) {
      // Try Atom <entry> elements
      rssItems = doc.querySelectorAll("entry");
    }

    for (var i = 0; i < rssItems.length && result.length < maxItems; i++) {
      var item = rssItems[i];
      var title = getElementText(item, "title");
      if (!title) continue;

      var link = getElementText(item, "link");
      // Atom links may be in href attribute
      if (!link) {
        var linkEl = item.querySelector("link");
        if (linkEl) {
          link = linkEl.getAttribute("href") || "";
        }
      }

      var description = getElementText(item, "description")
        || getElementText(item, "summary")
        || getElementText(item, "content")
        || "";

      var pubDate = getElementText(item, "pubDate")
        || getElementText(item, "published")
        || getElementText(item, "updated")
        || "";

      var author = getElementText(item, "author")
        || getElementText(item, "dc:creator")
        || "";

      var imageUrl = "";
      // Try media:thumbnail or media:content
      var mediaEl = item.querySelector("thumbnail") || item.querySelector("content[url]");
      if (mediaEl) {
        imageUrl = mediaEl.getAttribute("url") || "";
      }
      // Try enclosure with image type
      if (!imageUrl) {
        var enclosure = item.querySelector("enclosure");
        if (enclosure) {
          var encType = enclosure.getAttribute("type") || "";
          if (encType.indexOf("image") !== -1) {
            imageUrl = enclosure.getAttribute("url") || "";
          }
        }
      }

      var category = getElementText(item, "category") || "";

      // Strip HTML from description for clean text
      var cleanDesc = description.replace(/<[^>]*>/g, "").trim();
      // Truncate to 300 chars
      if (cleanDesc.length > 300) {
        cleanDesc = cleanDesc.substring(0, 297) + "...";
      }

      result.push({
        Id: 60000 + i,
        Title: title,
        Created: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        Modified: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        Author: author ? { Id: 0, Title: author } : undefined,
        BannerImageUrl: imageUrl,
        Description: cleanDesc,
        FirstPublishedDate: pubDate ? new Date(pubDate).toISOString() : undefined,
        FileRef: link,
        FileLeafRef: link,
        Categories: category ? [category] : [],
        readTime: calculateReadTime(cleanDesc),
      });
    }
  } catch (_e) {
    // Failed to parse XML — return empty
  }

  return result;
}

/**
 * Get text content of a child element by tag name.
 */
function getElementText(parent: Element, tagName: string): string {
  var el = parent.querySelector(tagName);
  if (el && el.textContent) {
    return el.textContent.trim();
  }
  return "";
}
