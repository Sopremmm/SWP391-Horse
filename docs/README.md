# Horse Racing Tournament Management System — Documentation

## Mục lục
1. [Tổng quan](#1-tổng-quan)
2. [Kiến trúc Frontend](#2-kiến-trúc-frontend)
3. [Danh sách trang theo Role](#3-danh-sách-trang-theo-role)
4. [API Endpoints (BE)](#4-api-endpoints-be)
5. [Database Schema](#5-database-schema)
6. [Các Sprint và Milestone](#6-các-sprint-và-milestone)
7. [Figma & Design](#7-figma--design)

---

## 1. Tổng quan

| Thông tin | Chi tiết |
|---|---|
| **Tên dự án** | Horse Racing Tournament Management System |
| **Khóa học** | SWP391 — FPT University |
| **Team** | Phát (PM) · Danh (BA) · Trung (Dev) · Tuấn (Tester) · Kiên (Designer) |
| **Stack FE** | React 18 + Vite + TailwindCSS v4 + React Router v7 |
| **Stack BE** | Spring Boot (Java 17) + MySQL 8 |
| **Deploy** | Vercel (FE) · Railway (BE) |

### Mục tiêu
Xây dựng hệ thống quản lý giải đua ngựa trực tuyến, phục vụ 5 nhóm người dùng: Admin, Chủ ngựa (Horse Owner), Người cưỡi (Jockey), Trọng tài (Referee), Khán giả (Spectator).

---

## 2. Kiến trúc Frontend

### 2.1 Cấu trúc thư mục

```
frontend/src/
├── main.jsx              # Entry point
├── App.jsx               # Hybrid router — tất cả routes định nghĩa ở đây
├── AppContext.jsx        # Global context (auth, tournament, races)
├── index.css             # Tailwind v4 + Google Fonts
│
├── admin/                # Admin layout (inline styles, green theme)
│   ├── Layout.jsx        # Sidebar + <Outlet />
│   └── Sidebar.jsx      # Navigation links
│
├── pages/                # Admin pages + standalone pages
│   ├── AdminDashboard.jsx
│   ├── TournamentPage.jsx
│   ├── RacesPage.jsx
│   ├── JockeysPage.jsx
│   ├── RefereePage.jsx
│   ├── RegistrationsPage.jsx
│   ├── UsersPage.jsx     # FR-AD-01: Quản lý user accounts
│   ├── PredictionsPage.jsx # FR-AD-08: Prediction statistics
│   ├── RaceResultPage.jsx  # FR-AD-07: Publish race result + prize
│   └── Dashboard.jsx    # TMS admin (gold theme)
│
├── components/
│   ├── common/          # Reusable UI primitives (inline styles)
│   │   ├── Alert.jsx, Button.jsx, Card.jsx, Divider.jsx
│   │   ├── Field.jsx, Input.jsx, Modal.jsx
│   │   ├── SectionTitle.jsx, Select.jsx, StatusPill.jsx, Textarea.jsx
│   ├── layout/          # Header, Breadcrumb
│   └── modules/         # TournamentModule, RefereeModule, RegistrationModule
│
├── tms/                 # Horse owner / jockey / host pages (Tailwind)
│   ├── AppContext.jsx   # Auth context
│   ├── constants.js     # Color tokens (BRAND, PAGE_BG...)
│   ├── format.js        # fmtDate, fmtDateTime...
│   ├── tournament.js    # Seed data
│   ├── races.js         # Seed data
│   ├── users.js        # Seed data (USERS, ROLE_LABELS)
│   ├── referees.js      # Seed data
│   ├── notifications.js # Seed data
│   ├── pages/
│   │   ├── LandingPage.jsx     # Public home + login (/)
│   │   ├── HostHome.jsx        # /host
│   │   ├── OwnerDashboard.jsx    # /owner
│   │   ├── JockeyDashboard.jsx  # /jockey
│   │   ├── ProfilePage.jsx      # /profile
│   │   ├── SpectatorDashboard.jsx # /spectator (FR-SP)
│   │   └── RefereeDashboard.jsx   # /referee (FR-RE)
│   └── components/
│       ├── layout/AppShell.jsx  # Shared header/nav shell
│       └── common/               # Tailwind versions of common components
│
├── data/                # Admin seed data
│   ├── tournament.js
│   ├── races.js
│   └── referees.js
│
└── utils/
    ├── constants.js     # Admin color tokens (EMERALD, GOLD...)
    └── format.js       # fmtDate, fmtDateTime...
```

### 2.2 Routing

| Route | Layout | Mô tả |
|---|---|---|
| `/` | LandingPage (tự có header) | Trang chủ public |
| `/login` | — | Redirect đến LandingPage login form |
| `/admin` | AdminLayout (green sidebar) | Dashboard admin |
| `/admin/tournament` | AdminLayout | Quản lý giải đấu |
| `/admin/races` | AdminLayout | Quản lý cuộc đua |
| `/admin/jockeys` | AdminLayout | Mời jockey |
| `/admin/referees` | AdminLayout | Gán trọng tài |
| `/admin/registrations` | AdminLayout | Duyệt đăng ký |
| `/admin/users` | AdminLayout | Quản lý user |
| `/admin/results` | AdminLayout | Công bố kết quả |
| `/admin/predictions` | AdminLayout | Thống kê dự đoán |
| `/host` | AppShell (Tailwind) | Trang chủ Host |
| `/owner` | AppShell | Dashboard chủ ngựa |
| `/jockey` | AppShell | Dashboard jockey |
| `/referee` | AppShell | Dashboard trọng tài |
| `/spectator` | AppShell | Dashboard khán giả |
| `/profile` | AppShell | Hồ sơ cá nhân |
| `/app` | Dashboard (gold theme) | TMS Dashboard cũ |

### 2.3 Demo Credentials

| Role | User ID | Password | Route |
|---|---|---|---|
| Admin | U001 | admin123 | /admin |
| Host | U002 | host123 | /host |
| Jockey | U003 | jockey123 | /jockey |
| Owner | U006 | owner123 | /owner |

---

## 3. Danh sách trang theo Role

### 3.1 Admin (FR-AD)

| FR | Trang | Route | Sprint |
|---|---|---|---|
| FR-AD-01 | User Management | `/admin/users` | Sprint 1 |
| FR-AD-02 | Tournament Management | `/admin/tournament` | Sprint 1 |
| FR-AD-03 | Race Management | `/admin/races` | Sprint 2 |
| FR-AD-04 | Registration Approval | `/admin/registrations` | Sprint 2 |
| FR-AD-05 | Referee Assignment | `/admin/referees` | Sprint 2 |
| FR-AD-06 | Add registrations to race | `/admin/races` | Sprint 2 |
| FR-AD-07 | Publish Result + Prize | `/admin/results` | Sprint 3 |
| FR-AD-08 | Prediction Statistics | `/admin/predictions` | Sprint 3 |

### 3.2 Horse Owner (FR-HO)

| FR | Trang | Route | Sprint |
|---|---|---|---|
| FR-HO-01/02 | Register + Login | `/` (LandingPage) | Sprint 1 |
| FR-HO-03 | Add Horse | `/owner` (tab: My Horses) | Sprint 1 |
| FR-HO-04 | Edit Horse | `/owner` | Sprint 1 |
| FR-HO-05 | Register Horse to Tournament | `/owner` (tab: Register) | Sprint 1 |
| FR-HO-06 | Invite Jockey | `/owner` (tab: Invitations) | Sprint 2 |
| FR-HO-07 | View Invitation Status | `/owner` (tab: Invitations) | Sprint 2 |
| FR-HO-08 | Race Schedule | `/owner` (tab: Schedule) | Sprint 2 |
| FR-HO-09 | Results + Leaderboard | `/owner` (tab: Results) | Sprint 3 |

### 3.3 Jockey (FR-JO)

| FR | Trang | Route | Sprint |
|---|---|---|---|
| FR-JO-01 | Register (with license) | `/` (LandingPage) | Sprint 1 |
| FR-JO-02 | Pending Invitations | `/jockey` (tab: Invitations) | Sprint 2 |
| FR-JO-03 | Accept / Decline | `/jockey` | Sprint 2 |
| FR-JO-04 | Horse Info | `/jockey` (Race Detail) | Sprint 2 |
| FR-JO-05 | Race Schedule | `/jockey` (tab: Schedule) | Sprint 2 |
| FR-JO-06 | Personal Stats | `/jockey` (tab: Stats) | Sprint 3 |

### 3.4 Race Referee (FR-RE)

| FR | Trang | Route | Sprint |
|---|---|---|---|
| FR-RE-01 | Assigned Races | `/referee` | Sprint 2 |
| FR-RE-02 | Verify Participants | `/referee` (Race Detail) | Sprint 2 |
| FR-RE-03 | Record Violations | `/referee` (Race Detail) | Sprint 2 |
| FR-RE-04 | Enter Finishing Order | `/referee` (Race Detail) | Sprint 3 |
| FR-RE-05 | Submit Referee Report | `/referee` (Race Detail) | Sprint 3 |

### 3.5 Spectator (FR-SP)

| FR | Trang | Route | Sprint |
|---|---|---|---|
| FR-SP-01 | View Races (public) | `/` | Sprint 1 |
| FR-SP-02 | Register Account | `/` (Sign Up) | Sprint 1 |
| FR-SP-03 | Place Prediction | `/spectator` | Sprint 2 |
| FR-SP-04 | One prediction per race | `/spectator` | Sprint 2 |
| FR-SP-05 | Lock after race starts | `/spectator` | Sprint 2 |
| FR-SP-06 | WIN/LOSE Result | `/spectator` (tab: My Predictions) | Sprint 3 |
| FR-SP-07 | Notifications | In-app + email | Sprint 3 |

---

## 4. API Endpoints (BE)

*(Tài liệu này sẽ được cập nhật sau khi Backend hoàn thành API contract)*

### Authentication
- `POST /api/auth/register` — Đăng ký tài khoản
- `POST /api/auth/login` — Đăng nhập, trả về JWT
- `POST /api/auth/refresh` — Refresh token

### Users
- `GET /api/users` — Danh sách user (Admin)
- `PUT /api/users/{id}` — Cập nhật user (Admin)
- `DELETE /api/users/{id}` — Vô hiệu hóa user (Admin)

### Tournament
- `GET /api/tournaments` — Danh sách giải đấu
- `POST /api/tournaments` — Tạo giải đấu (Admin)
- `PUT /api/tournaments/{id}` — Cập nhật giải đấu (Admin)
- `DELETE /api/tournaments/{id}` — Xóa giải đấu (Admin)

### Race
- `GET /api/races` — Danh sách race
- `POST /api/races` — Tạo race (Admin)
- `PUT /api/races/{id}` — Cập nhật race (Admin)
- `POST /api/races/{id}/result` — Công bố kết quả (Admin)

### Registration
- `POST /api/registrations` — Đăng ký horse (Owner)
- `GET /api/registrations` — Danh sách đăng ký
- `PUT /api/registrations/{id}/approve` — Duyệt (Admin)
- `PUT /api/registrations/{id}/reject` — Từ chối (Admin)

### Jockey Invitation
- `POST /api/invitations` — Mời jockey (Owner)
- `GET /api/invitations` — Danh sách lời mời
- `PUT /api/invitations/{id}/accept` — Chấp nhận (Jockey)
- `PUT /api/invitations/{id}/decline` — Từ chối (Jockey)

### Prediction
- `POST /api/predictions` — Đặt cược (Spectator)
- `GET /api/predictions/my` — Kết quả dự đoán của tôi
- `GET /api/predictions/stats/{raceId}` — Thống kê (Admin)

### Notifications
- `GET /api/notifications` — Danh sách thông báo
- `PUT /api/notifications/{id}/read` — Đánh dấu đã đọc

---

## 5. Database Schema

*(Tham khảo ERD và schema SQL trong backend)*

### Bảng chính
- `users` — Tài khoản người dùng (5 roles)
- `tournaments` — Giải đấu
- `races` — Cuộc đua
- `registrations` — Đăng ký horse + jockey pair
- `invitations` — Lời mời jockey
- `predictions` — Dự đoán của spectator
- `violations` — Vi phạm của trọng tài ghi nhận
- `referee_reports` — Báo cáo trọng tài
- `notifications` — Thông báo

---

## 6. Các Sprint và Milestone

| Sprint | Thời gian | Mục tiêu | Deliverables |
|---|---|---|---|
| **Sprint 1** | Tuần 1-3 | Auth + Core structure | Login/Register, Admin Dashboard, Tournament CRUD, Landing Page |
| **Sprint 2** | Tuần 4-6 | Registration + Invitation | Horse reg, Jockey invite, Race scheduling, Predictions |
| **Sprint 3** | Tuần 7-10 | Results + Polish | Race results, Prize calc, Leaderboard, Notifications |

---

## 7. Figma & Design

Link Figma: *(Cập nhật bởi Kiên — Designer)*

### Design Tokens
```
Primary:       #064e3b (BRAND green)
Primary Text:  #065f46
Primary Light: #ecfdf5
Secondary:     #B8860B (GOLD)
Background:   #f8fafc
Surface:      #ffffff
Text:         #111827
Text Muted:   #6b7280
Border:       #e5e7eb
```

---

## 8. Quy ước Code

### Naming
- Component files: `PascalCase.jsx` (vd: `TournamentPage.jsx`)
- Utility files: `camelCase.js` (vd: `format.js`, `constants.js`)
- CSS class: `kebab-case` (vd: `text-lg font-bold`)

### Styling
- **Admin pages** (`admin/`, `pages/`): inline styles only
- **TMS pages** (`tms/`): Tailwind utility classes only
- **Shared components** (`components/common/`): inline styles

### Icons
Dùng **Tabler Icons** qua CDN:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.x/dist/tabler-icons.min.css" />
```
```jsx
<i className="ti ti-{icon-name}" />
```

### Import Extension
Luôn thêm `.jsx` extension cho import React component:
```js
import LandingPage from './tms/pages/LandingPage.jsx' // ✅
import LandingPage from './tms/pages/LandingPage'     // ❌
```
