# Coming Soon Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder homepage with the eight-section pre-launch page, including a working email signup backed by a Google Apps Script sheet.

**Architecture:** One Astro page composing nine prop-less section components under `src/components/coming-soon/`. Brand values live in Tailwind v4 `@theme` tokens. The only logic is `src/lib/subscribe.ts`, a pure module behind which the email provider can be swapped; it is unit-tested with Vitest and consumed by a vanilla `<script>` in `SignupForm.astro`. No framework islands, no client JS outside that one script.

**Tech Stack:** Astro 7.2, Tailwind CSS v4, TypeScript 6 (pinned — see constraints), Vitest, Google Apps Script, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-16-coming-soon-page-design.md`

## Global Constraints

- **Copy is client-approved and final.** Never paraphrase, shorten, or "improve" it. Use typographic punctuation throughout: apostrophe `’`, ellipsis `…`, em dash `—`.
- Two phrases must survive verbatim: `You know something needs to change. You just don’t know what to do next.` and `Coaching for your next chapter.`
- **Do not upgrade `typescript` past 6.x.** `typescript-eslint@8` throws at import time on TS 7 and takes out linting entirely.
- **`olive-600` (`#5F6D5B`) is for primary CTA backgrounds only.** Never a fill, accent, link, or focus colour.
- **`ink-500` (`#6E6C5E`) is legible only on `paper-50`.** On `paper-100` or `peach-100` fills it fails AA — use `ink-700`.
- **No shadows anywhere.** The brand separates with hairlines and fills.
- Radius is `2px` (input, button) and `3px` (cards, images). Nothing more rounded.
- No animation beyond the button's background transition.
- Token naming rule: `family-NNN`, higher is darker. No `-deep`, `-dark`, `-tint`, `-80`, `-muted`.
- Every multi-column grid collapses to one column below `lg` (1024px).
- Commit messages follow Conventional Commits (`lefthook` enforces this in `commit-msg`).
- Prettier runs `singleAttributePerLine: true` and `prettier-plugin-tailwindcss`, and lefthook's `pre-commit` reformats with `stage_fixed`. Markup in this plan is written compactly; expect attributes to be split one-per-line and class strings reordered on commit. That is not a mistake — do not fight it.

## Deviation from the spec

The spec gives the boundary as `subscribe(email, honeypot)` with the endpoint read from `astro:env/client` inside the module. This plan uses **`subscribe(endpoint, email, honeypot)`** instead, injecting the URL from the call site.

Reason: importing `astro:env/client` inside `subscribe.ts` drags Astro's Vite plugin and a populated env into the unit test path, which would force a `getViteConfig()` test config and a test-time env var for a module that is otherwise pure. Injecting the endpoint keeps `subscribe.ts` dependency-free and Vitest config-free. `SignupForm.astro` reads the env var and passes it in. The swap-to-Kit property the boundary exists for is unaffected.

---

## Task 1: Design tokens and base styles

**Files:**

- Modify: `src/styles/global.css` (full rewrite)
- Modify: `src/pages/index.astro:6-10`

**Interfaces:**

- Consumes: nothing
- Produces: Tailwind utilities used by every later task — `bg-paper-50`, `bg-paper-100`, `border-paper-200`, `bg-peach-100`, `text-peach-300`, `text-peach-700`, `bg-olive-600`, `bg-olive-700`, `text-ink-500`, `text-ink-700`, `bg-ink-900`, `text-paper-50/82`, `max-w-page`, `px-gutter`, `py-section`, `text-display-xl|lg|md|sm|xs`, `tracking-eyebrow`, `font-display`, `font-body`

- [ ] **Step 1: Rewrite `src/styles/global.css`**

