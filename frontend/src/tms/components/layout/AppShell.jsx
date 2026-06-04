import { useState } from "react";
import { useApp } from "../../AppContext.jsx";
import { ROLE_LABELS } from "../../users.js";
import {
  BRAND,
  BRAND_BORDER,
  BRAND_LIGHT,
  BRAND_TEXT,
  BORDER,
  PAGE_BG,
  SURFACE,
  TEXT,
  TEXT_MUTED,
  TEXT_SUBTLE,
} from "../../constants.js";
import { initials } from "../../format.js";

function NotifItem({ n, onRead }) {
  const colors = {
    approved:     { bg: BRAND_LIGHT, border: BRAND_BORDER, icon: "circle-check", iconColor: BRAND_TEXT },
    rejected:     { bg: "#fee2e2",   border: "#fca5a5",   icon: "circle-x",     iconColor: "#991b1b" },
    pending:      { bg: "#fef9c3",   border: "#fde047",   icon: "clock",        iconColor: "#713f12" },
    race_reminder:{ bg: "#eff6ff",   border: "#bfdbfe",   icon: "alert-circle", iconColor: "#1e40af" },
    info:         { bg: "#f5f3ff",   border: "#c4b5fd",   icon: "info-circle",  iconColor: "#5b21b6" },
  };
  const c = colors[n.type] || colors.info;

  return (
    <button
      type="button"
      onClick={() => onRead(n.id)}
      className="w-full text-left rounded-xl p-3 flex gap-3 items-start cursor-pointer font-sans border transition-colors"
      style={{
        background: n.read ? SURFACE : c.bg,
        borderColor: n.read ? BORDER : c.border,
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border"
        style={{
          background: n.read ? "#f3f4f6" : c.bg,
          borderColor: n.read ? "#e5e7eb" : c.border,
        }}
      >
        <i className={`ti ti-${c.icon} text-base`} style={{ color: n.read ? TEXT_SUBTLE : c.iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold mb-0.5" style={{ color: n.read ? TEXT_MUTED : TEXT }}>
          {n.title}
        </div>
        <div className="text-xs text-slate-500 leading-relaxed">{n.body}</div>
        <div className="text-[11px] mt-1" style={{ color: TEXT_SUBTLE }}>{n.time}</div>
      </div>
      {!n.read && (
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: BRAND }} />
      )}
    </button>
  );
}

export default function AppShell({
  children,
  page,
  setPage,
  nav = [],
  subtitle,
  showNav = true,
  showBreadcrumb = false,
  pendingCount = 0,
  breadcrumb,
}) {
  const { user, logout, goProfile, getNotifications, markRead, markAllRead } = useApp();
  const [showInbox, setShowInbox] = useState(false);

  const allNotifs = getNotifications(user);
  const unread = allNotifs.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG, color: TEXT }}>
      {/* HEADER */}
      <header
        className="sticky top-0 z-50 bg-white border-b border-slate-200 flex items-center gap-4 px-7"
        style={{ height: 64, boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}
      >
        <div className="flex items-center gap-2.5 mr-10 flex-shrink-0">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 font-sans"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ background: BRAND, boxShadow: "0 1px 2px rgba(6, 78, 59, 0.25)" }}
            >
              <i className="ti ti-trophy text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-800 tracking-wider">RACING TMS</span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
                  style={{ background: BRAND_LIGHT, color: BRAND_TEXT, border: `1px solid ${BRAND_BORDER}` }}
                >
                  PRO
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {subtitle || (user ? ROLE_LABELS[user.role]?.toUpperCase() : "")}
              </div>
            </div>
          </button>
        </div>

        <div className="flex-1" />
        {showNav && nav.length > 0 && page && setPage && (
          <nav className="flex gap-1.5">
            {nav.map((n) => {
              const active = page === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setPage(n.id)}
                  className="relative px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer font-sans"
                  style={{
                    background: active ? BRAND : SURFACE,
                    color: active ? "#fff" : TEXT_MUTED,
                    borderColor: active ? BRAND : BORDER,
                    boxShadow: active ? "0 1px 2px rgba(6, 78, 59, 0.2)" : "none",
                  }}
                >
                  <i className={`ti ti-${n.icon} text-sm`} />
                  {n.label}
                  {n.id === "inbox" && unread > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: "#ef4444", border: `2px solid ${SURFACE}` }}
                    >
                      {unread}
                    </span>
                  )}
                  {n.pendingCount != null && n.pendingCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: "#ef4444", border: `2px solid ${SURFACE}` }}
                    >
                      {n.pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2.5 flex-shrink-0 ml-2">
          <button
            type="button"
            onClick={() => setShowInbox(!showInbox)}
            className="relative p-2.5 rounded-lg border flex items-center cursor-pointer font-sans transition-all"
            style={{
              background: showInbox ? BRAND_LIGHT : "#fff",
              borderColor: showInbox ? BRAND_BORDER : BORDER,
              color: TEXT,
            }}
          >
            <i className="ti ti-bell text-base" style={{ color: TEXT_MUTED }} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: "#ef4444" }}>
                {unread}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={goProfile}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-transparent cursor-pointer font-sans transition-all"
            style={{ borderColor: BORDER }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{ background: BRAND_LIGHT, border: `1px solid ${BRAND_BORDER}`, color: BRAND_TEXT }}
            >
              {user ? initials(user.name) : "?"}
            </div>
            <span className="text-xs font-medium" style={{ color: TEXT_MUTED }}>
              {user?.name.split(" ")[0]}
            </span>
          </button>

          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="p-2 rounded-lg border bg-transparent cursor-pointer"
            style={{ borderColor: BORDER, color: TEXT_SUBTLE }}
          >
            <i className="ti ti-logout text-base" />
          </button>
        </div>
      </header>

      {/* Inbox dropdown */}
      {showInbox && (
        <div
          className="fixed top-[68px] right-7 w-[420px] bg-white border border-slate-200 rounded-2xl shadow-xl z-[9999] overflow-hidden flex flex-col"
          style={{ maxHeight: "calc(100vh - 80px)" }}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-800">Notifications</span>
            {unread > 0 && (
              <button type="button" onClick={markAllRead} className="bg-transparent border-none cursor-pointer text-xs font-semibold font-sans" style={{ color: BRAND }}>
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1 p-2 flex flex-col gap-1.5" style={{ maxHeight: 480 }}>
            {allNotifs.length === 0 && (
              <p className="text-center text-slate-400 py-6 text-sm">No notifications yet.</p>
            )}
            {allNotifs.map((n) => (
              <NotifItem key={n.id} n={n} onRead={markRead} />
            ))}
          </div>
        </div>
      )}

      {showBreadcrumb && breadcrumb}

      <main className="max-w-5xl mx-auto px-6 py-7">{children}</main>
    </div>
  );
}
