# Signup endpoint

`Code.gs` backs the coming-soon page's email form. It lives here so it is
version-controlled rather than existing only inside Google's script editor.
Edits here are **not** deployed automatically — paste them in and redeploy.

## First deployment

1. Create a Google Sheet. Row 1 headers, in this order: `email`, `firstName`,
   `timestamp`, `source`, `consent`. `email` must stay in column A — the
   duplicate check reads that column by name. `firstName` is optional on the
   form, so blank cells there are expected.
2. Extensions → Apps Script. Paste `Code.gs` over the default file.
3. Deploy → New deployment → Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the `/exec` URL.
5. Put it in `.env` as `PUBLIC_SUBSCRIBE_URL`, and in the repository **variable**
   `SUBSCRIBE_URL` (Settings → Secrets and variables → Actions → _Variables_).
   A variable rather than a secret on purpose: the URL is inlined into the
   public JS bundle anyway, so masking buys nothing, and a variable can be read
   back and checked. A mistyped secret still passes `url: true`, builds, and
   deploys — the form just fails silently in production.

   It must be a **repository** variable, not an environment one. `deploy.yml`
   uses it in the `build` job, and `environment: github-pages` is on the
   `deploy` job, so an environment-scoped value would never reach it.

## Redeploying after an edit

Deploy → Manage deployments → edit the existing deployment → Version: New
version. Creating a _new_ deployment instead changes the URL and silently
breaks the live form.

## Notes

- The URL is inlined into the client bundle. It is not a secret; it is an env
  var so local development can point at a throwaway sheet.
- Duplicate addresses return success without a second row. Do not "fix" this —
  disclosing list membership is the bug.
- Storing `consent` records the exact wording shown to the person at the point
  of submission. That's necessary but not sufficient for GDPR purposes on its
  own — the endpoint is unauthenticated and single-opt-in, so it cannot prove
  the address belongs to the person who submitted it. Bump the version string
  in `src/lib/subscribe.ts` if the wording on the signup card changes.
