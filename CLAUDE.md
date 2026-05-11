# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test suite exists. Linting is configured but has no npm script — run directly:

```bash
npx eslint src/js/**/*.js
npx stylelint src/css/**/*.scss
```

Node version is pinned to v18 (`.nvmrc`). Use `nvm use` before installing.

## Architecture

Static single-page portfolio site. No framework — vanilla ES6 modules + SCSS compiled by Vite. Deployed to GitHub Pages via GitHub Actions on push to `master`.

**Entry points:**
- `index.html` — HTML shell; references `src/js/index.js` and `src/css/index.scss`
- `src/js/index.js` — initializes `nav()` (smooth scrolling) and `hamburger()` (mobile menu) on `DOMContentLoaded`
- `src/css/index.scss` — imports vendor styles then all component partials in order

**JS modules** (`src/js/scripts/`):
- `nav.js` — smooth scroll + active anchor link highlighting
- `hamburger.js` — mobile menu toggle; reads the `--bp-tablet` CSS custom property to know when to activate (breakpoint synced from CSS, not hardcoded in JS)

**SCSS structure** (`src/css/`):
- Configuration partials: `_colors.scss`, `_breakpoints.scss`, `_texts.scss`, `_variables.scss`, `_susy.scss`
- `_mixin_font.scss` — breakpoint-aware typography mixin used across component partials
- `content/` — one partial per page section (`_hero`, `_navigation`, `_aboutMe`, `_quotes`, `_work`, `_resume`, `_contact`, `_footer`)
- `vendor/` — third-party CSS (normalize, fonts, Susy grid)

**Breakpoints** (defined once in `_breakpoints.scss`, exposed to JS via CSS custom property):
- tablet: 600px, desktop: 992px, large: 1200px

**Static assets** live in `public/` (images, SVG logos, PDF resume, video, favicons) and are served as-is by Vite.

## Linting config

- **ESLint** — Airbnb style guide; config likely in `package.json` or a root `.eslintrc` file
- **Stylelint** (`.stylelintrc.js`) — extends `stylelint-config-idiomatic-order`, uses `stylelint-scss` plugin, enforces 4-space indentation and space-after-colon in declarations
