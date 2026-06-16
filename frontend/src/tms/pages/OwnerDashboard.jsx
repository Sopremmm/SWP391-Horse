import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import { fmtDate, fmtDateTime, fmtMillions } from "../format.js";
import HeritageLayout, { FONT_SERIF } from "../components/layout/HeritageLayout.jsx";
import {
  HeritageTabs,
  HeritageStat,
  HeritageCard,
  HeritageButton,
  HeritageStatusPill,
  HeritageToast,
  HeritagePageHeader,
  HeritageField,
  HeritageInput,
  HeritageSelect,
  HeritageTextarea,
  HeritageSlidePanel,
} from "../components/layout/HeritageUI.jsx";

const HORSE_EMOJI = "🐎";

const INITIAL_HORSES = [
  { id: "H001", name: "Thunder Bolt", breed: "Thoroughbred", age: 4, weight: 520, color: "Bay", ownerOrg: "Sunrise Stables" },
  { id: "H002", name: "Silver Arrow", breed: "Thoroughbred", age: 5, weight: 510, color: "Grey", ownerOrg: "Blue River Farm" },
];

const JOCKEYS_POOL = [
  { id: "J01", name: "Miguel Torres", license: "JLN-4821", nationality: "Mexico" },
  { id: "J02", name: "Carlos Ruiz", license: "JLN-3156", nationality: "Spain" },
  { id: "J03", name: "Emma Sinclair", license: "JLN-2201", nationality: "UK" },
  { id: "J04", name: "James O'Brien", license: "JLN-1893", nationality: "Ireland" },
  { id: "J05", name: "Yuki Tanaka", license: "JLN-4022", nationality: "Japan" },
  { id: "J06", name: "Lucas Martini", license: "JLN-2556", nationality: "Italy" },
];

