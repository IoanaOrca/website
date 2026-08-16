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

## TODO

Coming-soon page work is specced in
`docs/superpowers/specs/2026-08-16-coming-soon-page-design.md`. Read that before
changing the page — it records why several things are the way they are
(duplicate signups return success on purpose, the input is 16px on purpose).

Blocking, and not doable from inside the repo:

- **Add `test` to the branch ruleset** — ruleset `20887796` on `main` requires
  `lint`, `check`, `format:check` and `build` by name. Until `test` joins them
  it runs on PRs without blocking merge, so a red test sits beside a green
  merge button. Settings → Rules, or `gh api`.
- **Add the `SUBSCRIBE_URL` repository secret** — the Apps Script `/exec` URL.
  The deploy build fails without it, by design.

Needs a decision from Ioana:

- **Error-state copy** — `Something went wrong. Please try again.` is the only
  user-facing string on the page outside the client-approved set. The brief
  never specified a server-error state.

Later:

- **Analytics** — Cloudflare Web Analytics (free, cookieless, one script tag) or
  [Umami](https://umami.is) if we need custom events for signup conversions.
- **Newsletter signup** — form posting to a Google Apps Script web app backed by
  a Google Sheet. The script URL is public and Apps Script exposes no request
  headers, so it can't be locked to our domain; needs a honeypot field and
  probably Cloudflare Turnstile.