```css
@import 'tailwindcss';

/* Brand values from the Peach & Olive identity doc and the coming-soon design
   handoff. Naming rule: family-NNN, higher is darker. */
@theme {
  --color-paper-50: #faf7f1;
  --color-paper-100: #f0e9dc;
  --color-paper-200: #e3dccf;

  --color-peach-100: #f2d9c4;
  --color-peach-300: #e3b08c;
  --color-peach-700: #7a5638;

  /* Reserved for primary CTA backgrounds. Never a fill, accent or link. */
  --color-olive-600: #5f6d5b;
  --color-olive-700: #4e5c4a;

  /* ink-500 passes AA on paper-50 only. Use ink-700 on tinted fills. */
  --color-ink-500: #6e6c5e;
  --color-ink-700: #4a4a42;
  --color-ink-900: #3a3a33;

  --container-page: 1440px;

  --spacing-gutter: clamp(1.5rem, 5vw, 4rem);
  --spacing-section: clamp(4rem, 8vw, 6rem);

  --text-display-xl: clamp(2.375rem, 6vw, 3.875rem);
  --text-display-lg: clamp(2rem, 4.5vw, 2.875rem);
  --text-display-md: clamp(1.625rem, 3vw, 2rem);
  --text-display-sm: clamp(1.5rem, 2.2vw, 1.75rem);
  --text-display-xs: clamp(1.25rem, 1.6vw, 1.375rem);

  --tracking-eyebrow: 0.22em;
}

/* Maps Astro's font variables onto Tailwind's font-* utilities. */
@theme inline {
  --font-display: var(--internal-font-display);
  --font-body: var(--internal-font-body);
}

@layer base {
  body {
    background-color: var(--color-paper-50);
    color: var(--color-ink-900);
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.65;
  }

  /* No sizes here: the page uses five display steps and components pick one. */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-display);
    font-weight: 400;
    text-wrap: pretty;
  }

  a {
    color: var(--color-peach-700);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  a:hover {
    color: var(--color-olive-700);
  }

  :focus-visible {
    outline: 2px solid var(--color-olive-700);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

- [ ] **Step 2: Point `index.astro` at the new tokens**

The old markup uses `max-w-page`, `text-eyebrow`, `text-muted` and `text-olive-deep`. Three of those tokens no longer exist, so the build must be repaired before anything else lands. Replace the body of `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Ioana Orca">
  <main class="px-gutter py-section mx-auto max-w-page">
    <p class="tracking-eyebrow text-ink-500 text-xs uppercase">Mindset coach</p>
    <h1 class="text-display-xl mt-4">Ioana Orca</h1>
    <h2 class="text-display-lg text-peach-700 mt-6 italic">Coming soon.</h2>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify no removed token is still referenced**

Run: `grep -rn "olive-deep\|text-muted\|peach-tint\|color-shell\|text-eyebrow\|bg-sand" src/`
Expected: no output.

- [ ] **Step 4: Verify the build and type-check pass**

Run: `npm run check && npm run build`
Expected: both exit 0, no missing-utility warnings.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/pages/index.astro
git commit -m "refactor: unify brand tokens and fluid type scale"
```

---

## Task 2: The subscribe module

**Files:**

- Create: `src/lib/subscribe.ts`
- Create: `src/lib/subscribe.test.ts`
- Modify: `package.json` (add `vitest` devDependency and `test` script)
- Modify: `lefthook.yml:10-13` (add `test` to `pre-push`)
- Modify: `.github/workflows/ci.yml:24` (add `test` to the matrix)

**Interfaces:**

- Consumes: nothing
- Produces:
  - `type SubscribeResult = { ok: true } | { ok: false; reason: 'invalid' | 'network' | 'server' }`
  - `const CONSENT_VERSION: string`
  - `function isValidEmail(email: string): boolean`
  - `function subscribe(endpoint: string, email: string, honeypot: string): Promise<SubscribeResult>`

No Vitest config file is needed. Vitest's default `include` is `**/*.{test,spec}.?(c|m)[jt]s?(x)`, its default `exclude` already covers `node_modules` and `dist`, and the default environment is `node`. TypeScript is transpiled natively.

- [ ] **Step 1: Install Vitest and add the script**

```bash
npm install --save-dev vitest
npm pkg set scripts.test="vitest run"
```

- [ ] **Step 2: Write the failing tests**

Create `src/lib/subscribe.test.ts`. Note the explicit imports — `tsconfig.json` has `"include": ["**/*"]`, so `astro check` type-checks this file and vitest globals would need a `types` entry. Explicit imports avoid that.

```ts
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
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./subscribe"`.

- [ ] **Step 4: Write the implementation**

Create `src/lib/subscribe.ts`:

```ts
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
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — 14 tests.

- [ ] **Step 6: Wire `test` into lefthook and CI**

In `lefthook.yml`, the `pre-push` block becomes:

```yaml
pre-push:
  jobs:
    - name: check
      run: npm run check
    - name: test
      run: npm test
```

In `.github/workflows/ci.yml`, the matrix line becomes:

```yaml
task: [lint, format:check, check, test, build]
```

- [ ] **Step 7: Verify the full local gate passes**

Run: `npm run lint && npm run format:check && npm run check && npm test && npm run build`
Expected: all exit 0.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json lefthook.yml .github/workflows/ci.yml src/lib/
git commit -m "feat: add email subscribe module with vitest coverage"
```

---

## Task 3: Page frame — header, hero, footer

**Files:**

- Modify: `astro.config.mjs:7-13` (add the `image` block)
- Create: `src/components/coming-soon/Header.astro`
- Create: `src/components/coming-soon/Hero.astro`
- Create: `src/components/coming-soon/Footer.astro`
- Modify: `src/pages/index.astro` (full rewrite)

**Interfaces:**

- Consumes: tokens from Task 1
- Produces: three prop-less components, default-exported as Astro components, imported by `index.astro`. Establishes the section shape every later section copies:

