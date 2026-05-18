require("dotenv").config();
const { google } = require("googleapis");

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const TABS = {
  CLIENTS:      "Clients",
  CHECKINS:     "CheckIns",
  MEASUREMENTS: "Measurements",
  ALERTS:       "Alerts",
};

// ─── SHEETS helper ────────────────────────────────────────────────────────────
async function getSheet(range) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range });
  return res.data.values || [];
}

async function appendSheet(range, values) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
}

async function updateSheet(range, values) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
// Cols: ID | Name | Phone | Goal | Active | JoinDate | Weight | Height | TargetWeight
async function getClients() {
  const rows = await getSheet(`${TABS.CLIENTS}!A2:I200`);
  return rows.map((r) => ({
    id:            r[0] || "",
    name:          r[1] || "",
    phone:         r[2] || "",
    goal:          r[3] || "",
    active:        r[4] === "TRUE",
    joinDate:      r[5] || "",
    weight:        parseFloat(r[6]) || null,
    height:        parseFloat(r[7]) || null,
    targetWeight:  parseFloat(r[8]) || null,
  }));
}

async function addClient(client) {
  const id = `C${Date.now()}`;
  await appendSheet(`${TABS.CLIENTS}!A:I`, [[
    id, client.name, client.phone, client.goal || "General Fitness",
    "TRUE", new Date().toISOString().split("T")[0],
    client.weight || "", client.height || "", client.targetWeight || "",
  ]]);
  return { id, ...client };
}

async function updateClientStatus(phone, active) {
  const rows = await getSheet(`${TABS.CLIENTS}!A2:I200`);
  const idx = rows.findIndex((r) => r[2] === phone);
  if (idx === -1) throw new Error("Client not found");
  await updateSheet(`${TABS.CLIENTS}!E${idx + 2}`, [[active ? "TRUE" : "FALSE"]]);
}

// ─── CHECKINS ─────────────────────────────────────────────────────────────────
// Cols: Date | ClientID | ClientName | Phone | Workout | Diet | Water | Cardio | Timestamp
async function logCheckIn({ clientId, clientName, phone, workoutDone, dietDone, waterDone = false, cardioDone = false }) {
  const today = new Date().toISOString().split("T")[0];
  const existing = await getCheckInForToday(phone);
  if (existing) {
    return updateCheckIn(phone, today, workoutDone, dietDone, waterDone, cardioDone);
  }
  await appendSheet(`${TABS.CHECKINS}!A:I`, [[
    today, clientId, clientName, phone,
    workoutDone ? "YES" : "NO",
    dietDone    ? "YES" : "NO",
    waterDone   ? "YES" : "NO",
    cardioDone  ? "YES" : "NO",
    new Date().toISOString(),
  ]]);
  return { clientId, date: today, workoutDone, dietDone, waterDone, cardioDone };
}

async function getCheckInForToday(phone) {
  const today = new Date().toISOString().split("T")[0];
  const rows = await getSheet(`${TABS.CHECKINS}!A2:I2000`);
  return rows.find((r) => r[0] === today && r[3] === phone) || null;
}

async function updateCheckIn(phone, date, workoutDone, dietDone, waterDone, cardioDone) {
  const rows = await getSheet(`${TABS.CHECKINS}!A2:I2000`);
  const idx = rows.findIndex((r) => r[0] === date && r[3] === phone);
  if (idx === -1) return;
  await updateSheet(`${TABS.CHECKINS}!E${idx + 2}:H${idx + 2}`, [[
    workoutDone ? "YES" : "NO",
    dietDone    ? "YES" : "NO",
    waterDone   ? "YES" : "NO",
    cardioDone  ? "YES" : "NO",
  ]]);
}

