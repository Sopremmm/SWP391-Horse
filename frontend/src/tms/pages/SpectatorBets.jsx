import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import { fmtDateTime, fmtCurrency } from "../format.js";
import { STATUS_STYLES } from "../constants.js";
import AppShell from "../components/layout/AppShell.jsx";

function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES["Pending"];
}

export default function SpectatorBets() {
  const navigate = useNavigate();
  const { user, races, getMyBets } = useApp();

  const myBets = user ? getMyBets(user.id) : [];
  const totalStaked = myBets.reduce((sum, b) => sum + b.amount, 0);
  const totalPotential = myBets
    .filter((b) => b.status === "Pending")
    .reduce((sum, b) => sum + b.payout, 0);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "gauge" },
    { id: "bets", label: "My Bets", icon: "chart-line", badge: myBets.length },
  ];

  return (
    <AppShell
      page="bets"
      setPage={(p) => {
        if (p === "dashboard") navigate("/spectator");
      }}
      nav={nav}
      subtitle="Spectator"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 font-serif mb-1">My Bets</h1>
        <p className="text-sm text-slate-500">Track your placed bets and potential payouts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
            Total Bets
          </p>
          <p className="text-2xl font-black text-slate-800">{myBets.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
            Total Staked
          </p>
          <p className="text-2xl font-black" style={{ color: "var(--color-brand-text)" }}>
            {fmtCurrency(totalStaked)}
          </p>
        </div>
        <div
          className="bg-white border rounded-2xl p-4 shadow-card"
          style={{ borderColor: "var(--color-accent-gold-border)" }}
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
            Potential Payout
          </p>
          <p className="text-2xl font-black" style={{ color: "var(--color-accent-gold)" }}>
            {fmtCurrency(totalPotential)}
          </p>
        </div>
      </div>

      {myBets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-card">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "var(--color-brand-light)",
              border: "1px solid var(--color-brand-border)",
            }}
          >
            <i className="ti ti-chart-line text-2xl" style={{ color: "var(--color-brand-text)" }} />
          </div>
          <p className="text-slate-500 text-sm mb-3">No bets placed yet.</p>
          <button
            type="button"
            onClick={() => navigate("/spectator")}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white border-none cursor-pointer font-sans"
            style={{ background: "var(--color-brand)" }}
          >
            Browse Races
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myBets.map((bet) => {
            const race = races.find((r) => r.id === bet.raceId);
            const s = getStatusStyle(bet.status);
            return (
              <div
                key={bet.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card"
              >
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {race?.name || "Unknown race"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {race?.venue} · {fmtDateTime(bet.placedAt)}
                    </p>
                  </div>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap"
                    style={{ background: s.bg, color: s.color, borderColor: s.border }}
                  >
                    {bet.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ background: "var(--color-brand-light)" }}
                  >
                    🐎
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{bet.horseName}</p>
                    <p className="text-xs text-slate-500">
                      Jockey: {bet.jockeyName || "—"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                      Stake
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {fmtCurrency(bet.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                      Odds
                    </p>
                    <p className="text-sm font-bold" style={{ color: "var(--color-accent-gold)" }}>
                      {bet.odds.toFixed(2)}x
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                      Payout
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--color-accent-gold)" }}
                    >
                      {fmtCurrency(bet.payout)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
