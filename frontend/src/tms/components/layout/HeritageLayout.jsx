import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../AppContext.jsx";
import { ROLE_LABELS } from "../../users.js";

export const FONT_SERIF = '"EB Garamond", Georgia, serif';
const FONT_SANS = "Inter, ui-sans-serif, system-ui, sans-serif";

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M13.83 15 8.58 9.75a5.43 5.43 0 0 1-3.16 1.08A5.23 5.23 0 0 1 0 5.42 5.23 5.23 0 0 1 5.42 0a5.23 5.23 0 0 1 5.41 5.42 5.43 5.43 0 0 1-1.08 3.16L15 13.83 13.83 15ZM5.42 9.17A3.62 3.62 0 0 0 9.17 5.42a3.62 3.62 0 0 0-3.75-3.75 3.62 3.62 0 0 0-3.75 3.75 3.62 3.62 0 0 0 3.75 3.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Build role-aware nav map
const NAV_BY_ROLE = {
  spectator: [
    { to: "/spectator/home", label: "Home" },
    { to: "/spectator/live", label: "Live Racing" },
    { to: "/spectator/tournaments", label: "Tournaments" },
    { to: "/spectator/horses", label: "Horse Registry" },
    { to: "/spectator/jockeys", label: "Jockeys" },
    { to: "/spectator/bets", label: "My Bets" },
    { to: "/spectator/notifications", label: "Notifications" },
    { to: "/spectator/profile", label: "Profile" },
  ],
  host: [
    { to: "/host", label: "Overview" },
    { to: "/spectator/tournaments", label: "Tournaments" },
    { to: "/spectator/horses", label: "Horses" },
  ],
  owner: [
    { to: "/owner", label: "Overview" },
    { to: "/spectator/horses", label: "Horse Registry" },
    { to: "/spectator/tournaments", label: "Tournaments" },
  ],
  jockey: [
    { to: "/jockey", label: "My Races" },
    { to: "/spectator/jockeys", label: "Jockeys" },
    { to: "/spectator/tournaments", label: "Tournaments" },
  ],
  referee: [
    { to: "/referee", label: "My Races" },
    { to: "/spectator/tournaments", label: "Tournaments" },
  ],
  admin: [
    { to: "/admin", label: "Admin Panel" },
  ],
};

const DASHBOARD_BY_ROLE = {
  spectator: "/spectator/home",
  host: "/host",
  owner: "/owner",
  jockey: "/jockey",
  referee: "/referee",
  admin: "/admin",
};

