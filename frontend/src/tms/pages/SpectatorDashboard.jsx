import { useState } from "react";
import { useApp } from "../AppContext.jsx";
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
} from "../constants.js";
import { fmtDate } from "../format.js";
import AppShell from "../components/layout/AppShell.jsx";
import StatusPill from "../components/common/StatusPill.jsx";

function StatCard({ label, value, icon, color, bg, border }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center border" style={{ background: bg, borderColor: border }}>
        <i className={`ti ti-${icon} text-base`} style={{ color }} />
      </div>
      <div className="text-2xl font-black text-slate-800">{value}</div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
    </div>
  );
}

export default function SpectatorDashboard() {
  const { user, login, races } = useApp();
  const [tab, setTab] = useState("races");
  const [selectedRace, setSelectedRace] = useState(null);
  const [myPredictions, setMyPredictions] = useState([]);
  const [showAuth, setShowAuth] = useState(false);

  const upcomingRaces = races.filter(r => r.status === "Upcoming");
  const finishedRaces = races.filter(r => r.status === "Finished");
  const myPredCount = myPredictions.length;

  const handleLogin = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    login(form.get("userId"));
    setShowAuth(false);
  };

  const placePrediction = (raceId, horseName) => {
    if (myPredictions.find(p => p.raceId === raceId)) return;
    setMyPredictions(prev => [...prev, {
      id: "P" + Date.now(),
      raceId,
      horseName,
      placedAt: new Date().toISOString(),
      result: null,
    }]);
    setSelectedRace(null);
  };

  const nav = [
    { id: "races", label: "Races", icon: "trophy" },
    { id: "predictions", label: "My Predictions", icon: "chart-line", badge: myPredCount },
    { id: "results", label: "Results", icon: "certificate" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: PAGE_BG }}>
        <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-md shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: BRAND_LIGHT, border: `2px solid ${BRAND_BORDER}` }}>
              <i className="ti ti-user text-2xl" style={{ color: BRAND_TEXT }} />
            </div>
            <h1 className="text-xl font-black text-slate-800 mb-1">Spectator Access</h1>
            <p className="text-sm text-slate-500">Sign in to place predictions and track results</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">User ID</label>
              <input name="userId" type="text" placeholder="e.g. U001" required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2"
                style={{ borderColor: BORDER }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Password</label>
              <input type="password" placeholder="Enter password"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2"
                style={{ borderColor: BORDER }} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl font-semibold text-white mt-2"
              style={{ background: BRAND }}>
              Sign In
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-4">
            No account? <button onClick={() => setShowAuth("signup")} className="cursor-pointer bg-transparent border-none font-sans font-semibold" style={{ color: BRAND_TEXT }}>Sign up free</button>
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
            <StatCard label="Upcoming Races" value={upcomingRaces.length} icon="calendar-event" color={BRAND_TEXT} bg={BRAND_LIGHT} border={BRAND_BORDER} />
            <StatCard label="Finished" value={finishedRaces.length} icon="circle-check" color="#166534" bg="#dcfce7" border="#86efac" />
            <StatCard label="My Predictions" value={myPredCount} icon="chart-line" color="#1e40af" bg="#eff6ff" border="#93c5fd" />
            <StatCard label="Winners" value={myPredictions.filter(p => p.result === "WIN").length} icon="trophy" color="#b8860b" bg="#fff8e7" border="#d4a820" />
          </div>

          <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Races</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingRaces.map(race => (
              <div key={race.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: BRAND_LIGHT, color: BRAND_TEXT, border: `1px solid ${BRAND_BORDER}` }}>{race.grade}</span>
                    <StatusPill status={race.status} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{race.name}</h3>
                  <p className="text-xs text-slate-400 mb-3"><i className="ti ti-map-pin mr-1" />{race.venue} · {fmtDate(race.date)}</p>
                  <div className="text-lg font-black mb-3" style={{ color: BRAND_TEXT }}>${race.prizePool.toLocaleString()}</div>
                  <button
                    onClick={() => setSelectedRace(race)}
                    className="w-full py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: BRAND }}
                  >
                    <i className="ti ti-currency-dogecoin mr-1.5" />Place Prediction
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Prediction modal */}
          {selectedRace && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSelectedRace(null)}>
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-800">Predict the Winner</h3>
                  <button onClick={() => setSelectedRace(null)} className="cursor-pointer bg-transparent border-none text-slate-400"><i className="ti ti-x text-lg" /></button>
                </div>
                <div className="p-5">
                  <div className="bg-slate-50 rounded-xl p-3 mb-4">
                    <p className="text-sm font-bold text-slate-800">{selectedRace.name}</p>
                    <p className="text-xs text-slate-500">{selectedRace.venue} · {fmtDate(selectedRace.date)}</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Select your winning horse:</p>
                  <div className="flex flex-col gap-2">
                    {selectedRace.registrations.filter(r => r.status === "Approved").map(reg => (
                      <button
                        key={reg.id}
                        onClick={() => placePrediction(selectedRace.id, reg.horseName)}
                        className="flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all hover:border-emerald-300 hover:bg-emerald-50"
                        style={{ borderColor: BORDER }}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: BRAND_LIGHT }}>🐎</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{reg.horseName}</p>
                          <p className="text-xs text-slate-400">{reg.jockeyName}</p>
                        </div>
                        <i className="ti ti-chevron-right ml-auto text-slate-300" />
                      </button>
                    ))}
                    {selectedRace.registrations.filter(r => r.status === "Approved").length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-4">No approved participants yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "predictions" && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">My Predictions</h2>
          {myPredictions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: BRAND_LIGHT, border: `1px solid ${BRAND_BORDER}` }}>
                <i className="ti ti-chart-line text-2xl" style={{ color: BRAND_TEXT }} />
              </div>
              <p className="text-slate-500 text-sm">No predictions yet.</p>
              <button onClick={() => setTab("races")} className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: BRAND }}>
                Browse Races
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myPredictions.map(pred => {
                const race = races.find(r => r.id === pred.raceId);
                return (
                  <div key={pred.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800">{race?.name}</span>
                      <span className="text-xs text-slate-400">Placed: {fmtDate(pred.placedAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: BRAND_LIGHT }}>🐎</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{pred.horseName}</p>
                        <p className="text-xs text-slate-400">{race?.venue} · {race?.date}</p>
                      </div>
                      {race?.status === "Finished" && (
                        <StatusPill status={pred.result === "WIN" ? "Approved" : "Rejected"} />
                      )}
                      {race?.status === "Upcoming" && (
                        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: BRAND_LIGHT, color: BRAND_TEXT }}>PENDING</span>
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
          <div className="flex flex-col gap-4">
            {finishedRaces.map(race => {
              const winner = race.registrations.find(r => r.result === 1);
              return (
                <div key={race.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800">{race.name}</h3>
                        <p className="text-xs text-slate-400">{race.venue} · {fmtDate(race.date)}</p>
                      </div>
                      <StatusPill status="Finished" />
                    </div>
                  </div>
                  {winner && (
                    <div className="p-4 flex items-center gap-3 bg-emerald-50 border-b border-emerald-100">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white border border-emerald-200 shadow-sm">🏆</div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Winner</p>
                        <p className="text-base font-black text-slate-800">{winner.horseName}</p>
                        <p className="text-xs text-slate-500">{winner.jockeyName} · ${race.prizePool.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Full Results</p>
                    {race.registrations.sort((a,b) => (a.result || 999) - (b.result || 999)).map((reg, i) => (
                      <div key={reg.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: i === 0 ? "#b8860b" : i === 1 ? "#9ca3af" : i === 2 ? "#cd7f32" : "#6b7280" }}>
                          {reg.result || "-"}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">{reg.horseName}</span>
                        <span className="text-xs text-slate-400 ml-auto">{reg.jockeyName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AppShell>
  );
}
