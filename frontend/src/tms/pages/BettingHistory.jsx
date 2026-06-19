import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import { BETS_SEED, calculateBettingStats } from "../../data/bets.js";
import { fmtCurrency } from "../format.js";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";

const FILTER_TABS = [
  { value: "all", label: "All Bets" },
  { value: "pending", label: "Active" },
  { value: "settled", label: "Settled" },
];

const STATUS_TONE = {
  Pending: "pending",
  Win: "win",
  Settled: "win",
  Lost: "lost",
};

export default function BettingHistory() {
  const { user, bets: contextBets } = useApp();
  const [activeTab, setActiveTab] = useState("all");

  // Use context bets if available, otherwise use seed data for demo
  const allBets = contextBets && contextBets.length > 0 ? contextBets : BETS_SEED;

  // Filter bets by user if logged in, otherwise show sample
  const bets = user
    ? allBets.filter((b) => b.userId === user.id)
    : allBets;

  const stats = user ? calculateBettingStats(user.id) : null;

  const filtered = useMemo(() => {
    if (activeTab === "all") return bets;
    if (activeTab === "pending") return bets.filter((b) => b.status === "Pending");
    if (activeTab === "settled") return bets.filter((b) => b.status === "Win" || b.status === "Lost");
    return bets;
  }, [activeTab, bets]);

  return (
    <SpectatorLayout>
      <div className="spectator">
        {/* SEARCH HEADER */}
        <section style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}>
          <div
            className="shell"
            style={{ paddingBlock: 18, display: "flex", flexWrap: "wrap", gap: 16 }}
          >
            <div className="spectator__search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: "#747b75" }}>
                <path d="M11 11l3 3M7 13A6 6 0 1 1 7 1a6 6 0 0 1 0 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input type="text" placeholder="Search for races, horses, or jockeys..." />
              <button type="button" aria-label="Filter">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* PAGE HEAD */}
        <div className="shell">
          <header className="spectator__page-head">
            <div className="spectator__breadcrumb">
              <Link to="/spectator/home">Home</Link>
              <span className="spectator__breadcrumb__sep">/</span>
              <span className="spectator__breadcrumb__current">My Betting History</span>
            </div>
            <span className="spectator__page-eyebrow">Your Active Wagers</span>
            <h1>My Betting History</h1>
            <p>
              A complete record of every wager you have placed — from the moment you tap
              Place a Bet to the final payout.
            </p>
          </header>
        </div>

        {/* STATS */}
        <div className="shell" style={{ paddingBlock: "0 24px" }}>
          <div className="spectator__bet-stats">
            <BetStat label="Total Bets" value={stats?.totalBets || bets.length} />
            <BetStat label="Active Bets" value={stats?.activeBets || bets.filter(b => b.status === 'Pending').length} />
            <BetStat label="Settled Bets" value={stats?.settledBets || bets.filter(b => b.status !== 'Pending').length} />
            <BetStat
              label="Lifetime Payouts"
              value={stats ? fmtCurrency(stats.totalWon) : fmtCurrency(bets.filter(b => b.status === 'Won').reduce((sum, b) => sum + (b.actualPayout || 0), 0))}
              accent
            />
          </div>
        </div>

        {/* TABS ROW */}
        <div className="shell">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBlock: "16px 24px",
            }}
          >
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
            <Link to="/spectator/tournaments" className="spectator__btn spectator__btn--primary">
              Place a New Bet
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <section className="spectator__section" style={{ paddingTop: 0 }}>
          <div className="shell">
            <div className="spectator__bet-table">
              <div className="spectator__bet-table__head">
                <span>Race</span>
                <span>Horse</span>
                <span>Stake</span>
                <span>Odds</span>
                <span>Potential Payout</span>
                <span>Status</span>
              </div>

              {filtered.map((bet) => (
                <div key={bet.id} className="spectator__bet-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 8,
                        background: "#e4e1d7",
                        overflow: "hidden",
                        flex: "0 0 auto",
                      }}
                    >
                      <img
                        src={bet.raceImage}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "#002a15",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          fontFamily: '"EB Garamond", Georgia, serif',
                        }}
                      >
                        {bet.raceName}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: "#747b75",
                          fontSize: "0.74rem",
                        }}
                      >
                        {new Date(bet.placedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "#002a15",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    {bet.horseName}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#002a15",
                      fontSize: "0.92rem",
                      fontWeight: 800,
                    }}
                  >
                    ${bet.stake}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#1f231f",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                    }}
                  >
                    {bet.odds.toFixed(2)}x
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#002a15",
                      fontSize: "1rem",
                      fontWeight: 700,
                    }}
                  >
                    ${(bet.potentialPayout || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <div>
                    <span className={`spectator__status spectator__status--${STATUS_TONE[bet.status]}`}>
                      {bet.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="spectator__pagination">
              <button type="button" className="spectator__pagination--active">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
            </div>
          </div>
        </section>
      </div>
    </SpectatorLayout>
  );
}

function BetStat({ label, value, accent }) {
  return (
    <div
      className={
        accent
          ? "spectator__bet-stat spectator__bet-stat--accent"
          : "spectator__bet-stat"
      }
    >
      <p className="spectator__bet-stat__label">{label}</p>
      <strong className="spectator__bet-stat__value">{value}</strong>
    </div>
  );
}
