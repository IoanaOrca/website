# Handoff: Ioana Orca — Pre-launch "Coming Soon" page

## Overview

A single-screen pre-launch landing page for **Ioana Orca**, a transformational coach working
with women in periods of life transition. The page introduces the positioning, qualifies the
visitor ("this might be you"), explains the coaching approach, and captures emails ahead of the
full site launch. It is one continuous vertical scroll — no navigation, no routing.

Primary conversion: **email signup** ("Join the list"). Secondary: **Instagram follow**
(`@ioanaorca`).

## About the Design Files

The files in `design/` are **design references created in HTML** — prototypes that show the
intended look, copy, and behavior. They are **not production code to copy directly**.

The task is to **recreate these designs in the target codebase's existing environment**
(React, Next.js, Vue, Astro, SwiftUI, plain HTML/CSS — whatever the project uses), following its
established component patterns, styling approach, and libraries. If no codebase exists yet, pick
the most appropriate framework for a marketing landing page (a static-site generator or
Next.js/Astro is a sensible default) and implement the design there.

`design/*.dc.html` files use a small in-house runtime (`support.js`) for live-preview authoring.
**Ignore that runtime.** What matters is the markup structure, the inline style values, and the
copy. Two runtime constructs you will encounter:

- `<sc-if value="{{ showPersonal }}">…</sc-if>` — a conditional section. Implement as a boolean
  prop/flag, or hardcode it as visible.
- `<image-slot id="…" placeholder="…">` — an image placeholder. Replace with a real `<img>`
  (or framework image component) filling its container, `object-fit: cover`.
- `{{ launchLabel }}` — an interpolated string; see **State / Configuration**.

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, and copy. Recreate the UI
pixel-perfectly using the codebase's existing libraries and patterns. All hex values, font sizes,
and spacing values in this document are final and taken from the design file. The copy is
client-approved — do not paraphrase it.

Two supporting references are included for context, not for implementation:
`design/Brand Board.dc.html` (palette, ramps, type scale, accessibility audit) and
`design/Website Mockups.dc.html` (the full five-page site this page precedes).

---

## Screens / Views

One screen, eight stacked sections. Page container:

- `max-width: 1440px`, `margin: 0 auto`
- `background: #FAF7F1`, `color: #3A3A33`
- Base font: `'Work Sans', sans-serif`
- **Standard horizontal gutter: `64px`** on every section (used throughout; treat as the page's
  outer padding token).

### 1. Header

- Layout: flex row, `align-items: flex-end`, `justify-content: space-between`
- Padding: `34px 64px 26px`; `border-bottom: 1px solid #E3DCCF`
- **Left block** — flex column, `gap: 6px`
  - Name: `Ioana Orca` — Instrument Serif, `28px`, `letter-spacing: 0.01em`, `#3A3A33`
  - Tagline: `Coaching for your next chapter.` — Instrument Serif **italic**, `19px`, `#7A5638`
- **Right** — launch label: `Launching autumn 2026` — Work Sans, `11px`,
  `letter-spacing: 0.22em`, `text-transform: uppercase`, `#6E6C5E`

### 2. Hero

- Layout: CSS grid, `grid-template-columns: 1.02fr 0.98fr`, `gap: 72px`,
  `align-items: center`, padding `96px 64px 104px`
- **Left column**
  - Headline line 1: `You know something needs to change.` — Instrument Serif, `62px`,
    `line-height: 1.06`, `letter-spacing: -0.01em`, `#3A3A33`, `text-wrap: pretty`
  - Headline line 2: `You just don't know what to do next.` — Instrument Serif **italic**,
    `62px`, `line-height: 1.06`, `#7A5638`, `margin-top: 6px`
  - Rule: `88px × 2px`, `background: #E3B08C`, `margin: 44px 0`
  - Body: `I help women understand what's keeping them stuck, get clear on what they actually
want, and make decisions they feel confident about.` — Work Sans, `19px`,
    `line-height: 1.65`, `#4A4A42`, `max-width: 520px`
- **Right column** — portrait image, `aspect-ratio: 4/5`, fills container, `object-fit: cover`.
  Content direction: warm light, plain background.