```astro
<section class="[background and utilities] border">
  <div class="px-gutter py-section mx-auto max-w-page">…</div>
</section>
```

Background lives on the outer element so it bleeds full-width; the container is inside.

- [ ] **Step 1: Add the image config**

In `astro.config.mjs`, add an `image` block after `vite`:

```js
  image: {
    // `layout` makes <Image> derive srcset and sizes from the source file.
    // `responsiveStyles` defaults to false — without it the scaling and
    // object-fit rules are never emitted and images render at intrinsic size.
    layout: 'constrained',
    responsiveStyles: true,
  },
```

- [ ] **Step 2: Create `Header.astro`**

```astro
<header class="border-paper-200 border-b">
  <div
    class="px-gutter mx-auto flex max-w-page items-end justify-between gap-8 pt-8 pb-6"
  >
    <div class="flex flex-col gap-1.5">
      <p class="text-display-sm text-ink-900 font-display tracking-[0.01em]">
        Ioana Orca
      </p>
      <p class="text-peach-700 font-display text-lg italic">
        Coaching for your next chapter.
      </p>
    </div>
    <p class="tracking-eyebrow text-ink-500 text-xs uppercase">
      Launching autumn 2026
    </p>
  </div>
</header>
```

The wordmark is a `<p>`, not a heading — the hero headline is the page's only `h1`.

- [ ] **Step 3: Create `Hero.astro`**

```astro
---
import { Image } from 'astro:assets';

import heroPortrait from '../../assets/images/ioana-hero-studio.jpg';
---

<section>
  <div
    class="px-gutter py-section mx-auto grid max-w-page grid-cols-1 items-center gap-18 lg:grid-cols-2"
  >
    <div>
      <h1 class="text-display-xl leading-[1.06] tracking-[-0.01em]">
        <span class="text-ink-900">You know something needs to change.</span>
        <span class="text-peach-700 mt-1.5 block italic">
          You just don’t know what to do next.
        </span>
      </h1>
      <div class="bg-peach-300 my-11 h-0.5 w-22"></div>
      <p class="text-ink-700 max-w-lg text-lg leading-[1.65]">
        I help women understand what’s keeping them stuck, get clear on what
        they actually want, and make decisions they feel confident about.
      </p>
    </div>
    <Image
      src={heroPortrait}
      alt="Ioana Orca, seated with a laptop against a warm neutral backdrop"
      sizes="(min-width: 1024px) 50vw, 100vw"
      loading="eager"
      fetchpriority="high"
      class="aspect-[3/4] w-full rounded-[3px]"
    />
  </div>
</section>
```

`loading="eager"` and `fetchpriority="high"` override Astro's `lazy` default because this is the LCP element.

- [ ] **Step 4: Create `Footer.astro`**

```astro
<footer>
  <div
    class="px-gutter mx-auto flex max-w-page flex-col justify-between gap-8 py-11 sm:flex-row sm:items-center"
  >
    <p class="tracking-eyebrow text-ink-700 text-sm uppercase">Ioana Orca</p>
    <p class="text-ink-500 text-sm">
      Sessions online, in English and Romanian.
    </p>
  </div>
</footer>
```

- [ ] **Step 5: Rewrite `index.astro`**

```astro
---
import Footer from '../components/coming-soon/Footer.astro';
import Header from '../components/coming-soon/Header.astro';
import Hero from '../components/coming-soon/Hero.astro';
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Ioana Orca — Coaching for your next chapter"
  description="I help women understand what’s keeping them stuck, get clear on what they actually want, and make decisions they feel confident about."
>
  <Header />
  <main>
    <Hero />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 6: Verify the build and view the page**

Run: `npm run check && npm run build`
Expected: both exit 0.

Run: `npx astro dev --background`, open `http://localhost:4321`.
Expected: header with wordmark left and launch label right above a hairline; hero with the two-line headline (second line brown italic), a peach rule, body copy, and the studio portrait to the right; footer at the bottom. Below 1024px the hero stacks with the image beneath the text.

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs src/components/coming-soon/ src/pages/index.astro
git commit -m "feat: add coming soon header, hero and footer"
```

---

## Task 4: Qualifier and expectation sections

**Files:**

- Create: `src/components/coming-soon/ThisMightBeYou.astro`
- Create: `src/components/coming-soon/WhatToExpect.astro`
- Modify: `src/pages/index.astro` (add two imports and two elements)

**Interfaces:**

- Consumes: tokens from Task 1, the section shape from Task 3
- Produces: two prop-less components imported by `index.astro`

- [ ] **Step 1: Create `ThisMightBeYou.astro`**

`role="list"` on the `<ul>` is required: Safari drops list semantics when the bullets are removed. The eyebrow is `ink-700`, not `ink-500`, because this section sits on a tinted fill where `ink-500` fails AA.

```astro
<section
  aria-labelledby="this-might-be-you"
  class="bg-paper-100 border-paper-200 border-y"
