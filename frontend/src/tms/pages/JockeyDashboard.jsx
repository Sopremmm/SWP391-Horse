import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import {
  BRAND,
  BRAND_BORDER,
  BRAND_LIGHT,
  BRAND_TEXT,
  BORDER,
  SURFACE,
  SURFACE_MUTED,
  TEXT_MUTED,
} from "../constants.js";
import { fmtDate, fmtDateTime, fmtMillions } from "../format.js";
import AppShell from "../components/layout/AppShell.jsx";
import StatusPill from "../components/common/StatusPill.jsx";

function StatCard({ label, value, icon, color, bg, border }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center border" style={{ background: bg, borderColor: border }}>
          <i className={`ti ti-${icon} text-base`} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-black text-slate-800">{value}</div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
    </div>
  );
}

export default function JockeyDashboard() {
  const { user, tournament, races } = useApp();
  const [tab, setTab] = useState("races");

  const myEntries = races.flatMap((race) =>
    race.registrations
      .filter((reg) => reg.jockeyName === user?.name)
      .map((reg) => ({
        ...reg,
        raceId: race.id,
        raceDate: race.date,
        raceTime: race.time,
        raceVenue: race.venue,
        raceStatus: race.status,
        raceGrade: race.grade,
        raceDistance: race.distance,
        racePrize: race.prizePool,
      }))
  );

  const pending = myEntries.filter((e) => e.status === "Pending").length;
  const approved = myEntries.filter((e) => e.status === "Approved").length;

  const nav = [
    { id: "races", label: "My Races", icon: "horse" },
    { id: "tournament", label: "Tournament", icon: "tournament" },
  ];

  return (
    <AppShell page={tab} setPage={setTab} nav={nav} subtitle={`Jockey — ${user?.name}`}>
      {tab === "races" && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
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
                      {" "}· {entry.horseColor}, {entry.horseAge}yo
                    </div>
                  </div>
                  <StatusPill status={entry.status} />
                </div>
                <div
                  className="grid gap-2 p-3 rounded-lg text-xs text-slate-500"
                  style={{ background: SURFACE_MUTED, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
                >
                  <span><i className="ti ti-map-pin mr-1" />{entry.raceVenue}</span>
                  <span><i className="ti ti-calendar mr-1" />{fmtDate(entry.raceDate)} {entry.raceTime}</span>
                  <span><i className="ti ti-ruler-measure mr-1" />{entry.raceDistance}m · {entry.raceGrade}</span>
                  <span><i className="ti ti-trophy mr-1" />${entry.racePrize.toLocaleString()}</span>
                </div>
                <div className="mt-2.5 text-xs text-slate-400">
                  Owner: {entry.ownerName} · Trainer: {entry.trainerName} · Submitted {fmtDateTime(entry.submittedAt)}
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
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: BRAND_LIGHT, border: `1px solid ${BRAND_BORDER}` }}>
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
                <div
                  key={race.id}
                  className="rounded-xl p-3.5 border transition-all"
                  style={{
                    background: mine ? BRAND_LIGHT : SURFACE,
                    borderColor: mine ? BRAND_BORDER : BORDER,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{race.name}</span>
                      {mine && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{ background: "#fff", color: BRAND_TEXT, borderColor: BRAND_BORDER }}
                        >
                          YOUR RACE
                        </span>
                      )}
                    </div>
                    <StatusPill status={race.status} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span><i className="ti ti-map-pin mr-1" />{race.venue}</span>
                    <span><i className="ti ti-calendar mr-1" />{fmtDate(race.date)}</span>
                    <span><i className="ti ti-ruler-measure mr-1" />{race.distance}m · {race.grade}</span>
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
