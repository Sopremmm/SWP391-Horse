import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import { BRAND, BRAND_BORDER, BRAND_LIGHT, BRAND_TEXT, BORDER, SURFACE_MUTED } from "../constants.js";
import { fmtDate, fmtDateTime, fmtMillions } from "../format.js";
import AppShell from "../components/layout/AppShell.jsx";
import StatusPill from "../components/common/StatusPill.jsx";
import SlidePanel from "../components/common/SlidePanel.jsx";

const INITIAL_INVITATIONS = [
  { id: "JOI01", horseName: "Thunder Bolt", ownerOrg: "Sunrise Stables", status: "Pending", message: "You are invited to ride Thunder Bolt at Spring Classic.", sentAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "JOI02", horseName: "Silver Arrow", ownerOrg: "Blue River Farm", status: "Accepted", message: "Ride Silver Arrow at Derby Cup.", sentAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const STATS_POOL = [
  { id: "ST01", raceName: "Spring Classic", horseName: "Silver Arrow", position: 1, time: "1:38.2", jockeyName: "Carlos Ruiz", date: "2025-04-15" },
  { id: "ST02", raceName: "Summer Sprint", horseName: "Silver Arrow", position: 2, time: "1:12.5", jockeyName: "Carlos Ruiz", date: "2025-07-10" },
  { id: "ST03", raceName: "Grand Prix", horseName: "Silver Arrow", position: 1, time: "2:05.8", jockeyName: "Carlos Ruiz", date: "2025-09-20" },
  { id: "ST04", raceName: "Autumn Cup", horseName: "Thunder Bolt", position: 3, time: "1:45.1", jockeyName: "Miguel Torres", date: "2025-11-05" },
  { id: "ST05", raceName: "Winter Classic", horseName: "Silver Arrow", position: 1, time: "1:55.3", jockeyName: "Carlos Ruiz", date: "2026-01-15" },
];

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

export default function JockeyDashboard() {
  const { user, tournament, races } = useApp();
  const [tab, setTab] = useState("invitations");
  const [invitations, setInvitations] = useState(INITIAL_INVITATIONS);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const acceptInvite = (id) => {
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: "Accepted" } : inv));
    showToast("Invitation accepted.");
  };

  const declineInvite = (id) => {
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: "Declined" } : inv));
    showToast("Invitation declined.");
  };

  const myEntries = races.flatMap((race) =>
    race.registrations
      .filter((reg) => reg.jockeyName === user?.name)
      .map((reg) => ({
        ...reg, raceId: race.id, raceDate: race.date, raceTime: race.time,
        raceVenue: race.venue, raceStatus: race.status, raceGrade: race.grade,
        raceDistance: race.distance, racePrize: race.prizePool,
      }))
  );

  const pending = myEntries.filter((e) => e.status === "Pending").length;
  const approved = myEntries.filter((e) => e.status === "Approved").length;

  const totalRaces = STATS_POOL.length;
  const wins = STATS_POOL.filter(s => s.position === 1).length;
  const winRate = totalRaces > 0 ? Math.round((wins / totalRaces) * 100) : 0;
  const podiumRate = totalRaces > 0 ? Math.round(((STATS_POOL.filter(s => s.position <= 3).length) / totalRaces) * 100) : 0;

  const nav = [
    { id: "invitations", label: "Invitations", icon: "mail" },
    { id: "races",       label: "My Races",   icon: "horse" },
    { id: "schedule",    label: "Schedule",   icon: "calendar" },
    { id: "stats",       label: "Stats",      icon: "chart-bar" },
    { id: "tournament",  label: "Tournament", icon: "trophy" },
  ];

  return (
    <AppShell page={tab} setPage={setTab} nav={nav} subtitle={"Jockey \u2014 " + (user?.name || "")}>
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-lg"
          style={{ background: "#d1fae5", color: "#166534", border: "1px solid #86efac" }}>
          <i className="ti ti-circle-check mr-2" />{toast}
        </div>
      )}

      {tab === "invitations" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <StatCard label="Invitations" value={invitations.length} icon="mail" color={BRAND_TEXT} bg={BRAND_LIGHT} border={BRAND_BORDER} />
            <StatCard label="Accepted" value={invitations.filter(i => i.status === "Accepted").length} icon="circle-check" color="#065f46" bg="#ecfdf5" border="#a7f3d0" />
            <StatCard label="Pending" value={invitations.filter(i => i.status === "Pending").length} icon="clock" color="#92400e" bg="#fef3c7" border="#fde68a" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Owner Invitations</h2>
          <div className="flex flex-col gap-3">
            {invitations.map(inv => (
              <div key={inv.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: BRAND_LIGHT }}>&#x1F40E;</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{inv.horseName}</p>
                      <p className="text-xs text-slate-400">{inv.ownerOrg} &middot; {fmtDate(inv.sentAt)}</p>
                    </div>
                  </div>
                  <StatusPill status={inv.status} />
                </div>
                {inv.message && (
                  <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 mb-3">{inv.message}</p>
                )}
                {inv.status === "Pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => acceptInvite(inv.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: "#059669" }}>
                      <i className="ti ti-check mr-1" />Accept
                    </button>
                    <button onClick={() => declineInvite(inv.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100">
                      <i className="ti ti-x mr-1" />Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
            {invitations.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: BRAND_LIGHT, border: "1px solid " + BRAND_BORDER }}>
                  <i className="ti ti-mail text-2xl" style={{ color: BRAND_TEXT }} />
                </div>
                <p className="text-slate-500 text-sm">No invitations received yet.</p>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "races" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <StatCard label="My Entries" value={myEntries.length} icon="flag" color={BRAND_TEXT} bg={BRAND_LIGHT} border={BRAND_BORDER} />
            <StatCard label="Approved" value={approved} icon="circle-check" color="#065f46" bg="#ecfdf5" border="#a7f3d0" />
            <StatCard label="Pending" value={pending} icon="clock" color="#92400e" bg="#fef3c7" border="#fde68a" />
          </div>
          <div className="flex flex-col gap-3">
            {myEntries.map((entry) => (
              <div key={entry.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-base font-bold mb-1 text-slate-800">{entry.raceName}</div>
                    <div className="text-sm text-slate-500">
                      Riding <strong className="text-slate-800">{entry.horseName}</strong>
                      &nbsp;&middot; {entry.horseColor}, {entry.horseAge}yo
                    </div>
                  </div>
                  <StatusPill status={entry.status} />
                </div>
                <div className="grid gap-2 p-3 rounded-lg text-xs text-slate-500"
                  style={{ background: SURFACE_MUTED, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
                  <span><i className="ti ti-map-pin mr-1" />{entry.raceVenue}</span>
                  <span><i className="ti ti-calendar mr-1" />{fmtDate(entry.raceDate)} {entry.raceTime}</span>
                  <span><i className="ti ti-ruler-measure mr-1" />{entry.raceDistance}m &middot; {entry.raceGrade}</span>
                  <span><i className="ti ti-trophy mr-1" />${entry.racePrize.toLocaleString()}</span>
                </div>
                <div className="mt-2.5 text-xs text-slate-400">
                  Owner: {entry.ownerName} &middot; Trainer: {entry.trainerName} &middot; Submitted {fmtDateTime(entry.submittedAt)}
                </div>
                {entry.status === "Rejected" && entry.note && (
                  <div className="mt-2.5 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700">
                    Rejection reason: {entry.note}
                  </div>
                )}
              </div>
            ))}
            {myEntries.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: BRAND_LIGHT, border: "1px solid " + BRAND_BORDER }}>
                  <i className="ti ti-horse text-2xl" style={{ color: BRAND_TEXT }} />
                </div>
                <p className="text-slate-500 text-sm">
                  No race entries found for {user?.name}. Sign in as a different user from Home.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "schedule" && (
        <>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Race Schedule</h2>
          <div className="flex flex-col gap-3">
            {races.filter(r => r.status !== "Cancelled").map(race => {
              const myEntry = race.registrations.find(reg => reg.jockeyName === user?.name);
              return (
                <div key={race.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-800">{race.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: BRAND_LIGHT, color: BRAND_TEXT }}>{race.grade}</span>
                        {myEntry && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#dcfce7", color: "#166534" }}>ENTERED</span>}
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-3">
                        <span><i className="ti ti-map-pin mr-1" />{race.venue}</span>
                        <span><i className="ti ti-calendar mr-1" />{fmtDate(race.date)}</span>
                        <span><i className="ti ti-ruler-measure mr-1" />{race.distance}m</span>
                      </p>
                    </div>
                    <StatusPill status={race.status} />
                  </div>
                  {myEntry ? (
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: BRAND_LIGHT }}>&#x1F40E;</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{myEntry.horseName}</p>
                        <p className="text-xs text-slate-400">{myEntry.horseColor} &middot; {myEntry.horseAge}yo &middot; {myEntry.ownerName}</p>
                      </div>
                      <StatusPill status={myEntry.status} />
                    </div>
                  ) : (
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "#f3f4f6" }}>?</div>
                      <div>
                        <p className="text-sm text-slate-400">Not entered in this race</p>
                        <p className="text-xs text-slate-400">{race.venue} &middot; {race.date}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "stats" && (
        <>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Performance Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard label="Total Races" value={totalRaces} icon="flag" color={BRAND_TEXT} bg={BRAND_LIGHT} border={BRAND_BORDER} />
            <StatCard label="Wins (1st)" value={wins} icon="trophy" color="#b45309" bg="#fef3c7" border="#fde68a" />
            <StatCard label="Win Rate" value={winRate + "%"} icon="chart-line" color="#1d4ed8" bg="#eff6ff" border="#93c5fd" />
            <StatCard label="Podium Rate" value={podiumRate + "%"} icon="medal" color="#065f46" bg="#ecfdf5" border="#a7f3d0" />
          </div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">Race History</h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Race</th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Horse</th>
                  <th className="text-center p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pos.</th>
                  <th className="text-right p-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
                </tr>
              </thead>
              <tbody>
                {STATS_POOL.map((s, i) => (
                  <tr key={s.id} className={"border-b border-slate-100 " + (i % 2 === 0 ? "bg-white" : "bg-slate-50")}>
                    <td className="p-3 text-xs text-slate-400">{fmtDate(s.date)}</td>
                    <td className="p-3 text-sm font-semibold text-slate-800">{s.raceName}</td>
                    <td className="p-3 text-sm text-slate-600">{s.horseName}</td>
                    <td className="p-3 text-center">
                      <span className={"inline-block w-7 h-7 rounded-full text-xs font-black " + (s.position === 1 ? "bg-yellow-400 text-yellow-900" : s.position === 2 ? "bg-slate-300 text-slate-700" : s.position === 3 ? "bg-orange-300 text-orange-900" : "bg-slate-200 text-slate-600")}>
                        {s.position}
                      </span>
                    </td>
                    <td className="p-3 text-right text-xs text-slate-500">{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "tournament" && (
        <>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-start mb-3.5">
              <div>
                <h2 className="text-lg font-bold m-0 text-slate-800">{tournament.name}</h2>
                <p className="text-sm text-slate-500 mt-1 m-0">{tournament.organizer}</p>
              </div>
              <StatusPill status={tournament.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {([
                ["Location", tournament.location],
                ["Prize fund", fmtMillions(tournament.totalPrize)],
                ["Start", fmtDate(tournament.startDate)],
                ["End", fmtDate(tournament.endDate)],
                ["Deadline", fmtDate(tournament.registrationDeadline)],
                ["Status", tournament.status],
              ]).map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-xl p-2.5">
                  <div className="text-[11px] text-slate-400 mb-0.5">{k}</div>
                  <div className="text-sm font-semibold">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">All Races</h3>
          <div className="flex flex-col gap-2">
            {races.map((race) => {
              const mine = race.registrations.some((r) => r.jockeyName === user?.name);
              return (
                <div key={race.id} className="rounded-xl p-3.5 border transition-all"
                  style={{ background: mine ? BRAND_LIGHT : "#fff", borderColor: mine ? BRAND_BORDER : BORDER }}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{race.name}</span>
                      {mine && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ background: "#fff", color: BRAND_TEXT, borderColor: BRAND_BORDER }}>
                          YOUR RACE
                        </span>
                      )}
                    </div>
                    <StatusPill status={race.status} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span><i className="ti ti-map-pin mr-1" />{race.venue}</span>
                    <span><i className="ti ti-calendar mr-1" />{fmtDate(race.date)}</span>
                    <span><i className="ti ti-ruler-measure mr-1" />{race.distance}m &middot; {race.grade}</span>
                    <span><i className="ti ti-trophy mr-1" />${race.prizePool.toLocaleString()}</span>
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
