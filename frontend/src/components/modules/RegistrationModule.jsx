import { useState } from "react";
import { fmtDate, fmtDateTime } from "../../utils/format";

import SectionTitle from "../common/SectionTitle";
import Card        from "../common/Card";
import Field       from "../common/Field";
import Textarea    from "../common/Textarea";
import Button      from "../common/Button";
import Modal       from "../common/Modal";
import Alert       from "../common/Alert";
import Divider     from "../common/Divider";
import StatusPill  from "../common/StatusPill";

function Toast({ msg, type }) {
  const styles = {
    success: { bg: "#F0FDF4", color: "#166534", border: "#86EFAC", icon: "circle-check" },
    info:    { bg: "#EFF6FF", color: "#1E40AF", border: "#93C5FD", icon: "info-circle"  },
    danger:  { bg: "#FFF1F2", color: "#9F1239", border: "#FECDD3", icon: "circle-x"     },
  };
  const s = styles[type] || styles.success;
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 99999,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 500,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <i className={`ti ti-${s.icon}`} aria-hidden />
      {msg}
    </div>
  );
}

const ROW_BG = ["#fff", "#FAFAFA"];

export default function RegistrationModule({ races, setRaces }) {
  const [filterRace,   setFilterRace]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [viewReg,      setViewReg]      = useState(null);
  const [rejectModal,  setRejectModal]  = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Flattened registrations across all races ── */
  const allRegs = races.flatMap((r) =>
    r.registrations.map((reg) => ({ ...reg, raceId: r.id, raceName: r.name, raceGrade: r.grade }))
  );

  const filtered = allRegs.filter(
    (reg) =>
      (filterRace   === "all" || reg.raceId  === filterRace) &&
      (filterStatus === "all" || reg.status  === filterStatus)
  );

  const counts = {
    Pending:  allRegs.filter((r) => r.status === "Pending").length,
    Approved: allRegs.filter((r) => r.status === "Approved").length,
    Rejected: allRegs.filter((r) => r.status === "Rejected").length,
    total:    allRegs.length,
  };

  /* ── Mutate registration status ── */
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
    updateReg(reg.id, reg.raceId, "Approved");
    setViewReg(null);
    showToast(`Registration for ${reg.horseName} approved.`);
  };

  const reject = () => {
    if (!rejectReason.trim()) return;
    updateReg(rejectModal.id, rejectModal.raceId, "Rejected", rejectReason);
    setRejectModal(null);
    setRejectReason("");
    setViewReg(null);
    showToast(`Registration for ${rejectModal.horseName} rejected.`, "danger");
  };

  /* ── Filter tab helper ── */
  const tabStyle = (s) => {
    const active = filterStatus === s;
    const colors = {
      Pending:  { bg: "#FEF9C3", color: "#713F12", border: "#FDE047" },
      Approved: { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7" },
      Rejected: { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
      all:      { bg: "#F3F4F6", color: "#374151", border: "#D1D5DB" },
    };
    const c = active ? (colors[s] || colors.all) : {};
    return {
      padding: "6px 14px", fontSize: 12, fontWeight: 500, borderRadius: 8,
      background:   active ? c.bg    : "transparent",
      color:        active ? c.color : "#6B7280",
      border:       `1px solid ${active ? c.border : "#E5E7EB"}`,
      cursor: "pointer", fontFamily: "inherit",
    };
  };

  return (
    <div>
      <SectionTitle icon="clipboard-check" sub="Review, approve, or reject incoming horse and jockey registration requests.">
        Approve / Reject Registrations
      </SectionTitle>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Summary counts ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          ["Total",    counts.total,    "#6B7280", "inbox"       ],
          ["Pending",  counts.Pending,  "#92400E", "clock"       ],
          ["Approved", counts.Approved, "#166534", "circle-check"],
          ["Rejected", counts.Rejected, "#991B1B", "circle-x"   ],
        ].map(([l, v, c, ic]) => (
          <div key={l} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#9CA3AF", fontSize: 11, marginBottom: 4 }}>
              <i className={`ti ti-${ic}`} style={{ color: c, fontSize: 13 }} aria-hidden />{l}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <select
          style={{ padding: "7px 11px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, background: "#fff", color: "#111827", fontFamily: "inherit", minWidth: 160 }}
          value={filterRace}
          onChange={(e) => setFilterRace(e.target.value)}
        >
          <option value="all">All races</option>
          {races.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <div style={{ display: "flex", gap: 6 }}>
          {["all", "Pending", "Approved", "Rejected"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} style={tabStyle(s)}>
              {s === "all" ? "All" : s} {s !== "all" && `(${counts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Pending notice */}
      {counts.Pending > 0 && filterStatus === "Pending" && (
        <Alert type="warning">
          {counts.Pending} registration{counts.Pending !== 1 ? "s" : ""} pending review. Click a row to see full details.
        </Alert>
      )}

      {/* ── Table ── */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["Horse", "Jockey", "Race", "Owner", "Submitted", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "32px 0", textAlign: "center", color: "#9CA3AF" }}>
                  No registrations found.
                </td>
              </tr>
            )}
            {filtered.map((reg, i) => (
              <tr key={reg.id} style={{ borderBottom: "1px solid #F3F4F6", background: ROW_BG[i % 2] }}>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{reg.horseName}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{reg.horseColor} · {reg.horseAge}yo</div>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ color: "#374151" }}>{reg.jockeyName}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{reg.licenseNo}</div>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ color: "#374151" }}>{reg.raceName}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{reg.raceGrade}</div>
                </td>
                <td style={{ padding: "10px 14px", color: "#374151" }}>{reg.ownerName}</td>
                <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: 12 }}>{fmtDateTime(reg.submittedAt)}</td>
                <td style={{ padding: "10px 14px" }}><StatusPill status={reg.status} /></td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <Button small variant="ghost" onClick={() => setViewReg(reg)} icon="eye">View</Button>
                    {reg.status === "Pending" && (
                      <>
                        <Button small variant="success" onClick={() => approve(reg)} icon="check">Approve</Button>
                        <Button small variant="danger"  onClick={() => { setRejectModal(reg); setRejectReason(""); }} icon="x">Reject</Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ── View registration modal ── */}
      {viewReg && (
        <Modal title="Registration details" onClose={() => setViewReg(null)} wide>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Horse info */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Horse information</div>
              {[
                ["Name",    viewReg.horseName],
                ["Color",   viewReg.horseColor],
                ["Age",     `${viewReg.horseAge} years`],
                ["Trainer", viewReg.trainerName],
                ["Owner",   viewReg.ownerName],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
                  <span style={{ color: "#6B7280" }}>{k}</span>
                  <span style={{ fontWeight: 500, color: "#111827" }}>{v}</span>
                </div>
              ))}
            </div>
            {/* Jockey & race */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Jockey &amp; race</div>
              {[
                ["Jockey",      viewReg.jockeyName],
                ["License no.", viewReg.licenseNo],
                ["Race",        viewReg.raceName],
                ["Grade",       viewReg.raceGrade],
                ["Submitted",   fmtDateTime(viewReg.submittedAt)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
                  <span style={{ color: "#6B7280" }}>{k}</span>
                  <span style={{ fontWeight: 500, color: "#111827" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>Status:</span>
            <StatusPill status={viewReg.status} />
          </div>

          {viewReg.status === "Rejected" && viewReg.note && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 6 }}>REJECTION REASON</div>
              <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#9F1239" }}>
                {viewReg.note}
              </div>
            </div>
          )}

          {viewReg.status === "Pending" && (
            <>
              <Divider />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button variant="danger"  onClick={() => { setRejectModal(viewReg); setRejectReason(""); setViewReg(null); }} icon="x">Reject</Button>
                <Button variant="success" onClick={() => approve(viewReg)} icon="check">Approve registration</Button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* ── Reject modal ── */}
      {rejectModal && (
        <Modal title={`Reject registration — ${rejectModal.horseName}`} onClose={() => setRejectModal(null)}>
          <p style={{ fontSize: 13, color: "#374151", margin: "0 0 12px" }}>
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
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost"  onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={reject} disabled={!rejectReason.trim()} icon="x">Confirm rejection</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
