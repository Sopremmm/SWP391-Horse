import { useApp } from "../AppContext.jsx";
import {
  BRAND,
  BRAND_BORDER,
  BRAND_LIGHT,
  BRAND_TEXT,
  BORDER,
  SURFACE_MUTED,
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

export default function OwnerDashboard() {
  const { user, tournament, races } = useApp();

  const myHorses = races.flatMap((race) =>
    race.registrations
      .filter((reg) => reg.ownerName === user?.org)
      .map((reg) => ({
        ...reg,
        raceId: race.id,
        raceName: race.name,
        raceDate: race.date,
        raceVenue: race.venue,
        raceGrade: race.grade,
        raceDistance: race.distance,
        racePrize: race.prizePool,
        raceStatus: race.status,
      }))
  );

  const approved = myHorses.filter((h) => h.status === "Approved").length;
  const pending = myHorses.filter((h) => h.status === "Pending").length;

  return (
    <AppShell page="overview" setPage={() => {}} nav={[]} subtitle={`Owner — ${user?.org}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="My Horses" value={myHorses.length} icon="horse" color={BRAND_TEXT} bg={BRAND_LIGHT} border={BRAND_BORDER} />
        <StatCard label="Approved" value={approved} icon="circle-check" color="#065f46" bg="#ecfdf5" border="#a7f3d0" />
        <StatCard label="Pending" value={pending} icon="clock" color="#92400e" bg="#fef3c7" border="#fde68a" />
        <StatCard label="Total Races" value={races.length} icon="trophy" color="#1d4ed8" bg="#eff6ff" border="#93c5fd" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-base font-bold m-0 text-slate-800">{tournament.name}</h2>
            <p className="text-sm text-slate-500 mt-1 m-0">{tournament.organizer}</p>
          </div>
          <StatusPill status={tournament.status} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {([
            ["Prize fund", fmtMillions(tournament.totalPrize)],
            ["Reg. deadline", fmtDate(tournament.registrationDeadline)],
            ["Start", fmtDate(tournament.startDate)],
            ["End", fmtDate(tournament.endDate)],
          ]).map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-xl p-2.5">
              <div className="text-[11px] text-slate-400 mb-0.5">{k}</div>
              <div className="text-sm font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-700 mb-3">My Horses in Tournament</h3>
      <div className="flex flex-col gap-3">
        {myHorses.map((h) => (
          <div key={h.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-base font-bold mb-0.5 text-slate-800">{h.horseName}</div>
                <div className="text-xs text-slate-500">
                  {h.horseColor}, {h.horseAge}yo · Trainer {h.trainerName}
                </div>
              </div>
              <StatusPill status={h.status} />
            </div>
            <div
              className="grid gap-2 p-3 rounded-lg text-xs text-slate-500"
              style={{ background: SURFACE_MUTED, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
            >
              <span><i className="ti ti-flag mr-1" />{h.raceName}</span>
              <span><i className="ti ti-map-pin mr-1" />{h.raceVenue}</span>
              <span><i className="ti ti-calendar mr-1" />{fmtDate(h.raceDate)}</span>
              <span><i className="ti ti-ruler-measure mr-1" />{h.raceDistance}m · {h.raceGrade}</span>
              <span><i className="ti ti-user mr-1" />{h.jockeyName}</span>
              <span><i className="ti ti-trophy mr-1" />${h.racePrize.toLocaleString()}</span>
            </div>
            {h.status === "Rejected" && h.note && (
              <div className="mt-2.5 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700">
                Rejection reason: {h.note}
              </div>
            )}
          </div>
        ))}
        {myHorses.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: BRAND_LIGHT, border: `1px solid ${BRAND_BORDER}` }}>
              <i className="ti ti-horse text-2xl" style={{ color: BRAND_TEXT }} />
            </div>
            <p className="text-slate-500 text-sm">
              No horses registered for {user?.org} yet.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
