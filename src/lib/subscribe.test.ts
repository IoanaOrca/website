import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CONSENT_VERSION,
  isValidEmail,
  subscribe,
  type SubscribeFields,
} from './subscribe';

const ENDPOINT = 'https://example.invalid/subscribe';

function stubFetch(impl: typeof fetch) {
  const spy = vi.fn(impl);
  vi.stubGlobal('fetch', spy);
  return spy;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/* Every test varies one field; the rest stay valid so a failure names the
   thing under test rather than the setup. */
function fields(overrides: Partial<SubscribeFields> = {}): SubscribeFields {
  return {
    email: 'ioana@example.com',
    firstName: 'Ioana',
    honeypot: '',
    ...overrides,
  };
}

function bodyOf(spy: ReturnType<typeof stubFetch>) {
  const [, init] = spy.mock.calls[0] as [string, RequestInit];
  return JSON.parse(init.body as string) as Record<string, unknown>;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('isValidEmail', () => {
  it('accepts an ordinary address', () => {
    expect(isValidEmail('ioana@example.com')).toBe(true);
  });

  it('accepts an address with surrounding whitespace', () => {
    expect(isValidEmail('  ioana@example.com  ')).toBe(true);
  });

  it('rejects an address with no @', () => {
    expect(isValidEmail('ioana.example.com')).toBe(false);
  });

  it('rejects an address with no TLD', () => {
    expect(isValidEmail('ioana@example')).toBe(false);
  });

  it('rejects an address with an interior space', () => {
    expect(isValidEmail('io ana@example.com')).toBe(false);
  });

  it('rejects the empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('subscribe', () => {
  it('resolves ok on a 2xx JSON success', async () => {
    stubFetch(async () => jsonResponse({ ok: true }));
    await expect(subscribe(ENDPOINT, fields())).resolves.toEqual({ ok: true });
  });

  it('posts the email lowercased and trimmed, with source and consent', async () => {
    const spy = stubFetch(async () => jsonResponse({ ok: true }));
    await subscribe(ENDPOINT, fields({ email: '  Ioana@Example.COM ' }));

    const [url, init] = spy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(ENDPOINT);
    expect(init.method).toBe('POST');
    // text/plain keeps this a simple request; Apps Script cannot answer a
    // CORS preflight.
    expect(init.headers).toMatchObject({
      'Content-Type': 'text/plain;charset=utf-8',
    });
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'ioana@example.com',
      firstName: 'Ioana',
      website: '',
      source: 'coming-soon',
      consent: CONSENT_VERSION,
    });
  });

  it('trims the first name but preserves its capitalisation', async () => {
    const spy = stubFetch(async () => jsonResponse({ ok: true }));
    await subscribe(ENDPOINT, fields({ firstName: '  Ioana  ' }));
    expect(bodyOf(spy).firstName).toBe('Ioana');
  });

  it('subscribes without a first name, since the field is optional', async () => {
    const spy = stubFetch(async () => jsonResponse({ ok: true }));
    await expect(
      subscribe(ENDPOINT, fields({ firstName: '' })),
    ).resolves.toEqual({ ok: true });
    expect(spy).toHaveBeenCalledOnce();
  });

  it('sends an empty string when no first name is given', async () => {
    const spy = stubFetch(async () => jsonResponse({ ok: true }));
    await subscribe(ENDPOINT, fields({ firstName: '   ' }));
    expect(bodyOf(spy).firstName).toBe('');
  });

  it('short-circuits when the honeypot is filled and never calls fetch', async () => {
    const spy = stubFetch(async () => jsonResponse({ ok: true }));
    await expect(
      subscribe(
        ENDPOINT,
        fields({ email: 'bot@example.com', honeypot: 'http://spam.example' }),
      ),
    ).resolves.toEqual({ ok: true });
    expect(spy).not.toHaveBeenCalled();
  });

  it('rejects a malformed address without calling fetch', async () => {
    const spy = stubFetch(async () => jsonResponse({ ok: true }));
    await expect(
      subscribe(ENDPOINT, fields({ email: 'nope' })),
    ).resolves.toEqual({ ok: false, reason: 'invalid' });
    expect(spy).not.toHaveBeenCalled();
  });

  it('reports network when fetch rejects', async () => {
    stubFetch(async () => {
      throw new TypeError('Failed to fetch');
    });
    await expect(subscribe(ENDPOINT, fields())).resolves.toEqual({
      ok: false,
      reason: 'network',
    });
  });

  it('reports server on a non-2xx response', async () => {
    stubFetch(async () => jsonResponse({ ok: false }, 500));
    await expect(subscribe(ENDPOINT, fields())).resolves.toEqual({
      ok: false,
      reason: 'server',
    });
  });

  it('reports server when the response body is not JSON', async () => {
    stubFetch(async () => new Response('<html>oops</html>', { status: 200 }));
    await expect(subscribe(ENDPOINT, fields())).resolves.toEqual({
      ok: false,
      reason: 'server',
    });
  });

  it('passes through an invalid verdict from the server', async () => {
    stubFetch(async () => jsonResponse({ ok: false, reason: 'invalid' }));
    await expect(subscribe(ENDPOINT, fields())).resolves.toEqual({
      ok: false,
      reason: 'invalid',
    });
  });
});
