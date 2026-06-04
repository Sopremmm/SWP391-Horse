import { useState } from "react";
import { EMERALD, EMERALD_LIGHT, EMERALD_BORDER } from '../utils/constants';
import { RACES_SEED } from '../data/races';
import { TOURNAMENT_SEED } from '../data/tournament';
import { fmtDate, fmtMillions } from '../utils/format';
import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import StatusPill from '../components/common/StatusPill';

export default function RaceResultPage() {
  const [races, setRaces] = useState(RACES_SEED.map(r => ({
    ...r,
    reportSubmitted: r.status === "Finished",
  })));
  const [selectedRace, setSelectedRace] = useState(null);
  const [editingResults, setEditingResults] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const finishedRaces = races.filter(r => r.status === "Finished");

  const updateResult = (raceId, regId, result) => {
    setRaces(rs => rs.map(r => {
      if (r.id !== raceId) return r;
      return {
        ...r,
        registrations: r.registrations.map(reg =>
          reg.id === regId ? { ...reg, result: result === reg.result ? null : result } : reg
        ),
      };
    }));
  };

  const publishResult = (race) => {
    const hasResults = race.registrations.some(r => r.result != null);
    if (!hasResults) {
      showToast("Please assign at least one result before publishing.");
      return;
    }
    setRaces(rs => rs.map(r => r.id === race.id ? { ...r, status: "Finished", published: true } : r));
    setEditingResults(null);
    showToast("Race result published successfully.");
  };

  return (
    <div>
      <SectionTitle icon="certificate" sub="Publish official race results and trigger automated prize calculation.">
        Race Results & Publication
      </SectionTitle>

      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 99999,
          background: "#F0FDF4", color: "#166534", border: "1px solid #86EFAC",
          borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}>
          <i className="ti ti-circle-check" style={{ marginRight: 8 }} aria-hidden />{toast}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          ["Total Races", races.length, "#6B7280"],
          ["Finished", finishedRaces.length, "#166534"],
          ["Published", finishedRaces.filter(r => r.published).length, EMERALD],
          ["Pending Result", races.filter(r => r.status === "Finished" && !r.published).length, "#92400E"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>{TOURNAMENT_SEED.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, fontSize: 13, color: "#6B7280" }}>
            <span><i className="ti ti-trophy" style={{ marginRight: 4 }} aria-hidden />{fmtMillions(TOURNAMENT_SEED.totalPrize)} total prize</span>
            <span><i className="ti ti-calendar" style={{ marginRight: 4 }} aria-hidden />Deadline: {fmtDate(TOURNAMENT_SEED.registrationDeadline)}</span>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {races.filter(r => r.status === "Finished").map(race => {
          const winner = race.registrations.find(reg => reg.result === 1);
          const hasResults = race.registrations.some(reg => reg.result != null);
          return (
            <div key={race.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{race.name}</span>
                    <StatusPill status={race.status} />
                    {race.published && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: EMERALD_LIGHT, color: EMERALD }}>PUBLISHED</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3, display: "flex", gap: 14 }}>
                    <span><i className="ti ti-map-pin" style={{ marginRight: 3 }} aria-hidden />{race.venue}</span>
                    <span><i className="ti ti-calendar" style={{ marginRight: 3 }} aria-hidden />{fmtDate(race.date)}</span>
                    <span><i className="ti ti-trophy" style={{ marginRight: 3 }} aria-hidden />${race.prizePool.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Button small variant="ghost" onClick={() => setEditingResults(race)} icon="edit">Edit Results</Button>
                  {winner && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#FFF8E7", border: "1px solid #D4A820", borderRadius: 8 }}>
                      <span style={{ fontSize: 14 }}>🏆</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>{winner.horseName}</span>
                    </div>
                  )}
                </div>
              </div>

              {race.published && (
                <div style={{ padding: "12px 18px" }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    {race.registrations.sort((a, b) => (a.result || 999) - (b.result || 999)).map((reg, i) => (
                      <div key={reg.id} style={{
                        flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid",
                        background: i === 0 ? "#FFF8E7" : i < 3 ? "#F9FAFB" : "#fff",
                        borderColor: i === 0 ? "#D4A820" : "#E5E7EB",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 12 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{reg.horseName}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{reg.jockeyName}</div>
                        {i === 0 && (
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#B8860B", marginTop: 4 }}>
                            ${race.prizePool.toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingResults && (
        <Modal title={`Edit Results — ${editingResults.name}`} onClose={() => setEditingResults(null)} wide>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 10 }}>Race Information</div>
              {[["Venue", editingResults.venue], ["Date", fmtDate(editingResults.date)], ["Distance", `${editingResults.distance}m`], ["Prize", `$${editingResults.prizePool.toLocaleString()}`]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
                  <span style={{ color: "#6B7280" }}>{k}</span>
                  <span style={{ fontWeight: 500, color: "#111827" }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 10 }}>Prize Distribution</div>
              {[
                ["1st Place", "50%", Math.round(editingResults.prizePool * 0.5)],
                ["2nd Place", "30%", Math.round(editingResults.prizePool * 0.3)],
                ["3rd Place", "20%", Math.round(editingResults.prizePool * 0.2)],
              ].map(([place, pct, amt]) => (
                <div key={place} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
                  <span style={{ color: "#6B7280" }}>{place} ({pct})</span>
                  <span style={{ fontWeight: 600, color: "#B8860B" }}>${amt.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 10 }}>Click a number to assign finishing position:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {editingResults.registrations.map((reg, i) => (
              <div key={reg.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: reg.result === 1 ? "#FFF8E7" : reg.result ? "#EFF6FF" : "#F9FAFB", border: `2px solid ${reg.result === 1 ? "#D4A820" : reg.result ? "#93C5FD" : "#E5E7EB"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                  {reg.result || "-"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{reg.horseName}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{reg.jockeyName}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => updateResult(editingResults.id, reg.id, n)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        background: reg.result === n ? (n === 1 ? "#FFF8E7" : "#EFF6FF") : "#F9FAFB",
                        border: `1px solid ${reg.result === n ? (n === 1 ? "#D4A820" : "#93C5FD") : "#E5E7EB"}`,
                        color: reg.result === n ? (n === 1 ? "#B8860B" : "#1E40AF") : "#9CA3AF",
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16, borderTop: "1px solid #F3F4F6", paddingTop: 16 }}>
            <Button variant="ghost" onClick={() => setEditingResults(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => publishResult(editingResults)} icon="send">
              Publish Results
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
