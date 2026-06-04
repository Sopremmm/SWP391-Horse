import { useState } from "react";
import { uid } from "../../utils/constants";
import { GOLD } from "../../utils/constants";
import { GRADES, CONDITIONS, RACE_STATUSES, TOURNAMENT_STATUSES } from "../../utils/constants";
import { fmtDate, fmtMillions } from "../../utils/format";
import { REFEREES_POOL } from "../../data/referees";

import SectionTitle from "../common/SectionTitle";
import Card        from "../common/Card";
import Field       from "../common/Field";
import Input       from "../common/Input";
import Select      from "../common/Select";
import Textarea    from "../common/Textarea";
import Button      from "../common/Button";
import Modal       from "../common/Modal";
import Alert       from "../common/Alert";
import StatusPill  from "../common/StatusPill";

const EMPTY_RACE = {
  name: "", venue: "", date: "", time: "14:00",
  distance: "1600", grade: "G1", prizePool: "100000",
  condition: "Firm", status: "Upcoming",
  refereeId: null, registrations: [],
};

export default function TournamentModule({ tournament, setTournament, races, setRaces }) {
  const [editing, setEditing]               = useState(false);
  const [form, setForm]                     = useState({ ...tournament });
  const [showAddRace, setShowAddRace]       = useState(false);
  const [editRace, setEditRace]             = useState(null);
  const [deleteConfirm, setDeleteConfirm]    = useState(null);
  const [saved, setSaved]                   = useState(false);

  const setField  = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const setRField = (k) => (v) => setEditRace((r) => ({ ...r, [k]: v }));

  /* ── Save tournament ── */
  const saveTournament = () => {
    setTournament(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── Save / create race ── */
  const saveRace = () => {
    if (!editRace.name || !editRace.venue || !editRace.date) return;
    const r = { ...editRace, distance: +editRace.distance, prizePool: +editRace.prizePool };
    if (editRace.id) {
      setRaces((rs) => rs.map((x) => (x.id === editRace.id ? r : x)));
    } else {
      setRaces((rs) => [...rs, { ...r, id: uid() }]);
    }
    setEditRace(null);
    setShowAddRace(false);
  };

  /* ── Delete race ── */
  const deleteRace = (id) => {
    setRaces((rs) => rs.filter((r) => r.id !== id));
    setDeleteConfirm(null);
  };

  const counts = {
    total:    races.length,
    upcoming: races.filter((r) => r.status === "Upcoming").length,
    running:  races.filter((r) => r.status === "Running").length,
    finished: races.filter((r) => r.status === "Finished").length,
  };

  return (
    <div>
      <SectionTitle icon="tournament" sub="Configure and manage the overall tournament structure, details, and all races.">
        Create &amp; Manage Tournament
      </SectionTitle>

      {saved && <Alert type="success">Tournament details saved successfully.</Alert>}

      {/* ── Tournament info card ── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>{tournament.name}</h3>
              <StatusPill status={tournament.status} />
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>{tournament.organizer}</p>
          </div>

          {!editing ? (
            <Button variant="ghost" onClick={() => { setForm({ ...tournament }); setEditing(true); }} icon="edit">
              Edit details
            </Button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button variant="primary" onClick={saveTournament} icon="device-floppy">Save</Button>
            </div>
          )}
        </div>

        {/* View mode */}
        {!editing && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
            {[
              ["Location",        tournament.location,                       "map-pin"       ],
              ["Start date",      fmtDate(tournament.startDate),             "calendar-event"],
              ["End date",        fmtDate(tournament.endDate),               "calendar-off"  ],
              ["Prize fund",      fmtMillions(tournament.totalPrize),        "trophy"        ],
              ["Reg. deadline",   fmtDate(tournament.registrationDeadline),  "clock"         ],
              ["Contact",         tournament.contactEmail,                   "mail"          ],
            ].map(([k, v, ic]) => (
              <div key={k} style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}>
                  <i className={`ti ti-${ic}`} style={{ fontSize: 12 }} aria-hidden />{k}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Edit mode */}
        {editing && (
          <div>
            <Field label="Tournament name" required>
              <Input value={form.name} onChange={setField("name")} placeholder="Tournament name" />
            </Field>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Field label="Organizer"             required half><Input value={form.organizer}               onChange={setField("organizer")} /></Field>
              <Field label="Location"              half>        <Input value={form.location}                onChange={setField("location")} /></Field>
              <Field label="Start date"            required half><Input type="date" value={form.startDate}   onChange={setField("startDate")} /></Field>
              <Field label="End date"              required half><Input type="date" value={form.endDate}     onChange={setField("endDate")} /></Field>
              <Field label="Registration deadline" half><Input type="date" value={form.registrationDeadline} onChange={setField("registrationDeadline")} /></Field>
              <Field label="Total prize fund ($)"  half><Input type="number" value={form.totalPrize}        onChange={setField("totalPrize")} /></Field>
              <Field label="Contact email"         half><Input type="email" value={form.contactEmail}       onChange={setField("contactEmail")} /></Field>
              <Field label="Status"                half>
                <Select value={form.status} onChange={setField("status")} options={TOURNAMENT_STATUSES} />
              </Field>
            </div>
            <Field label="Description">
              <Textarea value={form.description} onChange={setField("description")} placeholder="Tournament description..." />
            </Field>
          </div>
        )}
      </Card>

      {/* ── Stat counters ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          ["Total Races", counts.total,    "flag",         "#6B7280"],
          ["Upcoming",    counts.upcoming,  "clock",        "#1E40AF"],
          ["Running",    counts.running,   "player-play",  "#92400E"],
          ["Finished",   counts.finished,  "circle-check", "#166534"],
        ].map(([l, v, ic, c]) => (
          <div key={l} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#9CA3AF", fontSize: 12, marginBottom: 4 }}>
              <i className={`ti ti-${ic}`} style={{ fontSize: 13, color: c }} aria-hidden />{l}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Races list ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>Races in this tournament</h3>
        <Button variant="primary" onClick={() => { setEditRace({ ...EMPTY_RACE }); setShowAddRace(true); }} icon="plus">
          Add race
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {races.map((race) => {
          const ref = REFEREES_POOL.find((r) => r.id === race.refereeId);
          return (
            <div key={race.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{race.name}</span>
                  <StatusPill status={race.status} />
                  <span style={{ fontSize: 11, background: "#F3F4F6", color: "#374151", padding: "1px 7px", borderRadius: 20, fontWeight: 500 }}>{race.grade}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <span><i className="ti ti-map-pin"       style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{race.venue}</span>
                  <span><i className="ti ti-calendar"      style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{fmtDate(race.date)} {race.time}</span>
                  <span><i className="ti ti-ruler-measure" style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{race.distance}m</span>
                  <span><i className="ti ti-users"         style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{race.registrations.filter((r) => r.status === "Approved").length} approved</span>
                  <span><i className="ti ti-trophy"        style={{ fontSize: 11, marginRight: 3 }} aria-hidden />${race.prizePool.toLocaleString()}</span>
                  {ref && <span style={{ color: GOLD }}><i className="ti ti-shield-check" style={{ fontSize: 11, marginRight: 3 }} aria-hidden />{ref.name}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button small variant="ghost" onClick={() => { setEditRace({ ...race }); setShowAddRace(false); }} icon="edit">Edit</Button>
                <Button small variant="danger" onClick={() => setDeleteConfirm(race.id)} icon="trash">Delete</Button>
              </div>
            </div>
          );
        })}
        {races.length === 0 && (
          <div style={{ textAlign: "center", color: "#9CA3AF", padding: "40px 0", fontSize: 14 }}>
            No races yet. Add the first race to get started.
          </div>
        )}
      </div>

      {/* ── Add / Edit race modal ── */}
      {(showAddRace || (editRace && editRace.id)) && editRace && (
        <Modal title={editRace.id ? `Edit — ${editRace.name}` : "Add new race"} onClose={() => { setEditRace(null); setShowAddRace(false); }} wide>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 12px" }}>
            <Field label="Race name" required><Input value={editRace.name}      onChange={setRField("name")}      placeholder="e.g. Spring Classic" /></Field>
            <Field label="Venue"     required half><Input value={editRace.venue}     onChange={setRField("venue")}     placeholder="e.g. Churchill Downs" /></Field>
            <Field label="Grade"     half><Select value={editRace.grade}     onChange={setRField("grade")}     options={GRADES} /></Field>
            <Field label="Date"      required half><Input type="date"   value={editRace.date}      onChange={setRField("date")} /></Field>
            <Field label="Time"      half><Input type="time"   value={editRace.time}      onChange={setRField("time")} /></Field>
            <Field label="Distance (m)"    half><Input type="number" value={editRace.distance}  onChange={setRField("distance")} /></Field>
            <Field label="Track condition" half><Select value={editRace.condition} onChange={setRField("condition")} options={CONDITIONS} /></Field>
            <Field label="Prize pool ($)"  half><Input type="number" value={editRace.prizePool} onChange={setRField("prizePool")} /></Field>
            <Field label="Status"          half><Select value={editRace.status}    onChange={setRField("status")}    options={RACE_STATUSES} /></Field>
          </div>
          {(!editRace.name || !editRace.venue || !editRace.date) && (
            <Alert type="warning">Please fill in all required fields (name, venue, date).</Alert>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => { setEditRace(null); setShowAddRace(false); }}>Cancel</Button>
            <Button variant="primary" onClick={saveRace} disabled={!editRace.name || !editRace.venue || !editRace.date} icon="device-floppy">
              {editRace.id ? "Update race" : "Create race"}
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Delete confirm modal ── */}
      {deleteConfirm && (
        <Modal title="Confirm deletion" onClose={() => setDeleteConfirm(null)}>
          <Alert type="danger">
            This will permanently delete the race and all its registrations. This action cannot be undone.
          </Alert>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteRace(deleteConfirm)} icon="trash">Delete race</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
