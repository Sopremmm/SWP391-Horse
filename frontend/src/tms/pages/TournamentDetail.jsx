import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SpectatorLayout from "../components/spectator/SpectatorLayout.jsx";
import { RACES_SEED } from "../races.js";
import { INITIAL_HORSES } from "../data.js";
import { useApp } from "../AppContext.jsx";
import { getOddsForHorse } from "../data.js";

const HERO_BANNER =
  "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&q=80&auto=format&fit=crop";

const HORSE_PORTRAIT = "https://images.unsplash.com/photo-1538610111451-b006900ee327?auto=format&fit=crop&q=80&w=400&h=400";

function FormDot({ position }) {
  const colors = {
    1: { bg: "#ffdea5", color: "#002a15" },
    2: { bg: "#f0ede4", color: "#002a15" },
    3: { bg: "#f0ede4", color: "#555e58" },
  };
  const c = colors[position] || { bg: "#f0ede4", color: "#555e58" };
  return (
    <span
      className="inline-grid place-items-center"
      style={{
        width: 26, height: 26, borderRadius: 999,
        background: c.bg, color: c.color,
        fontSize: "0.72rem", fontWeight: 800,
      }}
    >
      {position}
    </span>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function TournamentDetail() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { user, placeBet } = useApp();
  const race = RACES_SEED.find((r) => r.id === raceId) || RACES_SEED[0];

  const [tab, setTab] = useState("qualifying-a");
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [betAmount, setBetAmount] = useState(50);
  const [betSuccess, setBetSuccess] = useState(null);
  const [betError, setBetError] = useState("");

  // Build the horse entries for the race from the registrations + INITIAL_HORSES
  const horseEntries = useMemo(() => {
    const approved = (race.registrations || []).filter((r) => r.status === "Approved");
    return approved.map((reg, i) => {
      const baseHorse = INITIAL_HORSES[i % INITIAL_HORSES.length];
      return {
        id: `${race.id}-${reg.id}`,
        regId: reg.id,
        name: reg.horseName,
        age: reg.horseAge,
        color: reg.horseColor,
        owner: reg.ownerName,
        jockey: reg.jockeyName,
        trainer: reg.trainerName,
        licenseNo: reg.licenseNo,
        odds: getOddsForHorse(reg.horseName),
        form: [Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 3) + 1, Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 1],
        weight: 500 + Math.floor(Math.random() * 30),
        rating: 80 + Math.floor(Math.random() * 20),
        img: HORSE_PORTRAIT,
        gateSpeed: (4 + Math.random()).toFixed(1),
        career: Math.floor(Math.random() * 30) + 5,
      };
    });
  }, [race.id]);

  // Split into two race tabs
  const half = Math.ceil(horseEntries.length / 2) || 1;
  const tabA = horseEntries.slice(0, half);
  const tabB = horseEntries.slice(half);
  const currentList = tab === "qualifying-a" ? tabA : tabB;

  const selectedEntry = selectedHorse
    ? horseEntries.find((h) => h.id === selectedHorse)
    : null;

  const odds = selectedEntry ? selectedEntry.odds : 0;
  const payout = Math.round(betAmount * odds * 100) / 100;

  const handlePlaceBet = () => {
    setBetError("");
    if (!user) {
      navigate("/");
      return;
    }
    if (!selectedEntry) {
      setBetError("Select a horse first.");
      return;
    }
    if (betAmount < 10) {
      setBetError("Minimum stake is $10.");
      return;
    }
    const bet = placeBet({
      raceId: race.id,
      horseName: selectedEntry.name,
      jockeyName: selectedEntry.jockey,
      amount: betAmount,
    });
    setBetSuccess(bet);
    setTimeout(() => {
      setSelectedHorse(null);
      setBetSuccess(null);
      setBetAmount(50);
    }, 2400);
  };

  return (
    <SpectatorLayout>
      {/* HERO BANNER */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: 420 }}
      >
        <img
          src={HERO_BANNER}
          alt={race.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,42,21,0.4) 0%, rgba(0,42,21,0.92) 100%)",
          }}
        />
        <div
          className="relative z-10 w-full mx-auto px-7 md:px-10 lg:px-16"
          style={{ paddingBlock: "120px 48px" }}
        >
          <Link
            to="/spectator/tournaments"
            className="no-underline inline-flex items-center"
            style={{
              color: "#ffdea5",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
              gap: 6,
            }}
          >
            ← Back to Tournaments
          </Link>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p
                className="m-0 inline-flex items-center"
                style={{
                  color: "#ffdea5",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  gap: 10,
                }}
              >
                <span style={{ width: 32, height: 1, background: "#ffdea5" }} />
                {race.grade} · {race.distance}m
              </p>
              <h1
                className="m-0"
                style={{
                  color: "#fff",
                  fontSize: "clamp(2.4rem, 5.4vw, 4.2rem)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                  marginTop: 14,
                  fontFamily: '"EB Garamond", Georgia, serif',
                }}
              >
                {race.name}
              </h1>
              <p
                className="m-0"
                style={{
                  marginTop: 12,
                  color: "rgba(210,245,219,0.85)",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              >
                {race.venue} · {new Date(race.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {race.time}
              </p>
            </div>
            <div className="flex flex-wrap" style={{ gap: 24, padding: 20, background: "rgba(0,0,0,0.3)", borderRadius: 8, backdropFilter: "blur(8px)" }}>
              {[
                { label: "Prize Pool", value: `$${race.prizePool.toLocaleString()}` },
                { label: "Field", value: `${horseEntries.length} horses` },
                { label: "Track", value: race.condition },
              ].map((s) => (
                <div key={s.label}>
                  <p className="m-0" style={{ color: "#ffdea5", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {s.label}
                  </p>
                  <p className="m-0" style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, marginTop: 4, fontFamily: '"EB Garamond", Georgia, serif' }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RACE TABS */}
      <section
        style={{ background: "#fff", borderBottom: "1px solid #d7d3c7" }}
      >
        <div
          className="w-full mx-auto px-7 md:px-10 lg:px-16 flex"
          style={{ gap: 4 }}
        >
          {[
            { id: "qualifying-a", label: `Qualifying A · ${tabA.length}` },
            { id: "qualifying-b", label: `Qualifying B · ${tabB.length}` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); setSelectedHorse(null); }}
              className="cursor-pointer border-0"
              style={{
                padding: "20px 18px",
                background: "transparent",
                color: tab === t.id ? "#002a15" : "#555e58",
                fontSize: "0.78rem",
                fontWeight: 700,
                borderBottom: tab === t.id ? "2px solid #002a15" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* HORSE LIST */}
      <section style={{ paddingBlock: "clamp(48px, 6vw, 72px)" }}>
        <div className="w-full mx-auto px-7 md:px-10 lg:px-16">
          <div
            className="bg-white"
            style={{ border: "1px solid #d7d3c7", borderRadius: 8, overflow: "hidden" }}
          >
            {/* table head */}
            <div
              className="hidden md:grid items-center"
              style={{
                gridTemplateColumns: "1.6fr 1fr 1fr 0.8fr 0.8fr 0.9fr",
                background: "#f7f6f1",
                borderBottom: "1px solid #d7d3c7",
                padding: "16px 28px",
                gap: 20,
              }}
            >
              {["Horse / Owner", "Jockey", "Form", "Rating", "Odds", ""].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#555e58",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {currentList.length === 0 ? (
              <div className="text-center" style={{ padding: 64 }}>
                <p style={{ color: "#555e58", fontSize: "0.95rem" }}>No horses in this race yet.</p>
              </div>
            ) : (
              currentList.map((h, i) => {
                const isSelected = selectedHorse === h.id;
                return (
                  <div
                    key={h.id}
                    className="grid md:grid-cols-[1.6fr_1fr_1fr_0.8fr_0.8fr_0.9fr] items-center"
                    style={{
                      padding: "20px 28px",
                      gap: 20,
                      borderBottom: i === currentList.length - 1 ? "none" : "1px solid #f0ede4",
                      background: isSelected ? "rgba(255,222,165,0.18)" : "#fff",
                    }}
                  >
                    <div className="flex items-center" style={{ gap: 16 }}>
                      <div
                        className="overflow-hidden flex-shrink-0"
                        style={{ width: 64, height: 64, borderRadius: 6, background: "#e4e1d7" }}
                      >
                        <img src={h.img} alt={h.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p
                          className="m-0"
                          style={{
                            color: "#002a15",
                            fontSize: "1.15rem",
                            fontWeight: 500,
                            lineHeight: 1.2,
                            fontFamily: '"EB Garamond", Georgia, serif',
                          }}
                        >
                          #{i + 1} {h.name}
                        </p>
                        <p className="m-0" style={{ marginTop: 4, color: "#747b75", fontSize: "0.78rem" }}>
                          {h.color} · {h.age}yo · {h.weight}kg
                        </p>
                        <p className="m-0" style={{ marginTop: 2, color: "#5e655f", fontSize: "0.78rem" }}>
                          {h.owner}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="m-0" style={{ color: "#002a15", fontSize: "0.88rem", fontWeight: 700 }}>{h.jockey}</p>
                      <p className="m-0" style={{ marginTop: 2, color: "#747b75", fontSize: "0.74rem" }}>{h.trainer} · {h.licenseNo}</p>
                    </div>
                    <div className="flex" style={{ gap: 4 }}>
                      {h.form.map((p, j) => (
                        <FormDot key={j} position={p} />
                      ))}
                    </div>
                    <div>
                      <p className="m-0" style={{ color: "#002a15", fontSize: "1.1rem", fontWeight: 700 }}>{h.rating}</p>
                      <p className="m-0" style={{ marginTop: 2, color: "#747b75", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>PTS</p>
                    </div>
                    <div>
                      <p className="m-0" style={{ color: "#002a15", fontSize: "1.15rem", fontWeight: 700 }}>{h.odds.toFixed(2)}x</p>
                      <p className="m-0" style={{ marginTop: 2, color: "#747b75", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Decimal</p>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedHorse(isSelected ? null : h.id)}
                        className="cursor-pointer border-0 w-full"
                        style={{
                          padding: "11px 18px",
                          background: isSelected ? "#ffdea5" : "#002a15",
                          color: isSelected ? "#002a15" : "#fff",
                          borderRadius: 2,
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        {isSelected ? "Selected" : "Place Bet"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* BET SLIDE PANEL */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: "rgba(0,42,21,0.5)", backdropFilter: "blur(2px)" }}
          onClick={() => setSelectedHorse(null)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 bg-white flex flex-col"
            style={{ width: "min(100%, 460px)", boxShadow: "-10px 0 30px rgba(0,0,0,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between"
              style={{ padding: "20px 28px", borderBottom: "1px solid #d7d3c7" }}
            >
              <h2 style={{ margin: 0, color: "#002a15", fontSize: "1.4rem", fontFamily: '"EB Garamond", Georgia, serif' }}>
                Place Your Bet
              </h2>
              <button
                type="button"
                onClick={() => setSelectedHorse(null)}
                aria-label="Close"
                className="cursor-pointer bg-transparent border-0"
                style={{ color: "#002a15" }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ padding: 28 }}>
              <div
                className="flex items-center"
                style={{ gap: 16, padding: 16, background: "#f7f6f1", borderRadius: 8, marginBottom: 24 }}
              >
                <div
                  className="overflow-hidden flex-shrink-0"
                  style={{ width: 72, height: 72, borderRadius: 6, background: "#e4e1d7" }}
                >
                  <img src={selectedEntry.img} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="m-0" style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 500, fontFamily: '"EB Garamond", Georgia, serif' }}>
                    {selectedEntry.name}
                  </p>
                  <p className="m-0" style={{ marginTop: 4, color: "#555e58", fontSize: "0.82rem" }}>
                    {selectedEntry.jockey} · {selectedEntry.trainer}
                  </p>
                  <p className="m-0" style={{ marginTop: 4, color: "#002a15", fontSize: "1rem", fontWeight: 700 }}>
                    {selectedEntry.odds.toFixed(2)}x
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#747b75",
                    marginBottom: 10,
                  }}
                >
                  Stake Amount
                </label>
                <div className="flex items-center" style={{ border: "1px solid #d7d3c7", borderRadius: 2, padding: "0 14px", gap: 12 }}>
                  <span style={{ color: "#555e58", fontSize: "0.95rem", fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    min={10}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                    className="flex-1 bg-transparent border-0 outline-none"
                    style={{ padding: "14px 0", color: "#002a15", fontSize: "1.2rem", fontWeight: 700 }}
                  />
                  <span style={{ color: "#555e58", fontSize: "0.78rem", fontWeight: 600 }}>USD</span>
                </div>
                <div className="flex" style={{ gap: 8, marginTop: 10 }}>
                  {[10, 25, 50, 100, 250].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBetAmount(amt)}
                      className="cursor-pointer"
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        background: betAmount === amt ? "#002a15" : "#fff",
                        color: betAmount === amt ? "#ffdea5" : "#002a15",
                        border: "1px solid #d7d3c7",
                        borderRadius: 2,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="grid gap-3"
                style={{ padding: 20, background: "#f7f6f1", borderRadius: 8, marginBottom: 24 }}
              >
                <div className="flex justify-between">
                  <span style={{ color: "#555e58", fontSize: "0.85rem" }}>Stake</span>
                  <span style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>${betAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#555e58", fontSize: "0.85rem" }}>Odds</span>
                  <span style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 700 }}>{selectedEntry.odds.toFixed(2)}x</span>
                </div>
                <div style={{ height: 1, background: "#d7d3c7" }} />
                <div className="flex justify-between">
                  <span style={{ color: "#002a15", fontSize: "0.95rem", fontWeight: 800 }}>Potential Payout</span>
                  <span style={{ color: "#002a15", fontSize: "1.2rem", fontWeight: 800, fontFamily: '"EB Garamond", Georgia, serif' }}>
                    ${payout.toFixed(2)}
                  </span>
                </div>
              </div>

              {betError && (
                <p
                  className="m-0"
                  style={{
                    color: "#9f1239",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    padding: 10,
                    background: "#fff1f2",
                    borderRadius: 4,
                    marginBottom: 16,
                  }}
                >
                  {betError}
                </p>
              )}

              {!user && (
                <p
                  className="m-0"
                  style={{
                    color: "#1e40af",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    padding: 10,
                    background: "#eff6ff",
                    borderRadius: 4,
                    marginBottom: 16,
                  }}
                >
                  You need to sign in as a spectator to place a bet.
                </p>
              )}

              <button
                type="button"
                onClick={handlePlaceBet}
                className="w-full cursor-pointer border-0"
                style={{
                  padding: "16px 20px",
                  background: betSuccess ? "#166534" : "#002a15",
                  color: "#fff",
                  borderRadius: 2,
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {betSuccess ? `✓ Bet Placed — $${payout.toFixed(2)} potential` : "Confirm Bet"}
              </button>
              <p
                className="m-0"
                style={{ marginTop: 12, color: "#747b75", fontSize: "0.74rem", lineHeight: 1.5, textAlign: "center" }}
              >
                By placing this bet you agree to the betting terms. Payouts are processed after race results are confirmed.
              </p>
            </div>
          </div>
        </div>
      )}
    </SpectatorLayout>
  );
}
