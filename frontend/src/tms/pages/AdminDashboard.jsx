import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import AppShell from "../components/layout/AppShell.jsx";
import TournamentModule from "../components/modules/TournamentModule.jsx";
import RefereeModule from "../components/modules/RefereeModule.jsx";
import RegistrationModule from "../components/modules/RegistrationModule.jsx";
import StatusPill from "../components/common/StatusPill.jsx";
import { BRAND, BRAND_BORDER, BRAND_LIGHT, BRAND_TEXT } from "../constants.js";
import { fmtDate } from "../format.js";

const NAV = [
  { id: "overview", label: "Overview", icon: "layout-dashboard" },
  { id: "schedule", label: "Schedule", icon: "calendar-time" },
  { id: "tournament", label: "Tournament", icon: "tournament" },
  { id: "registration", label: "Registrations", icon: "clipboard-check", pendingCount },
  { id: "referee", label: "Referee", icon: "shield-check" },
  { id: "results", label: "Results", icon: "trophy" },
];

export default function AdminDashboard() {
  const { tournament, setTournament, races, setRaces } = useApp();
  const [page, setPage] = useState("overview");

  const pendingCount = races
    .flatMap((r) => r.registrations)
    .filter((r) => r.status === "Pending").length;

  const stats = [
    { label: "Total Races", value: races.length, icon: "trophy", color: "#064e3b", bg: "#ecfdf5", border: "#a7f3d0" },
    { label: "Pending", value: pendingCount, icon: "clock", color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
    { label: "Referees", value: races.filter((r) => r.refereeId).length, icon: "shield-check", color: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd" },
    { label: "Horses", value: races.flatMap((r) => r.registrations).length, icon: "horse", color: "#5b21b6", bg: "#f5f3ff", border: "#c4b5fd" },
  ];

  return (
    <AppShell
      page={page}
      setPage={setPage}
      nav={NAV}
      subtitle="ADMIN PANEL"
      pendingCount={pendingCount}
    >
      {page === "overview" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center border mb-2" style={{ background: s.bg, borderColor: s.border }}>
                  <i className={`ti ti-${s.icon} text-base`} style={{ color: s.color }} />
                </div>
                <div className="text-2xl font-black text-slate-800">{s.value}</div>
                <div className="text-xs text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
              <i className="ti ti-layout-dashboard text-3xl" style={{ color: "#065f46" }} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Admin Overview</h2>
            <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
              Welcome to the Racing TMS Admin Panel. Use the navigation above or cards below to manage tournaments, registrations, and referees.
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <i className={`ti ti-${s.icon} text-lg mb-1 block`} style={{ color: s.color }} />
                  <div className="text-xl font-black text-slate-800">{s.value}</div>
                  <div className="text-[11px] text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {page === "tournament" && (
        <TournamentModule tournament={tournament} setTournament={setTournament} races={races} setRaces={setRaces} />
      )}
      {page === "schedule" && (
        <>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Race Schedule</h2>
          <div className="flex flex-col gap-3 mb-6">
            {races.filter(r => r.status !== "Cancelled").map(race => (
              <div key={race.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-800">{race.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: BRAND_LIGHT, color: BRAND_TEXT }}>{race.grade}</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span><i className="ti ti-map-pin mr-1" />{race.venue}</span>
                      <span><i className="ti ti-ruler-measure mr-1" />{race.distance}m</span>
                    </p>
                  </div>
                  <StatusPill status={race.status} />
                </div>
                <div className="p-4 flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
                    <i className="ti ti-calendar text-sm" style={{ color: "#c2410c" }} />
                    <span className="text-sm font-bold text-slate-800">{fmtDate(race.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#fef3c7", border: "1px solid #fde68a" }}>
                    <i className="ti ti-clock text-sm" style={{ color: "#92400e" }} />
                    <span className="text-sm font-bold text-slate-800">{race.time}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <i className="ti ti-weather-sunny text-sm" style={{ color: "#166534" }} />
                    <span className="text-sm font-semibold text-slate-700">{race.condition}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: BRAND_LIGHT, border: "1px solid " + BRAND_BORDER }}>
                    <i className="ti ti-trophy text-sm" style={{ color: BRAND_TEXT }} />
                    <span className="text-sm font-semibold" style={{ color: BRAND_TEXT }}>${race.prizePool.toLocaleString()}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
                    <i className="ti ti-users mr-1" />{race.registrations.length} entries
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {page === "registration" && (
        <RegistrationModule races={races} setRaces={setRaces} />
      )}
      {page === "referee" && (
        <RefereeModule races={races} setRaces={setRaces} />
      )}
      {page === "results" && (
        <>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Race Results</h2>
          <div className="flex flex-col gap-4">
            {races.filter(r => r.status === "Finished").length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#fff8e7", border: "1px solid #d4a820" }}>
                  <i className="ti ti-trophy text-2xl" style={{ color: "#b8860b" }} />
                </div>
                <p className="text-slate-500 text-sm">No race results published yet. Mark races as Finished to publish results.</p>
              </div>
            )}
            {races.filter(r => r.status === "Finished").map(race => {
              const rankedRegs = race.registrations.filter(r => r.result).sort((a, b) => a.result - b.result);
              const winner = rankedRegs.find(r => r.result === 1);
              return (
                <div key={race.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800">{race.name}</h3>
                      <p className="text-xs text-slate-400">{race.venue} · {fmtDate(race.date)} · {race.distance}m · {race.grade}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black" style={{ color: BRAND_TEXT }}>${race.prizePool.toLocaleString()}</p>
                      <StatusPill status="Finished" />
                    </div>
                  </div>
                  {winner && (
                    <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white border border-yellow-200">🏆</div>
                      <div>
                        <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Winner</p>
                        <p className="text-lg font-black text-slate-800">{winner.horseName}</p>
                        <p className="text-sm text-slate-500">{winner.jockeyName} · {winner.ownerName}</p>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Full Results</p>
                    {rankedRegs.length === 0 ? (
                      <p className="text-sm text-slate-400">Results not yet submitted by referee.</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {rankedRegs.map((reg, i) => {
                          const medalClass = { 1: "bg-yellow-400 text-yellow-900", 2: "bg-slate-300 text-slate-700", 3: "bg-orange-300 text-orange-900" }[reg.result] || "bg-slate-100 text-slate-500";
                          return (
                            <div key={reg.id} className="flex items-center gap-3 p-2.5 rounded-xl border" style={{ borderColor: "#f1f5f9" }}>
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${medalClass}`}>
                                {reg.result}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-semibold text-slate-800">{reg.horseName}</span>
                              </div>
                              <span className="text-xs text-slate-400">{reg.jockeyName}</span>
                              <span className="text-xs text-slate-400">{reg.ownerName}</span>
                              {reg.status === "Approved" && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#ecfdf5", color: "#166534" }}>Approved</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}
