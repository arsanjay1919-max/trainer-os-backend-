// ─── REPORT BUILDERS ──────────────────────────────────────────────────────────
// All WhatsApp message generators. Kept clean, mobile-first, emoji-driven.

const { calcStats, calcCurrentStreak } = require("./db");

// ─── DAILY REMINDER ───────────────────────────────────────────────────────────
function buildReminderMessage(clientName) {
  const date = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
  return `Hi ${clientName}! 👋

⚡ *Daily Check-In* — ${date}

Reply YES or NO for each:

1️⃣ *Workout* — completed today?
2️⃣ *Diet* — followed your plan?
3️⃣ *Water* — hit your intake goal?
4️⃣ *Cardio* — steps/cardio done?

📝 Reply format:
*YES YES YES YES*
(workout / diet / water / cardio)

Or just *DONE* if you crushed everything! 💪`;
}

// ─── CLIENT CONFIRMATION (after they reply) ───────────────────────────────────
function buildConfirmationMessage(clientName, { workoutDone, dietDone, waterDone, cardioDone }, streak) {
  const e = (v) => v ? "✅" : "❌";
  const all = workoutDone && dietDone && waterDone && cardioDone;
  const most = [workoutDone, dietDone, waterDone, cardioDone].filter(Boolean).length >= 3;

  const encouragement = all
    ? ["You're on FIRE today! 🔥", "Absolute beast mode! 💥", "Champions do exactly this! 🏆"][Math.floor(Math.random() * 3)]
    : most
    ? "Solid effort today! One more goal tomorrow 💪"
    : "Tomorrow is a fresh start — let's go! 🙏";

  return `Got it, ${clientName}! ✨

${e(workoutDone)} Workout
${e(dietDone)} Diet
${e(waterDone)} Water
${e(cardioDone)} Cardio

🔥 Streak: *${streak} day${streak !== 1 ? "s" : ""}*

${encouragement}`;
}

// ─── WEEKLY CLIENT MOTIVATION REPORT ─────────────────────────────────────────
function buildWeeklyClientReport(client, analytics) {
  const { weekly, currentStreak, measurements } = analytics;
  const { workoutDays, dietDays, waterDays, cardioDays, total,
          workoutPct, dietPct, waterPct, cardioPct } = weekly;

  const score = Math.round((workoutPct + dietPct + waterPct + cardioPct) / 4);
  const rating =
    score >= 85 ? "🏆 EXCELLENT"     :
    score >= 70 ? "⭐ HIGHLY CONSISTENT" :
    score >= 55 ? "👍 GOOD"          :
    score >= 40 ? "⚠️ NEEDS IMPROVEMENT" :
                  "🔴 INCONSISTENT";

  const bar = (pct) => {
    const filled = Math.round(pct / 14.3);  // 7 blocks = 100%
    return "▓".repeat(filled) + "░".repeat(7 - filled) + ` ${pct}%`;
  };

  const improvement =
    score >= 85 ? "Keep this up — you're ahead of most people who start this journey!"
    : workoutPct > dietPct
    ? `Focus on diet consistency next week — it's the key to faster results.`
    : dietPct > workoutPct
    ? `Great diet discipline! Now match it with workout consistency.`
    : waterPct < 50
    ? `Try setting a phone alarm to drink water every 2 hours next week.`
    : `Focus on keeping all four habits consistent every single day.`;

  const lastWeight = measurements?.length
    ? `\n⚖️ Last logged weight: *${measurements[measurements.length - 1].weight} kg*`
    : "";

  return `━━━━━━━━━━━━━━━━━━━━
📊 *YOUR WEEKLY REPORT*
${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
━━━━━━━━━━━━━━━━━━━━

Hi *${client.name}*! Here's your week in review:

📌 *PERFORMANCE SUMMARY*
💪 Workout: ${workoutDays}/${total} days
🥗 Diet: ${dietDays}/${total} days
💧 Water: ${waterDays}/${total} days
🏃 Cardio: ${cardioDays}/${total} days

📈 *CONSISTENCY SCORES*
💪 ${bar(workoutPct)}
🥗 ${bar(dietPct)}
💧 ${bar(waterPct)}
🏃 ${bar(cardioPct)}

🎯 *OVERALL WEEKLY SCORE*
${score}% — ${rating}

🔥 *Current Streak: ${currentStreak} days*${lastWeight}

💬 *Coach's Message:*
${buildMotivationalMessage(score, client.name)}

💡 *Focus for Next Week:*
${improvement}

━━━━━━━━━━━━━━━━━━━━
Keep going — your body is changing even when you can't see it yet. 🌟`;
}

