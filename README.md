# ioanaorca.com

Personal site for Ioana Orca, mindset coach.

## Stack

- [Astro](https://astro.build) — static output, no client JS by default
- [Tailwind](https://tailwindcss.com) — brand tokens in `src/styles/global.css`
- GitHub Pages — deployed on push to `main`

```sh
npm install
npm run dev
```

Other scripts are in `package.json`. Working notes and conventions are in
`CLAUDE.md`.

## Signup

The coming-soon form posts to a Google Apps Script web app backed by a Sheet.
Setup and redeployment: `scripts/apps-script/README.md`. Local development
needs `PUBLIC_SUBSCRIBE_URL` in `.env` — copy `.env.example`.

## TODO

Before changing the coming-soon page, read **Decisions that look like bugs** in
`CLAUDE.md` — duplicate signups return success on purpose, the input is 16px on
purpose, and a few other things are load-bearing in ways the code doesn't show.

Blocking, and not doable from inside the repo:

- **Redeploy the Apps Script.** `scripts/apps-script/Code.gs` now emails the
  script owner on each new signup, but the deployed copy predates that — the
  repo and the live script have diverged. Paste the current file into the
  editor and Deploy → Manage deployments → **New version** on the existing
  deployment. Creating a _new_ deployment changes the URL and breaks the live
  form. The first signup after redeploying will ask you to authorise the
  `MailApp` scope.
- **Add `test` to the branch ruleset** — ruleset `20887796` on `main` requires
  `lint`, `check`, `format:check` and `build` by name. Until `test` joins them
  it runs on PRs without blocking merge, so a red test sits beside a green
  merge button. Settings → Rules, or `gh api`.
- **Finish the privacy policy** — the `/privacy` page exists and is linked from
  the footer, and the policy now names Google (Sheets and Apps Script, the
  signup store) and GitHub Pages (the host) with their transfer bases. Three
  gaps remain, all needing facts only Ioana can supply:
  - No retention period for the signup list. The policy says data is kept
    "until we transfer it to an email provider or you ask us to erase it",
    which is honest but open-ended. How long is an address that never converts
    kept?
  - The controller is "Ioana Iordache" and the site is "Ioana Orca", with
    nothing connecting them. A visitor can't tell it's the same person —
    "Ioana Iordache, trading as Ioana Orca" would fix it.
  - The policy still describes cookies with a consent management solution,
    web analytics, a contact form, an online shop and employees. Kept
    deliberately because analytics are coming, but the cookie section claims a
    consent mechanism that does not exist — when analytics land, either install
    a real CMP or narrow that section.

  Worth knowing before the Kit migration: the stored `consent` string records
  what the person was _shown_, not that _they_ submitted it. The endpoint is
  unauthenticated and single-opt-in, so anyone can type someone else's address
  into it. Double opt-in is what actually produces evidence of consent — Kit
  does it natively, but addresses imported from the Sheet will not carry that
  provenance.

Needs a decision from Ioana:

- **Copy outside the approved set** — two strings on the page were never in the
  client-approved brief: `Something went wrong. Please try again.` (the brief
  specified no server-error state) and `First name (optional)` (the field was
  added later). The `(optional)` half is load-bearing, not decoration — without
  it people assume the field is required, which is the friction the optional
  field exists to avoid. Reword freely, but keep the optionality visible.

Later:

- **Analytics** — Cloudflare Web Analytics (free, cookieless, one script tag) or
  [Umami](https://umami.is) if we need custom events for signup conversions.
- **Migrate to Kit** — signups currently land in a Sheet. Moving to a real
  email tool means rewriting the body of `src/lib/subscribe.ts` and changing
  `PUBLIC_SUBSCRIBE_URL`; nothing else.
- **Signup form rough edges** — found in review, deliberately deferred because
  each needs a copy or design decision rather than a fix:
  - A server or network failure reuses the invalid-email path, so it sets
    `aria-invalid="true"` on a perfectly good address and points
    `aria-describedby` at a message that isn't about the field. Wants its own
    `role="alert"` below the button, which means new copy.
  - Nothing is announced between submit and result. If you submit with Enter
    from the input, focus stays there and the `Sending…` label change reaches
    no assistive tech. `aria-busy` on the form, or route it through the alert
    region.
  - The card collapses from ~500px to ~190px when it swaps to the success
    state, yanking the footer up under whoever is reading the confirmation. A
    `min-h` holds the space.
  - The six-way null guard around the DOM lookups silently skips attaching all
    listeners if an id is ever mistyped. The form has no `action` and uses
    `novalidate`, so a submit would then fall through to a default GET reload
    with the email in the query string. Registering an unconditional
    `preventDefault` before the guard is cheap insurance.
- **Social preview** — `src/layouts/BaseLayout.astro` has no `og:*` or
  `twitter:card` tags, so the page currently pastes as a bare URL with no
  image, title or description. Its only distribution channel is an Instagram
  bio link, so that costs clicks on the one thing the page exists to do.
  Roughly 15 lines: `site` is already set to `https://ioanaorca.com` so
  absolute URLs resolve, and `src/assets/images/ioana-hero-studio.jpg` is a
  usable source for a generated OG image.
