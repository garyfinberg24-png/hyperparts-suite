import { getContext } from "../../../common/services/HyperPnP";
import type { IHyperEvent } from "../models";

/**
 * Add an event to the current user's Outlook calendar via MSGraphClientV3.
 * Uses direct Graph client (not PnP) for full field control.
 */
export async function addEventToOutlook(event: IHyperEvent): Promise<void> {
  const ctx = getContext();
  const graphClient = await ctx.msGraphClientFactory.getClient("3");

  const graphEvent: Record<string, unknown> = {
    subject: event.title,
    body: {
      contentType: "text",
      content: event.description || "",
    },
    start: {
      dateTime: event.startDate,
      timeZone: "UTC",
    },
    end: {
      dateTime: event.endDate,
      timeZone: "UTC",
    },
    isAllDay: event.isAllDay,
  };

  if (event.location) {
    graphEvent.location = {
      displayName: event.location,
    };
  }

  await graphClient.api("/me/events").post(graphEvent);
}