function buildMotivationalMessage(score, name) {
  if (score >= 85) return `${name}, you had an incredible week! Your discipline and dedication are building real, lasting results. The habits you're building now are your foundation. 🏆`;
  if (score >= 70) return `Really solid week, ${name}! You're showing up consistently and that's what separates those who transform from those who don't. Keep pushing! ⭐`;
  if (score >= 55) return `Good effort this week, ${name}! You're building the habit — now let's sharpen the edges. A few more consistent days will start showing real results. 💪`;
  if (score >= 40) return `${name}, this week was a challenge — and that's okay. Every person on a transformation journey has tough weeks. What matters is you come back stronger. Tomorrow is your fresh start. 🙏`;
  return `${name}, I know this week was tough. But the fact that you're still in this program means you care about your health. Let's connect and figure out what's making it hard. You've got this. 💙`;
}

// ─── MONTHLY CLIENT TRANSFORMATION REPORT ─────────────────────────────────────
function buildMonthlyClientReport(client, analytics) {
  const { monthly, currentStreak, measurements, insights } = analytics;
  const { workoutPct, dietPct, waterPct, cardioPct, weeklyBreakdown } = monthly;
  const score = Math.round((workoutPct + dietPct + waterPct + cardioPct) / 4);

  // Body changes
  let bodySection = "";
  if (measurements && measurements.length >= 2) {
    const first = measurements[0];
    const last  = measurements[measurements.length - 1];
    const diff  = (a, b) => (b - a > 0 ? `+${(b - a).toFixed(1)}` : (b - a).toFixed(1));
    bodySection = `
⚖️ *BODY TRANSFORMATION*
Weight: ${first.weight} kg → *${last.weight} kg* (${diff(first.weight, last.weight)} kg)
${first.waist  ? `Waist: ${first.waist} cm → *${last.waist} cm* (${diff(first.waist, last.waist)} cm)\n` : ""}${first.chest  ? `Chest: ${first.chest} cm → *${last.chest} cm*\n` : ""}${first.arms   ? `Arms: ${first.arms} cm → *${last.arms} cm*\n` : ""}`;
  }

  // Weekly trend
  const trendRows = weeklyBreakdown.map((w) =>
    `${w.label}: 💪${w.workoutPct}% 🥗${w.dietPct}%${w.total > 0 ? " ✓" : " —"}`
  ).join("\n");

  return `━━━━━━━━━━━━━━━━━━━━
📅 *MONTHLY TRANSFORMATION REPORT*
${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
━━━━━━━━━━━━━━━━━━━━

Hi *${client.name}*! Here's your full month recap:

📊 *MONTHLY CONSISTENCY*
💪 Workout: ${workoutPct}%
🥗 Diet: ${dietPct}%
💧 Water: ${waterPct}%
🏃 Cardio: ${cardioPct}%

📈 *MONTHLY SCORE: ${score}%*
${currentStreak > 0 ? `🔥 Current Streak: ${currentStreak} days` : ""}
${bodySection}
📆 *WEEK-BY-WEEK BREAKDOWN*
${trendRows}

🧠 *YOUR COACH'S INSIGHTS*
${insights.slice(0, 2).map((i) => `• ${i}`).join("\n")}

💬 *Month-End Message:*
${buildMonthlyMotivation(score, client.name)}

━━━━━━━━━━━━━━━━━━━━
Every day you showed up is a brick in your foundation. Keep building. 🏗️🌟`;
}