>
  <div
    class="px-gutter py-section mx-auto grid max-w-page grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_3fr]"
  >
    <h2
      id="this-might-be-you"
      class="tracking-eyebrow text-ink-700 pt-3 text-xs uppercase"
    >
      This might be you
    </h2>
    <div class="max-w-3xl">
      <ul
        role="list"
        class="flex list-none flex-col gap-3.5"
      >
        <li class="text-ink-900 text-2xl leading-[1.4]">
          Maybe you’re thinking about leaving your job.
        </li>
        <li class="text-ink-900 text-2xl leading-[1.4]">
          Starting something of your own.
        </li>
        <li class="text-ink-900 text-2xl leading-[1.4]">
          Ending or changing a relationship.
        </li>
        <li class="text-ink-900 text-2xl leading-[1.4]">
          Finally showing your ideas to the world.
        </li>
        <li class="text-ink-900 text-2xl leading-[1.4]">
          Or simply admitting that the life that used to work for you… doesn’t
          anymore.
        </li>
      </ul>
      <p class="text-display-md mt-13 font-display leading-[1.3]">
        <span class="text-ink-900">You’re not necessarily lost.</span>
        <span class="text-peach-700 italic">
          You might just be in the middle of becoming someone who wants
          something different.
        </span>
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `WhatToExpect.astro`**

The hairline grid is `gap-0.5` over a `paper-200` background with `paper-50` cells — the 2px gaps _are_ the dividers. Do not use per-cell borders; they double up. The numerals are `aria-hidden` because the `<ol>` already conveys order and a screen reader would otherwise read "one, oh-one".

```astro
---
const steps = [
  {
    numeral: '01',
    title: 'Understand yourself.',
    body: 'See the patterns, beliefs and perceptions influencing your decisions.',
  },
  {
    numeral: '02',
    title: 'Get clear.',
    body: 'Separate what you actually want from what you think you should want.',
  },
  {
    numeral: '03',
    title: 'Move forward.',
    body: 'Make a conscious decision and take the next step.',
  },
];
---

<section aria-labelledby="what-you-can-expect">
  <div class="px-gutter py-section mx-auto max-w-page">
    <h2
      id="what-you-can-expect"
      class="tracking-eyebrow text-ink-500 mb-12 text-xs uppercase"
    >
      What you can expect
    </h2>
    <ol
      class="border-paper-200 bg-paper-200 grid list-none grid-cols-1 gap-0.5 border lg:grid-cols-3"
    >
      {
        steps.map((step) => (
          <li class="bg-paper-50 flex flex-col gap-3.5 p-10">
            <span
              aria-hidden="true"
              class="text-display-xs text-peach-700 font-display"
            >
              {step.numeral}
            </span>
            <h3 class="text-display-md leading-[1.2]">{step.title}</h3>
            <p class="text-ink-700 text-base leading-[1.65]">{step.body}</p>
          </li>
        ))
      }
    </ol>
  </div>
</section>
```

- [ ] **Step 3: Add both to `index.astro`**

Imports (nothing enforces ordering — no import-sort plugin is configured — but keep the existing alphabetical grouping):

```astro
import ThisMightBeYou from '../components/coming-soon/ThisMightBeYou.astro';
import WhatToExpect from '../components/coming-soon/WhatToExpect.astro';
```

Inside `<main>`, after `<Hero />`:

```astro
<ThisMightBeYou />
<WhatToExpect />
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run check && npm run build`
Expected: all exit 0.

In the browser: the sand section has a hairline above and below and reaches the full viewport width while its text stays within 1440px. The three expectation cells are separated by 2px lines, not 4px doubled ones. Below 1024px the cells stack with horizontal 2px dividers.

- [ ] **Step 5: Commit**

```bash
git add src/components/coming-soon/ src/pages/index.astro
git commit -m "feat: add qualifier and expectation sections"
```

---

## Task 5: Method card and personal note

**Files:**

- Create: `src/components/coming-soon/Method.astro`
- Create: `src/components/coming-soon/PersonalNote.astro`
- Modify: `src/pages/index.astro` (add two imports and two elements)

**Interfaces:**

- Consumes: tokens from Task 1, the section shape from Task 3
- Produces: two prop-less components imported by `index.astro`

- [ ] **Step 1: Create `Method.astro`**

The `1:1 Coaching / Demartini Method` label is visually a label but structurally this section's heading. Body copy is `ink-900` and the label is `ink-700` — `ink-500` would fail AA on the peach fill. The method is deliberately not promoted to a page-level heading.

