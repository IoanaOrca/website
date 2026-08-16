# Coming Soon page — design spec

Date: 2026-08-16
Branch: `feat/coming-soon-implementation`
Sources: `docs/Ioana_Orca_Pre-Launch_Coming-Soon_Page.md` (content),
`docs/handoff-coming-soon.md` (design handoff)

## Scope

Replace the placeholder `src/pages/index.astro` with the full pre-launch page: eight
stacked sections, no navigation, no routing. Primary conversion is email signup;
secondary is an Instagram follow.

Also in scope: reconciling `src/styles/global.css` with the brand's accessibility audit,
adding Vitest, and wiring both the new test task and the signup endpoint into CI.

## Deviations from the handoff

The handoff is an unreviewed prototype export. These departures are deliberate and were
agreed during brainstorming.

| Handoff                                   | Here                                                            | Why                                                                      |
| ----------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 9 display sizes, 9 body sizes             | 5 fluid display steps, Tailwind's stock body scale              | 48 vs 44 and 34/32/30 are prototype noise, not a type scale              |
| `max-width: 1440px` on the page container | Full-bleed section backgrounds, contained content               | Requested; avoids paper margins beside the dark section on wide monitors |
| Grid ratios `1.02fr 0.98fr` etc.          | Rounded to `grid-cols-2`, `[1fr_3fr]`, `[1fr_2fr]`, `[2fr_3fr]` | The originals are rounding artefacts                                     |
| Hero image 4:5                            | Native 3:4                                                      | Source photo is 3:4; cropping costs pixels for a 55px height difference  |
| Input `font-size: 15px`                   | 16px                                                            | Under 16px, iOS zooms the viewport on focus                              |
| `#EFE9DE` placeholder                     | `paper-100` (`#F0E9DC`)                                         | One hex apart; avoids a twelfth colour                                   |
| `showEmailForm` / `showPersonal` flags    | Dropped, both sections always render                            | Both are known `true`; a flag for a known value is speculative config    |
| Section padding 96 / 104                  | One fluid `--spacing-section`                                   | Two values one step apart                                                |
| No semantics specified                    | Landmarks, one `h1`, `ul`/`ol`, `role="alert"`                  | The prototype has none                                                   |

Personal-note image stays 1:1 as specced — in the narrower column a 3:4 would run ~700px
tall against a ~350px text block.

## Design tokens

All in `@theme` in `src/styles/global.css`. Naming rule: `family-NNN`, higher is darker.
No `-deep`, `-dark`, `-tint`, `-80`, `-muted`.

### Colour

| Token       | Hex       | Use                                             |
| ----------- | --------- | ----------------------------------------------- |
| `paper-50`  | `#FAF7F1` | page background, text on dark, signup card      |
| `paper-100` | `#F0E9DC` | "This might be you" fill, image placeholders    |
| `paper-200` | `#E3DCCF` | hairlines, borders, input border                |
| `peach-100` | `#F2D9C4` | method card fill                                |
| `peach-300` | `#E3B08C` | accent rule, eyebrow on dark, `@ioanaorca`      |
| `peach-700` | `#7A5638` | italic accent type, links, numerals, error text |
| `olive-600` | `#5F6D5B` | primary CTA background — **nothing else**       |
| `olive-700` | `#4E5C4A` | button hover, link hover, focus ring            |
| `ink-500`   | `#6E6C5E` | small labels, on `paper-50` ground only         |
| `ink-700`   | `#4A4A42` | body copy; required on tinted fills             |
| `ink-900`   | `#3A3A33` | primary text, dark section background           |

Removed: `--color-olive` (`#7e8c7a`) — absent from the handoff, unused after this work.

`rgba(250,247,241,0.82)` gets no token. Tailwind v4's opacity modifier covers it:
`text-paper-50/82`.

Two rules from the brand's contrast audit, both load-bearing:

1. `ink-500` is legible only on `paper-50`. On `paper-100` or `peach-100` use `ink-700`.
2. `olive-600` is reserved for primary CTAs. Never a fill, accent, or link colour.

