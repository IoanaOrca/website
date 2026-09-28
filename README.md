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
`CLAUDE.md`. Several things on it are load-bearing in ways the code doesn't show.

- **Finish the Impressum** — `src/pages/_imprint.astro` is drafted but excluded
  from the build (underscore prefix) until the business is registered and § 5 DDG
  has a postal address to name.
