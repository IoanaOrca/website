/**
 * Receives signups from the coming-soon page and appends them to the bound
 * sheet. Deployed as a web app: "Execute as: me", "Access: anyone".
 *
 * The client posts Content-Type: text/plain so the request stays a CORS
 * simple request — Apps Script web apps cannot answer a preflight.
 */

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, reason: 'invalid' });
  }

  if (!data || typeof data !== 'object')
    return json({ ok: false, reason: 'invalid' });

  // Honeypot. The browser short-circuits before sending, so a filled value
  // means something posted here directly without running our JavaScript.
  if (data.website) return json({ ok: true });

  var email = String(data.email || '')
    .trim()
    .toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return json({ ok: false, reason: 'invalid' });

  // The dedupe is a read-then-write, so concurrent submits must serialise.
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json({ ok: false, reason: 'server' });
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var seen = sheet.getRange('A:A').getValues().flat();
    if (seen.indexOf(email) === -1) {
      sheet.appendRow([
        email,
        String(data.firstName || '').trim(),
        // Server-side: client clocks are wrong often enough to poison the
        // consent record.
        new Date().toISOString(),
        String(data.source || ''),
        String(data.consent || ''),
      ]);
    }
  } finally {
    lock.releaseLock();
  }

  // A duplicate returns success. Never disclose list membership.
  return json({ ok: true });
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
