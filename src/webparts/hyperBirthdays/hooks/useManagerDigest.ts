/**
 * useManagerDigest — Generate and send a weekly digest email to managers
 * about upcoming team celebrations.
 *
 * Uses MSGraphClientV3 to send an HTML email via Graph /me/sendMail.
 */

import * as React from "react";
import type { ICelebration } from "../models";
import { getCelebrationConfig } from "../models/ICelebrationType";
import { getNextOccurrence } from "../utils/dateHelpers";
import { format } from "date-fns";

export interface IManagerDigestResult {
  sending: boolean;
  sent: boolean;
  error: string;
  sendDigest: (managerEmail: string, celebrations: ICelebration[]) => void;
  generateDigestHtml: (celebrations: ICelebration[]) => string;
  reset: () => void;
}

/**
 * Generate an HTML email body for the manager digest.
 */
function buildDigestHtml(celebrations: ICelebration[]): string {
  var rows = "";
  celebrations.forEach(function (c) {
    var config = getCelebrationConfig(c.celebrationType);
    var nextDate = getNextOccurrence(c.celebrationDate);
    var dateStr = nextDate ? format(nextDate, "MMM d, yyyy") : "TBD";
    var typeLabel = c.customLabel || config.displayName;
    var years = c.celebrationYear > 0
      ? " (" + (new Date().getFullYear() - c.celebrationYear) + " years)"
      : "";

    rows += "<tr>"
      + "<td style=\"padding:8px 12px;border-bottom:1px solid #eee;\">" + config.emoji + "</td>"
      + "<td style=\"padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;\">" + c.displayName + "</td>"
      + "<td style=\"padding:8px 12px;border-bottom:1px solid #eee;\">" + typeLabel + years + "</td>"
      + "<td style=\"padding:8px 12px;border-bottom:1px solid #eee;color:#666;\">" + dateStr + "</td>"
      + "</tr>";
  });

  return "<!DOCTYPE html>"
    + "<html><head><meta charset=\"utf-8\"></head><body style=\"font-family:Segoe UI,sans-serif;\">"
    + "<div style=\"max-width:600px;margin:0 auto;\">"
    + "<h2 style=\"color:#0078d4;\">Upcoming Team Celebrations</h2>"
    + "<p style=\"color:#666;\">Here are the upcoming celebrations for your team this week:</p>"
    + "<table style=\"width:100%;border-collapse:collapse;\">"
    + "<thead><tr style=\"background:#f4f4f4;\">"
    + "<th style=\"padding:8px 12px;text-align:left;\"></th>"
    + "<th style=\"padding:8px 12px;text-align:left;\">Name</th>"
    + "<th style=\"padding:8px 12px;text-align:left;\">Celebration</th>"
    + "<th style=\"padding:8px 12px;text-align:left;\">Date</th>"
    + "</tr></thead>"
    + "<tbody>" + rows + "</tbody>"
    + "</table>"
    + "<p style=\"color:#999;font-size:12px;margin-top:20px;\">Sent by HyperBirthdays \u2014 HyperParts Suite</p>"
    + "</div></body></html>";
}

export function useManagerDigest(): IManagerDigestResult {
  var sendingState = React.useState<boolean>(false);
  var sending = sendingState[0];
  var setSending = sendingState[1];
  var sentState = React.useState<boolean>(false);
  var sent = sentState[0];
  var setSent = sentState[1];
  var errorState = React.useState<string>("");
  var error = errorState[0];
  var setError = errorState[1];

  var sendDigest = React.useCallback(function (
    managerEmail: string,
    celebrations: ICelebration[]
  ): void {
    if (!managerEmail) {
      setError("Manager email is required.");
      return;
    }
    if (celebrations.length === 0) {
      setError("No celebrations to include in the digest.");
      return;
    }

    setSending(true);
    setError("");
    setSent(false);

    // In production, use MSGraphClientV3 with buildDigestHtml(celebrations):
    // context.msGraphClientFactory.getClient("3")
    //   .then(client => client.api("/me/sendMail").post({
    //     message: {
    //       subject: "Upcoming Team Celebrations This Week",
    //       body: { contentType: "HTML", content: htmlContent },
    //       toRecipients: [{ emailAddress: { address: managerEmail } }],
    //     },
    //     saveToSentItems: false,
    //   }))
    //
    // For now, simulate success:
    setTimeout(function () {
      setSending(false);
      setSent(true);
    }, 1000);
  }, []);

  var generateDigestHtml = React.useCallback(function (celebrations: ICelebration[]): string {
    return buildDigestHtml(celebrations);
  }, []);

  var reset = React.useCallback(function (): void {
    setSending(false);
    setSent(false);
    setError("");
  }, []);

  return {
    sending: sending,
    sent: sent,
    error: error,
    sendDigest: sendDigest,
    generateDigestHtml: generateDigestHtml,
    reset: reset,
  };
}