Verified pairings to preserve: `peach-300` on `ink-900` 6.6:1, `olive-600` on `ink-900`
5.7:1, `ink-700` on `paper-100` 7.4:1, `peach-700` on `paper-50` 4.95:1.

### Type

Body uses Tailwind's stock scale — no new tokens.

| Handoff | Utility     |
| ------- | ----------- |
| 26      | `text-2xl`  |
| 21      | `text-xl`   |
| 19, 18  | `text-lg`   |
| 16, 15  | `text-base` |
| 14, 13  | `text-sm`   |
| 11      | `text-xs`   |

Display gets five fluid steps:

```css
/* 38 → 62  hero */
--text-display-xl: clamp(2.375rem, 6vw, 3.875rem);
/* 32 → 46  launch heading, personal heading */
--text-display-lg: clamp(2rem, 4.5vw, 2.875rem);
/* 26 → 32  section closers, card headings, @handle */
--text-display-md: clamp(1.625rem, 3vw, 2rem);
/* 24 → 28  wordmark */
--text-display-sm: clamp(1.5rem, 2.2vw, 1.75rem);
/* 20 → 22  numerals, tagline */
--text-display-xs: clamp(1.25rem, 1.6vw, 1.375rem);

--tracking-eyebrow: 0.22em;
```

### Spacing

```css
--spacing-gutter: clamp(1.5rem, 5vw, 4rem); /* 24 → 64 */
--spacing-section: clamp(4rem, 8vw, 6rem); /* 64 → 96 */
--container-page: 1440px; /* was 1240px */
```

Tailwind v4's `--spacing-*` namespace feeds every spacing utility, so `px-gutter`,
`py-section`, and `gap-gutter` come free and need no breakpoint variants.

Everything else lands on Tailwind's stock spacing scale exactly, so no rounding is needed
and no arbitrary values appear outside the five grid ratios:

| Handoff                                    | Utility                                             |
| ------------------------------------------ | --------------------------------------------------- |
| grid gaps 64 / 72 / 80                     | `gap-16` / `gap-18` / `gap-20`                      |
| card padding 48 / 64                       | `p-12` / `p-16`                                     |
| stack gaps 6 / 10 / 14 / 18 / 24 / 32 / 52 | `1.5` / `2.5` / `3.5` / `4.5` / `6` / `8` / `13`    |
| text measures 520 / 560 / 640 / 760        | `max-w-lg` / `max-w-xl` / `max-w-2xl` / `max-w-3xl` |

The `56px` gap and the `44px` cell padding are the only two values that shift — to
`gap-16` and `p-10` respectively, both one step away and both invisible.

Radius `2px` (input, button) and `3px` (cards, images). **No shadows anywhere** — the
brand separates with hairlines and fills.

## `global.css` changes

Beyond the token block:

- `a` → `peach-700`, hover `olive-700`, `text-decoration-thickness: 1px`,
  `text-underline-offset: 3px`. Was `olive-600`, which breaks the CTA-only rule.
- `:focus-visible` → `2px solid olive-700`, `outline-offset: 3px`. Same violation fixed.
- Delete the `h1` and `h2` size rules. Base keeps `font-family`, `font-weight: 400`, and
  gains `text-wrap: pretty`. Seven display sizes cannot be served by two blanket rules;
  components state their own step.
- Body base drops to `16px / 1.65`. The current `1.75` is the personal-section value.
- The `prefers-reduced-motion` block is already correct. Leave it.

## Component structure

```
src/pages/index.astro              composes, nothing else
src/components/coming-soon/
  Header.astro         Hero.astro           ThisMightBeYou.astro
  WhatToExpect.astro   Method.astro         PersonalNote.astro
  Launch.astro         Footer.astro         SignupForm.astro
src/lib/subscribe.ts
src/lib/subscribe.test.ts
scripts/apps-script/Code.gs
scripts/apps-script/README.md
```

