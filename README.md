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

- **Analytics** — Cloudflare Web Analytics (free, cookieless, one script tag) or
  [Umami](https://umami.is) if we need custom events for signup conversions.
- **Newsletter signup** — form posting to a Google Apps Script web app backed by
  a Google Sheet. The script URL is public and Apps Script exposes no request
  headers, so it can't be locked to our domain; needs a honeypot field and
  probably Cloudflare Turnstile.
