# Privacy policy: what was reworked, and what is still open

Reworked 17 August 2026. This file supersedes the original handoff brief.

## The document

**`src/pages/privacy.astro` is the privacy policy.** There is no other copy.
The earlier `docs/privacy-policy-en.html` was a stale snapshot that had already
drifted behind the live page, and it is gone. Do not reintroduce a second file
to edit "first" — that is how the two diverged.

**English only.** There is no German version and no `/datenschutz` route.
Decided deliberately: the audience is mostly international online clients. The
page carries no prevailing-language note, because there is no German version for
German to prevail over. If a DE version is ever added, the note comes back with
it.

- **Controller:** Ioana Iordache, trading as Ioana Orca — Munich, sole trader,
  no employees
- **Hosting:** GitHub Pages (GitHub, Inc.), US
- **Signup store:** Google Sheets via an Apps Script endpoint, US
- **Analytics:** GoatCounter (hosted), EU — see below
- **Cookies:** none. No consent banner, no CMP.

## Done in this pass

- **Removed the log-retention claim.** The policy used to promise log files were
  erased or anonymised after 30 days. That was false: the logs are GitHub's, and
  the controller cannot read, configure or delete them. The GitHub Pages bullet
  now says exactly that, and that retention is GitHub's to determine.
- **Deleted the cookie section** (`m134`) including the consent-management
  sub-module. No cookies are set and there is no CMP, so the section promised a
  withdrawal control that did not exist. The ToC entry went with it, as did the
  cross-reference to it from the web analytics section.
- **Deleted "Promotional communication via email, post, fax or telephone"**
  (`m638`). It duplicated the newsletter section and offered to fax people. The
  `Marketing` and `Sales promotion` purposes went with it, since nothing else
  used them.
- **Trimmed the overview lists** of employee data, employees, whistleblowers and
  whistleblower protection, plus the `Employees` glossary entry.
- **Narrowed "Contact form" to "Contact by email".** There is no contact form,
  only a `mailto:` in the footer.
- **Named BayLDA** (Promenade 18, 91522 Ansbach) as the competent supervisory
  authority in the complaint-rights bullet.
- **Fixed the consent-marker sentence.** It claimed to store "a marker recording
  the wording of the consent shown at the time." No wording is shown anywhere.
  It now describes what is actually stored: a version marker identifying the
  sign-up form as it stood.
- **Added a retention criterion** for the signup list (see below).
- **Dropped the `workspace.google.com` link.** The account is a free consumer
  Gmail account, not Workspace.
- **Removed usage data** from the newsletter data types. Nothing tracks opens or
  clicks, and no sending tool is in use.

## Kept deliberately — do not "fix" these

- **The online shop bullet and payment data stay.** No shop and no invoicing
  today, but invoicing is expected eventually.

- **The Swiss FADP paragraph stays.** Switzerland is not a target market, but
  Swiss clients are not being ruled out.

- **No street address in the controller block.** Name and email only. The full
  postal address belongs in the imprint — see below. Do not add the address here
  instead; that is not what satisfies § 5 DDG.

- **No consent checkbox and no privacy link under the signup form.** Consent
  under Art. 4(11) is a statement _or_ a clear affirmative action; typing an
  address under "Want to know when it's live?" and clicking "Join the list" is
  the action, and the footer carries the privacy link on the same page. Adding a
  checkbox was considered and rejected.

- **No "Active — Re-certification under Review" status for Meta.** True today,
  stale within months. Plain DPF is enough.

## Analytics: GoatCounter — verified 17 August 2026

Wired into `BaseLayout.astro`, so it runs on every page. Facts checked against
GoatCounter's own documentation and by reading `count.js`, not recalled:

- **Operator:** GoatCounter, run by Martin Tournoij, Ireland. A sole operator,
  not a company.
- **Data location:** Hetzner Online GmbH servers in Finland and Germany — inside
  the EU. **No third-country transfer, so no DPF or SCCs question arises.** This
  is the one processor in the stack that needs no transfer basis.
