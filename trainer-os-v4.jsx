import { useState } from "react";

// ─── COLOURS (light theme) ────────────────────────────────────────────────────
const C = {
  bg:       "#f8f9fb",
  surface:  "#ffffff",
  border:   "#e8eaed",
  border2:  "#d1d5db",
  text:     "#111827",
  sub:      "#6b7280",
  muted:    "#9ca3af",
  green:    "#16a34a",
  greenBg:  "#f0fdf4",
  greenBd:  "#bbf7d0",
  red:      "#dc2626",
  redBg:    "#fef2f2",
  redBd:    "#fecaca",
  amber:    "#d97706",
  amberBg:  "#fffbeb",
  amberBd:  "#fde68a",
  blue:     "#2563eb",
  blueBg:   "#eff6ff",
  blueBd:   "#bfdbfe",
  purple:   "#7c3aed",
  purpleBg: "#f5f3ff",
  topbar:   "#ffffff",
  navBg:    "#ffffff",
};

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO_CLIENTS = [
  {
    id:"C001", name:"Arjun Sharma", phone:"+919876543210", goal:"Weight Loss",
    active:true, joinDate:"2026-03-01", height:175, startWeight:88, currentWeight:81.2, targetWeight:75,
    hasCheckedInToday:true,
    today:{ workout:true, diet:true, steps:true },
    payment:{ amount:8000, sessions:24, used:11, nextDue:"2026-06-01" },
    measurements:[
      { date:"2026-03-01", weight:88.0, chest:102, waist:96,  belly:98,  hips:104, biceps:34, thighs:58 },
      { date:"2026-04-01", weight:84.5, chest:100, waist:93,  belly:95,  hips:102, biceps:35, thighs:57 },
      { date:"2026-05-01", weight:81.2, chest:98,  waist:90,  belly:92,  hips:100, biceps:36, thighs:56 },
    ],
    dietPlan:"Caloric deficit of 500 kcal/day.\nMeals: 3 main + 2 snacks.\nProtein: 150g/day. Carbs: 180g. Fat: 55g.\nAvoid: fried food, sugary drinks, white bread.\nPre-workout: banana + black coffee.\nPost-workout: whey protein + rice.",
    workoutPlan:"Mon/Wed/Fri: Strength training (Push-Pull-Legs split).\nTue/Thu: 45-min cardio (treadmill or cycling).\nSat: Active recovery — yoga or light walk.\nSun: Rest.\nTarget: 10,000 steps daily. 3 litres water.",
    analytics:{ currentStreak:9, riskLevel:"LOW",
      weekly:{ workoutPct:86, dietPct:71, stepsPct:86, consistency:71,
        days:[{d:"Mon",w:true,di:true,s:true},{d:"Tue",w:true,di:false,s:true},{d:"Wed",w:true,di:true,s:true},{d:"Thu",w:true,di:true,s:true},{d:"Fri",w:true,di:true,s:false},{d:"Sat",w:true,di:false,s:true},{d:"Sun",w:false,di:false,s:false}] },
      monthly:{ workoutPct:82, dietPct:67, stepsPct:79, consistency:74,
        weeks:[{l:"W1",w:86,d:71,s:86},{l:"W2",w:71,d:71,s:71},{l:"W3",w:100,d:86,s:86},{l:"W4",w:71,d:57,s:71}] },
      insights:["Performs better on weekdays — weekend support may help.","Diet dropped in Week 2 but recovered in Week 3.","Steps compliance is strong at 79%."] }
  },
  {
    id:"C002", name:"Priya Mehta", phone:"+919765432109", goal:"Muscle Gain",
    active:true, joinDate:"2026-03-15", height:162, startWeight:55, currentWeight:57.0, targetWeight:62,
    hasCheckedInToday:true,
    today:{ workout:true, diet:true, steps:false },
    payment:{ amount:6000, sessions:20, used:8, nextDue:"2026-06-15" },
    measurements:[
      { date:"2026-03-15", weight:55.0, chest:84, waist:68, belly:70, hips:90, biceps:26, thighs:52 },
      { date:"2026-04-15", weight:56.1, chest:85, waist:67, belly:69, hips:89, biceps:27, thighs:53 },
      { date:"2026-05-10", weight:57.0, chest:86, waist:66, belly:68, hips:88, biceps:28, thighs:54 },
    ],
    dietPlan:"Caloric surplus of 300 kcal/day.\nProtein: 160g/day. Carbs: 220g. Fat: 60g.\nMeals: 5-6 small meals per day.\nFocus: lean meats, eggs, legumes, oats, sweet potato.\nPre-workout: oats + 2 boiled eggs.\nPost-workout: whey + banana.",
    workoutPlan:"Mon: Chest + Triceps.\nTue: Back + Biceps.\nWed: Legs + Glutes.\nThu: Shoulders + Core.\nFri: Full body compound lifts.\nSat: Active rest — swim or walk.\nSun: Rest.\nTarget: 8,000 steps daily.",
    analytics:{ currentStreak:3, riskLevel:"LOW",
      weekly:{ workoutPct:71, dietPct:71, stepsPct:43, consistency:64,
        days:[{d:"Mon",w:true,di:true,s:true},{d:"Tue",w:false,di:false,s:false},{d:"Wed",w:true,di:true,s:true},{d:"Thu",w:true,di:true,s:false},{d:"Fri",w:true,di:true,s:true},{d:"Sat",w:true,di:false,s:false},{d:"Sun",w:false,di:false,s:false}] },
      monthly:{ workoutPct:68, dietPct:65, stepsPct:42, consistency:62,
        weeks:[{l:"W1",w:57,d:57,s:43},{l:"W2",w:71,d:71,s:57},{l:"W3",w:57,d:57,s:43},{l:"W4",w:71,d:71,s:57}] },
      insights:["Steps compliance is low at 42%. Mid-day walk reminder may help.","More consistent on weekdays — weekend motivation needed."] }
  },
  {
    id:"C003", name:"Rahul Verma", phone:"+919654321098", goal:"Endurance",
    active:true, joinDate:"2026-02-15", height:178, startWeight:76, currentWeight:74.8, targetWeight:70,
    hasCheckedInToday:false,
    today:null,
    payment:{ amount:10000, sessions:30, used:18, nextDue:"2026-05-20" },
    measurements:[
      { date:"2026-02-15", weight:76.0, chest:98, waist:88, belly:90, hips:98, biceps:32, thighs:55 },
      { date:"2026-03-15", weight:75.1, chest:97, waist:87, belly:89, hips:97, biceps:32, thighs:55 },
      { date:"2026-05-01", weight:74.8, chest:96, waist:86, belly:88, hips:97, biceps:33, thighs:54 },
    ],
    dietPlan:"Moderate deficit + high carb for endurance.\nProtein: 140g. Carbs: 280g. Fat: 50g.\nEmphasize: brown rice, fruits, nuts, lean protein.\nHydration: minimum 3.5 litres/day.\nPre-run: banana + energy gel.\nPost-run: recovery shake + rice.",
    workoutPlan:"Mon/Wed/Fri: Long-distance running (5–10km).\nTue/Thu: Interval training + core.\nSat: Cycling 60 min or swim.\nSun: Complete rest.\nTarget: 12,000 steps daily.",
    analytics:{ currentStreak:0, riskLevel:"HIGH",
      weekly:{ workoutPct:29, dietPct:29, stepsPct:14, consistency:22,
        days:[{d:"Mon",w:false,di:false,s:false},{d:"Tue",w:true,di:true,s:true},{d:"Wed",w:false,di:false,s:false},{d:"Thu",w:false,di:false,s:false},{d:"Fri",w:true,di:false,s:false},{d:"Sat",w:false,di:false,s:false},{d:"Sun",w:false,di:false,s:false}] },
      monthly:{ workoutPct:38, dietPct:32, stepsPct:25, consistency:35,
        weeks:[{l:"W1",w:57,d:57,s:57},{l:"W2",w:43,d:43,s:43},{l:"W3",w:29,d:29,s:14},{l:"W4",w:29,d:14,s:14}] },
      insights:["HIGH RISK: Last check-in 4 days ago. Call immediately.","Consistency declining for 3 consecutive weeks.","Needs a direct motivation conversation."] }
  },
  {
    id:"C004", name:"Sneha Patel", phone:"+919543210987", goal:"Flexibility & Toning",
    active:true, joinDate:"2026-01-10", height:158, startWeight:62, currentWeight:58.5, targetWeight:55,
    hasCheckedInToday:true,
    today:{ workout:true, diet:true, steps:true },
    payment:{ amount:12000, sessions:36, used:19, nextDue:"2026-07-10" },
    measurements:[
      { date:"2026-01-10", weight:62.0, chest:88, waist:72, belly:74, hips:92, biceps:27, thighs:54 },
      { date:"2026-03-01", weight:60.1, chest:87, waist:70, belly:72, hips:90, biceps:27, thighs:53 },
      { date:"2026-05-01", weight:58.5, chest:86, waist:68, belly:70, hips:88, biceps:28, thighs:52 },
    ],
    dietPlan:"Clean eating with slight deficit.\nProtein: 120g. Carbs: 160g. Fat: 50g.\nFocus: salads, grilled protein, smoothies, fruits.\nAvoid: processed sugar, refined carbs.\nIntermitten fasting 16:8 on non-training days.\nNo cheat meals in first 3 months.",
    workoutPlan:"Mon/Wed/Fri: Yoga + pilates (60 min).\nTue/Thu: HIIT circuit training (30 min) + stretching.\nSat: Dance or zumba class.\nSun: Meditation + foam rolling.\nTarget: 10,000 steps daily. 2.5 litres water.",
    analytics:{ currentStreak:21, riskLevel:"LOW",
      weekly:{ workoutPct:100, dietPct:100, stepsPct:100, consistency:100,
        days:[{d:"Mon",w:true,di:true,s:true},{d:"Tue",w:true,di:true,s:true},{d:"Wed",w:true,di:true,s:true},{d:"Thu",w:true,di:true,s:true},{d:"Fri",w:true,di:true,s:true},{d:"Sat",w:true,di:true,s:true},{d:"Sun",w:true,di:true,s:true}] },
      monthly:{ workoutPct:96, dietPct:93, stepsPct:96, consistency:93,
        weeks:[{l:"W1",w:100,d:100,s:100},{l:"W2",w:86,d:86,s:86},{l:"W3",w:100,d:100,s:100},{l:"W4",w:100,d:86,s:100}] },
      insights:["21-day streak — exceptional. Consider a shoutout or reward!","Perfect compliance across all metrics this week."] }
  },
  {
    id:"C005", name:"Karan Singh", phone:"+919432109876", goal:"Weight Loss",
    active:true, joinDate:"2026-04-01", height:180, startWeight:95, currentWeight:93.2, targetWeight:80,
    hasCheckedInToday:false,
    today:null,
    payment:{ amount:7500, sessions:24, used:6, nextDue:"2026-05-15" },
    measurements:[
      { date:"2026-04-01", weight:95.0, chest:108, waist:102, belly:106, hips:108, biceps:36, thighs:62 },
      { date:"2026-05-01", weight:93.2, chest:107, waist:100, belly:104, hips:107, biceps:36, thighs:61 },
    ],
    dietPlan:"Aggressive caloric deficit: 700 kcal/day.\nProtein: 180g. Carbs: 150g. Fat: 45g.\nNo sugar. No alcohol. No fried food.\nMeals: 3 per day. No snacking.\nDrink 4 litres water daily.\nWeekly cheat meal allowed (1 meal only).",
    workoutPlan:"Mon/Tue/Thu/Fri: Strength + cardio combo (60 min).\nWed: LISS cardio 45 min (walk or cycle).\nSat: Functional training or sports.\nSun: Rest.\nTarget: 12,000 steps daily.",
    analytics:{ currentStreak:0, riskLevel:"MEDIUM",
      weekly:{ workoutPct:43, dietPct:29, stepsPct:29, consistency:29,
        days:[{d:"Mon",w:true,di:true,s:true},{d:"Tue",w:false,di:false,s:false},{d:"Wed",w:true,di:true,s:true},{d:"Thu",w:false,di:false,s:false},{d:"Fri",w:true,di:false,s:false},{d:"Sat",w:false,di:false,s:false},{d:"Sun",w:false,di:false,s:false}] },
      monthly:{ workoutPct:48, dietPct:38, stepsPct:35, consistency:42,
        weeks:[{l:"W1",w:57,d:57,s:57},{l:"W2",w:43,d:43,s:43},{l:"W3",w:43,d:43,s:43},{l:"W4",w:43,d:29,s:29}] },
      insights:["Diet is weakest at 38% — needs nutrition coaching.","Trending downward 4 weeks — motivation conversation needed.","PAYMENT OVERDUE — due 2026-05-15."] }
  },
  {
    id:"C006", name:"Divya Nair", phone:"+919321098765", goal:"Muscle Gain",
    active:true, joinDate:"2026-03-20", height:164, startWeight:52, currentWeight:54.0, targetWeight:58,
    hasCheckedInToday:true,
    today:{ workout:true, diet:true, steps:false },
    payment:{ amount:9000, sessions:28, used:12, nextDue:"2026-06-20" },
    measurements:[
      { date:"2026-03-20", weight:52.0, chest:80, waist:64, belly:66, hips:86, biceps:24, thighs:49 },
      { date:"2026-04-20", weight:53.1, chest:81, waist:63, belly:65, hips:85, biceps:25, thighs:50 },
      { date:"2026-05-10", weight:54.0, chest:82, waist:62, belly:64, hips:84, biceps:26, thighs:51 },
    ],
    dietPlan:"Lean bulk: 400 kcal surplus.\nProtein: 150g. Carbs: 200g. Fat: 55g.\nFocus: eggs, paneer, chicken, dal, oats, banana.\nMeals: 5 per day.\nPre/post workout nutrition mandatory.\nAvoid junk and processed food.",
    workoutPlan:"Mon: Upper body push (chest, shoulders, triceps).\nTue: Lower body (squats, lunges, hamstrings).\nWed: Upper body pull (back, biceps).\nThu: Glutes + core focus.\nFri: Full body strength.\nSat: Cardio + stretching.\nSun: Rest.\nTarget: 8,000 steps.",
    analytics:{ currentStreak:5, riskLevel:"LOW",
      weekly:{ workoutPct:71, dietPct:86, stepsPct:71, consistency:71,
        days:[{d:"Mon",w:true,di:true,s:true},{d:"Tue",w:false,di:true,s:false},{d:"Wed",w:true,di:true,s:true},{d:"Thu",w:true,di:true,s:true},{d:"Fri",w:true,di:true,s:true},{d:"Sat",w:true,di:false,s:true},{d:"Sun",w:false,di:true,s:false}] },
      monthly:{ workoutPct:69, dietPct:78, stepsPct:65, consistency:68,
        weeks:[{l:"W1",w:57,d:71,s:57},{l:"W2",w:71,d:71,s:71},{l:"W3",w:71,d:86,s:71},{l:"W4",w:71,d:86,s:71}] },
      insights:["Diet compliance is strong at 78% — great discipline.","Steps completion needs improvement.","Gaining weight steadily — on track for goal."] }
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function bmi(weight, height) {
  if (!weight || !height) return null;
  return (weight / ((height / 100) ** 2)).toFixed(1);
}
function bmiLabel(b) {
  if (!b) return "";
  const n = parseFloat(b);
  return n < 18.5 ? "Underweight" : n < 25 ? "Normal" : n < 30 ? "Overweight" : "Obese";
}
function pctColor(p) { return p >= 75 ? C.green : p >= 50 ? C.amber : C.red; }
function pctBg(p)    { return p >= 75 ? C.greenBg : p >= 50 ? C.amberBg : C.redBg; }
function riskColor(r){ return r==="LOW"?C.green:r==="MEDIUM"?C.amber:C.red; }
function riskBg(r)   { return r==="LOW"?C.greenBg:r==="MEDIUM"?C.amberBg:C.redBg; }
function diff(a, b)  { const d=(b-a).toFixed(1); return d>0?`+${d}`:String(d); }
function daysLeft(due){ const d=Math.ceil((new Date(due)-new Date())/86400000); return d; }

const MEASUREMENTS = ["weight","chest","waist","belly","hips","biceps","thighs"];
const MEAS_LABELS  = { weight:"Weight (kg)", chest:"Chest (cm)", waist:"Waist (cm)", belly:"Belly (cm)", hips:"Hips (cm)", biceps:"Biceps (cm)", thighs:"Thighs (cm)" };

// ─── STYLES ───────────────────────────────────────────────────────────────────
const pill = (col, bg, bd) => ({ fontSize:"11px", padding:"3px 10px", borderRadius:"99px", background:bg, border:`1px solid ${bd}`, color:col, fontWeight:500, display:"inline-block" });
const card  = (extra={}) => ({ background:C.surface, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"16px", ...extra });
const btn   = (col="#374151", bg="#fff", bd=C.border) => ({ padding:"7px 14px", borderRadius:"7px", border:`1px solid ${bd}`, background:bg, cursor:"pointer", fontSize:"12px", fontFamily:"inherit", color:col, fontWeight:500, transition:"all 0.15s" });
const input = { padding:"8px 10px", border:`1px solid ${C.border2}`, borderRadius:"7px", background:"#fff", fontSize:"13px", fontFamily:"inherit", color:C.text, width:"100%" };

export default function App() {
  const [view, setView] = useState("dashboard");
  const [clients, setClients] = useState(DEMO_CLIENTS);
  const [clientView, setClientView] = useState(null); // client id when viewing detail
  const [addingClient, setAddingClient] = useState(false);
  const [alert, setAlert] = useState(null);
  const [measForm, setMeasForm] = useState({});
  const [newC, setNewC] = useState({ name:"", phone:"", goal:"Weight Loss", height:"", startWeight:"", targetWeight:"", amount:"", sessions:"", nextDue:"", dietPlan:"", workoutPlan:"" });
  const [newMeas, setNewMeas] = useState({ weight:"", chest:"", waist:"", belly:"", hips:"", biceps:"", thighs:"" });

  const showAlert = (type, msg) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 4000); };

  function goToClient(id) { setClientView(id); setView("clients"); }

  const checkedIn    = clients.filter(c => c.hasCheckedInToday);
  const notCheckedIn = clients.filter(c => !c.hasCheckedInToday);
  const highRisk     = clients.filter(c => c.analytics.riskLevel === "HIGH");
  const paymentsDue  = clients.filter(c => daysLeft(c.payment.nextDue) <= 7);

  // ── TOPBAR ──────────────────────────────────────────────────────────────────
  function Topbar() {
    return (
      <div style={{ background:C.topbar, borderBottom:`1px solid ${C.border}`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:36, height:36, borderRadius:"9px", background:"linear-gradient(135deg,#16a34a,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>⚡</div>
          <div>
            <div style={{ fontSize:"14px", fontWeight:700, color:C.text }}>Trainer OS</div>
            <div style={{ fontSize:"10px", color:C.muted }}>client management system</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"6px" }}>
          {[["dashboard","Dashboard"],["reports","Reports"],["clients","Clients"],["whatsapp","WhatsApp"],["scheduler","Scheduler"]].map(([id,lbl]) => (
            <button key={id} onClick={() => { setView(id); setClientView(null); }} style={{ ...btn(view===id?C.blue:C.sub, view===id?C.blueBg:"#fff", view===id?C.blueBd:C.border), fontWeight:view===id?600:400 }}>{lbl}</button>
          ))}
          <button onClick={() => { setAddingClient(true); setView("clients"); }} style={{ ...btn("#fff","#16a34a","#16a34a"), fontWeight:600 }}>+ Add Client</button>
        </div>
      </div>
    );
  }

  // ── ALERT ───────────────────────────────────────────────────────────────────
  function AlertBar() {
    if (!alert) return null;
    const col = alert.type==="success"?C.green:alert.type==="error"?C.red:C.blue;
    const bg  = alert.type==="success"?C.greenBg:alert.type==="error"?C.redBg:C.blueBg;
    return <div style={{ padding:"10px 20px", background:bg, color:col, fontSize:"12px", borderBottom:`1px solid ${C.border}`, fontWeight:500 }}>{alert.type==="success"?"✓ ":alert.type==="error"?"✗ ":"ℹ "}{alert.msg}</div>;
  }

  // ── DASHBOARD ───────────────────────────────────────────────────────────────
  function Dashboard() {
    return (
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:"14px" }}>

        {/* Top stat strip */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px" }}>
          {[
            ["Total Clients", clients.length, C.blue, C.blueBg],
            ["Checked In Today", `${checkedIn.length}/${clients.length}`, C.green, C.greenBg],
            ["High Risk", highRisk.length, highRisk.length>0?C.red:C.sub, highRisk.length>0?C.redBg:C.bg],
            ["Payments Due Soon", paymentsDue.length, paymentsDue.length>0?C.amber:C.sub, paymentsDue.length>0?C.amberBg:C.bg],
          ].map(([lbl,val,col,bg]) => (
            <div key={lbl} style={{ ...card(), background:bg, border:`1px solid ${col}20` }}>
              <div style={{ fontSize:"24px", fontWeight:700, color:col }}>{val}</div>
              <div style={{ fontSize:"11px", color:C.sub, marginTop:"3px" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* ── Checked In / Not Checked In ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>

          {/* Checked In */}
          <div style={card()}>
            <div style={{ fontSize:"12px", fontWeight:700, color:C.green, marginBottom:"10px", display:"flex", alignItems:"center", gap:"6px" }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:C.green, display:"inline-block" }} />
              Checked In Today ({checkedIn.length})
            </div>
            {checkedIn.length === 0 && <div style={{ fontSize:"12px", color:C.muted, padding:"10px 0" }}>No check-ins yet today</div>}
            {checkedIn.map(c => (
              <div key={c.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:600, color:C.text, cursor:"pointer" }} onClick={() => goToClient(c.id)}>{c.name}</div>
                  <div style={{ display:"flex", gap:"6px", marginTop:"4px", flexWrap:"wrap" }}>
                    {c.today && <>
                      <span style={{ ...pill(c.today.workout?C.green:C.red, c.today.workout?C.greenBg:C.redBg, c.today.workout?C.greenBd:C.redBd) }}>Workout {c.today.workout?"✓":"✗"}</span>
                      <span style={{ ...pill(c.today.diet?C.green:C.red, c.today.diet?C.greenBg:C.redBg, c.today.diet?C.greenBd:C.redBd) }}>Diet {c.today.diet?"✓":"✗"}</span>
                      <span style={{ ...pill(c.today.steps?C.green:C.red, c.today.steps?C.greenBg:C.redBg, c.today.steps?C.greenBd:C.redBd) }}>10k Steps {c.today.steps?"✓":"✗"}</span>
                    </>}
                  </div>
                </div>
                <span style={{ fontSize:"11px", color:C.muted }}>🔥{c.analytics.currentStreak}d</span>
              </div>
            ))}
          </div>

          {/* Not Checked In */}
          <div style={card()}>
            <div style={{ fontSize:"12px", fontWeight:700, color:C.red, marginBottom:"10px", display:"flex", alignItems:"center", gap:"6px" }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:C.red, display:"inline-block" }} />
              Not Checked In ({notCheckedIn.length})
            </div>
            {notCheckedIn.length === 0 && <div style={{ fontSize:"12px", color:C.muted, padding:"10px 0" }}>All clients checked in! 🎉</div>}
            {notCheckedIn.map(c => (
              <div key={c.id} style={{ padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontSize:"13px", fontWeight:600, color:C.text, cursor:"pointer", textDecoration:"underline", textDecorationStyle:"dotted" }} onClick={() => goToClient(c.id)}>{c.name}</div>
                  <div style={{ display:"flex", gap:"6px" }}>
                    <a href={`tel:${c.phone}`} style={{ ...btn(C.blue,C.blueBg,C.blueBd), fontSize:"11px", textDecoration:"none", padding:"4px 10px" }}>📞 Call</a>
                    <a href={`https://wa.me/${c.phone.replace("+","")}`} target="_blank" rel="noreferrer" style={{ ...btn(C.green,C.greenBg,C.greenBd), fontSize:"11px", textDecoration:"none", padding:"4px 10px" }}>💬 WhatsApp</a>
                  </div>
                </div>
                <div style={{ fontSize:"11px", color:C.sub, marginTop:"3px" }}>
                  {c.phone} · Risk: <span style={{ color:riskColor(c.analytics.riskLevel), fontWeight:600 }}>{c.analytics.riskLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Payment Status ── */}
        <div style={card()}>
          <div style={{ fontSize:"13px", fontWeight:700, color:C.text, marginBottom:"12px" }}>💰 Payment & Sessions Overview</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${C.border}` }}>
                  {["Client","Amount Paid","Sessions Used","Sessions Left","Next Due","Status"].map(h => (
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", color:C.sub, fontWeight:600, fontSize:"11px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map(c => {
                  const left = c.payment.sessions - c.payment.used;
                  const days = daysLeft(c.payment.nextDue);
                  const status = days < 0 ? "OVERDUE" : days <= 3 ? "DUE SOON" : days <= 7 ? "DUE THIS WEEK" : "OK";
                  const stCol = days < 0 ? C.red : days <= 7 ? C.amber : C.green;
                  const stBg  = days < 0 ? C.redBg : days <= 7 ? C.amberBg : C.greenBg;
                  return (
                    <tr key={c.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                      <td style={{ padding:"10px", fontWeight:600, color:C.text }}>{c.name}</td>
                      <td style={{ padding:"10px", color:C.text }}>₹{c.payment.amount.toLocaleString()}</td>
                      <td style={{ padding:"10px", color:C.sub }}>{c.payment.used}</td>
                      <td style={{ padding:"10px" }}>
                        <span style={{ color:left<=3?C.red:left<=8?C.amber:C.green, fontWeight:600 }}>{left}</span>
                        <span style={{ color:C.muted }}> / {c.payment.sessions}</span>
                      </td>
                      <td style={{ padding:"10px", color:C.sub }}>{c.payment.nextDue}</td>
                      <td style={{ padding:"10px" }}>
                        <span style={{ ...pill(stCol,stBg,stCol+"33") }}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Payment reminders banner ── */}
        {paymentsDue.length > 0 && (
          <div style={{ ...card(), background:C.amberBg, border:`1px solid ${C.amberBd}` }}>
            <div style={{ fontSize:"12px", fontWeight:700, color:C.amber, marginBottom:"6px" }}>⚠️ Payment Reminders</div>
            {paymentsDue.map(c => {
              const days = daysLeft(c.payment.nextDue);
              return (
                <div key={c.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.amberBd}` }}>
                  <div style={{ fontSize:"12px", color:C.text }}><strong>{c.name}</strong> — ₹{c.payment.amount.toLocaleString()} due {c.payment.nextDue} {days<0?`(${Math.abs(days)}d overdue)`:`(in ${days}d)`}</div>
                  <div style={{ display:"flex", gap:"6px" }}>
                    <a href={`https://wa.me/${c.phone.replace("+","")}`} target="_blank" rel="noreferrer" style={{ ...btn(C.amber,C.amberBg,C.amberBd), fontSize:"11px", textDecoration:"none", padding:"4px 10px" }}>Send Reminder</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── CLIENT DETAIL ───────────────────────────────────────────────────────────
  function ClientDetail({ client }) {
    const [tab, setTab] = useState("overview");
    const a = client.analytics;
    const w = a.weekly; const m = a.monthly;
    const latestM = client.measurements[client.measurements.length - 1];
    const firstM  = client.measurements[0];
    const currentBMI = bmi(client.currentWeight, client.height);
    const left = client.payment.sessions - client.payment.used;

    const tabs = [["overview","Overview"],["measurements","Measurements"],["program","Diet & Workout"],["analytics","Analytics"]];

    return (
      <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:"14px" }}>
        {/* Back */}
        <button onClick={() => setClientView(null)} style={{ ...btn(), width:"fit-content", display:"flex", alignItems:"center", gap:"4px" }}>← Back to Clients</button>

        {/* Header */}
        <div style={card()}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"12px" }}>
            <div>
              <div style={{ fontSize:"20px", fontWeight:700, color:C.text }}>{client.name}</div>
              <div style={{ fontSize:"13px", color:C.sub, marginTop:"2px" }}>{client.goal} · Joined {client.joinDate}</div>
              <div style={{ display:"flex", gap:"8px", marginTop:"8px", flexWrap:"wrap" }}>
                <span style={pill(riskColor(a.riskLevel), riskBg(a.riskLevel), riskColor(a.riskLevel)+"44")}>{a.riskLevel} RISK</span>
                <span style={pill(C.purple, C.purpleBg, C.purple+"33")}>🔥 {a.currentStreak}d streak</span>
                <a href={`tel:${client.phone}`} style={{ ...pill(C.blue, C.blueBg, C.blueBd), textDecoration:"none", cursor:"pointer" }}>📞 {client.phone}</a>
                <a href={`https://wa.me/${client.phone.replace("+","")}`} target="_blank" rel="noreferrer" style={{ ...pill(C.green, C.greenBg, C.greenBd), textDecoration:"none" }}>💬 WhatsApp</a>
              </div>
            </div>
            {/* Key stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px" }}>
              {[
                ["Height", client.height+"cm"],
                ["Current", client.currentWeight+"kg"],
                ["Target", client.targetWeight+"kg"],
                ["BMI", currentBMI||"—"],
                ["BMI Type", bmiLabel(currentBMI)],
                ["Sessions Left", left+" / "+client.payment.sessions],
              ].map(([l,v]) => (
                <div key={l} style={{ background:C.bg, borderRadius:"8px", padding:"10px", textAlign:"center" }}>
                  <div style={{ fontSize:"15px", fontWeight:700, color:C.text }}>{v}</div>
                  <div style={{ fontSize:"10px", color:C.muted, marginTop:"2px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"4px", borderBottom:`2px solid ${C.border}`, paddingBottom:0 }}>
          {tabs.map(([id,lbl]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding:"8px 16px", background:"none", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:tab===id?700:400, color:tab===id?C.blue:C.sub, borderBottom:tab===id?`2px solid ${C.blue}`:"2px solid transparent", marginBottom:"-2px", fontFamily:"inherit" }}>{lbl}</button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {tab === "overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {/* Today's check-in */}
            <div style={card()}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"10px" }}>TODAY'S CHECK-IN</div>
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                {client.today ? [["Workout",client.today.workout],["Diet",client.today.diet],["10k Steps",client.today.steps]].map(([lbl,done]) => (
                  <div key={lbl} style={{ flex:1, minWidth:"100px", padding:"12px", background:done?C.greenBg:C.redBg, border:`1px solid ${done?C.greenBd:C.redBd}`, borderRadius:"8px", textAlign:"center" }}>
                    <div style={{ fontSize:"20px" }}>{done?"✅":"❌"}</div>
                    <div style={{ fontSize:"12px", color:done?C.green:C.red, fontWeight:600, marginTop:"4px" }}>{lbl}</div>
                  </div>
                )) : <div style={{ fontSize:"13px", color:C.muted }}>No check-in received today</div>}
              </div>
            </div>

            {/* Payment block */}
            <div style={{ ...card(), background:C.amberBg, border:`1px solid ${C.amberBd}` }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.amber, marginBottom:"10px" }}>💰 PAYMENT & SESSIONS</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
                {[["Amount Paid","₹"+client.payment.amount.toLocaleString()],["Sessions Total",client.payment.sessions],["Sessions Used",client.payment.used],["Sessions Left",left]].map(([l,v]) => (
                  <div key={l} style={{ background:"#fff", borderRadius:"7px", padding:"10px", textAlign:"center" }}>
                    <div style={{ fontSize:"17px", fontWeight:700, color:C.text }}>{v}</div>
                    <div style={{ fontSize:"10px", color:C.muted, marginTop:"2px" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:"10px", fontSize:"12px", color:C.amber, fontWeight:600 }}>
                Next payment due: {client.payment.nextDue} ({daysLeft(client.payment.nextDue) < 0 ? `${Math.abs(daysLeft(client.payment.nextDue))} days OVERDUE` : `in ${daysLeft(client.payment.nextDue)} days`})
              </div>
            </div>

            {/* Week grid */}
            <div style={card()}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"10px" }}>THIS WEEK</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px" }}>
                {w.days.map((day, i) => (
                  <div key={i} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"10px", color:C.muted, marginBottom:"4px" }}>{day.d}</div>
                    <div style={{ padding:"4px 2px", borderRadius:"5px", background:day.w&&day.di?C.greenBg:day.w||day.di?C.amberBg:C.redBg, border:`1px solid ${day.w&&day.di?C.greenBd:day.w||day.di?C.amberBd:C.redBd}` }}>
                      <div style={{ fontSize:"9px", color:day.w?C.green:C.red }}>W {day.w?"✓":"✗"}</div>
                      <div style={{ fontSize:"9px", color:day.di?C.green:C.red }}>D {day.di?"✓":"✗"}</div>
                      <div style={{ fontSize:"9px", color:day.s?C.green:C.red }}>S {day.s?"✓":"✗"}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:"16px", marginTop:"12px", flexWrap:"wrap" }}>
                {[["Workout",w.workoutPct],["Diet",w.dietPct],["10k Steps",w.stepsPct]].map(([lbl,pct]) => (
                  <div key={lbl} style={{ flex:1, minWidth:"80px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", marginBottom:"4px" }}>
                      <span style={{ color:C.sub }}>{lbl}</span>
                      <span style={{ color:pctColor(pct), fontWeight:600 }}>{pct}%</span>
                    </div>
                    <div style={{ height:"5px", background:C.border, borderRadius:"3px" }}>
                      <div style={{ height:"5px", width:`${pct}%`, background:pctColor(pct), borderRadius:"3px", transition:"width 0.3s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div style={card()}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"10px" }}>🧠 AI INSIGHTS</div>
              {a.insights.map((ins, i) => (
                <div key={i} style={{ padding:"8px 10px", background:C.bg, borderRadius:"7px", fontSize:"12px", color:C.text, lineHeight:"1.6", marginBottom:"6px" }}>💡 {ins}</div>
              ))}
            </div>
          </div>
        )}

        {/* ── Measurements tab ── */}
        {tab === "measurements" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {/* Before vs After */}
            {client.measurements.length >= 2 && (
              <div style={card()}>
                <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"12px" }}>TRANSFORMATION — BEFORE vs CURRENT</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:"8px" }}>
                  {MEASUREMENTS.filter(k => firstM[k] && latestM[k]).map(k => {
                    const d = parseFloat(diff(firstM[k], latestM[k]));
                    const isWeight = k === "weight";
                    const good = isWeight ? d < 0 : (client.goal.toLowerCase().includes("muscle") ? d > 0 : d < 0);
                    return (
                      <div key={k} style={{ background:good?C.greenBg:Math.abs(d)<0.5?C.bg:C.amberBg, border:`1px solid ${good?C.greenBd:Math.abs(d)<0.5?C.border:C.amberBd}`, borderRadius:"8px", padding:"10px", textAlign:"center" }}>
                        <div style={{ fontSize:"10px", color:C.muted, marginBottom:"4px" }}>{MEAS_LABELS[k]}</div>
                        <div style={{ fontSize:"12px", color:C.sub }}>{firstM[k]}</div>
                        <div style={{ fontSize:"13px", fontWeight:700, color:C.text }}>→ {latestM[k]}</div>
                        <div style={{ fontSize:"12px", color:good?C.green:Math.abs(d)<0.5?C.sub:C.amber, fontWeight:600 }}>{d>0?"+":""}{d}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Full history table */}
            <div style={card()}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"12px" }}>MEASUREMENT HISTORY (monthly log)</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${C.border}` }}>
                      <th style={{ padding:"8px", textAlign:"left", color:C.sub, fontWeight:600 }}>Date</th>
                      {MEASUREMENTS.map(k => <th key={k} style={{ padding:"8px", textAlign:"center", color:C.sub, fontWeight:600 }}>{k.charAt(0).toUpperCase()+k.slice(1)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {client.measurements.map((m, i) => (
                      <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"#fff":C.bg }}>
                        <td style={{ padding:"8px", color:C.text, fontWeight:500 }}>{m.date}</td>
                        {MEASUREMENTS.map(k => <td key={k} style={{ padding:"8px", textAlign:"center", color:C.text }}>{m[k]||"—"}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Log new measurement */}
            <div style={{ ...card(), border:`2px dashed ${C.border2}` }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"12px" }}>+ LOG NEW MEASUREMENT (monthly)</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:"8px" }}>
                {MEASUREMENTS.map(k => (
                  <div key={k}>
                    <div style={{ fontSize:"11px", color:C.sub, marginBottom:"4px" }}>{MEAS_LABELS[k]}</div>
                    <input value={newMeas[k]} onChange={e => setNewMeas(p => ({...p,[k]:e.target.value}))} placeholder="0" style={input} />
                  </div>
                ))}
              </div>
              <button onClick={() => { showAlert("success","Measurement saved! (Connect backend to persist)"); setNewMeas({ weight:"", chest:"", waist:"", belly:"", hips:"", biceps:"", thighs:"" }); }}
                style={{ ...btn("#fff",C.green,C.green), marginTop:"12px", fontWeight:600, padding:"9px 18px" }}>Save Measurement</button>
            </div>
          </div>
        )}

        {/* ── Program tab ── */}
        {tab === "program" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
            <div style={card()}>
              <div style={{ fontSize:"13px", fontWeight:700, color:C.text, marginBottom:"12px" }}>🥗 Diet Plan</div>
              <pre style={{ fontSize:"12px", color:C.text, lineHeight:"1.8", whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0, background:C.greenBg, padding:"14px", borderRadius:"8px", border:`1px solid ${C.greenBd}` }}>{client.dietPlan}</pre>
            </div>
            <div style={card()}>
              <div style={{ fontSize:"13px", fontWeight:700, color:C.text, marginBottom:"12px" }}>💪 Workout Program</div>
              <pre style={{ fontSize:"12px", color:C.text, lineHeight:"1.8", whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0, background:C.blueBg, padding:"14px", borderRadius:"8px", border:`1px solid ${C.blueBd}` }}>{client.workoutPlan}</pre>
            </div>
          </div>
        )}

        {/* ── Analytics tab ── */}
        {tab === "analytics" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <div style={card()}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"12px" }}>30-DAY MONTHLY BREAKDOWN</div>
              {[["Workout",m.workoutPct],["Diet",m.dietPct],["10k Steps",m.stepsPct]].map(([lbl,pct]) => (
                <div key={lbl} style={{ marginBottom:"10px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:"4px" }}>
                    <span style={{ color:C.text, fontWeight:500 }}>{lbl}</span>
                    <span style={{ color:pctColor(pct), fontWeight:700 }}>{pct}%</span>
                  </div>
                  <div style={{ height:"8px", background:C.border, borderRadius:"4px" }}>
                    <div style={{ height:"8px", width:`${pct}%`, background:pctColor(pct), borderRadius:"4px" }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={card()}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"12px" }}>WEEK-BY-WEEK TREND</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
                {m.weeks.map((wk,i) => {
                  const score = Math.round((wk.w+wk.d+wk.s)/3);
                  return (
                    <div key={i} style={{ background:pctBg(score), border:`1px solid ${pctColor(score)}33`, borderRadius:"8px", padding:"10px", textAlign:"center" }}>
                      <div style={{ fontSize:"11px", color:C.sub, marginBottom:"6px" }}>{wk.l}</div>
                      <div style={{ fontSize:"16px", fontWeight:700, color:pctColor(score) }}>{score}%</div>
                      <div style={{ fontSize:"9px", color:C.muted, marginTop:"4px" }}>W:{wk.w}% D:{wk.d}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── CLIENTS LIST ─────────────────────────────────────────────────────────────
  function ClientsList() {
    // If viewing a specific client
    if (clientView) {
      const c = clients.find(cl => cl.id === clientView);
      return c ? <ClientDetail client={c} /> : null;
    }

    // Add client form
    if (addingClient) return (
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:"14px", maxWidth:"720px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button onClick={() => setAddingClient(false)} style={{ ...btn(), padding:"6px 12px" }}>← Back</button>
          <div style={{ fontSize:"16px", fontWeight:700, color:C.text }}>Add New Client</div>
        </div>

        {/* Personal info */}
        <div style={card()}>
          <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"12px" }}>PERSONAL INFORMATION</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            {[["name","Full Name","text","Arjun Sharma"],["phone","WhatsApp Number","tel","+919876543210"],["height","Height (cm)","number","175"],["startWeight","Starting Weight (kg)","number","80"],["targetWeight","Target Weight (kg)","number","70"]].map(([f,l,t,ph]) => (
              <div key={f}>
                <label style={{ fontSize:"11px", color:C.sub, display:"block", marginBottom:"4px" }}>{l}</label>
                <input type={t} value={newC[f]} onChange={e=>setNewC(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={input} />
              </div>
            ))}
            <div>
              <label style={{ fontSize:"11px", color:C.sub, display:"block", marginBottom:"4px" }}>Goal</label>
              <select value={newC.goal} onChange={e=>setNewC(p=>({...p,goal:e.target.value}))} style={{ ...input }}>
                {["Weight Loss","Muscle Gain","Endurance","Flexibility & Toning","General Fitness"].map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Payment & Sessions */}
        <div style={card()}>
          <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"12px" }}>PAYMENT & SESSIONS</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
            {[["amount","Amount Paid (₹)","number","8000"],["sessions","Total Sessions","number","24"],["nextDue","Next Payment Due","date",""]].map(([f,l,t,ph]) => (
              <div key={f}>
                <label style={{ fontSize:"11px", color:C.sub, display:"block", marginBottom:"4px" }}>{l}</label>
                <input type={t} value={newC[f]} onChange={e=>setNewC(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={input} />
              </div>
            ))}
          </div>
        </div>

        {/* Starting measurements */}
        <div style={card()}>
          <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"12px" }}>STARTING MEASUREMENTS</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:"8px" }}>
            {MEASUREMENTS.map(k => (
              <div key={k}>
                <label style={{ fontSize:"11px", color:C.sub, display:"block", marginBottom:"4px" }}>{MEAS_LABELS[k]}</label>
                <input type="number" value={newMeas[k]} onChange={e=>setNewMeas(p=>({...p,[k]:e.target.value}))} placeholder="0" style={input} />
              </div>
            ))}
          </div>
        </div>

        {/* Diet & Workout */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
          {[["dietPlan","🥗 Diet Plan","e.g. 2000 kcal deficit, high protein..."],["workoutPlan","💪 Workout Program","e.g. Mon: Push, Tue: Pull..."]].map(([f,l,ph]) => (
            <div key={f} style={card()}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.sub, marginBottom:"8px" }}>{l}</div>
              <textarea value={newC[f]} onChange={e=>setNewC(p=>({...p,[f]:e.target.value}))} placeholder={ph}
                style={{ ...input, height:"160px", resize:"vertical", lineHeight:"1.6" }} />
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:"10px" }}>
          <button style={{ ...btn("#fff",C.green,C.green), padding:"10px 24px", fontWeight:700 }} onClick={() => {
            if (!newC.name||!newC.phone){showAlert("error","Name and phone required");return;}
            const nc = { id:"C"+Date.now(), ...newC, active:true, joinDate:new Date().toISOString().split("T")[0], currentWeight:parseFloat(newC.startWeight)||0, hasCheckedInToday:false, today:null,
              payment:{ amount:parseInt(newC.amount)||0, sessions:parseInt(newC.sessions)||0, used:0, nextDue:newC.nextDue||"" },
              measurements: Object.values(newMeas).some(v=>v) ? [{ date:new Date().toISOString().split("T")[0], ...Object.fromEntries(MEASUREMENTS.map(k=>[k,parseFloat(newMeas[k])||null])) }] : [],
              analytics:{ currentStreak:0, riskLevel:"LOW", weekly:{ workoutPct:0,dietPct:0,stepsPct:0,consistency:0,days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>({d,w:false,di:false,s:false})) }, monthly:{ workoutPct:0,dietPct:0,stepsPct:0,consistency:0,weeks:[{l:"W1",w:0,d:0,s:0},{l:"W2",w:0,d:0,s:0},{l:"W3",w:0,d:0,s:0},{l:"W4",w:0,d:0,s:0}] }, insights:["New client — start tracking to generate insights."] }
            };
            setClients(p=>[...p,nc]); setAddingClient(false); setNewC({ name:"",phone:"",goal:"Weight Loss",height:"",startWeight:"",targetWeight:"",amount:"",sessions:"",nextDue:"",dietPlan:"",workoutPlan:"" }); setNewMeas({ weight:"",chest:"",waist:"",belly:"",hips:"",biceps:"",thighs:"" }); showAlert("success",`${nc.name} added successfully!`);
          }}>Add Client</button>
          <button style={{ ...btn(), padding:"10px 24px" }} onClick={() => setAddingClient(false)}>Cancel</button>
        </div>
      </div>
    );

    // Client roster
    return (
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:"12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:"14px", fontWeight:700, color:C.text }}>All Clients ({clients.length})</div>
          <button onClick={() => setAddingClient(true)} style={{ ...btn("#fff",C.green,C.green), fontWeight:600 }}>+ Add Client</button>
        </div>
        {clients.map(c => {
          const left = c.payment.sessions - c.payment.used;
          return (
            <div key={c.id} style={{ ...card(), cursor:"pointer", transition:"box-shadow 0.15s" }} onClick={() => setClientView(c.id)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                    <span style={{ fontSize:"14px", fontWeight:700, color:C.text }}>{c.name}</span>
                    <span style={pill(riskColor(c.analytics.riskLevel), riskBg(c.analytics.riskLevel), riskColor(c.analytics.riskLevel)+"33")}>{c.analytics.riskLevel}</span>
                    {!c.hasCheckedInToday && <span style={pill(C.red,C.redBg,C.redBd)}>No check-in</span>}
                  </div>
                  <div style={{ fontSize:"12px", color:C.sub }}>{c.goal} · {c.phone} · Joined {c.joinDate}</div>
                  <div style={{ display:"flex", gap:"12px", marginTop:"8px", flexWrap:"wrap" }}>
                    {[["Workout",c.analytics.weekly.workoutPct],["Diet",c.analytics.weekly.dietPct],["Steps",c.analytics.weekly.stepsPct]].map(([lbl,pct]) => (
                      <div key={lbl} style={{ fontSize:"11px" }}>
                        <span style={{ color:C.sub }}>{lbl}: </span>
                        <span style={{ color:pctColor(pct), fontWeight:700 }}>{pct}%</span>
                      </div>
                    ))}
                    <div style={{ fontSize:"11px" }}><span style={{ color:C.sub }}>Streak: </span><span style={{ color:C.purple, fontWeight:700 }}>🔥{c.analytics.currentStreak}d</span></div>
                    <div style={{ fontSize:"11px" }}><span style={{ color:C.sub }}>Sessions left: </span><span style={{ color:left<=3?C.red:left<=8?C.amber:C.green, fontWeight:700 }}>{left}</span></div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"22px", fontWeight:700, color:pctColor(c.analytics.monthly.consistency) }}>{c.analytics.monthly.consistency}%</div>
                  <div style={{ fontSize:"10px", color:C.muted }}>monthly</div>
                  <div style={{ fontSize:"11px", color:C.sub, marginTop:"4px" }}>₹{c.payment.amount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── REPORTS ──────────────────────────────────────────────────────────────────
  function Reports() {
    return (
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:"14px" }}>
        <div style={{ fontSize:"14px", fontWeight:700, color:C.text }}>Reports & Analytics</div>
        {/* 7-day table */}
        <div style={card()}>
          <div style={{ fontSize:"13px", fontWeight:700, color:C.text, marginBottom:"12px" }}>7-Day Client Analytics</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
              <thead>
                <tr style={{ borderBottom:`2px solid ${C.border}` }}>
                  {["Client","Workout","Diet","10k Steps","Streak","Consistency","Risk"].map(h => (
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", color:C.sub, fontWeight:600, fontSize:"11px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...clients].sort((a,b) => b.analytics.monthly.consistency - a.analytics.monthly.consistency).map(c => {
                  const w = c.analytics.weekly;
                  return (
                    <tr key={c.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                      <td style={{ padding:"10px", fontWeight:600, color:C.text, cursor:"pointer" }} onClick={() => { setClientView(c.id); setView("clients"); }}>{c.name}</td>
                      <td style={{ padding:"10px" }}><span style={{ color:pctColor(w.workoutPct), fontWeight:700 }}>{w.workoutPct}%</span></td>
                      <td style={{ padding:"10px" }}><span style={{ color:pctColor(w.dietPct), fontWeight:700 }}>{w.dietPct}%</span></td>
                      <td style={{ padding:"10px" }}><span style={{ color:pctColor(w.stepsPct), fontWeight:700 }}>{w.stepsPct}%</span></td>
                      <td style={{ padding:"10px", color:C.purple, fontWeight:700 }}>🔥{c.analytics.currentStreak}d</td>
                      <td style={{ padding:"10px" }}><span style={{ color:pctColor(c.analytics.monthly.consistency), fontWeight:700 }}>{c.analytics.monthly.consistency}%</span></td>
                      <td style={{ padding:"10px" }}><span style={pill(riskColor(c.analytics.riskLevel),riskBg(c.analytics.riskLevel),riskColor(c.analytics.riskLevel)+"33")}>{c.analytics.riskLevel}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Insights */}
        <div style={card()}>
          <div style={{ fontSize:"13px", fontWeight:700, color:C.text, marginBottom:"12px" }}>🧠 AI Insights Summary</div>
          {clients.map(c => (
            <div key={c.id} style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:C.text, marginBottom:"4px", cursor:"pointer" }} onClick={() => { setClientView(c.id); setView("clients"); }}>{c.name}</div>
              {c.analytics.insights.slice(0,1).map((ins,i) => <div key={i} style={{ fontSize:"12px", color:C.sub, lineHeight:"1.6" }}>💡 {ins}</div>)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── WHATSAPP ──────────────────────────────────────────────────────────────────
  function WhatsApp() {
    const msgs = [
      { title:"☀️ Morning Reminder (8:00 AM)", msg:`Hi [Name] 👋\n\n⚡ Daily Check-In — Mon, 13 May 2026\n\nReply YES or NO for each:\n\n1️⃣ Workout — completed today?\n2️⃣ Diet — followed your plan?\n3️⃣ 10,000 Steps — target reached?\n\nReply: YES YES YES\n\nOr just DONE if you crushed everything! 💪` },
      { title:"✅ Client Confirmation (auto-reply)", msg:`Got it, Arjun! ✨\n\n✅ Workout\n✅ Diet\n❌ 10,000 Steps\n\n🔥 Streak: 9 days\n\nSolid effort! Hit those steps tomorrow 👟` },
      { title:"📊 Weekly Client Report (Sunday 8 PM)", msg:`━━━━━━━━━━━━━━\n📊 WEEKLY REPORT\n━━━━━━━━━━━━━━\nHi Arjun!\n\n💪 Workout: 6/7 ▓▓▓▓▓▓░ 86%\n🥗 Diet:    5/7 ▓▓▓▓▓░░ 71%\n👟 Steps:   6/7 ▓▓▓▓▓▓░ 86%\n\n🎯 Score: 81% — HIGHLY CONSISTENT\n🔥 Streak: 9 days\n\nGreat week! Focus on diet next week.` },
      { title:"📅 Monthly Transformation (1st of month)", msg:`━━━━━━━━━━━━━━\n📅 MONTHLY REPORT — May 2026\n━━━━━━━━━━━━━━\nHi Arjun!\n\n💪 Workout: 82%\n🥗 Diet:    67%\n👟 Steps:   79%\n\n⚖️ Weight: 88kg → 81.2kg (-6.8kg)\n📏 Waist:  96cm → 90cm (-6cm)\n\nThis month you proved what you're made of! 🏆` },
      { title:"📋 Trainer Daily Summary (9:00 PM)", msg:`📊 DAILY REPORT — Mon 13 May\n━━━━━━━━━━━━━━\n👥 4/6 checked in\n✅ 3 fully complete\n🚨 Rahul Verma — 4d no reply\n\nSTATUS:\n• Arjun ✓ ✓ ✗\n• Priya ✓ ✓ ✗\n• Sneha ✓ ✓ ✓\n• Divya ✓ ✓ ✗\n\n⚠️ Follow up:\n• Rahul +919654321098\n• Karan +919432109876` },
    ];
    return (
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:"14px" }}>
        <div style={{ fontSize:"14px", fontWeight:700, color:C.text }}>WhatsApp Message Templates</div>
        {msgs.map(({ title, msg }) => (
          <div key={title} style={card()}>
            <div style={{ fontSize:"12px", fontWeight:700, color:C.green, marginBottom:"10px" }}>{title}</div>
            <pre style={{ fontSize:"12px", color:C.text, lineHeight:"1.7", whiteSpace:"pre-wrap", margin:0, background:C.greenBg, padding:"14px", borderRadius:"8px", border:`1px solid ${C.greenBd}`, fontFamily:"inherit" }}>{msg}</pre>
          </div>
        ))}
      </div>
    );
  }

  // ── SCHEDULER ─────────────────────────────────────────────────────────────────
  function Scheduler() {
    const [backendUrl, setBackendUrl] = useState("");
    const [results, setResults] = useState({});
    async function trigger(name, label) {
      if (!backendUrl) { showAlert("info","Enter backend URL first"); return; }
      setResults(p => ({...p,[name]:"sending…"}));
      try {
        const r = await fetch(`${backendUrl}/trigger/${name}`, { method:"POST" });
        const d = await r.json();
        setResults(p => ({...p,[name]:d.success?"✅ Sent!":"❌ "+d.error}));
      } catch (e) { setResults(p => ({...p,[name]:"❌ "+e.message})); }
    }
    const jobs = [
      ["reminders","Morning Reminders","8:00 AM IST daily","Send workout/diet/steps check-in to all clients"],
      ["risk-alerts","Risk Alerts","8:00 PM IST daily","Alert trainer about inactive clients"],
      ["summary","Trainer Summary","9:00 PM IST daily","Daily summary report to trainer WhatsApp"],
      ["weekly-clients","Weekly Client Reports","Sunday 8:00 PM IST","Motivational weekly report to each client"],
      ["weekly-trainer","Weekly Trainer Report","Sunday 9:00 PM IST","7-day analytics to trainer"],
      ["monthly-clients","Monthly Transformation","1st of month 8 PM","Full transformation report to each client"],
      ["monthly-trainer","Monthly Trainer Report","1st of month 9 PM","Monthly overview with AI insights"],
    ];
    return (
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:"14px" }}>
        <div style={{ fontSize:"14px", fontWeight:700, color:C.text }}>Automation Scheduler</div>
        <div style={{ ...card(), background:C.blueBg, border:`1px solid ${C.blueBd}` }}>
          <div style={{ fontSize:"12px", fontWeight:700, color:C.blue, marginBottom:"8px" }}>Backend URL (Render.com)</div>
          <div style={{ display:"flex", gap:"8px" }}>
            <input value={backendUrl} onChange={e=>setBackendUrl(e.target.value)} placeholder="https://trainer-os-v3.onrender.com" style={{ ...input, flex:1 }} />
            <button onClick={async()=>{try{const r=await fetch(backendUrl+"/health");const d=await r.json();showAlert(d.status==="ok"?"success":"error",d.status==="ok"?"Connected!":"Failed")}catch(e){showAlert("error","Cannot connect")}}} style={{ ...btn("#fff",C.blue,C.blue), fontWeight:600 }}>Connect</button>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
          {jobs.map(([name, label, time, desc]) => (
            <div key={name} style={card()}>
              <div style={{ fontSize:"13px", fontWeight:700, color:C.text }}>{label}</div>
              <div style={{ fontSize:"11px", color:C.green, fontWeight:600, margin:"3px 0" }}>⏰ {time}</div>
              <div style={{ fontSize:"12px", color:C.sub, lineHeight:"1.5", marginBottom:"10px" }}>{desc}</div>
              <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                <button onClick={() => trigger(name, label)} style={{ ...btn("#fff",C.green,C.green), padding:"6px 14px", fontWeight:600 }}>▶ Send Now</button>
                {results[name] && <span style={{ fontSize:"12px", color:results[name].startsWith("✅")?C.green:C.red }}>{results[name]}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ background:C.bg, minHeight:"600px", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color:C.text, borderRadius:"12px", overflow:"hidden", border:`1px solid ${C.border}` }}>
      <Topbar />
      <AlertBar />
      {view === "dashboard" && <Dashboard />}
      {view === "clients"   && <ClientsList />}
      {view === "reports"   && <Reports />}
      {view === "whatsapp"  && <WhatsApp />}
      {view === "scheduler" && <Scheduler />}
    </div>
  );
}