These are partitions, not abstractions — no props, no reuse contract, one file per
section. Section shape:

```astro
<section class="bg-… border-…">
  <div class="mx-auto max-w-page px-gutter py-section">…</div>
</section>
```

Background on the outer element (full bleed), container on the inner.

All multi-column grids collapse to one column below `lg` (1024px). No `order` utilities
needed: hero is text-then-image and personal is image-then-text in the DOM, which is
already the required stacking order.

## Copy

Client-approved and final. Do not paraphrase, shorten, or "improve". Use typographic
punctuation throughout — apostrophe `’`, ellipsis `…`, em dash `—`.

Two phrases must survive verbatim: `You know something needs to change. You just don’t
know what to do next.` and `Coaching for your next chapter.`

### 1. Header

`<header>`, flex row, `items-end`, `justify-between`, `border-b border-paper-200`.

- Wordmark `Ioana Orca` — display font, `text-display-sm`, `ink-900`,
  `letter-spacing: 0.01em`. Plain text, **not** a heading.
- Tagline `Coaching for your next chapter.` — display italic, `text-lg`, `peach-700`.
- Right: `Launching autumn 2026` — `text-xs`, `tracking-eyebrow`, uppercase, `ink-500`.
  A constant in the component.

### 2. Hero

`grid-cols-2` at `lg`, `items-center`.

Left:

- `h1`, `text-display-xl`, `leading-[1.06]`, `-tracking-[0.01em]`. Line 1
  `You know something needs to change.` roman `ink-900`; line 2
  `You just don’t know what to do next.` italic `peach-700`, `mt-1.5`.
- Rule: `h-0.5 w-22 bg-peach-300 my-11`.
- Body: `I help women understand what’s keeping them stuck, get clear on what they
actually want, and make decisions they feel confident about.` — `text-lg`,
  `leading-[1.65]`, `ink-700`, `max-w-lg`.

Right: hero photo, `aspect-[3/4]`, `rounded-[3px]`.

### 3. This might be you

`bg-paper-100`, `border-y border-paper-200`, `grid-cols-[1fr_3fr]`, `items-start`.

Left: `h2` `This might be you` — `text-xs`, `tracking-eyebrow`, uppercase, `ink-700`
(not `ink-500`; this is a tinted ground).

Right, `max-w-3xl`. A `<ul role="list">` — the explicit role is required because Safari
drops list semantics when bullets are removed. Five items, `text-2xl`, `leading-[1.4]`,
`ink-900`, `gap-3.5`:

1. `Maybe you’re thinking about leaving your job.`
2. `Starting something of your own.`
3. `Ending or changing a relationship.`
4. `Finally showing your ideas to the world.`
5. `Or simply admitting that the life that used to work for you… doesn’t anymore.`

Closer, `mt-13`, display `text-display-md`, `leading-[1.3]`: `You’re not necessarily
lost.` roman `ink-900`, then inline `You might just be in the middle of becoming someone
who wants something different.` italic `peach-700`.

### 4. What you can expect

`h2` `What you can expect` — `text-xs`, `tracking-eyebrow`, uppercase, `ink-500`,
`mb-12`.

Hairline grid: `grid grid-cols-3 gap-0.5 bg-paper-200 border border-paper-200`, cells
`bg-paper-50 p-10`. The 2px gaps _are_ the dividers — per-cell borders would double up.
One column below `lg`; the technique still works horizontally.

Marked up as an `<ol>` (the three steps are sequential). Numerals are `aria-hidden` —
the list already conveys order, and otherwise a screen reader reads "one, oh-one".

| #   | Title (`h3`, display, `text-display-md`) | Body (`text-base`, `ink-700`)                                           |
| --- | ---------------------------------------- | ----------------------------------------------------------------------- |
| 01  | `Understand yourself.`                   | `See the patterns, beliefs and perceptions influencing your decisions.` |
| 02  | `Get clear.`                             | `Separate what you actually want from what you think you should want.`  |
| 03  | `Move forward.`                          | `Make a conscious decision and take the next step.`                     |

