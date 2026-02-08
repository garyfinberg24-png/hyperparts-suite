import { useState, useEffect, useCallback } from "react";
import { getSP, getContext } from "../../../common/services/HyperPnP";
import type { IEventRsvp, EventRsvpResponse } from "../models";

export interface IUseEventRsvpResult {
  rsvps: IEventRsvp[];
  currentUserResponse: EventRsvpResponse | undefined;
  loading: boolean;
  submitRsvp: (eventId: string, response: EventRsvpResponse) => Promise<void>;
}

/**
 * Reads/writes RSVP records from a SharePoint list.
 * List columns: Title (EventId), UserId, UserEmail, Response, Timestamp.
 */
export function useEventRsvp(
  eventId: string,
  rsvpListName: string,
  enabled: boolean
): IUseEventRsvpResult {
  const [rsvps, setRsvps] = useState<IEventRsvp[]>([]);
  const [currentUserResponse, setCurrentUserResponse] = useState<EventRsvpResponse | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(function () {
    if (!enabled || !rsvpListName || !eventId) return;

    let cancelled = false;

    const fetchRsvps = async function (): Promise<void> {
      try {
        setLoading(true);
        const sp = getSP();
        const ctx = getContext();
        const currentUserEmail = ctx.pageContext.user.email;

        const items = await sp.web.lists
          .getByTitle(rsvpListName)
          .items
          .filter("Title eq '" + eventId + "'")
          .select("Id", "Title", "UserId", "UserEmail", "Response", "Timestamp")
          .top(200)();

        if (cancelled) return;

        const rsvpList: IEventRsvp[] = [];
        let userResponse: EventRsvpResponse | undefined;

        (items as Array<Record<string, unknown>>).forEach(function (raw) {
          const rsvp: IEventRsvp = {
            eventId: (raw.Title as string) || "",
            userId: (raw.UserId as string) || "",
            userEmail: (raw.UserEmail as string) || "",
            response: (raw.Response as EventRsvpResponse) || "going",
            timestamp: (raw.Timestamp as string) || "",
          };
          rsvpList.push(rsvp);

          if (rsvp.userEmail.toLowerCase() === currentUserEmail.toLowerCase()) {
            userResponse = rsvp.response;
          }
        });

        setRsvps(rsvpList);
        setCurrentUserResponse(userResponse);
        setLoading(false);
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRsvps().catch(function () { /* handled above */ });

    return function () { cancelled = true; };
  }, [eventId, rsvpListName, enabled]);

  const submitRsvp = useCallback(async function (
    evtId: string,
    response: EventRsvpResponse
  ): Promise<void> {
    if (!enabled || !rsvpListName) return;

    const sp = getSP();
    const ctx = getContext();
    const currentUserEmail = ctx.pageContext.user.email;
    const currentUserId = String(ctx.pageContext.legacyPageContext.userId || "");

    // Check if user already has a response
    const existing = await sp.web.lists
      .getByTitle(rsvpListName)
      .items
      .filter("Title eq '" + evtId + "' and UserEmail eq '" + currentUserEmail + "'")
      .select("Id")
      .top(1)();

    const now = new Date().toISOString();

    if ((existing as Array<Record<string, unknown>>).length > 0) {
      // Update existing
      const itemId = (existing as Array<Record<string, unknown>>)[0].Id as number;
      await sp.web.lists
        .getByTitle(rsvpListName)
        .items
        .getById(itemId)
        .update({
          Response: response,
          Timestamp: now,
        });
    } else {
      // Create new
      await sp.web.lists
        .getByTitle(rsvpListName)
        .items
        .add({
          Title: evtId,
          UserId: currentUserId,
          UserEmail: currentUserEmail,
          Response: response,
          Timestamp: now,
        });
    }

    setCurrentUserResponse(response);

    // Update local list
    setRsvps(function (prev) {
      const updated: IEventRsvp[] = [];
      let found = false;
      prev.forEach(function (r) {
        if (r.userEmail.toLowerCase() === currentUserEmail.toLowerCase() && r.eventId === evtId) {
          found = true;
          updated.push({ ...r, response: response, timestamp: now });
        } else {
          updated.push(r);
        }
      });
      if (!found) {
        updated.push({
          eventId: evtId,
          userId: currentUserId,
          userEmail: currentUserEmail,
          response: response,
          timestamp: now,
        });
      }
      return updated;
    });
  }, [enabled, rsvpListName]);

  return {
    rsvps: rsvps,
    currentUserResponse: currentUserResponse,
    loading: loading,
    submitRsvp: submitRsvp,
  };
}
