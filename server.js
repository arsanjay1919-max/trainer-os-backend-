require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const bodyParser = require("body-parser");
const cron       = require("node-cron");

const {
  sendDailyReminders, sendDailySummaryToTrainer, checkAndSendRiskAlerts,
  sendWeeklyClientReports, sendWeeklyTrainerReport,
  sendMonthlyClientReports, sendMonthlyTrainerReport,
} = require("./scheduler");

const { getClients, addClient, updateClientStatus, getAllCheckInsToday,
        getClientAnalytics, logMeasurement, getMeasurementsForClient } = require("./db");
const { parseReply, buildConfirmationMessage } = require("./reports");
const { sendWhatsApp } = require("./whatsapp");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ─── HEALTH ───────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok", uptime: Math.floor(process.uptime()), version: "3.0.0" }));

// ─── WEBHOOK: Twilio sends WhatsApp replies here ──────────────────────────────
app.post("/webhook/whatsapp", async (req, res) => {
  res.status(200).send("<Response></Response>"); // Always 200 to Twilio immediately
  const { From, Body } = req.body;
  if (!From || !Body) return;
  const phone = From.replace("whatsapp:", "");
  try {
    const clients = await getClients();
    const client  = clients.find((c) => c.phone === phone);
    if (!client) {
      await sendWhatsApp(phone, "Your number isn't registered. Contact your trainer. 🙏");
      return;
    }
    const parsed = parseReply(Body);
    if (!parsed.valid) {
      await sendWhatsApp(phone, `Couldn't understand that.\n${parsed.reason}`);
      return;
    }
    const { logCheckIn } = require("./db");
    await logCheckIn({ clientId: client.id, clientName: client.name, phone, ...parsed });
    const analytics = await getClientAnalytics(phone);
    const confirm   = buildConfirmationMessage(client.name, parsed, analytics.currentStreak);
    await sendWhatsApp(phone, confirm);
  } catch (err) {
    console.error("[Webhook]", err.message);
  }
});

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
app.get("/clients", async (_, res) => {
  try { res.json({ success: true, clients: await getClients() }); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post("/clients", async (req, res) => {
  const { name, phone, goal, weight, height, targetWeight } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, error: "name and phone required" });
  try {
    const client = await addClient({ name, phone: phone.startsWith("+") ? phone : `+${phone}`, goal, weight, height, targetWeight });
    res.json({ success: true, client });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.patch("/clients/:phone/deactivate", async (req, res) => {
  try { await updateClientStatus(decodeURIComponent(req.params.phone), false); res.json({ success: true }); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.patch("/clients/:phone/activate", async (req, res) => {
  try { await updateClientStatus(decodeURIComponent(req.params.phone), true); res.json({ success: true }); }
  catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── MEASUREMENTS ─────────────────────────────────────────────────────────────
app.post("/clients/:phone/measurements", async (req, res) => {
  try {
    await logMeasurement(decodeURIComponent(req.params.phone), req.body);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get("/clients/:phone/measurements", async (req, res) => {
  try {
    const data = await getMeasurementsForClient(decodeURIComponent(req.params.phone));
    res.json({ success: true, measurements: data });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
app.get("/analytics/dashboard", async (_, res) => {
  try {
    const clients = await getClients();
    const active  = clients.filter((c) => c.active);
    const today   = await getAllCheckInsToday();

    const clientStats = await Promise.all(active.map(async (c) => {
      const analytics = await getClientAnalytics(c.phone);
      return { ...c, analytics, today: today.find((t) => t.phone === c.phone) || null, hasCheckedInToday: !!today.find((t) => t.phone === c.phone) };
    }));

    const avgCons    = clientStats.length ? Math.round(clientStats.reduce((a, c) => a + c.analytics.monthly.consistency, 0) / clientStats.length) : 0;
    const bestStreak = clientStats.length ? Math.max(...clientStats.map((c) => c.analytics.currentStreak)) : 0;
    const highRisk   = clientStats.filter((c) => c.analytics.riskLevel === "HIGH").length;

    res.json({
      success: true,
      overview: {
        totalClients:    active.length,
        checkedInToday:  today.length,
        bothDoneToday:   today.filter((c) => c.workoutDone && c.dietDone).length,
        avgMonthlyConsistency: avgCons,
        bestStreak,
        highRiskCount:   highRisk,
        date: new Date().toISOString(),
      },
      clients: clientStats,
    });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get("/analytics/client/:phone", async (req, res) => {
  try {
    const analytics = await getClientAnalytics(decodeURIComponent(req.params.phone));
    res.json({ success: true, analytics });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get("/analytics/today", async (_, res) => {
  try {
    const [clients, checkIns] = await Promise.all([getClients(), getAllCheckInsToday()]);
    const active = clients.filter((c) => c.active);
    res.json({
      success: true,
      date: new Date().toISOString().split("T")[0],
      total: active.length, responded: checkIns.length,
      checkIns,
      notResponded: active.filter((c) => !checkIns.find((ci) => ci.phone === c.phone)).map((c) => c.name),
    });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── MANUAL TRIGGERS (for testing any automation right now) ──────────────────
const triggers = {
  reminders:         sendDailyReminders,
  summary:           sendDailySummaryToTrainer,
  "risk-alerts":     checkAndSendRiskAlerts,
  "weekly-clients":  sendWeeklyClientReports,
  "weekly-trainer":  sendWeeklyTrainerReport,
  "monthly-clients": sendMonthlyClientReports,
  "monthly-trainer": sendMonthlyTrainerReport,
};
Object.entries(triggers).forEach(([name, fn]) => {
  app.post(`/trigger/${name}`, async (_, res) => {
    try { res.json({ success: true, result: await fn() }); }
    catch (e) { res.status(500).json({ success: false, error: e.message }); }
  });
});

// ─── CRON SCHEDULE ────────────────────────────────────────────────────────────
// Times in UTC (IST = UTC + 5:30)
cron.schedule("30 2  * * *",   sendDailyReminders);          // 8:00 AM IST daily
cron.schedule("30 14 * * *",   checkAndSendRiskAlerts);      // 8:00 PM IST daily
cron.schedule("30 15 * * *",   sendDailySummaryToTrainer);   // 9:00 PM IST daily
cron.schedule("30 14 * * 0",   sendWeeklyClientReports);     // 8:00 PM IST Sunday
cron.schedule("30 15 * * 0",   sendWeeklyTrainerReport);     // 9:00 PM IST Sunday
cron.schedule("30 14 1 * *",   sendMonthlyClientReports);    // 8:00 PM IST 1st of month
cron.schedule("30 15 1 * *",   sendMonthlyTrainerReport);    // 9:00 PM IST 1st of month

app.listen(PORT, () => {
  console.log(`\n🚀 Trainer OS v3 running on port ${PORT}`);
  console.log(`   Health:    http://localhost:${PORT}/health`);
  console.log(`   Dashboard: http://localhost:${PORT}/analytics/dashboard\n`);
  console.log(`   Cron: Daily 8AM reminders | 9PM summary | Sunday weekly | 1st monthly\n`);
});

module.exports = app;
