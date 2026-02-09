import { getContext } from "../../../common/services/HyperPnP";
import { SPHttpClient, type SPHttpClientResponse } from "@microsoft/sp-http";
import type { IExternalArticle } from "../models/IExternalArticle";
import { generateArticleId } from "../models/IExternalArticle";

// ============================================================
// URL Metadata Scraper — Client-side via SP REST
// ============================================================

/**
 * Scrape Open Graph / meta tag metadata from an external URL.
 * Uses SharePoint's REST proxy to avoid CORS issues.
 * Falls back to manual metadata entry hints on failure.
 */
export async function scrapeUrlMetadata(url: string): Promise<IExternalArticle> {
  const ctx = getContext();
  const article: IExternalArticle = {
    id: generateArticleId(),
    url: url,
    title: "",
    description: "",
    imageUrl: "",
    author: "",
    publishedDate: "",
    category: "",
    sourceLabel: extractDomain(url),
    ctaUrl: url,
    ctaText: "Read More",
    scrapedAt: new Date().toISOString(),
    publishDate: "",
    unpublishDate: "",
  };

  try {
    // Use SPHttpClient to fetch the external page via SP proxy
    const proxyUrl = ctx.pageContext.web.absoluteUrl +
      "/_api/SP.WebProxy/invoke";

    const body = JSON.stringify({
      requestInfo: {
        __metadata: { type: "SP.WebRequestInfo" },
        Url: url,
        Method: "GET",
        Headers: {
          results: [
            {
              __metadata: { type: "SP.KeyValue" },
              Key: "Accept",
              Value: "text/html",
              ValueType: "Edm.String",
            },
          ],
        },
      },
    });

    const response: SPHttpClientResponse = await ctx.spHttpClient.post(
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

    if (response.ok) {
      const json = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const proxyResult = json as Record<string, any>;
      const statusCode = proxyResult.d
        ? proxyResult.d.Invoke.StatusCode
        : 0;

      if (statusCode === 200) {
        const html = proxyResult.d.Invoke.Body || "";
        parseHtmlMetadata(html, article);
      }
    }
  } catch (_err) {
    // Scraping failed — return article with just the URL filled in
    // User can manually fill metadata in the wizard
  }

  // If title is still empty, use the URL as fallback
  if (!article.title) {
    article.title = url;
  }

  return article;
}

/**
 * Parse HTML string for Open Graph and standard meta tags.
 */
function parseHtmlMetadata(html: string, article: IExternalArticle): void {
  // Extract OG tags first (highest priority)
  article.title = extractMetaContent(html, "og:title")
    || extractTagContent(html, "title")
    || "";

  article.description = extractMetaContent(html, "og:description")
    || extractMetaContent(html, "description")
    || "";

  article.imageUrl = extractMetaContent(html, "og:image") || "";

  article.author = extractMetaContent(html, "article:author")
    || extractMetaContent(html, "author")
    || "";

  article.publishedDate = extractMetaContent(html, "article:published_time")
    || extractMetaContent(html, "datePublished")
    || "";

  // Try to extract site name for sourceLabel
  const siteName = extractMetaContent(html, "og:site_name");
  if (siteName) {
    article.sourceLabel = siteName;
  }
}

/**
 * Extract content attribute from a meta tag by property or name.
 * Handles both property="og:xxx" and name="xxx" patterns.
 */
function extractMetaContent(html: string, tagName: string): string {
  // Try property="tagName" first
  var propPattern = new RegExp(
    '<meta[^>]+(?:property|name)=["\']' + escapeRegex(tagName) + '["\'][^>]+content=["\']([^"\']*)["\']',
    "i"
  );
  var match = propPattern.exec(html);
  if (match) return decodeHtmlEntities(match[1]);

  // Try content="..." before property="tagName"
  var reversePattern = new RegExp(
    '<meta[^>]+content=["\']([^"\']*)["\'][^>]+(?:property|name)=["\']' + escapeRegex(tagName) + '["\']',
    "i"
  );
  var reverseMatch = reversePattern.exec(html);
  if (reverseMatch) return decodeHtmlEntities(reverseMatch[1]);

  return "";
}

/**
 * Extract text content from an HTML tag (e.g. <title>text</title>).
 */
function extractTagContent(html: string, tagName: string): string {
  var pattern = new RegExp(
    "<" + tagName + "[^>]*>([^<]*)</" + tagName + ">",
    "i"
  );
  var match = pattern.exec(html);
  if (match) return decodeHtmlEntities(match[1].trim());
  return "";
}

/**
 * Extract domain from URL for sourceLabel fallback.
 */
function extractDomain(url: string): string {
  try {
    var parts = url.split("//");
    if (parts.length > 1) {
      var hostParts = parts[1].split("/");
      return hostParts[0];
    }
  } catch (_e) {
    // ignore
  }
  return "External";
}

/**
 * Escape special regex characters.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Decode basic HTML entities.
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}
