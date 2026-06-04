import { useState } from "react";
import { BRAND, BRAND_BORDER, BRAND_HOVER, BRAND_LIGHT, BRAND_TEXT } from "../../../constants.js";
import { fmtDate, initials } from "../../../format.js";
import { REFEREES_POOL } from "../../../referees.js";
import SectionTitle from "../common/SectionTitle.jsx";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";
import Alert from "../common/Alert.jsx";
import StatusPill from "../common/StatusPill.jsx";

function Toast({ msg, type }) {
  const styles = {
    success: { bg: BRAND_LIGHT, color: BRAND_TEXT, border: BRAND_BORDER, icon: "circle-check" },
    info:    { bg: "#eff6ff", color: "#1e40af", border: "#93c5fd", icon: "info-circle" },
    danger:  { bg: "#fff1f2", color: "#9f1239", border: "#fecdd3", icon: "circle-x" },
  };
  const s = styles[type] || styles.success;
  return (
    <div
      className="fixed top-5 right-5 z-[99999] flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium shadow-lg border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      <i className={`ti ti-${s.icon}`} />
      {msg}
    </div>
  );
}

export default function RefereeModule({ races, setRaces }) {
  const [selectedRace, setSelectedRace] = useState(null);
  const [confirmAssign, setConfirmAssign] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const assign = (raceId, refId) => {
    setRaces((rs) => rs.map((r) => (r.id === raceId ? { ...r, refereeId: refId } : r)));
    setConfirmAssign(null);
    setSelectedRace(null);
    showToast("Referee assigned successfully.");
  };

  const unassign = (raceId) => {
    setRaces((rs) => rs.map((r) => (r.id === raceId ? { ...r, refereeId: null } : r)));
    showToast("Referee removed from race.", "info");
  };

  return (
    <div>
      <SectionTitle icon="shield-check" sub="Assign certified referees to races. Only available referees can be selected.">
        Assign Referee to Race
      </SectionTitle>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2.5">Referee roster</h3>
          <div className="flex flex-col gap-2">
            {REFEREES_POOL.map((ref) => (
              <div
                key={ref.id}
                className="bg-white border border-slate-200 rounded-xl p-3"
                style={{ opacity: ref.available ? 1 : 0.65 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: ref.available ? BRAND_LIGHT : "#f3f4f6",
                        border: `1px solid ${ref.available ? BRAND_BORDER : "#e5e7eb"}`,
                        color: ref.available ? BRAND : "#9ca3af",
                      }}
                    >
                      {initials(ref.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{ref.name}</div>
                      <div className="text-[11px] text-slate-500">{ref.badge} · {ref.speciality}</div>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      background: ref.available ? BRAND_LIGHT : "#fee2e2",
                      color: ref.available ? BRAND_TEXT : "#991b1b",
                      borderColor: ref.available ? BRAND_BORDER : "#fca5a5",
                    }}
                  >
                    {ref.available ? "AVAILABLE" : "BUSY"}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex gap-3">
                  <span><i className="ti ti-award mr-1" />{ref.experience} yrs exp.</span>
                  <span><i className="ti ti-mail mr-1" />{ref.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2.5">Race assignments</h3>
          <div className="flex flex-col gap-2">
            {races.map((race) => {
              const ref = REFEREES_POOL.find((r) => r.id === race.refereeId);
              return (
                <div
                  key={race.id}
                  className="bg-white border border-slate-200 rounded-xl p-3"
                  style={{ borderLeft: ref ? `3px solid ${BRAND}` : "3px solid #e5e7eb" }}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{race.name}</div>
                      <div className="text-[11px] text-slate-500">{race.venue} · {fmtDate(race.date)}</div>
                    </div>
                    <StatusPill status={race.status} />
                  </div>

                  {ref ? (
                    <div
                      className="flex items-center justify-between p-2 rounded-lg border"
                      style={{ background: BRAND_LIGHT, borderColor: BRAND_BORDER }}
                    >
                      <div className="text-sm font-medium" style={{ color: BRAND_HOVER }}>
                        <i className="ti ti-shield-check mr-1.5 text-sm" />
                        <strong>{ref.name}</strong> <span className="font-normal">({ref.badge})</span>
                      </div>
                      {race.status !== "Finished" && (
                        <button
                          onClick={() => unassign(race.id)}
                          className="bg-transparent border-none text-xs cursor-pointer underline font-sans"
                          style={{ color: BRAND_HOVER }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-[11px] text-slate-400 italic mb-1.5">No referee assigned</div>
                      {race.status !== "Finished" && race.status !== "Cancelled" && (
                        <Button small variant="info" onClick={() => setSelectedRace(race)} icon="user-plus">Assign referee</Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedRace && (
        <Modal title={`Assign referee — ${selectedRace.name}`} onClose={() => setSelectedRace(null)}>
          <div className="bg-slate-50 rounded-lg p-2.5 text-sm text-slate-700 mb-3">
            <strong>{selectedRace.venue}</strong> · {fmtDate(selectedRace.date)} {selectedRace.time} · {selectedRace.distance}m · {selectedRace.grade}
          </div>
          <p className="text-sm text-slate-500 mb-3">Select an available referee:</p>
          <div className="flex flex-col gap-2">
            {REFEREES_POOL.filter((r) => r.available).map((ref) => (
              <div
                key={ref.id}
                className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors"
                onClick={() => setConfirmAssign({ race: selectedRace, ref })}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border"
                    style={{ background: BRAND_LIGHT, borderColor: BRAND_BORDER, color: BRAND }}
                  >
                    {initials(ref.name)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{ref.name}</div>
                    <div className="text-[11px] text-slate-500">{ref.badge} · {ref.speciality} · {ref.experience} yrs</div>
                  </div>
                </div>
                <Button small variant="primary" icon="check">Select</Button>
              </div>
            ))}
            {REFEREES_POOL.filter((r) => r.available).length === 0 && (
              <Alert type="warning">No available referees at this time.</Alert>
            )}
          </div>
        </Modal>
      )}

      {confirmAssign && (
        <Modal title="Confirm assignment" onClose={() => setConfirmAssign(null)}>
          <p className="text-sm text-slate-700 mb-3">
            Assign <strong>{confirmAssign.ref.name}</strong> ({confirmAssign.ref.badge}) as referee for <strong>{confirmAssign.race.name}</strong>?
          </p>
          <Alert type="info">
            This referee will be responsible for officiating and ensuring compliance during this race.
          </Alert>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setConfirmAssign(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => assign(confirmAssign.race.id, confirmAssign.ref.id)} icon="shield-check">
              Confirm assignment
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
