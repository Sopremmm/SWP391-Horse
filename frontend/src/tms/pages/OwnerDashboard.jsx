import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import { BRAND, BRAND_BORDER, BRAND_LIGHT, BRAND_TEXT, BORDER } from "../constants.js";
import { fmtDate, fmtDateTime, fmtMillions } from "../format.js";
import AppShell from "../components/layout/AppShell.jsx";
import StatusPill from "../components/common/StatusPill.jsx";
import SlidePanel from "../components/common/SlidePanel.jsx";

const INITIAL_HORSES = [
  { id: "H001", name: "Thunder Bolt", breed: "Thoroughbred", age: 4, weight: 520, color: "Bay", ownerOrg: "Sunrise Stables" },
  { id: "H002", name: "Silver Arrow", breed: "Thoroughbred", age: 5, weight: 510, color: "Grey", ownerOrg: "Blue River Farm" },
];

const JOCKEYS_POOL = [
  { id: "J01", name: "Miguel Torres",  license: "JLN-4821", nationality: "Mexico" },
  { id: "J02", name: "Carlos Ruiz",    license: "JLN-3156", nationality: "Spain" },
  { id: "J03", name: "Emma Sinclair",   license: "JLN-2201", nationality: "UK" },
  { id: "J04", name: "James O'Brien", license: "JLN-1893", nationality: "Ireland" },
  { id: "J05", name: "Yuki Tanaka",    license: "JLN-4022", nationality: "Japan" },
  { id: "J06", name: "Lucas Martini",  license: "JLN-2556", nationality: "Italy" },
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

export default function OwnerDashboard() {
  const { user, tournament, races, setRaces } = useApp();
  const [tab, setTab] = useState("overview");
  const [horses, setHorses] = useState(INITIAL_HORSES);
  const [invitations, setInvitations] = useState([]);
  const [toast, setToast] = useState(null);
  const [addHorseOpen, setAddHorseOpen] = useState(false);
  const [editHorse, setEditHorse] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(null);
  const [registerOpen, setRegisterOpen] = useState(null);
  const [horseForm, setHorseForm] = useState({ name: "", breed: "Thoroughbred", age: "", weight: "", color: "" });
  const [inviteForm, setInviteForm] = useState({ jockeyId: "", message: "" });
  const [regForm, setRegForm] = useState({ horseId: "", raceId: "", jockeyId: "", trainerName: "" });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const myHorses = horses.filter(h => h.ownerOrg === user?.org);

  const myRegs = races.flatMap(race =>
    race.registrations.filter(reg => reg.ownerName === user?.org).map(reg => ({
      ...reg, raceId: race.id, raceName: race.name, raceDate: race.date,
      raceVenue: race.venue, raceGrade: race.grade, raceDistance: race.distance,
      racePrize: race.prizePool, raceStatus: race.status,
    }))
  );

  const approved = myRegs.filter(r => r.status === "Approved").length;
  const pending = myRegs.filter(r => r.status === "Pending").length;

  const addHorse = (e) => {
    e.preventDefault();
    const h = { ...horseForm, id: "H" + Date.now(), ownerOrg: user?.org };
    setHorses(prev => [...prev, h]);
    setHorseForm({ name: "", breed: "Thoroughbred", age: "", weight: "", color: "" });
    setAddHorseOpen(false);
    showToast(h.name + " added successfully.");
  };

  const saveEditHorse = (e) => {
    e.preventDefault();
    setHorses(prev => prev.map(h => h.id === editHorse.id ? { ...h, ...editHorse } : h));
    setEditHorse(null);
    showToast("Horse updated successfully.");
  };

  const sendInvite = () => {
    if (!inviteForm.jockeyId) return;
    const jockey = JOCKEYS_POOL.find(j => j.id === inviteForm.jockeyId);
    setInvitations(prev => [...prev, {
      id: "INV" + Date.now(), horseId: inviteOpen.horseId, horseName: inviteOpen.horseName,
      jockeyId: jockey.id, jockeyName: jockey.name, license: jockey.license,
      status: "Pending", message: inviteForm.message, sentAt: new Date().toISOString(),
    }]);
    setInviteOpen(null);
    setInviteForm({ jockeyId: "", message: "" });
    showToast("Invitation sent to " + jockey.name + ".");
  };

  const registerHorseForRace = (e) => {
    e.preventDefault();
    if (!regForm.horseId || !regForm.raceId || !regForm.jockeyId || !regForm.trainerName.trim()) return;
    const horse = horses.find(h => h.id === regForm.horseId);
    const race = races.find(r => r.id === regForm.raceId);
    const jockey = JOCKEYS_POOL.find(j => j.id === regForm.jockeyId);
    if (!horse || !race || !jockey) return;
    const newReg = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      ownerName: user?.org,
      horseName: horse.name,
      horseAge: horse.age,
      horseColor: horse.color,
      jockeyName: jockey.name,
      licenseNo: jockey.license,
      trainerName: regForm.trainerName,
      raceName: race.name,
      grade: race.grade,
      status: "Pending",
      note: "",
    };
    setRaces(prev => prev.map(r => r.id === regForm.raceId ? { ...r, registrations: [...r.registrations, newReg] } : r));
    setRegForm({ horseId: "", raceId: "", jockeyId: "", trainerName: "" });
    setRegisterOpen(null);
    showToast(horse.name + " registered for " + race.name + ".");
  };

  const nav = [
    { id: "overview",    label: "Overview",    icon: "layout-dashboard" },
    { id: "horses",      label: "My Horses",  icon: "horse" },
    { id: "invitations", label: "Invitations", icon: "send" },
    { id: "schedule",    label: "Schedule",    icon: "calendar" },
    { id: "results",     label: "Results",     icon: "trophy" },
  ];

  return (
    <AppShell page={tab} setPage={setTab} nav={nav} subtitle={"Horse Owner \u2014 " + (user?.org || "")}>
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-lg"
          style={{ background: "#d1fae5", color: "#166534", border: "1px solid #86efac" }}>
          <i className="ti ti-circle-check mr-2" />{toast}
        </div>
      )}

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard label="My Horses" value={myHorses.length} icon="horse" color={BRAND_TEXT} bg={BRAND_LIGHT} border={BRAND_BORDER} />
            <StatCard label="Approved" value={approved} icon="circle-check" color="#065f46" bg="#ecfdf5" border="#a7f3d0" />
            <StatCard label="Pending" value={pending} icon="clock" color="#92400e" bg="#fef3c7" border="#fde68a" />
            <StatCard label="Total Races" value={races.length} icon="trophy" color="#1d4ed8" bg="#eff6ff" border="#93c5fd" />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 m-0 font-serif">{tournament.name}</h2>
                <p className="text-sm text-slate-500 mt-1 m-0">{tournament.organizer}</p>
              </div>
              <StatusPill status={tournament.status} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {[
                ["Prize fund", fmtMillions(tournament.totalPrize)],
                ["Reg. deadline", fmtDate(tournament.registrationDeadline)],
                ["Start", fmtDate(tournament.startDate)],
                ["End", fmtDate(tournament.endDate)],
              ].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-xl p-2.5">
                  <div className="text-[11px] text-slate-400 mb-0.5">{k}</div>
                  <div className="text-sm font-semibold">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-700 mb-3">My Recent Registrations</h3>
          <div className="flex flex-col gap-3">
            {myRegs.slice(0, 5).map(h => (
              <div key={h.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-800">{h.horseName}</p>
                  <p className="text-xs text-slate-400 mt-1">{h.raceName} &middot; {h.raceVenue} &middot; {fmtDate(h.raceDate)}</p>
                </div>
                <StatusPill status={h.status} />
              </div>
            ))}
            {myRegs.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <p className="text-slate-500 text-sm">No registrations yet. Go to My Horses to register.</p>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "horses" && (
        <>
          <div className="flex justify-between items-center mb-4 gap-3">
            <h2 className="text-lg font-bold text-slate-800 m-0">My Horses ({myHorses.length})</h2>
            <div className="flex gap-2">
              <button onClick={() => setRegisterOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #93c5fd" }}>
                <i className="ti ti-flag mr-1.5" />Register
              </button>
              <button onClick={() => setAddHorseOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: BRAND }}>
                <i className="ti ti-plus mr-1.5" />Add Horse
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myHorses.map(h => (
              <div key={h.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-28 flex items-center justify-center text-5xl" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)" }}>
                  &#x1F40E;
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{h.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{h.breed} &middot; {h.color} &middot; {h.age} yrs &middot; {h.weight}kg</p>
                  <div className="flex gap-2">
                    <button onClick={() => setEditHorse({ ...h })}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold" style={{ background: BRAND_LIGHT, color: BRAND_TEXT, border: "1px solid " + BRAND_BORDER }}>
                      <i className="ti ti-edit mr-1" />Edit
                    </button>
                    <button onClick={() => setInviteOpen({ horseId: h.id, horseName: h.name })}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: BRAND }}>
                      <i className="ti ti-send mr-1" />Invite
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {myHorses.length === 0 && (
              <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: BRAND_LIGHT, border: "1px solid " + BRAND_BORDER }}>
                  <i className="ti ti-horse text-2xl" style={{ color: BRAND_TEXT }} />
                </div>
                <p className="text-slate-500 text-sm">No horses yet. Add your first horse.</p>
                <button onClick={() => setAddHorseOpen(true)} className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: BRAND }}>Add Horse</button>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "invitations" && (
        <>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Jockey Invitations</h2>
          <div className="flex flex-col gap-3">
            {invitations.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: BRAND_LIGHT, border: "1px solid " + BRAND_BORDER }}>
                  <i className="ti ti-send text-2xl" style={{ color: BRAND_TEXT }} />
                </div>
                <p className="text-slate-500 text-sm">No invitations sent yet.</p>
                <p className="text-xs text-slate-400 mt-1">Go to My Horses and click Invite on a horse.</p>
              </div>
            )}
            {invitations.map(inv => (
              <div key={inv.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: BRAND_LIGHT, color: BRAND_TEXT }}>{inv.jockeyName[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{inv.jockeyName}</p>
                      <p className="text-xs text-slate-400">{inv.license}</p>
                    </div>
                  </div>
                  <StatusPill status={inv.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span><i className="ti ti-horse mr-1" />{inv.horseName}</span>
                  <span><i className="ti ti-send mr-1" />{fmtDateTime(inv.sentAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "schedule" && (
        <>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Race Schedule</h2>
          <div className="flex flex-col gap-4">
            {races.filter(r => r.status !== "Cancelled").map(race => {
              const myReg = race.registrations.find(reg => reg.ownerName === user?.org);
              return (
                <div key={race.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-800">{race.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: BRAND_LIGHT, color: BRAND_TEXT }}>{race.grade}</span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-3">
                        <span><i className="ti ti-map-pin mr-1" />{race.venue}</span>
                        <span><i className="ti ti-calendar mr-1" />{fmtDate(race.date)}</span>
                        <span><i className="ti ti-ruler-measure mr-1" />{race.distance}m</span>
                      </p>
                    </div>
                    <StatusPill status={race.status} />
                  </div>
                  {myReg ? (
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: BRAND_LIGHT }}>&#x1F40E;</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{myReg.horseName}</p>
                        <p className="text-xs text-slate-400">{myReg.horseColor} &middot; {myReg.horseAge}yo &middot; {myReg.jockeyName}</p>
                      </div>
                      <StatusPill status={myReg.status} />
                    </div>
                  ) : (
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "#f3f4f6" }}>?</div>
                      <div>
                        <p className="text-sm text-slate-400">Not registered for this race</p>
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

      {tab === "results" && (
        <>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Race Results &amp; Leaderboard</h2>
          <div className="flex flex-col gap-4">
            {races.filter(r => r.status === "Finished").length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: BRAND_LIGHT, border: "1px solid " + BRAND_BORDER }}>
                  <i className="ti ti-trophy text-2xl" style={{ color: BRAND_TEXT }} />
                </div>
                <p className="text-slate-500 text-sm">No race results published yet.</p>
              </div>
            )}
            {races.filter(r => r.status === "Finished").map(race => {
              const myReg = race.registrations.find(reg => reg.ownerName === user?.org);
              const winner = race.registrations.find(reg => reg.result === 1);
              return (
                <div key={race.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{race.name}</p>
                      <p className="text-xs text-slate-400">{race.venue} &middot; {fmtDate(race.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black" style={{ color: BRAND_TEXT }}>${race.prizePool.toLocaleString()}</p>
                      <StatusPill status="Finished" />
                    </div>
                  </div>
                  {winner && (
                    <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Winner</p>
                      <p className="text-base font-black text-slate-800">{winner.horseName}</p>
                      <p className="text-xs text-slate-500">{winner.jockeyName} &middot; ${race.prizePool.toLocaleString()} prize</p>
                    </div>
                  )}
                  {myReg && myReg.result ? (
                    <div className="p-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Your Result</p>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-slate-800">#{myReg.result}</span>
                        <span className="text-sm text-slate-700">{myReg.horseName}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No result for your horse in this race.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <SlidePanel open={addHorseOpen} onClose={() => setAddHorseOpen(false)} title="Add New Horse">
        <form onSubmit={addHorse} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Horse Name *</label>
            <input required value={horseForm.name}
              onChange={e => setHorseForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Thunder Bolt"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Breed</label>
              <select value={horseForm.breed}
                onChange={e => setHorseForm(f => ({ ...f, breed: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }}>
                <option>Thoroughbred</option><option>Arabian</option><option>Quarter Horse</option><option>Standardbred</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Color</label>
              <input value={horseForm.color}
                onChange={e => setHorseForm(f => ({ ...f, color: e.target.value }))}
                placeholder="e.g. Bay"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Age (yrs)</label>
              <input type="number" min="1" max="15" value={horseForm.age}
                onChange={e => setHorseForm(f => ({ ...f, age: e.target.value }))}
                placeholder="e.g. 4"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Weight (kg)</label>
              <input type="number" min="300" max="700" value={horseForm.weight}
                onChange={e => setHorseForm(f => ({ ...f, weight: e.target.value }))}
                placeholder="e.g. 520"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }} />
            </div>
          </div>
          <button type="submit" className="py-2.5 rounded-xl font-semibold text-white mt-2" style={{ background: BRAND }}>
            <i className="ti ti-plus mr-1.5" />Add Horse
          </button>
        </form>
      </SlidePanel>

      <SlidePanel open={!!editHorse} onClose={() => setEditHorse(null)} title={"Edit: " + (editHorse?.name || "")}>
        {editHorse && (
          <form onSubmit={saveEditHorse} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Horse Name *</label>
              <input required value={editHorse.name}
                onChange={e => setEditHorse(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Breed</label>
                <select value={editHorse.breed}
                  onChange={e => setEditHorse(f => ({ ...f, breed: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }}>
                  <option>Thoroughbred</option><option>Arabian</option><option>Quarter Horse</option><option>Standardbred</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Color</label>
                <input value={editHorse.color}
                  onChange={e => setEditHorse(f => ({ ...f, color: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Age (yrs)</label>
                <input type="number" min="1" max="15" value={editHorse.age}
                  onChange={e => setEditHorse(f => ({ ...f, age: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Weight (kg)</label>
                <input type="number" min="300" max="700" value={editHorse.weight}
                  onChange={e => setEditHorse(f => ({ ...f, weight: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }} />
              </div>
            </div>
            <button type="submit" className="py-2.5 rounded-xl font-semibold text-white mt-2" style={{ background: BRAND }}>
              <i className="ti ti-device-floppy mr-1.5" />Save Changes
            </button>
          </form>
        )}
      </SlidePanel>

      <SlidePanel open={!!inviteOpen} onClose={() => { setInviteOpen(null); setInviteForm({ jockeyId: "", message: "" }); }}
        title={"Invite Jockey \u2014 " + (inviteOpen?.horseName || "")}>
        <div className="flex flex-col gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700">
            <i className="ti ti-horse mr-1.5" />
            Inviting jockey to ride <strong>{inviteOpen?.horseName}</strong>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Select Jockey *</label>
            <select required value={inviteForm.jockeyId}
              onChange={e => setInviteForm(f => ({ ...f, jockeyId: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }}>
              <option value="">— Choose a jockey —</option>
              {JOCKEYS_POOL.map(j => (
                <option key={j.id} value={j.id}>{j.name} · {j.license} · {j.nationality}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Message (optional)</label>
            <textarea value={inviteForm.message}
              onChange={e => setInviteForm(f => ({ ...f, message: e.target.value }))}
              placeholder={"Dear jockey, you are invited to ride " + (inviteOpen?.horseName || "") + " in our upcoming races."}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2 resize-none" style={{ borderColor: BORDER }} />
          </div>
          <button onClick={sendInvite} className="py-2.5 rounded-xl font-semibold text-white mt-2" style={{ background: BRAND }}>
            <i className="ti ti-send mr-1.5" />Send Invitation
          </button>
        </div>
      </SlidePanel>

      <SlidePanel open={!!registerOpen} onClose={() => { setRegisterOpen(null); setRegForm({ horseId: "", raceId: "", jockeyId: "", trainerName: "" }); }}
        title="Register Horse for Race">
        <form onSubmit={registerHorseForRace} className="flex flex-col gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            <i className="ti ti-flag mr-1.5" />
            Submit a registration request for a race. It will be reviewed by the host.
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Select Horse *</label>
            <select required value={regForm.horseId}
              onChange={e => setRegForm(f => ({ ...f, horseId: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }}>
              <option value="">— Choose a horse —</option>
              {myHorses.map(h => (
                <option key={h.id} value={h.id}>{h.name} · {h.breed} · {h.color} · {h.age}yo</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Select Race *</label>
            <select required value={regForm.raceId}
              onChange={e => setRegForm(f => ({ ...f, raceId: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }}>
              <option value="">— Choose a race —</option>
              {races.filter(r => r.status !== "Cancelled").map(r => (
                <option key={r.id} value={r.id}>{r.name} · {r.venue} · {r.date} · {r.grade}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Assign Jockey *</label>
            <select required value={regForm.jockeyId}
              onChange={e => setRegForm(f => ({ ...f, jockeyId: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }}>
              <option value="">— Choose a jockey —</option>
              {JOCKEYS_POOL.map(j => (
                <option key={j.id} value={j.id}>{j.name} · {j.license} · {j.nationality}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Trainer Name *</label>
            <input required value={regForm.trainerName}
              onChange={e => setRegForm(f => ({ ...f, trainerName: e.target.value }))}
              placeholder="e.g. Williams"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2" style={{ borderColor: BORDER }} />
          </div>
          <button type="submit" className="py-2.5 rounded-xl font-semibold text-white mt-2" style={{ background: BRAND }}>
            <i className="ti ti-flag mr-1.5" />Submit Registration
          </button>
        </form>
      </SlidePanel>
    </AppShell>
  );
}