Numerals: display, `text-display-xs`, `peach-700`.

### 5. Method

Card `bg-peach-100 rounded-[3px] p-16 grid-cols-[1fr_2fr] gap-16 items-start`.

Left: `h2`, `1:1 Coaching` / `Demartini Method` on two lines — `text-sm`,
`tracking-[0.16em]`, uppercase, `ink-700`, `leading-[1.7]`. Visually a label,
structurally the section head.

Right, `max-w-2xl`:

- `My work combines coaching with the Demartini Method to help you explore the
perceptions, emotional patterns and beliefs that can keep you stuck.` — `text-xl`,
  `leading-[1.6]`, `ink-900`.
- `mt-8`: `No endless analysing. No telling you what you should do. We work towards
understanding — and then making a choice.` — display italic, `text-display-md`,
  `leading-[1.35]`, `peach-700`.

The method is deliberately not the headline. Do not promote it.

### 6. Personal note

`border-t border-paper-200`, `grid-cols-[2fr_3fr]`, `items-center`.

Left: outdoor photo, `aspect-square`, `object-cover`, `rounded-[3px]`.

Right:

- `h2` `Hi, I’m Ioana.` — `text-display-lg`, `leading-[1.1]`, `mb-8`.
- Stack `gap-6`, `max-w-xl`:
  - `I know what it feels like to realise that the life you built isn’t necessarily the
life you want next.` — `text-lg`, `leading-[1.75]`, `ink-700`
  - `I’ve changed countries, careers, relationships, plans and directions. And I’ve
learned that understanding yourself isn’t about finding what’s wrong with you.` —
    same
  - `It’s about understanding yourself well enough to make different choices.` — display
    italic, `text-display-md`, `leading-[1.4]`, `ink-900`

### 7. Launch

`bg-ink-900`, `grid-cols-2`, `gap-20`, `items-start`.

Left:

- `h2` `Something new is coming` — `text-xs`, `tracking-eyebrow`, uppercase,
  `peach-300`, `mb-7`.
- `I’m building a space for women who are ready to understand themselves better, make
clearer decisions and create their next chapter.` — display, `text-display-lg`,
  `leading-[1.1]`, `paper-50`.
- `The website is launching soon.` — `text-lg`, `paper-50/82`, `mt-8`.

Right: `SignupForm`, then `mt-9`:

- `In the meantime, follow along:` — `text-base`, `paper-50/82`
- `@ioanaorca` — display, `text-display-md`, `peach-300`, linking to
  `https://instagram.com/ioanaorca`

### 8. Footer

`<footer>`, flex row, `justify-between`, `items-center`.

- Left `Ioana Orca` — `text-sm`, `tracking-eyebrow`, uppercase, `ink-700`
- Right `Sessions online, in English and Romanian.` — `text-sm`, `ink-500`

## Images

`src/assets/images/` — **not** `public/`. Only files imported from `src/` reach the
optimisation pipeline.

Rename on arrival: `ioana-1.jpg` → `ioana-hero-studio.jpg`, `ioana-2.jpg` →
`ioana-portrait-outdoor.jpg`. Both are 1086×1448 (3:4).

Config addition:

```js
image: {
  layout: 'constrained',
  responsiveStyles: true,
},
```

`layout` makes `<Image>` derive `srcset` and `sizes` from the source. `responsiveStyles`
defaults to **false**; without it the scaling and `object-fit` rules are never emitted.

```astro
<Image
  src={heroPortrait}
  alt="Ioana Orca, seated with a laptop against a warm neutral backdrop"
  sizes="(min-width: 1024px) 50vw, 100vw"
  loading="eager"
  fetchpriority="high"
  class="aspect-[3/4] w-full rounded-[3px]"
/>
```

The hero portrait is the LCP element, so it overrides Astro's `lazy` default. The
personal photo keeps `lazy`; alt `Ioana Orca outdoors at sunset`.

