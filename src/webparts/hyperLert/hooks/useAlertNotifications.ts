import { useState, useCallback } from "react";
import { getContext } from "../../../common/services/HyperPnP";
import type { IAlertAction, AlertSeverity } from "../models";
import { parseActions } from "../models";
import type { INotificationTokens } from "../utils/notificationUtils";
import { buildEmailHtml, buildTeamsMessage, replaceTokens } from "../utils/notificationUtils";
import { useHyperLertStore } from "../store/useHyperLertStore";

export interface IUseAlertNotificationsResult {
  /** Dispatch all enabled actions for a rule */
  dispatchNotifications: (
    actionsJson: string,
    tokens: INotificationTokens,
    severity: AlertSeverity,
    defaultEmailTemplate: string,
    enableEmail: boolean,
    enableTeams: boolean,
    enableBanner: boolean
  ) => Promise<string[]>;
  sending: boolean;
}

/**
 * Hook for sending alert notifications via email, Teams chat, and in-page banners.
 * Uses MSGraphClientV3 for email and Teams delivery.
 */
export function useAlertNotifications(): IUseAlertNotificationsResult {
  const [sending, setSending] = useState(false);
  const addBanner = useHyperLertStore(function (s) { return s.addBanner; });

  const dispatchNotifications = useCallback(async function (
    actionsJson: string,
    tokens: INotificationTokens,
    severity: AlertSeverity,
    defaultEmailTemplate: string,
    enableEmail: boolean,
    enableTeams: boolean,
    enableBanner: boolean
  ): Promise<string[]> {
    const actions = parseActions(actionsJson);
    const notifiedChannels: string[] = [];

    setSending(true);
    try {
      const ctx = getContext();
      const graphClient = await ctx.msGraphClientFactory.getClient("3");

      actions.forEach(function (action: IAlertAction) {
        if (!action.enabled) return;

        // Email channel
        if (action.channel === "email" && enableEmail) {
          const recipients = action.recipients.split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
          if (recipients.length > 0) {
            const toRecipients: Array<{ emailAddress: { address: string } }> = [];
            recipients.forEach(function (email) {
              toRecipients.push({ emailAddress: { address: email } });
            });

            const template = action.bodyTemplate || defaultEmailTemplate;
            const htmlBody = buildEmailHtml(template, tokens);
            const subject = replaceTokens(action.subject || "Alert: {{ruleName}}", tokens);

            graphClient.api("/me/sendMail").post({
              message: {
                subject: subject,
                body: {
                  contentType: "HTML",
                  content: htmlBody,
                },
                toRecipients: toRecipients,
              },
            }).catch(function () {
              // email notification failure is non-critical
            });

            notifiedChannels.push("email");
          }
        }

        // Teams channel
        if (action.channel === "teams" && enableTeams) {
          const teamsRecipients = action.teamsRecipients.split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
          if (teamsRecipients.length > 0) {
            const teamsMessage = buildTeamsMessage(tokens);
            teamsRecipients.forEach(function (email) {
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
                          content: teamsMessage,
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

            notifiedChannels.push("teams");
          }
        }

        // Banner channel
        if (action.channel === "banner" && enableBanner) {
          const bannerMessage = replaceTokens(action.bannerMessage || "{{ruleName}}: {{matchCount}} item(s) matched", tokens);
          const autoDismissMs = action.bannerDuration > 0 ? action.bannerDuration * 1000 : 0;
          addBanner(tokens.ruleName, bannerMessage, severity, autoDismissMs);
          notifiedChannels.push("banner");
        }
      });
    } catch {
      // notification dispatch failure is non-critical
    } finally {
      setSending(false);
    }

    return notifiedChannels;
  }, [addBanner]);

  return {
    dispatchNotifications: dispatchNotifications,
    sending: sending,
  };
}
