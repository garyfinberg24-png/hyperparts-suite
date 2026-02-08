import type { IHyperSearchResult, SearchResultType, SearchSource } from "../models";

/**
 * Gets a string value from a search result row's cells (same pattern as HyperRollup).
 */
function getCellValue(cells: Array<{ Key: string; Value: string }>, key: string): string {
  let result = "";
  cells.forEach(function (cell) {
    if (cell.Key === key) {
      result = cell.Value || "";
    }
  });
  return result;
}

/**
 * File extensions that indicate document types.
 */
const DOCUMENT_EXTENSIONS: string[] = [
  "docx", "doc", "xlsx", "xls", "pptx", "ppt",
  "pdf", "txt", "csv", "one", "vsdx",
];

/**
 * File extensions that indicate page/web content.
 */
const PAGE_EXTENSIONS: string[] = ["aspx", "html", "htm"];

/**
 * Infers the SearchResultType from content class, file type, and path.
 */
export function inferResultType(
  contentClass: string,
  fileType: string,
  isDocument: string
): SearchResultType {
  const cc = contentClass.toLowerCase();

  // People results
  if (cc.indexOf("urn:content-class:spspeople") !== -1) {
    return "person";
  }

  // Site results
  if (cc === "sts_site" || cc === "sts_web") {
    return "site";
  }

  // Document check
  if (isDocument === "true" || isDocument === "1") {
    return "document";
  }

  const ft = fileType.toLowerCase();

  // Check known document extensions
  let isDocExt = false;
  DOCUMENT_EXTENSIONS.forEach(function (ext) {
    if (ft === ext) isDocExt = true;
  });
  if (isDocExt) return "document";

  // Check page extensions
  let isPageExt = false;
  PAGE_EXTENSIONS.forEach(function (ext) {
    if (ft === ext) isPageExt = true;
  });
  if (isPageExt) return "page";

  // List items
  if (cc.indexOf("sts_listitem") !== -1) {
    return "listItem";
  }

  return "unknown";
}

/**
 * Infers the SearchSource from the result's path URL.
 */
function inferSource(path: string): SearchSource {
  const lower = path.toLowerCase();
  if (lower.indexOf("/personal/") !== -1 || lower.indexOf("-my.sharepoint.com") !== -1) {
    return "onedrive";
  }
  return "sharepoint";
}

/**
 * Maps a SharePoint Search result row to an IHyperSearchResult.
 * The row comes from PnP sp.search() PrimarySearchResults — each result
 * is a flat Record<string,unknown> where keys are managed property names.
 */
export function mapSpSearchResult(
  row: Record<string, unknown>,
  rank: number
): IHyperSearchResult {
  // Build cells array from row for getCellValue convenience
  const cells: Array<{ Key: string; Value: string }> = [];
  Object.keys(row).forEach(function (key) {
    const val = row[key];
    if (val !== undefined) {
      cells.push({ Key: key, Value: String(val) });
    }
  });

  const path = getCellValue(cells, "Path");
  const fileType = getCellValue(cells, "FileType") || getCellValue(cells, "FileExtension");
  const contentClass = getCellValue(cells, "contentclass");
  const isDocument = getCellValue(cells, "IsDocument");

  const resultType = inferResultType(contentClass, fileType, isDocument);
  const source = inferSource(path);

  return {
    id: getCellValue(cells, "UniqueID") || path,
    title: getCellValue(cells, "Title"),
    description: getCellValue(cells, "Description"),
    url: getCellValue(cells, "ServerRedirectedURL") || path,
    author: getCellValue(cells, "Author") || getCellValue(cells, "AuthorOWSUSER"),
    authorEmail: undefined,
    modified: getCellValue(cells, "LastModifiedTime"),
    created: getCellValue(cells, "Created"),
    fileType: fileType,
    iconUrl: undefined,
    thumbnailUrl: getCellValue(cells, "PictureThumbnailURL"),
    resultType: resultType,
    source: source,
    siteName: getCellValue(cells, "SiteName"),
    path: getCellValue(cells, "SPWebUrl") || path,
    hitHighlightedSummary: getCellValue(cells, "HitHighlightedSummary"),
    rank: rank,
    fields: row,
  };
}