function buildMonthlyMotivation(score, name) {
  if (score >= 80) return `${name}, this month you proved what you're made of. Results like these don't happen by accident — they happen because of choices like yours. Be proud. 🏆`;
  if (score >= 60) return `${name}, you had more good days than bad this month. That ratio is going to tip even further in your favour next month. Stay the course. 💪`;
  return `${name}, every month is a new opportunity. The data from this month tells us exactly what to fix. Next month, we go harder on the fundamentals. I'm in your corner. 💙`;
}

// ─── DAILY TRAINER SUMMARY ────────────────────────────────────────────────────
function buildTrainerDailySummary(clients, checkIns) {
  const date = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
  const responded = checkIns.length;
  const total = clients.length;
  const bothDone  = checkIns.filter((c) => c.workoutDone && c.dietDone).length;
  const noReply   = clients.filter((c) => !checkIns.find((ci) => ci.phone === c.phone));

  let msg = `📊 *DAILY TRAINER REPORT*\n${date}\n`;
  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `👥 ${responded}/${total} clients checked in\n`;
  msg += `✅ ${bothDone} completed everything\n`;
  msg += `⚠️ ${noReply.length} no response\n\n`;

  msg += `*CLIENT STATUS:*\n`;
  checkIns.forEach((c) => {
    msg += `• ${c.clientName}: 💪${c.workoutDone?"✅":"❌"} 🥗${c.dietDone?"✅":"❌"} 💧${c.waterDone?"✅":"❌"} 🏃${c.cardioDone?"✅":"❌"}\n`;
  });

  if (noReply.length) {
    msg += `\n🚨 *FOLLOW UP NEEDED:*\n`;
    noReply.forEach((c) => { msg += `• ${c.name} (${c.phone})\n`; });
  }
  return msg;
}

// ─── WEEKLY TRAINER ANALYTICS ─────────────────────────────────────────────────
function buildWeeklyTrainerReport(clientAnalytics) {
  const sorted = [...clientAnalytics].sort((a, b) => b.monthly.consistency - a.monthly.consistency);
  const top    = sorted.slice(0, 3);
  const bottom = sorted.slice(-3).reverse();
  const highRisk = clientAnalytics.filter((c) => c.riskLevel === "HIGH");

  let msg = `📈 *WEEKLY TRAINER ANALYTICS*\n`;
  msg += new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long" }) + "\n";
  msg += `━━━━━━━━━━━━━━━\n\n`;

  msg += `*ALL CLIENTS — 7-DAY STATS:*\n`;
  clientAnalytics.forEach((c) => {
    const w = c.weekly;
    const risk = c.riskLevel === "HIGH" ? " 🚨" : c.riskLevel === "MEDIUM" ? " ⚠️" : " ✅";
    msg += `• *${c.client.name}*${risk}\n`;
    msg += `  💪${w.workoutPct}% 🥗${w.dietPct}% 💧${w.waterPct}% 🔥${c.currentStreak}d\n`;
  });

  msg += `\n🏆 *MOST CONSISTENT:*\n`;
  top.forEach((c) => { msg += `• ${c.client.name} — ${c.weekly.consistency}%\n`; });

  msg += `\n⚠️ *NEEDS ATTENTION:*\n`;
  bottom.forEach((c) => { msg += `• ${c.client.name} — ${c.weekly.consistency}%\n`; });

  if (highRisk.length) {
    msg += `\n🚨 *HIGH RISK CLIENTS (${highRisk.length}):*\n`;
    highRisk.forEach((c) => { msg += `• ${c.client.name} — last seen ${c.lastCheckinDaysAgo}d ago\n`; });
  }
  return msg;
}

