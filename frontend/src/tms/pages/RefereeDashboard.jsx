import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import {
  BRAND,
  BRAND_BORDER,
  BRAND_LIGHT,
  BRAND_TEXT,
  BORDER,
  PAGE_BG,
  TEXT,
  TEXT_MUTED,
} from "../constants.js";
import { fmtDate } from "../format.js";
import AppShell from "../components/layout/AppShell.jsx";
import StatusPill from "../components/common/StatusPill.jsx";

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

export default function RefereeDashboard() {
  const { user, races } = useApp();
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

  const nav = [
    { id: "assigned", label: "My Races", icon: "shield-check" },
    { id: "reports", label: "Reports", icon: "file-text" },
  ];

  return (
    <AppShell page={tab} setPage={setTab} nav={nav} subtitle="Referee">
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-lg"
          style={{ background: toast.type === "success" ? "#d1fae5" : "#fee2e2", color: toast.type === "success" ? "#166534" : "#991b1b", border: `1px solid ${toast.type === "success" ? "#86efac" : "#fca5a5"}` }}>
          <i className={`ti ti-${toast.type === "success" ? "circle-check" : "circle-x"} mr-2`} />
          {toast.msg}
        </div>
      )}

      {tab === "assigned" && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard label="Assigned Races" value={myAssignedRaces.length} icon="shield-check" color={BRAND_TEXT} bg={BRAND_LIGHT} border={BRAND_BORDER} />
            <StatCard label="Upcoming" value={myAssignedRaces.filter(r => r.status === "Upcoming").length} icon="calendar-event" color="#1e40af" bg="#eff6ff" border="#93c5fd" />
            <StatCard label="Finished" value={myAssignedRaces.filter(r => r.status === "Finished").length} icon="circle-check" color="#166534" bg="#dcfce7" border="#86efac" />
            <StatCard label="Reports" value={completedReports.length} icon="file-text" color="#b8860b" bg="#fff8e7" border="#d4a820" />
          </div>

          <h2 className="text-lg font-bold text-slate-800 mb-4">Races Assigned to You</h2>
          <div className="flex flex-col gap-3">
            {myAssignedRaces.map(race => (
              <div key={race.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{race.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <span><i className="ti ti-map-pin mr-1" />{race.venue}</span>
                      <span><i className="ti ti-calendar mr-1" />{fmtDate(race.date)}</span>
                      <span><i className="ti ti-ruler-measure mr-1" />{race.distance}m</span>
                    </p>
                  </div>
                  <StatusPill status={race.status} />
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-3 text-xs text-slate-500">
                  <span><i className="ti ti-users mr-1" />{race.registrations.length} participants</span>
                  <span><i className="ti ti-trophy mr-1" />${race.prizePool.toLocaleString()}</span>
                  <span><i className="ti ti-weather-partly-cloudy mr-1" />{race.condition}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedRace(race)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: BRAND }}>
                    <i className="ti ti-eye mr-1.5" />Manage Race
                  </button>
                  {race.status === "Finished" && !race.reportSubmitted && (
                    <button onClick={() => { setSelectedRace(race); setTab("reports"); }} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#fff8e7", color: "#b8860b", border: "1px solid #d4a820" }}>
                      <i className="ti ti-file-text mr-1.5" />Submit Report
                    </button>
                  )}
                  {race.reportSubmitted && (
                    <span className="px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: BRAND_LIGHT, color: BRAND_TEXT }}><i className="ti ti-circle-check mr-1" />Report Submitted</span>
                  )}
                </div>
              </div>
            ))}
            {myAssignedRaces.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: BRAND_LIGHT, border: `1px solid ${BRAND_BORDER}` }}>
                  <i className="ti ti-shield-check text-2xl" style={{ color: BRAND_TEXT }} />
                </div>
                <p className="text-slate-500 text-sm">No races assigned to you yet. Admin will assign races.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "reports" && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Referee Reports</h2>

          {myAssignedRaces.filter(r => r.status === "Finished").length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-slate-500 text-sm">No finished races to report on.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myAssignedRaces.filter(r => r.status === "Finished").map(race => (
                <div key={race.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800">{race.name}</h3>
                      <p className="text-xs text-slate-400">{fmtDate(race.date)} · {race.venue}</p>
                    </div>
                    {race.reportSubmitted ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: BRAND_LIGHT, color: BRAND_TEXT }}><i className="ti ti-circle-check mr-1" />Submitted</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>
                    )}
                  </div>

                  {!race.reportSubmitted && (
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Participants</p>
                        <div className="flex flex-col gap-2">
                          {race.registrations.map((reg, i) => (
                            <div key={reg.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: BORDER }}>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: BRAND }}>{i + 1}</div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-800">{reg.horseName}</p>
                                <p className="text-xs text-slate-400">{reg.jockeyName}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Violations (optional)</p>
                        <textarea
                          placeholder="Record any violations during the race..."
                          rows={3}
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2 resize-none"
                          style={{ borderColor: BORDER }}
                          onChange={e => setViolations(v => ({ ...v, [race.id]: e.target.value }))}
                        />
                      </div>

                      <button
                        onClick={() => {
                          setConfirmingReport(race);
                        }}
                        className="px-5 py-2.5 rounded-xl font-semibold text-white"
                        style={{ background: "#b8860b" }}
                      >
                        <i className="ti ti-send mr-1.5" />Submit Official Report
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirm Report Modal */}
      {confirmingReport && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setConfirmingReport(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Submit Referee Report</h3>
              <p className="text-xs text-slate-500 mt-1">{confirmingReport.name}</p>
            </div>
            <div className="p-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-700">
                <i className="ti ti-info-circle mr-1.5" />
                By submitting, you confirm the official results of this race are final.
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-xs text-yellow-700">
                <i className="ti ti-alert-triangle mr-1.5" />
                This action cannot be undone.
              </div>
              <div className="flex gap-2">
                <button onClick={() => setConfirmingReport(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold" style={{ borderColor: BORDER, color: TEXT_MUTED }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmingReport(null);
                    showToast("Referee report submitted successfully.");
                  }}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white"
                  style={{ background: "#b8860b" }}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
