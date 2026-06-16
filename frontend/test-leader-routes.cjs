// Headless Chrome smoke test for the leader's Heritage Racing routes.
// Verifies that each route renders HTML content and contains the expected text.
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(CHROME)) {
  console.error('Chrome not found at:', CHROME);
  process.exit(1);
}

const userDataDir = path.join(os.tmpdir(), 'chrome-tms-leader-' + Date.now());

const ROUTES = [
  { path: '/', name: 'Homepage (leader)', expect: ['Heritage Racing', 'Royal Heritage Cup', 'Current Tournaments', 'View All Stakes'] },
  { path: '/HorseOwnerHome', name: 'HorseOwner Home', expect: ['Welcome back', 'Subsequent Entries', 'Active Thoroughbreds', 'Heritage Racing'] },
  { path: '/HorseOwner/Tournaments', name: 'Tournament list', expect: ['Available Tournaments', 'Platinum Jubilee', 'Regional Qualifiers', 'All Events'] },
  { path: '/HorseOwner/MyHorses', name: 'My Horses', expect: ['My Stable', 'TOTAL VALUE', 'STABLE SIZE', 'RECENT WINS', 'Midnight Sovereign'] },
  { path: '/HorseOwner/HireJockeys', name: 'Hire Jockeys', expect: ['Professional Jockeys', 'Sophie Whitmore', 'Liam Hamilton', 'ALREADY HIRED', 'Hire Jockey'] },
  { path: '/Jockey/Home', name: 'Jockey Home', expect: ['Welcome back, Elena', 'Race Invitations', 'My Tournaments', 'Career Performance'] },
  { path: '/admin', name: 'Admin Dashboard', expect: ['Heritage Racing', 'Administration Portal', 'Total Active Users', 'Tournament Spotlight', 'Recent Registrations'] },
];

const PORT = process.env.PORT || 5174;
const BASE = `http://localhost:${PORT}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function dumpDOM(url) {
  const outDir = path.join(os.tmpdir(), 'chrome-dump-' + Date.now());
  fs.mkdirSync(outDir, { recursive: true });

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--user-data-dir=' + userDataDir,
    '--dump-dom',
    '--virtual-time-budget=10000',
    '--run-all-compositor-stages-before-draw',
    '--hide-scrollbars',
    url,
  ];

  const result = spawnSync(CHROME, args, {
    encoding: 'utf8',
    timeout: 30000,
    maxBuffer: 200 * 1024 * 1024,
  });

  if (result.status !== 0) {
    console.error('Chrome failed:', result.stderr?.slice(0, 500));
    return '';
  }

  // Chrome writes the DOM to stdout
  return (result.stdout || '').toString('utf8');
}

(async () => {
  const failures = [];
  for (const route of ROUTES) {
    const url = BASE + route.path;
    process.stdout.write(`\n=== ${route.name} (${route.path}) ===\n`);
    try {
      const dom = await dumpDOM(url);
      const lower = dom.toLowerCase();
      const body = dom.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
      const bodyLen = body.trim().length;

      const missing = [];
      for (const term of route.expect) {
        if (!lower.includes(term.toLowerCase())) {
          missing.push(term);
        }
      }

      if (bodyLen < 100) {
        failures.push({ route: route.path, reason: `Empty body (${bodyLen} chars)` });
        process.stdout.write(`  FAIL — empty body (${bodyLen} chars)\n`);
        continue;
      }

      if (missing.length) {
        failures.push({ route: route.path, reason: 'Missing terms: ' + missing.join(', ') });
        process.stdout.write(`  FAIL — missing: ${missing.join(', ')}\n`);
      } else {
        process.stdout.write(`  OK — ${bodyLen} chars, all terms found\n`);
      }
    } catch (e) {
      failures.push({ route: route.path, reason: e.message });
      process.stdout.write(`  ERROR — ${e.message}\n`);
    }
  }

  // Clean up
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}

  console.log('\n\n========== SUMMARY ==========');
  console.log(`Total routes tested: ${ROUTES.length}`);
  console.log(`Failures: ${failures.length}`);
  if (failures.length) {
    failures.forEach((f) => console.log(`  - ${f.route}: ${f.reason}`));
    process.exit(1);
  } else {
    console.log('All routes OK');
  }
})();