### 3. "This might be you"

- Section background `#F0E9DC`, `border-top` and `border-bottom: 1px solid #E3DCCF`,
  padding `96px 64px`
- Layout: grid `0.5fr 1.5fr`, `gap: 64px`, `align-items: start`
- **Left** — eyebrow `This might be you` — `11px`, `letter-spacing: 0.22em`, uppercase,
  `#4A4A42`, `padding-top: 12px`
- **Right** (`max-width: 760px`)
  - Five lines, flex column `gap: 14px`, Work Sans `26px`, `line-height: 1.4`, `#3A3A33`:
    1. `Maybe you're thinking about leaving your job.`
    2. `Starting something of your own.`
    3. `Ending or changing a relationship.`
    4. `Finally showing your ideas to the world.`
    5. `Or simply admitting that the life that used to work for you… doesn't anymore.`
       (note the real ellipsis character)
  - Closing statement, `margin-top: 52px`, Instrument Serif `34px`, `line-height: 1.3`:
    `You're not necessarily lost.` in roman `#3A3A33`, followed inline by
    `You might just be in the middle of becoming someone who wants something different.` in
    **italic** `#7A5638`

### 4. "What you can expect"

- Padding `104px 64px`
- Eyebrow `What you can expect` — `11px`, `letter-spacing: 0.22em`, uppercase, `#6E6C5E`,
  `margin-bottom: 48px`
- **Hairline grid technique:** a 3-column grid with `gap: 2px`, `background: #E3DCCF`, and
  `border: 1px solid #E3DCCF`; each cell has `background: #FAF7F1`. The gaps read as 2px
  dividers. (Do not implement as per-cell borders — it produces doubled lines.)
- Each cell: padding `44px 40px`, flex column, `gap: 14px`
  - Numeral — Instrument Serif `22px`, `#7A5638` (`01`, `02`, `03`)
  - Title — Instrument Serif `30px`, `line-height: 1.2`, `#3A3A33`
  - Body — Work Sans `16px`, `line-height: 1.65`, `#4A4A42`

| #   | Title                  | Body                                                                    |
| --- | ---------------------- | ----------------------------------------------------------------------- |
| 01  | `Understand yourself.` | `See the patterns, beliefs and perceptions influencing your decisions.` |
| 02  | `Get clear.`           | `Separate what you actually want from what you think you should want.`  |
| 03  | `Move forward.`        | `Make a conscious decision and take the next step.`                     |

### 5. Method / credibility card

- Padding `0 64px 104px`
- Card: `background: #F2D9C4`, `border-radius: 3px`, padding `64px`,
  grid `0.62fr 1.38fr`, `gap: 56px`, `align-items: start`
- **Left** — `1:1 Coaching` / `Demartini Method` on two lines (`<br>`), Work Sans `13px`,
  `letter-spacing: 0.16em`, uppercase, `#4A4A42`, `line-height: 1.7`
- **Right** (`max-width: 640px`)
  - Body: `My work combines coaching with the Demartini Method to help you explore the
perceptions, emotional patterns and beliefs that can keep you stuck.` — Work Sans `21px`,
    `line-height: 1.6`, `#3A3A33`
  - Pull line, `margin-top: 32px`: `No endless analysing. No telling you what you should do. We
work towards understanding — and then making a choice.` — Instrument Serif **italic** `27px`,
    `line-height: 1.35`, `#7A5638` (em dash, not hyphen)

**Brand note:** the method is deliberately _not_ the headline. Keep it as a supporting mid-page
card — do not promote it to a hero or section heading.

### 6. Personal note (conditional — `showPersonal`)

- `border-top: 1px solid #E3DCCF`, padding `104px 64px`
- Grid `0.8fr 1.2fr`, `gap: 72px`, `align-items: center`
- **Left** — square image, `aspect-ratio: 1/1`, `object-fit: cover`. Direction: softer, candid.
- **Right**
  - Heading `Hi, I'm Ioana.` — Instrument Serif `44px`, `line-height: 1.1`,
    `margin-bottom: 32px`
  - Flex column, `gap: 24px`, `max-width: 560px`:
    - `I know what it feels like to realise that the life you built isn't necessarily the life
you want next.` — Work Sans `18px`, `line-height: 1.75`, `#4A4A42`
    - `I've changed countries, careers, relationships, plans and directions. And I've learned
that understanding yourself isn't about finding what's wrong with you.` — same style
    - `It's about understanding yourself well enough to make different choices.` — Instrument
      Serif **italic** `27px`, `line-height: 1.4`, `#3A3A33`

