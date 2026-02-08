import * as React from "react";
import { getSP, getContext } from "../../../common/services/HyperPnP";
import type { IEventRegistration } from "../models";

export interface IUseEventRegistrationResult {
  registrations: IEventRegistration[];
  isRegistered: boolean;
  loading: boolean;
  submitRegistration: (eventId: string, fields: Record<string, unknown>) => Promise<void>;
}

/**
 * Hook for reading/writing event registrations from a SharePoint list.
 * List columns: Title (EventId), UserId, UserEmail, FieldData (JSON), Timestamp.
 */
export function useEventRegistration(
  eventId: string,
  registrationListName: string,
  enabled: boolean
): IUseEventRegistrationResult {
  const [registrations, setRegistrations] = React.useState<IEventRegistration[]>([]);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Fetch existing registrations for this event
  React.useEffect(function () {
    if (!enabled || !registrationListName || !eventId) return;
    let cancelled = false;

    async function fetchRegistrations(): Promise<void> {
      setLoading(true);
      try {
        const sp = getSP();
        const items = await sp.web.lists.getByTitle(registrationListName).items
          .filter("Title eq '" + eventId.replace(/'/g, "''") + "'")
          .select("Title", "UserId", "UserEmail", "FieldData", "Timestamp")
          .top(500)();

        if (cancelled) return;

        const regs: IEventRegistration[] = [];
        (items as Array<Record<string, unknown>>).forEach(function (item) {
          let fields: Record<string, unknown> = {};
          try {
            fields = JSON.parse(String(item.FieldData || "{}")) as Record<string, unknown>;
          } catch {
            // ignore parse errors
          }
          regs.push({
            eventId: String(item.Title || ""),
            userId: String(item.UserId || ""),
            userEmail: String(item.UserEmail || ""),
            fields: fields,
            timestamp: String(item.Timestamp || ""),
          });
        });

        setRegistrations(regs);

        // Check if current user is already registered
        const ctx = getContext();
        if (cancelled) return;
        const currentEmail = ctx.pageContext.user.email.toLowerCase();
        let found = false;
        regs.forEach(function (reg) {
          if (reg.userEmail.toLowerCase() === currentEmail) {
            found = true;
          }
        });
        setIsRegistered(found);
      } catch {
        // registration fetch failure is non-critical
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRegistrations().catch(function () { /* handled inside */ });

    return function () {
      cancelled = true;
    };
  }, [eventId, registrationListName, enabled]);

  const submitRegistration = React.useCallback(async function (
    evtId: string,
    fields: Record<string, unknown>
  ): Promise<void> {
    if (!enabled || !registrationListName) return;

    const ctx = getContext();
    const userEmail = ctx.pageContext.user.email;
    const userId = ctx.pageContext.user.loginName;

    const sp = getSP();
    await sp.web.lists.getByTitle(registrationListName).items.add({
      Title: evtId,
      UserId: userId,
      UserEmail: userEmail,
      FieldData: JSON.stringify(fields),
      Timestamp: new Date().toISOString(),
    });

    // Add to local state
    const newReg: IEventRegistration = {
      eventId: evtId,
      userId: userId,
      userEmail: userEmail,
      fields: fields,
      timestamp: new Date().toISOString(),
    };
    setRegistrations(function (prev) {
      const updated: IEventRegistration[] = [];
      prev.forEach(function (r) { updated.push(r); });
      updated.push(newReg);
      return updated;
    });
    setIsRegistered(true);
  }, [enabled, registrationListName]);

  return {
    registrations: registrations,
    isRegistered: isRegistered,
    loading: loading,
    submitRegistration: submitRegistration,
  };
}
