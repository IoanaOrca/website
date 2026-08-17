/**
 * Receives signups from the coming-soon page, appends them to the bound sheet
 * and emails the script owner. Deployed as a web app: "Execute as: me",
 * "Access: anyone".
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

  // Honeypot. The browser short-circuits first, so a filled value means
  // something posted here without running our JavaScript.
  if (data.website) return json({ ok: true });

  var email = String(data.email || '')
    .trim()
    .toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return json({ ok: false, reason: 'invalid' });

  var firstName = String(data.firstName || '').trim();

  // The dedupe is a read-then-write, so concurrent submits must serialise.
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json({ ok: false, reason: 'server' });
  var added = false;
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var seen = sheet.getRange('A:A').getValues().flat();
    if (seen.indexOf(email) === -1) {
      sheet.appendRow([
        email,
        firstName,
        // Server-side: client clocks are wrong often enough to poison the
        // consent record.
        new Date().toISOString(),
        String(data.source || ''),
        String(data.consent || ''),
      ]);
      added = true;
    }
  } finally {
    lock.releaseLock();
  }

  // Only for rows actually written: a duplicate appends nothing, and a tripped
  // honeypot returned long before this. Sent after releasing the lock so mail
  // latency does not serialise concurrent signups.
  if (added) notify(email, firstName);

  // A duplicate returns success. Never disclose list membership.
  return json({ ok: true });
}

function notify(email, firstName) {
  // A notification failure must never reach the subscriber. MailApp throws once
  // the daily quota is spent, and an unhandled throw here returns an HTML error
  // page — the client cannot parse that, so someone whose signup succeeded
  // would be told it failed.
  try {
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      subject: 'New signup: ' + email,
      body: [
        'Email: ' + email,
        'First name: ' + (firstName || '(not given)'),
        'Received: ' + new Date().toISOString(),
      ].join('\n'),
    });
  } catch (err) {
    console.error('Signup notification failed: ' + err);
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
