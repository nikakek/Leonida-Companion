import { getRegion } from "@/config/regions";
import type { Submission } from "@/lib/submission";

export interface SubmissionRecord extends Submission {
  status: "pending_review";
  receivedAt: string;
}

type WebhookKind = "discord" | "slack" | "generic";

/** Detects chat webhooks, which reject plain JSON and need their own message shape. */
export function webhookKind(url: string): WebhookKind {
  try {
    const { hostname, pathname } = new URL(url);
    const host = hostname.toLowerCase();
    if (/(^|\.)(discord|discordapp)\.com$/.test(host) && pathname.startsWith("/api/webhooks/")) return "discord";
    if (host === "hooks.slack.com") return "slack";
  } catch {
    // Malformed URL: send generic JSON and let the request fail visibly.
  }
  return "generic";
}

/** Slack mrkdwn: escape the three control characters so user text cannot inject links or mentions. */
function slackEscape(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Request body for the webhook. User text is never allowed to trigger @mentions. */
export function webhookBody(url: string, record: SubmissionRecord): string {
  const region = getRegion(record.region).name;
  const contact = record.contact || "Not given";

  switch (webhookKind(url)) {
    case "discord":
      return JSON.stringify({
        username: "Leonida Submissions",
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: record.title,
            description: record.description,
            color: 0xff4d9d,
            fields: [
              { name: "Region", value: region, inline: true },
              { name: "Category", value: record.category, inline: true },
              { name: "Contact", value: contact, inline: true },
            ],
            footer: { text: "Pending review · not published" },
            timestamp: record.receivedAt,
          },
        ],
      });
    case "slack":
      return JSON.stringify({
        text: [
          `*New submission (pending review):* ${slackEscape(record.title)}`,
          `Region: ${slackEscape(region)} · Category: ${slackEscape(record.category)} · Contact: ${slackEscape(contact)}`,
          slackEscape(record.description),
        ].join("\n"),
      });
    case "generic":
      return JSON.stringify(record);
  }
}
