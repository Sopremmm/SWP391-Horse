// Headless verify all 6 spectator routes for content presence
const { execSync } = require("node:child_process");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 5174;
const HOST = "127.0.0.1";

const ROUTES = [
  { path: "/spectator/home", expect: ["Tour de Hubs", "Featured Races", "Top Jockeys", "Latest Results", "Destined for Greatness"] },
  { path: "/spectator/tournaments", expect: ["Available Races", "Belmont Stakes", "Dubai World Cup", "Melbourne Cup", "By Race Date"] },
  { path: "/spectator/tournaments/derby-invitational", expect: ["Derby Invitational", "Confirmed Entries", "Place a Bet", "Thunder Dash", "Noble Spirit", "4.20x"] },
  { path: "/spectator/horses", expect: ["Horse Registry", "Sovereign", "Eclipse", "Royal Velvet", "Mystic Bay", "Thunderbolt", "Silver Ghost", "Total Registered Horses"] },
  { path: "/spectator/horses/sovereign", expect: ["Sovereign", "Total Races", "Win Rate", "Place a Bet", "On Sovereign"] },
  { path: "/spectator/bets", expect: ["My Betting History", "Total Bets", "Active Bets", "Settled Bets", "Lifetime Payouts", "Thunder Dash", "All Bets"] },
  { path: "/spectator/jockeys/leo-vane", expect: ["Leo Vane", "MASTER CLASS", "Total Wins", "Recent Performance", "Career Highlights", "Epsom Invitational"] },
];

let passed = 0;
let failed = 0;

for (const r of ROUTES) {
  const url = `http://${HOST}:${PORT}${r.path}`;
  const dumpScript = `
    setTimeout(() => {
      document.title;
    }, 100);
  `;
  const cmd = [
    `"${CHROME}"`,
    `--headless=new`,
    `--disable-gpu`,
    `--no-sandbox`,
    `--virtual-time-budget=8000`,
    `--dump-dom`,
    `"${url}"`,
  ].join(" ");

  let html = "";
  try {
    html = execSync(cmd, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  } catch (e) {
    console.log(`  ✗ ${r.path} — failed to launch chrome`);
    failed++;
    continue;
  }

  const missing = r.expect.filter((t) => !html.includes(t));
  if (missing.length === 0 && html.length > 500) {
    console.log(`  ✓ ${r.path} (${(html.length / 1024).toFixed(0)}KB)`);
    passed++;
  } else if (missing.length > 0) {
    console.log(`  ✗ ${r.path} — missing: ${missing.join(", ")}`);
    failed++;
  } else {
    console.log(`  ✗ ${r.path} — body too small (${html.length}B)`);
    failed++;
  }
}

console.log(`\n${passed} passed · ${failed} failed of ${ROUTES.length}`);
process.exit(failed === 0 ? 0 : 1);
