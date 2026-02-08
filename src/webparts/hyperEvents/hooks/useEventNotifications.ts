import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";

export interface IUseEventNotificationsResult {
  sendEmailNotification: (eventId: string, recipientEmails: string[], subject: string, body: string) => Promise<void>;
  sendTeamsNotification: (eventId: string, recipientEmails: string[], message: string) => Promise<void>;
  sending: boolean;
}

/**
 * Hook for sending event notifications via email (Graph sendMail)
 * and Teams chat messages (Graph chat).
 * Uses MSGraphClientV3 for direct API access.
 */
export function useEventNotifications(
  enabled: boolean
): IUseEventNotificationsResult {
  const [sending, setSending] = React.useState(false);

  const sendEmailNotification = React.useCallback(async function (
    _eventId: string,
    recipientEmails: string[],
    subject: string,
    body: string
  ): Promise<void> {
    if (!enabled || recipientEmails.length === 0) return;
    setSending(true);
    try {
      const ctx = getContext();
      const graphClient = await ctx.msGraphClientFactory.getClient("3");

      const toRecipients: Array<{ emailAddress: { address: string } }> = [];
      recipientEmails.forEach(function (email) {
        toRecipients.push({ emailAddress: { address: email } });
      });

      await graphClient.api("/me/sendMail").post({
        message: {
          subject: subject,
          body: {
            contentType: "HTML",
            content: body,
          },
          toRecipients: toRecipients,
        },
      });
    } catch {
      // notification failure is non-critical
    } finally {
      setSending(false);
    }
  }, [enabled]);

  const sendTeamsNotification = React.useCallback(async function (
    _eventId: string,
    recipientEmails: string[],
    message: string
  ): Promise<void> {
    if (!enabled || recipientEmails.length === 0) return;
    setSending(true);
    try {
      const ctx = getContext();
      const graphClient = await ctx.msGraphClientFactory.getClient("3");

      // Send Teams chat message to each recipient
      recipientEmails.forEach(function (email) {
        graphClient.api("/chats")
          .post({
            chatType: "oneOnOne",
            members: [
              {
                "@odata.type": "#microsoft.graph.aadUserConversationMember",
                roles: ["owner"],
                "user@odata.bind": "https://graph.microsoft.com/v1.0/users('" + encodeURIComponent(email) + "')",
              },
            ],
          })
          .then(function (chat: { id?: string }) {
            if (chat && chat.id) {
              return graphClient.api("/chats/" + chat.id + "/messages")
                .post({
                  body: {
                    content: message,
                    contentType: "html",
                  },
                });
            }
            return undefined;
          })
          .catch(function () {
            // Teams notification failure is non-critical
          });
      });
    } catch {
      // notification failure is non-critical
    } finally {
      setSending(false);
    }
  }, [enabled]);

  return {
    sendEmailNotification: sendEmailNotification,
    sendTeamsNotification: sendTeamsNotification,
    sending: sending,
  };
}