```astro
<section aria-labelledby="how-i-work">
  <div class="px-gutter pb-section mx-auto max-w-page">
    <div
      class="bg-peach-100 grid grid-cols-1 items-start gap-16 rounded-[3px] p-16 lg:grid-cols-[1fr_2fr]"
    >
      <h2
        id="how-i-work"
        class="text-ink-700 text-sm leading-[1.7] tracking-[0.16em] uppercase"
      >
        1:1 Coaching<br />Demartini Method
      </h2>
      <div class="max-w-2xl">
        <p class="text-ink-900 text-xl leading-[1.6]">
          My work combines coaching with the Demartini Method to help you
          explore the perceptions, emotional patterns and beliefs that can keep
          you stuck.
        </p>
        <p
          class="text-display-md text-peach-700 mt-8 font-display leading-[1.35] italic"
        >
          No endless analysing. No telling you what you should do. We work
          towards understanding — and then making a choice.
        </p>
      </div>
    </div>
  </div>
</section>
```

This section uses `pb-section` only. The preceding section already supplies the top gap, and the handoff's `0 64px 104px` padding is the same intent.

- [ ] **Step 2: Create `PersonalNote.astro`**

The square crop is done in CSS with `aspect-square`, so the 3:4 source file is never modified.

```astro
---
import { Image } from 'astro:assets';

import portrait from '../../assets/images/ioana-portrait-outdoor.jpg';
---

<section
  aria-labelledby="hi-im-ioana"
  class="border-paper-200 border-t"
>
  <div
    class="px-gutter py-section mx-auto grid max-w-page grid-cols-1 items-center gap-18 lg:grid-cols-[2fr_3fr]"
  >
    <Image
      src={portrait}
      alt="Ioana Orca outdoors at sunset"
      sizes="(min-width: 1024px) 40vw, 100vw"
      class="aspect-square w-full rounded-[3px]"
    />
    <div>
      <h2
        id="hi-im-ioana"
        class="text-display-lg mb-8 leading-[1.1]"
      >
        Hi, I’m Ioana.
      </h2>
      <div class="flex max-w-xl flex-col gap-6">
        <p class="text-ink-700 text-lg leading-[1.75]">
          I know what it feels like to realise that the life you built isn’t
          necessarily the life you want next.
        </p>
        <p class="text-ink-700 text-lg leading-[1.75]">
          I’ve changed countries, careers, relationships, plans and directions.
          And I’ve learned that understanding yourself isn’t about finding
          what’s wrong with you.
        </p>
        <p
          class="text-display-md text-ink-900 font-display leading-[1.4] italic"
        >
          It’s about understanding yourself well enough to make different
          choices.
        </p>
      </div>
    </div>
  </div>
</section>
```

The image keeps Astro's `lazy` default — it is well below the fold.

- [ ] **Step 3: Add both to `index.astro`**

```astro
import Method from '../components/coming-soon/Method.astro'; import PersonalNote
from '../components/coming-soon/PersonalNote.astro';
```

Inside `<main>`, after `<WhatToExpect />`:

```astro
<Method />
<PersonalNote />
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run check && npm run build`
Expected: all exit 0.

In the browser: the peach card is inset within the gutter (not full-bleed) with no shadow; the personal note has a hairline above it and the square photo left of the text. Below 1024px the photo stacks _above_ the text.

- [ ] **Step 5: Commit**

```bash
git add src/components/coming-soon/ src/pages/index.astro
git commit -m "feat: add method card and personal note sections"
```

---

## Task 6: Launch section and signup form

**Files:**

- Modify: `astro.config.mjs` (add the `env` block, extend the `defineConfig` import)
- Create: `.env`
- Create: `.env.example`
- Create: `src/components/coming-soon/SignupForm.astro`
- Create: `src/components/coming-soon/Launch.astro`
- Modify: `src/pages/index.astro` (add one import and one element)
- Modify: `.github/workflows/ci.yml` (add the build env var)
- Modify: `.github/workflows/deploy.yml` (add the build env var)

**Interfaces:**

- Consumes: `subscribe(endpoint, email, honeypot)` and `isValidEmail(email)` from Task 2; tokens from Task 1
- Produces: `SignupForm.astro` (prop-less, rendered inside `Launch.astro`); `Launch.astro` (prop-less, imported by `index.astro`); the `PUBLIC_SUBSCRIBE_URL` client env var

- [ ] **Step 1: Add the env schema**

In `astro.config.mjs`, change the import line to:

```js
import { defineConfig, envField, fontProviders } from 'astro/config';
```

and add an `env` block:

```js
  env: {
    schema: {
      // optional:false fails the build when unset. Deliberate: a form posting
      // into the void is the worst failure for a page whose only job is
      // collecting emails. url:true additionally rejects an empty secret.
      // No startsWith constraint — that would hardcode Apps Script into the
      // config and undo the point of the subscribe() boundary.
      PUBLIC_SUBSCRIBE_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
        url: true,
      }),
    },
  },
```

