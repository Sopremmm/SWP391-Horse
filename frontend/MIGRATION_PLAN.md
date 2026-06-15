# Heritage Racing — Frontend Migration Plan

Migration from `d:\SWP391-Horse-Front-end\SWP391-Horse-Front-end` (source) → `d:\SWP391\SWP391-Horse\frontend` (target).

## Stack mapping

| Aspect            | Source (A)                      | Target (B — kept)              |
|-------------------|---------------------------------|--------------------------------|
| Build tool        | react-scripts (CRA)             | Vite 6                         |
| React             | 19                              | 18                             |
| Language          | TypeScript (.tsx)               | JavaScript (.jsx)              |
| Styling           | CSS Modules + plain CSS         | Tailwind v4 utility classes    |
| Router            | react-router-dom 7              | react-router-dom 7             |
| Icons             | inline SVG                      | Tabler Icons (`ti ti-*`)       |
| Data layer        | `getPageData()` + localStorage  | React Context (`useApp()`)     |
| State             | local component state           | React Context                  |

## Source A is NOT ported as-is

Files in A use TypeScript and CSS Modules. They cannot be copied to B without breaking Vite + Tailwind compile. Instead, the **design patterns and visual layouts** are recreated in B using Tailwind utility classes, while keeping the data layer and routing of B.

## Brand identity (Heritage Racing)

Visual cues ported from A:
- Brand name: "Heritage Racing" (font serif for headings via `font-serif` Tailwind class)
- Color tokens in `@theme` (already added): gold (`#b8860b`), gold-light, gold-border
- Trophy / crown motifs (via `ti ti-trophy`, `ti ti-coin`)
- Gold accent for prize pools, totals, premium stats
- Liberation Serif for headings (added in `index.css`)

## Files touched

### Added (Phase 1+2 — Spectator + Bet)
- `src/tms/data.js` — added MOCK_ODDS, MOCK_ODDS_BY_HORSE, getOddsForHorse
- `src/tms/components/spectator/SpectatorRaceCard.jsx` — race card + BetModal
- `src/tms/pages/SpectatorBets.jsx` — bet history page

### Modified (Phase 1+2)
- `src/index.css` — added @theme tokens (gold, orange, serif font, shadow utilities)
- `src/tms/AppContext.jsx` — added bets state, placeBet(), getMyBets()
- `src/tms/pages/SpectatorDashboard.jsx` — rewrite UI with new component
- `src/App.jsx` — added route /spectator/bets

### Modified (Phase 3+ — Brand polish)
- `src/tms/pages/LandingPage.jsx` — brand name "Heritage Racing", gold accent on hero stats
- `src/tms/pages/OwnerDashboard.jsx` — subtitle "Horse Owner", serif font on tournament title
- `src/tms/pages/JockeyDashboard.jsx` — subtitle "Professional Jockey", serif font on tournament title
- `src/tms/pages/ProfilePage.jsx` — serif font on user name

### Added (Phase 3+)
- `src/tms/components/common/FeatureCard.jsx` — reusable card for tournament/race showcase (hero + compact variants)

### NOT touched (kept as-is to avoid conflicts)
- `package.json`
- `vite.config.js`
- `main.jsx`
- `src/admin/*` (admin sidebar layout)
- `src/data/*` (used by admin pages — separate data layer)
- `src/tms/pages/HostHome.jsx`
- `src/tms/pages/RefereeDashboard.jsx`
- `src/tms/pages/AdminDashboard.jsx`
- `src/tms/components/layout/*` (AppShell, Header)
- `src/tms/components/common/{StatusPill,Modal,Button,Input,...}.jsx` (reused as-is)
- `node_modules/*`

## Data strategy

B is source of truth. `RACES_SEED` in `src/tms/races.js` already has the structure (registrations with horseName, jockeyName, status). `getOddsForHorse` provides mock odds for the bet feature. No changes to RACES_SEED.

## Routes summary

| Role        | Path                                | File                                  | Status        |
|-------------|-------------------------------------|---------------------------------------|---------------|
| Public      | `/`                                 | `LandingPage.jsx`                     | polished      |
| Public      | `/profile`                          | `ProfilePage.jsx`                     | polished      |
| Spectator   | `/spectator`                        | `SpectatorDashboard.jsx`              | rewritten     |
| Spectator   | `/spectator/bets`                   | `SpectatorBets.jsx`                   | **NEW**       |
| Owner       | `/owner`                            | `OwnerDashboard.jsx`                  | polished      |
| Jockey      | `/jockey`                           | `JockeyDashboard.jsx`                 | polished      |
| Referee     | `/referee`                          | `RefereeDashboard.jsx`                | unchanged     |
| Host        | `/host`                             | `HostHome.jsx`                        | unchanged     |
| Admin       | `/admin/*`                          | `src/admin/Layout.jsx` + `pages/*`    | unchanged     |
| Legacy      | `/app`                              | `Dashboard.jsx`                       | unchanged     |

## How to verify

```bash
cd d:\SWP391\SWP391-Horse\frontend
npm run dev
```

Open http://localhost:3000, sign in with these credentials:

| User ID | Password       | Role       | Lands on        |
|---------|----------------|------------|-----------------|
| U001    | admin123       | admin      | /admin          |
| U002    | host123        | host       | /host           |
| U003    | jockey123      | jockey     | /jockey         |
| U006    | owner123       | owner      | /owner          |
| U008    | referee123     | referee    | /referee        |
| U009    | spectator123   | spectator  | /spectator      |

Try Spectator flow:
1. Sign in as U009 → SpectatorDashboard
2. Click "Place Bet" on any race card → choose horse, enter amount → see live payout → Confirm
3. Tab "My Predictions" → link to /spectator/bets → see full bet history with stats

## Next phases (planned)

- Phase 8: Final review + cleanup (any leftover)