### 7. Launch / CTA (dark section)

- `background: #3A3A33`, padding `104px 64px`
- Grid `1.1fr 0.9fr`, `gap: 80px`, `align-items: start`
- **Left column**
  - Eyebrow `Something new is coming` — `11px`, `letter-spacing: 0.22em`, uppercase,
    `#E3B08C`, `margin-bottom: 28px`
  - Heading: `I'm building a space for women who are ready to understand themselves better, make
clearer decisions and create their next chapter.` — Instrument Serif `48px`,
    `line-height: 1.1`, `#FAF7F1`
  - Sub: `The website is launching soon.` — Work Sans `19px`, `line-height: 1.65`,
    `rgba(250,247,241,0.82)`, `margin-top: 32px`
- **Right column**
  - **Signup card** (conditional — `showEmailForm`): `background: #FAF7F1`,
    `border-radius: 3px`, padding `48px 44px`, flex column `gap: 18px`
    - `Want to know when it's live?` — Instrument Serif `32px`, `line-height: 1.2`
    - `I'll send one message when the website opens — nothing else.` — Work Sans `16px`,
      `line-height: 1.6`, `#4A4A42`
    - Field label `Email` — `11px`, `letter-spacing: 0.16em`, uppercase, `#6E6C5E`,
      `margin-top: 14px`
    - Input — `background: #FAF7F1`, `border: 1px solid #E3DCCF`, `border-radius: 2px`,
      padding `15px 16px`, `font-size: 15px`; placeholder `you@email.com` in `#6E6C5E`
    - Button `Join the list` — `background: #5F6D5B`, `color: #FAF7F1`, `font-weight: 600`,
      `font-size: 14px`, `letter-spacing: 0.14em`, uppercase, padding `17px`,
      `border-radius: 2px`, full width, centered text, `margin-top: 8px`
  - Below the card, `margin-top: 36px`, flex column `gap: 10px`
    - `In the meantime, follow along:` — `16px`, `rgba(250,247,241,0.82)`
    - `@ioanaorca` — Instrument Serif `34px`, `#E3B08C`; link to
      `https://instagram.com/ioanaorca`

### 8. Footer

- Padding `44px 64px`, flex row, `space-between`, `align-items: center`, `gap: 32px`
- Left: `Ioana Orca` — `13px`, `letter-spacing: 0.22em`, uppercase, `#4A4A42`
- Right: `Sessions online, in English and Romanian.` — `13px`, `#6E6C5E`

---

## Interactions & Behavior

The prototype is static; these are the intended production behaviors.

- **Email form** — the only interactive element.
  - Validation: required, standard email format. Validate on submit (and on blur after first
    submit attempt), not on every keystroke.
  - Error: message below the input in `#7A5638` at `14px`; input border becomes `#7A5638`.
    Copy suggestion: `That doesn't look like an email address.`
  - Submitting: disable the button, label → `Sending…`, `opacity: 0.7`, `cursor: default`.
  - Success: replace the form body (keep the card box) with the heading
    `You're on the list.` (Instrument Serif `32px`) and
    `I'll be in touch when the website opens.` (`16px`, `#4A4A42`). Do not redirect.
  - Duplicate email: treat as success — do not disclose list membership.
  - Backend is unbuilt. Wire to whatever the project uses (Mailchimp / ConvertKit / Buttondown /
    a serverless route). Store email + timestamp + source `coming-soon`.
- **Links** — default `a` color `#7A5638`, hover `#4E5C4A`,
  `text-decoration-thickness: 1px`, `text-underline-offset: 3px`. Set these globally; the brand
  requires links never fall back to browser blue.
- **Focus** — `:focus-visible { outline: 2px solid #4E5C4A; outline-offset: 3px; }`. Keep visible
  focus rings; do not remove outlines.
