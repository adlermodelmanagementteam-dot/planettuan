import { useState } from "react";

// --- PALETTE ---
const G = "#16a34a";   // TUAN green
const D = "#111827";   // dark
const B = "#1d4ed8";   // blue (data)
const AM = "#b45309";  // amber (warning)
const R = "#dc2626";   // red (critical)
const BR = "#e5e7eb";  // border
const LT = "#f9fafb";  // light bg

// --- RAW DATA ---
const flower35 = [
  { name: "Mintz", qty: 332 },
  { name: "Pinnacle", qty: 264 },
  { name: "Space Venom", qty: 206 },
  { name: "Stardust Runtz", qty: 80 },
  { name: "Xenon", qty: 34 },
  { name: "Carbon Fiber", qty: 10 },
];
const flower7 = [
  { name: "Space Debris", qty: 295 },
  { name: "Carbon Fiber", qty: 234 },
  { name: "Quantum", qty: 173 },
  { name: "Lemon Biscotti", qty: 114 },
  { name: "Space Queen", qty: 39 },
];

const total35 = flower35.reduce((s, i) => s + i.qty, 0); // 926
const total7  = flower7.reduce((s, i) => s + i.qty, 0);  // 855
const val35   = total35 * 6;   // 5556
const val7    = total7 * 11;   // 9405
const totalFlower = val35 + val7; // 14961
const totalMonthly = 3 * 1500 + 7 * 500 + 2 * 250; // 8500

const mockOrders1500 = [
  {
    store: "Gradus NoHo", tier: 1500,
    i35: [["Mintz",50],["Pinnacle",30],["Space Venom",20]],
    i7:  [["Space Debris",32],["Carbon Fiber",30],["Quantum",20]],
  },
  {
    store: "Gradus Hollywood", tier: 1500,
    i35: [["Mintz",50],["Pinnacle",30],["Space Venom",20]],
    i7:  [["Space Debris",30],["Carbon Fiber",28],["Lemon Biscotti",24]],
  },
  {
    store: "Cake House El Monte", tier: 1500,
    i35: [["Mintz",45],["Pinnacle",35],["Stardust Runtz",20]],
    i7:  [["Space Debris",30],["Quantum",28],["Lemon Biscotti",24]],
  },
];

const tier500stores = [
  "Bud + Beyond","PLNTBSD","Happy Green","Hi Neighbor",
  "420 Costa Mesa","Fat Bunny","Backpack Boyz Cathedral City",
];

// --- UTILITY ---
const fmt  = (n) => "$" + Number(n).toLocaleString();
const fmtU = (n) => Number(n).toLocaleString() + " u";

