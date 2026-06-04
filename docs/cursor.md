---
description: SWP391 Horse Racing TMS — Frontend development context
alwaysApply: true
---

# SWP391 Horse Racing Tournament Management System — Frontend Context

## 1. Project Overview

**Project**: Horse Racing Tournament Management System (TMS)
**Course**: SWP391 — FPT University
**Team**: Phát (PM) · Danh (BA) · Trung (Dev) · Tuấn (Tester) · Kiên (Designer)
**Frontend Only** — FE is a React + Vite + TailwindCSS app. Backend (Spring Boot) is separate.
**Tech Stack**: React 18, Vite 6, TailwindCSS v4, React Router v7, Tabler Icons

---

## 2. Technology Stack

| Category | Library | Version |
|---|---|---|
| Framework | React | 18.x |
| Bundler | Vite | 6.x |
| Styling | TailwindCSS | 4.x |
| Routing | React Router DOM | 7.x |
| Icons | Tabler Icons Webfont | CDN (index.html) |
| HTTP | axios (planned) | latest |
| State | React Context + useState (no Redux) | — |

**Package manager**: npm (Node.js)
**Start dev**: `npm run dev` (port 3000)
**Build**: `npm run build`

---

## 3. Directory Structure

```
frontend/src/
├── main.jsx              ← Entry point — renders <App />
├── App.jsx               ← Hybrid router (all routes defined here)
├── AppContext.jsx        ← Global auth context (AppProvider wraps router)
├── index.css             ← TailwindCSS imports + Inter font
│
├── admin/                ← Admin sidebar layout (green theme)
│   ├── Layout.jsx       ← Sidebar + Outlet wrapper
│   └── Sidebar.jsx      ← Nav links to admin pages
│
├── pages/                ← Admin/TMS standalone pages
│   ├── AdminDashboard.jsx
│   ├── TournamentPage.jsx
│   ├── RacesPage.jsx
│   ├── JockeysPage.jsx
│   ├── RefereePage.jsx
│   ├── RegistrationsPage.jsx
│   └── Dashboard.jsx   ← TMS admin (gold theme, TournamentModule)
│
├── components/
│   ├── common/          ← Shared UI primitives
│   │   ├── Alert.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Divider.jsx
│   │   ├── Field.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── SectionTitle.jsx
│   │   ├── Select.jsx
│   │   ├── StatusPill.jsx
│   │   └── Textarea.jsx
│   ├── layout/
│   │   ├── Breadcrumb.jsx
│   │   └── Header.jsx
│   └── modules/
│       ├── TournamentModule.jsx
│       ├── RefereeModule.jsx
│       └── RegistrationModule.jsx
│
├── tms/                 ← Horse owner / jockey / host pages (Tailwind theme)
│   ├── AppContext.jsx   ← Auth context (login/logout/profiles/races/tournament)
│   ├── constants.js     ← Color tokens (BRAND, PAGE_BG, TEXT, STATUS_STYLES...)
│   ├── format.js        ← fmtDate, fmtDateTime, fmtCurrency, fmtMillions, initials
│   ├── tournament.js    ← TOURNAMENT_SEED
│   ├── races.js         ← RACES_SEED
│   ├── users.js         ← USERS, ROLE_LABELS
│   ├── referees.js      ← REFEREES_POOL
│   ├── notifications.js ← NOTIFICATIONS_SEED
│   ├── pages/
│   │   ├── LandingPage.jsx      ← Public home + login form
│   │   ├── HostHome.jsx        ← /host — AppShell + venue races
│   │   ├── OwnerDashboard.jsx  ← /owner — AppShell + horse list
│   │   ├── JockeyDashboard.jsx← /jockey — AppShell + entries
│   │   └── ProfilePage.jsx     ← /profile — AppShell + edit profile
│   └── components/
│       ├── layout/AppShell.jsx  ← Shared header/nav/notification shell
│       └── common/
│           ├── Alert.jsx
│           ├── Button.jsx
│           ├── Card.jsx
│           ├── Divider.jsx
│           ├── Field.jsx
│           ├── Input.jsx
│           ├── Modal.jsx
│           ├── SectionTitle.jsx
│           ├── Select.jsx
│           ├── SlidePanel.jsx
│           ├── StatusPill.jsx
│           └── Textarea.jsx
│
├── data/                ← Admin data (separate from TMS)
│   ├── tournament.js
│   ├── races.js
│   └── referees.js
│
└── utils/
    ├── constants.js     ← Admin constants (EMERALD, GOLD, STATUS_STYLES...)
    └── format.js       ← fmtDate, fmtDateTime, fmtCurrency, fmtMillions
```

---

## 4. Routing Conventions

**Route definitions** live in `App.jsx`. Two layout patterns:

### Pattern A — Admin Layout (Sidebar + Outlet)
Used for: all `/admin/*` routes
```
/admin              → AdminDashboard
/admin/tournament   → TournamentPage
/admin/races        → RacesPage
/admin/jockeys      → JockeysPage
/admin/referees     → RefereePage
/admin/registrations → RegistrationsPage
```

### Pattern B — AppShell Layout
Used for: `/host`, `/owner`, `/jockey`, `/profile`
Each page imports `AppShell` from `tms/components/layout/AppShell.jsx`.