- **Button hover** — darken eucalyptus to `#4E5C4A`, `transition: background 160ms ease`.
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables all animation and
  transition. Honour it if you add scroll or fade effects.
- **Animation** — none in the design. If you add entrance animations, keep them subtle
  (fade + ≤12px rise, ~400ms, ease-out) and respect reduced motion.
- **Responsive** — the prototype is desktop-only at `1440px`. Recommended adaptation:
  - Collapse all multi-column grids to a single column below ~900px; image after text in the
    hero, before text in the personal section.
  - The 3-up "What you can expect" grid becomes one column; the 2px hairline technique still
    works.
  - Reduce gutter `64px → 24px` and section padding `~104px → 64px` on mobile.
  - Fluid type for the two large headings, e.g. `clamp(38px, 8vw, 62px)` for the hero and
    `clamp(32px, 6vw, 48px)` for the launch heading. Never below the stated minimums for body
    copy (`16px`).
  - `text-wrap: pretty` is used on all long headings — keep it.

## State Management

Trivial; no global store needed.

- `email: string` — controlled input
- `status: 'idle' | 'invalid' | 'submitting' | 'success' | 'error'` — drives the form states above
- `errorMessage: string | null`

### Configuration (authoring flags, not runtime state)

| Name            | Type    | Default                 | Effect                                                                         |
| --------------- | ------- | ----------------------- | ------------------------------------------------------------------------------ |
| `launchLabel`   | string  | `Launching autumn 2026` | Header right-hand label                                                        |
| `showEmailForm` | boolean | `true`                  | Renders the signup card; when false, the Instagram follow becomes the only CTA |
| `showPersonal`  | boolean | `true`                  | Renders section 6                                                              |

Expose as props or config constants — no UI toggle needed.

## Design Tokens

### Colors

| Token             | Hex                      | Use                                                 |
| ----------------- | ------------------------ | --------------------------------------------------- |
| Ivory / paper     | `#FAF7F1`                | Page background, text on dark, signup card          |
| Sand              | `#F0E9DC`                | "This might be you" section fill                    |
| Peach tint        | `#F2D9C4`                | Method card fill                                    |
| Peach             | `#E3B08C`                | Accent rule, numerals on dark, `@ioanaorca` on dark |
| Brown (peach-700) | `#7A5638`                | Italic accent type, links, small numerals           |
| Eucalyptus        | `#5F6D5B`                | Primary button only                                 |
| Eucalyptus dark   | `#4E5C4A`                | Button hover, link hover, focus ring                |
| Cacao ink         | `#3A3A33`                | Primary text, dark section background               |
| Ink 80            | `#4A4A42`                | Body copy, text on tinted fills                     |
| Ink 60            | `#6E6C5E`                | Small labels **on ivory ground only**               |
| Hairline          | `#E3DCCF`                | Borders, dividers, input border                     |
| Ivory 82%         | `rgba(250,247,241,0.82)` | Secondary text on ink                               |

**Two rules from the brand's accessibility audit, both load-bearing:**

1. **`#6E6C5E` is only for the plain ivory ground.** On sand or peach fills it fails AA — use
   `#4A4A42` there. (This has already been enforced across the file.)
2. **Eucalyptus `#5F6D5B` is reserved for primary CTAs.** Never use it as a background,
   ambient fill, or decorative accent.

Verified contrast: peach on ink 6.6:1, eucalyptus on ink 5.7:1, `#4A4A42` on sand 7.4:1,
`#7A5638` on ivory 4.95:1. All AA-passing. Preserve these pairings.

### Typography

- **Display / headings:** Instrument Serif (400, roman + italic). Italic is a deliberate
  brand device for the emotional half of a headline — not emphasis, not decoration.
- **UI / body:** Work Sans (400, 500, 600).
- Google Fonts: `https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700&display=swap`
  — self-host if the project already self-hosts fonts.