- **No device storage.** `count.js` only ever _reads_ a `skipgc` key from
  `localStorage`; it _writes_ one only if a visitor deliberately loads
  `#toggle-goatcounter` to opt out. Nothing is stored on an ordinary visit, so
  **§ 25(1) TDDDG is not triggered and no consent banner is required.** That is
  the fact the banner-free setup rests on — if GoatCounter ever starts writing to
  the device, the legal position changes and this needs revisiting.
- **Not stored:** IP address, full User-Agent, tracker ID. Session de-duplication
  uses an in-memory IP + User-Agent hash held for up to eight hours, replaced by
  a random string; the mapping never reaches the database.
- **Legal basis:** Art. 6(1)(f) legitimate interest. **Not** consent.

**`count.js` is vendored into `public/`** rather than loaded from `gc.zgo.at`.
That host is a CNAME to `goatcounter.b-cdn.net` — BunnyCDN (Datacamp Limited) —
so loading it from there would hand a visitor's IP to a CDN merely to fetch a
static file, and would mean naming a second processor in the policy. Self-hosting
removes both problems.

To update it:

```
curl -sS https://gc.zgo.at/count.js -o public/count.js
```

Current version is 9213 bytes,
sha256 `792b7abd26c1fb6ae62906833e09a301251e2641816e69e4f95aba518f3fe3f0`.

It is excluded from Prettier (`.prettierignore`), ESLint (`eslint.config.mjs`)
and TypeScript (`tsconfig.json`) — all three, deliberately. Prettier reformatted
it on the first attempt, which silently rewrote 1.1 KB of vendored code and would
have made every future diff against upstream unreadable; `astro check` separately
flagged its deprecated `substr` calls. Do not "tidy" this file.

The `<script>` tag carries `is:inline`. Astro treats a script with attributes as
inline anyway, but saying so explicitly is what keeps `astro check` quiet and
documents that the tag is meant to be emitted untouched.

`count.js` skips `localhost`, private ranges and `file:` on its own, so dev
traffic is not counted and no prod-only guard is needed.

The web analytics section (`m263`) was rewritten to describe this accurately. It
previously claimed profile building, A/B testing, location data, cookies stored
up to two years, IP masking and consent as a legal basis — GoatCounter does none
of those. **Do not restore that generic wording.** `Profiles with user-related
information` went from the purposes list and the glossary with it, since nothing
creates profiles.

## Third-country transfers — verified 17 August 2026

Checked against the official Commerce Department participants list, pulled
directly from the DPF API (the website itself is a JS shell that returns nothing
to a fetch):

```
curl -X POST https://dpfapi.azurewebsites.net/api/downloadFile \
  -H 'Content-Type: application/json' \
  -d '{"FileName":"DataPrivacyFrameworkParticipantsList.xlsx","FileSizeKB":3600,"FileType":"xlsx","Id":0,"Guid":"DataPrivacyFrameworkParticipantsList.xlsx"}' \
  -o dpf.xlsx
```

| Entity               | Listing                                        | Status                                 | Recertification due |
| -------------------- | ---------------------------------------------- | -------------------------------------- | ------------------- |
| GitHub               | its own certification, **not** under Microsoft | Active (EU-U.S., Swiss, UK Ext.)       | 3 Aug 2027          |
| Google LLC           | its own certification                          | Active (EU-U.S., Swiss, UK Ext.)       | 13 Sep 2026         |
| Meta Platforms, Inc. | its own certification                          | Active — re-certification under review | 23 Jul 2027         |

All three DPF claims in the policy hold. **Google's certification expires
13 September 2026** — routine annual recertification, but if it ever lapses the
transfer basis for the signup store has to change to SCCs and the text must say
so. Re-run the check above rather than trusting a provider's own marketing copy.

## Imprint — built, deliberately not published

`src/pages/_imprint.astro` is written but deliberately unroutable. The leading
underscore is Astro's own mechanism for excluding a file from the build — without
it the page ships to `dist/` and is reachable by URL even with nothing linking to
it. It is one line short of compliant and must not go public until that line is
filled in.

**To publish it:** rename to `imprint.astro`, fill in the address, and add the
footer link. All three, or none.

