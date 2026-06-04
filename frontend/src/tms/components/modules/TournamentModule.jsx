import { useState } from "react";
import { uid } from "../../../constants.js";
import { BRAND_HOVER, BRAND_TEXT } from "../../../constants.js";
import { GRADES, CONDITIONS, RACE_STATUSES, TOURNAMENT_STATUSES } from "../../../constants.js";
import { fmtDate, fmtMillions } from "../../../format.js";
import { REFEREES_POOL } from "../../../referees.js";
import SectionTitle from "../common/SectionTitle.jsx";
import Card from "../common/Card.jsx";
import Field from "../common/Field.jsx";
import Input from "../common/Input.jsx";
import Select from "../common/Select.jsx";
import Textarea from "../common/Textarea.jsx";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";
import Alert from "../common/Alert.jsx";
import StatusPill from "../common/StatusPill.jsx";

const EMPTY_RACE = {
  name: "", venue: "", date: "", time: "14:00",
  distance: "1600", grade: "G1", prizePool: "100000",
  condition: "Firm", status: "Upcoming",
  refereeId: null, registrations: [],
};

export default function TournamentModule({ tournament, setTournament, races, setRaces }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...tournament });
  const [showAddRace, setShowAddRace] = useState(false);
  const [editRace, setEditRace] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saved, setSaved] = useState(false);

  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const setRField = (k) => (v) => setEditRace((r) => r ? { ...r, [k]: v } : r);

  const saveTournament = () => {
    setTournament(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const saveRace = () => {
    if (!editRace?.name || !editRace?.venue || !editRace?.date) return;
    const r = { ...editRace, distance: +editRace.distance, prizePool: +editRace.prizePool };
    if (editRace.id) {
      setRaces((rs) => rs.map((x) => (x.id === editRace.id ? r : x)));
    } else {
      setRaces((rs) => [...rs, { ...r, id: uid() }]);
    }
    setEditRace(null);
    setShowAddRace(false);
  };

  const deleteRace = (id) => {
    setRaces((rs) => rs.filter((r) => r.id !== id));
    setDeleteConfirm(null);
  };

  const counts = {
    total: races.length,
    upcoming: races.filter((r) => r.status === "Upcoming").length,
    running: races.filter((r) => r.status === "Running").length,
    finished: races.filter((r) => r.status === "Finished").length,
  };

  return (
    <div>
      <SectionTitle icon="tournament" sub="Configure and manage the overall tournament structure, details, and all races.">
        Create &amp; Manage Tournament
      </SectionTitle>

      {saved && <Alert type="success">Tournament details saved successfully.</Alert>}

      <Card className="mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h3 className="text-lg font-bold text-slate-800 m-0">{tournament.name}</h3>
              <StatusPill status={tournament.status} />
            </div>
            <p className="text-sm text-slate-500 m-0">{tournament.organizer}</p>
          </div>

          {!editing ? (
            <Button variant="ghost" onClick={() => { setForm({ ...tournament }); setEditing(true); }} icon="edit">
              Edit details
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button variant="primary" onClick={saveTournament} icon="device-floppy">Save</Button>
            </div>
          )}
        </div>

        {!editing && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {[
              ["Location", tournament.location, "map-pin"],
              ["Start date", fmtDate(tournament.startDate), "calendar-event"],
              ["End date", fmtDate(tournament.endDate), "calendar-off"],
              ["Prize fund", fmtMillions(tournament.totalPrize), "trophy"],
              ["Reg. deadline", fmtDate(tournament.registrationDeadline), "clock"],
              ["Contact", tournament.contactEmail, "mail"],
            ].map(([k, v, ic]) => (
              <div key={k} className="bg-slate-50 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400 mb-0.5 flex items-center gap-1">
                  <i className={`ti ti-${ic} text-[12px]`} />{k}
                </div>
                <div className="text-sm font-medium text-slate-800">{v}</div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <div>
            <Field label="Tournament name" required>
              <Input value={form.name} onChange={setField("name")} placeholder="Tournament name" />
            </Field>
            <div className="flex flex-wrap gap-3">
              <Field label="Organizer" required half>
                <Input value={form.organizer} onChange={setField("organizer")} />
              </Field>
              <Field label="Location" half>
                <Input value={form.location} onChange={setField("location")} />
              </Field>
              <Field label="Start date" required half>
                <Input type="date" value={form.startDate} onChange={setField("startDate")} />
              </Field>
              <Field label="End date" required half>
                <Input type="date" value={form.endDate} onChange={setField("endDate")} />
              </Field>
              <Field label="Registration deadline" half>
                <Input type="date" value={form.registrationDeadline} onChange={setField("registrationDeadline")} />
              </Field>
              <Field label="Total prize fund ($)" half>
                <Input type="number" value={form.totalPrize} onChange={setField("totalPrize")} />
              </Field>
              <Field label="Contact email" half>
                <Input type="email" value={form.contactEmail} onChange={setField("contactEmail")} />
              </Field>
              <Field label="Status" half>
                <Select value={form.status} onChange={setField("status")} options={TOURNAMENT_STATUSES} />
              </Field>
            </div>
            <Field label="Description">
              <Textarea value={form.description} onChange={setField("description")} placeholder="Tournament description..." />
            </Field>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-4 gap-2.5 mb-4">
        {[
          ["Total Races", counts.total, "flag", "#6b7280"],
          ["Upcoming", counts.upcoming, "clock", "#1e40af"],
          ["Running", counts.running, "player-play", BRAND_HOVER],
          ["Finished", counts.finished, "circle-check", BRAND_TEXT],
        ].map(([l, v, ic, c]) => (
          <div key={l} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <i className={`ti ti-${ic} text-sm`} style={{ color: c }} />{l}
            </div>
            <div className="text-2xl font-bold text-slate-800">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-slate-800 m-0">Races in this tournament</h3>
        <Button variant="primary" onClick={() => { setEditRace({ ...EMPTY_RACE }); setShowAddRace(true); }} icon="plus">
          Add race
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {races.map((race) => {
          const ref = REFEREES_POOL.find((r) => r.id === race.refereeId);
          return (
            <div key={race.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-slate-800">{race.name}</span>
                  <StatusPill status={race.status} />
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{race.grade}</span>
                </div>
                <div className="text-xs text-slate-500 flex gap-3.5 flex-wrap">
                  <span><i className="ti ti-map-pin text-[11px] mr-1" />{race.venue}</span>
                  <span><i className="ti ti-calendar text-[11px] mr-1" />{fmtDate(race.date)} {race.time}</span>
                  <span><i className="ti ti-ruler-measure text-[11px] mr-1" />{race.distance}m</span>
                  <span><i className="ti ti-users text-[11px] mr-1" />{race.registrations.filter((r) => r.status === "Approved").length} approved</span>
                  <span><i className="ti ti-trophy text-[11px] mr-1" />${race.prizePool.toLocaleString()}</span>
                  {ref && <span style={{ color: "#064e3b" }}><i className="ti ti-shield-check text-[11px] mr-1" />{ref.name}</span>}
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button small variant="ghost" onClick={() => { setEditRace({ ...race }); setShowAddRace(false); }} icon="edit">Edit</Button>
                <Button small variant="danger" onClick={() => setDeleteConfirm(race.id)} icon="trash">Delete</Button>
              </div>
            </div>
          );
        })}
        {races.length === 0 && (
          <div className="text-center text-slate-400 py-10 text-sm">
            No races yet. Add the first race to get started.
          </div>
        )}
      </div>

      {(showAddRace || (editRace && editRace.id)) && editRace && (
        <Modal title={editRace.id ? `Edit — ${editRace.name}` : "Add new race"} onClose={() => { setEditRace(null); setShowAddRace(false); }} wide>
          <div className="flex flex-wrap gap-x-3">
            <Field label="Race name" required className="w-full">
              <Input value={editRace.name || ""} onChange={setRField("name")} placeholder="e.g. Spring Classic" />
            </Field>
            <Field label="Venue" required half>
              <Input value={editRace.venue || ""} onChange={setRField("venue")} placeholder="e.g. Churchill Downs" />
            </Field>
            <Field label="Grade" half>
              <Select value={editRace.grade || "G1"} onChange={setRField("grade")} options={GRADES} />
            </Field>
            <Field label="Date" required half>
              <Input type="date" value={editRace.date || ""} onChange={setRField("date")} />
            </Field>
            <Field label="Time" half>
              <Input type="time" value={editRace.time || "14:00"} onChange={setRField("time")} />
            </Field>
            <Field label="Distance (m)" half>
              <Input type="number" value={editRace.distance?.toString() || "1600"} onChange={setRField("distance")} />
            </Field>
            <Field label="Track condition" half>
              <Select value={editRace.condition || "Firm"} onChange={setRField("condition")} options={CONDITIONS} />
            </Field>
            <Field label="Prize pool ($)" half>
              <Input type="number" value={editRace.prizePool?.toString() || "100000"} onChange={setRField("prizePool")} />
            </Field>
            <Field label="Status" half>
              <Select value={editRace.status || "Upcoming"} onChange={setRField("status")} options={RACE_STATUSES} />
            </Field>
          </div>
          {(!editRace.name || !editRace.venue || !editRace.date) && (
            <Alert type="warning">Please fill in all required fields (name, venue, date).</Alert>
          )}
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="ghost" onClick={() => { setEditRace(null); setShowAddRace(false); }}>Cancel</Button>
            <Button variant="primary" onClick={saveRace} disabled={!editRace.name || !editRace.venue || !editRace.date} icon="device-floppy">
              {editRace.id ? "Update race" : "Create race"}
            </Button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Confirm deletion" onClose={() => setDeleteConfirm(null)}>
          <Alert type="danger">
            This will permanently delete the race and all its registrations. This action cannot be undone.
          </Alert>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteRace(deleteConfirm)} icon="trash">Delete race</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
