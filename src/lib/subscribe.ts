export type SubscribeResult =
  { ok: true } | { ok: false; reason: 'invalid' | 'network' | 'server' };

/* Matches the visible promise on the signup card. Bump when that wording
   changes — the stored value is the consent record. */
export const CONSENT_VERSION = 'v1';

/* Deliberately loose. RFC-5322 regexes reject real addresses and admit fake
   ones; the client only catches typos and the server confirms delivery. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export async function subscribe(
  endpoint: string,
  email: string,
  honeypot: string,
): Promise<SubscribeResult> {
  if (honeypot) return { ok: true };
  if (!isValidEmail(email)) return { ok: false, reason: 'invalid' };

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      // text/plain makes this a simple request, so no CORS preflight is sent.
      // Apps Script web apps cannot answer one.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        // Always empty here — the client short-circuits above. Sent anyway so
        // the server can catch bots that post directly and never run this JS.
        website: honeypot,
        source: 'coming-soon',
        consent: CONSENT_VERSION,
      }),
    });
  } catch {
    return { ok: false, reason: 'network' };
  }

  if (!response.ok) return { ok: false, reason: 'server' };

  let body: { ok?: boolean; reason?: string };
  try {
    body = (await response.json()) as { ok?: boolean; reason?: string };
  } catch {
    return { ok: false, reason: 'server' };
  }

  if (body.ok) return { ok: true };
  return {
    ok: false,
    reason: body.reason === 'invalid' ? 'invalid' : 'server',
  };
}