| Role                  | Font                    | Size    | Line height | Notes                                    |
| --------------------- | ----------------------- | ------- | ----------- | ---------------------------------------- |
| Hero headline         | Instrument Serif        | 62px    | 1.06        | `letter-spacing: -0.01em`                |
| Launch heading        | Instrument Serif        | 48px    | 1.1         | on ink                                   |
| Personal heading      | Instrument Serif        | 44px    | 1.1         |                                          |
| Section closer        | Instrument Serif        | 34px    | 1.3         | mixed roman + italic                     |
| `@ioanaorca`          | Instrument Serif        | 34px    | —           | peach on ink                             |
| Card heading          | Instrument Serif        | 30–32px | 1.2         |                                          |
| Pull quote            | Instrument Serif italic | 27px    | 1.35–1.4    |                                          |
| Name (header)         | Instrument Serif        | 28px    | —           | `letter-spacing: 0.01em`                 |
| Numeral               | Instrument Serif        | 22px    | —           | `#7A5638`                                |
| Tagline               | Instrument Serif italic | 19px    | —           | `#7A5638`                                |
| Qualifier lines       | Work Sans               | 26px    | 1.4         |                                          |
| Method body           | Work Sans               | 21px    | 1.6         |                                          |
| Lead body             | Work Sans               | 19px    | 1.65        |                                          |
| Personal body         | Work Sans               | 18px    | 1.75        |                                          |
| Card body             | Work Sans               | 16px    | 1.6–1.65    |                                          |
| Input                 | Work Sans               | 15px    | —           |                                          |
| Button                | Work Sans 600           | 14px    | —           | `letter-spacing: 0.14em`, uppercase      |
| Footer / method label | Work Sans               | 13px    | 1.7         | `letter-spacing: 0.16–0.22em`, uppercase |
| Eyebrow               | Work Sans               | 11px    | —           | `letter-spacing: 0.22em`, uppercase      |

### Spacing

Section padding `96–104px` vertical, `64px` horizontal. Grid gaps `56 / 64 / 72 / 80px`.
Card padding `44–64px`. Stack gaps `6 / 10 / 14 / 18 / 24 / 32px`. Hairline dividers `2px`.

### Radius, borders, shadows

- Radius: `2px` (inputs, buttons), `3px` (cards, images). Nothing more rounded.
- Borders: `1px solid #E3DCCF` hairlines; `2px` and `3px` peach accent rules.
- **No shadows anywhere.** The brand uses hairlines and fills for separation. Do not add
  elevation.

## Assets

- **Two photographs, both user-supplied and not yet delivered.** In the prototype they are
  drag-and-drop placeholders:
  - Hero portrait — 4:5, warm light, plain background
  - Personal-note photo — 1:1, softer and candid
    Implement as `<img>` filling the container with `object-fit: cover`. Ship with a solid
    `#EFE9DE` placeholder block until the real files arrive. Provide `alt` text (e.g.
    `Ioana Orca, transformational coach`).
- **No icons or illustrations.** Arrows and rules elsewhere in the brand are drawn as inline
  SVG paths, never icon fonts or text glyphs — follow that if you add any.
- **Fonts** — Google Fonts, as above.
- No logo file exists; the wordmark is live text in Instrument Serif.

## Files

In `design/`:

| File                          | What it is                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Coming Soon.dc.html`         | **The design to implement.**                                                                                                                                        |
| `Brand Board.dc.html`         | Reference: palette, 10-step ramps, type scale, contrast audit.                                                                                                      |
| `Website Mockups.dc.html`     | Reference: the full five-page site (Home, About, Working together, Words from clients, Contact) this page precedes. Useful for matching patterns you'll need later. |
| `image-slot.js`, `support.js` | Prototype-runtime only — **do not port.**                                                                                                                           |

Open any `.dc.html` directly in a browser to view it.

## Copy is final

All wording in this document is client-approved and brand-checked. Do not rewrite, shorten, or
"improve" it — including the punctuation choices (real ellipsis `…`, em dashes `—`, and the
lowercase-after-colon style). Two phrases carry the positioning and must survive verbatim:

- `You know something needs to change. You just don't know what to do next.`
- `Coaching for your next chapter.`

Avoid adding anything in the register the brand explicitly rejects — no "transform your life",
no "step into your power", no emoji, no gradient hero backgrounds.
