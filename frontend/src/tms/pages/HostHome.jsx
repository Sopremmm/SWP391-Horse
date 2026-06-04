import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import {
  BRAND,
  BRAND_BORDER,
  BRAND_LIGHT,
  BRAND_TEXT,
  BORDER,
  SURFACE,
  TEXT_MUTED,
} from "../constants.js";
import { fmtDate, fmtMillions } from "../format.js";
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

export default function HostHome() {
  const { user, tournament, races } = useApp();
  const [tab, setTab] = useState("overview");

  const venueRaces = races.filter((r) => r.venue === user?.venue);
  const allRegs = venueRaces.flatMap((r) =>
    r.registrations.map((reg) => ({ ...reg, raceId: r.id, raceVenue: r.venue }))
  );
  const pending = allRegs.filter((r) => r.status === "Pending").length;
  const approved = allRegs.filter((r) => r.status === "Approved").length;

  const nav = [
    { id: "overview", label: "Overview", icon: "layout-dashboard" },
    { id: "races", label: "My Races", icon: "flag" },
    { id: "registrations", label: "Registrations", icon: "clipboard-list" },
  ];

  return (
    <AppShell page={tab} setPage={setTab} nav={nav} subtitle={`Host — ${user?.venue}`}>
      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard label="Races at Venue" value={venueRaces.length} icon="flag" color={BRAND_TEXT} bg={BRAND_LIGHT} border={BRAND_BORDER} />
            <StatCard label="Total Entries" value={allRegs.length} icon="users" color="#1d4ed8" bg="#eff6ff" border="#93c5fd" />
            <StatCard label="Pending Review" value={pending} icon="clock" color="#92400e" bg="#fef3c7" border="#fde68a" />
            <StatCard label="Approved" value={approved} icon="circle-check" color={BRAND_TEXT} bg={BRAND_LIGHT} border={BRAND_BORDER} />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-base font-bold m-0 text-slate-800">{tournament.name}</h2>
                <p className="text-sm text-slate-500 mt-1 m-0">{tournament.organizer}</p>
              </div>
              <StatusPill status={tournament.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {([
                ["Location", tournament.location],
                ["Prize fund", fmtMillions(tournament.totalPrize)],
                ["Deadline", fmtDate(tournament.registrationDeadline)],
                ["Your venue", user?.venue || ""],
              ]).map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-xl p-2.5">
                  <div className="text-[11px] text-slate-400 mb-0.5">{k}</div>
                  <div className="text-sm font-semibold">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "races" && (
        <div className="flex flex-col gap-3">
          {venueRaces.map((race) => (
            <div key={race.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-bold text-slate-800">{race.name}</span>
                <StatusPill status={race.status} />
              </div>
              <div className="text-sm text-slate-500 flex gap-4 flex-wrap mb-3">
                <span><i className="ti ti-calendar mr-1" />{fmtDate(race.date)} {race.time}</span>
                <span><i className="ti ti-ruler-measure mr-1" />{race.distance}m · {race.grade}</span>
                <span><i className="ti ti-users mr-1" />{race.registrations.length} entries</span>
                <span><i className="ti ti-trophy mr-1" />${race.prizePool.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <i className="ti ti-clock text-sm text-blue-600" />
                <span className="text-xs font-medium text-blue-700">{race.time} — {race.condition}</span>
              </div>
            </div>
          ))}
          {venueRaces.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: BRAND_LIGHT, border: `1px solid ${BRAND_BORDER}` }}>
                <i className="ti ti-flag text-2xl" style={{ color: BRAND_TEXT }} />
              </div>
              <p className="text-slate-500 text-sm">No races scheduled at your venue yet.</p>
            </div>
          )}
        </div>
      )}

      {tab === "registrations" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Horse", "Jockey", "Race", "Status"].map((h) => (
                  <th key={h} className="text-left p-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRegs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">No registrations yet.</td>
                </tr>
              )}
              {allRegs.map((reg) => (
                <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-slate-800">{reg.horseName}</td>
                  <td className="p-3 text-slate-600">{reg.jockeyName}</td>
                  <td className="p-3 text-slate-600">{reg.raceName}</td>
                  <td className="p-3"><StatusPill status={reg.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
