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
} from "../components/layout/HeritageUI.jsx";

const HORSE_EMOJI = "🐎";

const INITIAL_INVITATIONS = [
  { id: "JOI01", horseName: "Thunder Bolt", ownerOrg: "Sunrise Stables", status: "Pending", message: "You are invited to ride Thunder Bolt at Spring Classic.", sentAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "JOI02", horseName: "Silver Arrow", ownerOrg: "Blue River Farm", status: "Accepted", message: "Ride Silver Arrow at Derby Cup.", sentAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const STATS_POOL = [
  { id: "ST01", raceName: "Spring Classic", horseName: "Silver Arrow", position: 1, time: "1:38.2", jockeyName: "Carlos Ruiz", date: "2025-04-15" },
  { id: "ST02", raceName: "Summer Sprint", horseName: "Silver Arrow", position: 2, time: "1:12.5", jockeyName: "Carlos Ruiz", date: "2025-07-10" },
  { id: "ST03", raceName: "Grand Prix", horseName: "Silver Arrow", position: 1, time: "2:05.8", jockeyName: "Carlos Ruiz", date: "2025-09-20" },
  { id: "ST04", raceName: "Autumn Cup", horseName: "Thunder Bolt", position: 3, time: "1:45.1", jockeyName: "Miguel Torres", date: "2025-11-05" },
  { id: "ST05", raceName: "Winter Classic", horseName: "Silver Arrow", position: 1, time: "1:55.3", jockeyName: "Carlos Ruiz", date: "2026-01-15" },
];

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

export default function JockeyDashboard() {
  const { user, tournament, races } = useApp();
  const [tab, setTab] = useState("invitations");
  const [invitations, setInvitations] = useState(INITIAL_INVITATIONS);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const acceptInvite = (id) => {
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: "Accepted" } : inv));
    showToast("Invitation accepted.");
  };
  const declineInvite = (id) => {
    setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: "Declined" } : inv));
    showToast("Invitation declined.");
  };

  const myEntries = races.flatMap((race) =>
    race.registrations
      .filter((reg) => reg.jockeyName === user?.name)
      .map((reg) => ({
        ...reg, raceId: race.id, raceDate: race.date, raceTime: race.time,
        raceVenue: race.venue, raceStatus: race.status, raceGrade: race.grade,
        raceDistance: race.distance, racePrize: race.prizePool,
      }))
  );

  const pending = myEntries.filter((e) => e.status === "Pending").length;
  const approved = myEntries.filter((e) => e.status === "Approved").length;

  const totalRaces = STATS_POOL.length;
  const wins = STATS_POOL.filter(s => s.position === 1).length;
  const winRate = totalRaces > 0 ? Math.round((wins / totalRaces) * 100) : 0;
  const podiumRate = totalRaces > 0 ? Math.round(((STATS_POOL.filter(s => s.position <= 3).length) / totalRaces) * 100) : 0;

  const nav = [
    { id: "invitations", label: "Invitations", count: invitations.length },
    { id: "races", label: "My Races" },
    { id: "schedule", label: "Schedule" },
    { id: "stats", label: "Stats" },
    { id: "tournament", label: "Tournament" },
  ];

  return (
    <HeritageLayout role="jockey" subtitle={`Professional Jockey — ${user?.name || ""}`}>
      <HeritagePageHeader
        eyebrow={`Professional Jockey · ${user?.name || "—"}`}
        title={tournament.name}
        subtitle={tournament.organizer}
      />

      <HeritageTabs tabs={nav} active={tab} onChange={setTab} />

      <section style={{ paddingBlock: "clamp(40px, 5vw, 56px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          {tab === "invitations" && (
            <>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", marginBottom: 40 }}
              >
                <HeritageStat value={invitations.length} label="Invitations" />
                <HeritageStat value={invitations.filter(i => i.status === "Accepted").length} label="Accepted" color="#166534" />
                <HeritageStat value={invitations.filter(i => i.status === "Pending").length} label="Pending" color="#b8860b" />
              </div>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 24, fontFamily: FONT_SERIF }}>
                Owner Invitations
              </h2>
              <div className="grid gap-3">
                {invitations.length === 0 ? (
                  <HeritageCard padding={64} style={{ textAlign: "center" }}>
                    <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No invitations received yet.</p>
                  </HeritageCard>
                ) : (
                  invitations.map(inv => (
                    <HeritageCard key={inv.id} padding={24}>
                      <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 14 }}>
                        <div className="flex items-center" style={{ gap: 14 }}>
                          <span
                            className="grid place-items-center"
                            style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(255,222,165,0.4)", fontSize: "1.4rem" }}
                          >
                            {HORSE_EMOJI}
                          </span>
                          <div>
                            <p className="m-0" style={{ color: "#002a15", fontSize: "1.1rem", fontWeight: 700, fontFamily: FONT_SERIF }}>
                              {inv.horseName}
                            </p>
                            <p className="m-0" style={{ color: "#747b75", fontSize: "0.8rem", marginTop: 2 }}>
                              {inv.ownerOrg} · {fmtDate(inv.sentAt)}
                            </p>
                          </div>
                        </div>
                        <HeritageStatusPill status={inv.status} />
                      </div>
                      {inv.message && (
                        <p
                          className="m-0"
                          style={{ padding: 12, background: "#f7f6f1", color: "#555e58", fontSize: "0.85rem", borderRadius: 4, marginBottom: inv.status === "Pending" ? 16 : 0 }}
                        >
                          {inv.message}
                        </p>
                      )}
                      {inv.status === "Pending" && (
                        <div className="flex" style={{ gap: 8 }}>
                          <HeritageButton style={{ flex: 1, justifyContent: "center" }} onClick={() => acceptInvite(inv.id)}>
                            Accept
                          </HeritageButton>
                          <HeritageButton variant="outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => declineInvite(inv.id)}>
                            Decline
                          </HeritageButton>
                        </div>
                      )}
                    </HeritageCard>
                  ))
                )}
              </div>
            </>
          )}

          {tab === "races" && (
            <>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", marginBottom: 40 }}
              >
                <HeritageStat value={myEntries.length} label="My Entries" />
                <HeritageStat value={approved} label="Approved" color="#166534" />
                <HeritageStat value={pending} label="Pending" color="#b8860b" />
              </div>
              <div className="grid gap-3">
                {myEntries.length === 0 ? (
                  <HeritageCard padding={64} style={{ textAlign: "center" }}>
                    <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>
                      No race entries found for {user?.name}. Sign in as a different user from Home.
                    </p>
                  </HeritageCard>
                ) : (
                  myEntries.map((entry) => (
                    <HeritageCard key={entry.id} padding={24}>
                      <div className="flex justify-between items-start flex-wrap gap-3" style={{ marginBottom: 12 }}>
                        <div>
                          <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                            {entry.raceName}
                          </h3>
                          <p className="m-0" style={{ marginTop: 6, color: "#555e58", fontSize: "0.88rem" }}>
                            Riding <strong style={{ color: "#002a15" }}>{entry.horseName}</strong> · {entry.horseColor}, {entry.horseAge}yo
                          </p>
                        </div>
                        <HeritageStatusPill status={entry.status} />
                      </div>
                      <div
                        className="grid"
                        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, padding: 14, background: "#f7f6f1", borderRadius: 4 }}
                      >
                        {[
                          { k: "Venue", v: entry.raceVenue },
                          { k: "Date", v: `${fmtDate(entry.raceDate)} ${entry.raceTime}` },
                          { k: "Distance", v: `${entry.raceDistance}m · ${entry.raceGrade}` },
                          { k: "Prize", v: `$${entry.racePrize.toLocaleString()}` },
                        ].map((f) => (
                          <div key={f.k}>
                            <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                              {f.k}
                            </p>
                            <p className="m-0" style={{ color: "#002a15", fontSize: "0.85rem", fontWeight: 700, marginTop: 2 }}>
                              {f.v}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 12 }}>
                        Owner: {entry.ownerName} · Trainer: {entry.trainerName} · Submitted {fmtDateTime(entry.submittedAt)}
                      </p>
                      {entry.status === "Rejected" && entry.note && (
                        <div
                          className="m-0"
                          style={{ marginTop: 12, padding: 12, background: "#fee2e2", color: "#991b1b", fontSize: "0.82rem", borderRadius: 4 }}
                        >
                          Rejection reason: {entry.note}
                        </div>
                      )}
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
                  const myEntry = race.registrations.find(reg => reg.jockeyName === user?.name);
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
                            {myEntry && (
                              <span style={{ padding: "3px 9px", background: "#002a15", color: "#ffdea5", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.1em", borderRadius: 3, textTransform: "uppercase" }}>
                                Entered
                              </span>
                            )}
                          </div>
                          <p className="m-0" style={{ color: "#747b75", fontSize: "0.85rem" }}>
                            {race.venue} · {fmtDate(race.date)} · {race.distance}m
                          </p>
                        </div>
                        <HeritageStatusPill status={race.status} />
                      </div>
                      <div className="flex items-center flex-wrap" style={{ padding: 20, gap: 14 }}>
                        {myEntry ? (
                          <>
                            <span
                              className="grid place-items-center"
                              style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,222,165,0.4)", fontSize: "1.2rem" }}
                            >
                              {HORSE_EMOJI}
                            </span>
                            <div className="flex-1">
                              <p className="m-0" style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>
                                {myEntry.horseName}
                              </p>
                              <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 2 }}>
                                {myEntry.horseColor} · {myEntry.horseAge}yo · {myEntry.ownerName}
                              </p>
                            </div>
                            <HeritageStatusPill status={myEntry.status} />
                          </>
                        ) : (
                          <p className="m-0" style={{ color: "#747b75", fontSize: "0.9rem" }}>
                            You are not entered in this race.
                          </p>
                        )}
                      </div>
                    </HeritageCard>
                  );
                })}
              </div>
            </>
          )}

          {tab === "stats" && (
            <>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 24, fontFamily: FONT_SERIF }}>
                Performance Statistics
              </h2>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", marginBottom: 40 }}
              >
                <HeritageStat value={totalRaces} label="Total Races" />
                <HeritageStat value={wins} label="Wins (1st)" color="#b8860b" />
                <HeritageStat value={`${winRate}%`} label="Win Rate" color="#1e40af" />
                <HeritageStat value={`${podiumRate}%`} label="Podium Rate" color="#166534" />
              </div>
              <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, marginBottom: 16, fontFamily: FONT_SERIF }}>
                Race History
              </h3>
              <HeritageCard padding={0} style={{ overflow: "hidden" }}>
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f7f6f1", borderBottom: "1px solid #d7d3c7" }}>
                      {["Date", "Race", "Horse", "Pos.", "Time"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: h === "Pos." ? "center" : h === "Time" ? "right" : "left",
                            padding: "16px 24px", fontSize: "0.7rem", fontWeight: 800,
                            letterSpacing: "0.12em", textTransform: "uppercase", color: "#555e58",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {STATS_POOL.map((s, i) => (
                      <tr
                        key={s.id}
                        style={{ borderBottom: i === STATS_POOL.length - 1 ? "none" : "1px solid #f0ede4", background: i % 2 === 0 ? "#fff" : "#faf8f1" }}
                      >
                        <td style={{ padding: "14px 24px", color: "#747b75", fontSize: "0.82rem" }}>{fmtDate(s.date)}</td>
                        <td style={{ padding: "14px 24px", color: "#002a15", fontSize: "0.92rem", fontWeight: 700 }}>{s.raceName}</td>
                        <td style={{ padding: "14px 24px", color: "#1f231f", fontSize: "0.88rem" }}>{s.horseName}</td>
                        <td style={{ padding: "14px 24px", textAlign: "center" }}>
                          <PositionBadge pos={s.position} />
                        </td>
                        <td style={{ padding: "14px 24px", textAlign: "right", color: "#555e58", fontSize: "0.85rem", fontWeight: 600 }}>{s.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </HeritageCard>
            </>
          )}

          {tab === "tournament" && (
            <>
              <HeritageCard padding={32} style={{ marginBottom: 32 }}>
                <div className="flex justify-between items-start flex-wrap gap-4" style={{ marginBottom: 24 }}>
                  <div>
                    <p className="m-0" style={{ color: "#747b75", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Tournament
                    </p>
                    <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.7rem", fontWeight: 500, marginTop: 6, fontFamily: FONT_SERIF }}>
                      {tournament.name}
                    </h2>
                    <p className="m-0" style={{ marginTop: 6, color: "#555e58", fontSize: "0.92rem" }}>
                      {tournament.organizer}
                    </p>
                  </div>
                  <HeritageStatusPill status={tournament.status} />
                </div>
                <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
                  {[
                    { k: "Location", v: tournament.location },
                    { k: "Prize Fund", v: fmtMillions(tournament.totalPrize) },
                    { k: "Start", v: fmtDate(tournament.startDate) },
                    { k: "End", v: fmtDate(tournament.endDate) },
                    { k: "Deadline", v: fmtDate(tournament.registrationDeadline) },
                    { k: "Status", v: tournament.status },
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

              <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, marginBottom: 16, fontFamily: FONT_SERIF }}>
                All Races
              </h3>
              <div className="grid gap-2.5">
                {races.map((race) => {
                  const mine = race.registrations.some((r) => r.jockeyName === user?.name);
                  return (
                    <div
                      key={race.id}
                      className="flex items-center justify-between flex-wrap gap-3"
                      style={{
                        padding: 18,
                        background: mine ? "rgba(255,222,165,0.4)" : "#fff",
                        border: "1px solid #d7d3c7",
                        borderRadius: 6,
                      }}
                    >
                      <div className="flex items-center flex-wrap" style={{ gap: 10 }}>
                        <span style={{ color: "#002a15", fontSize: "0.98rem", fontWeight: 700, fontFamily: FONT_SERIF }}>
                          {race.name}
                        </span>
                        {mine && (
                          <span style={{ padding: "3px 9px", background: "#002a15", color: "#ffdea5", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.1em", borderRadius: 3, textTransform: "uppercase" }}>
                            Your Race
                          </span>
                        )}
                      </div>
                      <div className="flex items-center flex-wrap" style={{ gap: 14 }}>
                        <span style={{ color: "#747b75", fontSize: "0.8rem" }}>{race.venue}</span>
                        <span style={{ color: "#747b75", fontSize: "0.8rem" }}>{fmtDate(race.date)}</span>
                        <span style={{ color: "#747b75", fontSize: "0.8rem" }}>{race.distance}m · {race.grade}</span>
                        <span style={{ color: "#002a15", fontSize: "0.85rem", fontWeight: 700 }}>${race.prizePool.toLocaleString()}</span>
                        <HeritageStatusPill status={race.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <HeritageToast message={toast} onClose={() => setToast(null)} />
    </HeritageLayout>
  );
}
