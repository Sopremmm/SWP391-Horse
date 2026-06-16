import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import { fmtDate, fmtCurrency } from "../format.js";
import HeritageLayout, { FONT_SERIF } from "../components/layout/HeritageLayout.jsx";
import {
  HeritageTabs,
  HeritageStat,
  HeritageCard,
  HeritageButton,
  HeritageStatusPill,
  HeritagePageHeader,
} from "../components/layout/HeritageUI.jsx";
import SpectatorRaceCard, { BetModal } from "../components/spectator/SpectatorRaceCard.jsx";

export default function SpectatorDashboard() {
  const { user, login, races, bets } = useApp();
  const [tab, setTab] = useState("races");
  const [selectedRace, setSelectedRace] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInId, setSignInId] = useState("");

  const upcomingRaces = races.filter((r) => r.status === "Upcoming");
  const finishedRaces = races.filter((r) => r.status === "Finished");
  const myBets = user ? bets.filter((b) => b.userId === user.id) : [];
  const myPredCount = myBets.length;

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!signInId.trim()) return;
    login(signInId.trim());
    setShowSignIn(false);
    setSignInId("");
  };

  if (!user) {
    return (
      <HeritageLayout role="spectator">
        <HeritagePageHeader
          eyebrow="Spectator Access"
          title="Sign in to bet & follow races"
          subtitle="Track your bets, follow horses, and watch live results — all in one place."
        />
        <section style={{ paddingBlock: "clamp(40px, 5vw, 64px)" }}>
          <div className="w-full mx-auto px-7 md:px-10 lg:px-16" style={{ maxWidth: 480 }}>
            <HeritageCard padding={32}>
              <form onSubmit={handleSignIn} className="grid gap-4">
                <div>
                  <label
                    style={{
                      display: "block", marginBottom: 8,
                      color: "#747b75", fontSize: "0.7rem", fontWeight: 800,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                    }}
                  >
                    User ID
                  </label>
                  <input
                    value={signInId}
                    onChange={(e) => setSignInId(e.target.value)}
                    placeholder="e.g. U009 (Lisa Spectator)"
                    required
                    className="w-full px-3.5 py-2.5 text-sm border-0 outline-none"
                    style={{ background: "#f7f6f1", color: "#002a15", borderRadius: 2 }}
                  />
                </div>
                <HeritageButton type="submit" size="lg" style={{ width: "100%", justifyContent: "center" }}>
                  Sign In
                </HeritageButton>
                <p className="m-0 text-center" style={{ color: "#747b75", fontSize: "0.82rem" }}>
                  No account?{" "}
                  <button
                    type="button"
                    onClick={() => { setShowSignIn(false); }}
                    className="bg-transparent border-0 cursor-pointer"
                    style={{ color: "#002a15", fontWeight: 800, textDecoration: "underline" }}
                  >
                    Sign up free
                  </button>
                </p>
              </form>
            </HeritageCard>
            <p className="text-center" style={{ color: "#747b75", fontSize: "0.82rem", marginTop: 16 }}>
              Already a registered spectator?{" "}
              <Link to="/spectator/home" style={{ color: "#002a15", fontWeight: 800, textDecoration: "underline" }}>
                Go to Spectator Home
              </Link>
            </p>
          </div>
        </section>
      </HeritageLayout>
    );
  }

  const nav = [
    { id: "races", label: "Races" },
    { id: "predictions", label: "My Predictions", count: myPredCount },
    { id: "results", label: "Results" },
  ];

  return (
    <HeritageLayout role="spectator" subtitle="Spectator">
      <HeritagePageHeader
        eyebrow="Spectator Dashboard"
        title={`Welcome, ${user.name}`}
        subtitle="Browse upcoming races, place your bets, and follow the action."
      />

      <HeritageTabs tabs={nav} active={tab} onChange={setTab} />

      <section style={{ paddingBlock: "clamp(40px, 5vw, 56px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          {tab === "races" && (
            <>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", marginBottom: 40 }}
              >
                <HeritageStat value={upcomingRaces.length} label="Upcoming Races" />
                <HeritageStat value={finishedRaces.length} label="Finished" color="#166534" />
                <HeritageStat value={myPredCount} label="My Bets" color="#1e40af" />
                <HeritageStat
                  value={fmtCurrency(myBets.reduce((s, b) => s + b.amount, 0))}
                  label="Total Staked"
                  color="#b8860b"
                />
              </div>

              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                  Upcoming Races
                </h2>
                <Link
                  to="/spectator/bets"
                  className="no-underline"
                  style={{ color: "#002a15", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  View My Bets →
                </Link>
              </div>
              {upcomingRaces.length === 0 ? (
                <HeritageCard padding={64} style={{ textAlign: "center" }}>
                  <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No upcoming races at the moment.</p>
                </HeritageCard>
              ) : (
                <div
                  className="grid gap-5"
                  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
                >
                  {upcomingRaces.map((race) => (
                    <SpectatorRaceCard
                      key={race.id}
                      race={race}
                      onPlaceBet={setSelectedRace}
                    />
                  ))}
                </div>
              )}

              {selectedRace && (
                <BetModal
                  race={races.find((r) => r.id === selectedRace.id) || selectedRace}
                  onClose={() => setSelectedRace(null)}
                  onPlaced={() => {}}
                />
              )}
            </>
          )}

          {tab === "predictions" && (
            <>
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                  My Bets
                </h2>
                <Link
                  to="/spectator/bets"
                  className="no-underline"
                  style={{ color: "#002a15", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  Open full history →
                </Link>
              </div>
              {myPredCount === 0 ? (
                <HeritageCard padding={64} style={{ textAlign: "center" }}>
                  <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem", marginBottom: 16 }}>No bets placed yet.</p>
                  <HeritageButton onClick={() => setTab("races")}>Browse Races</HeritageButton>
                </HeritageCard>
              ) : (
                <div className="grid gap-3">
                  {myBets.slice(0, 5).map((bet) => {
                    const race = races.find((r) => r.id === bet.raceId);
                    return (
                      <HeritageCard key={bet.id} padding={20}>
                        <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 12 }}>
                          <p className="m-0" style={{ color: "#002a15", fontSize: "1.05rem", fontWeight: 700, fontFamily: FONT_SERIF }}>
                            {race?.name || "Unknown race"}
                          </p>
                          <span style={{ color: "#747b75", fontSize: "0.78rem" }}>{fmtDate(bet.placedAt)}</span>
                        </div>
                        <div className="flex items-center" style={{ gap: 12 }}>
                          <span
                            className="grid place-items-center"
                            style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,222,165,0.4)", fontSize: "1.2rem" }}
                          >
                            🐎
                          </span>
                          <div className="flex-1">
                            <p className="m-0" style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>
                              {bet.horseName}
                            </p>
                            <p className="m-0" style={{ color: "#747b75", fontSize: "0.78rem", marginTop: 2 }}>
                              {race?.venue} · Stake {fmtCurrency(bet.amount)} · Odds {bet.odds.toFixed(2)}x
                            </p>
                          </div>
                          {race?.status === "Finished" ? (
                            <HeritageStatusPill status={bet.status === "Won" ? "Approved" : "Rejected"} />
                          ) : (
                            <span
                              style={{
                                padding: "4px 12px", borderRadius: 999,
                                background: "rgba(255,222,165,0.4)", color: "#002a15",
                                fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em",
                                textTransform: "uppercase",
                              }}
                            >
                              Pending
                            </span>
                          )}
                        </div>
                      </HeritageCard>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {tab === "results" && (
            <>
              <h2 className="m-0" style={{ color: "#002a15", fontSize: "1.5rem", fontWeight: 500, marginBottom: 24, fontFamily: FONT_SERIF }}>
                Race Results
              </h2>
              {finishedRaces.length === 0 ? (
                <HeritageCard padding={64} style={{ textAlign: "center" }}>
                  <p className="m-0" style={{ color: "#555e58", fontSize: "0.95rem" }}>No finished races yet.</p>
                </HeritageCard>
              ) : (
                <div className="grid gap-4">
                  {finishedRaces.map((race) => {
                    const winner = (race.registrations || []).find((r) => r.result === 1);
                    return (
                      <HeritageCard key={race.id} padding={0} style={{ overflow: "hidden" }}>
                        <div className="flex items-center justify-between flex-wrap gap-3" style={{ padding: 24, borderBottom: "1px solid #f0ede4" }}>
                          <div>
                            <h3 className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, fontFamily: FONT_SERIF }}>
                              {race.name}
                            </h3>
                            <p className="m-0" style={{ color: "#747b75", fontSize: "0.82rem", marginTop: 4 }}>
                              {race.venue} · {fmtDate(race.date)}
                            </p>
                          </div>
                          <HeritageStatusPill status="Finished" />
                        </div>
                        {winner && (
                          <div
                            className="flex items-center"
                            style={{ padding: 18, background: "rgba(255,222,165,0.4)", borderBottom: "1px solid rgba(215,211,199,0.4)", gap: 14 }}
                          >
                            <span
                              className="grid place-items-center"
                              style={{ width: 48, height: 48, borderRadius: 8, background: "#fff", fontSize: "1.4rem", border: "1px solid #d7d3c7" }}
                            >
                              🏆
                            </span>
                            <div>
                              <p className="m-0" style={{ color: "#002a15", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                                Winner
                              </p>
                              <p className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, marginTop: 4, fontFamily: FONT_SERIF }}>
                                {winner.horseName}
                              </p>
                              <p className="m-0" style={{ color: "#555e58", fontSize: "0.82rem", marginTop: 2 }}>
                                {winner.jockeyName} · {fmtCurrency(race.prizePool)}
                              </p>
                            </div>
                          </div>
                        )}
                        <div style={{ padding: 20 }}>
                          <p className="m-0" style={{ color: "#747b75", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                            Full Results
                          </p>
                          {(race.registrations || [])
                            .sort((a, b) => (a.result || 999) - (b.result || 999))
                            .map((reg, i) => (
                              <div
                                key={reg.id}
                                className="flex items-center"
                                style={{ padding: "10px 0", borderBottom: i === race.registrations.length - 1 ? "none" : "1px solid #f0ede4", gap: 12 }}
                              >
                                <span
                                  className="grid place-items-center"
                                  style={{
                                    width: 28, height: 28, borderRadius: 999,
                                    background: i === 0 ? "#ffdea5" : i === 1 ? "#d1d5db" : i === 2 ? "#fed7aa" : "#e5e7eb",
                                    color: "#002a15", fontSize: "0.75rem", fontWeight: 800,
                                  }}
                                >
                                  {reg.result || "—"}
                                </span>
                                <span style={{ color: "#002a15", fontSize: "0.92rem", fontWeight: 700, flex: 1 }}>
                                  {reg.horseName}
                                </span>
                                <span style={{ color: "#747b75", fontSize: "0.78rem" }}>
                                  {reg.jockeyName}
                                </span>
                              </div>
                            ))}
                        </div>
                      </HeritageCard>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </HeritageLayout>
  );
}
