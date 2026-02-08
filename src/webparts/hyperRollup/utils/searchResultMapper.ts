import type { IHyperRollupItem } from "../models";

/**
 * Map of SharePoint Search managed property names to IHyperRollupItem fields.
 * Search results use different property names than list items.
 */
const MANAGED_PROPERTY_MAP: Record<string, string> = {
  Title: "title",
  Description: "description",
  Author: "author",
  AuthorOWSUSER: "author",
  EditorOWSUSER: "editor",
  Created: "created",
  LastModifiedTime: "modified",
  Path: "fileRef",
  FileType: "fileType",
  ContentType: "contentType",
  SPSiteURL: "sourceSiteUrl",
  SiteName: "sourceSiteName",
  ListID: "sourceListId",
  ListItemID: "itemId",
};

/**
 * The list of managed properties to request from SharePoint Search.
 */
export const SEARCH_SELECT_PROPERTIES: string[] = [
  "Title",
  "Description",
  "Author",
  "AuthorOWSUSER",
  "EditorOWSUSER",
  "Created",
  "LastModifiedTime",
  "Path",
  "FileType",
  "ContentType",
  "SPSiteURL",
  "SPWebUrl",
  "SiteName",
  "ListID",
  "ListItemID",
  "UniqueID",
];

/**
 * Gets a string value from a search result row's cells.
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
 * Maps a single SharePoint Search result row to an IHyperRollupItem.
 */
export function mapSearchResult(cells: Array<{ Key: string; Value: string }>): IHyperRollupItem {
  const listId = getCellValue(cells, "ListID");
  const itemIdStr = getCellValue(cells, "ListItemID");
  const itemId = parseInt(itemIdStr, 10) || 0;

  // Build fields record from all cells
  const fields: Record<string, unknown> = {};
  cells.forEach(function (cell) {
    if (cell.Value) {
      const mapped = MANAGED_PROPERTY_MAP[cell.Key];
      if (mapped) {
        fields[mapped] = cell.Value;
      }
      fields[cell.Key] = cell.Value;
    }
  });

  return {
    id: listId + ":" + String(itemId),
    itemId: itemId,
    title: getCellValue(cells, "Title"),
    description: getCellValue(cells, "Description"),
    author: getCellValue(cells, "Author") || getCellValue(cells, "AuthorOWSUSER"),
    authorEmail: undefined,
    editor: getCellValue(cells, "EditorOWSUSER"),
    created: getCellValue(cells, "Created"),
    modified: getCellValue(cells, "LastModifiedTime"),
    fileRef: getCellValue(cells, "Path"),
    fileType: getCellValue(cells, "FileType"),
    contentType: getCellValue(cells, "ContentType"),
    category: undefined,
    fields: fields,
    sourceSiteUrl: getCellValue(cells, "SPSiteURL"),
    sourceSiteName: getCellValue(cells, "SiteName"),
    sourceListId: listId,
    sourceListName: "",
    isFromSearch: true,
  };
}
