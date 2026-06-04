import { useState } from "react";
import { EMERALD, EMERALD_LIGHT, EMERALD_BORDER } from '../utils/constants';
import { RACES_SEED } from '../data/races';
import SectionTitle from '../components/common/SectionTitle';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import StatusPill from '../components/common/StatusPill';

export default function PredictionsPage() {
  const [filterRace, setFilterRace] = useState("all");

  const MOCK_PREDICTIONS = [
    { id: "P01", raceId: "R001", userId: "U010", userName: "John Spectator", horseName: "Thunder Bolt", result: "WIN" },
    { id: "P02", raceId: "R001", userId: "U011", userName: "Emma Fan", horseName: "Silver Arrow", result: "LOSE" },
    { id: "P03", raceId: "R002", userId: "U010", userName: "John Spectator", horseName: "Golden Flash", result: "LOSE" },
    { id: "P04", raceId: "R002", userId: "U012", userName: "Mike Bet", horseName: "Iron Fist", result: "WIN" },
    { id: "P05", raceId: "R001", userId: "U013", userName: "Lisa Watch", horseName: "Thunder Bolt", result: "WIN" },
    { id: "P06", raceId: "R002", userId: "U014", userName: "Tom Odds", horseName: "Phantom Rider", result: "WIN" },
  ];

  const allPreds = RACES_SEED.flatMap(r =>
    MOCK_PREDICTIONS.filter(p => p.raceId === r.id).map(p => ({ ...p, raceName: r.name, raceStatus: r.status }))
  );

  const filtered = filterRace === "all" ? allPreds : allPreds.filter(p => p.raceId === filterRace);

  const byRace = {};
  MOCK_PREDICTIONS.forEach(p => {
    if (!byRace[p.raceId]) byRace[p.raceId] = { total: 0, wins: {} };
    byRace[p.raceId].total++;
    byRace[p.raceId].wins[p.horseName] = (byRace[p.raceId].wins[p.horseName] || 0) + 1;
  });

  const winRate = MOCK_PREDICTIONS.filter(p => p.result === "WIN").length;
  const total = MOCK_PREDICTIONS.length;

  return (
    <div>
      <SectionTitle icon="chart-line" sub="View prediction statistics for each race. Track spectator engagement and betting trends.">
        Prediction Statistics
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          ["Total Predictions", total, "#6B7280"],
          ["Winning Picks", winRate, "#166534"],
          ["Losing Picks", total - winRate, "#991B1B"],
          ["Accuracy", `${total > 0 ? Math.round(winRate / total * 100) : 0}%`, EMERALD],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Prediction distribution by race */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#111827" }}>Prediction Distribution by Race</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
          {RACES_SEED.map(race => {
            const stats = byRace[race.id] || { total: 0, wins: {} };
            return (
              <div key={race.id} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{race.name}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{race.venue} · {race.grade}</div>
                  </div>
                  <StatusPill status={race.status} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: EMERALD, marginBottom: 8 }}>{stats.total}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>total predictions</div>
                {Object.entries(stats.wins).length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {Object.entries(stats.wins).sort((a, b) => b[1] - a[1]).map(([horse, count]) => (
                      <div key={horse} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, background: "#F3F4F6", borderRadius: 4, height: 6, overflow: "hidden" }}>
                          <div style={{ width: `${(count / stats.total) * 100}%`, height: "100%", background: EMERALD, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 11, color: "#6B7280", width: 100 }}>{horse}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#111827", width: 30, textAlign: "right" }}>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* All predictions table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>All Predictions</h3>
          <select
            style={{ padding: "6px 11px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, background: "#fff", fontFamily: "inherit" }}
            value={filterRace}
            onChange={e => setFilterRace(e.target.value)}
          >
            <option value="all">All Races</option>
            {RACES_SEED.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["Spectator", "Race", "Picked Horse", "Result", "Date"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "32px 0", textAlign: "center", color: "#9CA3AF" }}>No predictions found.</td>
              </tr>
            )}
            {filtered.map((pred, i) => (
              <tr key={pred.id} style={{ borderBottom: "1px solid #F3F4F6", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ fontWeight: 500, color: "#111827" }}>{pred.userName}</div>
                </td>
                <td style={{ padding: "10px 14px", color: "#374151" }}>{pred.raceName}</td>
                <td style={{ padding: "10px 14px", fontWeight: 500, color: "#111827" }}>{pred.horseName}</td>
                <td style={{ padding: "10px 14px" }}>
                  {pred.result === "WIN" ? (
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "#D1FAE5", color: "#166534" }}>WIN</span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "#FEE2E2", color: "#991B1B" }}>LOSE</span>
                  )}
                </td>
                <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: 12 }}>2025-04-10</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
