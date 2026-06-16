import { useState } from "react";
import { useApp } from "../AppContext.jsx";
import { fmtDate, fmtMillions } from "../format.js";
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

export default function HostHome() {
  const { user, tournament, races } = useApp();
  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState(null);

  const venueRaces = races.filter((r) => r.venue === user?.venue);
  const allRegs = venueRaces.flatMap((r) =>
    r.registrations.map((reg) => ({ ...reg, raceId: r.id, raceVenue: r.venue }))
  );
  const pending = allRegs.filter((r) => r.status === "Pending").length;
  const approved = allRegs.filter((r) => r.status === "Approved").length;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const nav = [
    { id: "overview", label: "Overview" },
    { id: "schedule", label: "Schedule" },
    { id: "races", label: "My Races" },
    { id: "registrations", label: "Registrations", count: allRegs.length },
  ];

  return (
    <HeritageLayout role="host" subtitle={`Host — ${user?.venue || ""}`}>
      <HeritagePageHeader
        eyebrow={`Venue Host · ${user?.venue || "—"}`}
        title={tournament.name}
        subtitle={tournament.organizer}
      />

      <HeritageTabs tabs={nav} active={tab} onChange={setTab} />

      <section style={{ paddingBlock: "clamp(40px, 5vw, 56px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          {tab === "overview" && (
            <>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", marginBottom: 40 }}
              >
                <HeritageStat value={venueRaces.length} label="Races at Venue" />
                <HeritageStat value={allRegs.length} label="Total Entries" color="#1e40af" />
                <HeritageStat value={pending} label="Pending Review" color="#b8860b" />
                <HeritageStat value={approved} label="Approved" color="#166534" />
              </div>

              <HeritageCard padding={32} style={{ marginBottom: 32 }}>
                <div className="flex justify-between items-start flex-wrap gap-4" style={{ marginBottom: 24 }}>
                  <div>
                    <p className="m-0" style={{ color: "#747b75", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      Current Tournament
                    </p>
                    <h2
                      className="m-0"
                      style={{ color: "#002a15", fontSize: "1.7rem", fontWeight: 500, marginTop: 6, fontFamily: FONT_SERIF }}
                    >
                      {tournament.name}
                    </h2>
                    <p className="m-0" style={{ marginTop: 6, color: "#555e58", fontSize: "0.92rem" }}>
                      {tournament.organizer}
                    </p>
                  </div>
                  <HeritageStatusPill status={tournament.status} />
                </div>
                <div
                  className="grid"
                  style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}
                >
                  {[
                    { k: "Location", v: tournament.location },
                    { k: "Prize Fund", v: fmtMillions(tournament.totalPrize) },
                    { k: "Registration Deadline", v: fmtDate(tournament.registrationDeadline) },
                    { k: "Your Venue", v: user?.venue || "—" },
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

              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 20, fontFamily: FONT_SERIF }}>
                Venue Activity
              </h2>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
              >
                <HeritageCard padding={24}>
                  <p className="m-0" style={{ color: "#b8860b", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Pending Approvals
                  </p>
                  <p className="m-0" style={{ color: "#002a15", fontSize: "2.4rem", fontWeight: 500, marginTop: 12, fontFamily: FONT_SERIF }}>
                    {pending}
                  </p>
                  <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 6 }}>
                    Registration requests awaiting review
                  </p>
                </HeritageCard>
                <HeritageCard padding={24}>
                  <p className="m-0" style={{ color: "#166534", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Approved Entries
                  </p>
                  <p className="m-0" style={{ color: "#002a15", fontSize: "2.4rem", fontWeight: 500, marginTop: 12, fontFamily: FONT_SERIF }}>
                    {approved}
                  </p>
                  <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 6 }}>
                    Registrations confirmed for races
                  </p>
                </HeritageCard>
              </div>
            </>
          )}

          {tab === "schedule" && (
            <>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 24, fontFamily: FONT_SERIF }}>
                Race Schedule at {user?.venue}
              </h2>
              <div className="grid gap-4">
                {venueRaces.filter(r => r.status !== "Cancelled").map(race => (
                  <HeritageCard key={race.id} padding={28}>
                    <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 16 }}>
                      <div>
                        <div className="flex items-center" style={{ gap: 10, marginBottom: 4 }}>
                          <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.3rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                            {race.name}
                          </h3>
                          <span
                            style={{
                              padding: "3px 9px", background: "#f0ede4", color: "#002a15",
                              fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", borderRadius: 3,
                            }}
                          >
                            {race.grade}
                          </span>
                        </div>
                        <p className="m-0" style={{ color: "#747b75", fontSize: "0.85rem" }}>
                          {race.venue} · {race.distance}m
                        </p>
                      </div>
                      <HeritageStatusPill status={race.status} />
                    </div>
                    <div className="flex flex-wrap items-center" style={{ gap: 12 }}>
                      {[
                        { k: "Time", v: race.time, color: "#263b12", bg: "rgba(255,222,165,0.4)" },
                        { k: "Track", v: race.condition, color: "#166534", bg: "#dcfce7" },
                        { k: "Prize", v: `$${race.prizePool.toLocaleString()}`, color: "#002a15", bg: "#f0ede4" },
                        { k: "Entries", v: `${race.registrations.length} horses`, color: "#555e58", bg: "transparent" },
                      ].map((c) => (
                        <div
                          key={c.k}
                          className="inline-flex items-center"
                          style={{ padding: "8px 14px", background: c.bg, borderRadius: 4, gap: 8, border: c.bg === "transparent" ? "1px solid #d7d3c7" : "none" }}
                        >
                          <span style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                            {c.k}
                          </span>
                          <span style={{ color: c.color, fontSize: "0.85rem", fontWeight: 700 }}>
                            {c.v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </HeritageCard>
                ))}
                {venueRaces.length === 0 && (
                  <HeritageCard padding={64} style={{ textAlign: "center" }}>
                    <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No races scheduled at your venue yet.</p>
                  </HeritageCard>
                )}
              </div>
            </>
          )}

          {tab === "races" && (
            <div className="grid gap-4">
              {venueRaces.map((race) => (
                <HeritageCard key={race.id} padding={28}>
                  <div className="flex justify-between items-start flex-wrap gap-3" style={{ marginBottom: 14 }}>
                    <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.3rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                      {race.name}
                    </h3>
                    <HeritageStatusPill status={race.status} />
                  </div>
                  <p className="m-0" style={{ color: "#555e58", fontSize: "0.88rem", marginBottom: 12 }}>
                    {fmtDate(race.date)} · {race.time} · {race.venue} · {race.distance}m · {race.grade} · ${race.prizePool.toLocaleString()} · {race.registrations.length} entries
                  </p>
                  <div
                    style={{ padding: 12, background: "#f7f6f1", borderRadius: 4, fontSize: "0.85rem", color: "#002a15", fontWeight: 600 }}
                  >
                    Track condition: {race.condition}
                  </div>
                </HeritageCard>
              ))}
              {venueRaces.length === 0 && (
                <HeritageCard padding={64} style={{ textAlign: "center" }}>
                  <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No races scheduled at your venue yet.</p>
                </HeritageCard>
              )}
            </div>
          )}

          {tab === "registrations" && (
            <HeritageCard padding={0} style={{ overflow: "hidden" }}>
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f7f6f1", borderBottom: "1px solid #d7d3c7" }}>
                    {["Horse", "Jockey", "Race", "Status"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left", padding: "16px 24px",
                          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em",
                          textTransform: "uppercase", color: "#555e58",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allRegs.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 64, textAlign: "center", color: "#747b75", fontSize: "0.9rem" }}>
                        No registrations yet.
                      </td>
                    </tr>
                  ) : (
                    allRegs.map((reg, i) => (
                      <tr
                        key={reg.id}
                        style={{ borderBottom: i === allRegs.length - 1 ? "none" : "1px solid #f0ede4" }}
                      >
                        <td style={{ padding: "16px 24px", color: "#002a15", fontSize: "0.92rem", fontWeight: 700 }}>{reg.horseName}</td>
                        <td style={{ padding: "16px 24px", color: "#1f231f", fontSize: "0.88rem" }}>{reg.jockeyName}</td>
                        <td style={{ padding: "16px 24px", color: "#1f231f", fontSize: "0.88rem" }}>{reg.raceName}</td>
                        <td style={{ padding: "16px 24px" }}><HeritageStatusPill status={reg.status} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </HeritageCard>
          )}
        </div>
      </section>

      <HeritageToast message={toast} onClose={() => setToast(null)} />
    </HeritageLayout>
  );
}
