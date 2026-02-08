import { getContext } from "../../../common/services/HyperPnP";
import type { IHyperSearchResult, SearchSource, SearchResultType } from "../models";

/**
 * Graph Search entity type mappings for our scopes.
 */
export function getEntityTypes(scope: string): string[] {
  switch (scope) {
    case "teams":
      return ["chatMessage"];
    case "exchange":
      return ["message"];
    case "onedrive":
      return ["driveItem"];
    case "sharepoint":
      return ["driveItem", "listItem", "site"];
    case "everything":
      return ["driveItem", "listItem", "site", "chatMessage", "message"];
    default:
      return ["driveItem", "listItem", "site"];
  }
}

/**
 * Infers result type from Graph Search entity type.
 */
function inferGraphResultType(entityType: string): SearchResultType {
  switch (entityType) {
    case "chatMessage":
      return "message";
    case "message":
      return "message";
    case "driveItem":
      return "document";
    case "listItem":
      return "listItem";
    case "site":
      return "site";
    default:
      return "unknown";
  }
}

/**
 * Infers search source from Graph Search entity type.
 */
function inferGraphSource(entityType: string): SearchSource {
  switch (entityType) {
    case "chatMessage":
      return "teams";
    case "message":
      return "exchange";
    case "driveItem":
      return "onedrive";
    case "site":
      return "sharepoint";
    default:
      return "sharepoint";
  }
}

/**
 * Executes a search via Microsoft Graph Search API.
 * Uses MSGraphClientV3 for POST /search/query.
 */
export async function executeGraphSearch(
  queryText: string,
  entityTypes: string[],
  startRow: number,
  pageSize: number
): Promise<{ results: IHyperSearchResult[]; totalCount: number }> {
  const ctx = getContext();
  const graphClient = await ctx.msGraphClientFactory.getClient("3");

  const requests = entityTypes.map(function (entityType) {
    return {
      entityTypes: [entityType],
      query: {
        queryString: queryText,
      },
      from: startRow,
      size: pageSize,
    };
  });

  const response = await graphClient.api("/search/query").post({
    requests: requests,
  });

  const results: IHyperSearchResult[] = [];
  let totalCount = 0;

  if (response && response.value) {
    (response.value as Array<Record<string, unknown>>).forEach(function (searchResponse) {
      const hitsContainers = (searchResponse.hitsContainers as Array<Record<string, unknown>>) || [];
      hitsContainers.forEach(function (container) {
        const containerTotal = (container.total as number) || 0;
        totalCount += containerTotal;

        const hits = (container.hits as Array<Record<string, unknown>>) || [];
        hits.forEach(function (hit, hitIndex) {
          const resource = (hit.resource as Record<string, unknown>) || {};
          const entityType = (hit.entityType as string) || "unknown";
          const summary = (hit.summary as string) || "";
          const rank = startRow + hitIndex;

          const result = mapGraphHit(resource, entityType, summary, rank);
          results.push(result);
        });
      });
    });
  }

  return { results: results, totalCount: totalCount };
}

/**
 * Maps a single Graph Search hit to IHyperSearchResult.
 */
function mapGraphHit(
  resource: Record<string, unknown>,
  entityType: string,
  summary: string,
  rank: number
): IHyperSearchResult {
  const resultType = inferGraphResultType(entityType);
  const source = inferGraphSource(entityType);

  // Common fields
  const id = (resource.id as string) || "";
  const webUrl = (resource.webUrl as string) || "";

  // driveItem / listItem
  const name = (resource.name as string) || "";
  const createdDateTime = (resource.createdDateTime as string) || "";
  const lastModifiedDateTime = (resource.lastModifiedDateTime as string) || "";

  // createdBy
  const createdBy = resource.createdBy as Record<string, unknown> | undefined;
  const authorUser = createdBy ? (createdBy.user as Record<string, unknown> | undefined) : undefined;
  const authorName = authorUser ? (authorUser.displayName as string) || "" : "";

  // chatMessage fields
  const chatSubject = (resource.subject as string) || "";
  const bodyPreview = (resource.bodyPreview as string) || "";
  const fromField = resource.from as Record<string, unknown> | undefined;
  const emailField = fromField ? (fromField.emailAddress as Record<string, unknown> | undefined) : undefined;
  const senderName = emailField ? (emailField.name as string) || "" : "";

  // site fields
  const displayName = (resource.displayName as string) || "";
  const siteDescription = (resource.description as string) || "";

  // Pick the best title
  let title = "";
  if (entityType === "chatMessage" || entityType === "message") {
    title = chatSubject || bodyPreview.substring(0, 80);
  } else if (entityType === "site") {
    title = displayName;
  } else {
    title = name;
  }

  // Pick the best description
  let description = summary;
  if (!description) {
    if (entityType === "chatMessage" || entityType === "message") {
      description = bodyPreview;
    } else if (entityType === "site") {
      description = siteDescription;
    }
  }

  // File type for drive items
  const fileExtension = name.indexOf(".") !== -1
    ? name.substring(name.lastIndexOf(".") + 1)
    : undefined;

  return {
    id: id,
    title: title,
    description: description,
    url: webUrl,
    author: authorName || senderName,
    authorEmail: undefined,
    modified: lastModifiedDateTime,
    created: createdDateTime,
    fileType: fileExtension,
    iconUrl: undefined,
    thumbnailUrl: undefined,
    resultType: resultType,
    source: source,
    siteName: undefined,
    path: webUrl,
    hitHighlightedSummary: summary,
    rank: rank,
    fields: resource,
  };
}