Coaching (Demartini Method) is not a regulated profession in Germany, so the page
needs no chamber, supervisory authority or professional-title block. That holds
only while the copy stays on the coaching side of the line — marketing it as
treating anxiety, depression or trauma brings the Heilpraktikergesetz into play
and the Impressum grows accordingly.

**Blocking: the postal address.** § 5(1) no. 1 DDG requires the full address at
which the business is established, and it must be _ladungsfähig_ — somewhere
legal process can be served. A PO box or packing station does not qualify. Ioana
does not want her home address published, which leaves two routes:

1. A `c/o` business-address service (€10–30/month) that accepts service of
   process. This is the standard answer and solves it permanently.
2. Hold the page until launch. § 5 DDG bites on commercial digital services; the
   current site offers nothing, names no prices and takes no bookings, so the
   obligation is at its weakest. Once the real site offers sessions, an
   addressless Impressum is indefensible.

Route 2 is the current state. The footer link is one
`<a href="/imprint">Imprint</a>` in `src/components/coming-soon/Footer.astro`
beside the privacy link.

Deliberately omitted from the page, each for a reason:

- **No phone number.** ECJ C-298/07 (_deutsche internet versicherung_) holds an
  email address sufficient for rapid electronic contact. A phone number is not
  mandatory.
- **No EU online dispute-resolution link.** Most generators still emit one; the
  ODR platform was **shut down on 20 July 2025**, so that boilerplate now points
  at a dead service.
- **No Handelsregister number** — sole trader, not registered.
- **No § 18(2) MStV "responsible for content"** — that is for
  journalistic-editorial content, not a brochure site.
- **No Steuernummer.** Only a USt-IdNr is ever published; the tax number never
  is.
- **No Haftungsausschluss / liability and copyright disclaimers.** Common in
  German imprints and legally near-worthless — §§ 7–10 DDG govern intermediary
  liability regardless of what a page claims.

## Still open — needs facts only Ioana can supply

- **VAT status.** Unconfirmed. If Ioana is a § 19 UStG Kleinunternehmer there is
  no USt-IdNr and the line stays omitted, which is the current state. If she has
  one, publishing it in the imprint is mandatory. Confirm before launch.
- **Signup list retention.** There is no automatic deletion and none is planned.
  Art. 13(2)(a) accepts criteria in place of a period, so the policy now says the
  data is kept until it is transferred to an email provider, until the launch
  list has served its purpose, or until erasure is requested. That is compliant
  as written, but "never deleted" is a separate question worth answering before
  the list gets large.
- **Invoicing.** When real invoicing starts, the business-services section needs
  reviewing rather than just left as-is.
- **AVV / DPAs** with GitHub and Google. Still not concluded. A _free_ consumer
  Google account has no DPA available at all — Workspace is required. The policy
  names Google Ireland Limited as the service provider, which is correct for the
  consumer terms, but there is no Art. 28 processor contract behind it.
- **Art. 30 record of processing activities.** Internal, not published, still
  missing.
- **GitHub Pages terms of service.** Pages is not permitted as free hosting for a
  site primarily directed at facilitating commercial transactions. A brochure
  site is arguably fine; confirm with GitHub Support.

## Invariants

- **Keep the datenschutz-generator.de attribution link.** It is a condition of
  the free licence.
- **Anchor IDs are semantic slugs** (`#preamble`, `#controller`, `#analytics`, …).
  The generator's `#m716`/`#m2427` names were renamed once the page was ours to
  own; nothing external linked to them. Every ToC entry must resolve to a section
  that exists — currently 17 anchors, 17 links.
- **External links carry `rel="noopener noreferrer"`.** `noopener` is redundant
  in current browsers, which apply it to `target="_blank"` implicitly, but
  `noreferrer` also withholds the referrer — worth having on the one page whose
  subject is not leaking data.
- **Prefer adapting existing Schwenke wording** to writing new legal prose. Where
  a section is deleted, delete it; do not paraphrase it into something shorter.
- **Do not invent facts.** Provider addresses, entity names and DPF status get
  verified, not recalled.
