const twilio = require("twilio");
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM   = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

async function sendWhatsApp(to, body) {
  const toFmt = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  try {
    const msg = await client.messages.create({ from: FROM, to: toFmt, body });
    console.log(`[WA] ✓ ${to} — ${msg.sid}`);
    return { success: true, sid: msg.sid };
  } catch (err) {
    console.error(`[WA] ✗ ${to} — ${err.message}`);
    return { success: false, error: err.message };
  }
}

async function sendBulkWhatsApp(messages) {
  const results = [];
  for (const { to, body } of messages) {
    results.push({ to, ...(await sendWhatsApp(to, body)) });
    await new Promise((r) => setTimeout(r, 500));
  }
  return results;
}

module.exports = { sendWhatsApp, sendBulkWhatsApp };
