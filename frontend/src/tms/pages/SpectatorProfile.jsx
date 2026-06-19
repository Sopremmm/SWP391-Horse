import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import { fmtCurrency } from "../format.js";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import "./SpectatorProfile.css";
import { TEST_SPECTATOR_STATS, TEST_NOTIFICATIONS, TEST_BETS } from "../data/spectatorTestData.js";
import { calculateBettingStats } from "../../data/bets.js";

const PROFILE_TABS = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
];

const SETTING_SECTIONS = [
  {
    title: "Account",
    fields: [
      { label: "Display Name", value: "", type: "text" },
      { label: "Email", value: "", type: "email" },
      { label: "Phone", value: "", type: "tel" },
    ],
  },
  {
    title: "Notifications",
    fields: [
      { label: "Bet Results", value: true, type: "toggle" },
      { label: "Race Start Alerts", value: true, type: "toggle" },
      { label: "Promotional Offers", value: false, type: "toggle" },
    ],
  },
  {
    title: "Preferences",
    fields: [
      { label: "Currency", value: "USD ($)", type: "select" },
      { label: "Odds Format", value: "Decimal", type: "select" },
    ],
  },
];

export default function SpectatorProfile() {
  const { user, bets: userBets } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const [toggleState, setToggleState] = useState(() => {
    const init = {};
    SETTING_SECTIONS.forEach((s) =>
      s.fields.forEach((f) => {
        if (f.type === "toggle") init[f.label] = f.value;
      })
    );
    return init;
  });

  // Use user data if available, otherwise use test data
  const displayUser = user || {
    id: 'U009',
    name: 'Lisa Spectator',
    email: 'lisa.spectator@heritageracing.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  };

  // Use context bets or test data
  const profileBets = userBets && userBets.length > 0 ? userBets : TEST_BETS;
  const userBetsFiltered = user ? profileBets.filter(b => b.userId === user.id) : profileBets;

  // Calculate stats
  const stats = user ? calculateBettingStats(user.id) : {
    totalBets: userBetsFiltered.length,
    activeBets: userBetsFiltered.filter(b => b.status === 'Pending').length,
    settledBets: userBetsFiltered.filter(b => b.status !== 'Pending').length,
    wonBets: userBetsFiltered.filter(b => b.status === 'Won').length,
    totalStaked: userBetsFiltered.reduce((s, b) => s + b.stake, 0),
    totalWon: userBetsFiltered.filter(b => b.status === 'Won').reduce((s, b) => s + (b.actualPayout || 0), 0),
  };

  const wins = stats.wonBets + userBetsFiltered.filter(b => b.status === 'Settled').length;
  const winRate = userBetsFiltered.length > 0 ? Math.round((wins / userBetsFiltered.length) * 100) + '%' : '0%';

  // Generate recent activity from bets and notifications
  const recentActivity = [
    ...userBetsFiltered.slice(0, 3).map(b => ({
      id: `act-bet-${b.id}`,
      type: b.status === 'Won' ? 'bet_win' : b.status === 'Lost' ? 'bet_lose' : 'bet_placed',
      title: b.status === 'Won' ? `Bet Won — ${fmtCurrency(b.actualPayout || b.potentialPayout)}` : b.status === 'Lost' ? 'Bet Settled' : `Bet Placed — ${fmtCurrency(b.stake)}`,
      desc: `${b.raceName} · ${b.horseName}`,
      time: new Date(b.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: b.status === 'Won' ? b.actualPayout : null,
    })),
    ...TEST_NOTIFICATIONS.slice(0, 2).map(n => ({
      id: `act-notif-${n.id}`,
      type: n.type === 'RACE_RESULT' ? 'race_result' : 'system',
      title: n.title,
      desc: n.message,
      time: n.timestamp,
    })),
  ];

  return (
    <SpectatorLayout>
      <div className="spectator">
        {/* HERO BANNER */}
        <section className="spec-profile__hero">
          <div className="spec-profile__hero-bg" />
          <div className="shell">
            <div className="spec-profile__hero-inner">
              <div className="spec-profile__avatar-wrap">
                <img
                  src={displayUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80'}
                  alt={displayUser.name}
                  className="spec-profile__avatar"
                />
                <span className="spec-profile__avatar-badge">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1l1.5 4.5H13l-3.7 2.7 1.4 4.3L7 9.8 3.3 12.5l1.4-4.3L1 5.5h4.5L7 1z" fill="#ffdea5" />
                  </svg>
                  SPECTATOR
                </span>
              </div>
              <div className="spec-profile__hero-info">
                <h1>{displayUser.name}</h1>
                <p className="spec-profile__hero-email">{displayUser.email}</p>
                <div className="spec-profile__hero-tags">
                  <span className="spec-profile__tag">Premium Member</span>
                  <span className="spec-profile__tag spec-profile__tag--outline">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="spec-profile__stats">
          <div className="shell">
            <div className="spec-profile__stats-grid">
              <StatCell label="Total Bets" value={String(stats.totalBets)} />
              <StatCell label="Active Bets" value={String(stats.activeBets)} accent />
              <StatCell label="Wins" value={String(wins)} />
              <StatCell label="Total Staked" value={`${fmtCurrency(stats.totalStaked)}`} />
              <StatCell label="Lifetime Payouts" value={fmtCurrency(stats.totalWon)} gold />
              <StatCell label="Win Rate" value={winRate} />
            </div>
          </div>
        </section>

        {/* NAV TABS */}
        <div className="shell">
          <div className="spec-profile__tabs">
            {PROFILE_TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setActiveTab(t.value)}
                className={
                  activeTab === t.value
                    ? "spectator__tab spectator__tab--active"
                    : "spectator__tab"
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <section className="spectator__section">
          <div className="shell">
            {activeTab === "overview" && (
              <OverviewTab
                recentActivity={recentActivity}
                recentBets={userBetsFiltered.slice(0, 3)}
              />
            )}
            {activeTab === "activity" && (
              <ActivityTab activity={recentActivity} bets={userBetsFiltered} />
            )}
            {activeTab === "settings" && (
              <SettingsTab
                sections={SETTING_SECTIONS}
                toggleState={toggleState}
                onToggle={(label) =>
                  setToggleState((prev) => ({ ...prev, [label]: !prev[label] }))
                }
              />
            )}
          </div>
        </section>
      </div>
    </SpectatorLayout>
  );
}

function StatCell({ label, value, accent, gold }) {
  return (
    <div className={`spec-profile__stat ${gold ? "spec-profile__stat--gold" : ""}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function OverviewTab({ recentActivity, recentBets }) {
  return (
    <div className="spec-profile__overview">
      {/* Left: Recent Activity */}
      <div className="spec-profile__panel">
        <div className="spec-profile__panel-head">
          <h2>Recent Activity</h2>
          <Link to="/spectator/profile?tab=activity" className="spec-profile__panel-link">
            View All
          </Link>
        </div>
        <div className="spec-profile__activity-list">
          {recentActivity.map((a) => (
            <ActivityRow key={a.id} activity={a} />
          ))}
        </div>
      </div>

      {/* Right: Quick Stats + Recent Bets */}
      <div className="spec-profile__panel-stack">
        <div className="spec-profile__panel">
          <div className="spec-profile__panel-head">
            <h2>Recent Bets</h2>
            <Link to="/spectator/bets" className="spec-profile__panel-link">
              Full History
            </Link>
          </div>
          <div className="spec-profile__recent-bets">
            {recentBets.map((b) => (
              <div key={b.id} className="spec-profile__recent-bet">
                <img src={b.raceImage} alt="" className="spec-profile__recent-bet__img" />
                <div className="spec-profile__recent-bet__info">
                  <strong>{b.raceName}</strong>
                  <span>{b.horseName}</span>
                </div>
                <div className="spec-profile__recent-bet__amount">
                  <span className={`spec-profile__status spec-profile__status--${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                  <strong>${(b.actualPayout || b.potentialPayout || 0).toLocaleString()}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="spec-profile__panel spec-profile__panel--dark">
          <h2 className="spec-profile__panel-title--white">Quick Actions</h2>
          <div className="spec-profile__quick-actions">
            <Link to="/spectator/tournaments" className="spec-profile__quick-action">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Browse Races
            </Link>
            <Link to="/spectator/live" className="spec-profile__quick-action">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10,8 16,12 10,16" fill="currentColor" />
              </svg>
              Live Racing
            </Link>
            <Link to="/spectator/horses" className="spec-profile__quick-action">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Horse Registry
            </Link>
            <Link to="/spectator/jockeys" className="spec-profile__quick-action">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Jockeys
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ activity }) {
  const icons = {
    bet_win: { bg: "rgba(0,66,37,0.1)", color: "#002a15", icon: "✓" },
    race_result: { bg: "rgba(0,66,37,0.1)", color: "#002a15", icon: "🏁" },
    bet_placed: { bg: "rgba(255,222,165,0.2)", color: "#7a5a00", icon: "↓" },
    bet_lose: { bg: "rgba(186,26,26,0.1)", color: "#ba1a1a", icon: "✗" },
    system: { bg: "rgba(215,211,199,0.3)", color: "#555e58", icon: "★" },
  };
  const style = icons[activity.type] || icons.system;
  return (
    <div className="spec-profile__activity-row">
      <div
        className="spec-profile__activity-icon"
        style={{ background: style.bg, color: style.color }}
      >
        {style.icon}
      </div>
      <div className="spec-profile__activity-info">
        <strong>{activity.title}</strong>
        <span>{activity.desc}</span>
      </div>
      <span className="spec-profile__activity-time">{activity.time}</span>
    </div>
  );
}

function ActivityTab({ activity, bets }) {
  const allItems = [
    ...activity.map((a) => ({ ...a, kind: "activity" })),
    ...bets.map((b) => ({ ...b, kind: "bet", title: `Bet on ${b.horseName}`, desc: b.raceName })),
  ].sort((a, b) => {
    const tA = a.placedAt ? new Date(a.placedAt) : new Date();
    const tB = b.placedAt ? new Date(b.placedAt) : new Date();
    return tB - tA;
  });

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontFamily: '"EB Garamond", Georgia, serif', fontSize: "1.6rem", fontWeight: 500, color: "#002a15" }}>
        All Activity
      </h2>
      <div className="spec-profile__activity-feed">
        {allItems.map((item, i) => (
          <div key={item.id || i} className="spec-profile__feed-item">
            <div
              className="spec-profile__feed-dot"
              style={{ background: item.kind === "bet" ? "#ffbd6b" : "#002a15" }}
            />
            <div className="spec-profile__feed-content">
              <strong>{item.title}</strong>
              <span>{item.desc || item.raceName}</span>
              <time>{item.placedAt
                ? new Date(item.placedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : item.time}</time>
            </div>
            {item.payout && (
              <span className="spec-profile__feed-amount">${(item.actualPayout || item.potentialPayout || 0).toLocaleString()}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ sections, toggleState, onToggle }) {
  return (
    <div className="spec-profile__settings">
      {sections.map((section) => (
        <div key={section.title} className="spec-profile__settings-section">
          <h2>{section.title}</h2>
          <div className="spec-profile__settings-fields">
            {section.fields.map((field) => (
              <div key={field.label} className="spec-profile__field">
                <label>{field.label}</label>
                {field.type === "toggle" ? (
                  <button
                    type="button"
                    className={`spec-profile__toggle ${toggleState[field.label] ? "spec-profile__toggle--on" : ""}`}
                    onClick={() => onToggle(field.label)}
                    aria-pressed={toggleState[field.label]}
                  >
                    <span className="spec-profile__toggle-thumb" />
                  </button>
                ) : field.type === "select" ? (
                  <select className="spec-profile__select">
                    <option>{field.value}</option>
                  </select>
                ) : (
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="spec-profile__input"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="spec-profile__settings-actions">
        <button type="button" className="spectator__btn spectator__btn--primary">
          Save Changes
        </button>
        <button type="button" className="spectator__btn spectator__btn--secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
