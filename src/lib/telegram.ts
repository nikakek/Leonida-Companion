/**
 * Sends a plain-text message to the owner's Telegram chat (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID). Server-only.
 * Kept free of "@/..." imports so the Netlify scheduled function can import it by relative path.
 */

const TIMEOUT_MS = 5000;

export function telegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_CHAT_ID?.trim());
}

export async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return false;
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 4000), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // Status only: the URL contains the bot token.
    if (!response.ok) console.error(`[telegram] sendMessage failed: HTTP ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error(`[telegram] sendMessage failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return false;
  }
}
