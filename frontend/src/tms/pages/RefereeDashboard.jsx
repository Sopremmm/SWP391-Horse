import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import { fmtDate } from "../format.js";
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
  HeritageTextarea,
  HeritageSelect,
  HeritageSlidePanel,
} from "../components/layout/HeritageUI.jsx";

function PositionBadge({ pos }) {
  const styles = {
    1: { bg: "#ffdea5", color: "#002a15" },
    2: { bg: "#d1d5db", color: "#1f231f" },
    3: { bg: "#fed7aa", color: "#7c2d12" },
  };
  const s = styles[pos] || { bg: "#e5e7eb", color: "#6b7280" };
  return (
    <span
      className="grid place-items-center"
      style={{
        width: 32, height: 32, borderRadius: 999, background: s.bg, color: s.color,
        fontSize: "0.78rem", fontWeight: 800,
      }}
    >
      {pos}
    </span>
  );
}

export default function RefereeDashboard() {
  const { user, races, setRaces } = useApp();
  const [tab, setTab] = useState("assigned");
  const [selectedRace, setSelectedRace] = useState(null);
  const [confirmingReport, setConfirmingReport] = useState(null);
  const [violations, setViolations] = useState({});
  const [finishOrder, setFinishOrder] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const myAssignedRaces = races.filter(r => r.refereeId);
  const pendingReports = myAssignedRaces.filter(r => r.status === "Finished" && !r.reportSubmitted);
  const completedReports = myAssignedRaces.filter(r => r.reportSubmitted);

  const submitReport = (race) => {
    const order = finishOrder[race.id] || {};
    setRaces(prev => prev.map(r => {
      if (r.id !== race.id) return r;
      const updatedRegs = r.registrations.map(reg => ({
        ...reg,
        result: order[reg.id] || null,
      }));
      return { ...r, registrations: updatedRegs, reportSubmitted: true };
    }));
    setConfirmingReport(null);
    showToast(`Official referee report submitted for ${race.name}.`);
  };

  const nav = [
    { id: "assigned", label: "My Races" },
    { id: "reports", label: "Reports", count: pendingReports.length },
  ];

  return (
    <HeritageLayout role="referee" subtitle="Referee">
      <HeritagePageHeader
        eyebrow="Referee"
        title="Race Oversight"
        subtitle="Manage finish orders, record violations, and submit official race results."
      />

      <HeritageTabs tabs={nav} active={tab} onChange={setTab} />

      <section style={{ paddingBlock: "clamp(40px, 5vw, 56px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          {tab === "assigned" && (
            <>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", marginBottom: 40 }}
              >
                <HeritageStat value={myAssignedRaces.length} label="Assigned Races" />
                <HeritageStat value={myAssignedRaces.filter(r => r.status === "Upcoming").length} label="Upcoming" color="#1e40af" />
                <HeritageStat value={myAssignedRaces.filter(r => r.status === "Finished").length} label="Finished" color="#166534" />
                <HeritageStat value={completedReports.length} label="Reports" color="#b8860b" />
              </div>

              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 24, fontFamily: FONT_SERIF }}>
                Races Assigned to You
              </h2>
              <div className="grid gap-3">
                {myAssignedRaces.length === 0 ? (
                  <HeritageCard padding={64} style={{ textAlign: "center" }}>
                    <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No races assigned to you yet. Admin will assign races.</p>
                  </HeritageCard>
                ) : (
                  myAssignedRaces.map(race => (
                    <HeritageCard key={race.id} padding={28}>
                      <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 14 }}>
                        <div>
                          <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                            {race.name}
                          </h3>
                          <p className="m-0" style={{ marginTop: 4, color: "#747b75", fontSize: "0.82rem" }}>
                            {race.venue} · {fmtDate(race.date)} · {race.distance}m
                          </p>
                        </div>
                        <HeritageStatusPill status={race.status} />
                      </div>
                      <div className="flex flex-wrap items-center" style={{ gap: 12, marginBottom: 16 }}>
                        {[
                          { k: "Participants", v: race.registrations.length },
                          { k: "Prize", v: `$${race.prizePool.toLocaleString()}` },
                          { k: "Condition", v: race.condition },
                        ].map((f) => (
                          <div
                            key={f.k}
                            style={{ padding: "6px 12px", background: "#f7f6f1", borderRadius: 4, fontSize: "0.78rem" }}
                          >
                            <span style={{ color: "#747b75", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.66rem" }}>
                              {f.k}:{" "}
                            </span>
                            <span style={{ color: "#002a15", fontWeight: 700 }}>
                              {f.v}
                            </span>
                          </div>
                        ))}
                        {race.reportSubmitted && (
                          <span style={{ color: "#b8860b", fontWeight: 700, fontSize: "0.78rem" }}>
                            ✓ Report submitted
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap" style={{ gap: 8 }}>
                        <HeritageButton
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRace(race)}
                        >
                          {race.status === "Finished" ? "View Results" : "Manage Race"}
                        </HeritageButton>
                        {race.status === "Finished" && !race.reportSubmitted && (
                          <HeritageButton
                            size="sm"
                            onClick={() => { setSelectedRace(race); setTab("reports"); }}
                            style={{ background: "#b8860b", borderColor: "#b8860b" }}
                          >
                            Submit Report
                          </HeritageButton>
                        )}
                        {race.reportSubmitted && (
                          <span
                            className="inline-flex items-center"
                            style={{
                              padding: "10px 14px", borderRadius: 2,
                              background: "rgba(255,222,165,0.4)", color: "#002a15",
                              fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em",
                              textTransform: "uppercase", gap: 6,
                            }}
                          >
                            ✓ Report Submitted
                          </span>
                        )}
                      </div>
                    </HeritageCard>
                  ))
                )}
              </div>
            </>
          )}

          {tab === "reports" && (
            <>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 24, fontFamily: FONT_SERIF }}>
                Referee Reports
              </h2>
              {myAssignedRaces.filter(r => r.status === "Finished").length === 0 ? (
                <HeritageCard padding={64} style={{ textAlign: "center" }}>
                  <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No finished races to report on.</p>
                </HeritageCard>
              ) : (
                <div className="grid gap-4">
                  {myAssignedRaces.filter(r => r.status === "Finished").map(race => {
                    const currentOrder = finishOrder[race.id] || {};
                    const existingResults = Object.fromEntries(
                      race.registrations.map(reg => [reg.id, reg.result])
                    );
                    const mergedOrder = { ...existingResults, ...currentOrder };

                    return (
                      <HeritageCard key={race.id} padding={0} style={{ overflow: "hidden" }}>
                        <div className="flex items-center justify-between flex-wrap gap-3" style={{ padding: 24, borderBottom: "1px solid #f0ede4" }}>
                          <div>
                            <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                              {race.name}
                            </h3>
                            <p className="m-0" style={{ marginTop: 4, color: "#747b75", fontSize: "0.82rem" }}>
                              {fmtDate(race.date)} · {race.venue}
                            </p>
                          </div>
                          {race.reportSubmitted ? (
                            <span style={{ color: "#166534", fontWeight: 700, fontSize: "0.82rem" }}>
                              ✓ Submitted
                            </span>
                          ) : (
                            <span style={{ color: "#b8860b", fontWeight: 700, fontSize: "0.82rem" }}>
                              Pending
                            </span>
                          )}
                        </div>

                        {!race.reportSubmitted ? (
                          <div style={{ padding: 24 }}>
                            <HeritageField label="Finish Order" hint="Assign each horse their final position.">
                              <div className="grid gap-2">
                                {race.registrations.map((reg, i) => {
                                  const currentPos = mergedOrder[reg.id] || "";
                                  return (
                                    <div
                                      key={reg.id}
                                      className="flex items-center"
                                      style={{ padding: 12, background: "#f7f6f1", borderRadius: 4, gap: 12 }}
                                    >
                                      <span
                                        className="grid place-items-center"
                                        style={{
                                          width: 32, height: 32, borderRadius: 999,
                                          background: "#002a15", color: "#ffdea5",
                                          fontSize: "0.78rem", fontWeight: 800,
                                        }}
                                      >
                                        {currentPos || (i + 1)}
                                      </span>
                                      <div className="flex-1">
                                        <p className="m-0" style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>
                                          {reg.horseName}
                                        </p>
                                        <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 2 }}>
                                          {reg.jockeyName}
                                        </p>
                                      </div>
                                      <HeritageSelect
                                        value={currentPos || ""}
                                        onChange={e => {
                                          const val = e.target.value ? parseInt(e.target.value) : "";
                                          setFinishOrder(prev => ({
                                            ...prev,
                                            [race.id]: { ...(prev[race.id] || {}), [reg.id]: val },
                                          }));
                                        }}
                                        style={{ width: 140 }}
                                      >
                                        <option value="">— Position —</option>
                                        {race.registrations.map((_, idx) => (
                                          <option key={idx + 1} value={idx + 1}>#{idx + 1}</option>
                                        ))}
                                      </HeritageSelect>
                                    </div>
                                  );
                                })}
                              </div>
                            </HeritageField>

                            <HeritageField label="Violations / Notes" hint="Optional — record any incidents or official notes.">
                              <HeritageTextarea
                                placeholder="Record any violations, incidents, or official notes during the race..."
                                value={violations[race.id] || ""}
                                onChange={e => setViolations(v => ({ ...v, [race.id]: e.target.value }))}
                                rows={3}
                              />
                            </HeritageField>

                            <div className="flex justify-end" style={{ marginTop: 16 }}>
                              <HeritageButton onClick={() => setConfirmingReport(race)} style={{ background: "#b8860b", borderColor: "#b8860b" }}>
                                Submit Official Report
                              </HeritageButton>
                            </div>
                          </div>
                        ) : (
                          <div style={{ padding: 24 }}>
                            <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                              Official Results
                            </p>
                            <div className="grid gap-2">
                              {race.registrations
                                .filter(r => r.result)
                                .sort((a, b) => a.result - b.result)
                                .map((reg) => (
                                  <div
                                    key={reg.id}
                                    className="flex items-center"
                                    style={{ padding: 12, background: "#f7f6f1", borderRadius: 4, gap: 12 }}
                                  >
                                    <PositionBadge pos={reg.result} />
                                    <div className="flex-1">
                                      <p className="m-0" style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>
                                        {reg.horseName}
                                      </p>
                                      <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 2 }}>
                                        {reg.jockeyName}
                                      </p>
                                    </div>
                                    {reg.result === 1 && <span style={{ fontSize: "1.2rem" }}>🏆</span>}
                                  </div>
                                ))}
                            </div>
                            {violations[race.id] && (
                              <div
                                className="m-0"
                                style={{ marginTop: 12, padding: 12, background: "rgba(255,222,165,0.4)", color: "#002a15", fontSize: "0.85rem", borderRadius: 4 }}
                              >
                                <strong>Notes:</strong> {violations[race.id]}
                              </div>
                            )}
                          </div>
                        )}
                      </HeritageCard>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <HeritageToast
        message={toast?.msg}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      <HeritageSlidePanel
        open={!!selectedRace}
        onClose={() => setSelectedRace(null)}
        title={selectedRace?.name || "Race Detail"}
      >
        {selectedRace && (
          <div className="grid gap-4">
            <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              {[
                { k: "Grade", v: selectedRace.grade },
                { k: "Distance", v: `${selectedRace.distance}m` },
                { k: "Condition", v: selectedRace.condition },
                { k: "Prize", v: `$${selectedRace.prizePool.toLocaleString()}` },
              ].map((f) => (
                <div key={f.k} style={{ padding: 12, background: "#f7f6f1", borderRadius: 4 }}>
                  <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {f.k}
                  </p>
                  <p className="m-0" style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700, marginTop: 4 }}>
                    {f.v}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center" style={{ gap: 10 }}>
              <span style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Status</span>
              <HeritageStatusPill status={selectedRace.status} />
            </div>
            <div>
              <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                Participants ({selectedRace.registrations.length})
              </p>
              <div className="grid gap-2">
                {selectedRace.registrations.map((reg, i) => (
                  <div
                    key={reg.id}
                    className="flex items-center"
                    style={{ padding: 12, background: "#f7f6f1", borderRadius: 4, gap: 12 }}
                  >
                    <span
                      className="grid place-items-center"
                      style={{
                        width: 32, height: 32, borderRadius: 999,
                        background: "#002a15", color: "#ffdea5",
                        fontSize: "0.78rem", fontWeight: 800,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="m-0" style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>
                        {reg.horseName}
                      </p>
                      <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 2 }}>
                        {reg.jockeyName} · {reg.ownerName}
                      </p>
                    </div>
                    <HeritageStatusPill status={reg.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </HeritageSlidePanel>

      {confirmingReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,42,21,0.55)", backdropFilter: "blur(3px)" }}
          onClick={() => setConfirmingReport(null)}
        >
          <div
            className="bg-white"
            style={{
              width: "min(100%, 460px)",
              borderRadius: 8,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #d7d3c7" }}>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.4rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                Submit Referee Report
              </h2>
              <p className="m-0" style={{ color: "#747b75", fontSize: "0.85rem", marginTop: 6 }}>
                {confirmingReport.name}
              </p>
            </div>
            <div className="grid gap-3" style={{ padding: 28 }}>
              <div style={{ padding: 14, background: "#dbeafe", color: "#1e40af", fontSize: "0.85rem", borderRadius: 4 }}>
                By submitting, you confirm the official results of this race are final and will be published.
              </div>
              <div style={{ padding: 14, background: "rgba(255,222,165,0.4)", color: "#002a15", fontSize: "0.85rem", borderRadius: 4 }}>
                This action cannot be undone. Results will be locked.
              </div>
              <div className="flex" style={{ gap: 8, marginTop: 8 }}>
                <HeritageButton variant="outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => setConfirmingReport(null)}>
                  Cancel
                </HeritageButton>
                <HeritageButton style={{ flex: 1, justifyContent: "center", background: "#b8860b", borderColor: "#b8860b" }} onClick={() => submitReport(confirmingReport)}>
                  Submit Report
                </HeritageButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </HeritageLayout>
  );
}