async function getCheckInsForPeriod(phone, days = 7) {
  const rows = await getSheet(`${TABS.CHECKINS}!A2:I2000`);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return rows
    .filter((r) => r[3] === phone && new Date(r[0]) >= cutoff)
    .map((r) => ({
      date:        r[0],
      workoutDone: r[4] === "YES",
      dietDone:    r[5] === "YES",
      waterDone:   r[6] === "YES",
      cardioDone:  r[7] === "YES",
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

async function getAllCheckInsToday() {
  const today = new Date().toISOString().split("T")[0];
  const rows = await getSheet(`${TABS.CHECKINS}!A2:I2000`);
  return rows
    .filter((r) => r[0] === today)
    .map((r) => ({
      clientName:  r[2],
      phone:       r[3],
      workoutDone: r[4] === "YES",
      dietDone:    r[5] === "YES",
      waterDone:   r[6] === "YES",
      cardioDone:  r[7] === "YES",
    }));
}

// ─── MEASUREMENTS ─────────────────────────────────────────────────────────────
// Cols: Date | Phone | Weight | BMI | BodyFat | Chest | Waist | Arms | Shoulders | Thighs | Hips | Notes
async function logMeasurement(phone, data) {
  await appendSheet(`${TABS.MEASUREMENTS}!A:L`, [[
    new Date().toISOString().split("T")[0],
    phone,
    data.weight || "",       data.bmi || "",
    data.bodyFat || "",      data.chest || "",
    data.waist || "",        data.arms || "",
    data.shoulders || "",    data.thighs || "",
    data.hips || "",         data.notes || "",
  ]]);
}

async function getMeasurementsForClient(phone) {
  const rows = await getSheet(`${TABS.MEASUREMENTS}!A2:L500`);
  return rows
    .filter((r) => r[1] === phone)
    .map((r) => ({
      date:       r[0],
      weight:     parseFloat(r[2]) || null,
      bmi:        parseFloat(r[3]) || null,
      bodyFat:    parseFloat(r[4]) || null,
      chest:      parseFloat(r[5]) || null,
      waist:      parseFloat(r[6]) || null,
      arms:       parseFloat(r[7]) || null,
      shoulders:  parseFloat(r[8]) || null,
      thighs:     parseFloat(r[9]) || null,
      hips:       parseFloat(r[10]) || null,
      notes:      r[11] || "",
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ─── ALERTS ───────────────────────────────────────────────────────────────────
async function logAlert(phone, clientName, type, message) {
  await appendSheet(`${TABS.ALERTS}!A:E`, [[
    new Date().toISOString(), phone, clientName, type, message,
  ]]);
}

// ─── ANALYTICS ENGINE ─────────────────────────────────────────────────────────
function calcStats(checkins) {
  if (!checkins.length) return { total: 0, workoutDays: 0, dietDays: 0, waterDays: 0, cardioDays: 0, bothDays: 0, consistency: 0 };
  const workoutDays = checkins.filter((c) => c.workoutDone).length;
  const dietDays    = checkins.filter((c) => c.dietDone).length;
  const waterDays   = checkins.filter((c) => c.waterDone).length;
  const cardioDays  = checkins.filter((c) => c.cardioDone).length;
  const bothDays    = checkins.filter((c) => c.workoutDone && c.dietDone).length;
  return {
    total: checkins.length,
    workoutDays, dietDays, waterDays, cardioDays, bothDays,
    workoutPct: Math.round((workoutDays / checkins.length) * 100),
    dietPct:    Math.round((dietDays    / checkins.length) * 100),
    waterPct:   Math.round((waterDays   / checkins.length) * 100),
    cardioPct:  Math.round((cardioDays  / checkins.length) * 100),
    consistency: Math.round((bothDays   / checkins.length) * 100),
  };
}

// Generate AI-style behavioral insights from raw checkin data
function generateInsights(checkins, clientName) {
  const insights = [];
  if (!checkins.length) return ["Not enough data yet to generate insights."];

  // Weekend vs weekday pattern
  const weekdays  = checkins.filter((c) => { const d = new Date(c.date).getDay(); return d >= 1 && d <= 5; });
  const weekends  = checkins.filter((c) => { const d = new Date(c.date).getDay(); return d === 0 || d === 6; });
  const wdWorkout = weekdays.filter((c) => c.workoutDone).length / Math.max(weekdays.length, 1);
  const weWorkout = weekends.filter((c) => c.workoutDone).length / Math.max(weekends.length, 1);
  if (weWorkout > wdWorkout + 0.2) insights.push(`${clientName} performs better on weekends — consider shifting harder sessions to Sat/Sun.`);
  else if (wdWorkout > weWorkout + 0.2) insights.push(`${clientName} is more consistent on weekdays. Weekend motivation may need support.`);

  // Streak pattern
  const current = calcCurrentStreak(checkins);
  if (current >= 7)  insights.push(`${clientName} is on a ${current}-day streak — excellent momentum.`);
  else if (current === 0) insights.push(`${clientName} has broken their streak. A check-in call this week may help.`);

  // Water compliance
  const waterPct = checkins.filter((c) => c.waterDone).length / checkins.length;
  if (waterPct < 0.4) insights.push(`Hydration compliance is low (${Math.round(waterPct * 100)}%). Consider adding a mid-day water reminder.`);

  // Diet drop in recent days
  if (checkins.length >= 14) {
    const recent = checkins.slice(-7);
    const older  = checkins.slice(-14, -7);
    const recentDiet = recent.filter((c) => c.dietDone).length / 7;
    const olderDiet  = older.filter((c) => c.dietDone).length  / 7;
    if (recentDiet < olderDiet - 0.2) insights.push(`Diet consistency has dropped this week vs last week. May need a nutrition re-check.`);
    if (recentDiet > olderDiet + 0.2) insights.push(`Diet adherence improved significantly this week vs last. Great trend!`);
  }

  // Overall rating
  const overall = calcStats(checkins).consistency;
  if (overall >= 85) insights.push(`Overall consistency is excellent at ${overall}%. Client is on a strong trajectory.`);
  else if (overall < 50) insights.push(`Overall consistency is low at ${overall}%. Immediate intervention recommended.`);

  return insights.length ? insights : ["Consistency looks stable — keep monitoring weekly trends."];
}

function calcCurrentStreak(checkins) {
  const sorted = [...checkins].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  for (const c of sorted) {
    if (c.workoutDone && c.dietDone) streak++;
    else break;
  }
  return streak;
}

function getRiskLevel(stats, lastCheckinDaysAgo) {
  if (lastCheckinDaysAgo > 3)  return "HIGH";
  if (stats.consistency < 40)  return "HIGH";
  if (stats.consistency < 65)  return "MEDIUM";
  return "LOW";
}

async function getClientAnalytics(phone) {
  const [weekly7, monthly30, all90] = await Promise.all([
    getCheckInsForPeriod(phone, 7),
    getCheckInsForPeriod(phone, 30),
    getCheckInsForPeriod(phone, 90),
  ]);

  const streak = calcCurrentStreak(all90);
  const lastCheckin = all90.length ? all90[all90.length - 1] : null;
  const lastCheckinDaysAgo = lastCheckin
    ? Math.floor((Date.now() - new Date(lastCheckin.date)) / 86400000)
    : 999;

  const weeklyStats  = calcStats(weekly7);
  const monthlyStats = calcStats(monthly30);
  const risk = getRiskLevel(monthlyStats, lastCheckinDaysAgo);

  // Weekly breakdown by week (for monthly chart)
  const weeks = [[], [], [], []];
  monthly30.forEach((c, i) => weeks[Math.min(Math.floor(i / 7), 3)].push(c));
  const weeklyBreakdown = weeks.map((w, i) => ({
    label: `Week ${i + 1}`,
    ...calcStats(w),
  }));

  const clients = await getClients();
  const client  = clients.find((c) => c.phone === phone) || {};
  const measurements = await getMeasurementsForClient(phone);
  const insights = generateInsights(all90, client.name || "Client");

  return {
    weekly:           { ...weeklyStats, days: weekly7 },
    monthly:          { ...monthlyStats, weeklyBreakdown },
    currentStreak:    streak,
    lastCheckinDaysAgo,
    riskLevel:        risk,
    measurements,
    insights,
    client,
  };
}

module.exports = {
  getClients, addClient, updateClientStatus,
  logCheckIn, getCheckInForToday, getAllCheckInsToday, getCheckInsForPeriod,
  logMeasurement, getMeasurementsForClient,
  logAlert,
  getClientAnalytics,
  calcStats, generateInsights, calcCurrentStreak, getRiskLevel,
};
