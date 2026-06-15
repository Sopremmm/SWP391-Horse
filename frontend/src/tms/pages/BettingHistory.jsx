import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { useApp } from "../AppContext.jsx";
import { RACES_SEED } from "../races.js";

const HORSE_PORTRAIT = "https://images.unsplash.com/photo-1538610111451-b006900ee327?auto=format&fit=crop&q=80&w=400&h=400";

const STATUSES = [
  { id: "all", label: "All Bets" },
  { id: "active", label: "Active" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

function StatusPill({ status }) {
  const map = {
    Active: { bg: "rgba(255,222,165,0.92)", color: "#263b12", text: "Active" },
    Won: { bg: "#dcfce7", color: "#166534", text: "Won" },
    Lost: { bg: "#fee2e2", color: "#9f1239", text: "Lost" },
    Pending: { bg: "rgba(255,222,165,0.92)", color: "#263b12", text: "Pending" },
  };
  const s = map[status] || map.Pending;
  return (
    <span
      className="inline-flex items-center"
      style={{
        padding: "5px 12px", borderRadius: 999,
        background: s.bg, color: s.color,
        fontSize: "0.7rem", fontWeight: 800,
        letterSpacing: "0.08em", textTransform: "uppercase",
        gap: 6,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.color }} />
      {s.text}
    </span>
  );
}

export default function BettingHistory() {
  const { user, bets } = useApp();
  const [tab, setTab] = useState("all");
  const [period, setPeriod] = useState("all");

  const myBets = useMemo(() => {
    if (!user) return [];
    let list = bets.filter((b) => b.userId === user.id);

    // Augment with race status to determine Won/Lost/Active
    list = list.map((b) => {
      const race = RACES_SEED.find((r) => r.id === b.raceId);
      let status = b.status;
      if (race?.status === "Finished") {
        const winner = (race.registrations || []).find((r) => r.result === 1);
        if (winner) {
          status = winner.horseName === b.horseName ? "Won" : "Lost";
        } else {
          // mark all active as Active if race upcoming/running
          status = race.status === "Running" ? "Active" : race.status;
        }
      } else if (race?.status === "Running") {
        status = "Active";
      }
      return { ...b, status, race };
    });

    if (tab !== "all") list = list.filter((b) => b.status.toLowerCase() === tab);
    return list;
  }, [user, bets, tab]);

  const totals = useMemo(() => {
    const total = myBets.reduce((s, b) => s + b.amount, 0);
    const potential = myBets.filter((b) => b.status !== "Lost").reduce((s, b) => s + b.payout, 0);
    const won = myBets.filter((b) => b.status === "Won").length;
    return { total, potential, won, count: myBets.length };
  }, [myBets]);

  return (
    <SpectatorLayout>
      {/* HEADER STRIP */}
      <section style={{ background: "#002a15", paddingBlock: "64px 56px" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <p className="m-0 inline-flex items-center" style={{ color: "#ffdea5", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", gap: 12 }}>
            <span style={{ width: 36, height: 1, background: "#ffdea5" }} />
            My Betting
          </p>
          <h1 className="m-0" style={{ color: "#fff", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 500, lineHeight: 1.1, marginTop: 12, fontFamily: '"EB Garamond", Georgia, serif' }}>
            My Betting History
          </h1>
          <p className="m-0" style={{ marginTop: 14, color: "rgba(210,245,219,0.82)", fontSize: "1rem", lineHeight: 1.6, width: "min(100%, 580px)" }}>
            Every wager you&apos;ve placed — active, won, and lost. Track your stakes and review the results.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#fff", borderBottom: "1px solid #d7d3c7", paddingBlock: 40 }}>
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 grid gap-8"
          style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
        >
          {[
            { value: myBets.length, label: "Total Bets" },
            { value: `$${totals.total.toFixed(0)}`, label: "Total Staked" },
            { value: `$${totals.potential.toFixed(0)}`, label: "Potential Payout" },
            { value: totals.won, label: "Wins" },
          ].map((s) => (
            <div key={s.label} className="grid gap-1">
              <strong style={{ color: "#002a15", fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", fontWeight: 500, lineHeight: 1, fontFamily: '"EB Garamond", Georgia, serif' }}>
                {s.value}
              </strong>
              <span style={{ color: "#747b75", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TABS + PERIOD */}
      <section style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}>
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex items-center justify-between flex-wrap"
          style={{ minHeight: 72, gap: 16 }}
        >
          <div className="flex overflow-x-auto" style={{ gap: 4 }}>
            {STATUSES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="cursor-pointer border-0"
                style={{
                  padding: "24px 20px", background: "transparent",
                  color: tab === t.id ? "#002a15" : "#555e58",
                  fontSize: "0.78rem", fontWeight: 700,
                  borderBottom: tab === t.id ? "2px solid #002a15" : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div
            className="flex items-center"
            style={{ padding: "0 14px", background: "#fff", border: "1px solid #d7d3c7", borderRadius: 2, color: "#002a15", gap: 6 }}
          >
            <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555e58" }}>
              Period
            </span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent border-0 outline-none cursor-pointer"
              style={{ padding: "10px 8px", color: "#002a15", fontSize: "0.78rem", fontWeight: 700 }}
            >
              <option value="all">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="7">Last 7 Days</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>
      </section>

      {/* TABLE / EMPTY STATE */}
      <section style={{ paddingBlock: "clamp(48px, 6vw, 72px) clamp(64px, 8vw, 96px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          {!user ? (
            <div className="mx-auto text-center" style={{ maxWidth: 480, padding: 64, background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8 }}>
              <h3 style={{ color: "#002a15", fontSize: "1.5rem", fontFamily: '"EB Garamond", Georgia, serif', margin: 0 }}>
                Sign in to view your bets
              </h3>
              <p style={{ color: "#555e58", fontSize: "0.92rem", marginTop: 12, marginBottom: 24 }}>
                Track your wagers, see live status, and review results.
              </p>
              <Link
                to="/"
                className="inline-block no-underline"
                style={{ padding: "14px 32px", background: "#002a15", color: "#fff", borderRadius: 2, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                Sign In
              </Link>
            </div>
          ) : myBets.length === 0 ? (
            <div
              className="mx-auto text-center"
              style={{ maxWidth: 540, padding: 80, background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8 }}
            >
              <div
                className="inline-grid place-items-center"
                style={{ width: 72, height: 72, borderRadius: 999, background: "#f7f6f1", marginBottom: 24 }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17 9 11l4 4 8-8" stroke="#002a15" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 7h7v7" stroke="#002a15" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={{ color: "#002a15", fontSize: "1.6rem", fontFamily: '"EB Garamond", Georgia, serif', margin: 0 }}>
                No bets here yet
              </h3>
              <p style={{ color: "#555e58", fontSize: "0.95rem", marginTop: 12, marginBottom: 28, lineHeight: 1.6 }}>
                {tab === "all"
                  ? "Your betting history is empty. Browse the live tournaments to place your first stake."
                  : `No ${tab} bets at the moment. Try another filter or place a new bet.`}
              </p>
              <Link
                to="/spectator/tournaments"
                className="inline-block no-underline"
                style={{ padding: "14px 32px", background: "#002a15", color: "#fff", borderRadius: 2, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                Browse Tournaments
              </Link>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #d7d3c7", borderRadius: 8, overflow: "hidden" }}>
              <div
                className="hidden md:grid"
                style={{
                  gridTemplateColumns: "1.2fr 1.4fr 1fr 0.8fr 0.8fr 1fr 1fr 120px",
                  background: "#f7f6f1", borderBottom: "1px solid #d7d3c7",
                  padding: "16px 24px", gap: 16,
                }}
              >
                {["Race", "Horse", "Jockey", "Stake", "Odds", "Payout", "Date", "Status"].map((h) => (
                  <span key={h} style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555e58" }}>
                    {h}
                  </span>
                ))}
              </div>
              {myBets.map((bet, i) => (
                <div
                  key={bet.id}
                  className="md:grid flex flex-col"
                  style={{
                    gridTemplateColumns: "1.2fr 1.4fr 1fr 0.8fr 0.8fr 1fr 1fr 120px",
                    padding: "18px 24px", gap: 16, alignItems: "center",
                    borderBottom: i === myBets.length - 1 ? "none" : "1px solid #f0ede4",
                  }}
                >
                  <div>
                    <p className="m-0" style={{ color: "#002a15", fontSize: "0.92rem", fontWeight: 700, fontFamily: '"EB Garamond", Georgia, serif' }}>
                      {bet.race?.name || bet.raceId}
                    </p>
                    <p className="m-0" style={{ color: "#747b75", fontSize: "0.74rem", marginTop: 2 }}>
                      {bet.race?.venue} · {bet.race?.grade}
                    </p>
                  </div>
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 6, background: "#e4e1d7", overflow: "hidden", flexShrink: 0 }}>
                      <img src={HORSE_PORTRAIT} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="m-0" style={{ color: "#002a15", fontSize: "0.88rem", fontWeight: 700 }}>
                      {bet.horseName}
                    </p>
                  </div>
                  <p className="m-0" style={{ color: "#1f231f", fontSize: "0.85rem" }}>{bet.jockeyName}</p>
                  <p className="m-0" style={{ color: "#002a15", fontSize: "0.92rem", fontWeight: 800 }}>${bet.amount.toFixed(2)}</p>
                  <p className="m-0" style={{ color: "#1f231f", fontSize: "0.85rem", fontWeight: 700 }}>{bet.odds.toFixed(2)}x</p>
                  <p className="m-0" style={{ color: "#002a15", fontSize: "0.92rem", fontWeight: 800 }}>${bet.payout.toFixed(2)}</p>
                  <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem" }}>
                    {new Date(bet.placedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                  </p>
                  <div><StatusPill status={bet.status} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SpectatorLayout>
  );
}
