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

- **Add `test` to the branch ruleset** — ruleset `20887796` on `main` requires
  `lint`, `check`, `format:check` and `build` by name. Until `test` joins them
  it runs on PRs without blocking merge, so a red test sits beside a green
  merge button. Settings → Rules, or `gh api`.
- **Add the `SUBSCRIBE_URL` repository secret** — the Apps Script `/exec` URL.
  The deploy build fails without it, by design.
- **Privacy policy page, and a notice linking to it** — the page collects email
  addresses from an explicitly EU audience (`Sessions online, in English and
Romanian`) with no controller identity, retention statement, or policy link
  anywhere. GDPR Art. 13 wants all of that at the point of collection. Two
  pieces of work: a `/privacy` page, and one line by the signup card or in the
  footer naming the controller and linking it.

  Blocked on three facts only Ioana can supply: whether the controller is her
  personally or a registered business (changes the required identity line), how
  long addresses that never convert are kept, and the contact address for
  rights requests.

  Related, and worth knowing before the Kit migration: the stored `consent`
  string records what the person was _shown_, not that _they_ submitted it. The
  endpoint is unauthenticated and single-opt-in, so anyone can type someone
  else's address into it. Double opt-in is what actually produces evidence of
  consent — Kit does it natively, but addresses imported from the Sheet will
  not carry that provenance.

Needs a decision from Ioana:

- **Error-state copy** — `Something went wrong. Please try again.` is the only
  user-facing string on the page outside the client-approved set. The brief
  never specified a server-error state.

Later:

- **Analytics** — Cloudflare Web Analytics (free, cookieless, one script tag) or
  [Umami](https://umami.is) if we need custom events for signup conversions.
- **Migrate to Kit** — signups currently land in a Sheet. Moving to a real
  email tool means rewriting the body of `src/lib/subscribe.ts` and changing
  `PUBLIC_SUBSCRIBE_URL`; nothing else.
- **Social preview** — `src/layouts/BaseLayout.astro` has no `og:*` or
  `twitter:card` tags, so the page currently pastes as a bare URL with no
  image, title or description. Its only distribution channel is an Instagram
  bio link, so that costs clicks on the one thing the page exists to do.
  Roughly 15 lines: `site` is already set to `https://ioanaorca.com` so
  absolute URLs resolve, and `src/assets/images/ioana-hero-studio.jpg` is a
  usable source for a generated OG image.
