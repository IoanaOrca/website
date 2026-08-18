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

Later:

- **Finish the Impressum** — waiting on the business registration, since § 5 DDG
  wants the registered postal address. `src/pages/_imprint.astro` is drafted but
  excluded from the build (underscore prefix) until that address exists.
  `docs/privacy-policy-handoff.md` covers this and the rest of the legal pages.
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
- **Social preview** — `src/layouts/BaseLayout.astro` has no `og:*` or
  `twitter:card` tags, so the page currently pastes as a bare URL with no
  image, title or description. Its only distribution channel is an Instagram
  bio link, so that costs clicks on the one thing the page exists to do.
  Roughly 15 lines: `site` is already set to `https://ioanaorca.com` so
  absolute URLs resolve, and `src/assets/images/ioana-hero-studio.jpg` is a
  usable source for a generated OG image.