const HORSE_COVERS = [
  "https://images.unsplash.com/photo-1538610111451-b006900ee327?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1505244208761-ba873587233e?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1518467166-367ae630fc92?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600&h=400",
  "https://images.unsplash.com/photo-1598974357801-cbca100e6543?auto=format&fit=crop&q=80&w=600&h=400",
];

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

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

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
    showToast(`${h.name} added successfully.`);
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
    showToast(`Invitation sent to ${jockey.name}.`);
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
    showToast(`${horse.name} registered for ${race.name}.`);
  };

  const nav = [
    { id: "overview", label: "Overview" },
    { id: "horses", label: "My Horses", count: myHorses.length },
    { id: "invitations", label: "Invitations", count: invitations.length },
    { id: "schedule", label: "Schedule" },
    { id: "results", label: "Results" },
  ];

  return (
    <HeritageLayout role="owner" subtitle={`Horse Owner — ${user?.org || ""}`}>
      <HeritagePageHeader
        eyebrow={`Horse Owner · ${user?.org || "—"}`}
        title={tournament.name}
        subtitle={tournament.organizer}
      />

      <HeritageTabs tabs={nav} active={tab} onChange={setTab} />

      <section style={{ paddingBlock: "clamp(40px, 5vw, 56px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          {tab === "overview" && (
            <>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", marginBottom: 40 }}
              >
                <HeritageStat value={myHorses.length} label="My Horses" />
                <HeritageStat value={approved} label="Approved" color="#166534" />
                <HeritageStat value={pending} label="Pending" color="#b8860b" />
                <HeritageStat value={races.length} label="Total Races" color="#1e40af" />
              </div>

              <HeritageCard padding={32} style={{ marginBottom: 32 }}>
                <div className="flex justify-between items-start flex-wrap gap-4" style={{ marginBottom: 24 }}>
                  <div>
                    <p className="m-0" style={{ color: "#747b75", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Current Tournament
                    </p>
                    <h2
                      className="m-0"
                      style={{ color: "#002a15", fontSize: "1.7rem", fontWeight: 500, marginTop: 6, fontFamily: FONT_SERIF }}
                    >
                      {tournament.name}
                    </h2>
                    <p className="m-0" style={{ marginTop: 6, color: "#555e58", fontSize: "0.92rem" }}>
                      {tournament.organizer}
                    </p>
                  </div>
                  <HeritageStatusPill status={tournament.status} />
                </div>
                <div
                  className="grid"
                  style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}
                >
                  {[
                    { k: "Prize Fund", v: fmtMillions(tournament.totalPrize) },
                    { k: "Reg. Deadline", v: fmtDate(tournament.registrationDeadline) },
                    { k: "Start", v: fmtDate(tournament.startDate) },
                    { k: "End", v: fmtDate(tournament.endDate) },
                  ].map((f) => (
                    <div key={f.k} style={{ padding: 14, background: "#f7f6f1", borderRadius: 6 }}>
                      <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        {f.k}
                      </p>
                      <p className="m-0" style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700, marginTop: 4 }}>
                        {f.v}
                      </p>
                    </div>
                  ))}
                </div>
              </HeritageCard>

              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 20, fontFamily: FONT_SERIF }}>
                My Recent Registrations
              </h2>
              <div className="grid gap-3">
                {myRegs.slice(0, 5).map(h => (
                  <HeritageCard key={h.id} padding={20}>
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div>
                        <p className="m-0" style={{ color: "#002a15", fontSize: "1.05rem", fontWeight: 700, fontFamily: FONT_SERIF }}>
                          {h.horseName}
                        </p>
                        <p className="m-0" style={{ marginTop: 4, color: "#747b75", fontSize: "0.82rem" }}>
                          {h.raceName} · {h.raceVenue} · {fmtDate(h.raceDate)}
                        </p>
                      </div>
                      <HeritageStatusPill status={h.status} />
                    </div>
                  </HeritageCard>
                ))}
                {myRegs.length === 0 && (
                  <HeritageCard padding={64} style={{ textAlign: "center" }}>
                    <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>
                      No registrations yet. Go to My Horses to register.
                    </p>
                  </HeritageCard>
                )}
              </div>
            </>
          )}

          {tab === "horses" && (
            <>
              <div className="flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: 24 }}>
                <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                  My Horses ({myHorses.length})
                </h2>
                <div className="flex" style={{ gap: 8 }}>
                  <HeritageButton variant="outline" onClick={() => setRegisterOpen(true)}>
                    Register
                  </HeritageButton>
                  <HeritageButton onClick={() => setAddHorseOpen(true)}>
                    Add Horse
                  </HeritageButton>
                </div>
              </div>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
              >
                {myHorses.map((h, idx) => (
                  <HeritageCard key={h.id} padding={0} style={{ overflow: "hidden" }}>
                    <div
                      className="relative overflow-hidden"
                      style={{ height: 160, background: "#e4e1d7" }}
                    >
                      <img
                        src={HORSE_COVERS[idx % HORSE_COVERS.length]}
                        alt={h.name}
                        className="block w-full h-full object-cover"
                      />
                    </div>
                    <div style={{ padding: 20 }}>
                      <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                        {h.name}
                      </h3>
                      <p className="m-0" style={{ color: "#747b75", fontSize: "0.82rem", marginTop: 4 }}>
                        {h.breed} · {h.color} · {h.age} yrs · {h.weight}kg
                      </p>
                      <div className="flex" style={{ gap: 8, marginTop: 16 }}>
                        <HeritageButton size="sm" variant="outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => setEditHorse({ ...h })}>
                          Edit
                        </HeritageButton>
                        <HeritageButton size="sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setInviteOpen({ horseId: h.id, horseName: h.name })}>
                          Invite
                        </HeritageButton>
                      </div>
                    </div>
                  </HeritageCard>
                ))}
                {myHorses.length === 0 && (
                  <HeritageCard padding={64} style={{ textAlign: "center" }}>
                    <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No horses yet.</p>
                  </HeritageCard>
                )}
              </div>
            </>
          )}

          {tab === "invitations" && (
            <>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 24, fontFamily: FONT_SERIF }}>
                Jockey Invitations
              </h2>
              <div className="grid gap-3">
                {invitations.length === 0 ? (
                  <HeritageCard padding={64} style={{ textAlign: "center" }}>
                    <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No invitations sent yet.</p>
                    <p className="m-0" style={{ color: "#747b75", fontSize: "0.82rem", marginTop: 8 }}>
                      Go to My Horses and click Invite on a horse.
                    </p>
                  </HeritageCard>
                ) : (
                  invitations.map(inv => (
                    <HeritageCard key={inv.id} padding={24}>
                      <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 12 }}>
                        <div className="flex items-center" style={{ gap: 14 }}>
                          <span
                            className="grid place-items-center"
                            style={{ width: 48, height: 48, borderRadius: 999, background: "#002a15", color: "#ffdea5", fontSize: "1rem", fontWeight: 800 }}
                          >
                            {inv.jockeyName[0]}
                          </span>
                          <div>
                            <p className="m-0" style={{ color: "#002a15", fontSize: "1.05rem", fontWeight: 700, fontFamily: FONT_SERIF }}>
                              {inv.jockeyName}
                            </p>
                            <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 2 }}>
                              {inv.license}
                            </p>
                          </div>
                        </div>
                        <HeritageStatusPill status={inv.status} />
                      </div>
                      <p className="m-0" style={{ color: "#747b75", fontSize: "0.82rem" }}>
                        Invited to ride {inv.horseName} · {fmtDateTime(inv.sentAt)}
                      </p>
                    </HeritageCard>
                  ))
                )}
              </div>
            </>
          )}

          {tab === "schedule" && (
            <>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 24, fontFamily: FONT_SERIF }}>
                Race Schedule
              </h2>
              <div className="grid gap-4">
                {races.filter(r => r.status !== "Cancelled").map(race => {
                  const myReg = race.registrations.find(reg => reg.ownerName === user?.org);
                  return (
                    <HeritageCard key={race.id} padding={0} style={{ overflow: "hidden" }}>
                      <div className="flex items-center justify-between flex-wrap gap-3" style={{ padding: 24, borderBottom: "1px solid #f0ede4" }}>
                        <div>
                          <div className="flex items-center" style={{ gap: 10, marginBottom: 4 }}>
                            <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                              {race.name}
                            </h3>
                            <span style={{ padding: "3px 9px", background: "#f0ede4", color: "#002a15", fontSize: "0.7rem", fontWeight: 800, borderRadius: 3, letterSpacing: "0.06em" }}>
                              {race.grade}
                            </span>
                          </div>
                          <p className="m-0" style={{ color: "#747b75", fontSize: "0.85rem" }}>
                            {race.venue} · {fmtDate(race.date)} · {race.distance}m
                          </p>
                        </div>
                        <HeritageStatusPill status={race.status} />
                      </div>
                      <div className="flex items-center flex-wrap" style={{ padding: 20, gap: 14 }}>
                        {myReg ? (
                          <>
                            <span
                              className="grid place-items-center"
                              style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,222,165,0.4)", fontSize: "1.2rem" }}
                            >
                              {HORSE_EMOJI}
                            </span>
                            <div className="flex-1">
                              <p className="m-0" style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>
                                {myReg.horseName}
                              </p>
                              <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 2 }}>
                                {myReg.horseColor} · {myReg.horseAge}yo · {myReg.jockeyName}
                              </p>
                            </div>
                            <HeritageStatusPill status={myReg.status} />
                          </>
                        ) : (
                          <p className="m-0" style={{ color: "#747b75", fontSize: "0.9rem" }}>
                            You haven&apos;t registered a horse for this race yet.
                          </p>
                        )}
                      </div>
                    </HeritageCard>
                  );
                })}
              </div>
            </>
          )}

          {tab === "results" && (
            <>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 24, fontFamily: FONT_SERIF }}>
                Race Results &amp; Leaderboard
              </h2>
              <div className="grid gap-4">
                {races.filter(r => r.status === "Finished").length === 0 && (
                  <HeritageCard padding={64} style={{ textAlign: "center" }}>
                    <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No race results published yet.</p>
                  </HeritageCard>
                )}
                {races.filter(r => r.status === "Finished").map(race => {
                  const myReg = race.registrations.find(reg => reg.ownerName === user?.org);
                  const winner = race.registrations.find(reg => reg.result === 1);
                  return (
                    <HeritageCard key={race.id} padding={0} style={{ overflow: "hidden" }}>
                      <div className="flex items-center justify-between flex-wrap gap-3" style={{ padding: 24, borderBottom: "1px solid #f0ede4" }}>
                        <div>
                          <p className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                            {race.name}
                          </p>
                          <p className="m-0" style={{ color: "#747b75", fontSize: "0.82rem", marginTop: 4 }}>
                            {race.venue} · {fmtDate(race.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="m-0" style={{ color: "#002a15", fontSize: "1.05rem", fontWeight: 800 }}>
                            ${race.prizePool.toLocaleString()}
                          </p>
                          <HeritageStatusPill status="Finished" />
                        </div>
                      </div>
                      {winner && (
                        <div style={{ padding: 18, background: "rgba(255,222,165,0.4)", borderBottom: "1px solid rgba(215,211,199,0.4)" }}>
                          <p className="m-0" style={{ color: "#002a15", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                            Winner
                          </p>
                          <p className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, marginTop: 4, fontFamily: FONT_SERIF }}>
                            {winner.horseName}
                          </p>
                          <p className="m-0" style={{ color: "#555e58", fontSize: "0.82rem", marginTop: 2 }}>
                            {winner.jockeyName} · ${race.prizePool.toLocaleString()} prize
                          </p>
                        </div>
                      )}
                      <div style={{ padding: 18 }}>
                        {myReg && myReg.result ? (
                          <div className="flex items-center" style={{ gap: 12 }}>
                            <span style={{ color: "#002a15", fontSize: "1.4rem", fontWeight: 700, fontFamily: FONT_SERIF }}>
                              #{myReg.result}
                            </span>
                            <span style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>
                              {myReg.horseName}
                            </span>
                          </div>
                        ) : (
                          <p className="m-0" style={{ color: "#747b75", fontSize: "0.85rem", textAlign: "center" }}>
                            No result for your horse in this race.
                          </p>
                        )}
                      </div>
                    </HeritageCard>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <HeritageToast message={toast} onClose={() => setToast(null)} />

      <HeritageSlidePanel
        open={addHorseOpen}
        onClose={() => setAddHorseOpen(false)}
        title="Add New Horse"
      >
        <form onSubmit={addHorse} className="grid gap-4">
          <HeritageField label="Horse Name" required>
            <HeritageInput
              value={horseForm.name}
              onChange={(e) => setHorseForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Thunder Bolt"
              required
            />
          </HeritageField>
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <HeritageField label="Breed">
              <HeritageSelect value={horseForm.breed} onChange={(e) => setHorseForm(f => ({ ...f, breed: e.target.value }))}>
                <option>Thoroughbred</option><option>Arabian</option><option>Quarter Horse</option><option>Standardbred</option>
              </HeritageSelect>
            </HeritageField>
            <HeritageField label="Color">
              <HeritageInput
                value={horseForm.color}
                onChange={(e) => setHorseForm(f => ({ ...f, color: e.target.value }))}
                placeholder="e.g. Bay"
              />
            </HeritageField>
            <HeritageField label="Age (yrs)">
              <HeritageInput
                type="number" min="1" max="15"
                value={horseForm.age}
                onChange={(e) => setHorseForm(f => ({ ...f, age: e.target.value }))}
                placeholder="e.g. 4"
              />
            </HeritageField>
            <HeritageField label="Weight (kg)">
              <HeritageInput
                type="number" min="300" max="700"
                value={horseForm.weight}
                onChange={(e) => setHorseForm(f => ({ ...f, weight: e.target.value }))}
                placeholder="e.g. 520"
              />
            </HeritageField>
          </div>
          <HeritageButton type="submit" size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
            Add Horse
          </HeritageButton>
        </form>
      </HeritageSlidePanel>

      <HeritageSlidePanel
        open={!!editHorse}
        onClose={() => setEditHorse(null)}
        title={`Edit: ${editHorse?.name || ""}`}
      >
        {editHorse && (
          <form onSubmit={saveEditHorse} className="grid gap-4">
            <HeritageField label="Horse Name" required>
              <HeritageInput
                value={editHorse.name}
                onChange={(e) => setEditHorse(f => ({ ...f, name: e.target.value }))}
                required
              />
            </HeritageField>
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <HeritageField label="Breed">
                <HeritageSelect value={editHorse.breed} onChange={(e) => setEditHorse(f => ({ ...f, breed: e.target.value }))}>
                  <option>Thoroughbred</option><option>Arabian</option><option>Quarter Horse</option><option>Standardbred</option>
                </HeritageSelect>
              </HeritageField>
              <HeritageField label="Color">
                <HeritageInput value={editHorse.color} onChange={(e) => setEditHorse(f => ({ ...f, color: e.target.value }))} />
              </HeritageField>
              <HeritageField label="Age (yrs)">
                <HeritageInput type="number" value={editHorse.age} onChange={(e) => setEditHorse(f => ({ ...f, age: e.target.value }))} />
              </HeritageField>
              <HeritageField label="Weight (kg)">
                <HeritageInput type="number" value={editHorse.weight} onChange={(e) => setEditHorse(f => ({ ...f, weight: e.target.value }))} />
              </HeritageField>
            </div>
            <HeritageButton type="submit" size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
              Save Changes
            </HeritageButton>
          </form>
        )}
      </HeritageSlidePanel>

      <HeritageSlidePanel
        open={!!inviteOpen}
        onClose={() => { setInviteOpen(null); setInviteForm({ jockeyId: "", message: "" }); }}
        title={`Invite Jockey — ${inviteOpen?.horseName || ""}`}
      >
        <div className="grid gap-4">
          <div
            style={{ padding: 14, background: "rgba(255,222,165,0.4)", borderRadius: 4, fontSize: "0.85rem", color: "#002a15" }}
          >
            Inviting jockey to ride <strong>{inviteOpen?.horseName}</strong>
          </div>
          <HeritageField label="Select Jockey" required>
            <HeritageSelect
              value={inviteForm.jockeyId}
              onChange={(e) => setInviteForm(f => ({ ...f, jockeyId: e.target.value }))}
            >
              <option value="">— Choose a jockey —</option>
              {JOCKEYS_POOL.map(j => (
                <option key={j.id} value={j.id}>{j.name} · {j.license} · {j.nationality}</option>
              ))}
            </HeritageSelect>
          </HeritageField>
          <HeritageField label="Message" hint="Optional — add a personal note for the jockey.">
            <HeritageTextarea
              value={inviteForm.message}
              onChange={(e) => setInviteForm(f => ({ ...f, message: e.target.value }))}
              placeholder={`You are invited to ride ${inviteOpen?.horseName || ""} in our upcoming races.`}
              rows={4}
            />
          </HeritageField>
          <HeritageButton size="lg" onClick={sendInvite} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
            Send Invitation
          </HeritageButton>
        </div>
      </HeritageSlidePanel>

      <HeritageSlidePanel
        open={!!registerOpen}
        onClose={() => { setRegisterOpen(null); setRegForm({ horseId: "", raceId: "", jockeyId: "", trainerName: "" }); }}
        title="Register Horse for Race"
      >
        <form onSubmit={registerHorseForRace} className="grid gap-4">
          <div
            style={{ padding: 14, background: "#dbeafe", borderRadius: 4, fontSize: "0.85rem", color: "#1e40af" }}
          >
            Submit a registration request. It will be reviewed by the host.
          </div>
          <HeritageField label="Select Horse" required>
            <HeritageSelect
              value={regForm.horseId}
              onChange={(e) => setRegForm(f => ({ ...f, horseId: e.target.value }))}
            >
              <option value="">— Choose a horse —</option>
              {myHorses.map(h => (
                <option key={h.id} value={h.id}>{h.name} · {h.breed} · {h.color} · {h.age}yo</option>
              ))}
            </HeritageSelect>
          </HeritageField>
          <HeritageField label="Select Race" required>
            <HeritageSelect
              value={regForm.raceId}
              onChange={(e) => setRegForm(f => ({ ...f, raceId: e.target.value }))}
            >
              <option value="">— Choose a race —</option>
              {races.filter(r => r.status !== "Cancelled").map(r => (
                <option key={r.id} value={r.id}>{r.name} · {r.venue} · {r.date} · {r.grade}</option>
              ))}
            </HeritageSelect>
          </HeritageField>
          <HeritageField label="Assign Jockey" required>
            <HeritageSelect
              value={regForm.jockeyId}
              onChange={(e) => setRegForm(f => ({ ...f, jockeyId: e.target.value }))}
            >
              <option value="">— Choose a jockey —</option>
              {JOCKEYS_POOL.map(j => (
                <option key={j.id} value={j.id}>{j.name} · {j.license} · {j.nationality}</option>
              ))}
            </HeritageSelect>
          </HeritageField>
          <HeritageField label="Trainer Name" required>
            <HeritageInput
              value={regForm.trainerName}
              onChange={(e) => setRegForm(f => ({ ...f, trainerName: e.target.value }))}
              placeholder="e.g. Williams"
              required
            />
          </HeritageField>
          <HeritageButton type="submit" size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
            Submit Registration
          </HeritageButton>
        </form>
      </HeritageSlidePanel>
    </HeritageLayout>
  );
}