// ─── MONTHLY TRAINER ANALYTICS ────────────────────────────────────────────────
function buildMonthlyTrainerReport(clientAnalytics) {
  const avg = (arr) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const avgConsistency = avg(clientAnalytics.map((c) => c.monthly.consistency));
  const retained = clientAnalytics.filter((c) => c.lastCheckinDaysAgo <= 7).length;

  let msg = `📅 *MONTHLY TRAINER REPORT*\n`;
  msg += new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }) + "\n";
  msg += `━━━━━━━━━━━━━━━\n\n`;
  msg += `👥 Total clients: ${clientAnalytics.length}\n`;
  msg += `📊 Avg consistency: ${avgConsistency}%\n`;
  msg += `✅ Active (last 7d): ${retained}/${clientAnalytics.length}\n\n`;

  msg += `*FULL CLIENT BREAKDOWN:*\n`;
  clientAnalytics
    .sort((a, b) => b.monthly.consistency - a.monthly.consistency)
    .forEach((c) => {
      const m = c.monthly;
      msg += `\n*${c.client.name}* — ${m.consistency}% overall\n`;
      msg += `💪${m.workoutPct}% 🥗${m.dietPct}% 💧${m.waterPct}% 🏃${m.cardioPct}%\n`;
      msg += `🔥 Streak: ${c.currentStreak}d | Risk: ${c.riskLevel}\n`;
      if (c.insights?.[0]) msg += `💡 ${c.insights[0]}\n`;
    });
  return msg;
}

// ─── RISK ALERT ───────────────────────────────────────────────────────────────
function buildRiskAlert(client, analytics) {
  const days = analytics.lastCheckinDaysAgo;
  return `🚨 *RISK ALERT — Action Needed*

Client: *${client.name}*
Phone: ${client.phone}
Last check-in: ${days > 99 ? "Never" : `${days} day${days !== 1 ? "s" : ""} ago`}
Monthly consistency: ${analytics.monthly.consistency}%
Risk level: *${analytics.riskLevel}*

${analytics.insights[0] || ""}

👆 Consider reaching out directly today.`;
}

// ─── MESSAGE PARSER ───────────────────────────────────────────────────────────
// Parses WhatsApp replies into structured check-in data
// Handles: YES YES YES YES / DONE / NO NO / workout yes diet no / 1 1 1 1
function parseReply(body) {
  if (!body || typeof body !== "string") return { valid: false, reason: "Empty message" };
  const text = body.trim().toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ");

  if (["done", "completed", "all done", "all yes"].includes(text)) {
    return { valid: true, workoutDone: true, dietDone: true, waterDone: true, cardioDone: true };
  }
  if (text === "yes") return { valid: true, workoutDone: true, dietDone: true, waterDone: true, cardioDone: true };
  if (text === "no")  return { valid: true, workoutDone: false, dietDone: false, waterDone: false, cardioDone: false };

  const yn = (w) => ["yes", "done", "1", "y"].includes(w) ? true : ["no", "0", "n"].includes(w) ? false : null;

  // Try positional: "yes no yes yes"
  const words = text.split(" ").filter((w) => ["yes", "no", "done", "1", "0", "y", "n"].includes(w));
  if (words.length >= 2) {
    const [w, d, wa, c] = words;
    return {
      valid: true,
      workoutDone: yn(w)  ?? false,
      dietDone:    yn(d)  ?? false,
      waterDone:   yn(wa) ?? false,
      cardioDone:  yn(c)  ?? false,
    };
  }

  // Named fields: "workout yes diet no"
  const wm = text.match(/workout[\s-]*(yes|no|1|0)/);
  const dm = text.match(/diet[\s-]*(yes|no|1|0)/);
  const wam = text.match(/water[\s-]*(yes|no|1|0)/);
  const cm = text.match(/cardio[\s-]*(yes|no|1|0)/);
  if (wm || dm) {
    return {
      valid: true,
      workoutDone: yn(wm?.[1]) ?? false,
      dietDone:    yn(dm?.[1]) ?? false,
      waterDone:   yn(wam?.[1]) ?? false,
      cardioDone:  yn(cm?.[1]) ?? false,
    };
  }

  return { valid: false, reason: 'Reply format: "YES YES YES YES" (workout/diet/water/cardio) or just "DONE"' };
}

module.exports = {
  buildReminderMessage,
  buildConfirmationMessage,
  buildWeeklyClientReport,
  buildMonthlyClientReport,
  buildTrainerDailySummary,
  buildWeeklyTrainerReport,
  buildMonthlyTrainerReport,
  buildRiskAlert,
  parseReply,
};