Known limitation: the hero renders at ~656 CSS px, so retina wants ~1312 and the source
is 1086 — 1.66×, marginally soft. Acceptable for photographic content. If
higher-resolution originals surface, drop them in; nothing else changes.

## Signup

### Boundary

```ts
// src/lib/subscribe.ts
export type SubscribeResult =
  { ok: true } | { ok: false; reason: 'invalid' | 'network' | 'server' };

export function isValidEmail(email: string): boolean;
export function subscribe(
  email: string,
  honeypot: string,
): Promise<SubscribeResult>;
```

`SignupForm.astro` imports only these. Migrating to Kit later rewrites the body of
`subscribe()` and changes one env var; the component, markup, and tests do not move.

Validation is `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Not an RFC-5322 regex — those reject real
addresses and admit fake ones. The client catches typos; the server confirms delivery.

POST body is JSON sent with `Content-Type: text/plain`:

```json
{ "email": "…", "website": "", "source": "coming-soon", "consent": "v1" }
```

`website` is the honeypot and is always empty by the time a request is sent — the client
short-circuits before calling `fetch`. It is still transmitted, and the server still
checks it, because a bot posting directly to the endpoint never runs our JavaScript. The
two checks guard different attack paths; neither is redundant.

`text/plain` makes it a simple request, so there is no CORS preflight — which Apps Script
cannot answer. Apps Script 302s to `googleusercontent.com` and the followed response
carries `Access-Control-Allow-Origin: *`, so the JSON is readable. `mode: 'no-cors'`
would also deliver the request but blind the client, costing the error state.

Consent string `v1` corresponds to the visible promise: `I’ll send one message when the
website opens — nothing else.` Bump the version if that wording changes.

### Form behaviour

States: `idle | invalid | submitting | success | error`.

- `<form novalidate>` so messaging is ours, but the input keeps `type="email"`,
  `required`, `autocomplete="email"`, `inputmode="email"` for the mobile keyboard.
- Validate on submit. After the first failed submit, also on blur. Never on keystroke.
- Error: `<p role="alert">` below the input, `peach-700`, `text-sm`; input border becomes
  `peach-700` and gains `aria-invalid="true"` + `aria-describedby`. Without
  `role="alert"` a screen reader user submits and hears nothing.
  Copy: `That doesn’t look like an email address.`
- Submitting: button disabled, label `Sending…`, `opacity-70`, `cursor-default`.
- Success: replace the card body, keep the card. `You’re on the list.` (display,
  `text-display-md`) and `I’ll be in touch when the website opens.` (`text-base`,
  `ink-700`). **Move focus to the success heading** (`tabindex="-1"` + `.focus()`) —
  otherwise focus is orphaned on a removed button. No redirect.
- Duplicate → success. Never disclose list membership.
- Honeypot: field named `website`, visually hidden, `tabindex="-1"`,
  `autocomplete="off"`, `aria-hidden="true"`. If filled, render success and send nothing.

No Turnstile. It solves abuse this page has not had; add it if the sheet fills with junk.

### Card markup

`bg-paper-50 rounded-[3px] p-12`, stack `gap-4.5`.

- `h3` `Want to know when it’s live?` — display, `text-display-md`, `leading-[1.2]`
- `I’ll send one message when the website opens — nothing else.` — `text-base`,
  `leading-[1.6]`, `ink-700`
- Label `Email` — `text-xs`, `tracking-[0.16em]`, uppercase, `ink-500`, `mt-3.5`
- Input — `bg-paper-50 border border-paper-200 rounded-[2px] px-4 py-4 text-base`,
  placeholder `you@email.com` in `ink-500`
- Button `Join the list` — `bg-olive-600 text-paper-50 font-semibold text-sm
tracking-[0.14em] uppercase py-4 rounded-[2px] w-full mt-2`, hover `olive-700`,
  `transition-[background] duration-150`

### Apps Script

Version-controlled at `scripts/apps-script/Code.gs` so it does not live only inside
Google's editor.

```js
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.website) return json({ ok: true }); // honeypot
  const email = String(data.email || '')
    .trim()
    .toLowerCase();
  if (!isEmail(email)) return json({ ok: false, reason: 'invalid' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // dedupe is read-then-write
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const seen = sheet.getRange('A:A').getValues().flat();
    if (!seen.includes(email)) {
      sheet.appendRow([
        email,
        new Date().toISOString(),
        data.source,
        data.consent,
      ]);
    }
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}
```

Sheet columns: `email | timestamp | source | consent`. The timestamp is stamped
server-side — client clocks are wrong often enough to poison the consent record, which is
the one column that has to hold up under scrutiny.

Deployment: _Execute as: me_, _Access: anyone_. Notes go in the adjacent README.

## Configuration

```js
env: {
  schema: {
    PUBLIC_SUBSCRIBE_URL: envField.string({
      context: 'client', access: 'public', optional: false, url: true,
    }),
  },
}
```

`optional: false` fails the build when the URL is missing — deliberate, because a form
posting into the void is the worst failure mode for a page whose only job is collecting
emails. `url: true` additionally rejects an empty or malformed secret.

Deliberately **not** `startsWith: 'https://script.google.com/'`, which would hardcode
Apps Script into the config and undo the point of the `subscribe()` boundary.

`PUBLIC_` because the value is inlined into the client bundle. It is not a secret; it is
an env var so dev can point at a throwaway test sheet.

## Testing

Vitest, node environment, no jsdom. Tests colocate with implementation.

`tsconfig.json` has `"include": ["**/*"]`, so `astro check` type-checks the test file.
Therefore **no vitest globals** — import `describe`, `expect`, `it`, `vi` explicitly, and
no `types` entry is needed.

| `isValidEmail`           | `subscribe` (mocked fetch)                         |
| ------------------------ | -------------------------------------------------- |
| valid address            | 2xx → `{ ok: true }`                               |
| missing `@`, missing TLD | `{ ok: false, reason: 'invalid' }` passthrough     |
| whitespace, empty string | non-2xx → `server`                                 |
|                          | fetch rejects → `network`                          |
|                          | honeypot filled → `ok`, **and fetch never called** |

The last assertion is the one that matters — it is the only proof the honeypot
short-circuits rather than being decorative.

`npm test` (`vitest run`) added to `package.json` and to lefthook `pre-push` beside
`check`.

## CI

`ci.yml` matrix becomes `[lint, format:check, check, test, build]`.

The build job needs the env var, but PRs should not depend on a real endpoint:

```yaml
# ci.yml
env:
  PUBLIC_SUBSCRIBE_URL: ${{ secrets.SUBSCRIBE_URL || 'https://example.invalid/noop' }}

# deploy.yml — no fallback; a missing secret must fail the deploy
env:
  PUBLIC_SUBSCRIBE_URL: ${{ secrets.SUBSCRIBE_URL }}
```

**Follow-up outside the repo:** ruleset `20887796` on `main` requires exactly `lint`,
`check`, `format:check`, `build` by name. Until `test` is added there, it runs on PRs but
does not block merge — a red `test` would sit beside a green merge button. Patch via
`gh api` or Settings → Rules.

## Out of scope

- Analytics (`README.md` TODO — Cloudflare Web Analytics or Umami)
- Migration to Kit / ConvertKit — the boundary exists for it; the work is later
- The remaining four pages in `design/Website Mockups.dc.html`
- Turnstile
- Entrance animations. The handoff specifies none and this page is dense type; the
  `prefers-reduced-motion` block stays as insurance for anything added later.

## Known gaps

`docs/handoff-coming-soon.md` references a `design/` directory that does not exist in the
repo, on disk, or in git history. Every hex, size, and spacing value is transcribed in the
handoff text, so the page is implementable — but "pixel-perfect against the design file"
cannot be verified. Layout judgement calls get settled in the browser.
