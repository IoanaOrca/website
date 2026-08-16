export type SubscribeResult =
  { ok: true } | { ok: false; reason: 'invalid' | 'network' | 'server' };

export interface SubscribeFields {
  email: string;
  /* Optional on the form — an empty name must never block a signup. */
  firstName: string;
  honeypot: string;
}

/* Stored with every signup. Bump when the promise shown or the fields
   collected change, once there are rows worth distinguishing. */
export const CONSENT_VERSION = 'v1';

/* Deliberately loose. RFC-5322 regexes reject real addresses and admit fake
   ones; the client only catches typos and the server confirms delivery. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/* An object, not positional args: they are all strings, so a transposition
   would type-check and fail only at runtime. */
export async function subscribe(
  endpoint: string,
  { email, firstName, honeypot }: SubscribeFields,
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
        firstName: firstName.trim(),
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
