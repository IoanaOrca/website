# Signup endpoint

`Code.gs` backs the coming-soon page's email form. It lives here so it is
version-controlled rather than existing only inside Google's script editor.
Edits here are **not** deployed automatically — paste them in and redeploy.

## First deployment

1. Create a Google Sheet. Row 1 headers: `email`, `timestamp`, `source`,
   `consent`.
2. Extensions → Apps Script. Paste `Code.gs` over the default file.
3. Deploy → New deployment → Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the `/exec` URL.
5. Put it in `.env` as `PUBLIC_SUBSCRIBE_URL`, and in the repository secret
   `SUBSCRIBE_URL` (Settings → Secrets and variables → Actions).

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