export default function HeritageLayout({ children, role, subtitle }) {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const effectiveRole = role || user?.role || "spectator";
  const nav = useMemo(() => NAV_BY_ROLE[effectiveRole] || NAV_BY_ROLE.spectator, [effectiveRole]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to) => {
    if (to === "/admin" || to === "/host" || to === "/owner" || to === "/jockey" || to === "/referee" || to === "/spectator") {
      return location.pathname === to;
    }
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const homeLink = DASHBOARD_BY_ROLE[effectiveRole] || "/";

  return (
    <div className="min-h-screen font-sans" style={{ background: "#f7f6f1", color: "#002a15", position: "relative", zIndex: 1 }}>
      <header
        className="fixed inset-x-0 top-0 z-40 bg-white"
        style={{
          height: 80,
          borderBottom: scrolled ? "1px solid #d7d3c7" : "1px solid rgba(215,211,199,0.4)",
          boxShadow: scrolled ? "0 2px 14px rgba(0,0,0,0.07)" : "none",
          transition: "box-shadow 0.2s, border-color 0.2s",
        }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex items-center justify-between gap-6"
          style={{ height: 80 }}
        >
          <div className="flex items-center gap-12 min-w-0">
            <Link
              to={homeLink}
              className="flex-shrink-0 no-underline"
              style={{
                color: "#002a15",
                fontSize: "1.3rem",
                fontWeight: 600,
                fontFamily: '"EB Garamond", Georgia, serif',
                letterSpacing: "0.01em",
              }}
            >
              Heritage Racing
            </Link>
            <nav
              className="hidden md:flex items-center"
              style={{ gap: "clamp(18px, 2.5vw, 32px)" }}
              aria-label="Primary navigation"
            >
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="no-underline transition-colors"
                  style={{
                    padding: "4px 0",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isActive(n.to) ? "#002a15" : "#555e58",
                    borderBottom: isActive(n.to) ? "2px solid #002a15" : "2px solid transparent",
                  }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center" style={{ gap: "clamp(12px, 1.8vw, 20px)" }}>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((s) => !s)}
              className="inline-grid place-items-center bg-transparent border-0 cursor-pointer"
              style={{ width: 40, height: 40, color: "#002a15" }}
            >
              <SearchIcon />
            </button>
            {user ? (
              <div className="flex items-center" style={{ gap: 12 }}>
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center no-underline"
                  style={{ gap: 10, color: "#002a15" }}
                >
                  <span
                    className="grid place-items-center"
                    style={{
                      width: 36, height: 36, borderRadius: 999,
                      background: "#002a15", color: "#ffdea5",
                      fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em",
                    }}
                  >
                    {user.name?.split(" ").map((s) => s[0]).slice(0, 2).join("") || "U"}
                  </span>
                  <span className="flex flex-col" style={{ lineHeight: 1.15 }}>
                    <span className="text-xs font-semibold hidden lg:inline">{user.name}</span>
                    {subtitle ? (
                      <span className="text-[0.66rem] font-bold uppercase tracking-wider hidden lg:inline" style={{ color: "#747b75" }}>
                        {subtitle}
                      </span>
                    ) : user.role ? (
                      <span className="text-[0.66rem] font-bold uppercase tracking-wider hidden lg:inline" style={{ color: "#747b75" }}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    ) : null}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="cursor-pointer border-0"
                  style={{
                    minHeight: 40,
                    padding: "0 20px",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#002a15",
                    background: "transparent",
                    boxShadow: "inset 0 0 0 1px rgba(0,42,21,0.25)",
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/")}
                className="uppercase inline-flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  minHeight: 44,
                  padding: "0 24px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "#002a15",
                  background: "transparent",
                  boxShadow: "inset 0 0 0 1px rgba(0,42,21,0.25)",
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {searchOpen && (
          <div
            className="absolute inset-x-0 bg-white"
            style={{
              top: 80,
              borderBottom: "1px solid #d7d3c7",
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            }}
          >
            <div className="w-full mx-auto px-7 md:px-10 lg:px-16 py-4">
              <input
                autoFocus
                placeholder="Search horses, races, jockeys..."
                className="w-full px-4 py-3 text-sm border-0 outline-none font-sans"
                style={{
                  background: "#f7f6f1",
                  borderRadius: 2,
                  color: "#002a15",
                }}
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>
        )}
      </header>

      <main style={{ paddingTop: 80 }}>{children}</main>

      <footer style={{ background: "#3f4541", borderTop: "1px solid rgba(215,211,199,0.1)" }}>
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
          style={{ paddingBlock: 48 }}
        >
          <div>
            <h2
              className="m-0"
              style={{
                color: "#ffdea5",
                fontSize: "1.55rem",
                fontWeight: 500,
                lineHeight: 1.25,
                fontFamily: '"EB Garamond", Georgia, serif',
              }}
            >
              Heritage Racing
            </h2>
            <p
              className="m-0"
              style={{
                marginTop: 8,
                color: "rgba(217,217,217,0.72)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              © 2024 Heritage Racing. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap gap-7" aria-label="Footer navigation">
            <a href="#privacy" className="no-underline" style={{ color: "rgba(217,217,217,0.76)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em" }}>Privacy Policy</a>
            <a href="#terms" className="no-underline" style={{ color: "rgba(217,217,217,0.76)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em" }}>Terms of Service</a>
            <a href="#support" className="no-underline" style={{ color: "rgba(217,217,217,0.76)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em" }}>Contact Support</a>
            <a href="#standings" className="no-underline" style={{ color: "#ffbd6b", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textDecoration: "underline" }}>Global Standings</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
