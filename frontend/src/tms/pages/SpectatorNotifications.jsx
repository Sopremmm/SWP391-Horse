import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import { fmtCurrency } from "../format.js";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import "./SpectatorNotifications.css";
import { TEST_NOTIFICATIONS } from "../data/spectatorTestData.js";

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "bet", label: "Bet Alerts" },
  { value: "race", label: "Race Results" },
];

const TYPE_ICONS = {
  BET_WIN: { bg: "rgba(0,66,37,0.1)", color: "#002a15", icon: "✓", label: "Win" },
  BET_LOSE: { bg: "rgba(186,26,26,0.1)", color: "#ba1a1a", icon: "✗", label: "Loss" },
  RACE_RESULT: { bg: "rgba(255,189,107,0.15)", color: "#7a5a00", icon: "🏁", label: "Result" },
  RACE_STARTING: { bg: "rgba(59,130,246,0.1)", color: "#1d4ed8", icon: "⏰", label: "Starting" },
  BET_SETTLED: { bg: "rgba(0,66,37,0.1)", color: "#002a15", icon: "💰", label: "Settled" },
  ODDS_UPDATE: { bg: "rgba(139,92,246,0.1)", color: "#6d28d9", icon: "📊", label: "Odds" },
  SYSTEM: { bg: "rgba(215,211,199,0.3)", color: "#555e58", icon: "★", label: "System" },
};

export default function SpectatorNotifications() {
  const { user, markRead, markAllRead } = useApp();
  const [activeTab, setActiveTab] = useState("all");
  // Use test data for demo, can be replaced with context notifications
  const [notifications, setNotifications] = useState(TEST_NOTIFICATIONS);
  const [toast, setToast] = useState(null);

  const getFiltered = () => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread") return notifications.filter((n) => !n.read);
    if (activeTab === "bet") return notifications.filter((n) => n.type === "BET_WIN" || n.type === "BET_LOSE" || n.type === "BET_SETTLED");
    if (activeTab === "race") return notifications.filter((n) => n.type === "RACE_RESULT" || n.type === "RACE_STARTING");
    return notifications;
  };

  const filtered = getFiltered();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (markRead) markRead(id);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (markAllRead) markAllRead();
    setToast({ title: "All Read", message: "All notifications marked as read." });
    setTimeout(() => setToast(null), 2500);
  };

  const dismissNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setToast({ title: "Dismissed", message: "Notification removed." });
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <SpectatorLayout>
      <div className="spectator">
        {/* HERO BANNER */}
        <section className="spec-notif__hero">
          <div className="shell">
            <div className="spec-notif__hero-inner">
              <div className="spec-notif__hero-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="spec-notif__hero-badge">{unreadCount}</span>
                )}
              </div>
              <div>
                <h1>Notifications</h1>
                <p>
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "You're all caught up!"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FILTER TABS + ACTIONS */}
        <div className="spec-notif__toolbar">
          <div className="shell">
            <div className="spec-notif__toolbar-inner">
              <div className="spectator__tabs">
                {FILTER_TABS.map((t) => (
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
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="spec-notif__mark-all"
                  onClick={markAllRead}
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <section className="spectator__section">
          <div className="shell">
            {filtered.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              <div className="spec-notif__list">
                {filtered.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    notification={notif}
                    onRead={markRead}
                    onDismiss={dismissNotification}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* TOAST */}
        {toast && (
          <div className="spectator__toast" role="status">
            <div className="spectator__toast__icon">✓</div>
            <div>
              <strong>{toast.title}</strong>
              <p>{toast.message}</p>
            </div>
          </div>
        )}
      </div>
    </SpectatorLayout>
  );
}

function NotificationCard({ notification: n, onRead, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const type = TYPE_ICONS[n.type] || TYPE_ICONS.SYSTEM;

  const handleClick = () => {
    if (!n.read) onRead(n.id);
    setExpanded((prev) => !prev);
  };

  return (
    <article
      className={`spec-notif__card ${!n.read ? "spec-notif__card--unread" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className="spec-notif__card-icon" style={{ background: type.bg, color: type.color }}>
        {type.icon}
      </div>

      <div className="spec-notif__card-body">
        <div className="spec-notif__card-header">
          <div>
            <span className="spec-notif__card-type">{type.label}</span>
            <strong className="spec-notif__card-title">{n.title}</strong>
          </div>
          <div className="spec-notif__card-meta">
            <span className="spec-notif__card-time">{n.timestamp}</span>
            {!n.read && <span className="spec-notif__unread-dot" />}
          </div>
        </div>

        <p className="spec-notif__card-message">{n.message}</p>

        {expanded && n.race && (
          <div className="spec-notif__card-detail">
            <div className="spec-notif__detail-row">
              <span>Race</span>
              <strong>{n.race}</strong>
            </div>
            {n.horse && (
              <div className="spec-notif__detail-row">
                <span>Horse</span>
                <strong>{n.horse}</strong>
              </div>
            )}
            {n.amount && (
              <div className="spec-notif__detail-row spec-notif__detail-row--highlight">
                <span>Amount</span>
                <strong style={{ color: "#7a5a00" }}>${n.amount}</strong>
              </div>
            )}
            {n.winner && (
              <div className="spec-notif__detail-row">
                <span>Winner</span>
                <strong>{n.winner}</strong>
              </div>
            )}
            {n.tournament && (
              <div className="spec-notif__detail-row">
                <span>Tournament</span>
                <strong>{n.tournament}</strong>
              </div>
            )}
            <div className="spec-notif__card-actions">
              {n.type === "BET_WIN" && (
                <Link to="/spectator/bets" className="spectator__btn spectator__btn--primary" onClick={(e) => e.stopPropagation()}>
                  View Bet History
                </Link>
              )}
              {n.type === "RACE_RESULT" && (
                <Link to="/spectator/tournaments" className="spectator__btn spectator__btn--secondary" onClick={(e) => e.stopPropagation()}>
                  Browse Tournaments
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="spec-notif__card-dismiss"
        onClick={(e) => onDismiss(n.id, e)}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </article>
  );
}

function EmptyState({ tab }) {
  const messages = {
    all: "No notifications yet. Check back soon!",
    unread: "All caught up! No unread notifications.",
    bet: "No bet alerts at the moment.",
    race: "No race results yet.",
  };
  return (
    <div className="spec-notif__empty">
      <div className="spec-notif__empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
      <h2>No Notifications</h2>
      <p>{messages[tab] || messages.all}</p>
    </div>
  );
}
