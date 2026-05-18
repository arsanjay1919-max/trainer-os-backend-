require("dotenv").config();
const { google } = require("googleapis");

async function setup() {
  console.log("🔧 Setting up Google Sheets for Trainer OS v3...\n");
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth = new google.auth.GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const sheets = google.sheets({ version: "v4", auth });
  const SHEET_ID = process.env.GOOGLE_SHEET_ID;

  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const existing = meta.data.sheets.map((s) => s.properties.title);

  const needed = ["Clients", "CheckIns", "Measurements", "Alerts"];
  const toCreate = needed.filter((t) => !existing.includes(t));

  if (toCreate.length) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: { requests: toCreate.map((title) => ({ addSheet: { properties: { title } } })) },
    });
    console.log("✅ Created tabs:", toCreate.join(", "));
  }

  const headers = {
    "Clients!A1:I1":       [["ID","Name","Phone","Goal","Active","JoinDate","Weight","Height","TargetWeight"]],
    "CheckIns!A1:I1":      [["Date","ClientID","ClientName","Phone","Workout","Diet","Water","Cardio","Timestamp"]],
    "Measurements!A1:L1":  [["Date","Phone","Weight","BMI","BodyFat","Chest","Waist","Arms","Shoulders","Thighs","Hips","Notes"]],
    "Alerts!A1:E1":        [["Timestamp","Phone","ClientName","Type","Message"]],
  };

  for (const [range, values] of Object.entries(headers)) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID, range,
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });
    console.log(`✅ Headers set: ${range}`);
  }

  console.log(`\n🎉 Setup complete!`);
  console.log(`📊 https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`);
  console.log("\nNext: Add your real clients to the Clients tab, then deploy to Render.com");
}

setup().catch((e) => { console.error("❌", e.message); process.exit(1); });