### Pattern C — Public Page
`/` → `LandingPage` (no layout wrapper needed, has its own header)

**Default credentials for demo:**
| User | ID | Password | Route |
|---|---|---|---|
| Admin | U001 | admin123 | /admin |
| Host | U002 | host123 | /host |
| Jockey | U003 | jockey123 | /jockey |
| Owner | U006 | owner123 | /owner |

---

## 5. Design System

### Color Tokens (TMS / tms/constants.js)
```js
BRAND="#064e3b", BRAND_TEXT="#065f46", BRAND_LIGHT="#ecfdf5"
PAGE_BG="#f8fafc", TEXT="#111827", TEXT_MUTED="#6b7280"
BORDER="#e5e7eb"
```

### Color Tokens (Admin / utils/constants.js)
```js
EMERALD="#10B981", EMERALD_LIGHT="#D1FAE5"
GOLD="#B8860B", GOLD_LIGHT="#FFF8E7"
```

### Status Styles
```js
STATUS_STYLES = { Active, Draft, Closed, Upcoming, Running, Finished,
                  Cancelled, Pending, Approved, Rejected }
```

---

## 6. Component Patterns

### Common components (src/components/common/)
All use inline styles, no Tailwind. Accept standard props.
- `Button({ children, onClick, variant="primary", small, icon, disabled })`
- `Card({ children, style })` — white bg, border, rounded
- `Modal({ title, onClose, children, wide })` — fixed overlay
- `Field({ label, required, children, half })` — form label wrapper
- `Select({ value, onChange, options })` — styled native select
- `StatusPill({ status })` — colored badge
- `SectionTitle({ icon, children, sub })` — icon + title + subtitle
- `Alert({ type })` — info/warning/success/danger
- `Input({ value, onChange, type })` — form input
- `Textarea({ value, onChange, rows })` — form textarea

### TMS components (src/tms/components/)
Use Tailwind utility classes (e.g. `className="bg-white border..."`).

---

## 7. State Management

- **`AppContext`** (src/tms/AppContext.jsx): global auth + tournament data
  - `user`, `login(userId)`, `logout()`
  - `tournament`, `races`, `setRaces`
  - `profiles`, `notifications`, `getNotifications(user)`
- **`useState`** per-page for local UI state (modals, filters, forms)

---

## 8. Role-Based Access (5 Roles)

| Role | Key Features |
|---|---|
| **Admin** | All CRUD, publish results, assign referee, manage users |
| **Horse Owner** | Add horses, register to races, invite jockeys |
| **Jockey** | Accept/decline invites, view schedule, view stats |
| **Spectator** | View races (public), place predictions (WIN bet) |
| **Race Referee** | View assigned races, verify participants, record violations, submit report |

---

## 9. SRS Functional Requirements Mapping

### FR-AD (Admin) — Sprint 1-3
- FR-AD-01: User management page (`/admin/users`)
- FR-AD-02: Tournament management (`/admin/tournament`)
- FR-AD-03: Race management (`/admin/races`)
- FR-AD-04: Registration approval (`/admin/registrations`)
- FR-AD-05: Referee assignment (`/admin/referees`)
- FR-AD-06: Add approved registrations to race
- FR-AD-07: Publish race results + trigger prize calc
- FR-AD-08: Prediction stats (`/admin/predictions`)

### FR-HO (Horse Owner) — Sprint 1-2
- FR-HO-01/02: Register + login (use LandingPage)
- FR-HO-03: Add horse form (OwnerDashboard)
- FR-HO-04: Edit horse details
- FR-HO-05: Register horse to OPEN tournament
- FR-HO-06: Invite jockey
- FR-HO-07/08/09: View invite status + schedule + results

### FR-JO (Jockey) — Sprint 1-2
- FR-JO-01/02/03: View invites, accept/decline
- FR-JO-04/05/06: Horse info, schedule, personal stats

### FR-RE (Referee) — Sprint 2-3
- FR-RE-01: View assigned races (`/referee`)
- FR-RE-02: Verify participants
- FR-RE-03: Record violations
- FR-RE-04: Enter finishing order + times
- FR-RE-05: Submit + confirm Referee Report

### FR-SP (Spectator) — Sprint 1-2
- FR-SP-01: View races without login (LandingPage)
- FR-SP-02: Register account
- FR-SP-03/04/05: Place prediction (1 per race, locked after race starts)
- FR-SP-06/07: View WIN/LOSE results, notifications

---

## 10. Key Rules for This Project

1. **Always add `.jsx` extension** in all imports (React Router resolution)
2. **Admin pages use inline styles** — do NOT add Tailwind classes to admin pages
3. **TMS pages use Tailwind classes** — do NOT use inline styles
4. **Two separate data sources**: `tms/` pages use `AppContext` + `tms/` seed data; `pages/` use `src/data/` seed data
5. **No backend integration yet** — all data is mock/seed. Do not create fake API calls
6. **Two sidebar layouts**: green emerald (`/admin/*`) and the TMS AppShell (Tailwind)
7. **Build before committing** — run `npm run build` to verify no errors
8. **Use Tabler Icons** — `<i className="ti ti-{icon-name}" />` (loaded via CDN)
9. **Keep components focused** — one component per file, max ~300 lines
10. **Demo credentials must work** — U001/admin123 → /admin, U002/host123 → /host, etc.
