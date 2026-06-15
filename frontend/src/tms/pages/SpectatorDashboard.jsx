import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import { fmtDate, fmtCurrency } from "../format.js";
import AppShell from "../components/layout/AppShell.jsx";
import StatusPill from "../components/common/StatusPill.jsx";
import SpectatorRaceCard, { BetModal } from "../components/spectator/SpectatorRaceCard.jsx";

function StatCard({ label, value, icon, color, bg, border }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-card">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center border"
        style={{ background: bg, borderColor: border }}
      >
        <i className={`ti ti-${icon} text-base`} style={{ color }} />
      </div>
      <div className="text-2xl font-black text-slate-800">{value}</div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
    </div>
  );
}

export default function SpectatorDashboard() {
  const { user, login, races, bets } = useApp();
  const [tab, setTab] = useState("races");
  const [selectedRace, setSelectedRace] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const upcomingRaces = races.filter((r) => r.status === "Upcoming");
  const finishedRaces = races.filter((r) => r.status === "Finished");
  const myBets = user ? bets.filter((b) => b.userId === user.id) : [];
  const myPredCount = myBets.length;

  const handleLogin = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    login(form.get("userId"));
    setShowAuth(false);
  };

  const nav = [
    { id: "races", label: "Races", icon: "trophy" },
    { id: "predictions", label: "My Predictions", icon: "chart-line", badge: myPredCount },
    { id: "results", label: "Results", icon: "certificate" },
  ];

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-page-bg)" }}
      >
        <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-md shadow-card">
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "var(--color-brand-light)",
                border: "2px solid var(--color-brand-border)",
              }}
            >
              <i className="ti ti-user text-2xl" style={{ color: "var(--color-brand-text)" }} />
            </div>
            <h1 className="text-xl font-black text-slate-800 mb-1 font-serif">
              Spectator Access
            </h1>
            <p className="text-sm text-slate-500">Sign in to place bets and track results</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                User ID
              </label>
              <input
                name="userId"
                type="text"
                placeholder="e.g. U009 (Lisa Spectator)"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2 font-sans"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2 font-sans"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-semibold text-white border-none mt-2 cursor-pointer font-sans"
              style={{ background: "var(--color-brand)" }}
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-4">
            No account?{" "}
            <button
              type="button"
              onClick={() => setShowAuth("signup")}
              className="cursor-pointer bg-transparent border-none font-sans font-semibold"
              style={{ color: "var(--color-brand-text)" }}
            >
              Sign up free
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppShell page={tab} setPage={setTab} nav={nav} subtitle="Spectator">
      {tab === "races" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard
              label="Upcoming Races"
              value={upcomingRaces.length}
              icon="calendar-event"
              color="var(--color-brand-text)"
              bg="var(--color-brand-light)"
              border="var(--color-brand-border)"
            />
            <StatCard
              label="Finished"
              value={finishedRaces.length}
              icon="circle-check"
              color="#166534"
              bg="#dcfce7"
              border="#86efac"
            />
            <StatCard
              label="My Bets"
              value={myPredCount}
              icon="chart-line"
              color="#1e40af"
              bg="#eff6ff"
              border="#93c5fd"
            />
            <StatCard
              label="Total Staked"
              value={fmtCurrency(myBets.reduce((s, b) => s + b.amount, 0))}
              icon="currency-dollar"
              color="var(--color-accent-gold)"
              bg="var(--color-accent-gold-light)"
              border="var(--color-accent-gold-border)"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Upcoming Races</h2>
            <Link
              to="/spectator/bets"
              className="text-xs font-semibold hover:underline"
              style={{ color: "var(--color-brand-text)" }}
            >
              View My Bets →
            </Link>
          </div>
          {upcomingRaces.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-card">
              <p className="text-slate-400 text-sm">No upcoming races at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingRaces.map((race) => (
                <SpectatorRaceCard
                  key={race.id}
                  race={race}
                  onPlaceBet={setSelectedRace}
                />
              ))}
            </div>
          )}

          {selectedRace && (
            <BetModal
              race={races.find((r) => r.id === selectedRace.id) || selectedRace}
              onClose={() => setSelectedRace(null)}
              onPlaced={() => {}}
            />
          )}
        </div>
      )}

      {tab === "predictions" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">My Bets</h2>
            <Link
              to="/spectator/bets"
              className="text-xs font-semibold hover:underline"
              style={{ color: "var(--color-brand-text)" }}
            >
              Open full history →
            </Link>
          </div>
          {myPredCount === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-card">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "var(--color-brand-light)",
                  border: "1px solid var(--color-brand-border)",
                }}
              >
                <i
                  className="ti ti-chart-line text-2xl"
                  style={{ color: "var(--color-brand-text)" }}
                />
              </div>
              <p className="text-slate-500 text-sm mb-3">No bets placed yet.</p>
              <button
                type="button"
                onClick={() => setTab("races")}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white border-none cursor-pointer font-sans"
                style={{ background: "var(--color-brand)" }}
              >
                Browse Races
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myBets
                .slice(0, 5)
                .map((bet) => {
                  const race = races.find((r) => r.id === bet.raceId);
                  return (
                    <div
                      key={bet.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card"
                    >
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <span className="font-bold text-slate-800">
                          {race?.name || "Unknown race"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {fmtDate(bet.placedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                          style={{ background: "var(--color-brand-light)" }}
                        >
                          🐎
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">
                            {bet.horseName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {race?.venue} · Stake {fmtCurrency(bet.amount)} · Odds {bet.odds.toFixed(2)}x
                          </p>
                        </div>
                        {race?.status === "Finished" ? (
                          <StatusPill status={bet.status === "Won" ? "Approved" : "Rejected"} />
                        ) : (
                          <span
                            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: "var(--color-brand-light)",
                              color: "var(--color-brand-text)",
                            }}
                          >
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {tab === "results" && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Race Results</h2>
          {finishedRaces.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-card">
              <p className="text-slate-400 text-sm">No finished races yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {finishedRaces.map((race) => {
                const winner = (race.registrations || []).find((r) => r.result === 1);
                return (
                  <div
                    key={race.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card"
                  >
                    <div className="p-4 border-b border-slate-100">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="font-bold text-slate-800">{race.name}</h3>
                          <p className="text-xs text-slate-400">
                            {race.venue} · {fmtDate(race.date)}
                          </p>
                        </div>
                        <StatusPill status="Finished" />
                      </div>
                    </div>
                    {winner && (
                      <div
                        className="p-4 flex items-center gap-3 border-b"
                        style={{
                          background: "var(--color-brand-light)",
                          borderColor: "var(--color-brand-border)",
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white border shadow-sm"
                          style={{ borderColor: "var(--color-brand-border)" }}
                        >
                          🏆
                        </div>
                        <div>
                          <p
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: "var(--color-brand-text)" }}
                          >
                            Winner
                          </p>
                          <p className="text-base font-black text-slate-800">
                            {winner.horseName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {winner.jockeyName} · {fmtCurrency(race.prizePool)}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Full Results
                      </p>
                      {(race.registrations || [])
                        .sort((a, b) => (a.result || 999) - (b.result || 999))
                        .map((reg, i) => (
                          <div
                            key={reg.id}
                            className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
                          >
                            <span
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{
                                background:
                                  i === 0
                                    ? "#b8860b"
                                    : i === 1
                                    ? "#9ca3af"
                                    : i === 2
                                    ? "#cd7f32"
                                    : "#6b7280",
                              }}
                            >
                              {reg.result || "-"}
                            </span>
                            <span className="text-sm font-semibold text-slate-800">
                              {reg.horseName}
                            </span>
                            <span className="text-xs text-slate-400 ml-auto">
                              {reg.jockeyName}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
