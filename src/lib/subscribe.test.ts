import { afterEach, describe, expect, it, vi } from 'vitest';

import { CONSENT_VERSION, isValidEmail, subscribe } from './subscribe';

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
    await expect(subscribe(ENDPOINT, 'ioana@example.com', '')).resolves.toEqual(
      {
        ok: true,
      },
    );
  });

  it('posts the email lowercased and trimmed, with source and consent', async () => {
    const spy = stubFetch(async () => jsonResponse({ ok: true }));
    await subscribe(ENDPOINT, '  Ioana@Example.COM ', '');

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
      website: '',
      source: 'coming-soon',
      consent: CONSENT_VERSION,
    });
  });

  it('short-circuits when the honeypot is filled and never calls fetch', async () => {
    const spy = stubFetch(async () => jsonResponse({ ok: true }));
    await expect(
      subscribe(ENDPOINT, 'bot@example.com', 'http://spam.example'),
    ).resolves.toEqual({ ok: true });
    expect(spy).not.toHaveBeenCalled();
  });

  it('rejects a malformed address without calling fetch', async () => {
    const spy = stubFetch(async () => jsonResponse({ ok: true }));
    await expect(subscribe(ENDPOINT, 'nope', '')).resolves.toEqual({
      ok: false,
      reason: 'invalid',
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it('reports network when fetch rejects', async () => {
    stubFetch(async () => {
      throw new TypeError('Failed to fetch');
    });
    await expect(subscribe(ENDPOINT, 'ioana@example.com', '')).resolves.toEqual(
      {
        ok: false,
        reason: 'network',
      },
    );
  });

  it('reports server on a non-2xx response', async () => {
    stubFetch(async () => jsonResponse({ ok: false }, 500));
    await expect(subscribe(ENDPOINT, 'ioana@example.com', '')).resolves.toEqual(
      {
        ok: false,
        reason: 'server',
      },
    );
  });

  it('reports server when the response body is not JSON', async () => {
    stubFetch(async () => new Response('<html>oops</html>', { status: 200 }));
    await expect(subscribe(ENDPOINT, 'ioana@example.com', '')).resolves.toEqual(
      {
        ok: false,
        reason: 'server',
      },
    );
  });

  it('passes through an invalid verdict from the server', async () => {
    stubFetch(async () => jsonResponse({ ok: false, reason: 'invalid' }));
    await expect(subscribe(ENDPOINT, 'ioana@example.com', '')).resolves.toEqual(
      {
        ok: false,
        reason: 'invalid',
      },
    );
  });
});
