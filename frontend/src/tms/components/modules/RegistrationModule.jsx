import { useState } from "react";
import { BRAND, BRAND_BORDER, BRAND_LIGHT, BRAND_TEXT } from "../../constants.js";
import { fmtDate, fmtDateTime } from "../../format.js";
import SectionTitle from "../common/SectionTitle.jsx";
import Card from "../common/Card.jsx";
import Field from "../common/Field.jsx";
import Textarea from "../common/Textarea.jsx";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";
import Alert from "../common/Alert.jsx";
import Divider from "../common/Divider.jsx";
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

const ROW_BG = ["#fff", "#fafafa"];

export default function RegistrationModule({ races, setRaces }) {
  const [filterRace, setFilterRace] = useState("all");
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [viewReg, setViewReg] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const allRegs = races.flatMap((r) =>
    r.registrations.map((reg) => ({ ...reg, raceId: r.id, raceName: r.name, raceGrade: r.grade }))
  );

  const filtered = allRegs.filter(
    (reg) =>
      (filterRace === "all" || reg.raceId === filterRace) &&
      (filterStatus === "all" || reg.status === filterStatus)
  );

  const counts = {
    Pending: allRegs.filter((r) => r.status === "Pending").length,
    Approved: allRegs.filter((r) => r.status === "Approved").length,
    Rejected: allRegs.filter((r) => r.status === "Rejected").length,
    total: allRegs.length,
  };

  const updateReg = (regId, raceId, status, note = "") => {
    setRaces((rs) =>
      rs.map((r) =>
        r.id === raceId
          ? { ...r, registrations: r.registrations.map((reg) => (reg.id === regId ? { ...reg, status, note } : reg)) }
          : r
      )
    );
  };

  const approve = (reg) => {
    if (!reg) return;
    updateReg(reg.id, reg.raceId, "Approved");
    setViewReg(null);
    showToast(`Registration for ${reg.horseName} approved.`);
  };

  const reject = () => {
    if (!rejectReason.trim() || !rejectModal) return;
    updateReg(rejectModal.id, rejectModal.raceId, "Rejected", rejectReason);
    setRejectModal(null);
    setRejectReason("");
    setViewReg(null);
    showToast(`Registration for ${rejectModal.horseName} rejected.`, "danger");
  };

  const tabStyle = (s) => {
    const active = filterStatus === s;
    const colors = {
      Pending:  { bg: "#fef9c3", color: "#713f12", border: "#fde047" },
      Approved: { bg: BRAND_LIGHT, color: BRAND_TEXT, border: BRAND_BORDER },
      Rejected: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
      all:      { bg: BRAND, color: "#fff", border: BRAND },
    };
    const c = active ? (colors[s] || colors.all) : {};
    return {
      padding: "6px 14px",
      fontSize: 12,
      fontWeight: 500,
      borderRadius: 8,
      background: active ? c.bg : "#fff",
      color: active ? c.color : "#6b7280",
      border: `1px solid ${active ? c.border : "#e5e7eb"}`,
      cursor: "pointer",
      fontFamily: "inherit",
    };
  };

  return (
    <div>
      <SectionTitle icon="clipboard-check" sub="Review, approve, or reject incoming horse and jockey registration requests.">
        Approve / Reject Registrations
      </SectionTitle>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="grid grid-cols-4 gap-2.5 mb-4">
        {[
          ["Total", counts.total, "#6b7280", "inbox"],
          ["Pending", counts.Pending, BRAND, "clock"],
          ["Approved", counts.Approved, BRAND_TEXT, "circle-check"],
          ["Rejected", counts.Rejected, "#991b1b", "circle-x"],
        ].map(([l, v, c, ic]) => (
          <div key={l} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <i className={`ti ti-${ic} text-sm`} style={{ color: c }} />{l}
            </div>
            <div className="text-2xl font-bold text-slate-800">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2.5 mb-3.5 flex-wrap items-center">
        <select
          className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-800 font-sans min-w-[160px]"
          value={filterRace}
          onChange={(e) => setFilterRace(e.target.value)}
        >
          <option value="all">All races</option>
          {races.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <div className="flex gap-1.5">
          {["all", "Pending", "Approved", "Rejected"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} style={tabStyle(s)}>
              {s === "all" ? "All" : s} {s !== "all" && `(${counts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {counts.Pending > 0 && filterStatus === "Pending" && (
        <Alert type="warning">
          {counts.Pending} registration{counts.Pending !== 1 ? "s" : ""} pending review. Click a row to see full details.
        </Alert>
      )}

      <Card className="p-0 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Horse", "Jockey", "Race", "Owner", "Submitted", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left p-2.5 text-[11px] font-semibold text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">No registrations found.</td>
              </tr>
            )}
            {filtered.map((reg, i) => (
              <tr key={reg.id} style={{ borderBottom: "1px solid #f3f4f6", background: ROW_BG[i % 2] }}>
                <td className="p-2.5">
                  <div className="font-semibold text-slate-800">{reg.horseName}</div>
                  <div className="text-[11px] text-slate-400">{reg.horseColor} · {reg.horseAge}yo</div>
                </td>
                <td className="p-2.5">
                  <div className="text-slate-700">{reg.jockeyName}</div>
                  <div className="text-[11px] text-slate-400">{reg.licenseNo}</div>
                </td>
                <td className="p-2.5">
                  <div className="text-slate-700">{reg.raceName}</div>
                  <div className="text-[11px] text-slate-400">{reg.raceGrade}</div>
                </td>
                <td className="p-2.5 text-slate-700">{reg.ownerName}</td>
                <td className="p-2.5 text-slate-500 text-xs">{fmtDateTime(reg.submittedAt)}</td>
                <td className="p-2.5"><StatusPill status={reg.status} /></td>
                <td className="p-2.5">
                  <div className="flex gap-1">
                    <Button small variant="ghost" onClick={() => setViewReg(reg)} icon="eye">View</Button>
                    {reg.status === "Pending" && (
                      <>
                        <Button small variant="success" onClick={() => approve(reg)} icon="check">Approve</Button>
                        <Button small variant="danger" onClick={() => { setRejectModal(reg); setRejectReason(""); }} icon="x">Reject</Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {viewReg && (
        <Modal title="Registration details" onClose={() => setViewReg(null)} wide>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Horse information</div>
              {[
                ["Name", viewReg.horseName],
                ["Color", viewReg.horseColor],
                ["Age", `${viewReg.horseAge} years`],
                ["Trainer", viewReg.trainerName],
                ["Owner", viewReg.ownerName],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-slate-100 text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-slate-800">{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Jockey &amp; race</div>
              {[
                ["Jockey", viewReg.jockeyName],
                ["License no.", viewReg.licenseNo],
                ["Race", viewReg.raceName],
                ["Grade", viewReg.raceGrade],
                ["Submitted", fmtDateTime(viewReg.submittedAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-slate-100 text-sm">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-slate-500">Status:</span>
            <StatusPill status={viewReg.status} />
          </div>

          {viewReg.status === "Rejected" && viewReg.note && (
            <div>
              <div className="text-[12px] font-semibold text-slate-400 mb-1.5">REJECTION REASON</div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {viewReg.note}
              </div>
            </div>
          )}

          {viewReg.status === "Pending" && (
            <>
              <Divider />
              <div className="flex gap-2 justify-end">
                <Button variant="danger" onClick={() => { setRejectModal(viewReg); setRejectReason(""); setViewReg(null); }} icon="x">Reject</Button>
                <Button variant="success" onClick={() => approve(viewReg)} icon="check">Approve registration</Button>
              </div>
            </>
          )}
        </Modal>
      )}

      {rejectModal && (
        <Modal title={`Reject registration — ${rejectModal.horseName}`} onClose={() => setRejectModal(null)}>
          <p className="text-sm text-slate-700 mb-3">
            You are about to reject <strong>{rejectModal.horseName}</strong> ({rejectModal.jockeyName}) for <strong>{rejectModal.raceName}</strong>.
          </p>
          <Field label="Reason for rejection" required>
            <Textarea
              value={rejectReason}
              onChange={setRejectReason}
              placeholder="e.g. incomplete documentation, license expired, horse not meeting grade requirements..."
              rows={4}
            />
          </Field>
          {!rejectReason.trim() && (
            <Alert type="warning">A reason must be provided before rejecting a registration.</Alert>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={reject} disabled={!rejectReason.trim()} icon="x">Confirm rejection</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