// --- SHARED COMPONENTS ---
function Badge({ color, children }) {
  return (
    <span style={{
      background: color + "18", color,
      border: `1px solid ${color}40`,
      padding: "2px 7px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function StatBox({ label, value, sub, accent = G }) {
  return (
    <div style={{
      background: "white", border: `1px solid ${BR}`,
      borderRadius: 8, padding: "14px 16px",
      borderLeft: `4px solid ${accent}`,
    }}>
      <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 0.8, marginBottom: 4 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: D, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Card({ title, children, noPad }) {
  return (
    <div style={{
      background: "white", border: `1px solid ${BR}`,
      borderRadius: 8, marginBottom: 14, overflow: "hidden",
    }}>
      {title && (
        <div style={{
          padding: "10px 16px", borderBottom: `1px solid ${BR}`,
          fontWeight: 700, fontSize: 12, color: D,
          textTransform: "uppercase", letterSpacing: 0.6,
        }}>{title}</div>
      )}
      <div style={noPad ? {} : { padding: 16 }}>{children}</div>
    </div>
  );
}

function Th({ children, left }) {
  return (
    <th style={{
      padding: "7px 10px", textAlign: left ? "left" : "right",
      fontSize: 10, fontWeight: 700, color: "#6b7280",
      letterSpacing: 0.6, borderBottom: `2px solid ${BR}`,
      background: LT, whiteSpace: "nowrap",
    }}>{children ? children.toString().toUpperCase() : ""}</th>
  );
}

function Td({ children, left, bold, color }) {
  return (
    <td style={{
      padding: "7px 10px", textAlign: left ? "left" : "right",
      fontSize: 12, color: color || D, borderBottom: `1px solid ${BR}`,
      fontWeight: bold ? 700 : 400,
    }}>{children}</td>
  );
}

function Tr({ cells, highlight, leftFirst = true }) {
  return (
    <tr style={{ background: highlight ? G + "0a" : "white" }}>
      {cells.map((c, i) => (
        <Td key={i} left={leftFirst && i === 0} bold={highlight}>{c}</Td>
      ))}
    </tr>
  );
}

function Note({ children, color = AM }) {
  return (
    <div style={{
      fontSize: 12, color: "#374151", padding: "10px 12px",
      background: color + "08", borderRadius: 6,
      border: `1px solid ${color}30`, lineHeight: 1.6, marginTop: 10,
    }}>{children}</div>
  );
}

// ── TAB 1: INVENTORY ─────────────────────────────────────
function InventoryTab() {
  const daily35 = Math.round(total35 / 14);
  const daily7  = Math.round(total7  / 14);
  const dailyRev = daily35 * 6 + daily7 * 11;
  const acctDaily = Math.round(totalMonthly / 30);

  const statusColor = (qty) => qty > 100 ? G : qty > 30 ? AM : R;
  const statusLabel = (qty) => qty > 100 ? "Good" : qty > 30 ? "Low" : "Critical";

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        <StatBox label="Flower Inventory Value" value={fmt(totalFlower)} sub="At wholesale price" accent={G} />
        <StatBox label="Gummies Inventory" value="35,000 units" sub={fmt(280000)+" potential @ $8"} accent={B} />
        <StatBox label="Combined Portfolio" value={fmt(totalFlower+280000)} sub="All SKUs" accent={D} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card title="3.5G Flower — $6/unit" noPad>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <Th left>SKU</Th><Th>Units</Th><Th>Value</Th><Th>Status</Th>
            </tr></thead>
            <tbody>
              {[...flower35].sort((a,b)=>b.qty-a.qty).map((s,i)=>(
                <tr key={i} style={{ background:"white" }}>
                  <Td left>{s.name}</Td>
                  <Td>{s.qty}</Td>
                  <Td>{fmt(s.qty*6)}</Td>
                  <Td><Badge color={statusColor(s.qty)}>{statusLabel(s.qty)}</Badge></Td>
                </tr>
              ))}
              <Tr highlight cells={["TOTAL", total35, fmt(val35), ""]} />
            </tbody>
          </table>
        </Card>

        <Card title="7G Flower — $11/unit" noPad>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              <Th left>SKU</Th><Th>Units</Th><Th>Value</Th><Th>Status</Th>
            </tr></thead>
            <tbody>
              {[...flower7].sort((a,b)=>b.qty-a.qty).map((s,i)=>(
                <tr key={i} style={{ background:"white" }}>
                  <Td left>{s.name}</Td>
                  <Td>{s.qty}</Td>
                  <Td>{fmt(s.qty*11)}</Td>
                  <Td><Badge color={statusColor(s.qty)}>{statusLabel(s.qty)}</Badge></Td>
                </tr>
              ))}
              <Tr highlight cells={["TOTAL", total7, fmt(val7), ""]} />
            </tbody>
          </table>
        </Card>
      </div>

      <Card title="2-Week Sellout Pacing — Goal: Clear All Flower by Sept 14">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:12 }}>
          <StatBox label="3.5G daily target" value={daily35+" units"} sub={fmt(daily35*6)+"/day"} accent={G}/>
          <StatBox label="7G daily target" value={daily7+" units"} sub={fmt(daily7*11)+"/day"} accent={G}/>
          <StatBox label="Daily rev target" value={fmt(dailyRev)} sub="To clear in 14 days" accent={B}/>
          <StatBox label="Existing acct daily" value={fmt(acctDaily)} sub={fmt(dailyRev-acctDaily)+" gap → new accounts"} accent={AM}/>
        </div>
        <Note color={AM}>
          💡 Current 12 accounts generate ~$283/day. Selling out in 14 days requires $1,067/day total.
          That's a $784/day gap — meaning you need roughly <strong>7 new $1,500-tier accounts</strong> or <strong>21 new $500-tier accounts</strong> this week,
          OR push existing accounts to buy bigger orders now.
        </Note>
      </Card>
    </div>
  );
}

// ── TAB 2: ACCOUNTS ──────────────────────────────────────
function AccountsTab() {
  const orderTotal = (o) =>
    o.i35.reduce((s,[,q])=>s+q,0)*6 + o.i7.reduce((s,[,q])=>s+q,0)*11;

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        <StatBox label="Total Accounts" value="12" sub="10 active, 2 cold" />
        <StatBox label="$1,500 Tier" value="3 stores" sub={fmt(4500)+"/mo"} accent={G}/>
        <StatBox label="$500 Tier" value="7 stores" sub={fmt(3500)+"/mo"} accent={B}/>
        <StatBox label="Monthly Reorders" value={fmt(totalMonthly)} sub="Current run rate" accent={D}/>
      </div>

      <Card title="Mock Monthly Orders — $1,500 Accounts" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            <Th left>Store</Th>
            <Th left>3.5G SKUs</Th><Th>3.5G Units</Th>
            <Th left>7G SKUs</Th><Th>7G Units</Th>
            <Th>Est. Total</Th>
          </tr></thead>
          <tbody>
            {mockOrders1500.map((o,i)=>{
              const u35 = o.i35.reduce((s,[,q])=>s+q,0);
              const u7  = o.i7.reduce((s,[,q])=>s+q,0);
              return (
                <tr key={i} style={{ background: i%2===0?"white":LT }}>
                  <Td left><strong>{o.store}</strong></Td>
                  <Td left style={{fontSize:11}}>{o.i35.map(([n,q])=>`${n} ×${q}`).join(", ")}</Td>
                  <Td>{u35}</Td>
                  <Td left style={{fontSize:11}}>{o.i7.map(([n,q])=>`${n} ×${q}`).join(", ")}</Td>
                  <Td>{u7}</Td>
                  <Td bold>{fmt(orderTotal(o))}</Td>
                </tr>
              );
            })}
            <Tr highlight cells={["TOTAL","",mockOrders1500.reduce((s,o)=>s+o.i35.reduce((ss,[,q])=>ss+q,0),0),"",mockOrders1500.reduce((s,o)=>s+o.i7.reduce((ss,[,q])=>ss+q,0),0),fmt(mockOrders1500.reduce((s,o)=>s+orderTotal(o),0))]}/>
          </tbody>
        </table>
      </Card>

      <Card title="Mock Monthly Orders — $500 Accounts (Standard Order)" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            <Th left>Store</Th><Th left>3.5G Mix</Th><Th>Units</Th><Th left>7G Mix</Th><Th>Units</Th><Th>Est. Total</Th>
          </tr></thead>
          <tbody>
            {tier500stores.map((store,i)=>(
              <tr key={i} style={{ background: i%2===0?"white":LT }}>
                <Td left>{store}</Td>
                <Td left style={{fontSize:11}}>Mintz ×20, Space Venom ×15, Pinnacle ×7</Td>
                <Td>42</Td>
                <Td left style={{fontSize:11}}>Space Debris ×15, Carbon Fiber ×8</Td>
                <Td>23</Td>
                <Td bold>{fmt(42*6+23*11)}</Td>
              </tr>
            ))}
            <Tr highlight cells={["SUBTOTAL","",294,"",161,fmt(7*(42*6+23*11))]}/>
          </tbody>
        </table>
      </Card>

      <Card title="Cold Accounts — Re-Activation Needed" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><Th left>Store</Th><Th>Est. Order</Th><Th>Status</Th><Th left>Action</Th></tr></thead>
          <tbody>
            <tr style={{background:"white"}}>
              <Td left>Kush Korner 2</Td><Td>$250</Td>
              <Td><Badge color={AM}>Cold</Badge></Td>
              <Td left>Re-pitch with gummies sample + PAD offer</Td>
            </tr>
            <tr style={{background:LT}}>
              <Td left>Trees Hollywood</Td><Td>$250</Td>
              <Td><Badge color={AM}>Cold</Badge></Td>
              <Td left>Re-pitch with gummies sample + PAD offer</Td>
            </tr>
          </tbody>
        </table>
      </Card>

      <Card title="Reorder Revenue Summary" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><Th left>Tier</Th><Th>Stores</Th><Th>Monthly</Th><Th>Annual Run Rate</Th></tr></thead>
          <tbody>
            <Tr cells={["$1,500 tier", 3, fmt(4500), fmt(4500*12)]}/>
            <Tr cells={["$500 tier", 7, fmt(3500), fmt(3500*12)]}/>
            <Tr cells={["Cold ($250 est.)", 2, fmt(500), fmt(500*12)]}/>
            <Tr highlight cells={["TOTAL", 12, fmt(totalMonthly), fmt(totalMonthly*12)]}/>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── TAB 3: 40-STORE PLAN ─────────────────────────────────
function ExpansionTab() {
  const mix = [
    { tier:"$2,500", cur:0, tgt:2, mo:2*2500 },
    { tier:"$1,500", cur:3, tgt:6, mo:6*1500 },
    { tier:"$500",   cur:7, tgt:25, mo:25*500 },
    { tier:"$250 (cold/new)", cur:2, tgt:7, mo:7*250 },
  ];
  const total40 = mix.reduce((s,m)=>s+m.mo,0); // 28250
  const units35_40 = Math.round(total40*0.6/6);  // 2825
  const units7_40  = Math.round(total40*0.4/11); // 1027
  const mo35 = (total35/units35_40).toFixed(2);
  const mo7  = (total7/units7_40).toFixed(2);

  const weeks = [
    { label:"Sept 1–7",  oli:"3–4 new accounts, NYC prep, depart Sept 7–9, sell Eclipse", gage:"3–4 new accounts, PAD events (2x), reorder deliveries", tgt:"18–19", rev:"$10,500–12,000" },
    { label:"Sept 8–14", oli:"NYC: Brooklyn + Queens push (8–10 new stores)", gage:"4–5 new LA accounts, Amon PADs (2–3x), flyer drops", tgt:"22–24", rev:"$11,000–13,000" },
    { label:"Sept 15–21",oli:"NYC: Manhattan + Bronx push (8–10 new stores)", gage:"4–5 new LA accounts, mid-month reorder push, new rep onboard", tgt:"26–29", rev:"$12,000–14,000" },
    { label:"Sept 22–30",oli:"Returns ~Sept 25, sprint 3–4 new LA accounts", gage:"Sprint 4–5 new accounts, 4–5 PADs, end-of-month push", tgt:"35–40", rev:"$13,000–16,000+" },
  ];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        <StatBox label="Current Accounts" value="12" accent={B}/>
        <StatBox label="September Target" value="40 stores" sub="Sept 30 deadline" accent={G}/>
        <StatBox label="New Accounts Needed" value="28" sub="~7/week for 4 weeks" accent={AM}/>
        <StatBox label="Monthly Rev @ 40" value={fmt(total40)} sub="Conservative mix" accent={G}/>
      </div>

      <Card title="Projected Store Mix at 40 Accounts" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><Th left>Tier</Th><Th>Current</Th><Th>Target</Th><Th>New to Open</Th><Th>Monthly Rev</Th></tr></thead>
          <tbody>
            {mix.map((m,i)=>(
              <Tr key={i} cells={[m.tier, m.cur, m.tgt, m.tgt-m.cur, fmt(m.mo)]}/>
            ))}
            <Tr highlight cells={["TOTAL", 12, 40, 28, fmt(total40)]}/>
          </tbody>
        </table>
      </Card>

      <Card title="Flower SKU Requirements — 40-Store Monthly Velocity" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            <Th left>SKU Type</Th><Th>Monthly Units Needed</Th>
            <Th>Have Now</Th><Th>Supply Runway</Th><Th>Status</Th>
          </tr></thead>
          <tbody>
            <tr style={{background:"white"}}>
              <Td left>3.5G (@ $6)</Td>
              <Td>{units35_40.toLocaleString()}</Td>
              <Td>{total35}</Td>
              <Td>{mo35} months</Td>
              <Td><Badge color={R}>Needs Reorder</Badge></Td>
            </tr>
            <tr style={{background:LT}}>
              <Td left>7G (@ $11)</Td>
              <Td>{units7_40.toLocaleString()}</Td>
              <Td>{total7}</Td>
              <Td>{mo7} months</Td>
              <Td><Badge color={R}>Needs Reorder</Badge></Td>
            </tr>
          </tbody>
        </table>
        <Note color={R}>
          ⚠️ At 40-store velocity, current flower inventory runs out in under 1 month for both SKU types.
          New product orders need to be in the pipeline now. Flag this to James on Monday's call.
        </Note>
      </Card>

      <Card title="Weekly Account Targets — Oli + Gage" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            <Th left>Week</Th><Th left>Oli</Th><Th left>Gage</Th><Th>Acct Target</Th><Th>Est. Monthly Rev</Th>
          </tr></thead>
          <tbody>
            {weeks.map((w,i)=>(
              <tr key={i} style={{ background: i%2===0?"white":LT }}>
                <Td left><strong>{w.label}</strong></Td>
                <Td left style={{fontSize:11}}>{w.oli}</Td>
                <Td left style={{fontSize:11}}>{w.gage}</Td>
                <Td><Badge color={G}>{w.tgt}</Badge></Td>
                <Td>{w.rev}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── TAB 4: GUMMIES ───────────────────────────────────────
function GummiesTab() {
  const gCurRev = 3*200+7*75+2*50; // 1225
  const gCurU   = Math.round(gCurRev/8); // 153
  const gCurMo  = Math.round(35000/gCurU); // 229
  const g40Rev  = 40*125; // 5000
  const g40U    = Math.round(g40Rev/8); // 625
  const g40Mo   = Math.round(35000/g40U); // 56
  const gNYCRev = 300*150; // 45000
  const gNYCU   = Math.round(gNYCRev/8); // 5625
  const gNYCMo  = (35000/gNYCU).toFixed(1); // 6.2

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        <StatBox label="Gummy Inventory" value="35,000 units" sub="@ $8/unit wholesale" accent={G}/>
        <StatBox label="Total Gummy Value" value={fmt(280000)} sub="Potential revenue" accent={B}/>
        <StatBox label="NYC Launch Date" value="Sept 7" sub="CA date — confirm with James" accent={AM}/>
      </div>

      <Card title="Gummies Add-On — Current 12 Stores" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            <Th left>Tier</Th><Th>Stores</Th>
            <Th>Est. Add-On/Store/Mo</Th><Th>Total Rev</Th><Th>Units/Mo</Th>
          </tr></thead>
          <tbody>
            <Tr cells={["$1,500 accounts", 3, "$200", fmt(3*200), Math.round(3*200/8)+" u"]}/>
            <Tr cells={["$500 accounts", 7, "$75", fmt(7*75), Math.round(7*75/8)+" u"]}/>
            <Tr cells={["Cold accounts", 2, "$50", fmt(2*50), Math.round(2*50/8)+" u"]}/>
            <Tr highlight cells={["TOTAL", 12, "", fmt(gCurRev), gCurU+" u/mo"]}/>
          </tbody>
        </table>
        <Note color={AM}>
          At {gCurU} units/month, 35,000 gummy units lasts ~{gCurMo} months in CA alone.
          CA cannot move this product at scale. NYC is the gummy market.
        </Note>
      </Card>

      <Card title="Gummy Projection — 40-Store CA" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><Th left>Metric</Th><Th>Value</Th></tr></thead>
          <tbody>
            <Tr cells={["Avg gummy add-on per store", "$125/month"]}/>
            <Tr cells={["40-store monthly gummy revenue", fmt(g40Rev)]}/>
            <Tr cells={["40-store monthly gummy units", g40U+" units"]}/>
            <Tr cells={["Runway on 35,000 units (CA only)", g40Mo+" months"]}/>
          </tbody>
        </table>
      </Card>

      <Card title="Gummy Projection — NYC (300 Stores)" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><Th left>Metric</Th><Th>Value</Th></tr></thead>
          <tbody>
            <Tr cells={["Avg gummy add-on per NYC store", "$150/month"]}/>
            <Tr cells={["300-store monthly gummy revenue", fmt(gNYCRev)]}/>
            <Tr cells={["300-store monthly gummy units", gNYCU.toLocaleString()+" units"]}/>
            <Tr cells={["Runway on 35,000 units (NYC only)", gNYCMo+" months"]}/>
            <Tr highlight cells={["CA + NYC combined monthly", fmt(g40Rev+gNYCRev), ""]}/>
          </tbody>
        </table>
        <Note color={G}>
          NYC is where gummies move. At 300 stores averaging $150/month, you'd clear 35,000 units in ~{gNYCMo} months —
          a healthy, sustainable pace. Combined CA + NYC = {fmt(g40Rev+gNYCRev)}/month in gummies alone.
        </Note>
      </Card>
    </div>
  );
}

// ── TAB 5: STRATEGY ──────────────────────────────────────
function StrategyTab() {
  const bottlenecks = [
    { issue:"Gummies Launch Delayed", impact:"High",
      plan:"Lead with flower only. Have stores pre-commit to purchase orders so you have guaranteed buyers the day gummies land. PAD strategy pivots to drive flower sell-through." },
    { issue:"Gummy CA Nabis Date Unknown", impact:"High",
      plan:"ACTION ITEM: Get confirmed Nabis CA drop date from James on Monday's call. This determines whether CA stores can even be pitched on gummies or if NYC is the only active market." },
    { issue:"Product Not Moving in a Store", impact:"Medium",
      plan:"30-day rule: if a store hasn't reordered by day 30, book a PAD immediately. If sell-through is below 40% after a PAD, reallocate inventory to higher-performing accounts." },
    { issue:"PAD Capacity at 40-Store Scale", impact:"High",
      plan:"40 stores = 40–80 PADs/month. Thu/Fri/Sat gives only ~13 days. Need 2–3 brand ambassadors. Amon covers current load — hire or contract 1–2 more BAs by week 3 of September." },
    { issue:"Oli in NYC / No LA Coverage", impact:"Medium",
      plan:"Gage becomes primary closer. Amon handles PADs. New black-book rep (if hired) supports. Weekly Oli → Gage check-in call. Critical: onboard new rep before Oli leaves." },
    { issue:"Flower Inventory at 40-Store Velocity", impact:"High",
      plan:"Current stock lasts <1 month at 40-store pace. New product reorder must be initiated NOW. Flag to James Monday — this is the biggest operational risk in September." },
  ];

  const metrics = [
    ["CA Success — Accounts", "40 active accounts by Sept 30"],
    ["CA Success — Monthly Rev", "$20,000+ in monthly reorders by Oct 1"],
    ["CA Success — Sell-Through", ">60% sell-through within 30 days of first order"],
    ["CA Success — Avg Order", "Average order size >$500, trending toward $800"],
    ["CA Success — PAD Coverage", "2+ PADs per week across active accounts"],
    ["NYC Success — Stores", "50+ stores opened during Oli's visit (Sept 7–25)"],
    ["NYC Success — Gummies", "Gummies introduced to >80% of NYC accounts"],
    ["NYC Success — Trip Revenue", "$50,000+ in total NYC sales during the visit"],
    ["NYC Return Monthly Rate", "$30,000+/month NYC reorders by Oct 31"],
    ["James's Stated Goal", "20 CA sales by end of Sept — target 40 to over-deliver"],
  ];

  const timeline = [
    ["Sept 1–2 (est.)", "Seller accepts offer. Earnest money ($3,000) due within 2 days."],
    ["Sept 1–7", "LA: Close 3–4 new accounts. Sell Eclipse. NYC prep."],
    ["Sept 7 (or 9)", "Oli departs for NYC. Gummies launch in NYC market."],
    ["Sept 8–25", "Oli in NYC. Gage holds down LA. Amon runs PADs."],
    ["Sept ~11", "3rd TUAN paycheck. Truck fund reaches target if needed."],
    ["Sept ~17", "Cabin closes (17-day contingency). Remaining $7,000 due. Remote signing."],
    ["Sept ~18", "4th TUAN paycheck lands."],
    ["Sept ~25", "Oli returns from NYC."],
    ["Sept 25–30", "Both reps sprint to hit 40-store goal by month end."],
    ["Sept 30", "40-store milestone. Month-end review with James."],
  ];

  const activations = [
    { t:"In-Store PADs", d:"Product demos at dispensary floor. Introduce budtenders to SKUs, drive trial and reorders." },
    { t:"Budtender Incentives", d:"Tip jars, sell-most-TUAN contests. Low cost, high sell-through impact." },
    { t:"Gummy Launch Events", d:"Mini-events at $1,500-tier stores when gummies drop. Sampling, signage, social moment." },
    { t:"VB Brand Content", d:"Viktor Belmont documents the PAD circuit — behind the scenes of building a cannabis brand." },
  ];

  const iColor = (imp) => imp==="High"?R:imp==="Medium"?AM:G;

  return (
    <div>
      <Card title="Issues & Bottlenecks">
        {bottlenecks.map((b,i)=>(
          <div key={i} style={{
            borderLeft:`3px solid ${iColor(b.impact)}`, paddingLeft:12,
            marginBottom:i<bottlenecks.length-1?14:0,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <strong style={{ fontSize:13 }}>{b.issue}</strong>
              <Badge color={iColor(b.impact)}>{b.impact} Priority</Badge>
            </div>
            <div style={{ fontSize:12, color:"#374151", lineHeight:1.6 }}>{b.plan}</div>
          </div>
        ))}
      </Card>

      <Card title="What Does Success Look Like?" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><Th left>Metric</Th><Th left>Target</Th></tr></thead>
          <tbody>
            {metrics.map(([label,target],i)=>(
              <tr key={i} style={{ background: i%2===0?"white":LT }}>
                <Td left><strong>{label}</strong></Td>
                <Td left>{target}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="September Timeline">
        {timeline.map(([date,event],i)=>(
          <div key={i} style={{
            display:"flex", gap:14, padding:"8px 0",
            borderBottom: i<timeline.length-1?`1px solid ${BR}`:"none",
          }}>
            <div style={{ minWidth:110, fontSize:11, fontWeight:700, color:G, paddingTop:1 }}>{date}</div>
            <div style={{ fontSize:12, color:D }}>{event}</div>
          </div>
        ))}
      </Card>

      <Card title="Brand Activations">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {activations.map((a,i)=>(
            <div key={i} style={{ background:LT, borderRadius:6, padding:12, border:`1px solid ${BR}` }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{a.t}</div>
              <div style={{ fontSize:12, color:"#374151", lineHeight:1.5 }}>{a.d}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── TAB 6: NYC ───────────────────────────────────────────
function NYCTab() {
  const boroughs = [
    { name:"Manhattan",    est:100, pri:"Week 1–2", color:G,
      notes:"Highest density. Start here. Boutique dispensaries, upscale buyers. Lead with flower variety + gummies as the hook." },
    { name:"Brooklyn",     est:80,  pri:"Week 1–2", color:G,
      notes:"Strong cannabis culture. Williamsburg, Crown Heights, Bushwick. Community stores, very PAD-friendly." },
    { name:"Queens",       est:60,  pri:"Week 2–3", color:B,
      notes:"High volume, more price-sensitive. Strong 7G play. Diverse neighborhoods = broad SKU range." },
    { name:"Bronx",        est:40,  pri:"Week 3",   color:AM,
      notes:"Underserved market, less competition. Good early-mover advantage. Confirm James hasn't worked it yet." },
    { name:"Staten Island",est:20,  pri:"Week 3–4", color:AM,
      notes:"Lowest density. Do last or by referral only. Best if James already has relationships." },
  ];
  const totalNYC = boroughs.reduce((s,b)=>s+b.est,0);

  const questions = [
    { q:"What is the Nabis CA drop date for gummies?", why:"Determines if CA stores can be pitched now" },
    { q:"How many NYC stores are we already in?", why:"Changes Oli's trip target significantly" },
    { q:"Which boroughs has James already worked?", why:"Assign remaining boroughs to Oli, don't double-visit" },
    { q:"Exact NYC departure date?", why:"Drives car sale timing, truck purchase, and cash flow" },
    { q:"What's James's NYC target by end of September?", why:"Need to align on shared definition of success" },
    { q:"New black-book rep — timeline and what Oli's role is?", why:"May need to interview/onboard before Oli leaves" },
  ];

  const successMetrics = [
    ["New NYC stores opened", "50+ accounts in 18 days (~2.8/day)"],
    ["Gummy intro rate", ">80% of new accounts pitched on gummies"],
    ["Trip revenue", "$50,000+ in total NYC sales"],
    ["Reorder cadence", "Accounts reorder within 30 days of trip"],
    ["Monthly return rate", "$30,000+/month NYC reorders by Oct 31"],
    ["Borough coverage", "All 5 boroughs touched. Manhattan + Brooklyn = priority."],
  ];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        <StatBox label="Total NYC Dispensaries" value="~300" sub="Estimated market" accent={D}/>
        <StatBox label="Currently In" value="TBD" sub="Confirm with James" accent={AM}/>
        <StatBox label="Trip Goal" value="50+ stores" sub="Sept 7–25 (18 days)" accent={G}/>
        <StatBox label="Gummies Launch" value="Sept 7" sub="NYC first market" accent={B}/>
      </div>

      <Card title="Borough-by-Borough Strategy" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>
            <Th left>Borough</Th><Th>Est. Stores</Th><Th>Priority</Th><Th left>Notes</Th>
          </tr></thead>
          <tbody>
            {boroughs.map((b,i)=>(
              <tr key={i} style={{ background: i%2===0?"white":LT }}>
                <Td left><strong>{b.name}</strong></Td>
                <Td>{b.est}</Td>
                <Td><Badge color={b.color}>{b.pri}</Badge></Td>
                <Td left style={{fontSize:11}}>{b.notes}</Td>
              </tr>
            ))}
            <Tr highlight cells={["TOTAL", totalNYC, "", "Target: 50 new accounts in 18 days = ~2.8/day"]}/>
          </tbody>
        </table>
      </Card>

      <Card title="Open Questions — Get Answers From James Monday 7 AM">
        {questions.map((q,i)=>(
          <div key={i} style={{
            display:"flex", gap:10, padding:"9px 0",
            borderBottom: i<questions.length-1?`1px solid ${BR}`:"none",
          }}>
            <div style={{ color:R, fontWeight:800, fontSize:14, minWidth:14, paddingTop:1 }}>?</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:D, marginBottom:2 }}>{q.q}</div>
              <div style={{ fontSize:11, color:"#6b7280" }}>Why it matters: {q.why}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card title="NYC — What Does Success Look Like?" noPad>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><Th left>Metric</Th><Th left>Target</Th></tr></thead>
          <tbody>
            {successMetrics.map(([label,val],i)=>(
              <tr key={i} style={{ background: i%2===0?"white":LT }}>
                <Td left><strong>{label}</strong></Td>
                <Td left>{val}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="NYC Weekly Deployment Plan">
        {[
          { wk:"Week 1 (Sept 7–13)", focus:"Manhattan + Brooklyn", target:"15–18 new stores",
            actions:["Work Manhattan first — highest density, best gummy market","Hit Williamsburg + Crown Heights in Brooklyn","James likely has warm intros — close them immediately","Document every store for reorder pipeline setup"] },
          { wk:"Week 2 (Sept 14–20)", focus:"Queens + remaining Brooklyn", target:"15–18 new stores",
            actions:["Queens push — price-sensitive, lean into 7G value angle","Circle back to Manhattan stores for reorders","Confirm reorder timeline with Week 1 accounts","Update James daily on numbers"] },
          { wk:"Week 3 (Sept 21–25)", focus:"Bronx + cleanup", target:"10–15 new stores",
            actions:["Bronx early-mover play — lock in accounts before competition","Wrap loose accounts from week 1–2","Final tally + handoff to whoever covers NYC after Oli returns","Return to LA ~Sept 25"] },
        ].map((w,i)=>(
          <div key={i} style={{ marginBottom: i<2?14:0 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
              <strong style={{fontSize:13}}>{w.wk}</strong>
              <span style={{fontSize:12,color:"#6b7280"}}>— {w.focus}</span>
              <Badge color={G}>{w.target}</Badge>
            </div>
            {w.actions.map((a,j)=>(
              <div key={j} style={{ fontSize:12, color:"#374151", padding:"3px 0", display:"flex", gap:8 }}>
                <span style={{color:G}}>·</span>{a}
              </div>
            ))}
            {i<2 && <div style={{ borderBottom:`1px solid ${BR}`, marginTop:12 }}/>}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────
export default function SalesBinder() {
  const [tab, setTab] = useState(0);

  const tabs = [
    { label:"📦 Inventory",    comp:<InventoryTab /> },
    { label:"🏪 Accounts",     comp:<AccountsTab /> },
    { label:"📈 40-Store",     comp:<ExpansionTab /> },
    { label:"🍬 Gummies",      comp:<GummiesTab /> },
    { label:"🔧 Strategy",     comp:<StrategyTab /> },
    { label:"🗽 NYC",          comp:<NYCTab /> },
  ];

  return (
    <div style={{ fontFamily:"system-ui,-apple-system,sans-serif", background:"#f8fafc", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ background:D, padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ color:"white", fontWeight:800, fontSize:17, letterSpacing:-0.5 }}>TUAN CANNABIS</div>
          <div style={{ color:"#9ca3af", fontSize:11, marginTop:1 }}>September Sales Binder — Oliver Enos, Sales Director</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:G, fontWeight:800, fontSize:12 }}>GOAL: 40 STORES BY SEPT 30</div>
          <div style={{ color:"#6b7280", fontSize:10, marginTop:2 }}>Flower: {fmt(totalFlower)} | Gummies: {fmt(280000)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:"white", borderBottom:`1px solid ${BR}`, display:"flex", overflowX:"auto" }}>
        {tabs.map((t,i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{
            padding:"10px 14px", border:"none", background:"none", cursor:"pointer",
            fontSize:12, fontWeight:600, color: tab===i?G:"#6b7280",
            borderBottom: tab===i?`2px solid ${G}`:"2px solid transparent",
            whiteSpace:"nowrap",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:"16px 20px", maxWidth:960, margin:"0 auto" }}>
        {tabs[tab].comp}
      </div>
    </div>
  );
}