- [ ] **Step 2: Create the env files**

`.env` is gitignored; `.env.example` is not. Both get the same placeholder until the Apps Script deployment exists (Task 7 replaces the local one).

`.env`:

```
PUBLIC_SUBSCRIBE_URL=https://example.invalid/noop
```

`.env.example`:

```
# Apps Script web app URL that receives signups. See
# scripts/apps-script/README.md for how to deploy one and get this URL.
PUBLIC_SUBSCRIBE_URL=https://script.google.com/macros/s/REPLACE_ME/exec
```

- [ ] **Step 3: Create `SignupForm.astro`**

The honeypot is positioned off-screen rather than `display: none`, which naive bots skip. `tabindex="-1"` keeps it out of the tab order, which is what makes `aria-hidden` on an input acceptable here.

```astro
<div class="bg-paper-50 rounded-[3px] p-12">
  <form
    id="signup"
    novalidate
    class="flex flex-col gap-4.5"
  >
    <h3 class="text-display-md font-display leading-[1.2]">
      Want to know when it’s live?
    </h3>
    <p class="text-ink-700 text-base leading-[1.6]">
      I’ll send one message when the website opens — nothing else.
    </p>

    <div
      aria-hidden="true"
      class="absolute -left-[9999px]"
    >
      <label for="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <label
      for="email"
      class="text-ink-500 mt-3.5 text-xs tracking-[0.16em] uppercase"
    >
      Email
    </label>
    <input
      id="email"
      name="email"
      type="email"
      required
      autocomplete="email"
      inputmode="email"
      placeholder="you@email.com"
      class="border-paper-200 bg-paper-50 placeholder:text-ink-500 rounded-[2px] border px-4 py-4 text-base"
    />
    <p
      id="email-error"
      role="alert"
      hidden
      class="text-peach-700 text-sm"
    >
    </p>

    <button
      type="submit"
      class="text-paper-50 mt-2 w-full rounded-[2px] bg-olive-600 py-4 text-sm font-semibold tracking-[0.14em] uppercase transition-[background-color] duration-150 hover:bg-olive-700 disabled:cursor-default disabled:opacity-70"
    >
      Join the list
    </button>
  </form>

  <div
    id="signup-success"
    hidden
    class="flex flex-col gap-4"
  >
    <h3
      id="signup-success-heading"
      tabindex="-1"
      class="text-display-md font-display leading-[1.2]"
    >
      You’re on the list.
    </h3>
    <p class="text-ink-700 text-base">
      I’ll be in touch when the website opens.
    </p>
  </div>
</div>

<script>
  import { PUBLIC_SUBSCRIBE_URL } from 'astro:env/client';

  import { isValidEmail, subscribe } from '../../lib/subscribe';

  const INVALID_MESSAGE = 'That doesn’t look like an email address.';
  const FAILURE_MESSAGE = 'Something went wrong. Please try again.';

  const form = document.querySelector<HTMLFormElement>('#signup');
  const success = document.querySelector<HTMLElement>('#signup-success');
  const heading = document.querySelector<HTMLElement>(
    '#signup-success-heading',
  );
  const email = document.querySelector<HTMLInputElement>('#email');
  const honeypot = document.querySelector<HTMLInputElement>('#website');
  const error = document.querySelector<HTMLElement>('#email-error');
  const button = form?.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );

  if (form && success && heading && email && honeypot && error && button) {
    let attempted = false;

    const showError = (message: string) => {
      error.textContent = message;
      error.hidden = false;
      email.setAttribute('aria-invalid', 'true');
      email.setAttribute('aria-describedby', 'email-error');
      email.classList.add('border-peach-700');
    };

    const clearError = () => {
      error.hidden = true;
      error.textContent = '';
      email.removeAttribute('aria-invalid');
      email.removeAttribute('aria-describedby');
      email.classList.remove('border-peach-700');
    };

    // Only after a failed submit — never on every keystroke.
    email.addEventListener('blur', () => {
      if (!attempted) return;
      if (isValidEmail(email.value)) clearError();
      else showError(INVALID_MESSAGE);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      attempted = true;

      if (!isValidEmail(email.value)) {
        showError(INVALID_MESSAGE);
        email.focus();
        return;
      }

      clearError();
      button.disabled = true;
      button.textContent = 'Sending…';

      const result = await subscribe(
        PUBLIC_SUBSCRIBE_URL,
        email.value,
        honeypot.value,
      );

      if (result.ok) {
        form.hidden = true;
        success.hidden = false;
        // Focus would otherwise be orphaned on a button that no longer exists.
        heading.focus();
        return;
      }

      button.disabled = false;
      button.textContent = 'Join the list';
      showError(
        result.reason === 'invalid' ? INVALID_MESSAGE : FAILURE_MESSAGE,
      );
    });
  }
</script>
```

