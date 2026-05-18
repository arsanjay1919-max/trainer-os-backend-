const {
  getClients, getAllCheckInsToday, getClientAnalytics, logAlert,
} = require("./db");
const { sendWhatsApp, sendBulkWhatsApp } = require("./whatsapp");
const {
  buildReminderMessage, buildWeeklyClientReport, buildMonthlyClientReport,
  buildTrainerDailySummary, buildWeeklyTrainerReport, buildMonthlyTrainerReport,
  buildRiskAlert,
} = require("./reports");

const TRAINER_PHONE = () => process.env.TRAINER_PHONE;

// ─── DAILY: Send reminders to all active clients (8:00 AM IST) ───────────────
async function sendDailyReminders() {
  const clients = await getClients();
  const active  = clients.filter((c) => c.active);
  if (!active.length) return { sent: 0, failed: 0 };

  const messages = active.map((c) => ({ to: c.phone, body: buildReminderMessage(c.name) }));
  const results  = await sendBulkWhatsApp(messages);
  const sent     = results.filter((r) => r.success).length;
  console.log(`[Reminders] ${sent}/${active.length} sent`);
  return { sent, failed: active.length - sent };
}

// ─── DAILY: Send trainer summary (9:00 PM IST) ───────────────────────────────
async function sendDailySummaryToTrainer() {
  const [clients, checkIns] = await Promise.all([getClients(), getAllCheckInsToday()]);
  const active  = clients.filter((c) => c.active);
  const summary = buildTrainerDailySummary(active, checkIns);
  const result  = await sendWhatsApp(TRAINER_PHONE(), summary);
  console.log("[Daily Summary] Sent to trainer:", result.success);
  return result;
}

// ─── DAILY: Risk alerts — check for inactive clients (runs after summary) ────
async function checkAndSendRiskAlerts() {
  const clients = await getClients();
  const active  = clients.filter((c) => c.active);
  const alerts  = [];

  for (const client of active) {
    const analytics = await getClientAnalytics(client.phone);
    if (analytics.riskLevel === "HIGH") {
      const msg = buildRiskAlert(client, analytics);
      alerts.push({ to: TRAINER_PHONE(), body: msg });
      await logAlert(client.phone, client.name, "HIGH_RISK", `Last seen: ${analytics.lastCheckinDaysAgo}d ago, consistency: ${analytics.monthly.consistency}%`);
    }
  }

  if (alerts.length) {
    await sendBulkWhatsApp(alerts);
    console.log(`[Risk Alerts] Sent ${alerts.length} alerts to trainer`);
  } else {
    console.log("[Risk Alerts] No high-risk clients today");
  }
  return { alertsSent: alerts.length };
}

// ─── WEEKLY: Client motivation reports (Sunday 8:00 PM IST) ──────────────────
async function sendWeeklyClientReports() {
  const clients = await getClients();
  const active  = clients.filter((c) => c.active);
  let sent = 0;

  for (const client of active) {
    const analytics = await getClientAnalytics(client.phone);
    const report    = buildWeeklyClientReport(client, analytics);
    const result    = await sendWhatsApp(client.phone, report);
    if (result.success) sent++;
    await sleep(800);
  }
  console.log(`[Weekly Reports] Sent ${sent}/${active.length} client reports`);
  return { sent, total: active.length };
}

// ─── WEEKLY: Trainer analytics report (Sunday 9:00 PM IST) ───────────────────
async function sendWeeklyTrainerReport() {
  const clients = await getClients();
  const active  = clients.filter((c) => c.active);

  const clientAnalytics = await Promise.all(
    active.map(async (c) => ({ ...(await getClientAnalytics(c.phone)) }))
  );

  const report = buildWeeklyTrainerReport(clientAnalytics);
  const result = await sendWhatsApp(TRAINER_PHONE(), report);
  console.log("[Weekly Trainer Report] Sent:", result.success);
  return result;
}

// ─── MONTHLY: Client transformation reports (1st of month, 8:00 PM IST) ─────
async function sendMonthlyClientReports() {
  const clients = await getClients();
  const active  = clients.filter((c) => c.active);
  let sent = 0;

  for (const client of active) {
    const analytics = await getClientAnalytics(client.phone);
    const report    = buildMonthlyClientReport(client, analytics);
    const result    = await sendWhatsApp(client.phone, report);
    if (result.success) sent++;
    await sleep(1000);
  }
  console.log(`[Monthly Reports] ${sent}/${active.length} sent`);
  return { sent, total: active.length };
}

// ─── MONTHLY: Trainer overview report ─────────────────────────────────────────
async function sendMonthlyTrainerReport() {
  const clients = await getClients();
  const active  = clients.filter((c) => c.active);

  const clientAnalytics = await Promise.all(
    active.map(async (c) => ({ ...(await getClientAnalytics(c.phone)) }))
  );

  const report = buildMonthlyTrainerReport(clientAnalytics);
  const result = await sendWhatsApp(TRAINER_PHONE(), report);
  console.log("[Monthly Trainer Report] Sent:", result.success);
  return result;
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

module.exports = {
  sendDailyReminders,
  sendDailySummaryToTrainer,
  checkAndSendRiskAlerts,
  sendWeeklyClientReports,
  sendWeeklyTrainerReport,
  sendMonthlyClientReports,
  sendMonthlyTrainerReport,
};