`FAILURE_MESSAGE` is the one string on this page not in the client-approved copy — the brief never specified a server-error state. Flag it for Ioana's approval; do not invent more.

- [ ] **Step 4: Create `Launch.astro`**

```astro
---
import SignupForm from './SignupForm.astro';
---

<section
  aria-labelledby="something-new"
  class="bg-ink-900"
>
  <div
    class="px-gutter py-section mx-auto grid max-w-page grid-cols-1 items-start gap-20 lg:grid-cols-2"
  >
    <div>
      <h2
        id="something-new"
        class="tracking-eyebrow text-peach-300 mb-7 text-xs uppercase"
      >
        Something new is coming
      </h2>
      <p class="text-display-lg text-paper-50 font-display leading-[1.1]">
        I’m building a space for women who are ready to understand themselves
        better, make clearer decisions and create their next chapter.
      </p>
      <p class="text-paper-50/82 mt-8 text-lg leading-[1.65]">
        The website is launching soon.
      </p>
    </div>
    <div>
      <SignupForm />
      <div class="mt-9 flex flex-col gap-2.5">
        <p class="text-paper-50/82 text-base">In the meantime, follow along:</p>
        <a
          href="https://instagram.com/ioanaorca"
          class="text-display-md text-peach-300 hover:text-paper-50 font-display"
        >
          @ioanaorca
        </a>
      </div>
    </div>
  </div>
</section>
```

The Instagram link overrides both global `a` colours, and must: `peach-700` is unreadable on `ink-900`, and the global `olive-700` hover is nearly invisible against it. `peach-300` on `ink-900` is the audited 6.6:1 pairing; `paper-50` on hover keeps that. The underline from the base layer stays — the link must be identifiable without relying on colour.

- [ ] **Step 5: Add to `index.astro`**

```astro
import Launch from '../components/coming-soon/Launch.astro';
```

Inside `<main>`, after `<PersonalNote />`:

```astro
<Launch />
```

Section order in `<main>` is now: Hero, ThisMightBeYou, WhatToExpect, Method, PersonalNote, Launch.

- [ ] **Step 6: Give both workflows the env var**

In `.github/workflows/ci.yml`, add to the final `run` step:

```yaml
- run: npm run ${{ matrix.task }}
  env:
    # PRs must not depend on a real endpoint.
    PUBLIC_SUBSCRIBE_URL: ${{ secrets.SUBSCRIBE_URL || 'https://example.invalid/noop' }}
```

In `.github/workflows/deploy.yml`, extend the existing build step's `env`:

```yaml
- run: npm run build
  env:
    PUBLIC_RELEASE_TAG: ${{ steps.tag.outputs.value }}
    # No fallback. A missing secret must fail the deploy.
    PUBLIC_SUBSCRIBE_URL: ${{ secrets.SUBSCRIBE_URL }}
```

- [ ] **Step 7: Verify**

Run: `npm run lint && npm run format:check && npm run check && npm test && npm run build`
Expected: all exit 0.

Then confirm the required env var actually fails the build:

Run: `mv .env .env.bak && npm run build; mv .env.bak .env`
Expected: the build FAILS naming `PUBLIC_SUBSCRIBE_URL`, then succeeds again after the restore.

In the browser (`npx astro dev --background`): submit an empty form — an error appears below the input, the border turns brown, and focus lands on the input. Submit `nope` — same. Submit a valid address — the button reads `Sending…`, then the card swaps to `You’re on the list.` (the placeholder endpoint fails DNS, so expect `Something went wrong. Please try again.` until Task 7 supplies a real URL; that is the correct behaviour for an unreachable endpoint). Tab through the form — the honeypot must never receive focus.

- [ ] **Step 8: Commit**

```bash
git add astro.config.mjs .env.example src/components/coming-soon/ src/pages/index.astro .github/workflows/
git commit -m "feat: add launch section with email signup form"
```

---

## Task 7: Apps Script backend and documentation

**Files:**

- Create: `scripts/apps-script/Code.gs`
- Create: `scripts/apps-script/README.md`
- Modify: `README.md:19-27` (replace the newsletter TODO)

**Interfaces:**

- Consumes: the request body shape produced by `subscribe()` in Task 2 — `{ email, website, source, consent }` posted as `text/plain`
- Produces: a JSON response `{ ok: true }` or `{ ok: false, reason: 'invalid' }`, matching what `subscribe()` parses

- [ ] **Step 1: Create `scripts/apps-script/Code.gs`**

```js
/**
 * Receives signups from the coming-soon page and appends them to the bound
 * sheet. Deployed as a web app: "Execute as: me", "Access: anyone".
 *
 * The client posts Content-Type: text/plain so the request stays a CORS
 * simple request — Apps Script web apps cannot answer a preflight.
 */

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, reason: 'invalid' });
  }

  // Honeypot. The browser short-circuits before sending, so a filled value
  // means something posted here directly without running our JavaScript.
  if (data.website) return json({ ok: true });

  var email = String(data.email || '')
    .trim()
    .toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return json({ ok: false, reason: 'invalid' });

  // The dedupe is a read-then-write, so concurrent submits must serialise.
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var seen = sheet.getRange('A:A').getValues().flat();
    if (seen.indexOf(email) === -1) {
      sheet.appendRow([
        email,
        // Stamped server-side: client clocks are wrong often enough to poison
        // the consent record, which is the column that has to hold up.
        new Date().toISOString(),
        String(data.source || ''),
        String(data.consent || ''),
      ]);
    }
  } finally {
    lock.releaseLock();
  }

  // A duplicate returns success. Never disclose list membership.
  return json({ ok: true });
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
```

- [ ] **Step 2: Create `scripts/apps-script/README.md`**

```markdown
# Signup endpoint

`Code.gs` backs the coming-soon page's email form. It lives here so it is
version-controlled rather than existing only inside Google's script editor.
Edits here are **not** deployed automatically — paste them in and redeploy.

## First deployment

1. Create a Google Sheet. Row 1 headers: `email`, `timestamp`, `source`,
   `consent`.
2. Extensions → Apps Script. Paste `Code.gs` over the default file.
3. Deploy → New deployment → Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the `/exec` URL.
5. Put it in `.env` as `PUBLIC_SUBSCRIBE_URL`, and in the repository secret
   `SUBSCRIBE_URL` (Settings → Secrets and variables → Actions).

## Redeploying after an edit

Deploy → Manage deployments → edit the existing deployment → Version: New
version. Creating a _new_ deployment instead changes the URL and silently
breaks the live form.

## Notes

- The URL is inlined into the client bundle. It is not a secret; it is an env
  var so local development can point at a throwaway sheet.
- Duplicate addresses return success without a second row. Do not "fix" this —
  disclosing list membership is the bug.
- Storing `consent` is what makes a later import into a real email tool
  defensible under GDPR. Bump the version string in `src/lib/subscribe.ts` if
  the wording on the signup card changes.
```

- [ ] **Step 3: Update `README.md`**

Two surgical edits. **Do not rewrite the whole `## TODO` section** — it carries handoff items that are still open (the ruleset change, the `SUBSCRIBE_URL` secret, the error-copy approval). Leave those exactly as they are.

First, insert a `## Signup` section immediately above `## TODO`:

```markdown
## Signup

The coming-soon form posts to a Google Apps Script web app backed by a Sheet.
Setup and redeployment: `scripts/apps-script/README.md`. Local development
needs `PUBLIC_SUBSCRIBE_URL` in `.env` — copy `.env.example`.
```

Second, under the `Later:` heading inside `## TODO`, replace the **Newsletter signup** bullet (now built) with:

```markdown
- **Migrate to Kit** — signups currently land in a Sheet. Moving to a real
  email tool means rewriting the body of `src/lib/subscribe.ts` and changing
  `PUBLIC_SUBSCRIBE_URL`; nothing else.
```

Leave the **Analytics** bullet alone.

- [ ] **Step 4: Deploy the script and wire the real URL**

Follow `scripts/apps-script/README.md`. Then put the `/exec` URL in `.env` and add the `SUBSCRIBE_URL` repository secret.

- [ ] **Step 5: Verify end to end**

Run: `npx astro dev --background`, submit a real address on the page.
Expected: the card swaps to `You’re on the list.` and a row appears in the Sheet with all four columns populated.

Submit the same address again.
Expected: success again, and **no** second row.

- [ ] **Step 6: Verify the full gate**

Run: `npm run lint && npm run format:check && npm run check && npm test && npm run build`
Expected: all exit 0.

- [ ] **Step 7: Commit**

```bash
git add scripts/ README.md
git commit -m "feat: add apps script signup endpoint and setup docs"
```

---

## After the plan

Two things that cannot be done from the repository:

1. **Add `test` to ruleset `20887796`.** It requires `lint`, `check`, `format:check`, `build` by name. Until `test` is added, it runs on PRs without blocking merge.

   ```bash
   gh api repos/IoanaOrca/website/rulesets/20887796 --jq '.rules'
   ```

   Then either patch the ruleset or add it via Settings → Rules.

2. **Add the `SUBSCRIBE_URL` repository secret.** Without it the deploy build fails by design.

Also worth raising with Ioana: `Something went wrong. Please try again.` is the only string on the page outside the approved copy.
